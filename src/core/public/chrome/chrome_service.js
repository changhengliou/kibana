"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Url = tslib_1.__importStar(require("url"));
const Rx = tslib_1.__importStar(require("rxjs"));
const operators_1 = require("rxjs/operators");
const IS_COLLAPSED_KEY = 'core.chrome.isCollapsed';
function isEmbedParamInHash() {
    const { query } = Url.parse(String(window.location.hash).slice(1), true);
    return Boolean(query.embed);
}
class ChromeService {
    constructor() {
        this.stop$ = new Rx.ReplaySubject(1);
    }
    start() {
        const FORCE_HIDDEN = isEmbedParamInHash();
        const brand$ = new Rx.BehaviorSubject({});
        const isVisible$ = new Rx.BehaviorSubject(true);
        const isCollapsed$ = new Rx.BehaviorSubject(!!localStorage.getItem(IS_COLLAPSED_KEY));
        const applicationClasses$ = new Rx.BehaviorSubject(new Set());
        return {
            /**
             * Set the brand configuration. Normally the `logo` property will be rendered as the
             * CSS background for the home link in the chrome navigation, but when the page is
             * rendered in a small window the `smallLogo` will be used and rendered at about
             * 45px wide.
             *
             * example:
             *
             *    chrome.setBrand({
             *      logo: 'url(/plugins/app/logo.png) center no-repeat'
             *      smallLogo: 'url(/plugins/app/logo-small.png) center no-repeat'
             *    })
             *
             */
            setBrand: (brand) => {
                brand$.next(Object.freeze({
                    logo: brand.logo,
                    smallLogo: brand.smallLogo,
                }));
            },
            /**
             * Get an observable of the current brand information.
             */
            getBrand$: () => brand$.pipe(operators_1.takeUntil(this.stop$)),
            /**
             * Set the temporary visibility for the chrome. This does nothing if the chrome is hidden
             * by default and should be used to hide the chrome for things like full-screen modes
             * with an exit button.
             */
            setIsVisible: (visibility) => {
                isVisible$.next(visibility);
            },
            /**
             * Get an observable of the current visibility state of the chrome.
             */
            getIsVisible$: () => isVisible$.pipe(operators_1.map(visibility => (FORCE_HIDDEN ? false : visibility)), operators_1.takeUntil(this.stop$)),
            /**
             * Set the collapsed state of the chrome navigation.
             */
            setIsCollapsed: (isCollapsed) => {
                isCollapsed$.next(isCollapsed);
                if (isCollapsed) {
                    localStorage.setItem(IS_COLLAPSED_KEY, 'true');
                }
                else {
                    localStorage.removeItem(IS_COLLAPSED_KEY);
                }
            },
            /**
             * Get an observable of the current collapsed state of the chrome.
             */
            getIsCollapsed$: () => isCollapsed$.pipe(operators_1.takeUntil(this.stop$)),
            /**
             * Add a className that should be set on the application container.
             */
            addApplicationClass: (className) => {
                const update = new Set([...applicationClasses$.getValue()]);
                update.add(className);
                applicationClasses$.next(update);
            },
            /**
             * Remove a className added with `addApplicationClass()`. If className is unknown it is ignored.
             */
            removeApplicationClass: (className) => {
                const update = new Set([...applicationClasses$.getValue()]);
                update.delete(className);
                applicationClasses$.next(update);
            },
            /**
             * Get the current set of classNames that will be set on the application container.
             */
            getApplicationClasses$: () => applicationClasses$.pipe(operators_1.map(set => [...set]), operators_1.takeUntil(this.stop$)),
        };
    }
    stop() {
        this.stop$.next();
    }
}
exports.ChromeService = ChromeService;
