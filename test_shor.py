#!/usr/bin/env python3

# 导入Shor算法相关函数
from app import shor_algorithm

# 测试用例
test_cases = [
    12,  # 应该得到 2² × 3
    15,  # 应该得到 3 × 5
    21,  # 应该得到 3 × 7
    35,  # 应该得到 5 × 7
    49,  # 应该得到 7²
    121, # 应该得到 11²
    210, # 应该得到 2 × 3 × 5 × 7
]

print("=== 测试Shor算法质数分解 ===")
for test_num in test_cases:
    result = shor_algorithm(test_num)
    print(f"输入: {test_num}")
    print(f"结果: {result}")
    print("---")
