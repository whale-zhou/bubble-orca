// 主模块，用于初始化所有功能

// 导入配置和模块
import { currentLang, STORAGE_KEYS, DEFAULT_SETTINGS } from './config.js';
import { initSettings, updateParticles } from './settings.js';
import { updatePageContent } from './language.js';
import { initAsciiToBase, initBaseToAscii } from './functions/ascii.js';
import { initBitOperation } from './functions/bitOperation.js';
import { initFactorize } from './functions/factorize.js';
import { initShorAlgorithm } from './functions/shor.js';
import { initAlgorithmSwitch } from './functions/algorithmSwitch.js';
import { initHexinchun } from './functions/hexinchun.js';
import { updateButtonStyles } from './utils.js';
import { showSHA256Animation } from './functions/sha256Animation.js';
import voiceAssistant from './functions/voiceAssistant.js';
import gestureController from './functions/gestureController.js';

// 将 showSHA256Animation 暴露到全局
window.showSHA256Animation = showSHA256Animation;

// 通用错误提示函数
function showError(message, error) {
    console.error('Error:', error);
    const toast = document.createElement('div');
    toast.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-opacity duration-300';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// 初始化语音助手设置
function initVoiceAssistant() {
    const toggle = document.getElementById('toggle-voice-assistant');
    const statusEl = document.getElementById('voice-assistant-status');
    
    if (!toggle) return;
    
    const savedEnabled = localStorage.getItem('voiceAssistantEnabled') === 'true';
    const isFirstTime = localStorage.getItem('voiceAssistantFirstTime') !== 'false';
    toggle.checked = savedEnabled;
    
    if (savedEnabled && voiceAssistant.checkSupport()) {
        voiceAssistant.enable().then(success => {
            if (success && statusEl) {
                statusEl.textContent = '✅ 语音助手已启用 - 请说"泡泡鲸"唤醒';
                statusEl.style.color = '#22c55e';
                
                if (isFirstTime) {
                    localStorage.setItem('voiceAssistantFirstTime', 'false');
                    setTimeout(() => {
                        voiceAssistant.showWelcome();
                    }, 1000);
                }
            }
        });
    } else if (!voiceAssistant.checkSupport() && statusEl) {
        statusEl.textContent = '⚠️ 浏览器不支持语音识别，请使用Chrome或Edge';
        statusEl.style.color = '#f59e0b';
    }
    
    toggle.addEventListener('change', async function() {
        if (this.checked) {
            const success = await voiceAssistant.enable();
            if (success) {
                if (statusEl) {
                    statusEl.textContent = '✅ 语音助手已启用 - 请说"泡泡鲸"唤醒';
                    statusEl.style.color = '#22c55e';
                }
                
                const isFirstTimeNow = localStorage.getItem('voiceAssistantFirstTime') !== 'false';
                if (isFirstTimeNow) {
                    localStorage.setItem('voiceAssistantFirstTime', 'false');
                    setTimeout(() => {
                        voiceAssistant.showWelcome();
                    }, 500);
                }
            } else {
                this.checked = false;
                if (statusEl) {
                    statusEl.textContent = '❌ 需要麦克风权限';
                    statusEl.style.color = '#ef4444';
                }
            }
        } else {
            voiceAssistant.disable();
            if (statusEl) {
                statusEl.textContent = '语音助手已关闭';
                statusEl.style.color = '#9ca3af';
            }
        }
    });
    
    voiceAssistant.setOnCommand((command) => {
        console.log('收到语音命令:', command);
        handleVoiceCommand(command);
    });
}

// 初始化手势控制设置
async function initGestureControl() {
    const toggle = document.getElementById('toggle-gesture-control');
    const statusEl = document.getElementById('gesture-control-status');
    const togglesContainer = document.getElementById('gesture-toggles');
    
    if (!toggle) return;
    
    await gestureController.init();
    gestureController.setVoiceAssistant(voiceAssistant);
    gestureController.loadGestureSettings();
    
    const savedEnabled = localStorage.getItem('gestureControlEnabled') === 'true';
    toggle.checked = savedEnabled;
    
    if (savedEnabled) {
        gestureController.enable().then(success => {
            if (success && statusEl) {
                statusEl.textContent = '✅ 手势控制已启用';
                statusEl.style.color = '#22c55e';
                if (togglesContainer) togglesContainer.style.display = 'block';
            }
        });
    }
    
    toggle.addEventListener('change', async function() {
        if (this.checked) {
            const success = await gestureController.enable();
            if (success) {
                if (statusEl) {
                    statusEl.textContent = '✅ 手势控制已启用';
                    statusEl.style.color = '#22c55e';
                }
                if (togglesContainer) togglesContainer.style.display = 'block';
            } else {
                this.checked = false;
                if (statusEl) {
                    statusEl.textContent = '❌ 需要摄像头权限';
                    statusEl.style.color = '#ef4444';
                }
            }
        } else {
            gestureController.disable();
            if (statusEl) {
                statusEl.textContent = '手势控制已关闭';
                statusEl.style.color = '#9ca3af';
            }
            if (togglesContainer) togglesContainer.style.display = 'none';
        }
    });
    
    // 各手势开关
    const gestureToggles = {
        'gesture-fist': 'fist',
        'gesture-pinch': 'pinch',
        'gesture-zoom-out': 'zoom_out',
        'gesture-swipe': 'swipe',
        'gesture-clap': 'clap'
    };
    
    Object.entries(gestureToggles).forEach(([id, gesture]) => {
        const el = document.getElementById(id);
        if (el) {
            el.checked = gestureController.gestureEnabled[gesture];
            el.addEventListener('change', function() {
                gestureController.setGestureEnabled(gesture, this.checked);
            });
        }
    });
}

// 初始化快捷键
function initHotkeys() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'F1') {
            e.preventDefault();
            if (voiceAssistant.isEnabled) {
                voiceAssistant.showNeonBorder();
                voiceAssistant.speak('我在');
            } else {
                showError('请先开启语音助手', new Error('语音助手未启用'));
            }
        }
        
        if (e.key === 'F2') {
            e.preventDefault();
            const toggle = document.getElementById('toggle-gesture-control');
            if (toggle) {
                toggle.checked = !toggle.checked;
                toggle.dispatchEvent(new Event('change'));
            }
        }
    });
}

// 处理语音命令
function handleVoiceCommand(command) {
    const cmd = command.toLowerCase();
    
    if (cmd.includes('截图') || cmd.includes('截屏')) {
        document.body.style.border = '5px solid #ff00ff';
        setTimeout(() => document.body.style.border = '', 500);
        voiceAssistant.speak('已截图');
    } else if (cmd.includes('打开设置') || cmd.includes('设置')) {
        const panel = document.getElementById('settings-panel');
        if (panel) {
            panel.classList.add('show');
            voiceAssistant.speak('设置已打开');
        }
    } else if (cmd.includes('关闭')) {
        const panel = document.getElementById('settings-panel');
        if (panel) {
            panel.classList.remove('show');
            voiceAssistant.speak('已关闭');
        }
        voiceAssistant.hideNeonBorder();
    } else if (cmd.includes('滚动') && (cmd.includes('上') || cmd.includes('顶部'))) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        voiceAssistant.speak('已滚动到顶部');
    } else if (cmd.includes('滚动') && (cmd.includes('下') || cmd.includes('底部'))) {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        voiceAssistant.speak('已滚动到底部');
    } else if (cmd.includes('计算') || cmd.includes('开始')) {
        const calcBtn = document.querySelector('[onclick*="calculate"], #calculate-btn, .calculate-btn');
        if (calcBtn) {
            calcBtn.click();
            voiceAssistant.speak('开始计算');
        }
    }
}

// 初始化应用
function initApp() {
    // 初始化设置功能（包含粒子初始化）
    initSettings();
    
    // 根据保存的设置初始化粒子
    const savedCount = parseInt(localStorage.getItem(STORAGE_KEYS.particleCount));
    const particleCount = isNaN(savedCount) ? DEFAULT_SETTINGS.particleCount : savedCount;
    updateParticles(particleCount);
    
    // 初始化语言内容
    updatePageContent();
    
    // 初始化功能模块
    initAsciiToBase();
    initBaseToAscii();
    initBitOperation();
    
    // 初始化质数分解模块（Shor和经典算法）
    initShorAlgorithm();
    initFactorize();
    initAlgorithmSwitch();
    
    // 初始化贺新春红包功能
    initHexinchun();
    
    // 初始化语音助手
    initVoiceAssistant();
    
    // 初始化手势控制
    initGestureControl();
    
    // 初始化快捷键
    initHotkeys();
    
    // 初始化其他功能
    initSHA256();
    initHashSalt();
    
    // 初始化镂空标题滚动效果
    initMaskTitle();
}

// 初始化镂空标题滚动效果
function initMaskTitle() {
    const maskElement = document.getElementById('bubble-orca-mask');
    const mainContent = document.getElementById('main-content');
    
    if (!maskElement || !mainContent) return;
    
    // 初始显示标题
    maskElement.style.opacity = '1';
    maskElement.style.transform = 'scale(1) translateX(0)';
    
    // 滚动时更新标题效果
    function updateMaskEffect() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        
        // 计算滚动进度 (0 到 1)
        const progress = Math.min(scrollY / windowHeight, 1);
        
        // 标题淡出和缩放效果
        const opacity = 1 - progress;
        const scale = 1 + progress * 0.2;
        const translateY = progress * 50;
        
        maskElement.style.opacity = opacity.toString();
        maskElement.style.transform = `scale(${scale}) translateY(${translateY}px)`;
    }
    
    // 监听滚动事件
    window.addEventListener('scroll', updateMaskEffect, { passive: true });
    
    // 初始调用一次
    updateMaskEffect();
}

// SHA-256加密功能
function initSHA256() {
    const encryptBtn = document.getElementById('sha256-encrypt-btn');
    const textInput = document.getElementById('sha256-text');
    const resultText = document.getElementById('sha256-result-text');
    const resultHash = document.getElementById('sha256-result-hash');
    const viewAnimationBtn = document.getElementById('view-sha256-animation-btn');
    
    let lastHashedText = '';
    
    if (encryptBtn && textInput) {
        encryptBtn.addEventListener('click', function() {
            const text = textInput.value;
            if (text) {
                lastHashedText = text;
                
                const startTime = performance.now();
                
                async function sha256(text) {
                    const encoder = new TextEncoder();
                    const data = encoder.encode(text);
                    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
                    const hashArray = Array.from(new Uint8Array(hashBuffer));
                    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
                }
                
                sha256(text).then(hash => {
                    const endTime = performance.now();
                    const elapsedTime = (endTime - startTime).toFixed(5);
                    
                    resultText.textContent = text;
                    resultHash.textContent = hash + ` (耗时: ${elapsedTime}ms)`;
                    
                    if (viewAnimationBtn) {
                        viewAnimationBtn.style.display = 'inline-block';
                    }
                }).catch(error => {
                    showError('SHA-256加密失败，请重试', error);
                });
            } else {
                alert('请输入要加密的文本');
            }
        });
    }
    
    if (viewAnimationBtn) {
        viewAnimationBtn.addEventListener('click', function() {
            if (lastHashedText && typeof showSHA256Animation === 'function') {
                showSHA256Animation(lastHashedText);
            }
        });
    }
}

// 哈希盐功能
function initHashSalt() {
    const generateBtn = document.getElementById('hash-generate-btn');
    const textInput = document.getElementById('hash-text');
    const saltInput = document.getElementById('hash-salt-input');
    const generateSaltBtn = document.getElementById('hash-generate-salt-btn');
    const algorithmSelect = document.getElementById('hash-algorithm');
    const resultText = document.getElementById('hash-result-text');
    const resultSalt = document.getElementById('hash-result-salt');
    const resultAlgorithm = document.getElementById('hash-result-algorithm');
    const resultHash = document.getElementById('hash-result-hash');
    
    // 生成随机盐的函数
    function generateRandomSalt() {
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let salt = '';
        for (let i = 0; i < 8; i++) {
            salt += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        return salt;
    }
    
    // 简单的MD5实现
    function md5(text) {
        let hash = 0;
        for (let i = 0; i < text.length; i++) {
            const char = text.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(16).padStart(32, '0');
    }
    
    // 使用Web Crypto API进行哈希
    async function generateHash(text, algorithm) {
        const encoder = new TextEncoder();
        const data = encoder.encode(text);
        let hashBuffer;
        
        switch (algorithm) {
            case 'sha256':
                hashBuffer = await crypto.subtle.digest('SHA-256', data);
                break;
            case 'sha1':
                hashBuffer = await crypto.subtle.digest('SHA-1', data);
                break;
            case 'md5':
                return md5(text);
            default:
                hashBuffer = await crypto.subtle.digest('SHA-256', data);
        }
        
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
    
    if (generateBtn && textInput) {
        // 生成加盐哈希
        generateBtn.addEventListener('click', function() {
            const text = textInput.value;
            const salt = saltInput.value || generateRandomSalt();
            const algorithm = algorithmSelect.value;
            
            if (text) {
                const startTime = performance.now();
                const saltedText = text + salt;
                
                generateHash(saltedText, algorithm).then(hash => {
                    const endTime = performance.now();
                    const elapsedTime = (endTime - startTime).toFixed(5);
                    
                    resultText.textContent = text;
                    resultSalt.textContent = salt;
                    resultAlgorithm.textContent = algorithm.toUpperCase();
                    resultHash.textContent = hash + ` (耗时: ${elapsedTime}ms)`;
                }).catch(error => {
                    showError('哈希生成失败，请重试', error);
                });
            } else {
                alert('请输入要加密的文本');
            }
        });
    }
    
    // 生成随机盐（独立绑定，不依赖其他元素）
    if (generateSaltBtn && saltInput) {
        generateSaltBtn.addEventListener('click', function() {
            const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
            let salt = '';
            for (let i = 0; i < 16; i++) {
                salt += charset.charAt(Math.floor(Math.random() * charset.length));
            }
            saltInput.value = salt;
        });
    }
}

// 当DOM加载完成后初始化应用
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    // DOM已经加载完成，直接执行
    initApp();
}
