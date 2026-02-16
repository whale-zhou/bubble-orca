import hashlib

# 测试用例
test_text = "1"
expected_hash = hashlib.sha256(test_text.encode()).hexdigest()
print(f"输入: '{test_text}'")
print(f"SHA-256哈希值: {expected_hash}")
print(f"长度: {len(expected_hash)} 字符")