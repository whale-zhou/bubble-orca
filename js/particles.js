// 粒子效果模块
import { particleCount, particleMouseFollow } from './config.js';

// 初始化粒子效果
function initParticles() {
    const container = document.getElementById('particles-container');
    if (!container) return;
    
    const particles = [];
    let mouseX = 0, mouseY = 0;
    let isMouseMoving = false;
    
    // 创建粒子
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // 随机位置
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        particle.style.left = x + '%';
        particle.style.top = y + '%';
        
        // 随机大小（1-2px）
        const size = Math.random() * 1 + 1;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        // 随机颜色（蓝色系渐变）
        const hue = Math.random() * 30 + 190; // 蓝色到青色范围
        const brightness = Math.random() * 20 + 75;
        particle.style.backgroundColor = `hsla(${hue}, 70%, ${brightness}%, 0.8)`;
        particle.style.boxShadow = `0 0 ${size * 2}px hsla(${hue}, 70%, ${brightness}%, 0.8)`;
        
        // 随机动画延迟和持续时间
        particle.style.animationDelay = Math.random() * 2 + 's';
        particle.style.animationDuration = (Math.random() * 2 + 1) + 's';
        
        // 添加过渡效果
        particle.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
        
        container.appendChild(particle);
        particles.push({ element: particle, x, y, size, hue, brightness });
    }
    
    // 监听鼠标移动
    document.addEventListener('mousemove', function(e) {
        const rect = container.getBoundingClientRect();
        mouseX = ((e.clientX - rect.left) / rect.width) * 100;
        mouseY = ((e.clientY - rect.top) / rect.height) * 100;
        isMouseMoving = true;
        
        // 2秒后如果鼠标没有移动，停止更新
        clearTimeout(window.mouseTimeout);
        window.mouseTimeout = setTimeout(() => {
            isMouseMoving = false;
        }, 2000);
    });
    
    // 鼠标跟随效果（仅在鼠标移动时更新，减少计算量）
    function updateParticles() {
        if (isMouseMoving && particleMouseFollow) {
            // 只处理前50个粒子，进一步减少计算量
            const particlesToUpdate = particles.slice(0, 50);
            particlesToUpdate.forEach(particle => {
                const dx = particle.x - mouseX;
                const dy = particle.y - mouseY;
                const distanceSquared = dx * dx + dy * dy;
                
                // 当鼠标靠近时，粒子产生排斥效果
                // 使用平方距离避免开方运算，提高性能
                if (distanceSquared < 625) { // 25^2
                    const distance = Math.sqrt(distanceSquared);
                    const force = (25 - distance) / 25;
                    const angle = Math.atan2(dy, dx);
                    const moveX = Math.cos(angle) * force * 3;
                    const moveY = Math.sin(angle) * force * 3;
                    
                    particle.element.style.transform = `translate(${moveX}px, ${moveY}px)`;
                    particle.element.style.opacity = 1;
                } else {
                    // 鼠标远离时，粒子回到原位
                    particle.element.style.transform = 'translate(0, 0)';
                    particle.element.style.opacity = 0.7;
                }
            });
        }
        
        requestAnimationFrame(updateParticles);
    }
    
    // 启动鼠标跟随效果
    updateParticles();
}

// 导出函数
export { initParticles };
