import base64
import json
import urllib.parse

base64_str = 'eyJwYXNzd29yZCI6IjIwMjYiLCJyZWRlZW1Db2RlIjoiIiwicmVkcGFja2V0TGluayI6Imh0dHBzOi8vdXIuYWxpcGF5LmNvbS9fMzZHbkNLYzZudlpDU0JZcXdaZW80MCIsImtvdWxpbmciOiIyMDI2bmV3eWVhciIsInRpdGxlIjoi5rOh5rOh6bK456Wd5oKo5paw5bm05b+r5LmQIiwiYmxlc3NpbmciOiLpmaTlpJXlv6vkuZAtLea0siJ9'

# Decode base64
decoded_bytes = base64.b64decode(base64_str)
decoded_str = decoded_bytes.decode('utf-8')

print('解码结果:', decoded_str)

# Parse JSON
config = json.loads(decoded_str)
print('暗号:', config['password'])
print('完整配置:', json.dumps(config, ensure_ascii=False, indent=2))
