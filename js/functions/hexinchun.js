// 贺新春红包功能模块

// 安全警告：开发者验证哈希值
// 注意：前端存储敏感信息是不安全的，建议在生产环境中使用后端验证
// 此处使用环境变量或默认占位符
const DEV_HASH = window.DEV_HASH || '';

// 核心配置
const CONFIG = {
    version: '3.0.1',
    default: {
        password: '',
        redeemCode: '',
        redeemCodeUsed: false,
        redpacketLink: '',
        kouling: '',
        title: '泡泡鲸祝您新年快乐',
        blessing: '感谢对"泡泡鲸密码箱"及系列的支持，厦门回声矩阵祝您和家人身体健康，万事如意。愿风调雨顺，国泰民安。'
    }
};

// 生成随机兑换码
function generateRedeemCode() {
    const digits = '23456789';
    const letters = 'ABCDEFGHJKMNPQRSTUVWXYZ';
    const allChars = digits + letters;
    
    let code = '';
    code += digits.charAt(Math.floor(Math.random() * digits.length));
    code += letters.charAt(Math.floor(Math.random() * letters.length));
    
    for (let i = 0; i < 8; i++) {
        code += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }
    
    return code.split('').sort(() => Math.random() - 0.5).join('');
}

// HTML转义函数，防止XSS攻击
function escapeHtml(text) {
    if (typeof text !== 'string') return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Base64 编码函数（支持中文）
function base64Encode(str) {
    try {
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => String.fromCharCode('0x' + p1)));
    } catch (e) {
        console.error('Base64编码失败:', e);
        return null;
    }
}

// Base64 解码函数（支持中文）
function base64Decode(base64) {
    try {
        const cleanBase64 = base64.replace(/ /g, '+');
        return decodeURIComponent(atob(cleanBase64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
    } catch (e) {
        console.error('Base64解码失败:', e);
        return null;
    }
}

// 初始化贺新春功能
function initHexinchun() {
    // 元素获取
    const springBtn = document.getElementById('spring-btn');
    const springModal = document.getElementById('spring-modal');
    const closeSpringModal = document.getElementById('close-spring-modal');
    
    const newyearBtn = document.getElementById('newyear-btn');
    const redpacketModal = document.getElementById('redpacket-modal');
    const redeemStep = document.getElementById('redeem-step');
    const surpriseStep = document.getElementById('surprise-step');
    const redeemInput = document.getElementById('redeem-input');
    const redeemBtn = document.getElementById('redeem-btn');
    const blessingText = document.getElementById('blessing-text');
    const redpacketLink = document.getElementById('redpacket-link');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    
    const devModeText = document.getElementById('dev-mode-text');
    const devModal = document.getElementById('dev-modal');
    const devHashStep = document.getElementById('dev-hash-step');
    const devConfigStep = document.getElementById('dev-config-step');
    const devHashInput = document.getElementById('dev-hash-input');
    const devHashBtn = document.getElementById('dev-hash-btn');
    const closeDevModalBtns = document.querySelectorAll('.close-dev-modal');
    
    const configPassword = document.getElementById('config-password');
    const configCode = document.getElementById('config-code');
    const configLink = document.getElementById('config-link');
    const configBlessing = document.getElementById('config-blessing');
    const configSaveBtn = document.getElementById('config-save-btn');
    const configTip = document.getElementById('config-tip');
    
    // 从URL加载配置
    function loadConfigFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const configParam = urlParams.get('c');
        
        if (configParam) {
            const decodedStr = base64Decode(configParam);
            if (decodedStr) {
                try {
                    const urlConfig = JSON.parse(decodedStr);
                    const existingConfig = JSON.parse(localStorage.getItem('bubble_redpacket_config')) || {};
                    
                    if (existingConfig.redeemCode === '' && urlConfig.redeemCode) {
                        urlConfig.redeemCode = '';
                        urlConfig.redeemCodeUsed = true;
                    }
                    
                    const configToSave = {
                        ...CONFIG.default,
                        ...urlConfig,
                        redeemCodeUsed: urlConfig.redeemCodeUsed || false
                    };
                    localStorage.setItem('bubble_redpacket_config', JSON.stringify(configToSave));
                    localStorage.setItem('bubble_redpacket_version', CONFIG.version);
                    
                    window.history.replaceState({}, document.title, window.location.pathname);
                    
                    return configToSave;
                } catch (e) {
                    console.error('解析配置JSON失败:', e);
                    return null;
                }
            }
        }
        return null;
    }
    
    // 初始化配置
    const urlConfig = loadConfigFromUrl();
    const savedVersion = localStorage.getItem('bubble_redpacket_version');
    if (savedVersion !== CONFIG.version && !urlConfig) {
        localStorage.removeItem('bubble_redpacket_config');
        localStorage.setItem('bubble_redpacket_version', CONFIG.version);
    }
    
    let activeConfig = urlConfig || JSON.parse(localStorage.getItem('bubble_redpacket_config')) || CONFIG.default;
    
    // 调试信息
    console.log('=== 页面加载调试 ===');
    console.log('URL配置:', urlConfig);
    console.log('本地存储配置:', localStorage.getItem('bubble_redpacket_config'));
    console.log('最终使用的配置:', activeConfig);
    console.log('==================');
    
    // 回填配置到开发者页面
    if (configPassword) configPassword.value = activeConfig.password || '';
    if (configCode) configCode.value = activeConfig.redeemCode || '';
    if (configLink) configLink.value = activeConfig.redpacketLink || '';
    const configKoulingInit = document.getElementById('config-kouling');
    if (configKoulingInit) configKoulingInit.value = activeConfig.kouling || '';
    const configTitleInit = document.getElementById('config-title');
    if (configTitleInit) configTitleInit.value = activeConfig.title || '';
    if (configBlessing) configBlessing.value = activeConfig.blessing || '';
    
    // 暗号/兑换码互斥切换
    const passwordOverlay = document.getElementById('password-overlay');
    const codeOverlay = document.getElementById('code-overlay');
    
    function updateModeDisplay() {
        const hasPassword = configPassword && configPassword.value.trim();
        const hasCode = configCode && configCode.value.trim();
        
        if (passwordOverlay && codeOverlay) {
            if (hasCode && !hasPassword) {
                passwordOverlay.style.display = 'flex';
                codeOverlay.style.display = 'none';
                if (configPassword) configPassword.placeholder = '';
            } else if (hasPassword && !hasCode) {
                passwordOverlay.style.display = 'none';
                codeOverlay.style.display = 'flex';
                if (configCode) configCode.placeholder = '';
            } else {
                passwordOverlay.style.display = 'none';
                codeOverlay.style.display = 'none';
                if (configPassword) configPassword.placeholder = '设置一个暗号，如：2026新年快乐';
                if (configCode) configCode.placeholder = '点击按钮随机生成';
            }
        }
    }
    
    if (configPassword) {
        configPassword.addEventListener('input', () => {
            if (configPassword.value.trim() && configCode) {
                configCode.value = '';
            }
            updateModeDisplay();
        });
    }
    
    const generateCodeBtn = document.getElementById('generate-code-btn');
    if (generateCodeBtn) {
        generateCodeBtn.addEventListener('click', () => {
            setTimeout(() => {
                if (configCode.value.trim() && configPassword) {
                    configPassword.value = '';
                }
                updateModeDisplay();
            }, 10);
        });
    }
    
    if (passwordOverlay) {
        passwordOverlay.addEventListener('click', () => {
            if (configCode) configCode.value = '';
            updateModeDisplay();
            if (configPassword) configPassword.focus();
        });
    }
    
    if (codeOverlay) {
        codeOverlay.addEventListener('click', () => {
            if (configPassword) configPassword.value = '';
            updateModeDisplay();
        });
    }
    
    updateModeDisplay();
    
    // 历史记录功能
    function getHistory(key) {
        const history = localStorage.getItem(key);
        return history ? JSON.parse(history) : [];
    }
    
    function addHistory(key, value, extra = {}) {
        const history = getHistory(key);
        const now = new Date();
        const timeStr = `${now.getMonth() + 1}/${now.getDate()} ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        const existingIndex = history.findIndex(item => item.value === value);
        if (existingIndex !== -1) {
            history.splice(existingIndex, 1);
        }
        
        history.unshift({ value, time: timeStr, ...extra });
        
        if (history.length > 20) {
            history.pop();
        }
        
        localStorage.setItem(key, JSON.stringify(history));
    }
    
    function renderHistory(panelId, historyKey, inputId, showStatus = false) {
        const panel = document.getElementById(panelId);
        if (!panel) return;
        
        const historyList = panel.querySelector('.history-list');
        if (!historyList) return;
        
        const history = getHistory(historyKey);
        if (history.length === 0) {
            historyList.innerHTML = '<p style="color: #6b7280; font-size: 13px; text-align: center;">暂无历史记录</p>';
            return;
        }
        
        historyList.innerHTML = history.map((item, index) => {
            let statusBadge = '';
            if (showStatus) {
                const isCurrentCode = item.value === activeConfig.redeemCode;
                const isUsed = isCurrentCode ? activeConfig.redeemCodeUsed : (item.used || false);
                statusBadge = isUsed 
                    ? '<span style="color: #ef4444; font-size: 11px;">已使用</span>' 
                    : '<span style="color: #22c55e; font-size: 11px;">未使用</span>';
            }
            const escapedValue = escapeHtml(item.value);
            const displayValue = escapedValue.length > 30 ? escapedValue.substring(0, 30) + '...' : escapedValue;
            const escapedTime = escapeHtml(item.time);
            return `
                <div class="history-item" data-index="${index}" data-history-key="${historyKey}" style="display: flex; justify-content: space-between; align-items: center; padding: 8px; margin-bottom: 5px; background: rgba(255,255,255,0.05); border-radius: 8px;">
                    <div class="history-item-value" style="flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #e5e7eb; font-size: 13px; cursor: pointer;" data-value="${escapedValue}">
                        ${displayValue}
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px; margin-left: 10px;">
                        ${statusBadge}
                        <span style="color: #9ca3af; font-size: 11px;">${escapedTime}</span>
                        <button class="delete-history-item" data-index="${index}" data-history-key="${historyKey}" style="padding: 2px 6px; border: none; border-radius: 4px; background: rgba(239, 68, 68, 0.2); color: #ef4444; font-size: 11px; cursor: pointer;">×</button>
                    </div>
                </div>
            `;
        }).join('');
        
        historyList.querySelectorAll('.history-item-value').forEach(el => {
            el.addEventListener('click', () => {
                const input = document.getElementById(inputId);
                if (input) input.value = el.dataset.value;
            });
        });
    }
    
    function deleteHistoryItem(historyKey, index) {
        const history = getHistory(historyKey);
        if (index >= 0 && index < history.length) {
            history.splice(index, 1);
            localStorage.setItem(historyKey, JSON.stringify(history));
        }
    }
    
    function clearAllHistory(historyKey) {
        localStorage.setItem(historyKey, JSON.stringify([]));
    }
    
    // 清空全部历史记录按钮
    document.querySelectorAll('.clear-history-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const historyKey = btn.getAttribute('data-history-key');
            if (confirm('你确定要清空全部历史记录吗？')) {
                clearAllHistory(historyKey);
                const panelIdMap = {
                    'history_password': 'password-history',
                    'history_code': 'code-history',
                    'history_link': 'link-history',
                    'history_kouling': 'kouling-history',
                    'history_blessing': 'blessing-history',
                    'history_title': 'title-history'
                };
                const inputIdMap = {
                    'history_password': 'config-password',
                    'history_code': 'config-code',
                    'history_link': 'config-link',
                    'history_kouling': 'config-kouling',
                    'history_blessing': 'config-blessing',
                    'history_title': 'config-title'
                };
                const showStatusMap = {
                    'history_password': false,
                    'history_code': true,
                    'history_link': false,
                    'history_kouling': false,
                    'history_blessing': false,
                    'history_title': false
                };
                renderHistory(panelIdMap[historyKey], historyKey, inputIdMap[historyKey], showStatusMap[historyKey]);
            }
        });
    });
    
    // 删除单条历史记录
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-history-item')) {
            const historyKey = e.target.getAttribute('data-history-key');
            const index = parseInt(e.target.getAttribute('data-index'));
            if (confirm('你确定要删除该历史记录吗？')) {
                deleteHistoryItem(historyKey, index);
                const panelIdMap = {
                    'history_password': 'password-history',
                    'history_code': 'code-history',
                    'history_link': 'link-history',
                    'history_kouling': 'kouling-history',
                    'history_blessing': 'blessing-history',
                    'history_title': 'title-history'
                };
                const inputIdMap = {
                    'history_password': 'config-password',
                    'history_code': 'config-code',
                    'history_link': 'config-link',
                    'history_kouling': 'config-kouling',
                    'history_blessing': 'config-blessing',
                    'history_title': 'config-title'
                };
                const showStatusMap = {
                    'history_password': false,
                    'history_code': true,
                    'history_link': false,
                    'history_kouling': false,
                    'history_blessing': false,
                    'history_title': false
                };
                renderHistory(panelIdMap[historyKey], historyKey, inputIdMap[historyKey], showStatusMap[historyKey]);
            }
        }
    });
    
    // 展开/收起历史记录
    document.querySelectorAll('.toggle-arrow').forEach(arrow => {
        arrow.addEventListener('click', () => {
            const targetId = arrow.getAttribute('data-target');
            const panel = document.getElementById(targetId);
            if (panel) {
                const isHidden = panel.style.display === 'none';
                panel.style.display = isHidden ? 'block' : 'none';
                arrow.textContent = isHidden ? '▲ 收起' : '▼ 历史记录';
                
                if (isHidden) {
                    const historyKeyMap = {
                        'password-history': 'history_password',
                        'code-history': 'history_code',
                        'link-history': 'history_link',
                        'kouling-history': 'history_kouling',
                        'title-history': 'history_title',
                        'blessing-history': 'history_blessing'
                    };
                    const inputIdMap = {
                        'password-history': 'config-password',
                        'code-history': 'config-code',
                        'link-history': 'config-link',
                        'kouling-history': 'config-kouling',
                        'title-history': 'config-title',
                        'blessing-history': 'config-blessing'
                    };
                    renderHistory(targetId, historyKeyMap[targetId], inputIdMap[targetId], targetId === 'code-history');
                }
            }
        });
    });
    
    // 展开/收起新增面板
    document.querySelectorAll('.toggle-add').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const panel = document.getElementById(targetId);
            if (panel) {
                const isHidden = panel.style.display === 'none';
                panel.style.display = isHidden ? 'block' : 'none';
                const typeNames = {
                    'password-add': '暗号',
                    'code-add': '兑换码',
                    'link-add': '链接',
                    'kouling-add': '口令',
                    'title-add': '标题',
                    'blessing-add': '祝福语'
                };
                const typeName = typeNames[targetId] || '';
                btn.textContent = isHidden ? `- 收起` : `+ 新增${typeName}`;
            }
        });
    });
    
    // 新增兑换码生成按钮
    const generateNewCodeBtn = document.getElementById('generate-new-code-btn');
    const newCodeInput = document.getElementById('new-code-input');
    if (generateNewCodeBtn && newCodeInput) {
        generateNewCodeBtn.addEventListener('click', () => {
            newCodeInput.value = generateRedeemCode();
        });
    }
    
    // 保存新增内容按钮
    document.querySelectorAll('.save-new-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.getAttribute('data-type');
            const inputIdMap = {
                'password': 'new-password-input',
                'code': 'new-code-input',
                'link': 'new-link-input',
                'kouling': 'new-kouling-input',
                'title': 'new-title-input',
                'blessing': 'new-blessing-input'
            };
            const historyKeyMap = {
                'password': 'history_password',
                'code': 'history_code',
                'link': 'history_link',
                'kouling': 'history_kouling',
                'title': 'history_title',
                'blessing': 'history_blessing'
            };
            const mainInputIdMap = {
                'password': 'config-password',
                'code': 'config-code',
                'link': 'config-link',
                'kouling': 'config-kouling',
                'title': 'config-title',
                'blessing': 'config-blessing'
            };
            
            const input = document.getElementById(inputIdMap[type]);
            const mainInput = document.getElementById(mainInputIdMap[type]);
            
            if (input && mainInput) {
                const value = input.value.trim();
                if (!value) {
                    alert('请输入内容后再保存');
                    return;
                }
                
                addHistory(historyKeyMap[type], value, type === 'code' ? { used: false } : {});
                mainInput.value = value;
                input.value = '';
                
                const typeNames = {
                    'password': '暗号',
                    'code': '兑换码',
                    'link': '链接',
                    'kouling': '口令',
                    'title': '标题',
                    'blessing': '祝福语'
                };
                if (configTip) {
                    configTip.innerText = `✅ ${typeNames[type]}已添加并填充到输入框`;
                    setTimeout(() => {
                        if (configTip) configTip.innerText = '';
                    }, 2000);
                }
            }
        });
    });
    
    // 保存配置
    if (configSaveBtn) {
        configSaveBtn.addEventListener('click', () => {
            const configKouling = document.getElementById('config-kouling');
            const configTitle = document.getElementById('config-title');
            
            const passwordVal = configPassword.value.trim();
            const codeVal = configCode.value.trim();
            
            let finalPassword = '';
            let finalCode = '';
            if (passwordVal) {
                finalPassword = passwordVal;
            } else if (codeVal) {
                finalCode = codeVal;
            }
            
            const newConfig = {
                password: finalPassword,
                redeemCode: finalCode,
                redeemCodeUsed: false,
                redpacketLink: configLink.value.trim(),
                kouling: configKouling ? configKouling.value.trim() : '',
                title: configTitle ? configTitle.value.trim() : '',
                blessing: configBlessing.value.trim()
            };
            
            if (!newConfig.password && !newConfig.redeemCode) {
                if (configTip) configTip.innerText = '请填写暗号或兑换码（二选一）！';
                return;
            }
            if (!newConfig.redpacketLink) {
                if (configTip) configTip.innerText = '请填写支付宝红包链接！';
                return;
            }
            if (!newConfig.blessing) {
                if (configTip) configTip.innerText = '请填写祝福语！';
                return;
            }
            
            if (newConfig.password) addHistory('history_password', newConfig.password);
            if (newConfig.redeemCode) addHistory('history_code', newConfig.redeemCode, { used: false });
            addHistory('history_link', newConfig.redpacketLink);
            addHistory('history_kouling', newConfig.kouling);
            addHistory('history_title', newConfig.title);
            addHistory('history_blessing', newConfig.blessing);
            
            localStorage.setItem('bubble_redpacket_config', JSON.stringify(newConfig));
            activeConfig = newConfig;
            if (configTip) configTip.innerText = '✅ 配置保存成功！已经生效啦~';
            
            updateModeDisplay();
            
            setTimeout(() => {
                if (configTip) configTip.innerText = '';
            }, 3000);
        });
    }
    
    // 生成分享链接
    const generateShareLinkBtn = document.getElementById('generate-share-link-btn');
    const shareLinkContainer = document.getElementById('share-link-container');
    const shareLinkInput = document.getElementById('share-link-input');
    const copyShareLinkBtn = document.getElementById('copy-share-link-btn');
    const shareLinkTip = document.getElementById('share-link-tip');
    const closeShareLink = document.getElementById('close-share-link');
    
    if (closeShareLink) {
        closeShareLink.addEventListener('click', () => {
            if (shareLinkContainer) shareLinkContainer.style.display = 'none';
        });
    }
    
    if (generateShareLinkBtn) {
        generateShareLinkBtn.addEventListener('click', () => {
            const configKouling = document.getElementById('config-kouling');
            const configTitle = document.getElementById('config-title');
            const currentConfig = {
                password: configPassword.value.trim(),
                redeemCode: configCode.value.trim(),
                redpacketLink: configLink.value.trim(),
                kouling: configKouling ? configKouling.value.trim() : '',
                title: configTitle ? configTitle.value.trim() : '',
                blessing: configBlessing.value.trim()
            };
            
            if (!currentConfig.password && !currentConfig.redeemCode) {
                if (configTip) configTip.innerText = '请先填写暗号或兑换码（二选一）！';
                return;
            }
            if (!currentConfig.redpacketLink) {
                if (configTip) configTip.innerText = '请先填写支付宝红包链接！';
                return;
            }
            if (!currentConfig.blessing) {
                if (configTip) configTip.innerText = '请先填写祝福语！';
                return;
            }
            
            const configStr = JSON.stringify(currentConfig);
            const encodedConfig = base64Encode(configStr);
            
            if (!encodedConfig) {
                if (configTip) configTip.innerText = '生成链接失败，请重试！';
                return;
            }
            
            const baseUrl = window.location.origin + window.location.pathname;
            const shareUrl = baseUrl + '?c=' + encodedConfig;
            
            if (shareLinkInput) shareLinkInput.value = shareUrl;
            if (shareLinkContainer) shareLinkContainer.style.display = 'block';
            if (shareLinkTip) shareLinkTip.innerText = '';
        });
    }
    
    if (copyShareLinkBtn) {
        copyShareLinkBtn.addEventListener('click', () => {
            if (shareLinkInput) {
                navigator.clipboard.writeText(shareLinkInput.value).then(() => {
                    if (shareLinkTip) {
                        shareLinkTip.innerText = '✅ 链接已复制，快去分享吧~';
                        setTimeout(() => {
                            shareLinkTip.innerText = '';
                        }, 2000);
                    }
                }).catch(() => {
                    shareLinkInput.select();
                    document.execCommand('copy');
                    if (shareLinkTip) {
                        shareLinkTip.innerText = '✅ 链接已复制，快去分享吧~';
                        setTimeout(() => {
                            shareLinkTip.innerText = '';
                        }, 2000);
                    }
                });
            }
        });
    }
    
    // 贺新春按钮点击
    if (springBtn && springModal) {
        springBtn.addEventListener('click', () => {
            springModal.style.display = 'flex';
        });
    }
    
    if (closeSpringModal && springModal) {
        closeSpringModal.addEventListener('click', () => {
            springModal.style.display = 'none';
        });
    }
    
    // 过年主按钮
    if (newyearBtn && redpacketModal) {
        newyearBtn.addEventListener('click', () => {
            springModal.style.display = 'none';
            redpacketModal.style.display = 'flex';
            if (redeemStep) redeemStep.style.display = 'block';
            if (surpriseStep) surpriseStep.style.display = 'none';
            if (redeemInput) redeemInput.value = '';
        });
    }
    
    // 开发者模式
    if (devModeText && devModal) {
        devModeText.addEventListener('click', () => {
            springModal.style.display = 'none';
            devModal.style.display = 'flex';
            if (devHashStep) devHashStep.style.display = 'block';
            if (devConfigStep) devConfigStep.style.display = 'none';
            if (devHashInput) devHashInput.value = '';
        });
    }
    
    // 开发者密码验证
    if (devHashBtn && devHashInput) {
        devHashBtn.addEventListener('click', () => {
            const inputHash = devHashInput.value.trim();
            if (inputHash === DEV_HASH && DEV_HASH) {
                if (devHashStep) devHashStep.style.display = 'none';
                if (devConfigStep) devConfigStep.style.display = 'block';
            } else {
                alert('密码错误，请重试');
            }
        });
    }
    
    // 兑换码生成按钮
    const generateCodeBtnMain = document.getElementById('generate-code-btn');
    if (generateCodeBtnMain && configCode) {
        generateCodeBtnMain.addEventListener('click', () => {
            configCode.value = generateRedeemCode();
        });
    }
    
    // 暗号或兑换码校验
    if (redeemBtn) {
        redeemBtn.addEventListener('click', () => {
            const inputCode = redeemInput.value.trim();
            
            console.log('=== 调试信息 ===');
            console.log('输入的暗号:', inputCode);
            console.log('配置中的暗号:', activeConfig.password);
            console.log('完整配置:', activeConfig);
            console.log('================');
            
            if (inputCode === activeConfig.password) {
                if (redeemStep) redeemStep.style.display = 'none';
                if (surpriseStep) surpriseStep.style.display = 'block';
                const titleElement = document.querySelector('#surprise-step h3');
                if (titleElement && activeConfig.title) {
                    titleElement.innerText = '🧧 ' + activeConfig.title + ' 🧧';
                }
                if (blessingText) blessingText.innerText = activeConfig.blessing;
                if (redpacketLink) redpacketLink.href = activeConfig.redpacketLink;
                const koulingValue = document.getElementById('kouling-value');
                const koulingText = document.getElementById('kouling-text');
                if (koulingValue && activeConfig.kouling) {
                    koulingValue.innerText = activeConfig.kouling;
                    if (koulingText) koulingText.style.display = 'block';
                } else if (koulingText) {
                    koulingText.style.display = 'none';
                }
            }
            else if (inputCode === activeConfig.redeemCode && activeConfig.redeemCode) {
                activeConfig.redeemCode = '';
                activeConfig.redeemCodeUsed = true;
                localStorage.setItem('bubble_redpacket_config', JSON.stringify(activeConfig));
                
                if (redeemStep) redeemStep.style.display = 'none';
                if (surpriseStep) surpriseStep.style.display = 'block';
                const titleElement = document.querySelector('#surprise-step h3');
                if (titleElement && activeConfig.title) {
                    titleElement.innerText = '🧧 ' + activeConfig.title + ' 🧧';
                }
                if (blessingText) blessingText.innerText = activeConfig.blessing;
                if (redpacketLink) redpacketLink.href = activeConfig.redpacketLink;
                const koulingValue = document.getElementById('kouling-value');
                const koulingText = document.getElementById('kouling-text');
                if (koulingValue && activeConfig.kouling) {
                    koulingValue.innerText = activeConfig.kouling;
                    if (koulingText) koulingText.style.display = 'block';
                } else if (koulingText) {
                    koulingText.style.display = 'none';
                }
            }
            else if (inputCode === activeConfig.redeemCode && !activeConfig.redeemCode) {
                alert('这个兑换码已经被使用过了哦😾');
            }
            else {
                alert('暗号或兑换码不对哦，再检查一下吧😾');
            }
        });
    }
    
    // 复制口令按钮
    const copyKoulingBtn = document.getElementById('copy-kouling-btn');
    const copyTip = document.getElementById('copy-tip');
    if (copyKoulingBtn) {
        copyKoulingBtn.addEventListener('click', () => {
            const kouling = activeConfig.kouling || '';
            if (kouling) {
                navigator.clipboard.writeText(kouling).then(() => {
                    if (copyTip) {
                        copyTip.innerText = '✅ 口令已复制';
                        setTimeout(() => {
                            copyTip.innerText = '';
                        }, 2000);
                    }
                }).catch(() => {
                    alert('复制失败，请手动复制：' + kouling);
                });
            }
        });
    }
    
    // 关闭弹窗
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (redpacketModal) redpacketModal.style.display = 'none';
        });
    });
    
    closeDevModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (devModal) devModal.style.display = 'none';
        });
    });
}

// 导出函数
export { initHexinchun };
