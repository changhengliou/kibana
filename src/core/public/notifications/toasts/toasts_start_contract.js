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
const Rx = tslib_1.__importStar(require("rxjs"));
const normalizeToast = (toastOrTitle) => {
    if (typeof toastOrTitle === 'string') {
        return {
            title: toastOrTitle,
        };
    }
    return toastOrTitle;
};
class ToastsStartContract {
    constructor() {
        this.toasts$ = new Rx.BehaviorSubject([]);
        this.idCounter = 0;
    }
    get$() {
        return this.toasts$.asObservable();
    }
    add(toastOrTitle) {
        const toast = {
            id: String(this.idCounter++),
            ...normalizeToast(toastOrTitle),
        };
        this.toasts$.next([...this.toasts$.getValue(), toast]);
        return toast;
    }
    remove(toast) {
        const list = this.toasts$.getValue();
        const listWithoutToast = list.filter(t => t !== toast);
        if (listWithoutToast.length !== list.length) {
            this.toasts$.next(listWithoutToast);
        }
    }
    addSuccess(toastOrTitle) {
        return this.add({
            color: 'success',
            iconType: 'check',
            ...normalizeToast(toastOrTitle),
        });
    }
    addWarning(toastOrTitle) {
        return this.add({
            color: 'warning',
            iconType: 'help',
            ...normalizeToast(toastOrTitle),
        });
    }
    addDanger(toastOrTitle) {
        return this.add({
            color: 'danger',
            iconType: 'alert',
            ...normalizeToast(toastOrTitle),
        });
    }
}
exports.ToastsStartContract = ToastsStartContract;
