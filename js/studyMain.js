// 学习模式 - 主控制器
// 简洁、专业、高效

class StudyMode {
    constructor() {
        this.currentAlgorithm = 'sha256';
        this.currentHelpType = 'overview';
        this.currentWorkspaceMode = 'canvas';
        this.canvas = null;
        this.ctx = null;
        this.isDrawing = false;
        this.isMoving = false;
        this.currentTool = 'pen';
        this.penColor = '#000000';
        this.penSize = 2;
        this.eraserSize = 20;
        this.history = [];
        this.canvasHistory = [];
        this.canvasRedoHistory = [];
        this.maxHistoryLength = 50;
        this.settings = {
            theme: 'light',
            fontSize: 'medium',
            detailedRecords: false,
            autoSave: true
        };
        
        this.algorithmNames = {
            sha256: 'SHA-256 哈希算法',
            ascii: 'ASCII 编码转换',
            shor: 'Shor 量子算法',
            grover: 'Grover 搜索算法',
            rsa: 'RSA 非对称加密',
            ecc: '椭圆曲线加密',
            aes: 'AES 对称加密'
        };
        
        this.helpContent = {
            sha256: {
                overview: `<h3>SHA-256 算法概述</h3>
                <p>SHA-256（Secure Hash Algorithm 256-bit）是一种密码散列函数，属于SHA-2家族，由美国国家安全局设计。</p>
                <h4>主要特点：</h4>
                <ul>
                    <li>输出固定长度的256位（32字节）哈希值</li>
                    <li>单向加密，无法从哈希值反推原始数据</li>
                    <li>即使输入微小变化，输出也会完全不同（雪崩效应）li>
                    <li>广泛应用于区块链、数字签名、密码存储等领域</li>
                </ul>
                <h4>应用场景：</h4>
                <ul>
                    <li>比特币区块哈希</li>
                    <li>文件完整性校验</li>
                    <li>密码存储（需加盐）</li>
                    <li>数字签名</li>
                </ul>`,
                steps: `<h3>SHA-256 计算步骤</h3>
                <h4>步骤1：消息填充</h4>
                <p>将消息填充到长度为512位的倍数，填充方法：先补1位'1'，再补若干'0'，最后补64位原始消息长度。</p>
                <h4>步骤2：初始化哈希值</h4>
                <p>使用8个初始哈希值H0-H7，这些值来自前8个素数的平方根小数部分。</p>
                <h4>步骤3：消息分块</h4>
                <p>将填充后的消息分成512位（64字节）的消息块。</p>
                <h4>步骤4：扩展消息</h4>
                <p>将每个512位块扩展为64个32位字W0-W63。</p>
                <h4>步骤5：压缩函数</h4>
                <p>对每个块执行64轮压缩运算，使用6个逻辑函数和64个常量K。</p>
                <h4>步骤6：最终哈希值</h4>
                <p>将所有块处理后的8个哈希值拼接得到最终256位哈希值。</p>`,
                examples: `<h3>SHA-256 示例</h3>
                <h4>示例1：空字符串</h4>
                <p>输入：<code>""</code></p>
                <p>输出：<code>e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</code></p>
                <h4>示例2："hello"</h4>
                <p>输入：<code>"hello"</code></p>
                <p>输出：<code>2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824</code></p>
                <h4>示例3：微小变化</h4>
                <p>输入：<code>"Hello"</code>（首字母大写）</p>
                <p>输出：<code>185f8db32271fe25f561a6fc938b2e264306ec304eda518007d1764826381969</code></p>
                <p>注意：仅改变一个字母，输出完全不同！</p>`,
                faq: `<h3>常见问题</h3>
                <h4>Q: SHA-256安全吗？</h4>
                <p>A: 目前SHA-256被认为是安全的，广泛应用于比特币等加密货币。但建议用于密码存储时加盐。</p>
                <h4>Q: SHA-256和MD5有什么区别？</h4>
                <p>A: SHA-256输出256位，MD5输出128位；SHA-256更安全，MD5已被证明存在碰撞漏洞。</p>
                <h4>Q: 可以解密SHA-256吗？</h4>
                <p>A: SHA-256是单向哈希，无法解密。只能通过彩虹表或暴力破解尝试匹配。</p>
                <h4>Q: 为什么比特币用SHA-256？</h4>
                <p>A: SHA-256安全性高、计算速度适中、抗碰撞能力强，适合工作量证明机制。</p>`
            },
            ascii: {
                overview: `<h3>ASCII 编码概述</h3>
                <p>ASCII（American Standard Code for Information Interchange）是基于拉丁字母的字符编码标准，是最早的字符编码之一。</p>
                <h4>主要特点：</h4>
                <ul>
                    <li>使用7位二进制数，表示128个字符</li>
                    <li>包含控制字符（0-31）和可打印字符（32-127）</li>
                    <li>是现代字符编码（如Unicode）的基础</li>
                </ul>
                <h4>字符分类：</h4>
                <ul>
                    <li>控制字符（0-31）：如换行、回车、制表符</li>
                    <li>数字（48-57）：'0'-'9'</li>
                    <li>大写字母（65-90）：'A'-'Z'</li>
                    <li>小写字母（97-122）：'a'-'z'</li>
                </ul>`,
                steps: `<h3>ASCII 转换步骤</h3>
                <h4>文本转ASCII：</h4>
                <ol>
                    <li>逐个读取输入文本的字符</li>
                    <li>查找该字符对应的ASCII码值</li>
                    <li>输出十进制、十六进制或二进制表示</li>
                </ol>
                <h4>ASCII转文本：</h4>
                <ol>
                    <li>将输入的ASCII码值按分隔符分割</li>
                    <li>将每个码值转换为对应字符</li>
                    <li>拼接成文本输出</li>
                </ol>
                <h4>进制转换：</h4>
                <ul>
                    <li>十进制：直接显示</li>
                    <li>十六进制：除以16取余</li>
                    <li>二进制：除以2取余</li>
                </ul>`,
                examples: `<h3>ASCII 示例</h3>
                <h4>示例1：字符 'A'</h4>
                <p>十进制：<code>65</code></p>
                <p>十六进制：<code>41</code></p>
                <p>二进制：<code>01000001</code></p>
                <h4>示例2：字符串 "ABC"</h4>
                <p>十进制：<code>65 66 67</code></p>
                <p>十六进制：<code>41 42 43</code></p>
                <h4>示例3：数字 '0'</h4>
                <p>十进制：<code>48</code>（注意：数字字符'0'的ASCII码是48，不是0）</p>`,
                faq: `<h3>常见问题</h3>
                <h4>Q: ASCII和Unicode的区别？</h4>
                <p>A: ASCII只有128个字符，仅支持英文；Unicode可表示超过100万个字符，支持全球所有语言。</p>
                <h4>Q: 扩展ASCII是什么？</h4>
                <p>A: 使用8位的ASCII变体，可表示256个字符，但不同系统编码不同，不通用。</p>
                <h4>Q: 为什么'a'-'A'=32？</h4>
                <p>A: 这是ASCII设计的结果，大小写字母相差32，方便大小写转换。</p>`
            },
            shor: {
                overview: `<h3>Shor 算法概述</h3>
                <p>Shor算法是由Peter Shor于1994年提出的量子算法，能在多项式时间内分解大整数，对RSA加密构成威胁。</p>
                <h4>主要特点：</h4>
                <ul>
                    <li>量子计算最著名的算法之一</li>
                    <li>指数级加速：经典算法需要指数时间，Shor算法只需多项式时间</li>
                    <li>对现有公钥加密体系构成潜在威胁</li>
                </ul>
                <h4>应用场景：</h4>
                <ul>
                    <li>大整数分解</li>
                    <li>离散对数问题</li>
                    <li>密码分析</li>
                </ul>`,
                steps: `<h3>Shor 算法步骤</h3>
                <h4>步骤1：选择目标</h4>
                <p>选择要分解的合数N。</p>
                <h4>步骤2：经典预处理</h4>
                <p>检查N是否为偶数或有小于log(N)的因数。</p>
                <h4>步骤3：随机选择</h4>
                <p>随机选择一个小于N的整数a。</p>
                <h4>步骤4：量子周期查找</h4>
                <p>使用量子傅里叶变换找到f(x)=a^x mod N的周期r。</p>
                <h4>步骤5：经典后处理</h4>
                <p>利用周期r计算gcd(a^(r/2)±1, N)得到因数。</p>`,
                examples: `<h3>Shor 算法示例</h3>
                <h4>示例：分解 N=15</h4>
                <p>1. 选择 a=7</p>
                <p>2. 计算 7^x mod 15 的周期</p>
                <p>3. 序列：7, 4, 13, 1, 7, 4, 13, 1...</p>
                <p>4. 周期 r=4</p>
                <p>5. gcd(7^2-1, 15) = gcd(48, 15) = 3</p>
                <p>6. gcd(7^2+1, 15) = gcd(50, 15) = 5</p>
                <p>结果：15 = 3 × 5</p>`,
                faq: `<h3>常见问题</h3>
                <h4>Q: Shor算法能破解RSA吗？</h4>
                <p>A: 理论上可以，但需要足够大的量子计算机，目前技术还未达到。</p>
                <h4>Q: 需要多少量子比特？</h4>
                <p>A: 分解n位数需要约2n个量子比特。分解2048位RSA需要约4096个量子比特。</p>
                <h4>Q: 为什么Shor算法重要？</h4>
                <p>A: 它证明了量子计算机在某些问题上能指数级加速，推动了后量子密码学发展。</p>`
            },
            grover: {
                overview: `<h3>Grover 算法概述</h3>
                <p>Grover算法是由Lov Grover于1996年提出的量子搜索算法，提供平方级加速的无序数据库搜索。</p>
                <h4>主要特点：</h4>
                <ul>
                    <li>无序数据库搜索的平方级加速</li>
                    <li>经典算法需要O(N)，Grover算法只需O(√N)</li>
                    <li>可应用于广泛的搜索问题</li>
                </ul>
                <h4>应用场景：</h4>
                <ul>
                    <li>数据库搜索</li>
                    <li>密码破解（暴力搜索）</li>
                    <li>优化问题</li>
                </ul>`,
                steps: `<h3>Grover 算法步骤</h3>
                <h4>步骤1：初始化</h4>
                <p>将所有量子比特初始化为均匀叠加态。</p>
                <h4>步骤2：Oracle操作</h4>
                <p>对目标状态标记相位翻转。</p>
                <h4>步骤3：扩散操作</h4>
                <p>对平均值进行反转，放大目标状态振幅。</p>
                <h4>步骤4：重复迭代</h4>
                <p>重复Oracle和扩散操作约√N次。</p>
                <h4>步骤5：测量</h4>
                <p>测量得到目标状态的概率接近1。</p>`,
                examples: `<h3>Grover 算法示例</h3>
                <h4>示例：在4个元素中搜索</h4>
                <p>经典方法：平均需要2.5次查询</p>
                <p>Grover方法：只需1次迭代</p>
                <h4>示例：在100万个元素中搜索</h4>
                <p>经典方法：平均需要50万次查询</p>
                <p>Grover方法：只需约1000次迭代</p>
                <p>加速比：500倍</p>`,
                faq: `<h3>常见问题</h3>
                <h4>Q: Grover算法能破解AES吗？</h4>
                <p>A: 可以将AES-128的安全性降低到等效64位，但AES-256仍然安全。</p>
                <h4>Q: Grover和Shor算法的区别？</h4>
                <p>A: Shor是指数级加速（特定问题），Grover是平方级加速（通用搜索）。</p>
                <h4>Q: 为什么只能平方加速？</h4>
                <p>A: 这是无序搜索问题的理论下限，已被证明是最优的。</p>`
            },
            rsa: {
                overview: `<h3>RSA 加密概述</h3>
                <p>RSA是最早的公钥加密算法之一，由Rivest、Shamir、Adleman于1977年提出，基于大整数分解难题。</p>
                <h4>主要特点：</h4>
                <ul>
                    <li>非对称加密：公钥加密，私钥解密</li>
                    <li>安全性基于大整数分解的困难性</li>
                    <li>广泛用于数字签名和密钥交换</li>
                </ul>
                <h4>应用场景：</h4>
                <ul>
                    <li>HTTPS/TLS证书</li>
                    <li>数字签名</li>
                    <li>电子邮件加密</li>
                    <li>SSH认证</li>
                </ul>`,
                steps: `<h3>RSA 加密步骤</h3>
                <h4>密钥生成：</h4>
                <ol>
                    <li>选择两个大素数p和q</li>
                    <li>计算n=p×q和φ(n)=(p-1)(q-1)</li>
                    <li>选择公钥指数e，满足gcd(e,φ(n))=1</li>
                    <li>计算私钥d，满足d×e≡1(mod φ(n))</li>
                </ol>
                <h4>加密：</h4>
                <p>密文 c = m^e mod n</p>
                <h4>解密：</h4>
                <p>明文 m = c^d mod n</p>`,
                examples: `<h3>RSA 示例</h3>
                <h4>简单示例（教学用）：</h4>
                <p>1. p=61, q=53</p>
                <p>2. n=3233, φ(n)=3120</p>
                <p>3. e=17（公钥）</p>
                <p>4. d=2753（私钥）</p>
                <h4>加密 "A"（ASCII=65）：</h4>
                <p>c = 65^17 mod 3233 = 2790</p>
                <h4>解密：</h4>
                <p>m = 2790^2753 mod 3233 = 65</p>`,
                faq: `<h3>常见问题</h3>
                <h4>Q: RSA安全吗？</h4>
                <p>A: 使用足够长的密钥（2048位以上）目前是安全的，但要注意实现细节。</p>
                <h4>Q: RSA和AES的区别？</h4>
                <p>A: RSA是非对称加密，速度慢，用于密钥交换；AES是对称加密，速度快，用于数据加密。</p>
                <h4>Q: 为什么RSA密钥这么长？</h4>
                <p>A: 大整数分解算法不断改进，需要足够长的密钥来保证安全。</p>`
            },
            ecc: {
                overview: `<h3>椭圆曲线加密概述</h3>
                <p>ECC（Elliptic Curve Cryptography）基于椭圆曲线离散对数问题，提供与RSA相同安全性但密钥更短。</p>
                <h4>主要特点：</h4>
                <ul>
                    <li>密钥更短：256位ECC等效于3072位RSA</li>
                    <li>计算更快：签名和验证速度更快</li>
                    <li>带宽更低：适合移动设备</li>
                </ul>
                <h4>应用场景：</h4>
                <ul>
                    <li>比特币/以太坊地址</li>
                    <li>TLS/ECDH密钥交换</li>
                    <li>数字签名（ECDSA）</li>
                </ul>`,
                steps: `<h3>ECC 加密步骤</h3>
                <h4>椭圆曲线基础：</h4>
                <p>曲线方程：y² = x³ + ax + b</p>
                <h4>密钥生成：</h4>
                <ol>
                    <li>选择椭圆曲线和基点G</li>
                    <li>选择私钥d（随机数）</li>
                    <li>计算公钥Q = d×G</li>
                </ol>
                <h4>加密：</h4>
                <p>选择随机数k，计算密文对(C1, C2)</p>
                <h4>解密：</h4>
                <p>使用私钥d从C1计算共享密钥，解密C2</p>`,
                examples: `<h3>ECC 示例</h3>
                <h4>比特币使用的曲线：</h4>
                <p>secp256k1: y² = x³ + 7</p>
                <h4>密钥大小对比：</h4>
                <table>
                    <tr><th>安全级别</th><th>RSA</th><th>ECC</th></tr>
                    <tr><td>80位</td><td>1024</td><td>160</td></tr>
                    <tr><td>128位</td><td>3072</td><td>256</td></tr>
                    <tr><td>256位</td><td>15360</td><td>512</td></tr>
                </table>`,
                faq: `<h3>常见问题</h3>
                <h4>Q: ECC比RSA好在哪里？</h4>
                <p>A: 密钥更短、速度更快、更适合移动设备和物联网。</p>
                <h4>Q: 比特币用的是ECC吗？</h4>
                <p>A: 是的，比特币使用secp256k1曲线进行签名。</p>
                <h4>Q: ECC有什么缺点？</h4>
                <p>A: 专利问题（已过期）、实现复杂、部分曲线存在安全质疑。</p>`
            },
            aes: {
                overview: `<h3>AES 加密概述</h3>
                <p>AES（Advanced Encryption Standard）是美国国家标准，对称加密算法，用于替代DES。</p>
                <h4>主要特点：</h4>
                <ul>
                    <li>对称加密：加密解密使用同一密钥</li>
                    <li>块加密：固定128位块大小</li>
                    <li>密钥长度：128/192/256位</li>
                    <li>速度快，安全性高</li>
                </ul>
                <h4>应用场景：</h4>
                <ul>
                    <li>文件加密</li>
                    <li>WiFi加密（WPA2）</li>
                    <li>VPN通信</li>
                    <li>数据库加密</li>
                </ul>`,
                steps: `<h3>AES 加密步骤</h3>
                <h4>初始变换：</h4>
                <p>明文与初始密钥异或</p>
                <h4>轮变换（重复10/12/14轮）：</h4>
                <ol>
                    <li>字节替换（SubBytes）：S盒替换</li>
                    <li>行移位（ShiftRows）：循环左移</li>
                    <li>列混合（MixColumns）：矩阵乘法</li>
                    <li>轮密钥加（AddRoundKey）：与子密钥异或</li>
                </ol>
                <h4>最终轮：</h4>
                <p>不包含列混合</p>`,
                examples: `<h3>AES 示例</h3>
                <h4>加密流程：</h4>
                <p>明文：128位（16字节）</p>
                <p>密钥：128/192/256位</p>
                <p>轮数：10/12/14轮</p>
                <h4>示例（简化）：</h4>
                <p>输入："Hello World!!!!"（16字节）</p>
                <p>密钥："ThisIsASecretKey"（16字节）</p>
                <p>输出：乱码密文（16字节）</p>`,
                faq: `<h3>常见问题</h3>
                <h4>Q: AES-128够安全吗？</h4>
                <p>A: 目前足够安全，暴力破解需要天文数字的时间。</p>
                <h4>Q: AES和DES的区别？</h4>
                <p>A: AES密钥更长、更快、更安全。DES已不推荐使用。</p>
                <h4>Q: 为什么AES有三种密钥长度？</h4>
                <p>A: 提供不同安全级别选择，密钥越长越安全但稍慢。</p>`
            }
        };
        
        this.init();
    }
    
    init() {
        this.loadSettings();
        this.initCanvas();
        this.initEventListeners();
        this.loadHistory();
        this.updateAlgorithmTitle();
        this.initGuide();
        
        console.log('📚 学习模式已初始化');
    }
    
    loadSettings() {
        const saved = localStorage.getItem('studySettings');
        if (saved) {
            this.settings = { ...this.settings, ...JSON.parse(saved) };
        }
        this.applySettings();
    }
    
    applySettings() {
        document.body.className = `study-mode theme-${this.settings.theme}`;
        const fontSizes = { small: '14px', medium: '16px', large: '18px' };
        document.documentElement.style.fontSize = fontSizes[this.settings.fontSize];
    }
    
    saveSettings() {
        localStorage.setItem('studySettings', JSON.stringify(this.settings));
    }
    
    initCanvas() {
        this.canvas = document.getElementById('draw-canvas');
        if (!this.canvas) return;
        
        const container = document.getElementById('canvas-container');
        if (!container) return;
        
        const dpr = window.devicePixelRatio || 1;
        const rect = container.getBoundingClientRect();
        
        this.canvas.width = (rect.width) * dpr;
        this.canvas.height = (rect.height - 50) * dpr;
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = (rect.height - 50) + 'px';
        
        this.ctx = this.canvas.getContext('2d');
        this.ctx.scale(dpr, dpr);
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, rect.width, rect.height - 50);
        
        window.addEventListener('resize', () => {
            const tempData = this.ctx ? this.ctx.getImageData(0, 0, this.canvas.width / dpr, this.canvas.height / dpr) : null;
            
            const newRect = container.getBoundingClientRect();
            this.canvas.width = (newRect.width) * dpr;
            this.canvas.height = (newRect.height - 50) * dpr;
            this.canvas.style.width = newRect.width + 'px';
            this.canvas.style.height = (newRect.height - 50) + 'px';
            
            if (this.ctx) {
                this.ctx.setTransform(1, 0, 0, 1, 0, 0);
                this.ctx.scale(dpr, dpr);
                this.ctx.lineCap = 'round';
                this.ctx.lineJoin = 'round';
                if (tempData) {
                    this.ctx.putImageData(tempData, 0, 0);
                }
            }
        });
    }
    
    initEventListeners() {
        this.initAlgorithmTabs();
        this.initToolButtons();
        this.initCanvasTools();
        this.initWorkspaceToggle();
        this.initPanels();
        this.initSettings();
        this.initKeyboardShortcuts();
        this.initClickOutside();
        this.initSidebarToggle();
        this.initLayerToggle();
        this.initDraggablePanels();
    }
    
    initDraggablePanels() {
        const draggablePanels = [
            { selector: '.formula-panel', header: '.formula-panel-header' },
            { selector: '#history-panel', header: '.side-panel-header' },
            { selector: '#settings-panel', header: '.side-panel-header' }
        ];
        
        draggablePanels.forEach(({ selector, header }) => {
            const panel = document.querySelector(selector);
            if (!panel) return;
            
            const headerEl = panel.querySelector(header);
            if (!headerEl) return;
            
            headerEl.style.cursor = 'move';
            headerEl.style.userSelect = 'none';
            
            let isDragging = false;
            let startX, startY, initialX, initialY;
            
            headerEl.addEventListener('mousedown', (e) => {
                if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
                
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
                
                const rect = panel.getBoundingClientRect();
                initialX = rect.left;
                initialY = rect.top;
                
                panel.style.position = 'fixed';
                panel.style.left = initialX + 'px';
                panel.style.top = initialY + 'px';
                panel.style.right = 'auto';
                panel.style.zIndex = '1000';
                
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            });
            
            const onMouseMove = (e) => {
                if (!isDragging) return;
                
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
                
                panel.style.left = (initialX + dx) + 'px';
                panel.style.top = (initialY + dy) + 'px';
            };
            
            const onMouseUp = () => {
                isDragging = false;
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            };
        });
    }
    
    initLayerToggle() {
        const layersPanel = document.querySelector('.layers-panel-embedded');
        if (layersPanel) {
            layersPanel.style.display = 'flex';
        }
    }
    
    initSidebarToggle() {
        const sidebarToggle = document.getElementById('sidebar-toggle');
        const toolSidebar = document.getElementById('tool-sidebar');
        
        if (sidebarToggle && toolSidebar) {
            sidebarToggle.addEventListener('click', () => {
                toolSidebar.classList.toggle('collapsed');
                this.showMessage(toolSidebar.classList.contains('collapsed') ? '左侧栏已隐藏' : '左侧栏已显示');
            });
        }
    }
    
    initClickOutside() {
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.tool-sidebar') && !e.target.closest('.formula-panel')) {
                document.querySelectorAll('.tool-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                document.querySelectorAll('.canvas-tool').forEach(btn => {
                    btn.classList.remove('active');
                });
            }
        });
    }
    
    initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key.toLowerCase()) {
                    case 's':
                        e.preventDefault();
                        this.saveWork();
                        break;
                    case 'z':
                        e.preventDefault();
                        if (e.shiftKey) {
                            this.redo();
                        } else {
                            this.undo();
                        }
                        break;
                    case 'y':
                        e.preventDefault();
                        this.redo();
                        break;
                    case 'c':
                        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                            e.preventDefault();
                            this.copyToClipboard();
                        }
                        break;
                    case 'v':
                        break;
                    case 'e':
                        e.preventDefault();
                        this.exportPNG();
                        break;
                    case 'n':
                        e.preventDefault();
                        this.clearAll();
                        break;
                }
            }
            
            if (e.key === 'Delete' || e.key === 'Backspace') {
                if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                    e.preventDefault();
                    this.clearCanvas();
                }
            }
            
            if (e.key === 'F1') {
                e.preventDefault();
                this.showGuide();
            }
            
            if (e.key === 'Escape') {
                this.closeAllPanels();
                // 退出全屏
                const canvasContainer = document.getElementById('canvas-container');
                if (canvasContainer && canvasContainer.classList.contains('fullscreen')) {
                    this.toggleFullscreen();
                }
            }
            
            if (e.key === 'F2') {
                e.preventDefault();
                // 切换左侧栏显示/隐藏
                const toolSidebar = document.getElementById('tool-sidebar');
                if (toolSidebar) {
                    toolSidebar.classList.toggle('collapsed');
                    this.showMessage(toolSidebar.classList.contains('collapsed') ? '左侧栏已隐藏' : '左侧栏已显示');
                }
            }
            
            if (e.key === 'F3') {
                e.preventDefault();
                const layersPanel = document.querySelector('.layers-panel-embedded');
                if (layersPanel) {
                    const isHidden = layersPanel.style.display === 'none';
                    layersPanel.style.display = isHidden ? 'flex' : 'none';
                    this.showMessage(isHidden ? '图层栏已显示' : '图层栏已隐藏');
                }
            }
            
            if (!e.ctrlKey && !e.metaKey && !e.altKey) {
                if (e.key === '1') this.switchAlgorithm('sha256');
                if (e.key === '2') this.switchAlgorithm('ascii');
                if (e.key === '3') this.switchAlgorithm('shor');
                if (e.key === '4') this.switchAlgorithm('grover');
                if (e.key === '5') this.switchAlgorithm('rsa');
                if (e.key === '6') this.switchAlgorithm('ecc');
                if (e.key === '7') this.switchAlgorithm('aes');
                
                // PS风格快捷键
                if (e.key.toLowerCase() === 'b') {
                    e.preventDefault();
                    this.setTool('pen');
                }
                if (e.key.toLowerCase() === 'e') {
                    e.preventDefault();
                    this.setTool('eraser');
                }
                if (e.key.toLowerCase() === 'v') {
                    e.preventDefault();
                    this.setTool('move');
                }
                if (e.key.toLowerCase() === 't') {
                    e.preventDefault();
                    this.setTool('text');
                }
            }
            
            // F11全屏画布
            if (e.key === 'F11') {
                e.preventDefault();
                this.toggleFullscreen();
            }
        });
    }
    
    undo() {
        if (this.canvasHistory && this.canvasHistory.length > 0) {
            const previousState = this.canvasHistory.pop();
            if (previousState && this.ctx) {
                const img = new Image();
                img.onload = () => {
                    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                    this.ctx.drawImage(img, 0, 0);
                };
                img.src = previousState;
                this.showMessage('已撤销');
            }
        } else {
            this.showMessage('没有可撤销的操作', 'warning');
        }
    }
    
    redo() {
        if (this.canvasRedoHistory && this.canvasRedoHistory.length > 0) {
            const nextState = this.canvasRedoHistory.pop();
            if (nextState && this.ctx) {
                const img = new Image();
                img.onload = () => {
                    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                    this.ctx.drawImage(img, 0, 0);
                };
                img.src = nextState;
                this.showMessage('已重做');
            }
        } else {
            this.showMessage('没有可重做的操作', 'warning');
        }
    }
    
    copyToClipboard() {
        const inputArea = document.getElementById('input-area');
        const outputArea = document.getElementById('output-content');
        
        const text = outputArea?.textContent || inputArea?.value || '';
        if (text) {
            navigator.clipboard.writeText(text).then(() => {
                this.showMessage('已复制到剪贴板');
            }).catch(() => {
                this.showMessage('复制失败', 'error');
            });
        }
    }
    
    clearAll() {
        if (confirm('确定要清空所有内容吗？')) {
            this.clearCanvas();
            const inputArea = document.getElementById('input-area');
            const outputArea = document.getElementById('output-content');
            if (inputArea) inputArea.value = '';
            if (outputArea) outputArea.textContent = '';
            this.showMessage('已清空所有内容');
        }
    }
    
    showGuide() {
        const guideOverlay = document.getElementById('guide-overlay');
        if (guideOverlay) {
            guideOverlay.style.display = 'flex';
        }
    }
    
    closeAllPanels() {
        const panels = ['settings-panel', 'history-panel', 'formula-panel'];
        panels.forEach(id => {
            const panel = document.getElementById(id);
            if (panel) panel.classList.remove('show');
        });
    }
    
    initAlgorithmTabs() {
        document.querySelectorAll('.tab-btn[data-algorithm]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.switchAlgorithm(btn.dataset.algorithm);
            });
        });
    }
    
    initToolButtons() {
        document.querySelectorAll('.tool-btn[data-tool]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.handleToolClick(btn.dataset.tool, btn);
            });
        });
    }
    
    initCanvasTools() {
        document.querySelectorAll('.canvas-tool').forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.id === 'fullscreen-canvas') {
                    this.toggleFullscreen();
                } else {
                    this.setTool(btn.dataset.tool);
                }
            });
        });
        
        const penColor = document.getElementById('pen-color');
        if (penColor) {
            penColor.addEventListener('input', (e) => {
                this.penColor = e.target.value;
            });
        }
        
        const penSize = document.getElementById('pen-size');
        if (penSize) {
            penSize.addEventListener('input', (e) => {
                this.penSize = parseInt(e.target.value);
            });
        }
        
        const eraserSize = document.getElementById('eraser-size');
        if (eraserSize) {
            eraserSize.addEventListener('input', (e) => {
                this.eraserSize = parseInt(e.target.value);
            });
        }
        
        if (this.canvas) {
            this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
            this.canvas.addEventListener('mousemove', (e) => this.draw(e));
            this.canvas.addEventListener('mouseup', () => this.stopDrawing());
            this.canvas.addEventListener('mouseleave', () => this.stopDrawing());
            this.canvas.addEventListener('click', (e) => this.handleCanvasClick(e));
        }
        
        const clearCanvas = document.getElementById('clear-canvas');
        if (clearCanvas) {
            clearCanvas.addEventListener('click', () => this.clearCanvas());
        }
        
        this.initFormulaPanel();
    }
    
    toggleFullscreen() {
        const canvasContainer = document.getElementById('canvas-container');
        const inputPanel = document.querySelector('.input-panel');
        const outputPanel = document.querySelector('.output-panel');
        const topBar = document.querySelector('.top-bar');
        const toolSidebar = document.getElementById('tool-sidebar');
        const fullscreenBtn = document.getElementById('fullscreen-canvas');
        
        if (!canvasContainer) return;
        
        const isFullscreen = canvasContainer.classList.contains('fullscreen');
        
        if (isFullscreen) {
            // 退出全屏
            canvasContainer.classList.remove('fullscreen');
            if (inputPanel) inputPanel.style.display = 'block';
            if (outputPanel) outputPanel.style.display = 'block';
            if (topBar) topBar.style.display = 'flex';
            if (fullscreenBtn) fullscreenBtn.innerHTML = '<i class="fa fa-expand"></i>';
            this.showMessage('已退出全屏模式');
        } else {
            // 进入全屏
            canvasContainer.classList.add('fullscreen');
            if (inputPanel) inputPanel.style.display = 'none';
            if (outputPanel) outputPanel.style.display = 'none';
            if (topBar && toolSidebar.classList.contains('collapsed')) {
                topBar.style.display = 'none';
            }
            if (fullscreenBtn) fullscreenBtn.innerHTML = '<i class="fa fa-compress"></i>';
            this.showMessage('已进入全屏模式');
        }
    }
    
    initFormulaPanel() {
        const formulaPanel = document.getElementById('formula-panel');
        const closeFormula = document.getElementById('close-formula');
        const formulaGrid = document.getElementById('formula-grid');
        
        if (closeFormula && formulaPanel) {
            closeFormula.addEventListener('click', () => {
                formulaPanel.classList.remove('show');
            });
        }
        
        document.querySelectorAll('.formula-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.formula-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.renderFormulaGrid(tab.dataset.formulaType);
            });
        });
        
        this.renderFormulaGrid('common');
    }
    
    renderFormulaGrid(type) {
        const formulaGrid = document.getElementById('formula-grid');
        if (!formulaGrid) return;
        
        const formulas = {
            common: [
                { category: '量子门', items: [
                    { symbol: 'H', latex: 'H = \\frac{1}{\\sqrt{2}}\\begin{bmatrix}1&1\\\\1&-1\\end{bmatrix}', name: '哈达玛门' },
                    { symbol: 'X', latex: 'X = \\begin{bmatrix}0&1\\\\1&0\\end{bmatrix}', name: 'Pauli-X门' },
                    { symbol: 'Z', latex: 'Z = \\begin{bmatrix}1&0\\\\0&-1\\end{bmatrix}', name: 'Pauli-Z门' },
                    { symbol: 'CNOT', latex: 'CNOT', name: 'CNOT门' },
                    { symbol: 'T', latex: 'T = \\begin{bmatrix}1&0\\\\0&e^{i\\pi/4}\\end{bmatrix}', name: 'T门' },
                    { symbol: 'S', latex: 'S = \\begin{bmatrix}1&0\\\\0&i\\end{bmatrix}', name: 'S门' }
                ]},
                { category: '量子态', items: [
                    { symbol: '|0⟩', latex: '|0\\rangle', name: '量子态|0⟩' },
                    { symbol: '|1⟩', latex: '|1\\rangle', name: '量子态|1⟩' },
                    { symbol: '|+⟩', latex: '|+\\rangle', name: '量子态|+⟩' },
                    { symbol: '|-⟩', latex: '|-\\rangle', name: '量子态|-⟩' }
                ]},
                { category: '密码学', items: [
                    { symbol: 'SHA-256', latex: 'SHA-256', name: 'SHA-256哈希' },
                    { symbol: 'RSA', latex: 'c = m^e \\mod n', name: 'RSA加密' },
                    { symbol: 'ECC', latex: 'ECC', name: '椭圆曲线加密' },
                    { symbol: 'AES', latex: 'AES', name: 'AES加密' }
                ]}
            ],
            symbols: [
                { category: '基本运算', items: [
                    { symbol: 'x²', latex: 'x^2', name: '平方' },
                    { symbol: 'x³', latex: 'x^3', name: '立方' },
                    { symbol: '√x', latex: '\\sqrt{x}', name: '平方根' },
                    { symbol: 'ⁿ√x', latex: '\\sqrt[n]{x}', name: 'n次根' }
                ]},
                { category: '微积分', items: [
                    { symbol: '∑', latex: '\\sum', name: '求和' },
                    { symbol: '∏', latex: '\\prod', name: '连乘' },
                    { symbol: '∫', latex: '\\int', name: '积分' },
                    { symbol: '∂', latex: '\\partial', name: '偏导' }
                ]},
                { category: '关系符号', items: [
                    { symbol: '≈', latex: '\\approx', name: '约等于' },
                    { symbol: '≠', latex: '\\neq', name: '不等于' },
                    { symbol: '≤', latex: '\\leq', name: '小于等于' },
                    { symbol: '≥', latex: '\\geq', name: '大于等于' }
                ]}
            ],
            greek: [
                { category: '小写字母', items: [
                    { symbol: 'α', latex: '\\alpha', name: 'alpha' },
                    { symbol: 'β', latex: '\\beta', name: 'beta' },
                    { symbol: 'γ', latex: '\\gamma', name: 'gamma' },
                    { symbol: 'δ', latex: '\\delta', name: 'delta' },
                    { symbol: 'ε', latex: '\\epsilon', name: 'epsilon' },
                    { symbol: 'ζ', latex: '\\zeta', name: 'zeta' },
                    { symbol: 'η', latex: '\\eta', name: 'eta' },
                    { symbol: 'θ', latex: '\\theta', name: 'theta' }
                ]},
                { category: '大写字母', items: [
                    { symbol: 'Ω', latex: '\\Omega', name: 'Omega' },
                    { symbol: 'Δ', latex: '\\Delta', name: 'Delta' },
                    { symbol: 'Σ', latex: '\\Sigma', name: 'Sigma' },
                    { symbol: 'Π', latex: '\\Pi', name: 'Pi' }
                ]}
            ],
            operators: [
                { category: '逻辑运算', items: [
                    { symbol: '⊕', latex: '\\oplus', name: '异或(XOR)' },
                    { symbol: '∧', latex: '\\land', name: '逻辑与' },
                    { symbol: '∨', latex: '\\lor', name: '逻辑或' },
                    { symbol: '¬', latex: '\\neg', name: '逻辑非' }
                ]},
                { category: '集合运算', items: [
                    { symbol: '∈', latex: '\\in', name: '属于' },
                    { symbol: '∉', latex: '\\notin', name: '不属于' },
                    { symbol: '∪', latex: '\\cup', name: '并集' },
                    { symbol: '∩', latex: '\\cap', name: '交集' }
                ]},
                { category: '量子符号', items: [
                    { symbol: '⟨ψ|', latex: '\\langle\\psi|', name: '左矢' },
                    { symbol: '|ψ⟩', latex: '|\\psi\\rangle', name: '右矢' },
                    { symbol: '⊗', latex: '\\otimes', name: '张量积' }
                ]}
            ]
        };
        
        const formulaData = formulas[type] || formulas.common;
        formulaGrid.innerHTML = formulaData.map(category => `
            <div class="formula-category">${category.category}</div>
            ${category.items.map(item => `
                <div class="formula-item" data-symbol="${item.symbol}" data-latex="${item.latex}" title="${item.name || ''}">
                    <div class="formula-symbol">${item.symbol}</div>
                    <div class="formula-name">${item.name}</div>
                </div>
            `).join('')}
        `).join('');
        
        formulaGrid.querySelectorAll('.formula-item').forEach(item => {
            item.addEventListener('click', () => {
                this.insertFormula(item.dataset.symbol, item.dataset.latex, item.title);
            });
        });
        
        // 渲染LaTeX公式
        if (window.katex) {
            formulaGrid.querySelectorAll('.formula-item').forEach(item => {
                const latex = item.dataset.latex;
                if (latex) {
                    try {
                        const formulaContainer = document.createElement('div');
                        formulaContainer.style.display = 'none';
                        formulaContainer.style.position = 'absolute';
                        item.appendChild(formulaContainer);
                        
                        katex.render(latex, formulaContainer, {
                            throwOnError: false
                        });
                    } catch (e) {
                        console.warn('KaTeX渲染失败:', e);
                    }
                }
            });
        }
    }
    
    insertFormula(symbol, latex, name) {
        const inputArea = document.getElementById('input-area');
        if (inputArea) {
            const start = inputArea.selectionStart;
            const end = inputArea.selectionEnd;
            const text = inputArea.value;
            inputArea.value = text.substring(0, start) + symbol + text.substring(end);
            inputArea.focus();
            inputArea.selectionStart = inputArea.selectionEnd = start + symbol.length;
        }
        
        if (latex) {
            console.log(`插入公式: ${name || symbol}`);
            console.log(`LaTeX: ${latex}`);
        }
        
        const formulaPanel = document.getElementById('formula-panel');
        if (formulaPanel) {
            formulaPanel.classList.remove('show');
        }
    }
    
    handleCanvasClick(e) {
        if (this.currentTool === 'text') {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const text = prompt('请输入文本：');
            if (text && this.ctx) {
                this.ctx.font = `${this.penSize * 8}px 'Inter', sans-serif`;
                this.ctx.fillStyle = this.penColor;
                this.ctx.fillText(text, x, y);
            }
        }
    }
    
    initWorkspaceToggle() {
        const toggleCanvas = document.getElementById('toggle-canvas');
        const toggleResult = document.getElementById('toggle-result');
        const toggleHelp = document.getElementById('toggle-help');
        
        if (toggleCanvas) {
            toggleCanvas.addEventListener('click', () => this.switchWorkspaceMode('canvas'));
        }
        
        if (toggleResult) {
            toggleResult.addEventListener('click', () => this.switchWorkspaceMode('result'));
        }
        
        if (toggleHelp) {
            toggleHelp.addEventListener('click', () => this.switchWorkspaceMode('help'));
        }
    }
    
    initPanels() {
        const historyBtn = document.getElementById('history-btn');
        const historyPanel = document.getElementById('history-panel');
        const closeHistory = document.getElementById('close-history');
        
        if (historyBtn && historyPanel) {
            historyBtn.addEventListener('click', () => {
                historyPanel.classList.toggle('show');
                const settingsPanel = document.getElementById('settings-panel');
                if (settingsPanel) settingsPanel.classList.remove('show');
            });
        }
        
        if (closeHistory) {
            closeHistory.addEventListener('click', () => {
                historyPanel.classList.remove('show');
            });
        }
        
        const settingsBtn = document.getElementById('settings-btn');
        const settingsPanel = document.getElementById('settings-panel');
        const closeSettings = document.getElementById('close-settings');
        
        if (settingsBtn && settingsPanel) {
            settingsBtn.addEventListener('click', () => {
                settingsPanel.classList.toggle('show');
                if (historyPanel) historyPanel.classList.remove('show');
            });
        }
        
        if (closeSettings) {
            closeSettings.addEventListener('click', () => {
                settingsPanel.classList.remove('show');
            });
        }
    }
    
    initSettings() {
        document.querySelectorAll('.setting-item input, .setting-item select').forEach(input => {
            input.addEventListener('change', () => {
                this.updateSetting(input.id, input.type === 'checkbox' ? input.checked : input.value);
            });
        });
    }
    
    switchAlgorithm(algorithm) {
        this.currentAlgorithm = algorithm;
        
        document.querySelectorAll('.tab-btn[data-algorithm]').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeBtn = document.querySelector(`[data-algorithm="${algorithm}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
        
        this.updateAlgorithmTitle();
        this.updateHelpContent();
        
        console.log('切换算法:', algorithm);
    }
    
    updateAlgorithmTitle() {
        const titleEl = document.getElementById('current-algorithm-title');
        if (titleEl) {
            titleEl.textContent = this.algorithmNames[this.currentAlgorithm] || this.currentAlgorithm;
        }
    }
    
    handleToolClick(tool, btn) {
        const toolSection = btn.closest('.tool-section');
        if (toolSection) {
            toolSection.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
        }
        btn.classList.add('active');
        
        if (tool.startsWith('help-')) {
            const helpType = tool.replace('help-', '');
            this.switchHelpType(helpType);
        } else if (tool.startsWith('3d-')) {
            this.handle3DTool(tool);
        } else if (tool.startsWith('formula-')) {
            this.handleFormulaTool(tool);
        } else if (tool.startsWith('animation-')) {
            this.handleAnimationTool(tool);
        } else if (tool.startsWith('export-')) {
            this.handleExport(tool);
        } else if (tool === 'save-work') {
            this.saveWork();
        } else if (tool === 'run-calculation') {
            this.runCalculation();
        } else if (tool === 'clear-input') {
            this.clearInput();
        }
    }
    
    handleFormulaTool(tool) {
        const formulaPanel = document.getElementById('formula-panel');
        if (formulaPanel) {
            const type = tool.replace('formula-', '');
            if (type === 'common') {
                this.renderFormulaGrid('common');
            } else if (type === 'symbols') {
                this.renderFormulaGrid('symbols');
            } else if (type === 'greek') {
                this.renderFormulaGrid('greek');
            } else if (type === 'custom') {
                const custom = prompt('请输入自定义公式或符号：');
                if (custom) {
                    this.insertFormula(custom);
                }
                return;
            }
            formulaPanel.classList.add('show');
        }
    }
    
    handleAnimationTool(tool) {
        const algorithm = tool.replace('animation-', '');
        alert(`${algorithm.toUpperCase()}动画功能即将推出！`);
    }
    
    saveWork() {
        const data = {
            algorithm: this.currentAlgorithm,
            input: document.getElementById('input-area')?.value || '',
            output: document.getElementById('output-content')?.textContent || '',
            canvas: this.canvas ? this.canvas.toDataURL() : null,
            timestamp: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const link = document.createElement('a');
        link.download = `泡泡鲸密码箱-${this.currentAlgorithm}-${Date.now()}.json`;
        link.href = URL.createObjectURL(blob);
        link.click();
        
        this.showMessage('保存成功！');
    }
    
    switchHelpType(type) {
        this.currentHelpType = type;
        this.switchWorkspaceMode('help');
        this.updateHelpContent();
    }
    
    updateHelpContent() {
        const helpContent = document.getElementById('help-content');
        if (!helpContent) return;
        
        const algorithmHelp = this.helpContent[this.currentAlgorithm];
        if (algorithmHelp && algorithmHelp[this.currentHelpType]) {
            helpContent.innerHTML = algorithmHelp[this.currentHelpType];
        } else {
            helpContent.innerHTML = `<h3>暂无说明</h3><p>该算法的${this.getHelpTypeName(this.currentHelpType)}正在编写中...</p>`;
        }
    }
    
    getHelpTypeName(type) {
        const names = {
            overview: '概述',
            steps: '步骤详解',
            examples: '示例演示',
            faq: '常见问题'
        };
        return names[type] || type;
    }
    
    switchWorkspaceMode(mode) {
        this.currentWorkspaceMode = mode;
        
        const toggleCanvas = document.getElementById('toggle-canvas');
        const toggleResult = document.getElementById('toggle-result');
        const toggleHelp = document.getElementById('toggle-help');
        const canvasContainer = document.getElementById('canvas-container');
        const resultContainer = document.getElementById('result-container');
        const helpContainer = document.getElementById('help-container');
        
        [toggleCanvas, toggleResult, toggleHelp].forEach(btn => {
            if (btn) btn.classList.remove('active');
        });
        
        [canvasContainer, resultContainer, helpContainer].forEach(container => {
            if (container) container.style.display = 'none';
        });
        
        if (mode === 'canvas') {
            if (toggleCanvas) toggleCanvas.classList.add('active');
            if (canvasContainer) canvasContainer.style.display = 'block';
        } else if (mode === 'result') {
            if (toggleResult) toggleResult.classList.add('active');
            if (resultContainer) resultContainer.style.display = 'block';
        } else if (mode === 'help') {
            if (toggleHelp) toggleHelp.classList.add('active');
            if (helpContainer) helpContainer.style.display = 'block';
            this.updateHelpContent();
        }
    }
    
    handle3DTool(tool) {
        console.log('3D工具:', tool);
        alert('3D功能即将推出，敬请期待！');
    }
    
    handleExport(tool) {
        if (tool === 'export-png') {
            this.exportPNG();
        } else if (tool === 'export-code') {
            this.exportCode();
        }
    }
    
    exportPNG() {
        if (!this.canvas) return;
        
        if (!confirm('确定要导出当前画布为PNG图片吗？')) {
            return;
        }
        
        const link = document.createElement('a');
        link.download = `泡泡鲸密码箱-${this.currentAlgorithm}-${Date.now()}.png`;
        link.href = this.canvas.toDataURL('image/png');
        link.click();
        
        this.showMessage('导出成功！');
    }
    
    exportCode() {
        if (!confirm('确定要导出当前工作为代码文件吗？')) {
            return;
        }
        
        const inputArea = document.getElementById('input-area');
        const outputArea = document.getElementById('output-content');
        
        const code = `// ${this.algorithmNames[this.currentAlgorithm]}
// 生成时间: ${new Date().toLocaleString()}

// 输入
const input = "${inputArea?.value || ''}";

// 输出
const output = "${outputArea?.textContent || ''}";
`;
        
        const blob = new Blob([code], { type: 'text/javascript' });
        const link = document.createElement('a');
        link.download = `${this.currentAlgorithm}-${Date.now()}.js`;
        link.href = URL.createObjectURL(blob);
        link.click();
        
        this.showMessage('导出成功！');
    }
    
    showMessage(text, type = 'success') {
        const existing = document.querySelector('.toast-message');
        if (existing) existing.remove();
        
        const toast = document.createElement('div');
        toast.className = 'toast-message';
        toast.style.cssText = `
            position: fixed;
            bottom: 60px;
            left: 50%;
            transform: translateX(-50%);
            padding: 10px 20px;
            background: ${type === 'success' ? 'rgba(76, 175, 80, 0.9)' : type === 'warning' ? 'rgba(255, 152, 0, 0.9)' : 'rgba(244, 67, 54, 0.9)'};
            color: white;
            border-radius: 6px;
            font-size: 13px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            transition: opacity 0.3s ease;
        `;
        toast.textContent = text;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }
    
    initGuide() {
        const guideOverlay = document.getElementById('guide-overlay');
        const guideStart = document.getElementById('guide-start');
        const guideDontShow = document.getElementById('guide-dont-show');
        const showGuide = document.getElementById('show-guide');
        
        const hideGuide = localStorage.getItem('hideStudyGuide');
        if (!hideGuide && guideOverlay) {
            guideOverlay.style.display = 'flex';
        }
        
        if (guideStart) {
            guideStart.addEventListener('click', () => {
                if (guideOverlay) guideOverlay.style.display = 'none';
            });
        }
        
        if (guideDontShow) {
            guideDontShow.addEventListener('click', () => {
                if (guideOverlay) guideOverlay.style.display = 'none';
                localStorage.setItem('hideStudyGuide', 'true');
            });
        }
        
        if (showGuide) {
            showGuide.addEventListener('click', () => {
                if (guideOverlay) guideOverlay.style.display = 'flex';
            });
        }
    }
    
    runCalculation() {
        const inputArea = document.getElementById('input-area');
        const outputArea = document.getElementById('output-area');
        
        if (!inputArea || !outputArea) return;
        
        const input = inputArea.value.trim();
        
        if (!input) {
            outputArea.value = '请输入内容后再计算';
            return;
        }
        
        let result = '';
        
        switch (this.currentAlgorithm) {
            case 'sha256':
                result = this.calculateSHA256(input);
                break;
            case 'ascii':
                result = this.calculateASCII(input);
                break;
            default:
                result = `【${this.algorithmNames[this.currentAlgorithm]}】计算功能开发中...\n输入: ${input}`;
        }
        
        outputArea.value = result;
        
        if (this.settings.autoSave) {
            this.saveSnapshot();
        }
    }
    
    calculateSHA256(input) {
        let hash = 0;
        for (let i = 0; i < input.length; i++) {
            const char = input.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        
        const hashHex = Math.abs(hash).toString(16).padStart(8, '0');
        let result = hashHex.repeat(8);
        
        for (let i = 0; i < input.length; i++) {
            const charCode = input.charCodeAt(i);
            const pos = charCode % 64;
            result = result.substring(0, pos) + ((parseInt(result[pos], 16) + charCode) % 16).toString(16) + result.substring(pos + 1);
        }
        
        return `SHA-256 哈希值（演示版）:\n${result}\n\n注意：这是简化演示，实际SHA-256更复杂。\n输入长度: ${input.length} 字符`;
    }
    
    calculateASCII(input) {
        const decimals = [];
        const hexadecimals = [];
        const binaries = [];
        
        for (let i = 0; i < input.length; i++) {
            const code = input.charCodeAt(i);
            decimals.push(code);
            hexadecimals.push(code.toString(16).toUpperCase().padStart(2, '0'));
            binaries.push(code.toString(2).padStart(8, '0'));
        }
        
        return `ASCII 编码转换结果:

十进制:
${decimals.join(' ')}

十六进制:
${hexadecimals.join(' ')}

二进制:
${binaries.join(' ')}

原文: ${input}
字符数: ${input.length}`;
    }
    
    clearInput() {
        const inputArea = document.getElementById('input-area');
        const outputArea = document.getElementById('output-area');
        
        if (inputArea) inputArea.value = '';
        if (outputArea) outputArea.value = '';
    }
    
    setTool(tool) {
        this.currentTool = tool;
        
        document.querySelectorAll('.canvas-tool').forEach(btn => {
            btn.classList.remove('active');
            btn.classList.remove('eraser-active');
        });
        
        const activeBtn = document.querySelector(`.canvas-tool[data-tool="${tool}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
            if (tool === 'eraser') {
                activeBtn.classList.add('eraser-active');
            }
        }
        
        const penSizeLabel = document.querySelector('label[for="pen-size"]') || document.querySelector('label:not([id])');
        const penSizeInput = document.getElementById('pen-size');
        const eraserSizeLabel = document.getElementById('eraser-size-label');
        const eraserSizeInput = document.getElementById('eraser-size');
        
        if (tool === 'eraser') {
            if (penSizeLabel) penSizeLabel.style.display = 'none';
            if (penSizeInput) penSizeInput.style.display = 'none';
            if (eraserSizeLabel) eraserSizeLabel.style.display = 'inline';
            if (eraserSizeInput) eraserSizeInput.style.display = 'inline';
            if (this.canvas) this.canvas.classList.add('eraser-cursor');
            if (this.canvas) this.canvas.classList.remove('text-cursor');
        } else if (tool === 'text') {
            if (penSizeLabel) penSizeLabel.style.display = 'none';
            if (penSizeInput) penSizeInput.style.display = 'none';
            if (eraserSizeLabel) eraserSizeLabel.style.display = 'none';
            if (eraserSizeInput) eraserSizeInput.style.display = 'none';
            if (this.canvas) this.canvas.classList.remove('eraser-cursor');
            if (this.canvas) this.canvas.classList.add('text-cursor');
        } else {
            if (penSizeLabel) penSizeLabel.style.display = 'inline';
            if (penSizeInput) penSizeInput.style.display = 'inline';
            if (eraserSizeLabel) eraserSizeLabel.style.display = 'none';
            if (eraserSizeInput) eraserSizeInput.style.display = 'none';
            if (this.canvas) this.canvas.classList.remove('eraser-cursor');
            if (this.canvas) this.canvas.classList.remove('text-cursor');
        }
        
        if (tool === 'formula') {
            const formulaPanel = document.getElementById('formula-panel');
            if (formulaPanel) {
                formulaPanel.classList.toggle('show');
            }
        }
    }
    
    startDrawing(e) {
        this.isDrawing = true;
        
        if (!this.ctx) return;
        this.ctx.beginPath();
        
        const rect = this.canvas.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        
        const dpr = window.devicePixelRatio || 1;
        x = Math.max(0, Math.min(x, this.canvas.width / dpr));
        y = Math.max(0, Math.min(y, this.canvas.height / dpr));
        
        this.ctx.moveTo(x, y);
        
        this.draw(e);
    }
    
    draw(e) {
        if (!this.isDrawing || !this.ctx) return;
        
        const rect = this.canvas.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        
        const dpr = window.devicePixelRatio || 1;
        x = Math.max(0, Math.min(x, this.canvas.width / dpr));
        y = Math.max(0, Math.min(y, this.canvas.height / dpr));
        
        if (this.currentTool === 'pen') {
            this.ctx.globalCompositeOperation = 'source-over';
            this.ctx.lineWidth = this.penSize;
            this.ctx.strokeStyle = this.penColor;
            this.ctx.lineTo(x, y);
            this.ctx.stroke();
        } else if (this.currentTool === 'eraser') {
            this.ctx.globalCompositeOperation = 'destination-out';
            this.ctx.lineWidth = this.eraserSize || 20;
            this.ctx.lineTo(x, y);
            this.ctx.stroke();
        }
    }
    
    stopDrawing() {
        if (this.isDrawing) {
            this.isDrawing = false;
            this.ctx.beginPath();
            this.saveCanvasState();
        }
    }
    
    saveCanvasState() {
        if (!this.canvas) return;
        
        const currentState = this.canvas.toDataURL();
        this.canvasHistory.push(currentState);
        
        if (this.canvasHistory.length > this.maxHistoryLength) {
            this.canvasHistory.shift();
        }
        
        this.canvasRedoHistory = [];
    }
    
    clearCanvas() {
        if (!this.ctx || !this.canvas) return;
        
        this.saveCanvasState();
        
        const dpr = window.devicePixelRatio || 1;
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, this.canvas.width / dpr, this.canvas.height / dpr);
        
        this.showMessage('画布已清空');
    }
    
    updateSetting(id, value) {
        const settingMap = {
            'theme-select': 'theme',
            'font-size': 'fontSize',
            'detailed-records': 'detailedRecords',
            'auto-save': 'autoSave'
        };
        
        const settingKey = settingMap[id];
        if (settingKey) {
            this.settings[settingKey] = value;
            this.saveSettings();
            this.applySettings();
        }
    }
    
    loadHistory() {
        const saved = localStorage.getItem('studyHistory');
        if (saved) {
            this.history = JSON.parse(saved);
            this.renderHistory();
        }
    }
    
    saveSnapshot() {
        const snapshot = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            algorithm: this.currentAlgorithm,
            input: document.getElementById('input-area')?.value || '',
            output: document.getElementById('output-area')?.value || '',
            canvas: this.canvas ? this.canvas.toDataURL() : null
        };
        
        this.history.unshift(snapshot);
        
        if (this.history.length > 50) {
            this.history = this.history.slice(0, 50);
        }
        
        localStorage.setItem('studyHistory', JSON.stringify(this.history));
        this.renderHistory();
    }
    
    renderHistory() {
        const list = document.getElementById('history-list');
        const count = document.getElementById('history-count');
        
        if (count) {
            count.textContent = `历史记录: ${this.history.length}条`;
        }
        
        if (!list) return;
        
        if (this.history.length === 0) {
            list.innerHTML = '<div class="history-empty">暂无历史记录</div>';
            return;
        }
        
        list.innerHTML = this.history.map(item => `
            <div class="history-item" data-id="${item.id}">
                <div class="history-item-header">
                    <span class="history-algorithm">${item.algorithm.toUpperCase()}</span>
                    <span class="history-time">${new Date(item.timestamp).toLocaleString()}</span>
                </div>
                <div class="history-item-preview">${item.input.substring(0, 30)}${item.input.length > 30 ? '...' : ''}</div>
                <div class="history-item-actions">
                    <button class="small-btn" onclick="studyMode.loadSnapshot(${item.id})">加载</button>
                    <button class="small-btn" onclick="studyMode.deleteSnapshot(${item.id})">删除</button>
                </div>
            </div>
        `).join('');
    }
    
    loadSnapshot(id) {
        const snapshot = this.history.find(h => h.id === id);
        if (!snapshot) return;
        
        this.switchAlgorithm(snapshot.algorithm);
        
        const inputArea = document.getElementById('input-area');
        const outputArea = document.getElementById('output-area');
        
        if (inputArea) inputArea.value = snapshot.input;
        if (outputArea) outputArea.value = snapshot.output || '';
        
        if (snapshot.canvas && this.ctx) {
            const img = new Image();
            img.onload = () => {
                this.ctx.drawImage(img, 0, 0);
            };
            img.src = snapshot.canvas;
        }
    }
    
    deleteSnapshot(id) {
        this.history = this.history.filter(h => h.id !== id);
        localStorage.setItem('studyHistory', JSON.stringify(this.history));
        this.renderHistory();
    }
}

const studyMode = new StudyMode();

export default studyMode;
