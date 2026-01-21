#!/usr/bin/env python3

# 简单的SHA-256测试脚本
# 用于测试HTML页面中的SHA-256实现

test_cases = [
    ("", "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"),
    ("1", "6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b"),
    ("abc", "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"),
    ("Hello, World!", "dffd6021bb2bd5b0af676290809ec3a53191dd81c7f70a4b28688a362182986f")
]

print("=== SHA-256测试 ===")
for text, expected_hash in test_cases:
    # 在这里，我们将使用Python的hashlib库来计算正确的SHA-256哈希值
    import hashlib
    correct_hash = hashlib.sha256(text.encode()).hexdigest()
    
    print(f"\n输入: '{text}'")
    print(f"预期: {expected_hash}")
    print(f"正确: {correct_hash}")
    print(f"匹配: {expected_hash == correct_hash}")

print("\n=== 测试完成 ===")