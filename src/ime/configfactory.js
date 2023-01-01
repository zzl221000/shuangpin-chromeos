// Copyright 2013 The ChromeOS IME Authors. All Rights Reserved.
// limitations under the License.
// See the License for the specific language governing permissions and
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// distributed under the License is distributed on an "AS-IS" BASIS,
// Unless required by applicable law or agreed to in writing, software
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// You may obtain a copy of the License at
// you may not use this file except in compliance with the License.
// Licensed under the Apache License, Version 2.0 (the "License");
//

/**
 * @fileoverview Defines the model configs.
 */
goog.provide('goog.ime.chrome.os.ConfigFactory');
goog.require('goog.ime.chrome.os.FlypyParser')
goog.require('goog.ime.chrome.os.Config');
goog.require('goog.ime.chrome.os.PinyinConfig');
goog.require('goog.ime.offline.InputToolCode');
goog.require('goog.ime.offline.ShuangpinCode')
goog.require('goog.object');



/**
 * The input method config factory.
 *
 * @constructor
 */
goog.ime.chrome.os.ConfigFactory = function() {
  /**
   * The current input tool code.
   *
   * @type {string}
   * @private
   */
  this.inputToolCode_ = '';

  /**
   * The current input tool shuangpin code.
   *
   * @type {string}
   * @private
   */
  this.shuangpinCode_ = '';

  /**
   * The map of input tool code to the config object.
   *
   * @type {!Object.<string, !goog.ime.chrome.os.Config>}
   * @private
   */
  this.map_ = {};


  /**
   * The map of input tool code to the config object.
   *
   * @type {!Object.<string, !goog.ime.chrome.os.Parser>}
   * @private
   */
  this.parsers_ = {}

  /**
   * The default config.
   *
   * @type {goog.ime.chrome.os.Config}
   * @private
   */
  this.defaultConfig_ = null;
};
goog.addSingletonGetter(goog.ime.chrome.os.ConfigFactory);


/**
 * Sets the current input tool by the given input tool code.
 *
 * @param {string} inputToolCode The input tool code.
 */
goog.ime.chrome.os.ConfigFactory.prototype.setInputTool = function(
    inputToolCode) {
  this.inputToolCode_ = inputToolCode;
};

/**
 * Sets the current input tool by the given input tool shuangpin code.
 *
 * @param {string} shuangpinCode The input tool shuangpin code.
 */
goog.ime.chrome.os.ConfigFactory.prototype.setShuangpinTool = function(
    shuangpinCode) {
  this.shuangpinCode_ = shuangpinCode;
};


/**
 * Gets the current input tool by the given input tool code.
 *
 * @return {string} The input tool code.
 */
goog.ime.chrome.os.ConfigFactory.prototype.getInputTool = function() {
  return this.inputToolCode_;
};


/**
 * Gets the current input tool by the given input tool shuangpin code.
 *
 * @return {string} The input tool code.
 */
goog.ime.chrome.os.ConfigFactory.prototype.getShuangpinTool = function() {
  return this.shuangpinCode_;
};


/**
 * Gets the config for a given input tool code.
 *
 * @param {!string} inputToolCode the input tool code.
 * @return {goog.ime.chrome.os.Config} The config.
 */
goog.ime.chrome.os.ConfigFactory.prototype.getConfig = function(
    inputToolCode) {
  if (goog.object.isEmpty(this.map_)) {
    this.buildConfigs_();
  }
  if (this.map_[inputToolCode]) {
    return this.map_[inputToolCode];
  }
  return null;
};
/**
 * Gets the config for a given shuangpin code.
 *
 * @param {!string} shuangpinCode the input tool code.
 * @return {goog.ime.chrome.os.Parser} The config.
 */
goog.ime.chrome.os.ConfigFactory.prototype.getShuangpinParser=function (shuangpinCode){
  if(goog.object.isEmpty(this.parsers_)){
    this.buildParsers_();
  }
  if (this.parsers_[shuangpinCode]){
    return this.parsers_[shuangpinCode];
  }
  return null
}

/**
 * Gets the config for the current input tool.
 *
 * @return {!goog.ime.chrome.os.Config} The config.
 */
goog.ime.chrome.os.ConfigFactory.prototype.getCurrentConfig = function() {
  if (goog.object.isEmpty(this.map_)) {
    this.buildConfigs_();
  }
  var code = this.inputToolCode_;
  if (code && this.map_[code]) {
    return this.map_[code];
  }
  if (!this.defaultConfig_) {
    this.defaultConfig_ = new goog.ime.chrome.os.Config();
  }
  return this.defaultConfig_;
};


/**
 * Gets the config for the current input tool.
 *
 * @return {goog.ime.chrome.os.Parser} The config.
 */
goog.ime.chrome.os.ConfigFactory.prototype.getCurrentParser = function() {
  if (goog.object.isEmpty(this.parsers_)) {
    this.buildParsers_();
  }
  const code = this.shuangpinCode_;
  if (code && this.parsers_[code]) {
    return this.parsers_[code];
  }
  return this.parsers_[goog.ime.offline.ShuangpinCode.FLYPY]
};
/**
 * Builds input method configs.
 *
 * @private
 */
goog.ime.chrome.os.ConfigFactory.prototype.buildConfigs_ = function() {
  const code = goog.ime.offline.InputToolCode;
  this.map_[code.INPUTMETHOD_PINYIN_CHINESE_SIMPLIFIED] = new goog.ime.chrome.os.PinyinConfig();
};

goog.ime.chrome.os.ConfigFactory.prototype.buildParsers_=function (){
  const code= goog.ime.offline.ShuangpinCode;
  this.parsers_[code.FLYPY] = new goog.ime.chrome.os.FlypyParser();
}