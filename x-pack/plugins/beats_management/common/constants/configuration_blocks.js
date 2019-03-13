"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var ConfigurationBlockTypes;
(function (ConfigurationBlockTypes) {
    ConfigurationBlockTypes["FilebeatInputs"] = "filebeat.inputs";
    ConfigurationBlockTypes["FilebeatModules"] = "filebeat.modules";
    ConfigurationBlockTypes["MetricbeatModules"] = "metricbeat.modules";
    ConfigurationBlockTypes["Output"] = "output";
    ConfigurationBlockTypes["Processors"] = "processors";
})(ConfigurationBlockTypes = exports.ConfigurationBlockTypes || (exports.ConfigurationBlockTypes = {}));
exports.UNIQUENESS_ENFORCING_TYPES = [ConfigurationBlockTypes.Output];
