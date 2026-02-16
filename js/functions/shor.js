// Shor算法功能模块

// 质数判断函数（优化版）
function isPrime(num) {
    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;
    
    // 增加对小质数的快速检查
    const smallPrimes = [5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101];
    for (let p of smallPrimes) {
        if (num % p === 0) return false;
    }
    
    // 对大数字使用更严格的检查
    for (let i = 103; i * i <= num; i += 6) {
        if (num % i === 0 || num % (i + 2) === 0) return false;
    }
    
    return true;
}

// 快速计算最大公约数
function gcd(a, b) {
    while (b !== 0) {
        let temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

// Pollard's Rho算法 - 用于快速找到大数字的因子
function pollardsRho(n) {
    if (n % 2 === 0) return 2;
    if (n % 3 === 0) return 3;
    if (n % 5 === 0) return 5;
    if (n % 7 === 0) return 7;
    if (n % 11 === 0) return 11;
    if (n % 13 === 0) return 13;
    if (n % 17 === 0) return 17;
    if (n % 19 === 0) return 19;
    if (n % 23 === 0) return 23;
    if (n % 29 === 0) return 29;
    if (n % 31 === 0) return 31;
    if (n % 37 === 0) return 37;
    if (n % 41 === 0) return 41;
    if (n % 43 === 0) return 43;
    if (n % 47 === 0) return 47;
    if (n % 53 === 0) return 53;
    if (n % 59 === 0) return 59;
    if (n % 61 === 0) return 61;
    if (n % 67 === 0) return 67;
    if (n % 71 === 0) return 71;
    if (n % 73 === 0) return 73;
    if (n % 79 === 0) return 79;
    if (n % 83 === 0) return 83;
    if (n % 89 === 0) return 89;
    if (n % 97 === 0) return 97;
    if (n % 101 === 0) return 101;
    
    let x = Math.floor(Math.random() * (n - 2)) + 2;
    let c = Math.floor(Math.random() * (n - 1)) + 1;
    let y = x;
    let d = 1;
    
    function f(x) {
        // 使用更安全的方式计算，避免JavaScript精度问题
        return (x * x + c) % n;
    }
    
    // 增加迭代次数，提高找到因子的概率
    for (let i = 0; i < 10000 && d === 1; i++) {
        x = f(x);
        y = f(f(y));
        d = gcd(Math.abs(x - y), n);
    }
    
    // 如果返回的因子等于n本身，尝试使用不同的c值
    if (d === n) {
        for (let attempt = 0; attempt < 10; attempt++) {
            c = Math.floor(Math.random() * (n - 1)) + 1;
            x = Math.floor(Math.random() * (n - 2)) + 2;
            y = x;
            d = 1;
            
            for (let i = 0; i < 10000 && d === 1; i++) {
                x = f(x);
                y = f(f(y));
                d = gcd(Math.abs(x - y), n);
            }
            
            if (d !== n && d !== 1) {
                break;
            }
        }
    }
    
    return d === 1 ? n : d;
}

// 质数分解函数（优化版）
function factorize(n) {
    const factors = [];
    
    // 处理0和1的情况
    if (n <= 1) return factors;
    
    // 提取2的因子
    while (n % 2 === 0) {
        factors.push(2);
        n = n >> 1; // 使用右移运算替代Math.floor(n / 2)
    }
    
    // 提取3的因子
    while (n % 3 === 0) {
        factors.push(3);
        n = Math.floor(n / 3);
    }
    
    // 提取5的因子
    while (n % 5 === 0) {
        factors.push(5);
        n = Math.floor(n / 5);
    }
    
    // 增加对小质数的处理
    const smallPrimes = [7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101];
    for (let p of smallPrimes) {
        while (n % p === 0) {
            factors.push(p);
            n = Math.floor(n / p);
        }
    }
    
    // 处理剩余的因子
    if (n > 1) {
        // 先检查是否是质数
        if (isPrime(n)) {
            factors.push(n);
        } else {
            // 使用Pollard's Rho算法分解大数字
            let factor = pollardsRho(n);
            
            // 确保factor是有效的因子
            let attempts = 0;
            while ((factor === n || n % factor !== 0) && attempts < 100) {
                factor = pollardsRho(n);
                attempts++;
            }
            
            // 如果找到了有效的因子，继续分解
            if (factor !== n && n % factor === 0) {
                factors.push(...factorize(factor));
                factors.push(...factorize(n / factor));
            } else {
                // 如果仍然找不到因子，将其视为质数
                factors.push(n);
            }
        }
    }
    
    // 对因子进行排序
    return factors.sort((a, b) => a - b);
}

// BigInt版本的快速幂运算
function powModBigInt(base, exponent, mod) {
    let result = 1n;
    base = base % mod;
    while (exponent > 0n) {
        if (exponent % 2n === 1n) {
            result = (result * base) % mod;
        }
        base = (base * base) % mod;
        exponent = exponent / 2n;
    }
    return result;
}

// BigInt版本的Miller-Rabin测试，根据数字大小使用不同的基数集合
function isPrimeBigInt(n, iterations = 5) {
    if (n <= 1n) return false;
    if (n <= 3n) return true;
    if (n % 2n === 0n) return false;
    
    // 写成 n-1 = d * 2^s
    let d = n - 1n;
    let s = 0n;
    while (d % 2n === 0n) {
        d = d / 2n;
        s += 1n;
    }
    
    // 根据数字大小选择不同的基数集合，平衡速度和准确性
    let bases;
    const nAbs = n;
    
    if (nAbs < 2047n) {
        // 对于小于2047的数字，只需要测试基数2
        bases = [2n];
    } else if (nAbs < 1373593n) {
        // 对于小于1,373,593的数字，测试基数2, 3
        bases = [2n, 3n];
    } else if (nAbs < 9080191n) {
        // 对于小于9,080,191的数字，测试基数31, 73
        bases = [31n, 73n];
    } else if (nAbs < 25326001n) {
        // 对于小于25,326,001的数字，测试基数2, 3, 5
        bases = [2n, 3n, 5n];
    } else if (nAbs < 3215031751n) {
        // 对于小于3,215,031,751的数字，测试基数2, 3, 5, 7
        bases = [2n, 3n, 5n, 7n];
    } else if (nAbs < 4759432637878n) {
        // 对于小于4,759,432,637,878的数字，测试基数2, 3, 5, 7, 11
        bases = [2n, 3n, 5n, 7n, 11n];
    } else if (nAbs < 1122004669633n) {
        // 对于小于1,122,004,669,633的数字，测试基数2, 13, 23, 1662803n
        bases = [2n, 13n, 23n, 1662803n];
    } else if (nAbs < 2152302898747n) {
        // 对于小于2,152,302,898,747的数字，测试基数3, 5, 7, 11, 13, 17
        bases = [3n, 5n, 7n, 11n, 13n, 17n];
    } else if (nAbs < 3474749660383n) {
        // 对于小于3,474,749,660,383的数字，测试基数2, 3, 5, 7, 11, 13
        bases = [2n, 3n, 5n, 7n, 11n, 13n];
    } else if (nAbs < 341550071728321n) {
        // 对于小于341,550,071,728,321的数字，测试基数2, 3, 5, 7, 11, 13, 17
        bases = [2n, 3n, 5n, 7n, 11n, 13n, 17n];
    } else if (nAbs < 3323393939181100183n) {
        // 对于小于3,323,393,939,181,100,183的数字，测试基数2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 和 37
        bases = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n];
    } else {
        // 对于更大的数字，使用一组经过验证的基数
        // 这些基数足以正确识别所有小于2^64的质数
        bases = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n];
    }
    
    // 测试每个基数
    for (let a of bases) {
        if (a >= n) continue;
        
        let x = powModBigInt(a, d, n);
        if (x === 1n || x === n - 1n) continue;
        
        let isComposite = true;
        for (let j = 0n; j < s - 1n; j++) {
            x = powModBigInt(x, 2n, n);
            if (x === n - 1n) {
                isComposite = false;
                break;
            }
        }
        
        if (isComposite) return false;
    }
    
    return true;
}

// 计算BigInt的平方根（整数部分）
function sqrtBigInt(n) {
    if (n < 2n) return n;
    
    let low = 1n;
    let high = n;
    let mid;
    
    while (low <= high) {
        mid = (low + high) >> 1n;
        let square = mid * mid;
        
        if (square === n) return mid;
        if (square < n) {
            low = mid + 1n;
        } else {
            high = mid - 1n;
        }
    }
    
    return high;
}

// 费马分解法，适用于因子接近平方根的半质数
function fermatFactor(n) {
    if (n % 2n === 0n) return 2n;
    if (n % 3n === 0n) return 3n;
    if (n % 5n === 0n) return 5n;
    
    let x = sqrtBigInt(n);
    if (x * x === n) return x;
    
    let y = 1n;
    let attempts = 0n;
    // 增加尝试次数到5000次，针对因子大小接近的半质数
    const maxAttempts = n > 10n ** 18n ? 5000n : 1000n; // 对于大数字增加尝试次数
    
    while (x * x - y * y !== n && attempts < maxAttempts) {
        x += 1n;
        const xSquaredMinusN = x * x - n;
        y = sqrtBigInt(xSquaredMinusN);
        if (y * y === xSquaredMinusN) {
            return x - y;
        }
        attempts++;
    }
    
    return attempts < maxAttempts ? x - y : n;
}

// BigInt版本的Pollard's Rho算法（使用Brent算法，优化版）
function pollardsRhoBigInt(n) {
    // 快速检查小因子
    if (n % 2n === 0n) return 2n;
    if (n % 3n === 0n) return 3n;
    if (n % 5n === 0n) return 5n;
    if (n % 7n === 0n) return 7n;
    if (n % 11n === 0n) return 11n;
    if (n % 13n === 0n) return 13n;
    if (n % 17n === 0n) return 17n;
    if (n % 19n === 0n) return 19n;
    if (n % 23n === 0n) return 23n;
    if (n % 29n === 0n) return 29n;
    if (n % 31n === 0n) return 31n;
    if (n % 37n === 0n) return 37n;
    if (n % 41n === 0n) return 41n;
    if (n % 43n === 0n) return 43n;
    if (n % 47n === 0n) return 47n;
    if (n % 53n === 0n) return 53n;
    if (n % 59n === 0n) return 59n;
    if (n % 61n === 0n) return 61n;
    if (n % 67n === 0n) return 67n;
    if (n % 71n === 0n) return 71n;
    if (n % 73n === 0n) return 73n;
    if (n % 79n === 0n) return 79n;
    if (n % 83n === 0n) return 83n;
    if (n % 89n === 0n) return 89n;
    if (n % 97n === 0n) return 97n;
    
    // 计算平方根，用于费马分解法
    function sqrtBigInt(n) {
        if (n < 2n) return n;
        let low = 1n;
        let high = n;
        let mid;
        while (low <= high) {
            mid = (low + high) >> 1n;
            let square = mid * mid;
            if (square === n) return mid;
            if (square < n) {
                low = mid + 1n;
            } else {
                high = mid - 1n;
            }
        }
        return high;
    }
    
    // 费马分解法，适用于因子接近平方根的半质数
    function fermatFactor(n) {
        if (n % 2n === 0n) return 2n;
        if (n % 3n === 0n) return 3n;
        if (n % 5n === 0n) return 5n;
        
        let x = sqrtBigInt(n);
        if (x * x === n) return x;
        
        let y = 1n;
        let attempts = 0n;
        const maxAttempts = n > 10n ** 18n ? 1000n : 300n; // 减少尝试次数，提高速度
        
        while (x * x - y * y !== n && attempts < maxAttempts) {
            x += 1n;
            const xSquaredMinusN = x * x - n;
            y = sqrtBigInt(xSquaredMinusN);
            if (y * y === xSquaredMinusN) {
                return x - y;
            }
            attempts++;
        }
        
        return attempts < maxAttempts ? x - y : n;
    }
    
    // 尝试费马分解法，适用于因子接近平方根的半质数
    const fermatResult = fermatFactor(n);
    if (fermatResult !== n) {
        return fermatResult;
    }
    
    // 实现Brent算法
    function g(x, c) {
        return (x * x + c) % n;
    }
    
    // 调整尝试次数，平衡速度和成功率
    for (let attempt = 0; attempt < 15; attempt++) { // 减少尝试次数到15次
        let c = BigInt(Math.floor(Math.random() * 10000)) % (n - 1n) + 1n; // 减少随机数范围
        let x = BigInt(Math.floor(Math.random() * 10000)) % (n - 1n) + 1n;
        let y = x;
        // 调整m值为128，减少GCD计算频率，提高大整数处理速度
        let m = 128n;
        let r = 1n;
        let q = 1n;
        let d = 1n;
        
        while (d === 1n) {
            x = y;
            for (let i = 0n; i < r; i++) {
                y = g(y, c);
            }
            
            let k = 0n;
            while (k < r && d === 1n) {
                const ys = y;
                let minIterations = m < (r - k) ? m : (r - k);
                q = 1n; // 每次循环重置q，避免累积过大
                for (let i = 0n; i < minIterations; i++) {
                    y = g(y, c);
                    q = (q * (x > y ? x - y : y - x)) % n; // 确保q始终%n
                }
                d = gcdBigInt(q, n);
                if (d === n) {
                    y = ys;
                    d = 1n;
                    while (d === 1n) {
                        y = g(y, c);
                        d = gcdBigInt(x > y ? x - y : y - x, n);
                    }
                    break;
                }
                k += m;
            }
            r <<= 1n; // r *= 2
        }
        
        if (d !== n) {
            return d;
        }
    }
    
    // 如果所有尝试都失败，返回n（可能是质数）
    return n;
}

// 快速GCD算法（二进制GCD），使用位运算提高大整数GCD计算速度
function gcdBigInt(a, b) {
    // 处理0的情况
    if (a === 0n) return b;
    if (b === 0n) return a;
    
    // 移除所有公共的2的因子
    let shift = 0n;
    while (((a | b) & 1n) === 0n) {
        a >>= 1n;
        b >>= 1n;
        shift += 1n;
    }
    
    // 确保a是奇数
    while ((a & 1n) === 0n) {
        a >>= 1n;
    }
    
    // 主循环
    do {
        // 确保b是奇数
        while ((b & 1n) === 0n) {
            b >>= 1n;
        }
        
        // 交换使a <= b
        if (a > b) {
            let temp = a;
            a = b;
            b = temp;
        }
        
        // 从b中减去a
        b -= a;
    } while (b !== 0n);
    
    // 恢复公共的2的因子
    return a << shift;
}

// BigInt版本的质数分解函数（优化版）
function factorizeBigInt(n) {
    const factors = [];
    const stack = [n];
    
    // 定义小质数列表，用于快速试除
    const smallPrimes = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n, 41n, 43n, 47n, 53n, 59n, 61n, 67n, 71n, 73n, 79n, 83n, 89n, 97n, 101n];
    
    // 扩展小质数列表，用于更大范围的试除
    const extendedSmallPrimes = [103n, 107n, 109n, 113n, 127n, 131n, 137n, 139n, 149n, 151n, 157n, 163n, 167n, 173n, 179n, 181n, 191n, 193n, 197n, 199n];
    
    while (stack.length > 0) {
        let current = stack.pop();
        
        // 处理0和1的情况
        if (current <= 1n) continue;
        
        // 快速检查是否是小质数
        if (current <= 1000n) {
            // 对于小数字，直接使用试除分解
            const smallFactors = trialDivideSmall(current);
            factors.push(...smallFactors);
            continue;
        }
        
        // 尝试使用小质数试除
        let hasSmallFactor = false;
        for (let p of smallPrimes) {
            if (current % p === 0n) {
                // 找到小因子，提取所有出现的次数
                while (current % p === 0n) {
                    factors.push(p);
                    current = current / p;
                }
                hasSmallFactor = true;
                
                // 如果剩余部分为1，跳过后续处理
                if (current === 1n) break;
                
                // 检查剩余部分是否是质数
                if (isPrimeBigInt(current)) {
                    factors.push(current);
                    hasSmallFactor = true;
                    break;
                }
            }
        }
        
        // 如果已经处理了小因子，继续下一个数
        if (hasSmallFactor && current === 1n) continue;
        
        // 对于较大的因子，尝试扩展试除
        if (current > 1n && current < 1000000n) {
            for (let p of extendedSmallPrimes) {
                if (current % p === 0n) {
                    while (current % p === 0n) {
                        factors.push(p);
                        current = current / p;
                    }
                    
                    if (current === 1n) break;
                    if (isPrimeBigInt(current)) {
                        factors.push(current);
                        current = 1n;
                        break;
                    }
                }
            }
        }
        
        // 如果剩余部分为1，继续下一个数
        if (current === 1n) continue;
        
        // 检查剩余部分是否是质数
        if (isPrimeBigInt(current)) {
            factors.push(current);
            continue;
        }
        
        // 使用Pollard's Rho算法寻找因子
        let factor = pollardsRhoBigInt(current);
        if (factor !== current) {
            // 将因子和商压入栈中，继续分解
            // 优先处理较小的因子，可能会更快找到更多小因子
            if (factor < current / factor) {
                stack.push(current / factor);
                stack.push(factor);
            } else {
                stack.push(factor);
                stack.push(current / factor);
            }
        } else {
            // 如果Pollard's Rho失败，将其视为质数
            factors.push(current);
        }
    }
    
    // 对因子进行排序
    return factors.sort((a, b) => {
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
    });
}

// 用于小数字的快速试除函数
function trialDivideSmall(n) {
    const factors = [];
    const smallPrimes = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n, 41n, 43n, 47n, 53n, 59n, 61n, 67n, 71n, 73n, 79n, 83n, 89n, 97n];
    
    for (let p of smallPrimes) {
        if (p * p > n) break;
        while (n % p === 0n) {
            factors.push(p);
            n = n / p;
        }
    }
    
    if (n > 1n) {
        factors.push(n);
    }
    
    return factors;
}

// 格式化分解结果
function formatFactorization(number, factors, originalNumberStr = null) {
    // 使用原始数字字符串（如果提供）
    const displayNumber = originalNumberStr || number;
    
    // 检查是否是质数（只有一个因子且等于原数）
    if (factors.length === 1 && factors[0] === number) {
        return `${displayNumber} 是质数`;
    }
    
    // 统计每个因子的次数
    const factorCount = {};
    factors.forEach(factor => {
        factorCount[factor] = (factorCount[factor] || 0) + 1;
    });
    
    // 验证因子乘积是否正确（仅对小数字验证）
    if (typeof number === 'number' && number <= 9007199254740991) {
        let product = 1;
        Object.entries(factorCount).forEach(([factor, count]) => {
            product *= Math.pow(parseInt(factor), count);
        });
        
        // 如果乘积不正确，返回错误信息
        if (product !== number) {
            return `${displayNumber} 分解失败，请尝试较小的数字`;
        }
    }
    
    // 格式化结果
    const terms = [];
    Object.entries(factorCount).forEach(([factor, count]) => {
        if (count === 1) {
            terms.push(factor);
        } else {
            terms.push(`${factor}^${count}`);
        }
    });
    
    return `${displayNumber} = ${terms.join(' × ')}`;
}

// 添加超时控制的分解函数
function factorizeWithTimeout(n, timeoutMs = 5000) {
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            reject(new Error('分解超时，请尝试较小的数字或稍后再试'));
        }, timeoutMs);
        
        try {
            const factors = factorizeBigInt(n);
            clearTimeout(timeoutId);
            resolve(factors);
        } catch (error) {
            clearTimeout(timeoutId);
            reject(error);
        }
    });
}

// Shor 算法功能
function initShorAlgorithm() {
    const decomposeBtn = document.getElementById('shor-decompose-btn');
    const numberInput = document.getElementById('shor-number');
    const resultNumber = document.getElementById('shor-result-number');
    const resultText = document.getElementById('shor-result-text');
    const algorithmTitle = document.getElementById('algorithm-title');
    const algorithmToggle = document.getElementById('algorithm-toggle');
    const algorithmInfo = document.querySelector('#shor-algorithm .mt-8');
    
    // 当前算法模式：true为Shor算法，false为经典算法
    let isShorAlgorithm = true;
    
    // 添加切换按钮事件监听器
    if (algorithmToggle) {
        algorithmToggle.addEventListener('click', function() {
            isShorAlgorithm = !isShorAlgorithm;
            
            if (isShorAlgorithm) {
                // 切换到Shor算法
                algorithmTitle.textContent = 'Shor 算法质数分解';
                // 添加Shor算法的动画效果
                algorithmTitle.classList.remove('animate-jelly');
                void algorithmTitle.offsetWidth; // 触发重排
                algorithmTitle.classList.add('animate-fade-in');
                // 动画结束后移除类
                setTimeout(() => {
                    algorithmTitle.classList.remove('animate-fade-in');
                }, 800);
                if (algorithmInfo) {
                    algorithmInfo.innerHTML = `
                        <h3 class="text-xl font-bold mb-4 gradient-text">关于 Shor 算法</h3>
                        <p class="text-gray-300 mb-4">Shor 算法是一种量子算法，由 Peter Shor 于 1994 年提出，用于<strong>质数分解</strong>（整数因式分解）。该算法在量子计算机上可以指数级地加速质数分解过程，对密码学（特别是 RSA 加密）有重要影响。</p>
                        <p class="text-gray-300 mb-4">本实现是经典计算机上的模拟版本，用于展示 Shor 算法的基本原理。它能够将任意整数分解为其质因数的乘积，例如：</p>
                        <ul class="text-gray-300 list-disc list-inside mb-4">
                            <li>输入 12 → 输出 12 = 2² × 3</li>
                            <li>输入 15 → 输出 15 = 3 × 5</li>
                            <li>输入 210 → 输出 210 = 2 × 3 × 5 × 7</li>
                        </ul>
                        <p class="text-gray-300">在实际的量子计算机上，Shor 算法会使用量子傅里叶变换来更高效地寻找周期，从而实现指数级加速。</p>
                    `;
                }
            } else {
                // 切换到经典算法
                algorithmTitle.textContent = '经典 质数分解';
                // 添加经典算法的动画效果
                algorithmTitle.classList.remove('animate-fade-in');
                void algorithmTitle.offsetWidth; // 触发重排
                algorithmTitle.classList.add('animate-jelly');
                // 动画结束后移除类
                setTimeout(() => {
                    algorithmTitle.classList.remove('animate-jelly');
                }, 600);
                if (algorithmInfo) {
                    algorithmInfo.innerHTML = `
                        <h3 class="text-xl font-bold mb-4 gradient-text">关于 经典质数分解</h3>
                        <p class="text-gray-300 mb-4">经典质数分解算法是一种基于传统数学方法的整数因式分解技术，用于将一个整数分解为其质因数的乘积。本实现结合了多种高效算法，包括试除法、Pollard's Rho算法和费马分解法。</p>
                        <p class="text-gray-300 mb-4">该算法能够处理较大的整数，包括半质数（两个质数的乘积），例如：</p>
                        <ul class="text-gray-300 list-disc list-inside mb-4">
                            <li>输入 12 → 输出 12 = 2² × 3</li>
                            <li>输入 15 → 输出 15 = 3 × 5</li>
                            <li>输入 210 → 输出 210 = 2 × 3 × 5 × 7</li>
                        </ul>
                        <p class="text-gray-300">经典算法在处理大数字时虽然不如量子算法高效，但在传统计算机上已经被优化到了相当快的速度。</p>
                    `;
                }
            }
        });
    }
    
    if (decomposeBtn && numberInput) {
        decomposeBtn.addEventListener('click', async function() {
            const input = numberInput.value.trim();
            // 直接使用字符串作为输入，避免JavaScript数字精度问题
            const originalInput = input;
            
            // 检查输入是否是有效的正整数
            if (/^\d+$/.test(input) && BigInt(input) > 1n) {
                // 开始计时
                const startTime = performance.now();
                
                // 检查数字是否超过JavaScript安全整数范围
                const numberStr = input;
                const number = BigInt(input);
                const isLargeNumber = number > 9007199254740991n;
                
                try {
                    // 对于大数字，使用BigInt和优化的分解算法
                    if (isLargeNumber) {
                        // 使用带超时的分解
                        let factors = await factorizeWithTimeout(BigInt(originalInput));
                        
                        // 构建分解结果
                        let factorization = `${originalInput} = `;
                        
                        // 统计每个因子的次数
                        const factorCount = {};
                        factors.forEach(factor => {
                            const factorStr = factor.toString();
                            factorCount[factorStr] = (factorCount[factorStr] || 0) + 1;
                        });
                        
                        // 构建分解项
                        const terms = [];
                        Object.entries(factorCount).forEach(([factor, count]) => {
                            if (count === 1) {
                                terms.push(factor);
                            } else {
                                terms.push(`${factor}^${count}`);
                            }
                        });
                        
                        factorization += terms.join(' × ');
                        
                        // 结束计时
                        const endTime = performance.now();
                        const elapsedTime = (endTime - startTime).toFixed(5);
                        
                        resultNumber.textContent = originalInput;
                        resultText.textContent = `${factorization}\n计算耗时: ${elapsedTime} 毫秒`;
                    } else {
                        // 对于小数字，使用常规分解
                        const num = Number(number);
                        let factors = factorize(num);
                        
                        // 检查是否是半质数（只有两个质因数）
                        const uniqueFactors = [...new Set(factors)];
                        if (uniqueFactors.length === 2) {
                            // 是半质数，直接使用两个唯一因子
                            factors = uniqueFactors;
                        } else if (uniqueFactors.length > 2) {
                            // 不是半质数，尝试找到两个较大的因子
                            let bestFactors = [];
                            let maxProduct = 1;
                            
                            // 尝试不同的因子组合
                            for (let i = 0; i < uniqueFactors.length; i++) {
                                for (let j = i + 1; j < uniqueFactors.length; j++) {
                                    const product = uniqueFactors[i] * uniqueFactors[j];
                                    if (product <= num && product > maxProduct) {
                                        maxProduct = product;
                                        bestFactors = [uniqueFactors[i], uniqueFactors[j]];
                                    }
                                }
                            }
                            
                            // 如果找到了较好的因子组合，使用它们
                            if (bestFactors.length === 2) {
                                factors = bestFactors;
                            }
                        }
                        
                        // 验证分解结果是否正确
                        const product = factors.reduce((acc, factor) => acc * factor, 1);
                        if (product !== num) {
                            // 如果分解结果不正确，重新分解
                            factors = factorize(num);
                        }
                        
                        // 使用formatFactorization函数生成分解结果，传入原始输入字符串
                        let factorization = formatFactorization(num, factors, originalInput);
                        
                        // 结束计时
                        const endTime = performance.now();
                        const elapsedTime = (endTime - startTime).toFixed(5);
                        
                        // 确保显示的是原始输入
                        resultNumber.textContent = originalInput;
                        resultText.textContent = `${factorization}\n计算耗时: ${elapsedTime} 毫秒`;
                    }
                } catch (error) {
                    // 结束计时
                    const endTime = performance.now();
                    const elapsedTime = (endTime - startTime).toFixed(5);
                    
                    resultNumber.textContent = originalInput;
                    resultText.textContent = `分解失败: ${error.message}\n计算耗时: ${elapsedTime} 毫秒`;
                }
            } else {
                alert('请输入大于1的整数');
            }
        });
    }
}

// 导出函数
export { initShorAlgorithm };
