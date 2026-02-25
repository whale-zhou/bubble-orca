// 算法切换模块
// 负责处理Shor算法和经典算法之间的切换逻辑

import { runShorFactorize } from './shor.js';
import { showQuantumCircuit } from './quantumCircuit.js';
import { showFactorizationPipeline } from './factorizePipeline.js';
import { showQuantumAnimation } from './quantumAnimation.js';

// 当前算法模式：true为Shor算法，false为经典算法
let isShorAlgorithm = true;

// 当前 Shor 算法参数（用于生成电路图）
let currentN = 0;
let currentA = 0;

// 当前经典算法输入（用于生成流水线图）
let currentClassicInput = '';

// 缓存的流水线数据
let cachedPipelineData = null;

// Worker 实例
let worker = null;
let currentTaskId = 0;
let isCalculating = false;

// Shor算法说明HTML
const shorInfoHTML = `
    <h3 class="text-xl font-bold mb-4 gradient-text">关于 Shor 算法</h3>
    <p class="text-gray-300 mb-4">Shor 算法是一种<strong>量子算法</strong>，由 Peter Shor 于 1994 年提出，用于<strong>质数分解</strong>。该算法在量子计算机上可以指数级地加速质数分解过程，对 RSA 加密有重大影响。</p>
    <p class="text-gray-300 mb-4"><strong>⚠️ 注意：本实现是真正的量子模拟版本</strong>，模拟了量子态叠加和量子傅里叶变换。由于经典计算机的限制，输入限制在 <strong>1000 以内</strong>。</p>
    <p class="text-gray-300 mb-4">Shor算法的核心步骤：</p>
    <ul class="text-gray-300 list-disc list-inside mb-4">
        <li>随机选择 a < N</li>
        <li>计算 gcd(a, N)</li>
        <li>使用量子周期查找找到 a^r ≡ 1 (mod N) 的周期 r</li>
        <li>如果 r 是偶数，计算 gcd(a^(r/2) ± 1, N) 得到因子</li>
    </ul>
    <p class="text-gray-300">例如：输入 15 → 可能输出 15 = 3 × 5</p>
`;

// 经典算法说明HTML
const classicInfoHTML = `
    <h3 class="text-xl font-bold mb-4 gradient-text">关于 经典质数分解</h3>
    <p class="text-gray-300 mb-4">经典质数分解算法使用传统数学方法，包括试除法、Pollard's Rho算法和费马分解法。适合处理较大的整数。</p>
    <p class="text-gray-300 mb-4">本实现支持：</p>
    <ul class="text-gray-300 list-disc list-inside mb-4">
        <li>大整数分解（使用 BigInt）</li>
        <li>半质数分解</li>
        <li>完整的质因数分解</li>
    </ul>
    <p class="text-gray-300">例如：输入 210 → 输出 210 = 2 × 3 × 5 × 7</p>
`;

// 初始化 Worker
function initWorker() {
    if (worker) return worker;
    
    try {
        worker = new Worker('./js/workers/factorizeWorker.js');
        
        worker.onmessage = function(e) {
            const { type, id, success, result, factors, elapsedTime, error, progress, message, pipelineData } = e.data;
            
            // 忽略过期的任务
            if (id !== currentTaskId) return;
            
            const loadingIndicator = document.getElementById('loading-indicator');
            const progressBar = document.getElementById('progress-bar');
            const loadingMessage = document.getElementById('loading-message');
            const resultText = document.getElementById('shor-result-text');
            const resultNumber = document.getElementById('shor-result-number');
            const viewPipelineBtn = document.getElementById('view-pipeline-btn');
            const viewPipelineStaticBtn = document.getElementById('view-pipeline-static-btn');
            
            switch (type) {
                case 'progress':
                    if (progressBar) progressBar.style.width = `${progress}%`;
                    if (loadingMessage) loadingMessage.textContent = message;
                    break;
                    
                case 'result':
                    isCalculating = false;
                    hideLoading();
                    
                    // 缓存流水线数据
                    if (pipelineData) {
                        cachedPipelineData = pipelineData;
                    }
                    
                    if (resultNumber) resultNumber.textContent = currentClassicInput;
                    if (resultText) {
                        resultText.textContent = `${result}\n计算耗时: ${elapsedTime} 毫秒`;
                    }
                    
                    // 显示流水线按钮
                    if (viewPipelineBtn && success) {
                        viewPipelineBtn.style.display = 'inline-block';
                    }
                    // 显示静态图表按钮
                    if (viewPipelineStaticBtn && success) {
                        viewPipelineStaticBtn.style.display = 'inline-block';
                    }
                    break;
                    
                case 'error':
                    isCalculating = false;
                    hideLoading();
                    
                    if (resultNumber) resultNumber.textContent = currentClassicInput;
                    if (resultText) {
                        resultText.textContent = `分解失败: ${error}\n计算耗时: -`;
                    }
                    break;
                    
                case 'cancelled':
                    isCalculating = false;
                    hideLoading();
                    
                    if (resultText) {
                        resultText.textContent = '计算已取消';
                    }
                    break;
            }
        };
        
        worker.onerror = function(e) {
            console.error('Worker error:', e);
            isCalculating = false;
            hideLoading();
            
            const resultText = document.getElementById('shor-result-text');
            if (resultText) {
                resultText.textContent = `计算出错: ${e.message}`;
            }
        };
        
        return worker;
    } catch (e) {
        console.error('Failed to create Worker:', e);
        return null;
    }
}

// 显示加载状态
function showLoading() {
    const loadingIndicator = document.getElementById('loading-indicator');
    const progressBar = document.getElementById('progress-bar');
    const loadingMessage = document.getElementById('loading-message');
    const cancelBtn = document.getElementById('cancel-factorize-btn');
    const decomposeBtn = document.getElementById('shor-decompose-btn');
    
    if (loadingIndicator) loadingIndicator.classList.remove('hidden');
    if (progressBar) progressBar.style.width = '0%';
    if (loadingMessage) loadingMessage.textContent = '正在计算...';
    if (cancelBtn) cancelBtn.classList.remove('hidden');
    if (decomposeBtn) decomposeBtn.disabled = true;
}

// 隐藏加载状态
function hideLoading() {
    const loadingIndicator = document.getElementById('loading-indicator');
    const cancelBtn = document.getElementById('cancel-factorize-btn');
    const decomposeBtn = document.getElementById('shor-decompose-btn');
    
    if (loadingIndicator) loadingIndicator.classList.add('hidden');
    if (cancelBtn) cancelBtn.classList.add('hidden');
    if (decomposeBtn) decomposeBtn.disabled = false;
}

// 切换到Shor算法
function switchToShor(algorithmTitle, algorithmInfo) {
    isShorAlgorithm = true;
    
    algorithmTitle.textContent = 'Shor 算法质数分解';
    algorithmTitle.classList.remove('animate-jelly');
    void algorithmTitle.offsetWidth;
    algorithmTitle.classList.add('animate-fade-in');
    setTimeout(() => {
        algorithmTitle.classList.remove('animate-fade-in');
    }, 800);
    
    if (algorithmInfo) {
        algorithmInfo.innerHTML = shorInfoHTML;
    }
}

// 切换到经典算法
function switchToClassic(algorithmTitle, algorithmInfo) {
    isShorAlgorithm = false;
    
    algorithmTitle.textContent = '经典 质数分解';
    algorithmTitle.classList.remove('animate-fade-in');
    void algorithmTitle.offsetWidth;
    algorithmTitle.classList.add('animate-jelly');
    setTimeout(() => {
        algorithmTitle.classList.remove('animate-jelly');
    }, 600);
    
    if (algorithmInfo) {
        algorithmInfo.innerHTML = classicInfoHTML;
    }
}

// 执行 Shor 算法分解（同步，因为限制在1000以内）
function executeShorFactorize(input, resultNumber, resultText, viewCircuitBtn, viewQuantumAnimationBtn, viewPipelineBtn) {
    const startTime = performance.now();
    
    const result = runShorFactorize(input);
    
    // 保存参数用于生成电路图
    currentN = result.N || parseInt(input);
    currentA = result.a || 0;
    
    const endTime = performance.now();
    const elapsedTime = (endTime - startTime).toFixed(2);
    
    if (resultNumber) resultNumber.textContent = input;
    
    if (result.success) {
        if (resultText) resultText.textContent = `${result.result}\n计算耗时: ${elapsedTime} 毫秒`;
    } else {
        if (resultText) resultText.textContent = `${result.message}\n计算耗时: ${elapsedTime} 毫秒`;
    }
    
    // 显示/隐藏查看电路图按钮
    if (viewCircuitBtn) {
        viewCircuitBtn.style.display = (result.success && currentA > 0) ? 'inline-block' : 'none';
    }
    
    // 显示/隐藏查看量子态动画按钮
    if (viewQuantumAnimationBtn) {
        viewQuantumAnimationBtn.style.display = result.success ? 'inline-block' : 'none';
    }
    
    // Shor算法隐藏流水线按钮
    if (viewPipelineBtn) {
        viewPipelineBtn.style.display = 'none';
    }
}

// 执行经典算法分解（使用 Worker）
function executeClassicFactorize(input, resultNumber, resultText, viewCircuitBtn, viewPipelineBtn, viewPipelineStaticBtn) {
    // 保存输入用于生成流水线图
    currentClassicInput = input;
    
    // 经典算法隐藏电路图按钮
    if (viewCircuitBtn) {
        viewCircuitBtn.style.display = 'none';
    }
    
    // 隐藏流水线按钮
    if (viewPipelineBtn) {
        viewPipelineBtn.style.display = 'none';
    }
    
    // 隐藏静态图表按钮
    if (viewPipelineStaticBtn) {
        viewPipelineStaticBtn.style.display = 'none';
    }
    
    // 初始化 Worker
    const w = initWorker();
    
    if (!w) {
        // Worker 不支持，使用同步计算
        import('./factorize.js').then(module => {
            const startTime = performance.now();
            const result = module.runClassicFactorize(input);
            const endTime = performance.now();
            const elapsedTime = (endTime - startTime).toFixed(2);
            
            if (resultNumber) resultNumber.textContent = input;
            if (resultText) {
                resultText.textContent = result.success 
                    ? `${result.result}\n计算耗时: ${elapsedTime} 毫秒`
                    : `${result.message}\n计算耗时: ${elapsedTime} 毫秒`;
            }
            
            if (viewPipelineBtn && result.success) {
                viewPipelineBtn.style.display = 'inline-block';
            }
            if (viewPipelineStaticBtn && result.success) {
                viewPipelineStaticBtn.style.display = 'inline-block';
            }
        });
        return;
    }
    
    // 使用 Worker 计算
    isCalculating = true;
    currentTaskId++;
    showLoading();
    
    w.postMessage({
        type: 'factorize',
        id: currentTaskId,
        data: { input: input }
    });
}

// 取消计算
function cancelCalculation() {
    if (worker && isCalculating) {
        worker.postMessage({
            type: 'cancel',
            id: currentTaskId
        });
    }
}

// 初始化算法切换功能
function initAlgorithmSwitch() {
    const decomposeBtn = document.getElementById('shor-decompose-btn');
    const numberInput = document.getElementById('shor-number');
    const resultNumber = document.getElementById('shor-result-number');
    const resultText = document.getElementById('shor-result-text');
    const algorithmTitle = document.getElementById('algorithm-title');
    const algorithmToggle = document.getElementById('algorithm-toggle');
    const algorithmInfo = document.querySelector('#shor-algorithm .mt-8');
    const viewCircuitBtn = document.getElementById('view-circuit-btn');
    const viewQuantumAnimationBtn = document.getElementById('view-quantum-animation-btn');
    const viewPipelineBtn = document.getElementById('view-pipeline-btn');
    const viewPipelineStaticBtn = document.getElementById('view-pipeline-static-btn');
    const cancelBtn = document.getElementById('cancel-factorize-btn');
    
    // 初始隐藏查看按钮
    if (viewCircuitBtn) viewCircuitBtn.style.display = 'none';
    if (viewQuantumAnimationBtn) viewQuantumAnimationBtn.style.display = 'none';
    if (viewPipelineBtn) viewPipelineBtn.style.display = 'none';
    if (viewPipelineStaticBtn) viewPipelineStaticBtn.style.display = 'none';
    
    // 切换按钮事件
    if (algorithmToggle) {
        algorithmToggle.addEventListener('click', function() {
            if (isShorAlgorithm) {
                switchToClassic(algorithmTitle, algorithmInfo);
            } else {
                switchToShor(algorithmTitle, algorithmInfo);
            }
            
            // 切换时隐藏所有查看按钮
            if (viewCircuitBtn) viewCircuitBtn.style.display = 'none';
            if (viewQuantumAnimationBtn) viewQuantumAnimationBtn.style.display = 'none';
            if (viewPipelineBtn) viewPipelineBtn.style.display = 'none';
            if (viewPipelineStaticBtn) viewPipelineStaticBtn.style.display = 'none';
        });
    }
    
    // 分解按钮事件
    if (decomposeBtn && numberInput) {
        decomposeBtn.addEventListener('click', function() {
            // 防止重复点击
            if (isCalculating) return;
            
            const input = numberInput.value.trim();
            
            // 验证输入
            if (!/^\d+$/.test(input)) {
                alert('请输入有效的正整数');
                return;
            }
            
            const num = parseInt(input);
            
            if (num <= 1) {
                alert('请输入大于1的整数');
                return;
            }
            
            // Shor算法限制检查
            if (isShorAlgorithm && num > 1000) {
                alert('Shor算法模拟限制输入为1000以内的数字\n请切换到经典算法处理更大的数字');
                return;
            }
            
            // 根据算法类型执行
            if (isShorAlgorithm) {
                // Shor 算法（同步执行，因为限制在1000以内）
                executeShorFactorize(input, resultNumber, resultText, viewCircuitBtn, viewQuantumAnimationBtn, viewPipelineBtn);
            } else {
                // 经典算法（使用 Worker）
                executeClassicFactorize(input, resultNumber, resultText, viewCircuitBtn, viewPipelineBtn, viewPipelineStaticBtn);
            }
        });
    }
    
    // 取消按钮事件
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            cancelCalculation();
        });
    }
    
    // 查看电路图按钮事件
    if (viewCircuitBtn) {
        viewCircuitBtn.addEventListener('click', function() {
            if (currentN > 0 && currentA > 0) {
                showQuantumCircuit(currentN, currentA);
            } else {
                alert('请先执行 Shor 算法分解');
            }
        });
    }
    
    // 查看量子态动画按钮事件
    if (viewQuantumAnimationBtn) {
        viewQuantumAnimationBtn.addEventListener('click', function() {
            if (currentN > 0) {
                showQuantumAnimation(currentN, currentA || 2);
            } else {
                alert('请先执行 Shor 算法分解');
            }
        });
    }
    
    // 查看流水线动画按钮事件
    if (viewPipelineBtn) {
        viewPipelineBtn.addEventListener('click', function() {
            if (currentClassicInput) {
                showFactorizationPipeline(currentClassicInput, cachedPipelineData, true);
            } else {
                alert('请先执行经典质数分解');
            }
        });
    }
    
    // 查看流水线静态图表按钮事件
    if (viewPipelineStaticBtn) {
        viewPipelineStaticBtn.addEventListener('click', function() {
            if (currentClassicInput) {
                showFactorizationPipeline(currentClassicInput, cachedPipelineData, false);
            } else {
                alert('请先执行经典质数分解');
            }
        });
    }
}

// 导出函数
export { initAlgorithmSwitch };
