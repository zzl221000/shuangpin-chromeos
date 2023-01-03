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
 * @fileoverview The script for pinyin option pages.
 */

goog.provide('goog.ime.chrome.os.PinyinOption');

goog.require('goog.Disposable');
goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.events');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventType');
goog.require('goog.ime.chrome.os.LocalStorageHandlerFactory');
goog.require('goog.ime.offline.InputToolCode');
goog.require('goog.object');
goog.require('goog.events.EventTarget');
goog.require('goog.debug.ErrorHandler');
goog.require('goog.events.EventLike');
goog.require('goog.events.EventWrapper');
/**
 * Creates an option page for a given input tool code.
 *
 * @constructor
 * @extends {goog.Disposable}
 */
goog.ime.chrome.os.PinyinOption = function () {
    /**
     * The event handler.
     *
     * @type {!goog.events.EventHandler}
     * @private
     */
    this.eventHandler_ = new goog.events.EventHandler(this);

    /**
     * The local storage handler.
     *
     * @type {goog.ime.chrome.os.LocalStorageHandler}
     * @private
     */
    this.localStorageHandler_ =
        /** @type {goog.ime.chrome.os.PinyinLocalStorageHandler} */ (
        goog.ime.chrome.os.LocalStorageHandlerFactory.getInstance().getLocalStorageHandler(
            goog.ime.offline.InputToolCode.INPUTMETHOD_PINYIN_CHINESE_SIMPLIFIED));

    this.init_();
    goog.events.listenOnce(window, goog.events.EventType.UNLOAD,
        goog.bind(this.dispose, this));
};
goog.inherits(goog.ime.chrome.os.PinyinOption, goog.Disposable);


/**
 * The checkbox ids on the option page.
 *
 * @enum {string}
 * @private
 */
goog.ime.chrome.os.PinyinOption.ItemIDs_ = {
    SCHEMAS: 'chos_schemas',
    ADD_CUSTOM_SCHEMA:'chos-add_custom_schema',
    FUZZY_PINYIN: 'chos_fuzzy_pinyin_selection',
    USER_DICT: 'chos_user_dict_selection',
    TOP_PAGE: 'chos_top_page_selection',
    BOTTOM_PAGE: 'chos_bottom_page_selection',
    INIT_LANG: 'chos_init_lang_selection',
    INIT_SBC: 'chos_init_sbc_selection',
    INIT_PUNC: 'chos_init_punc_selection',
    FUZZY_ITEM_PREFIX: 'chos_fuzzy_expansion_'
};


/**
 * The descriptions used in the option page.
 *
 * @enum {string}
 * @private
 */
goog.ime.chrome.os.PinyinOption.ItemLabels_ = {
    TITLE: chrome.i18n.getMessage('pinyin_setting_page'),
    SCHEMAS: chrome.i18n.getMessage('schemas'),
    ADD_CUSTOM_SCHEMA:chrome.i18n.getMessage('add_custom_schema'),
    FUZZY_PINYIN: chrome.i18n.getMessage('fuzzy_pinyin'),
    USER_DICT: chrome.i18n.getMessage('user_dict'),
    TOP_PAGE: chrome.i18n.getMessage('move_page_key_above'),
    BOTTOM_PAGE: chrome.i18n.getMessage('move_page_key_below'),
    INIT_LANG: chrome.i18n.getMessage('init_lang'),
    INIT_SBC: chrome.i18n.getMessage('init_sbc'),
    INIT_PUNC: chrome.i18n.getMessage('init_punc')
};


/**
 * The CSS class names.
 *
 * @enum {string}
 * @private
 */
goog.ime.chrome.os.PinyinOption.ClassNames_ = {
    MAIN: 'chos-main',
    SCHEMAS: 'chos-schemas',
    ADD_CUSTOM_SCHEMA:'chos-add-custom-schema-div',
    TITLE: 'chos-title',
    SELECTS: 'chos-select-div',
    SELECT_ITEM: 'chos-select-item',
    FUZZY_DIV: 'chos-fuzzy-div',
    FUZZY_DIV_LEFT: 'chos-fuzzy-div-left',
    FUZZY_DIV_RIGHT: 'chos-fuzzy-div-right'
};


/**
 * Initialize the option page.
 *
 * @private
 */
goog.ime.chrome.os.PinyinOption.prototype.init_ = function () {
    const OPTION = goog.ime.chrome.os.PinyinOption;
    // The title.
    const title = goog.dom.createDom(goog.dom.TagName.H2, {
        'class': OPTION.ClassNames_.TITLE
    });
    title.appendChild(goog.dom.createTextNode(OPTION.ItemLabels_.TITLE));

    // The div contains the selection items.
    const selectionDiv = goog.dom.createDom(goog.dom.TagName.DIV, {
        'class': OPTION.ClassNames_.SELECTS
    });

    const fuzzyPinyinEnabled = this.localStorageHandler_.getFuzzyPinyinEnabled();
    const fuzzyPinyinItem = this.createSelectItem_(
        OPTION.ItemIDs_.FUZZY_PINYIN,
        OPTION.ItemLabels_.FUZZY_PINYIN,
        fuzzyPinyinEnabled);
    this.eventHandler_.listen(fuzzyPinyinItem, goog.events.EventType.CHANGE,
        goog.bind(this.updateFuzzyPinyin, this));

    const fuzzyExpansions = this.localStorageHandler_.getFuzzyExpansions();
    const fuzzyExpansionDiv = this.createFuzzyExpansionDiv_(
        fuzzyExpansions, fuzzyPinyinEnabled);

    const userDictEnabled = this.localStorageHandler_.getUserDictEnabled();
    const userDictItem = this.createSelectItem_(
        OPTION.ItemIDs_.USER_DICT,
        OPTION.ItemLabels_.USER_DICT,
        userDictEnabled);

    const topPageEnabled = this.localStorageHandler_.getTopPageEnabled();
    const topPageItem = this.createSelectItem_(
        OPTION.ItemIDs_.TOP_PAGE,
        OPTION.ItemLabels_.TOP_PAGE,
        topPageEnabled);

    const bottomPageEnabled = this.localStorageHandler_.getBottomPageEnabled();
    const bottomPageItem = this.createSelectItem_(
        OPTION.ItemIDs_.BOTTOM_PAGE,
        OPTION.ItemLabels_.BOTTOM_PAGE,
        bottomPageEnabled);

    const initLang = this.localStorageHandler_.getInitLang();
    const initLangItem = this.createSelectItem_(
        OPTION.ItemIDs_.INIT_LANG,
        OPTION.ItemLabels_.INIT_LANG,
        initLang);

    const initSBC = this.localStorageHandler_.getInitSBC();
    const initSBCItem = this.createSelectItem_(
        OPTION.ItemIDs_.INIT_SBC,
        OPTION.ItemLabels_.INIT_SBC,
        initSBC);

    const initPunc = this.localStorageHandler_.getInitPunc();
    const initPuncItem = this.createSelectItem_(
        OPTION.ItemIDs_.INIT_PUNC,
        OPTION.ItemLabels_.INIT_PUNC,
        initPunc);

    const schemas = this.localStorageHandler_.getSchemas();
    const currentSchema = this.localStorageHandler_.getCurrentSchema();
    const schemasItem = this.createSchemasDiv_(OPTION.ItemIDs_.SCHEMAS, OPTION.ItemLabels_.SCHEMAS, schemas, currentSchema)
    const addCustomSchema=this.createAddCustomSchema_(OPTION.ItemIDs_.ADD_CUSTOM_SCHEMA,OPTION.ItemLabels_.ADD_CUSTOM_SCHEMA)
    selectionDiv.appendChild(addCustomSchema)
    selectionDiv.appendChild(schemasItem);
    selectionDiv.appendChild(fuzzyPinyinItem);
    selectionDiv.appendChild(fuzzyExpansionDiv);
    selectionDiv.appendChild(userDictItem);
    selectionDiv.appendChild(topPageItem);
    selectionDiv.appendChild(bottomPageItem);
    selectionDiv.appendChild(initLangItem);
    selectionDiv.appendChild(initSBCItem);
    selectionDiv.appendChild(initPuncItem);

    const mainDiv = goog.dom.createDom(goog.dom.TagName.DIV, {
        'class': OPTION.ClassNames_.MAIN
    });
    mainDiv.appendChild(title);


    mainDiv.appendChild(selectionDiv);

    document.body.appendChild(mainDiv);
};

goog.ime.chrome.os.PinyinOption.prototype.createSchemasDiv_ = function (id, label, schemas, currentSchemas) {
    const select = goog.dom.createDom('select', {
        'id': id,
    })
    const selected = schemas.indexOf(currentSchemas)
    schemas.forEach((s, idx) => {
        const attrs = idx === selected ? {
            value: s,
            selected: true
        } : {value: s,}
        const options = select.appendChild(goog.dom.createDom('option', attrs))
        options.appendChild(goog.dom.createTextNode(s))
        select.appendChild(options)
    })
    const labelNode = goog.dom.createDom('label', {
        'for': id
    });
    labelNode.appendChild(goog.dom.createTextNode(label+": "));
    const selectDiv = goog.dom.createDom(goog.dom.TagName.DIV, {
        'class': goog.ime.chrome.os.PinyinOption.ClassNames_.SELECT_ITEM
    });
    selectDiv.append(labelNode)
    selectDiv.append(select)
    this.eventHandler_.listen(select, goog.events.EventType.CHANGE,
        goog.bind(this.saveSettings, this));
    return selectDiv
}

goog.ime.chrome.os.PinyinOption.prototype.createAddCustomSchema_=function (id,label){
    const input=goog.dom.createDom('input',{
        'type': 'text',
        'id': id,
        'name':id,
    })
    const labelNode = goog.dom.createDom('label', {
        'for': id
    });
    labelNode.appendChild(goog.dom.createTextNode(label+': '));
    const inputDiv = goog.dom.createDom(goog.dom.TagName.DIV, {
        'class': goog.ime.chrome.os.PinyinOption.ClassNames_.SELECT_ITEM
    });
    inputDiv.appendChild(labelNode)
    inputDiv.appendChild(input)
    const button=goog.dom.createDom('button')
    goog.events.listen(
        input,
        'click',
        e=>{
            const [name, mode, zeroInitial, keymapping]=input.value.split('*')
            if (keymapping.length!==32){
                return
            }
            if (mode===0 && (!zeroInitial||zeroInitial==='^')){
                return;
            }
            localStorage.setItem(`schema_${name}`,input.value)
        }
    );
    button.appendChild(goog.dom.createTextNode('添加'))
    inputDiv.appendChild(button)
    return inputDiv
}
/**
 * Creates a select item.
 *
 * @param {string} id The item id.
 * @param {string} label The item label.
 * @param {boolean} value Whether the item is checked.
 * @param {boolean=} opt_disabled Whether the item is disabled.
 * @return {!Element} The div contains the checkbox and label.
 * @private
 */
goog.ime.chrome.os.PinyinOption.prototype.createSelectItem_ = function (
    id, label, value, opt_disabled) {
    const checkbox = goog.dom.createDom('input', {
        'type': 'checkbox',
        'id': id,
        'checked': value,
        'disabled': opt_disabled
    });
    const labelNode = goog.dom.createDom('label', {
        'for': id
    });
    labelNode.appendChild(goog.dom.createTextNode(label));

    const checkboxDiv = goog.dom.createDom(goog.dom.TagName.DIV, {
        'class': goog.ime.chrome.os.PinyinOption.ClassNames_.SELECT_ITEM
    });
    checkboxDiv.appendChild(checkbox);
    checkboxDiv.appendChild(labelNode);

    this.eventHandler_.listen(checkbox, goog.events.EventType.CHANGE,
        goog.bind(this.saveSettings, this));
    return checkboxDiv;
};


/**
 * Creates the fuzzy expansions div.
 *
 * @param {Object.<string, boolean>} fuzzyExpansions The fuzzy expansions.
 * @param {boolean} enabled Whether the fuzzy pinyin is enabled.
 * @return {!Element} The div contains all the checkbox for fuzzy expansions.
 * @private
 */
goog.ime.chrome.os.PinyinOption.prototype.createFuzzyExpansionDiv_ =
    function (fuzzyExpansions, enabled) {
        var OPTION = goog.ime.chrome.os.PinyinOption;
        var expansionDiv = goog.dom.createDom(goog.dom.TagName.DIV, {
            'class': OPTION.ClassNames_.FUZZY_DIV
        });
        var leftRightDivs = [
            goog.dom.createDom(goog.dom.TagName.DIV, {
                'class': OPTION.ClassNames_.FUZZY_DIV_LEFT
            }),
            goog.dom.createDom(goog.dom.TagName.DIV, {
                'class': OPTION.ClassNames_.FUZZY_DIV_RIGHT
            })];

        var index = 0;
        for (var fuzzyPair in fuzzyExpansions) {
            var selected = fuzzyExpansions[fuzzyPair];
            if (selected == undefined) {
                selected = enabled;
            }

            var fuzzyPairLabel = fuzzyPair.split('_').join(':');
            var selectItem = this.createSelectItem_(
                OPTION.ItemIDs_.FUZZY_ITEM_PREFIX + fuzzyPair,
                fuzzyPairLabel, selected && enabled, !enabled);

            leftRightDivs[index].appendChild(selectItem);
            index = (index + 1) % 2;
        }

        goog.dom.append(expansionDiv, leftRightDivs);
        return expansionDiv;
    };


/**
 * Enables/Disable fuzzy pinyin.
 */
goog.ime.chrome.os.PinyinOption.prototype.updateFuzzyPinyin = function () {
    var enabled = goog.dom.getElement(
        goog.ime.chrome.os.PinyinOption.ItemIDs_.FUZZY_PINYIN).checked;
    var fuzzyExpansions = this.localStorageHandler_.getFuzzyExpansions();
    for (var fuzzyPair in fuzzyExpansions) {
        var selected = fuzzyExpansions[fuzzyPair];
        if (selected == undefined) {
            selected = enabled;
        }
        var selectItem = goog.dom.getElement(
            goog.ime.chrome.os.PinyinOption.ItemIDs_.FUZZY_ITEM_PREFIX +
            fuzzyPair);
        goog.dom.setProperties(selectItem, {
            'checked': selected && enabled,
            'disabled': !enabled
        });
    }
};


/**
 * Saves the setting page to localstorage, input method config and nacl
 * decoder.
 */
goog.ime.chrome.os.PinyinOption.prototype.saveSettings = function () {
    var ItemIDs_ = goog.ime.chrome.os.PinyinOption.ItemIDs_;

    var fuzzyPinyinEnabled = goog.dom.getElement(ItemIDs_.FUZZY_PINYIN).checked;
    this.localStorageHandler_.setFuzzyPinyinEnabled(fuzzyPinyinEnabled);

    var userDictEnabled = goog.dom.getElement(ItemIDs_.USER_DICT).checked;
    this.localStorageHandler_.setUserDictEnabled(userDictEnabled);

    var topPageEnabled = goog.dom.getElement(ItemIDs_.TOP_PAGE).checked;
    this.localStorageHandler_.setTopPageEnabled(topPageEnabled);

    var bottomPageEnabled = goog.dom.getElement(ItemIDs_.BOTTOM_PAGE).checked;
    this.localStorageHandler_.setBottomPageEnabled(bottomPageEnabled);

    var initLangEnabled = goog.dom.getElement(ItemIDs_.INIT_LANG).checked;
    this.localStorageHandler_.setInitLang(initLangEnabled);

    var initSBCEnabled = goog.dom.getElement(ItemIDs_.INIT_SBC).checked;
    this.localStorageHandler_.setInitSBC(initSBCEnabled);

    var initPuncEnabled = goog.dom.getElement(ItemIDs_.INIT_PUNC).checked;
    this.localStorageHandler_.setInitPunc(initPuncEnabled);
    const schemas=goog.dom.getElement(ItemIDs_.SCHEMAS)
    const idx=schemas.selectedIndex
    const schema=schemas[idx].value
    this.localStorageHandler_.setCurrentSchema(schema)
    if (fuzzyPinyinEnabled) {
        var fuzzyExpansions = this.localStorageHandler_.getFuzzyExpansions();
        for (var fuzzyPair in fuzzyExpansions) {
            var selected = goog.dom.getElement(
                ItemIDs_.FUZZY_ITEM_PREFIX + fuzzyPair).checked;
            fuzzyExpansions[fuzzyPair] = selected;
        }
        this.localStorageHandler_.setFuzzyExpansions(fuzzyExpansions);
    }

    chrome.extension.sendRequest(goog.object.create(
        'update',
        goog.ime.offline.InputToolCode.INPUTMETHOD_PINYIN_CHINESE_SIMPLIFIED));
};

function disposeInternal() {
    goog.dispose(this.eventHandler_);
    disposeInternal.base(this, 'disposeInternal');
}

/** @override */
goog.ime.chrome.os.PinyinOption.prototype.disposeInternal = disposeInternal;


(function () {
    new goog.ime.chrome.os.PinyinOption();
})();
