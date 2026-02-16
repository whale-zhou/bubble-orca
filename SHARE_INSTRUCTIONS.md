# 泡泡鲸工具分享指南

## 一、本地分享方案

### 1. 使用Python启动本地服务器

如果你的电脑上安装了Python，可以使用以下命令启动一个简单的HTTP服务器：

```bash
# 在项目根目录下执行
python -m http.server 8000
```

然后在浏览器中访问：`http://localhost:8000/full_frontend.html`

### 2. 使用Node.js启动本地服务器

如果你的电脑上安装了Node.js，可以使用`http-server`包：

```bash
# 安装http-server（如果尚未安装）
npm install -g http-server

# 在项目根目录下执行
http-server -p 8000
```

然后在浏览器中访问：`http://localhost:8000/full_frontend.html`

## 二、在线部署方案

### 1. GitHub Pages部署

1. 在GitHub上创建一个新的仓库
2. 将项目文件（特别是`full_frontend.html`）上传到仓库
3. 进入仓库设置，找到"Pages"选项
4. 选择"main"分支，然后点击"Save"
5. 稍等几分钟，你的网站就会部署在 `https://your-username.github.io/your-repo-name/full_frontend.html`

### 2. Vercel部署

1. 访问 https://vercel.com/ 并登录
2. 点击"New Project"
3. 选择"Import Git Repository"
4. 选择你的GitHub仓库
5. 点击"Deploy"，Vercel会自动部署你的网站
6. 部署完成后，你会得到一个类似 `https://your-project.vercel.app` 的链接

### 3. Netlify部署

1. 访问 https://www.netlify.com/ 并登录
2. 点击"Add new site" -> "Import an existing project"
3. 选择你的GitHub仓库
4. 点击"Deploy site"
5. 部署完成后，你会得到一个类似 `https://your-site.netlify.app` 的链接

## 三、生成分享二维码

### 1. 使用在线二维码生成器

推荐几个免费的在线二维码生成器：

- https://cli.im/ （草料二维码）
- https://www.qr-code-generator.com/ （英文）
- https://qrcode.monster/ （英文）

使用方法：
1. 打开二维码生成器网站
2. 输入你的网站链接（例如：`https://your-username.github.io/your-repo-name/full_frontend.html`）
3. 点击"生成二维码"
4. 下载生成的二维码图片

### 2. 使用Python生成二维码

如果你熟悉Python，可以使用`qrcode`库生成二维码：

```bash
# 安装qrcode库
pip install qrcode[pil]
```

然后创建一个Python脚本 `generate_qr.py`：

```python
import qrcode

# 替换为你的网站链接
url = "https://your-username.github.io/your-repo-name/full_frontend.html"

# 生成二维码
qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_L,
    box_size=10,
    border=4,
)
qr.add_data(url)
qr.make(fit=True)

# 创建二维码图片
img = qr.make_image(fill_color="black", back_color="white")

# 保存二维码图片
img.save("bubble_whale_tool_qr.png")
print("二维码已生成：bubble_whale_tool_qr.png")
```

执行脚本：
```bash
python generate_qr.py
```

## 四、分享链接格式

### 1. 直接访问HTML文件

如果你已经将`full_frontend.html`部署到了网站上，可以直接分享完整的URL：

```
https://your-domain.com/full_frontend.html
```

### 2. 使用短链接服务

如果链接太长，可以使用短链接服务：

- https://bitly.com/ （英文）
- https://dwz.cn/ （中文）
- https://suo.im/ （中文）

## 五、注意事项

1. **确保文件完整**：在分享前，请确保`full_frontend.html`文件是完整的，包含了所有功能。
2. **测试功能**：在分享前，先测试所有功能是否正常工作。
3. **选择可靠的部署平台**：推荐使用GitHub Pages、Vercel或Netlify等可靠的平台部署你的网站。
4. **更新内容**：如果你的项目有更新，记得重新部署网站并更新分享链接。

## 六、快速开始

对于快速分享，推荐使用以下步骤：

1. 使用Python启动本地服务器：
   ```bash
   python -m http.server 8000
   ```

2. 查看你的本地IP地址：
   - Windows：在命令提示符中输入 `ipconfig`，查找"IPv4地址"
   - macOS/Linux：在终端中输入 `ifconfig` 或 `ip a`，查找"inet"

3. 生成分享链接：
   ```
   http://你的本地IP地址:8000/full_frontend.html
   ```

4. 使用在线二维码生成器生成二维码，分享给你的朋友。

这样，在同一个局域网内的朋友就可以通过这个链接或二维码访问你的项目了！

---

**祝你分享愉快！🐋**