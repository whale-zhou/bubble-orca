// 语言切换模块
import { currentLang, translations, setCurrentLang } from './config.js';

// 切换语言函数
function switchLanguage(lang) {
    setCurrentLang(lang);
    
    // 更新语言选择器样式（如果元素存在）
    const languageOptions = document.querySelectorAll('.language-option');
    if (languageOptions.length > 0) {
        languageOptions.forEach(option => {
            option.classList.remove('active');
        });
        const activeOption = document.querySelector(`.${lang === 'zh-CN' ? 'zh-cn' : 'en'}-option`);
        if (activeOption) {
            activeOption.classList.add('active');
        }
    }
    
    // 更新页面内容
    updatePageContent();
}

// 更新页面内容
function updatePageContent() {
    const lang = currentLang;
    
    // 更新页面标题
    document.title = translations[lang]['app_title'];
}

// 导出函数
export { switchLanguage, updatePageContent };
