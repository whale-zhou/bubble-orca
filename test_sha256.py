#!/usr/bin/env python3

# 导入SHA-256算法相关函数
from app import sha256

# 测试用例
test_cases = [
    "",  # 空字符串
    "abc",  # 简单字符串
    "Hello, World!",  # 带标点符号的字符串
    "123456",  # 数字字符串
]

print("=== 测试SHA-256加密 ===")
for test_text in test_cases:
    result = sha256(test_text)
    print(f"输入: {'空字符串' if test_text == '' else test_text}")
    print(f"结果: {result}")
    print("---")
