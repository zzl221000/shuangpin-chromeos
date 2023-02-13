# 🤩chromeos双拼输入法

根据[google-input-tools](https://github.com/google/google-input-tools/tree/master/chrome/os/ime)改造，shuangpin-chromeos 是一款可以在 ChromeOS 上使用的双拼输入法，支持整句输入、模糊拼音、用户词典等特性。

## 🗒 主要功能
- 支持整句输入
- 支持模糊拼音
- 支持用户词典
- 支持多种双拼

## 📝 安装
chrome打开`开发人员模式`，
从[release](https://github.com/zzl221000/shuangpin-chromeos/releases)下载编译好的扩展，解压后，在扩展页面`加载解压缩的扩展`，
在输入法设置中添加`双拼输入法`。

## 🔧 使用
![extension config](/docs/screenshots.gif)

### 常用双拼编码
- `微软双拼*0*o*iuvljhkzfgrwmdcxn;sqsbwyrdtvpoyv`
- `自然码*2*^*iuvljhkzfg^wmdcxnysqsbwyrdtvpovt`
- `智能ABC*0*o*evaljhkqfgrdwtzxcysrsbdcptmmnovm`
## 💥编译
```shell
# 安装依赖
pnpm i

# 编译，生成扩展在dist文件夹中
pnpm run build
pnpm run build-background
pnpm run build-option
```
## 🔜roadmap
- [x] 小鹤双拼
- [x] 设置页面改造
- [x] 支持其他双拼方案
- [x] 支持自定义双拼
- [ ] 码表挂载——支持音形方案


