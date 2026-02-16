// ASCII转换功能模块
import { updateButtonStyles } from '../utils.js';

// ASCII → 进制转换功能
function initAsciiToBase() {
    const convertBtn = document.getElementById('ascii-convert-btn');
    const charInput = document.getElementById('ascii-char');
    const resultChar = document.getElementById('ascii-result-char');
    const resultDecimal = document.getElementById('ascii-result-decimal');
    const resultBinary = document.getElementById('ascii-result-binary');
    const resultHex = document.getElementById('ascii-result-hex');
    
    if (convertBtn && charInput) {
        convertBtn.addEventListener('click', function() {
            const char = charInput.value.trim();
            if (char.length === 1) {
                // 开始计时
                const startTime = performance.now();
                
                const decimal = char.charCodeAt(0);
                const binary = decimal.toString(2);
                const hex = decimal.toString(16).toUpperCase();
                
                // 结束计时
                const endTime = performance.now();
                const elapsedTime = (endTime - startTime).toFixed(5);
                
                resultChar.textContent = char;
                resultDecimal.textContent = decimal;
                resultBinary.textContent = binary;
                resultHex.textContent = hex + ` (耗时: ${elapsedTime}ms)`;
            } else {
                alert('请输入单个ASCII字符');
            }
        });
    }
}

// 进制 → ASCII转换功能
function initBaseToAscii() {
    const convertBtn = document.getElementById('base-convert-btn');
    const valueInput = document.getElementById('base-value');
    const typeBtns = document.querySelectorAll('.base-type-btn');
    const resultValue = document.getElementById('base-result-value');
    const resultDecimal = document.getElementById('base-result-decimal');
    const resultChar = document.getElementById('base-result-char');
    const resultHex = document.getElementById('base-result-hex');
    
    let currentType = 'binary';
    
    // 类型按钮点击事件
    typeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            updateButtonStyles(typeBtns, this);
            currentType = this.dataset.type;
        });
    });
    
    // 转换按钮点击事件
    if (convertBtn && valueInput) {
        convertBtn.addEventListener('click', function() {
            const value = valueInput.value.trim();
            let decimal;
            
            try {
                // 开始计时
                const startTime = performance.now();
                
                switch (currentType) {
                    case 'binary':
                        decimal = parseInt(value, 2);
                        break;
                    case 'decimal':
                        decimal = parseInt(value, 10);
                        break;
                    case 'hex':
                        decimal = parseInt(value, 16);
                        break;
                }
                
                if (!isNaN(decimal) && decimal >= 0 && decimal <= 127) {
                    const char = String.fromCharCode(decimal);
                    const hex = decimal.toString(16).toUpperCase();
                    
                    // 结束计时
                    const endTime = performance.now();
                    const elapsedTime = (endTime - startTime).toFixed(5);
                    
                    resultValue.textContent = value;
                    resultDecimal.textContent = decimal;
                    resultChar.textContent = char;
                    resultHex.textContent = hex + ` (耗时: ${elapsedTime}ms)`;
                } else {
                    alert('请输入有效的数值（0-127）');
                }
            } catch (e) {
                alert('请输入有效的数值');
            }
        });
    }
}

// 导出函数
export { initAsciiToBase, initBaseToAscii };
