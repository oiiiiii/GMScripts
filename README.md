# 油猴脚本集合

本仓库包含一些实用的油猴(Tampermonkey)脚本。

## 脚本列表

### ctext-extractor.user.js - Chinese Text Project 文本提取器

用于提取 [ctext.org](https://ctext.org/)（中國哲學書電子化計劃）网站中的古籍文本。

**功能：**
- 自动提取页面中所有古籍文本内容
- 自动排除段落编号
- 提供「查看文本」按钮，弹窗显示提取的文本
- 提供「复制文本」按钮，一键复制所有文本到剪贴板

**安装方法：**
1. 安装 [Tampermonkey](https://www.tampermonkey.net/) 浏览器扩展
2. 点击扩展图标 → 添加新脚本
3. 将脚本内容粘贴并保存
4. 访问 ctext.org 任意古籍页面即可使用

**匹配网址：** `https://ctext.org/*`
