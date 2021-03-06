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

import $ from 'jquery';

export function TileMapTooltipFormatterProvider($compile, $rootScope) {

  const $tooltipScope = $rootScope.$new();
  const $el = $('<div>').html(require('./_tooltip.html'));
  $compile($el)($tooltipScope);

  return function tooltipFormatter(aggConfig, metricAgg, feature) {
    // console.log(feature, metricAgg, aggConfig);
    if (!feature) {
      return '';
    }

    $tooltipScope.details = [
      {
        label: metricAgg.makeLabel(),
        value: metricAgg.fieldFormatter()(feature.properties.value)
      },
      {
        label: '緯度',
        value: feature.geometry.coordinates[1]
      },
      {
        label: '經度',
        value: feature.geometry.coordinates[0]
      }
    ];

    $tooltipScope.$apply();
    // console.log($el.html());
    return $el.html();
  };
}
