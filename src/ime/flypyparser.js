
goog.provide('goog.ime.chrome.os.FlypyParser');

goog.require('goog.ime.chrome.os.Parser');

function FlypyParser() {
    FlypyParser.base(this,'constructor')
}
goog.ime.chrome.os.FlypyParser=FlypyParser
goog.inherits(goog.ime.chrome.os.FlypyParser, goog.ime.chrome.os.Parser);
goog.ime.chrome.os.FlypyParser.prototype.cartesian =(...a) => a.length===1?a:a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())));

goog.ime.chrome.os.FlypyParser.prototype.keymapping={
    q: ['iu'],
    w: ['ei'],
    e: ['e'],
    r: ['r','uan', 'van'],
    t: ['ue', 've'],
    y: ['un', 'vn'],
    u: ['u'],
    i: ['i'],
    o: ['uo', 'o'],
    p: ['ie'],
    a: ['a'],
    s: ['ong', 'iong'],
    d: ['ai'],
    f: ['en'],
    g: ['eng'],
    h: ['ang'],
    j: ['an'],
    k: ['uai', 'ing'],
    l: ['uang', 'iang'],
    z: ['ou'],
    x: ['ua', 'ia'],
    c: ['ao'],
    v: ['ui', 'v'],
    b: ['in'],
    n: ['iao','n'],
    m: ['ian']
}
goog.ime.chrome.os.FlypyParser.prototype.zcsh={
    u:'sh',
    i:'ch',
    v:'zh'
}
goog.ime.chrome.os.FlypyParser.prototype.aeo = new Set(['aa', 'ee', 'oo','aang','eeng',])
/** @override */
goog.ime.chrome.os.FlypyParser.prototype.parse=function (sentence){
    if (!sentence) return null
    const result=  Array.from(sentence).reduce((prev, curr, idx) => {
        if (prev.last === "'") {
            if (curr==="'") {

                return prev
            }
            prev.cut += curr
            if(this.zcsh[curr]){
                curr=this.zcsh[curr]
            }
            prev.trans.push([curr])
            prev.last = curr
        } else {
            let tarray=[]
            if (!this.keymapping[curr]){
                if(curr==="'"){
                    prev.trans.push([curr])
                    prev.last=curr
                    prev.cut+=`${curr}`
                }else {
                    prev.trans.push(["'"])
                    prev.trans.push([curr])
                    prev.trans.push(["'"])
                    prev.last="'"
                    prev.cut+=`'${curr}'`
                }
                return prev
            }
            for(const vowel of this.keymapping[curr]){
                if(this.allowPinyin.has(prev.last+vowel)){
                    tarray.push(vowel)
                }else if(this.aeo.has(prev.last+vowel)){
                    if (vowel.length===1){
                        tarray.push('')
                    }else {
                        tarray.push(vowel.slice(1))
                    }

                }
            }
            if(tarray.length===0){
                prev.trans.push(["'"])
                prev.trans.push([curr])
                prev.last=curr
                prev.cut+=`'${curr}`
            }else {
                prev.trans.push(tarray)
                prev.trans.push(["'"])
                prev.cut+=`${curr}'`
                prev.last="'"
            }
        }
        return prev;
    }, {cut: '', trans: [], last: "'"})
    const trans=this.cartesian(...result.trans).map(arr=>arr.join(''))
    if (goog.object.isEmpty(trans)){
        return sentence
    }
    if (result.cut.endsWith("'")){
        result.cut=result.cut.slice(0,-1)
    }
    return {tokens:result.cut.split("'"),trans:trans[0]}

}
