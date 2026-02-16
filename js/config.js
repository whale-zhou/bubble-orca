// 全局变量和配置
let currentLang = localStorage.getItem('language') || 'zh-CN';
let currentTheme = 'dark';
let particleCount = parseInt(localStorage.getItem('particleCount')) || 100;
let particleMouseFollow = localStorage.getItem('particleMouseFollow') === 'true' || true;

// 设置当前语言的函数
function setCurrentLang(lang) {
    currentLang = lang;
    localStorage.setItem('language', lang);
}

// 双语文本映射对象
const translations = {
    'zh-CN': {
        'app_title': '泡泡鲸密码箱',
        'nav_ascii_to_base': 'ASCII → 进制',
        'nav_base_to_ascii': '进制 → ASCII',
        'nav_bit_operation': '位运算可视化',
        'nav_shor_algorithm': 'Shor 算法',
        'nav_sha256_encrypt': 'SHA-256加密',
        'nav_hash_salt': '哈希盐',
        'welcome_title': '欢迎使用泡泡鲸密码箱<span class="text-[clamp(0.8rem,1.5vw,1.2rem)] ml-3 opacity-60">(版本号:v2.1.0)</span>',
        'welcome_desc': '在这里，进制转换、位运算、哈希函数、Shor 算法...所有抽象概念都将变成可交互的视觉直觉。专为初学者设计，无需前置知识，打开即玩，让密码学第一次接触就"浮出水面"。',
        'feature_ascii_to_base_title': 'ASCII → 进制',
        'feature_ascii_to_base_desc': '将单个ASCII字符转换为二进制、十进制和十六进制表示',
        'feature_base_to_ascii_title': '进制 → ASCII',
        'feature_base_to_ascii_desc': '将二进制、十进制或十六进制数值转换为对应的ASCII字符',
        'feature_bit_operation_title': '位运算可视化',
        'feature_bit_operation_desc': '直观展示位运算过程和结果，支持与、或、异或、非、左移、右移',
        'feature_shor_algorithm_title': 'Shor 算法',
        'feature_shor_algorithm_desc': '使用量子算法原理分解整数，展示因数分解过程和结果',
        'feature_sha256_encrypt_title': 'SHA-256加密',
        'feature_sha256_encrypt_desc': '将任意文本转换为SHA-256哈希值，支持各种长度的文本输入',
        'feature_hash_salt_title': '哈希盐',
        'feature_hash_salt_desc': '为密码添加随机盐值，增强哈希安全性，支持多种哈希算法',
        'footer_developer': '泡泡鲸密码箱',
        'footer_description': '支持ASCII转换、位运算可视化、Shor算法、SHA-256加密和哈希盐功能',
        'footer_copyright': '© 2026 泡泡鲸密码箱 | 请勿侵权'
    },
    'en': {
        'app_title': 'BubbleOrca CryptoBox',
        'nav_ascii_to_base': 'ASCII → Base',
        'nav_base_to_ascii': 'Base → ASCII',
        'nav_bit_operation': 'Bit Operation Visualization',
        'nav_shor_algorithm': 'Shor Algorithm',
        'nav_sha256_encrypt': 'SHA-256 Encryption',
        'nav_hash_salt': 'Hash Salt',
        'welcome_title': 'Welcome to BubbleOrca CryptoBox<span class="text-[clamp(0.8rem,1.5vw,1.2rem)] ml-3 opacity-60">(Version: v2.1.0)</span>',
        'welcome_desc': 'Here, base conversion, bit operations, hash functions, Shor algorithm... all abstract concepts become interactive visual intuition. Designed for beginners, no prior knowledge required, open and play, making cryptography "surface" at first contact!',
        'feature_ascii_to_base_title': 'ASCII → Base',
        'feature_ascii_to_base_desc': 'Convert a single ASCII character to binary, decimal, and hexadecimal representations',
        'feature_base_to_ascii_title': 'Base → ASCII',
        'feature_base_to_ascii_desc': 'Convert binary, decimal, or hexadecimal values to corresponding ASCII characters',
        'feature_bit_operation_title': 'Bit Operation Visualization',
        'feature_bit_operation_desc': 'Intuitively display bit operation processes and results, supporting AND, OR, XOR, NOT, left shift, right shift',
        'feature_shor_algorithm_title': 'Shor Algorithm',
        'feature_shor_algorithm_desc': 'Use quantum algorithm principles to factor integers, displaying factorization processes and results',
        'feature_sha256_encrypt_title': 'SHA-256 Encryption',
        'feature_sha256_encrypt_desc': 'Convert any text to SHA-256 hash value, supporting various text lengths',
        'feature_hash_salt_title': 'Hash Salt',
        'feature_hash_salt_desc': 'Add random salt to passwords, enhance hash security, support multiple hash algorithms',
        'footer_developer': 'BubbleOrca CryptoBox',
        'footer_description': 'Supports ASCII conversion, bit operation visualization, Shor algorithm, SHA-256 encryption and hash salt functionality',
        'footer_copyright': '© 2026 BubbleOrca CryptoBox | Do not infringe'
    }
};

// 导出配置
export { currentLang, currentTheme, particleCount, particleMouseFollow, translations, setCurrentLang };
export let lang = currentLang;
