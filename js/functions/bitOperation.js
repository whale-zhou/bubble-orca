// 位运算功能模块
import { updateButtonStyles } from '../utils.js';

// 位运算可视化功能
function initBitOperation() {
    const calculateBtn = document.getElementById('bit-calculate-btn');
    const num1Input = document.getElementById('bit-num1');
    const num2Input = document.getElementById('bit-num2');
    const operatorBtns = document.querySelectorAll('.bit-operator-btn');
    const expressionEl = document.getElementById('bit-expression');
    const num1BinaryEl = document.getElementById('bit-num1-binary');
    const num2BinaryEl = document.getElementById('bit-num2-binary');
    const resultBinaryEl = document.getElementById('bit-result-binary');
    const resultDecimalEl = document.getElementById('bit-result-decimal');
    const resultHexEl = document.getElementById('bit-result-hex');
    const resultTypeEl = document.getElementById('bit-result-type');
    
    let currentOperator = '&';
    
    // 运算符按钮点击事件
    operatorBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            updateButtonStyles(operatorBtns, this);
            currentOperator = this.dataset.operator;
        });
    });
    
    // 计算按钮点击事件
    if (calculateBtn && num1Input && num2Input) {
        calculateBtn.addEventListener('click', function() {
            const num1Str = num1Input.value.trim();
            const num2Str = num2Input.value.trim();
            
            // 解析数字
            let num1, num2;
            try {
                num1 = parseInt(num1Str);
                num2 = parseInt(num2Str);
            } catch (e) {
                alert('请输入有效的数字');
                return;
            }
            
            if (isNaN(num1)) {
                alert('请输入数字1');
                return;
            }
            
            if (isNaN(num2) && currentOperator !== '~') {
                alert('请输入数字2');
                return;
            }
            
            // 32位无符号整数处理
            num1 = num1 >>> 0;
            num2 = num2 >>> 0;
            
            // 开始计时
            const startTime = performance.now();
            
            // 计算结果
            let result;
            let expression;
            let type;
            
            switch (currentOperator) {
                case '&':
                    result = num1 & num2;
                    expression = `${num1} & ${num2}`;
                    type = '按位与';
                    break;
                case '|':
                    result = num1 | num2;
                    expression = `${num1} | ${num2}`;
                    type = '按位或';
                    break;
                case '^':
                    result = num1 ^ num2;
                    expression = `${num1} ^ ${num2}`;
                    type = '按位异或';
                    break;
                case '~':
                    result = ~num1;
                    expression = `~${num1}`;
                    type = '按位非';
                    break;
                case '<<':
                    result = num1 << num2;
                    expression = `${num1} << ${num2}`;
                    type = '逻辑左移';
                    break;
                case '>>':
                    result = num1 >>> num2;
                    expression = `${num1} >>> ${num2}`;
                    type = '逻辑右移';
                    break;
                case 'circular_left':
                    result = (num1 << num2) | (num1 >>> (32 - num2));
                    expression = `${num1} 循环左移 ${num2} 位`;
                    type = '循环左移';
                    break;
                case 'circular_right':
                    result = (num1 >>> num2) | (num1 << (32 - num2));
                    expression = `${num1} 循环右移 ${num2} 位`;
                    type = '循环右移';
                    break;
            }
            
            // 32位无符号整数处理
            result = result >>> 0;
            
            // 转换为二进制
            const num1Binary = num1.toString(2).padStart(32, '0');
            const num2Binary = num2.toString(2).padStart(32, '0');
            const resultBinary = result.toString(2).padStart(32, '0');
            
            // 结束计时
            const endTime = performance.now();
            const elapsedTime = (endTime - startTime).toFixed(5);
            
            // 更新结果
            expressionEl.textContent = expression;
            num1BinaryEl.textContent = num1Binary;
            num2BinaryEl.textContent = currentOperator === '~' ? '-' : num2Binary;
            resultBinaryEl.textContent = resultBinary;
            resultDecimalEl.textContent = result;
            resultHexEl.textContent = result.toString(16).toUpperCase() + ` (耗时: ${elapsedTime}ms)`;
            resultTypeEl.textContent = type;
        });
    }
}

// 导出函数
export { initBitOperation };
