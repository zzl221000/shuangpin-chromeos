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
 * @fileoverview Defines the pinyin model configs.
 */
goog.provide('goog.ime.chrome.os.PinyinConfig');

goog.require('goog.ime.chrome.os.ChineseConfig');


function PinyinConfig() {
  PinyinConfig.base(this,'constructor');
  this.punctuationReg = /[^a-z0-9 \r]/i;
  this.editorCharReg = /[a-z';]/;
  this.pageupCharReg = /[=.]/;
  this.pagedownCharReg = /[\-,]/;
}
/**
 * The input method config.
 *
 * @constructor
 * @extends {goog.ime.chrome.os.ChineseConfig}
 */
goog.ime.chrome.os.PinyinConfig = PinyinConfig;
goog.inherits(goog.ime.chrome.os.PinyinConfig,
    goog.ime.chrome.os.ChineseConfig);
