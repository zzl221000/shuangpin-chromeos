# chromeos双拼输入法

根据[google-input-tools](https://github.com/google/google-input-tools/tree/master/chrome/os/ime)改造，

## 功能
- [x] 整句输入
- [x] 模糊音
- [x] 用户词典

## 使用
chrome打开`开发人员模式`，
从[release](https://github.com/zzl221000/shuangpin-chromeos/releases)下载编译好的扩展，解压后，在扩展页面`加载解压缩的扩展`，
在输入法设置中添加`双拼输入法`。
## 编译
```shell
# 安装依赖
pnpm i

# 编译，生成扩展在dist文件夹中
pnpm run build
pnpm run build-background
pnpm run build-option
```
## roadmap
- [x] 小鹤双拼
- [x] 设置页面改造
- [x] 支持其他双拼方案
- [x] 支持自定义双拼
- [ ] 码表挂载——支持音形方案


