require('google-closure-library')
goog.addDependency('F:/project/frontend/chromeos-ime-shuangpin/src/ime/background.js', ['goog.ime.chrome.os.Background'], ['goog.debug.ErrorHandler', 'goog.events.EventLike', 'goog.events.EventWrapper', 'goog.events.EventWrapper', 'goog.ime.chrome.os.Controller', 'goog.ime.chrome.os.LocalStorageHandlerFactory']);
goog.addDependency('F:/project/frontend/chromeos-ime-shuangpin/src/ime/candidate.js', ['goog.ime.chrome.os.Candidate'], []);
goog.addDependency('F:/project/frontend/chromeos-ime-shuangpin/src/ime/chineseconfig.js', ['goog.ime.chrome.os.ChineseConfig'], ['goog.ime.chrome.os.Config', 'goog.ime.chrome.os.Key', 'goog.ime.chrome.os.Modifier', 'goog.ime.chrome.os.State', 'goog.ime.chrome.os.StateID']);
goog.addDependency('F:/project/frontend/chromeos-ime-shuangpin/src/ime/common.js', ['goog.ime.chrome.os.EventType', 'goog.ime.chrome.os.Key', 'goog.ime.chrome.os.KeyboardLayouts', 'goog.ime.chrome.os.MessageKey', 'goog.ime.chrome.os.Modifier', 'goog.ime.chrome.os.StateID', 'goog.ime.chrome.os.Status', 'goog.ime.chrome.os.TransID'], []);
goog.addDependency('F:/project/frontend/chromeos-ime-shuangpin/src/ime/config.js', ['goog.ime.chrome.os.Config'], ['goog.ime.chrome.os.KeyboardLayouts']);
goog.addDependency('F:/project/frontend/chromeos-ime-shuangpin/src/ime/configfactory.js', ['goog.ime.chrome.os.ConfigFactory'], ['goog.ime.chrome.os.Config', 'goog.ime.chrome.os.FlypyParser', 'goog.ime.chrome.os.PinyinConfig', 'goog.ime.offline.InputToolCode', 'goog.ime.offline.ShuangpinCode', 'goog.object']);
goog.addDependency('F:/project/frontend/chromeos-ime-shuangpin/src/ime/controller.js', ['goog.ime.chrome.os.Controller'], ['goog.Disposable', 'goog.events.EventHandler', 'goog.ime.chrome.os.ConfigFactory', 'goog.ime.chrome.os.EventType', 'goog.ime.chrome.os.Key', 'goog.ime.chrome.os.KeyboardLayouts', 'goog.ime.chrome.os.Model', 'goog.ime.chrome.os.Modifier', 'goog.ime.chrome.os.StateID', 'goog.ime.chrome.os.Status', 'goog.ime.chrome.os.View'], {'lang': 'es6'});
goog.addDependency('F:/project/frontend/chromeos-ime-shuangpin/src/ime/decoder/candidate.js', ['goog.ime.offline.Candidate'], []);
goog.addDependency('F:/project/frontend/chromeos-ime-shuangpin/src/ime/decoder/dataloader.js', ['goog.ime.offline.DataLoader'], ['goog.Disposable', 'goog.ime.offline.InputToolCode']);
goog.addDependency('F:/project/frontend/chromeos-ime-shuangpin/src/ime/decoder/dataparser.js', ['goog.ime.offline.DataParser', 'goog.ime.offline.Long', 'goog.ime.offline.Target'], ['goog.array', 'goog.object']);
goog.addDependency('F:/project/frontend/chromeos-ime-shuangpin/src/ime/decoder/decoder.js', ['goog.ime.offline.Decoder', 'goog.ime.offline.Response'], ['goog.Disposable', 'goog.array', 'goog.events.EventHandler', 'goog.ime.offline.Candidate', 'goog.ime.offline.DataLoader', 'goog.ime.offline.EventType', 'goog.ime.offline.MLDecoder', 'goog.ime.offline.TokenDecoder', 'goog.ime.offline.UserDecoder']);
goog.addDependency('F:/project/frontend/chromeos-ime-shuangpin/src/ime/decoder/eventtype.js', ['goog.ime.offline.EventType'], []);
goog.addDependency('F:/project/frontend/chromeos-ime-shuangpin/src/ime/decoder/heap.js', ['goog.ime.offline.Heap'], ['goog.array', 'goog.object', 'goog.structs.Node']);
goog.addDependency('F:/project/frontend/chromeos-ime-shuangpin/src/ime/decoder/inputtoolcode.js', ['goog.ime.offline.InputToolCode'], []);
goog.addDependency('F:/project/frontend/chromeos-ime-shuangpin/src/ime/decoder/mldecoder.js', ['goog.ime.offline.MLDecoder'], ['goog.ime.offline.Candidate', 'goog.ime.offline.DataLoader', 'goog.ime.offline.DataParser', 'goog.ime.offline.Heap']);
goog.addDependency('F:/project/frontend/chromeos-ime-shuangpin/src/ime/decoder/shuangpincode.js', ['goog.ime.offline.ShuangpinCode'], []);
goog.addDependency('F:/project/frontend/chromeos-ime-shuangpin/src/ime/decoder/tokendecoder.js', ['goog.ime.offline.LatticeNode', 'goog.ime.offline.TokenDecoder', 'goog.ime.offline.TokenPath'], ['goog.array', 'goog.events.EventTarget', 'goog.ime.offline.DataLoader', 'goog.ime.offline.EventType']);
goog.addDependency('F:/project/frontend/chromeos-ime-shuangpin/src/ime/decoder/userdecoder.js', ['goog.ime.offline.UserDecoder'], ['goog.ime.offline.Heap', 'goog.object']);
goog.addDependency('F:/project/frontend/chromeos-ime-shuangpin/src/ime/flypyparser.js', ['goog.ime.chrome.os.FlypyParser'], ['goog.ime.chrome.os.Parser'], {'lang': 'es6'});
goog.addDependency('F:/project/frontend/chromeos-ime-shuangpin/src/ime/localstoragehandler.js', ['goog.ime.chrome.os.LocalStorageHandler'], []);
goog.addDependency('F:/project/frontend/chromeos-ime-shuangpin/src/ime/localstoragehandlerfactory.js', ['goog.ime.chrome.os.LocalStorageHandlerFactory'], ['goog.ime.chrome.os.PinyinLocalStorageHandler', 'goog.ime.offline.InputToolCode', 'goog.object']);
goog.addDependency('F:/project/frontend/chromeos-ime-shuangpin/src/ime/model.js', ['goog.ime.chrome.os.Model'], ['goog.events.EventTarget', 'goog.ime.chrome.os.Candidate', 'goog.ime.chrome.os.ConfigFactory', 'goog.ime.chrome.os.EventType', 'goog.ime.chrome.os.Status', 'goog.ime.offline.Decoder']);
goog.addDependency('F:/project/frontend/chromeos-ime-shuangpin/src/ime/parser.js', ['goog.ime.chrome.os.Parser'], [], {'lang': 'es5'});
goog.addDependency('F:/project/frontend/chromeos-ime-shuangpin/src/ime/pinyinconfig.js', ['goog.ime.chrome.os.PinyinConfig'], ['goog.ime.chrome.os.ChineseConfig']);
goog.addDependency('F:/project/frontend/chromeos-ime-shuangpin/src/ime/pinyinlocalstoragehandler.js', ['goog.ime.chrome.os.PinyinLocalStorageHandler'], ['goog.ime.chrome.os.LocalStorageHandler', 'goog.ime.offline.InputToolCode']);
goog.addDependency('F:/project/frontend/chromeos-ime-shuangpin/src/ime/pinyinoption.js', ['goog.ime.chrome.os.PinyinOption'], ['goog.Disposable', 'goog.debug.ErrorHandler', 'goog.dom', 'goog.dom.TagName', 'goog.events', 'goog.events.EventHandler', 'goog.events.EventLike', 'goog.events.EventTarget', 'goog.events.EventType', 'goog.events.EventWrapper', 'goog.ime.chrome.os.LocalStorageHandlerFactory', 'goog.ime.offline.InputToolCode', 'goog.object']);
goog.addDependency('F:/project/frontend/chromeos-ime-shuangpin/src/ime/shuangpin/flypy.js', [], [], {'lang': 'es6'});
goog.addDependency('F:/project/frontend/chromeos-ime-shuangpin/src/ime/state.js', ['goog.ime.chrome.os.State'], []);
goog.addDependency('F:/project/frontend/chromeos-ime-shuangpin/src/ime/view.js', ['goog.ime.chrome.os.View'], ['goog.ime.chrome.os.ConfigFactory']);
require('../public/data')
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');
chrome={i18n:{
    getMessage:name=>name
    }}
goog.require('goog.ime.chrome.os.Model')
goog.require('goog.storage.mechanism.HTML5LocalStorage')
window=global
const model=new goog.ime.chrome.os.Model

function selectChar(e) {
    var selectKeys = model.configFactory.getCurrentConfig().selectKeys;
    var pageOffset = selectKeys.indexOf(e);
    if (pageOffset < 0) {
        return true;
    }
    var pageSize = model.configFactory.getCurrentConfig().pageSize;
    if (pageOffset >= 0 && pageOffset < pageSize) {
        var index = model.getPageIndex() * pageSize + pageOffset;
        model.selectCandidate(index);
    }
}
model.configFactory.setInputTool('zh-t-i0-pinyin');
model.configFactory.setShuangpinTool('flypy')
model.setInputTool('zh-t-i0-pinyin');
// model.setParser(null)
Array.from('ul').forEach(c=> model.updateSource(c))
// model.moveCursorLeft()
// model.moveCursorLeft()
// model.revert()
// model.revert()
// model.revert()
model.selectCandidate(0)
Array.from('ulpb').forEach(c=> model.updateSource(c))
model.selectCandidate(0)
console.log(model)