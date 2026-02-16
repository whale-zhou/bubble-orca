// 主模块，用于初始化所有功能

// 导入配置和模块
import { currentLang } from './config.js';
import { initParticles } from './particles.js';
import { initSettings } from './settings.js';
import { updatePageContent } from './language.js';
import { initAsciiToBase, initBaseToAscii } from './functions/ascii.js';
import { initBitOperation } from './functions/bitOperation.js';
import { initShorAlgorithm } from './functions/shor.js';
import { updateButtonStyles } from './utils.js';

// 初始化应用
function initApp() {
    // 初始化粒子效果
    initParticles();
    
    // 初始化设置功能
    initSettings();
    
    // 初始化语言内容
    updatePageContent();
    
    // 初始化功能模块
    initAsciiToBase();
    initBaseToAscii();
    initBitOperation();
    initShorAlgorithm();
    
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
    
    if (encryptBtn && textInput) {
        encryptBtn.addEventListener('click', function() {
            const text = textInput.value;
            if (text) {
                // 开始计时
                const startTime = performance.now();
                
                // 直接使用Web Crypto API进行SHA-256哈希
                async function sha256(text) {
                    const encoder = new TextEncoder();
                    const data = encoder.encode(text);
                    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
                    const hashArray = Array.from(new Uint8Array(hashBuffer));
                    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
                }
                
                sha256(text).then(hash => {
                    // 结束计时
                    const endTime = performance.now();
                    const elapsedTime = (endTime - startTime).toFixed(5);
                    
                    resultText.textContent = text;
                    resultHash.textContent = hash + ` (耗时: ${elapsedTime}ms)`;
                });
            } else {
                alert('请输入要加密的文本');
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
