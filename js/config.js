// ========================================
// 泡泡鲸密码箱 - 全局配置文件
// ========================================

// 应用信息
export const APP_CONFIG = {
    name: '泡泡鲸密码箱',
    nameEn: 'BubbleOrca CryptoBox',
    version: 'v2.2.0',
    author: 'BubbleOrca',
    copyright: '© 2026 泡泡鲸密码箱 | 请勿侵权',
    repository: 'https://github.com/whale-zhou/bubble-orca'
};

// 默认设置
export const DEFAULT_SETTINGS = {
    language: 'zh-CN',
    theme: 'dark',
    particleCount: 100,
    particleMouseFollow: true
};

// 粒子系统配置
export const PARTICLE_CONFIG = {
    counts: {
        off: 0,
        low: 50,
        medium: 100,
        high: 200
    },
    size: {
        min: 1,
        max: 2
    },
    color: {
        hueMin: 190,
        hueMax: 220,
        brightnessMin: 75,
        brightnessMax: 95
    },
    animation: {
        durationMin: 1,
        durationMax: 3
    },
    mouseFollow: {
        maxParticles: 50,
        radius: 25,
        force: 3
    }
};

// 微交互默认设置
export const MICRO_INTERACTION_DEFAULTS = {
    gradientText: true,
    hoverFloat: true,
    glowBorder: true,
    ripple: true,
    rotate3d: true,
    radialGlow: true,
    shineSweep: true
};

// 主题配置
export const THEME_CONFIG = {
    dark: {
        bg: '#0a0e27',
        text: '#ffffff',
        cardBg: '#1a1f3a',
        border: '#2d3748',
        shadow: 'rgba(0, 0, 0, 0.5)'
    },
    light: {
        bg: '#f8f9fa',
        text: '#212529',
        cardBg: '#ffffff',
        border: '#dee2e6',
        shadow: 'rgba(0, 0, 0, 0.1)'
    }
};

// 玻璃态效果配置
export const GLASS_CONFIG = {
    blur: {
        card: 20,
        featureCard: 25,
        button: 10,
        input: 10,
        modal: 30,
        result: 15,
        nav: 20
    },
    saturate: {
        card: 180,
        featureCard: 200,
        modal: 150
    },
    borderRadius: {
        card: 20,
        featureCard: 24,
        button: 12,
        input: 12,
        modal: 24,
        result: 16
    }
};

// 动画配置
export const ANIMATION_CONFIG = {
    duration: {
        fast: 0.2,
        normal: 0.3,
        slow: 0.5,
        verySlow: 1
    },
    easing: {
        ease: 'ease',
        easeIn: 'ease-in',
        easeOut: 'ease-out',
        easeInOut: 'ease-in-out',
        cubicBezier: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)'
    }
};

// 功能模块配置
export const FEATURE_CONFIG = {
    asciiToBase: {
        maxLength: 1,
        placeholder: '例如：A, a, 1, !'
    },
    baseToAscii: {
        types: ['binary', 'decimal', 'hex'],
        placeholder: {
            binary: '例如：1100001',
            decimal: '例如：97',
            hex: '例如：61'
        }
    },
    bitOperation: {
        operators: ['&', '|', '^', '~', '<<', '>>', 'circular_left', 'circular_right'],
        bitWidth: 32
    },
    shorAlgorithm: {
        maxNumber: 1000,
        warningThreshold: 1000
    },
    sha256: {
        animationStages: 6
    },
    hashSalt: {
        algorithms: ['sha256', 'sha1', 'md5'],
        saltLength: 16
    }
};

// API端点配置（预留）
export const API_CONFIG = {
    baseUrl: '',
    endpoints: {
        factorize: '/api/factorize',
        hash: '/api/hash'
    }
};

// 存储键名
export const STORAGE_KEYS = {
    language: 'language',
    theme: 'theme',
    particleCount: 'particleCount',
    particleMouseFollow: 'particleMouseFollow',
    microGradientText: 'micro-gradient-text',
    microHoverFloat: 'micro-hover-float',
    microGlowBorder: 'micro-glow-border',
    microRipple: 'micro-ripple',
    microRotate3d: 'micro-3d-rotate',
    microRadialGlow: 'micro-radial-glow',
    microShineSweep: 'micro-shine-sweep',
    developerMode: 'developerMode'
};

// 当前状态变量
let currentLang = localStorage.getItem(STORAGE_KEYS.language) || DEFAULT_SETTINGS.language;
let currentTheme = localStorage.getItem(STORAGE_KEYS.theme) || DEFAULT_SETTINGS.theme;
let particleCount = parseInt(localStorage.getItem(STORAGE_KEYS.particleCount)) || DEFAULT_SETTINGS.particleCount;
let particleMouseFollow = localStorage.getItem(STORAGE_KEYS.particleMouseFollow) !== 'false';

// 设置当前语言的函数
function setCurrentLang(lang) {
    currentLang = lang;
    localStorage.setItem(STORAGE_KEYS.language, lang);
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
        'welcome_title': `欢迎使用泡泡鲸密码箱<span class="text-[clamp(0.8rem,1.5vw,1.2rem)] ml-3 opacity-60">(版本号:${APP_CONFIG.version})</span>`,
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
        'footer_copyright': APP_CONFIG.copyright,
        'settings_title': '设置',
        'settings_background': '背景设置',
        'settings_particle_count': '背景粒子数量',
        'settings_particle_off': '关闭',
        'settings_particle_low': '低',
        'settings_particle_medium': '中',
        'settings_particle_high': '高',
        'settings_particle_mouse_follow': '粒子鼠标跟随',
        'settings_particle_mouse_follow_desc': '鼠标移动时粒子产生排斥效果',
        'settings_micro_interactions': '微交互设置',
        'settings_gradient_text': '字体渐变动画',
        'settings_gradient_text_desc': '标题文字颜色动态渐变',
        'settings_hover_float': '悬停上浮效果',
        'settings_hover_float_desc': '鼠标悬停时卡片上浮',
        'settings_glow_border': '发光边框效果',
        'settings_glow_border_desc': '卡片边框动态发光动画',
        'settings_ripple': '涟漪点击动画',
        'settings_ripple_desc': '按钮点击时涟漪扩散效果',
        'settings_rotate_3d': '3D旋转悬停',
        'settings_rotate_3d_desc': '卡片悬停时轻微3D旋转',
        'settings_radial_glow': '径向光晕效果',
        'settings_radial_glow_desc': '悬停时卡片中心光晕',
        'settings_shine_sweep': '光泽扫过动画',
        'settings_shine_sweep_desc': '悬停时光泽从左到右扫过',
        'settings_language': '语言设置',
        'settings_language_label': '界面语言',
        'performance_warning_title': '性能提示',
        'performance_warning_message': '高粒子数量（200个）可能会在部分设备上造成卡顿或性能下降，特别是在低配置电脑或移动设备上。确定要开启高粒子效果吗？',
        'btn_cancel': '取消',
        'btn_confirm': '确认开启'
    },
    'en': {
        'app_title': 'BubbleOrca CryptoBox',
        'nav_ascii_to_base': 'ASCII → Base',
        'nav_base_to_ascii': 'Base → ASCII',
        'nav_bit_operation': 'Bit Operation Visualization',
        'nav_shor_algorithm': 'Shor Algorithm',
        'nav_sha256_encrypt': 'SHA-256 Encryption',
        'nav_hash_salt': 'Hash Salt',
        'welcome_title': `Welcome to BubbleOrca CryptoBox<span class="text-[clamp(0.8rem,1.5vw,1.2rem)] ml-3 opacity-60">(Version: ${APP_CONFIG.version})</span>`,
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
        'footer_copyright': `© 2026 BubbleOrca CryptoBox | Do not infringe`,
        'settings_title': 'Settings',
        'settings_background': 'Background Settings',
        'settings_particle_count': 'Background Particle Count',
        'settings_particle_off': 'Off',
        'settings_particle_low': 'Low',
        'settings_particle_medium': 'Medium',
        'settings_particle_high': 'High',
        'settings_particle_mouse_follow': 'Particle Mouse Follow',
        'settings_particle_mouse_follow_desc': 'Particles repel when mouse moves',
        'settings_micro_interactions': 'Micro-interaction Settings',
        'settings_gradient_text': 'Gradient Text Animation',
        'settings_gradient_text_desc': 'Title text color dynamic gradient',
        'settings_hover_float': 'Hover Float Effect',
        'settings_hover_float_desc': 'Cards float up on hover',
        'settings_glow_border': 'Glow Border Effect',
        'settings_glow_border_desc': 'Card border dynamic glow animation',
        'settings_ripple': 'Ripple Click Animation',
        'settings_ripple_desc': 'Ripple spread effect on button click',
        'settings_rotate_3d': '3D Rotate Hover',
        'settings_rotate_3d_desc': 'Slight 3D rotation on card hover',
        'settings_radial_glow': 'Radial Glow Effect',
        'settings_radial_glow_desc': 'Center glow on card hover',
        'settings_shine_sweep': 'Shine Sweep Animation',
        'settings_shine_sweep_desc': 'Shine sweeps from left to right on hover',
        'settings_language': 'Language Settings',
        'settings_language_label': 'Interface Language',
        'performance_warning_title': 'Performance Warning',
        'performance_warning_message': 'High particle count (200) may cause lag or performance degradation on some devices, especially on low-spec computers or mobile devices. Are you sure you want to enable high particle effects?',
        'btn_cancel': 'Cancel',
        'btn_confirm': 'Confirm'
    }
};

// 导出配置
export { 
    currentLang, 
    currentTheme, 
    particleCount, 
    particleMouseFollow, 
    translations, 
    setCurrentLang 
};

export let lang = currentLang;
