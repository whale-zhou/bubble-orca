// 设置功能模块
import { switchLanguage } from './language.js';
import { particleCount, particleMouseFollow } from './config.js';

// 初始化设置功能
function initSettings() {
    const settingsBtn = document.getElementById('settings-btn');
    const settingsPanel = document.getElementById('settings-panel');
    
    if (settingsBtn && settingsPanel) {
        settingsBtn.addEventListener('click', function() {
            settingsPanel.classList.toggle('show');
        });
        
        // 点击页面其他地方关闭设置面板
        document.addEventListener('click', function(e) {
            if (!settingsBtn.contains(e.target) && !settingsPanel.contains(e.target)) {
                settingsPanel.classList.remove('show');
            }
        });
    }
    
    // 粒子数量设置 - 仅保留UI点击功能
    const particleCountBtns = document.querySelectorAll('.setting-item:nth-child(1) .setting-btn');
    particleCountBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            particleCountBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // 语言切换设置
    const languageBtns = document.querySelectorAll('.setting-item:nth-child(2) .setting-btn');
    languageBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            languageBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            if (this.textContent === '中文') {
                switchLanguage('zh-CN');
            } else if (this.textContent === 'English') {
                switchLanguage('en');
            }
        });
    });
    
    // 粒子鼠标跟随设置 - 仅保留UI点击功能
    const mouseFollowBtns = document.querySelectorAll('.setting-item:nth-child(3) .setting-btn');
    mouseFollowBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            mouseFollowBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // 设置默认激活状态
    if (particleCountBtns.length > 0) {
        particleCountBtns[0].classList.add('active');
    }
    
    if (languageBtns.length > 0) {
        const currentLang = localStorage.getItem('language') || 'zh-CN';
        if (currentLang === 'zh-CN') {
            languageBtns[0].classList.add('active');
        } else {
            languageBtns[1].classList.add('active');
        }
    }
    
    if (mouseFollowBtns.length > 0) {
        mouseFollowBtns[0].classList.add('active');
    }
}

// 导出函数
export { initSettings };
