import random
import math
from fractions import Fraction

def gcd(a, b):
    """计算最大公约数"""
    while b != 0:
        a, b = b, a % b
    return a

def is_prime(n):
    """判断一个数是否为素数"""
    if n <= 1:
        return False
    elif n <= 3:
        return True
    elif n % 2 == 0:
        return False
    i = 3
    while i * i <= n:
        if n % i == 0:
            return False
        i += 2
    return True

def find_period(a, N):
    """经典模拟量子部分，寻找 a 的阶 r"""
    if gcd(a, N) != 1:
        return gcd(a, N)
    
    # 经典方法寻找周期
    r = 1
    while pow(a, r, N) != 1:
        r += 1
    return r

def shor_algorithm(N):
    """Shor 算法主函数"""
    # 处理特殊情况
    if N <= 1:
        return "输入必须大于1"
    elif N == 2:
        return "2 是素数"
    elif N % 2 == 0:
        return f"2 和 {N//2} 是 {N} 的因子"
    
    # 检查是否为素数
    if is_prime(N):
        return f"{N} 是素数"
    
    while True:
        # 选择一个随机数 a
        a = random.randint(2, N-1)
        
        # 计算 gcd(a, N)
        d = gcd(a, N)
        
        # 如果 gcd(a, N) > 1，那么我们已经找到了一个因子
        if d > 1:
            return f"{d} 和 {N//d} 是 {N} 的因子"
        
        # 否则，找到 a 的阶 r
        r = find_period(a, N)
        
        # 检查 r 是否为偶数，并且 a^(r/2) ≡ -1 mod N 不成立
        if r % 2 == 0 and pow(a, r//2, N) != N-1:
            # 计算可能的因子
            d1 = gcd(pow(a, r//2) - 1, N)
            d2 = gcd(pow(a, r//2) + 1, N)
            
            # 检查是否找到了非平凡因子
            if d1 > 1 and d1 < N:
                return f"{d1} 和 {N//d1} 是 {N} 的因子"
            elif d2 > 1 and d2 < N:
                return f"{d2} 和 {N//d2} 是 {N} 的因子"

if __name__ == "__main__":
    # 测试 Shor 算法
    test_numbers = [15, 21, 35, 49, 121]
    for num in test_numbers:
        result = shor_algorithm(num)
        print(f"分解 {num}: {result}")
    
    # 示例：分解一个较大的数
    example_number = 161038
    result = shor_algorithm(example_number)
    print(f"\n示例分解 {example_number}: {result}")