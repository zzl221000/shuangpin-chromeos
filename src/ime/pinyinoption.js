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
goog.require('goog.ui.Dialog')
goog.require('goog.ui.Dialog.ButtonSet')
goog.require('goog.ui.Dialog.DefaultButtonKeys')

/**
 * Creates an option page for a given input tool code.
 *
 * @constructor
 * @extends {goog.Disposable}
 */
function PinyinOption() {
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
}

goog.ime.chrome.os.PinyinOption = PinyinOption;
goog.inherits(goog.ime.chrome.os.PinyinOption, goog.Disposable);


/**
 * The checkbox ids on the option page.
 *
 * @enum {string}
 * @private
 */
goog.ime.chrome.os.PinyinOption.ItemIDs_ = {
    SCHEMAS: 'chos_schemas',
    ADD_CUSTOM_SCHEMA: 'chos-add_custom_schema',
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
    ADD_CUSTOM_SCHEMA: chrome.i18n.getMessage('add_custom_schema'),
    FUZZY_PINYIN: chrome.i18n.getMessage('fuzzy_pinyin'),
    USER_DICT: chrome.i18n.getMessage('user_dict'),
    TOP_PAGE: chrome.i18n.getMessage('move_page_key_above'),
    BOTTOM_PAGE: chrome.i18n.getMessage('move_page_key_below'),
    INIT_LANG: chrome.i18n.getMessage('init_lang'),
    INIT_SBC: chrome.i18n.getMessage('init_sbc'),
    INIT_PUNC: chrome.i18n.getMessage('init_punc')
};

goog.ime.chrome.os.PinyinOption.CustomSchema_ = {
    MODE_NAMES: ['固定零声母', '韵母的第一个声母', '韵母的第一个声母（两个字母的韵母为全拼）'],
    INITIAL_KEYS: Array.from(';AEIOUV'),//Array.from(';ABCDEFGHIJKLMNOPQRSTUVWXYZ')
    FINALS_KEYS: Array.from(';ABCDEFGHIJKLMNOPQRSTUVWXYZ'),
    SYLLABLES: ['ch',
        'sh',
        'zh',
        'ai',
        'an',
        'ang',
        'ao',
        'ei',
        'en',
        'eng',
        'er',
        'ia',
        'ian',
        'iang',
        'iao',
        'ie',
        'in',
        'ing',
        'iong',
        'iu',
        'ong',
        'ou',
        'ua',
        'uai',
        'uan',
        'uang',
        'ue',
        'ui',
        'un',
        'uo',
        'v',
        've',
    ]
}

/**
 * The CSS class names.
 *
 * @enum {string}
 * @private
 */
goog.ime.chrome.os.PinyinOption.ClassNames_ = {
    MAIN: 'chos-main',
    SCHEMAS: 'chos-schemas',
    ADD_CUSTOM_SCHEMA: 'chos-add-custom-schema-div',
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
    const addCustomSchema = this.createAddCustomSchema_(OPTION.ItemIDs_.ADD_CUSTOM_SCHEMA, OPTION.ItemLabels_.ADD_CUSTOM_SCHEMA)
    const dialogLabel = goog.dom.createDom(goog.dom.TagName.LABEL)
    dialogLabel.appendChild(goog.dom.createTextNode('交互模式添加双拼方案: '))
    selectionDiv.appendChild(dialogLabel)
    selectionDiv.appendChild(this.createAddSchemaDialog_(OPTION.CustomSchema_.MODE_NAMES, OPTION.CustomSchema_.INITIAL_KEYS, OPTION.CustomSchema_.FINALS_KEYS, OPTION.CustomSchema_.SYLLABLES))
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
    labelNode.appendChild(goog.dom.createTextNode(label + ": "));
    const selectDiv = goog.dom.createDom(goog.dom.TagName.DIV, {
        'class': goog.ime.chrome.os.PinyinOption.ClassNames_.SELECT_ITEM
    });
    selectDiv.append(labelNode)
    selectDiv.append(select)
    this.eventHandler_.listen(select, goog.events.EventType.CHANGE,
        goog.bind(this.saveSettings, this));
    return selectDiv
}
goog.ime.chrome.os.PinyinOption.prototype.createAddSchemaDialog_ = function (mode_names, initial_keys, finals_keys, syllables) {
    const button = goog.dom.createDom(goog.dom.TagName.BUTTON)
    button.appendChild(goog.dom.createTextNode('添加自定义双拼'))
    const dlg = new goog.ui.Dialog()
    dlg.setTitle('添加自定义双拼')


    // const okButton=bts.getButton(bts.getDefault())
    const dlgContent = dlg.getContentElement()
    const nameDiv = goog.dom.createDom(goog.dom.TagName.DIV)
    const nameInput = goog.dom.createDom(goog.dom.TagName.INPUT, {
        'type': 'text',
        'id': 'gld-name',
        'name': 'gld-name',
    })
    const nameLabel = goog.dom.createDom(goog.dom.TagName.LABEL, {
        'for': 'gld-name'
    })
    nameLabel.appendChild(goog.dom.createTextNode('方案名称: '))
    nameDiv.appendChild(nameLabel)
    nameDiv.appendChild(nameInput)
    dlgContent.appendChild(nameDiv)
    const modeDiv = goog.dom.createDom(goog.dom.TagName.DIV)
    const modeSelect = goog.dom.createDom(goog.dom.TagName.SELECT, {id: 'gld-mode'})
    for (let i = 0; i < 3; i++) {
        const opt = goog.dom.createDom(goog.dom.TagName.OPTION, {
            value: i
        })
        opt.appendChild(goog.dom.createTextNode(mode_names[i]))
        modeSelect.appendChild(opt)
    }
    const modeLabel = goog.dom.createDom(goog.dom.TagName.LABEL, {
        'for': 'gld-mode'
    })
    modeLabel.appendChild(goog.dom.createTextNode('零声母模式: '))
    modeDiv.appendChild(modeLabel)
    modeDiv.appendChild(modeSelect)
    dlgContent.appendChild(modeDiv)
    const zeroInitialDiv = goog.dom.createDom(goog.dom.TagName.DIV)
    const zeroInitialSelect = goog.dom.createDom(goog.dom.TagName.SELECT, {id: 'gld-zero-initial'})
    const zeroInitialLabel = goog.dom.createDom(goog.dom.TagName.LABEL, {
        'for': 'gld-zero-initial'
    })
    zeroInitialLabel.appendChild(goog.dom.createTextNode('零声母: '))
    const nonZeroInitialOpt = goog.dom.createDom(goog.dom.TagName.OPTION, {
        value: '^'
    })
    nonZeroInitialOpt.appendChild(goog.dom.createTextNode('（无）'))
    zeroInitialSelect.appendChild(nonZeroInitialOpt)
    initial_keys.forEach((k) => {
        const ziopt = goog.dom.createDom(goog.dom.TagName.OPTION, {
            value: k
        })
        ziopt.appendChild(goog.dom.createTextNode(k))
        zeroInitialSelect.appendChild(ziopt)
    })
    zeroInitialDiv.appendChild(zeroInitialLabel)
    zeroInitialDiv.appendChild(zeroInitialSelect)
    dlgContent.appendChild(zeroInitialDiv)
    let tmpMapping = {}
    const syllablesDiv = goog.dom.createDom(goog.dom.TagName.DIV)
    const syllablesSelect = goog.dom.createDom(goog.dom.TagName.SELECT, {id: 'gld-syllables'})
    const syllablesLabel = goog.dom.createDom(goog.dom.TagName.LABEL, {
        'for': 'gld-syllables'
    })
    syllablesLabel.appendChild(goog.dom.createTextNode('自定义按键: 音节 '))

    const keysSelect = goog.dom.createDom(goog.dom.TagName.SELECT, {id: 'gld-keys'})
    const keysLabel = goog.dom.createDom(goog.dom.TagName.LABEL, {
        'for': 'gld-keys'
    })
    keysLabel.appendChild(goog.dom.createTextNode('→ 按键 '))
    const nonSyllableOpt = goog.dom.createDom(goog.dom.TagName.OPTION, {
        value: '^'
    })
    nonSyllableOpt.appendChild(goog.dom.createTextNode('-'))
    syllablesSelect.appendChild(nonSyllableOpt)
    syllables.forEach(e => {
        const opt = goog.dom.createDom(goog.dom.TagName.OPTION, {
            value: e
        })
        opt.appendChild(goog.dom.createTextNode(e))
        syllablesSelect.appendChild(opt)
    })
    goog.events.listen(syllablesSelect, goog.events.EventType.CHANGE, e => {
        console.log('syllablesSelect changed')
        const value = e.target.value

        keysSelect.innerHTML = ''
        const opt = goog.dom.createDom(goog.dom.TagName.OPTION, {value: '^'})
        opt.appendChild(goog.dom.createTextNode('-'))
        keysSelect.appendChild(opt)
        if (value === '^') {
            return
        }

        const loop_keys = value === 'sh' || value === 'ch' || value === 'zh' ? initial_keys : finals_keys

        loop_keys.forEach(k => {
            const opt = goog.dom.createDom(goog.dom.TagName.OPTION, {value: k})
            opt.appendChild(goog.dom.createTextNode(k))
            keysSelect.appendChild(opt)
        })
    })
    const showMapping = goog.dom.createDom(goog.dom.TagName.DIV)

    syllablesDiv.appendChild(syllablesLabel)
    syllablesDiv.appendChild(syllablesSelect)
    syllablesDiv.appendChild(keysLabel)
    syllablesDiv.appendChild(keysSelect)
    dlgContent.appendChild(syllablesDiv)
    dlgContent.appendChild(showMapping)

    let keyboard_mapping = {
        q: [0, 1],
        w: [0, 2],
        e: [0, 3],
        r: [0, 4],
        t: [0, 5],
        y: [0, 6],
        u: [0, 7],
        i: [0, 8],
        o: [0, 9],
        p: [0, 10],
        a: [1, 1],
        s: [1, 2],
        d: [1, 3],
        f: [1, 4],
        g: [1, 5],
        h: [1, 6],
        j: [1, 7],
        k: [1, 8],
        l: [1, 9],
        ';': [1, 10],
        z: [2, 1],
        x: [2, 2],
        c: [2, 3],
        v: [2, 4],
        b: [2, 5],
        n: [2, 6],
        m: [2, 7],
    }
    let keyboard_word = [["{tab}", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", ""], ["{lock}", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";"], ["{shift}", "z", "x", "c", "v", "b", "n", "m", "{blank}"]]
    let Keyboard;
    let keyboardInstance;
    if (window.SimpleKeyboard) {
        Keyboard = window.SimpleKeyboard.default
        const keyboard = goog.dom.createDom(goog.dom.TagName.DIV, {
            class: 'simple-keyboard'
        })
        dlgContent.appendChild(keyboard)
        keyboardInstance = new Keyboard(
            {
                layout: {
                    default: [
                        '{tab} q w e r t y u i o p ',
                        '{lock} a s d f g h j k l ;',
                        '{shift} z x c v b n m {blank}'
                    ]
                },
                display: {
                    '{small}': ' ',
                    '{blank}': '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp',
                    '{tab}': 'tab',
                    '{lock}': 'caps',
                    '{shift}': '&nbsp&nbsp&nbspshift&nbsp&nbsp&nbsp',

                }
            }
        )
    }
    goog.events.listen(keysSelect, goog.events.EventType.CHANGE, e => {
        const syllable = syllablesSelect.value
        if (syllable === '^') return;

        if (tmpMapping[syllable]){
            const [row,col]=keyboard_mapping[tmpMapping[syllable].toLowerCase()]
            keyboard_word[row][col]=tmpMapping[syllable]
        }
        if (e.target.value!=='^'){
            tmpMapping[syllable] = e.target.value
        }else {
            delete tmpMapping[syllable]
        }
        if (!keyboardInstance) {
            showMapping.innerHTML = syllables.map(s => {
                const k = tmpMapping[s] || '^'
                return `${s}->${k}`
            }).join("; ")
        } else {
            keyboardInstance.dispatch(inst => {
                    const {finals, initials} = Object.keys(tmpMapping).reduce((group, curr) => {
                        if (curr === 'sh' || curr === 'ch' || curr === 'zh') {
                            group.initials[tmpMapping[curr].toLowerCase()] = curr
                        } else {
                            if (!group.finals[tmpMapping[curr].toLowerCase()]) {
                                group.finals[tmpMapping[curr].toLowerCase()] = []
                            }
                            group.finals[tmpMapping[curr].toLowerCase()].push(curr)
                        }
                        return group
                    }, {finals: {}, initials: {}})
                    Object.keys(initials).map(k => {
                        const [row, col] = keyboard_mapping[k]
                        keyboard_word[row][col] = `${k}\n${initials[k]}<br>`
                    })
                    Object.keys(finals).map(k => {
                        const [row, col] = keyboard_mapping[k]
                        if (!initials[k]) {
                            keyboard_word[row][col] = `${k}<br>`
                        }
                        finals[k].forEach(f => {
                            keyboard_word[row][col] += `\n<i>${f}`
                        })
                    })
                    inst.setOptions(
                        {
                            layout: {
                                default: keyboard_word.map(line => line.join(' '))
                            }
                        }
                    )

                }
            )
        }

    })

    goog.events.listen(button, goog.events.EventType.CLICK, e => {
        dlg.setVisible(true)
        const okButton = dlg.getButtonSet().getButton('ok')
        goog.events.listen(okButton, goog.events.EventType.CLICK, e2 => {
            e2.preventDefault()
            e2.stopPropagation()
            const name = nameInput.value
            const mode = modeSelect.value
            const zeroInitial = zeroInitialSelect.value.toLowerCase()
            const keymapping = syllables.map(s => tmpMapping[s] || '^').map(s => s.toLowerCase()).join('')
            if (!name) {
                console.log('方案名称为空')
                return
            }

            if (mode === '0' && (!zeroInitial || zeroInitial === '^')) {
                console.log('固定声母模式需要选择声母')
                return;
            }
            if (localStorage) {
                localStorage.setItem(`schema_${name}`, [name, mode, zeroInitial, keymapping].join('*'))
                console.log('保存成功');
            }
            nameInput.value = ''
            modeSelect.value = 0
            zeroInitialSelect.value = '^'
            tmpMapping = {}
            dlg.setVisible(false)

        })
    })
    return button


}
goog.ime.chrome.os.PinyinOption.prototype.createAddCustomSchema_ = function (id, label) {
    const input = goog.dom.createDom('input', {
        'type': 'text',
        'id': id,
        'name': id,
    })
    const labelNode = goog.dom.createDom('label', {
        'for': id
    });
    labelNode.appendChild(goog.dom.createTextNode(label + ': '));
    const inputDiv = goog.dom.createDom(goog.dom.TagName.DIV, {
        'class': goog.ime.chrome.os.PinyinOption.ClassNames_.SELECT_ITEM
    });
    inputDiv.appendChild(labelNode)
    inputDiv.appendChild(input)
    const button = goog.dom.createDom('button')
    goog.events.listen(
        button,
        goog.events.EventType.CLICK,
        e => {
            const [name, mode, zeroInitial, keymapping] = input.value.split('*')
            if (keymapping && keymapping.length !== 32) {
                return
            }
            if (mode === '0' && (!zeroInitial || zeroInitial === '^')) {
                return;
            }
            localStorage.setItem(`schema_${name}`, input.value)
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
    const schemas = goog.dom.getElement(ItemIDs_.SCHEMAS)
    const schema = schemas.value
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


/** @override */
goog.ime.chrome.os.PinyinOption.prototype.disposeInternal = function () {
    goog.dispose(this.eventHandler_);
    PinyinOption.base(this, 'disposeInternal');
};


(function () {
    new goog.ime.chrome.os.PinyinOption();
})();
