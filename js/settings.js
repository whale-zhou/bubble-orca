import { switchLanguage } from './language.js';
import { 
    STORAGE_KEYS, 
    DEFAULT_SETTINGS, 
    PARTICLE_CONFIG,
    MICRO_INTERACTION_DEFAULTS 
} from './config.js';

let currentParticleCount = parseInt(localStorage.getItem(STORAGE_KEYS.particleCount)) || DEFAULT_SETTINGS.particleCount;
let currentParticleMouseFollow = localStorage.getItem(STORAGE_KEYS.particleMouseFollow) !== 'false';

const microInteractionSettings = {
    gradientText: localStorage.getItem(STORAGE_KEYS.microGradientText) !== 'false',
    hoverFloat: localStorage.getItem(STORAGE_KEYS.microHoverFloat) !== 'false',
    glowBorder: localStorage.getItem(STORAGE_KEYS.microGlowBorder) !== 'false',
    ripple: localStorage.getItem(STORAGE_KEYS.microRipple) !== 'false',
    rotate3d: localStorage.getItem(STORAGE_KEYS.microRotate3d) !== 'false',
    radialGlow: localStorage.getItem(STORAGE_KEYS.microRadialGlow) !== 'false',
    shineSweep: localStorage.getItem(STORAGE_KEYS.microShineSweep) !== 'false'
};

function initSettings() {
    const settingsBtn = document.getElementById('settings-btn');
    const settingsPanel = document.getElementById('settings-panel');
    const closeBtn = document.getElementById('settings-close-btn');
    
    if (settingsBtn && settingsPanel) {
        settingsBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            settingsPanel.classList.toggle('show');
        });
        
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                settingsPanel.classList.remove('show');
            });
        }
        
        document.addEventListener('click', function(e) {
            if (settingsPanel.classList.contains('show') && 
                !settingsBtn.contains(e.target) && 
                !settingsPanel.contains(e.target)) {
                settingsPanel.classList.remove('show');
            }
        });
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                if (settingsPanel.classList.contains('show')) {
                    settingsPanel.classList.remove('show');
                } else {
                    settingsPanel.classList.add('show');
                }
            }
        });
    }
    
    initParticleSettings();
    initLanguageSettings();
    initMouseFollowSettings();
    initMicroInteractionSettings();
    applyMicroInteractionSettings();
}

function initParticleSettings() {
    const particleBtns = document.querySelectorAll('.particle-btn');
    
    particleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const count = parseInt(this.dataset.count);
            
            if (count === PARTICLE_CONFIG.counts.high) {
                showHighParticleConfirm(() => {
                    applyParticleSetting(count, particleBtns);
                });
            } else {
                applyParticleSetting(count, particleBtns);
            }
        });
    });
    
    updateParticleButtonState(particleBtns);
}

function applyParticleSetting(count, btns) {
    btns.forEach(b => {
        b.style.opacity = '0.6';
        b.style.background = '';
    });
    
    const activeBtn = document.querySelector(`.particle-btn[data-count="${count}"]`);
    if (activeBtn) {
        activeBtn.style.opacity = '1';
        activeBtn.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%)';
    }
    
    localStorage.setItem(STORAGE_KEYS.particleCount, count);
    currentParticleCount = count;
    
    updateParticles(count);
}

function updateParticleButtonState(btns) {
    const savedCount = parseInt(localStorage.getItem(STORAGE_KEYS.particleCount));
    let targetCount = savedCount;
    
    if (isNaN(targetCount)) {
        targetCount = DEFAULT_SETTINGS.particleCount;
    }
    
    btns.forEach(btn => {
        const count = parseInt(btn.dataset.count);
        if (count === targetCount) {
            btn.style.opacity = '1';
            btn.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%)';
        } else {
            btn.style.opacity = '0.6';
            btn.style.background = '';
        }
    });
}

function showHighParticleConfirm(onConfirm) {
    const existingModal = document.getElementById('particle-confirm-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modal = document.createElement('div');
    modal.id = 'particle-confirm-modal';
    modal.className = 'fixed inset-0 bg-black/70 flex items-center justify-center z-[9999]';
    modal.innerHTML = `
        <div class="glass-modal p-6 max-w-md mx-4 text-center">
            <div class="text-4xl mb-4">⚠️</div>
            <h3 class="text-xl font-bold mb-3 gradient-text">性能提示</h3>
            <p class="text-gray-300 mb-6 leading-relaxed">
                高粒子数量（200个）可能会在部分设备上造成卡顿或性能下降，特别是在低配置电脑或移动设备上。
                <br><br>
                确定要开启高粒子效果吗？
            </p>
            <div class="flex gap-3 justify-center">
                <button id="particle-confirm-cancel" class="glass-btn px-5 py-2.5 text-white font-medium">
                    取消
                </button>
                <button id="particle-confirm-ok" class="px-5 py-2.5 rounded-lg font-medium text-white transition-all"
                    style="background: linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%);">
                    确认开启
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    document.getElementById('particle-confirm-cancel').addEventListener('click', () => {
        modal.remove();
    });
    
    document.getElementById('particle-confirm-ok').addEventListener('click', () => {
        modal.remove();
        if (onConfirm) onConfirm();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function updateParticles(count) {
    const container = document.getElementById('particles-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (count === PARTICLE_CONFIG.counts.off) {
        return;
    }
    
    const particles = [];
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        particle.style.left = x + '%';
        particle.style.top = y + '%';
        
        const size = Math.random() * (PARTICLE_CONFIG.size.max - PARTICLE_CONFIG.size.min) + PARTICLE_CONFIG.size.min;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        const hue = Math.random() * (PARTICLE_CONFIG.color.hueMax - PARTICLE_CONFIG.color.hueMin) + PARTICLE_CONFIG.color.hueMin;
        const brightness = Math.random() * (PARTICLE_CONFIG.color.brightnessMax - PARTICLE_CONFIG.color.brightnessMin) + PARTICLE_CONFIG.color.brightnessMin;
        particle.style.backgroundColor = `hsla(${hue}, 70%, ${brightness}%, 0.8)`;
        particle.style.boxShadow = `0 0 ${size * 2}px hsla(${hue}, 70%, ${brightness}%, 0.8)`;
        
        particle.style.animationDelay = Math.random() * 2 + 's';
        particle.style.animationDuration = (Math.random() * (PARTICLE_CONFIG.animation.durationMax - PARTICLE_CONFIG.animation.durationMin) + PARTICLE_CONFIG.animation.durationMin) + 's';
        
        particle.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
        
        container.appendChild(particle);
        particles.push({ element: particle, x, y, size, hue, brightness });
    }
    
    if (currentParticleMouseFollow) {
        setupMouseFollow(particles);
    }
}

function setupMouseFollow(particles) {
    let mouseX = 0, mouseY = 0;
    let isMouseMoving = false;
    
    document.addEventListener('mousemove', function(e) {
        const container = document.getElementById('particles-container');
        if (!container) return;
        
        const rect = container.getBoundingClientRect();
        mouseX = ((e.clientX - rect.left) / rect.width) * 100;
        mouseY = ((e.clientY - rect.top) / rect.height) * 100;
        isMouseMoving = true;
        
        clearTimeout(window.mouseTimeout);
        window.mouseTimeout = setTimeout(() => {
            isMouseMoving = false;
        }, 2000);
    });
    
    function updateParticlesAnimation() {
        if (isMouseMoving) {
            const particlesToUpdate = particles.slice(0, PARTICLE_CONFIG.mouseFollow.maxParticles);
            particlesToUpdate.forEach(particle => {
                const dx = particle.x - mouseX;
                const dy = particle.y - mouseY;
                const distanceSquared = dx * dx + dy * dy;
                const radiusSquared = PARTICLE_CONFIG.mouseFollow.radius * PARTICLE_CONFIG.mouseFollow.radius;
                
                if (distanceSquared < radiusSquared) {
                    const distance = Math.sqrt(distanceSquared);
                    const force = (PARTICLE_CONFIG.mouseFollow.radius - distance) / PARTICLE_CONFIG.mouseFollow.radius;
                    const angle = Math.atan2(dy, dx);
                    const moveX = Math.cos(angle) * force * PARTICLE_CONFIG.mouseFollow.force;
                    const moveY = Math.sin(angle) * force * PARTICLE_CONFIG.mouseFollow.force;
                    
                    particle.element.style.transform = `translate(${moveX}px, ${moveY}px)`;
                    particle.element.style.opacity = 1;
                } else {
                    particle.element.style.transform = 'translate(0, 0)';
                    particle.element.style.opacity = 0.7;
                }
            });
        }
        
        requestAnimationFrame(updateParticlesAnimation);
    }
    
    updateParticlesAnimation();
}

function initLanguageSettings() {
    const langBtns = document.querySelectorAll('.lang-btn');
    
    langBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.dataset.lang;
            
            langBtns.forEach(b => {
                b.style.opacity = '0.6';
                b.style.background = '';
            });
            
            this.style.opacity = '1';
            this.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%)';
            
            switchLanguage(lang);
        });
    });
    
    const savedLang = localStorage.getItem(STORAGE_KEYS.language) || DEFAULT_SETTINGS.language;
    langBtns.forEach(btn => {
        if (btn.dataset.lang === savedLang) {
            btn.style.opacity = '1';
            btn.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%)';
        } else {
            btn.style.opacity = '0.6';
            btn.style.background = '';
        }
    });
}

function initMouseFollowSettings() {
    const toggle = document.getElementById('toggle-mouse-follow');
    if (!toggle) return;
    
    toggle.checked = localStorage.getItem(STORAGE_KEYS.particleMouseFollow) !== 'false';
    
    toggle.addEventListener('change', function() {
        const enabled = this.checked;
        localStorage.setItem(STORAGE_KEYS.particleMouseFollow, enabled);
        currentParticleMouseFollow = enabled;
        
        const savedCount = parseInt(localStorage.getItem(STORAGE_KEYS.particleCount)) || DEFAULT_SETTINGS.particleCount;
        updateParticles(savedCount);
    });
}

function initMicroInteractionSettings() {
    const toggles = {
        'toggle-gradient-text': STORAGE_KEYS.microGradientText,
        'toggle-hover-float': STORAGE_KEYS.microHoverFloat,
        'toggle-glow-border': STORAGE_KEYS.microGlowBorder,
        'toggle-ripple': STORAGE_KEYS.microRipple,
        'toggle-3d-rotate': STORAGE_KEYS.microRotate3d,
        'toggle-radial-glow': STORAGE_KEYS.microRadialGlow,
        'toggle-shine-sweep': STORAGE_KEYS.microShineSweep
    };
    
    Object.entries(toggles).forEach(([id, storageKey]) => {
        const toggle = document.getElementById(id);
        if (!toggle) return;
        
        toggle.checked = localStorage.getItem(storageKey) !== 'false';
        
        toggle.addEventListener('change', function() {
            const key = id.replace('toggle-', '').replace(/-/g, '');
            const settingKey = key === 'gradienttext' ? 'gradientText' :
                              key === 'hoverfloat' ? 'hoverFloat' :
                              key === 'glowborder' ? 'glowBorder' :
                              key === 'ripple' ? 'ripple' :
                              key === '3drotate' ? 'rotate3d' :
                              key === 'radialglow' ? 'radialGlow' :
                              'shineSweep';
            
            microInteractionSettings[settingKey] = this.checked;
            localStorage.setItem(storageKey, this.checked);
            applyMicroInteractionSettings();
        });
    });
}

function applyMicroInteractionSettings() {
    const body = document.body;
    
    if (!microInteractionSettings.gradientText) {
        body.classList.add('disable-gradient-text');
    } else {
        body.classList.remove('disable-gradient-text');
    }
    
    if (!microInteractionSettings.hoverFloat) {
        body.classList.add('disable-hover-float');
    } else {
        body.classList.remove('disable-hover-float');
    }
    
    if (!microInteractionSettings.glowBorder) {
        body.classList.add('disable-glow-border');
    } else {
        body.classList.remove('disable-glow-border');
    }
    
    if (!microInteractionSettings.ripple) {
        body.classList.add('disable-ripple');
    } else {
        body.classList.remove('disable-ripple');
    }
    
    if (!microInteractionSettings.rotate3d) {
        body.classList.add('disable-3d-rotate');
    } else {
        body.classList.remove('disable-3d-rotate');
    }
    
    if (!microInteractionSettings.radialGlow) {
        body.classList.add('disable-radial-glow');
    } else {
        body.classList.remove('disable-radial-glow');
    }
    
    if (!microInteractionSettings.shineSweep) {
        body.classList.add('disable-shine-sweep');
    } else {
        body.classList.remove('disable-shine-sweep');
    }
}

export { initSettings, updateParticles };
