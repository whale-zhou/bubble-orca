// Shor算法量子模拟模块
// 注意：此模块限制输入为1000以内的数字，// 因为量子模拟在经典计算机上非常耗时

// 计算最大公约数
function gcd(a, b) {
    while (b !== 0) {
        [a, b] = [b, a % b];
    }
    return a;
}

// 快速幂取模
function powMod(base, exp, mod) {
    let result = 1n;
    base = BigInt(base) % BigInt(mod);
    exp = BigInt(exp);
    mod = BigInt(mod);
    
    while (exp > 0n) {
        if (exp % 2n === 1n) {
            result = (result * base) % mod;
        }
        base = (base * base) % mod;
        exp = exp / 2n;
    }
    return Number(result);
}

// 模拟量子周期查找（经典计算机模拟版本）
// 这是Shor算法的核心：在量子计算机上使用量子傅里叶变换
// 在经典计算机上，我们模拟量子态的叠加和测量
function quantumPeriodFinding(a, N) {
    // 量子寄存器大小：需要足够的量子位来表示 N^2
    // 对于 N <= 1000, N^2 <= 1000000, 需要 20 个量子位
    const qubits = Math.ceil(Math.log2(N * N));
    const Q = Math.pow(2, qubits); // 量子寄存器大小
    
    // 模拟量子态叠加
    // 在量子计算机上，这会同时计算所有可能的值
    // 在经典计算机上，我们需要遍历（这就是为什么慢）
    
    // 存储所有可能的测量结果及其概率
    const measurements = new Map();
    
    // 模拟量子计算：计算 f(x) = a^x mod N
    for (let x = 0; x < Q; x++) {
        const fx = powMod(a, x, N);
        
        // 模拟量子测量：记录每个 f(x) 值对应的 x
        if (!measurements.has(fx)) {
            measurements.set(fx, []);
        }
        measurements.get(fx).push(x);
    }
    
    // 模拟量子傅里叶变换后的测量
    // 选择一个随机测量结果（模拟量子测量的随机性）
    const keys = Array.from(measurements.keys());
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const xValues = measurements.get(randomKey);
    
    // 从测量结果中估计周期
    // 如果有多个 x 值对应同一个 f(x)，它们的差值可能是周期的倍数
    if (xValues.length < 2) {
        return null; // 无法确定周期
    }
    
    // 计算相邻 x 值的差值
    const diffs = [];
    for (let i = 1; i < xValues.length; i++) {
        diffs.push(xValues[i] - xValues[i - 1]);
    }
    
    // 找到差值的最小公倍数作为周期估计
    if (diffs.length === 0) return null;
    
    // 使用最小差值作为周期估计
    let period = Math.min(...diffs);
    
    // 验证周期
    if (period > 0 && powMod(a, period, N) === 1) {
        return period;
    }
    
    // 如果最小差值不是周期，尝试其他差值
    for (const diff of diffs) {
        if (diff > 0 && diff < N * 2 && powMod(a, diff, N) === 1) {
            return diff;
        }
    }
    
    // 尝试使用连分数方法估计周期
    return continuedFractionPeriod(a, N, Q);
}

// 使用连分数方法估计周期（更精确的方法）
function continuedFractionPeriod(a, N, Q) {
    // 计算 a^Q mod N 的近似值
    // 然后使用连分数展开来估计周期
    
    // 简化版：直接搜索周期
    for (let r = 1; r <= N; r++) {
        if (powMod(a, r, N) === 1) {
            return r;
        }
    }
    
    return null;
}

// 连分数展开（用于更精确的周期估计）
function continuedFraction(num, denominator, maxTerms = 20) {
    const terms = [];
    
    for (let i = 0; i < maxTerms && denominator !== 0; i++) {
        const integer = Math.floor(num / denominator);
        terms.push(integer);
        const remainder = num % denominator;
        num = denominator;
        denominator = remainder;
    }
    
    return terms;
}

// 从连分数重构分数
function reconstructFraction(terms) {
    let numerator = 1;
    let denominator = 0;
    
    for (let i = terms.length - 1; i >= 0; i--) {
        [numerator, denominator] = [terms[i] * numerator + denominator, numerator];
    }
    
    return { numerator, denominator };
}

// Shor算法主函数
function shorAlgorithm(N) {
    // 输入验证
    if (N <= 1) return { success: false, message: '请输入大于1的整数' };
    if (N > 1000) return { success: false, message: 'Shor算法模拟限制输入为1000以内的数字' };
    
    // 检查是否为偶数
    if (N % 2 === 0) {
        return { success: true, factors: [2, N / 2], message: '偶数直接分解', a: 2 };
    }
    
    // 检查是否为质数
    if (isPrimeSimple(N)) {
        return { success: true, factors: [N], message: '这是一个质数', a: 0 };
    }
    
    // Shor算法主循环
    const maxAttempts = 10;
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        // 步骤1：随机选择 a < N
        const a = Math.floor(Math.random() * (N - 2)) + 2;
        
        // 步骤2：计算 gcd(a, N)
        const g = gcd(a, N);
        
        if (g > 1) {
            // 运气好，直接找到因子
            return { 
                success: true, 
                factors: [g, N / g].sort((x, y) => x - y),
                message: `通过gcd(${a}, ${N})直接找到因子`,
                a: a
            };
        }
        
        // 步骤3：量子周期查找
        const r = quantumPeriodFinding(a, N);
        
        if (r === null) continue;
        
        // 步骤4：检查周期是否为偶数
        if (r % 2 === 0) {
            // 计算 a^(r/2) mod N
            const halfR = r / 2;
            const aHalfR = powMod(a, halfR, N);
            
            // 检查 a^(r/2) ≠ -1 mod N
            if (aHalfR !== N - 1 && aHalfR !== 1) {
                // 计算因子
                const factor1 = gcd(aHalfR - 1, N);
                const factor2 = gcd(aHalfR + 1, N);
                
                if (factor1 > 1 && factor1 < N) {
                    return { 
                        success: true, 
                        factors: [factor1, N / factor1].sort((x, y) => x - y),
                        message: `通过Shor算法找到周期r=${r}`,
                        a: a,
                        r: r
                    };
                }
                
                if (factor2 > 1 && factor2 < N) {
                    return { 
                        success: true, 
                        factors: [factor2, N / factor2].sort((x, y) => x - y),
                        message: `通过Shor算法找到周期r=${r}`,
                        a: a,
                        r: r
                    };
                }
            }
        }
    }
    
    return { success: false, message: 'Shor算法未能找到因子，请重试', a: 0 };
}

// 简单的质数检查
function isPrimeSimple(n) {
    if (n <= 1) return false;
    if (n <= 3) return true;
    if (n % 2 === 0 || n % 3 === 0) return false;
    
    for (let i = 5; i * i <= n; i += 6) {
        if (n % i === 0 || n % (i + 2) === 0) return false;
    }
    
    return true;
}

// 格式化分解结果
function formatShorResult(result, input) {
    if (!result.success) {
        return `${input}: ${result.message}`;
    }
    
    if (result.factors.length === 1) {
        return `${input} 是质数`;
    }
    
    // 计算完整的质因数分解
    const allFactors = factorizeComplete(result.factors[0])
        .concat(factorizeComplete(result.factors[1]))
        .sort((a, b) => a - b);
    
    // 统计每个因子的次数
    const factorCount = {};
    allFactors.forEach(f => {
        factorCount[f] = (factorCount[f] || 0) + 1;
    });
    
    // 格式化输出
    const terms = [];
    for (const [factor, count] of Object.entries(factorCount).sort((a, b) => a[0] - b[0])) {
        if (count === 1) {
            terms.push(factor);
        } else {
            terms.push(`${factor}^${count}`);
        }
    }
    
    return `${input} = ${terms.join(' × ')} (${result.message})`;
}

// 完整质因数分解（用于格式化输出）
function factorizeComplete(n) {
    if (n <= 1) return [];
    if (isPrimeSimple(n)) return [n];
    
    const factors = [];
    
    // 提取2的因子
    while (n % 2 === 0) {
        factors.push(2);
        n = n / 2;
    }
    
    // 提取其他因子
    for (let i = 3; i * i <= n; i += 2) {
        while (n % i === 0) {
            factors.push(i);
            n = n / i;
        }
    }
    
    if (n > 1) factors.push(n);
    
    return factors;
}

// Shor算法初始化（纯算法，不含UI切换逻辑）
function initShorAlgorithm() {
    // 此函数仅初始化Shor算法功能
    // 切换逻辑由 algorithmSwitch.js 处理
}

// 执行Shor算法分解（供外部调用）
function runShorFactorize(input) {
    const num = parseInt(input);
    
    if (!/^\d+$/.test(input)) {
        return { success: false, message: '请输入有效的正整数', a: 0 };
    }
    
    if (num <= 1) {
        return { success: false, message: '请输入大于1的整数', a: 0 };
    }
    
    if (num > 1000) {
        return { success: false, message: 'Shor算法模拟限制输入为1000以内的数字，请切换到经典算法', a: 0 };
    }
    
    const shorResult = shorAlgorithm(num);
    const result = formatShorResult(shorResult, input);
    
    return {
        success: shorResult.success,
        result: result,
        factors: shorResult.factors || [],
        a: shorResult.a || 0,
        r: shorResult.r || 0,
        N: num
    };
}

// 导出函数
export { initShorAlgorithm, runShorFactorize };
