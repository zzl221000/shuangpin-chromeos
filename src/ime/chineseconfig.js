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
 * @fileoverview Defines the chinese model configs.
 */
goog.provide('goog.ime.chrome.os.ChineseConfig');

goog.require('goog.ime.chrome.os.Config');
goog.require('goog.ime.chrome.os.Key');
goog.require('goog.ime.chrome.os.Modifier');
goog.require('goog.ime.chrome.os.State');
goog.require('goog.ime.chrome.os.StateID');


function ChineseConfig() {
  ChineseConfig.base(this,'constructor');
  /**
   * The punctuation sbc map.
   *
   * @type {!Object.<string, string|!Array>}
   * @protected
   */
  this.puncMap = {
    '~': '～',
    '!': '！',
    '@': '＠',
    '#': '＃',
    '$': '￥',
    '^': '……',
    '&': '＆',
    '*': '×',
    '(': '（',
    ')': '）',
    '-': '－',
    '_': '——',
    '[': '【',
    ']': '】',
    '{': '｛',
    '}': '｝',
    '\\': '、',
    ';': '；',
    ':': '：',
    '\'': ['‘’', 0],
    '"': ['“”', 0],
    ',': '，',
    '.': '。',
    '<': '《',
    '>': '》',
    '/': '／',
    '?': '？'
  };

  /**
   * The sbc char map.
   *
   * @type {!Object.<string, string>}
   * @protected
   */
  this.sbcMap = {
    '~': '～',
    '!': '！',
    '@': '＠',
    '#': '＃',
    '$': '＄',
    '^': '＾',
    '&': '＆',
    '*': '＊',
    '(': '（',
    ')': '）',
    '-': '－',
    '_': '＿',
    '[': '［',
    ']': '］',
    '{': '｛',
    '}': '｝',
    '\\': '＼',
    '|': '｜',
    ';': '；',
    ':': '：',
    '\'': '＇',
    '"': '＂',
    ',': '，',
    '.': '．',
    '<': '＜',
    '>': '＞',
    '/': '／',
    '?': '？'
  };

  var sbcStr = '０１２３４５６７８９' +
      'ａｂｃｄｅｆｇｈｉｊｋｌｍｎ' +
      'ｏｐｑｒｓｔｕｖｗｘｙｚ' +
      'ＡＢＣＤＥＦＧＨＩＪＫＬＭＮ' +
      'ＯＰＱＲＳＴＵＶＷＸＹＺ';
  for (var i = 0; i < sbcStr.length; ++i) {
    var sbc = sbcStr[i];
    if (i < 10) {
      this.sbcMap[String(i)] = sbc;
    } else if (i < 36) {
      // i - 10 + 'a' -> i + 87.
      this.sbcMap[String.fromCharCode(i + 87)] = sbc;
    } else {
      // i - 10 + 'a' -> i + 29.
      this.sbcMap[String.fromCharCode(i + 29)] = sbc;
    }
  }

  var stateID = goog.ime.chrome.os.StateID;
  var Key = goog.ime.chrome.os.Key;
  var Modifier = goog.ime.chrome.os.Modifier;
  var langState = new goog.ime.chrome.os.State();
  langState.desc = 'Initial input language is Chinese';
  langState.value = true;
  langState.shortcut = [Modifier.SHIFT];

  var sbcState = new goog.ime.chrome.os.State();
  sbcState.desc = 'Initial character width is Full';
  sbcState.value = false;
  sbcState.shortcut = [' ', Modifier.SHIFT];

  var puncState = new goog.ime.chrome.os.State();
  puncState.desc = 'Initial punctuation width is Full';
  puncState.value = true;
  puncState.shortcut = ['\\.', Modifier.CTRL];

  this.states[stateID.LANG] = langState;
  this.states[stateID.SBC] = sbcState;
  this.states[stateID.PUNC] = puncState;
}
/**
 * The input method config.
 *
 * @constructor
 * @extends {goog.ime.chrome.os.Config}
 */
goog.ime.chrome.os.ChineseConfig = ChineseConfig;
goog.inherits(goog.ime.chrome.os.ChineseConfig, goog.ime.chrome.os.Config);


/** @override */
goog.ime.chrome.os.ChineseConfig.prototype.preTransform = function(ch) {

  var stateID = goog.ime.chrome.os.StateID;
  if (!this.states[stateID.LANG] ||
      !this.states[stateID.SBC] ||
      !this.states[stateID.PUNC]) {
    return '';
  }

  if (this.states[stateID.PUNC].value &&
      this.states[stateID.LANG].value) {
    var punc = this.puncMap[ch];
    if (punc) {
      if (punc.length > 1) {
        ch = punc[0].charAt(punc[1]);
        punc[1] ^= 1;
        punc = ch;
      }
      return punc;
    }
  }

  if (this.states[stateID.SBC].value) {
    if (!this.states[stateID.LANG].value || !/[a-z]/i.test(ch)) {
      var sbc = this.sbcMap[ch];
      if (sbc) {
        return sbc;
      }
    }
  }

  return '';
};


/** @override */
goog.ime.chrome.os.ChineseConfig.prototype.postTransform = function(c) {
  var preTrans = this.preTransform(c);
  return preTrans ? preTrans : c;
};
