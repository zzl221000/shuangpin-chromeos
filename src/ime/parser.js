goog.provide('goog.ime.chrome.os.Parser');
goog.provide('goog.ime.chrom.os.ShuangpinMode')

goog.ime.chrom.os.ShuangpinMode = {
    CONSTANT_ZERO_INITIAL: 0,
    FIRST_ZERO_INITIAL: 1,
    NO_ZERO_INITIAL: 2
}

/**
 * 双拼流解析器
 *
 * @constructor
 */
goog.ime.chrome.os.Parser = function () {
    /**
     * 允许的拼音组合
     *
     * @type {Set<string>}
     */
    this.allowPinyin = new Set(["a",
        "ai",
        "an",
        "ang",
        "ao",
        "ba",
        "bai",
        "ban",
        "bang",
        "bao",
        "bei",
        "ben",
        "beng",
        "bi",
        "bian",
        "biao",
        "bie",
        "bin",
        "bing",
        "bo",
        "bu",
        "ca",
        "cai",
        "can",
        "cang",
        "cao",
        "ce",
        "cen",
        "ceng",
        "cha",
        "chai",
        "chan",
        "chang",
        "chao",
        "che",
        "chen",
        "cheng",
        "chi",
        "chong",
        "chou",
        "chu",
        "chua",
        "chuai",
        "chuan",
        "chuang",
        "chui",
        "chun",
        "chuo",
        "ci",
        "cong",
        "cou",
        "cu",
        "cuan",
        "cui",
        "cun",
        "cuo",
        "da",
        "dai",
        "dan",
        "dang",
        "dao",
        "de",
        "dei",
        "den",
        "deng",
        "di",
        "dia",
        "dian",
        "diao",
        "die",
        "ding",
        "diu",
        "dong",
        "dou",
        "du",
        "duan",
        "dui",
        "dun",
        "duo",
        "e",
        "ei",
        "en",
        "er",
        "fa",
        "fan",
        "fang",
        "fei",
        "fen",
        "feng",
        "fiao",
        "fo",
        "fou",
        "fu",
        "ga",
        "gai",
        "gan",
        "gang",
        "gao",
        "ge",
        "gei",
        "gen",
        "geng",
        "gong",
        "gou",
        "gu",
        "gua",
        "guai",
        "guan",
        "guang",
        "gui",
        "gun",
        "guo",
        "ha",
        "hai",
        "han",
        "hang",
        "hao",
        "he",
        "hei",
        "hen",
        "heng",
        "hong",
        "hou",
        "hu",
        "hua",
        "huai",
        "huan",
        "huang",
        "hui",
        "hun",
        "huo",
        "ji",
        "jia",
        "jian",
        "jiang",
        "jiao",
        "jie",
        "jin",
        "jing",
        "jiong",
        "jiu",
        "ju",
        "juan",
        "jue",
        "jun",
        "jve",
        "ka",
        "kai",
        "kan",
        "kang",
        "kao",
        "ke",
        "kei",
        "ken",
        "keng",
        "kong",
        "kou",
        "ku",
        "kua",
        "kuai",
        "kuan",
        "kuang",
        "kui",
        "kun",
        "kuo",
        "la",
        "lai",
        "lan",
        "lang",
        "lao",
        "le",
        "lei",
        "leng",
        "li",
        "lia",
        "lian",
        "liang",
        "liao",
        "lie",
        "lin",
        "ling",
        "liu",
        "lo",
        "long",
        "lou",
        "lu",
        "luan",
        "lue",
        "lun",
        "luo",
        "lv",
        "lve",
        "ma",
        "mai",
        "man",
        "mang",
        "mao",
        "me",
        "mei",
        "men",
        "meng",
        "mi",
        "mian",
        "miao",
        "mie",
        "min",
        "ming",
        "miu",
        "mo",
        "mou",
        "mu",
        "na",
        "nai",
        "nan",
        "nang",
        "nao",
        "ne",
        "nei",
        "nen",
        "neng",
        "ni",
        "nian",
        "niang",
        "niao",
        "nie",
        "nin",
        "ning",
        "niu",
        "nong",
        "nou",
        "nu",
        "nuan",
        "nue",
        "nun",
        "nuo",
        "nv",
        "nve",
        "o",
        "ou",
        "pa",
        "pai",
        "pan",
        "pang",
        "pao",
        "pei",
        "pen",
        "peng",
        "pi",
        "pian",
        "piao",
        "pie",
        "pin",
        "ping",
        "po",
        "pou",
        "pu",
        "qi",
        "qia",
        "qian",
        "qiang",
        "qiao",
        "qie",
        "qin",
        "qing",
        "qiong",
        "qiu",
        "qu",
        "quan",
        "que",
        "qun",
        "qve",
        "ran",
        "rang",
        "rao",
        "re",
        "ren",
        "reng",
        "ri",
        "rong",
        "rou",
        "ru",
        "ruan",
        "rui",
        "run",
        "ruo",
        "sa",
        "sai",
        "san",
        "sang",
        "sao",
        "se",
        "sen",
        "seng",
        "sha",
        "shai",
        "shan",
        "shang",
        "shao",
        "she",
        "shei",
        "shen",
        "sheng",
        "shi",
        "shou",
        "shu",
        "shua",
        "shuai",
        "shuan",
        "shuang",
        "shui",
        "shun",
        "shuo",
        "si",
        "song",
        "sou",
        "su",
        "suan",
        "sui",
        "sun",
        "suo",
        "ta",
        "tai",
        "tan",
        "tang",
        "tao",
        "te",
        "teng",
        "ti",
        "tian",
        "tiao",
        "tie",
        "ting",
        "tong",
        "tou",
        "tu",
        "tuan",
        "tui",
        "tun",
        "tuo",
        "wa",
        "wai",
        "wan",
        "wang",
        "wei",
        "wen",
        "weng",
        "wo",
        "wu",
        "xi",
        "xia",
        "xian",
        "xiang",
        "xiao",
        "xie",
        "xin",
        "xing",
        "xiong",
        "xiu",
        "xu",
        "xuan",
        "xue",
        "xun",
        "xve",
        "ya",
        "yan",
        "yang",
        "yao",
        "ye",
        "yi",
        "yin",
        "ying",
        "yo",
        "yong",
        "you",
        "yu",
        "yuan",
        "yue",
        "yun",
        "yve",
        "za",
        "zai",
        "zan",
        "zang",
        "zao",
        "ze",
        "zei",
        "zen",
        "zeng",
        "zha",
        "zhai",
        "zhan",
        "zhang",
        "zhao",
        "zhe",
        "zhei",
        "zhen",
        "zheng",
        "zhi",
        "zhong",
        "zhou",
        "zhu",
        "zhua",
        "zhuai",
        "zhuan",
        "zhuang",
        "zhui",
        "zhun",
        "zhuo",
        "zi",
        "zong",
        "zou",
        "zu",
        "zuan",
        "zui",
        "zun",
        "zuo",])
    /**
     * 音节表
     * @type {string[]}
     */
    this.syllable = ['ch',
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
    /**
     * 按键表
     * @type {Array.<string>}
     */
    this.keys = Array.from(';ABCDEFGHIJKLMNOPQRSTUVWXYZ')

    this.startsWithInitial = new Set(["a", "ai", "an", "ang", "ao", "e", "ei", "en", "er", 'o', 'ou'])
    /**
     * 解析器名称
     * @type {string|null}
     */
    this.name = null
    /**
     * 零声母方案
     * @type {number|null}
     */
    this.mode = null
    /**
     * 零声母
     * @type {string|null}
     */
    this.zeroInitial = null
    /**
     * 双拼映射表
     * @type {Object.<string, string>}
     */
    this.shuangpinMap = {}
};
/**
 * 添加双拼配置
 * @param {string}name
 * @param {number}mode
 * @param {string}zeroInitial
 * @param {string}keymapping
 */
goog.ime.chrome.os.Parser.prototype.addConfig = function (name, mode, zeroInitial, keymapping) {
    if (localStorage) {
        localStorage.setItem(`schema_${name}`, [name, mode, zeroInitial, keymapping].join('*'))
    }
}
/**
 * 配置文件
 * @param {string} configuration
 */
goog.ime.chrome.os.Parser.prototype.config = function (configuration) {
    const [name, mode, zeroInitial, keymappings] = configuration.split('*')
    const kms = Array.from(keymappings)
    if (kms.length !== this.syllable.length) {
        throw `配置的按键映射长度:${kms.length} !== ${this.syllable.length}`
    }
    this.name = name
    this.mode = parseInt(mode)
    if (this.mode === 0) {
        this.zeroInitial = zeroInitial
    }
    for (let py of this.allowPinyin) {
        if (this.startsWithInitial.has(py)) {
            switch (this.mode) {
                case 0:
                    if (py.length === 1) this.shuangpinMap[this.zeroInitial + py] = py
                    else this.shuangpinMap[this.zeroInitial + kms[this.syllable.indexOf(py)]] = py
                    break
                case 1:
                    if (py.length === 1) this.shuangpinMap[py + py] = py
                    else this.shuangpinMap[py.charAt(0) + kms[this.syllable.indexOf(py)]] = py
                    break
                case 2:
                    if (py.length === 1) this.shuangpinMap[py + py] = py
                    else if (py.length === 2) this.shuangpinMap[py] = py
                    else this.shuangpinMap[py.charAt(0) + kms[this.syllable.indexOf(py)]] = py
                    break
                default:
                    console.log('no such mode')
            }
        } else {
            let initial, finals, initialCode, finalsCode;
            if (/[csz]h.+/.test(py)) {
                initial = py.slice(0, 2)
                finals = py.slice(2)
                initialCode = kms[this.syllable.indexOf(initial)]
                if (finals.length === 1) {
                    finalsCode = finals
                }
            } else {
                initialCode = py.charAt(0)

                finals = py.slice(1)
                if (finals === 'v') {
                    finalsCode = kms[this.syllable.indexOf(finals)]
                } else if (finals.length === 1) {
                    finalsCode = finals
                }
            }
            if (!finalsCode) {
                finalsCode = kms[this.syllable.indexOf(finals)]
            }
            this.shuangpinMap[initialCode + finalsCode] = py
        }
    }
    Array.from('abcdefghigklmnopqrstuvwxyz').forEach(e => this.shuangpinMap[e] = e)
    this.shuangpinMap[kms[0]] = 'ch'
    this.shuangpinMap[kms[1]] = 'sh'
    this.shuangpinMap[kms[2]] = 'zh'
}
/**
 *
 * @param {string }source
 * @returns {{tokens, trans}}
 */
goog.ime.chrome.os.Parser.prototype.parse = function (source) {
    if (!source) return {tokens: null, trans: source}
    if (source.length === 1) return {tokens: [source], trans: this.shuangpinMap[source]}
    const tokens = []
    const trans = []
    for (let i = 1; i < source.length + 1; i++) {
        if (i > source.length) {
            const initial = source.slice(-1)
            okens.push(initial)
            trans.push(this.shuangpinMap[initial])
            continue
        }
        const pre = i - 1

        const sp = source.slice(pre, i + 1)
        if (this.shuangpinMap[sp]) {
            tokens.push(sp)
            trans.push(this.shuangpinMap[sp])
            i++
        } else {
            const initial = sp.charAt(0)
            tokens.push(initial)
            trans.push(this.shuangpinMap[initial] || initial)
        }
    }
    return {tokens: tokens, trans: trans.join("'")}
}
