/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */


import React, { Fragment } from 'react';
import OlMap from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import XYZ from 'ol/source/XYZ';
import Overlay from 'ol/Overlay';
import { fromLonLat, toLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Cluster, Vector as VectorSource } from 'ol/source';
import { Circle as CircleStyle, Fill, Stroke, Style, Text } from 'ol/style';
import $ from 'jquery';
import { metadata } from 'ui/metadata';
import 'ol/ol.css';
import './ol_map.css';

const MapStatus = Object.freeze({
  ERROR: Symbol('olmap#error'),
  NORMAL: Symbol('olmap#normal'),
  LOADING: Symbol('olmap#loading')
});

const ErrMsg = () => <div>Error</div>;
export class CustomVisMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = { mapStatus: MapStatus.LOADING };
    this.overlayRef = React.createRef();
    this.contentRef = React.createRef();
    this.closerRef = React.createRef();
    this.olMap = null;
    this.overlay = null;
    this.vectorLayer = null;
    this.retriedHook = null;
    this.loadData = this.loadData.bind(this);
  }

  componentDidMount() {
    // --- config ---
    const esIndex = 'meterevents';
    const esType = '_doc';
    const esMapZoom = 15;
    const esMapCenter = [121.5251781, 25.0484264]; // longtitude, latitude

    const { pathname } = location;
    const appIndex = pathname.indexOf('/app/kibana');
    let ajax = null;
    let proxyPath = '';
    if (appIndex > 0) proxyPath = pathname.substr(0, appIndex);

    this.retriedHook = setInterval(() => {
      if (ajax && ajax.readyState && ajax.readyState !== 4) {
        ajax.abort();
      }
      ajax = $.ajax({
        url: `${proxyPath}/api/console/proxy?path=${esIndex}/${esType}/_search&method=GET`,
        method: 'POST',
        headers: { 'kbn-version': metadata.version }
      }).done(data => {
        clearInterval(this.retriedHook);

        const { hits: coordinates, total } = data.hits;
        const features = new Array(total >= 10000 ? 10000 : total);
        coordinates.forEach((e, i) => {
          const [ lat, long ] = e._source
            .endDeviceEvents[0]
            .transformers[0]
            .coordinate
            .split(',');
          features[i] = new Feature(new Point(fromLonLat([ parseFloat(long), parseFloat(lat) ])));
        });
        const styleCache = {};
        this.vectorLayer = new VectorLayer({
          source: new Cluster({
            distance: 40,
            source: new VectorSource({
              features: features
            })
          }),
          style: function (feature) {
            const size = feature.get('features').length;
            let style = styleCache[size];
            if (!style) {
              style = new Style({
                image: new CircleStyle({
                  radius: 10,
                  stroke: new Stroke({
                    color: '#fff'
                  }),
                  fill: new Fill({
                    color: '#ffca00'
                  })
                }),
                text: new Text({
                  text: size.toString(),
                  fill: new Fill({
                    color: '#fff'
                  })
                })
              });
              styleCache[size] = style;
            }
            return style;
          }
        });

        this.overlay = new Overlay({
          id: 'tooltip',
          element: this.overlayRef.current,
          autoPan: true,
          autoPanAnimation: {
            duration: 250
          }
        });
        const xyz = new XYZ({
          url:
          'https://wmts.nlsc.gov.tw/wmts/EMAP/default/GoogleMapsCompatible/{z}/{y}/{x}'
        });
        this.olMap = new OlMap({
          target: 'ol-map',
          layers: [ new TileLayer({ source: xyz }) ],
          overlays: [this.overlay],
          view: new View({
            center: fromLonLat(esMapCenter),
            zoom: esMapZoom
          })
        });
        xyz.on('tileloadend', () => {
          this.setState({ mapStatus: MapStatus.NORMAL });
        });
        this.olMap.addLayer(this.vectorLayer);
        this.olMap.on('singleclick', evt => {
          const feature = this.olMap.forEachFeatureAtPixel(
            evt.pixel,
            feature => feature
          );
          if (!feature || !feature.get('features')) {
            return;
          }
          const coordinate = evt.coordinate;
          const [lon, lat] = toLonLat(coordinate);
          this.contentRef.current.innerHTML = `
          <div>
            <div>${feature.values_.features.length}</div>
            <p>${parseInt(lon * 100000) / 100000}, ${parseInt(lat * 100000) /
          100000}</p>
            <div>${new Date().toLocaleTimeString()}</div>
            <button style="background-color:#419ce4; border-radius:2px; border:1px solid #ccc; color:#fff; padding:4px 6px;" 
              onclick="(()=>{console.log('YOU CLICKED ON ME;');})();">Click me!</button>
          </div>`;
          this.overlay.setPosition(coordinate);
        });

        window.onresize = () => {
          if (this.olMap) {
            this.olMap.updateSize();
          }
        };

        ['kibana:sidebarOpen', 'kibana:sidebarClose'].forEach(event => {
          window.addEventListener(event, () => {
            if (this.olMap) {
              window.requestAnimationFrame(() => {
                this.olMap.updateSize();
              });
            }
          });
        });

        if (this.closerRef && this.closerRef.current) {
          this.closerRef.current.onclick = () => {
            this.overlay.setPosition(undefined);
            this.closerRef.current.blur();
            return false;
          };
        }
      }).fail(() => {
        this.setState({ mapStatus: MapStatus.ERROR });
      });
    }, 2500);
  }

  componentWillUnmount() {
    ['kibana:sidebarOpen', 'kibana:sidebarClose'].forEach(event => {
      if (window.removeEventListener) {
        window.removeEventListener(event, window);
      }
    });
    window.onresize = null;
    if (this.olMap) {
      this.olMap.setTarget(null);
      this.olMap = null;
      if (this.overlay) this.overlay = null;
      if (this.vectorLayer) this.vectorLayer = null;
    }
  }

  static getDerivedStateFromError() {
    return { mapStatus: MapStatus.ERROR };
  }

  componentDidCatch(error, info) {
    console.log(error, info);
  }

  loadData() {

  }

  render() {
    const { mapStatus } = this.state;
    return mapStatus === MapStatus.ERROR ? <ErrMsg /> : (
      <Fragment>
        <div id="ol-map" style={{ width: '100%', height: '100%' }}/>
        { mapStatus === MapStatus.LOADING ? 'LOADING' : null }
        <div
          id="popup"
          className="ol-popup"
          ref={this.overlayRef}
          style={mapStatus === MapStatus.LOADING ? { display: 'none' } : null}
        >
          <a
            href="#"
            id="popup-closer"
            className="ol-popup-closer"
            ref={this.closerRef}
          />
          <div id="popup-content" ref={this.contentRef} />
        </div>
      </Fragment>
    );
  }
}
