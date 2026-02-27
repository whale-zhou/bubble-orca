# 泡泡鲸语音助手 - 预录音频说明

本目录存放语音助手的预录音频文件，用于替代机械的Web Speech API语音。

## 音频文件列表

| 文件名 | 文本内容 | 用途 |
|--------|----------|------|
| wake.mp3 | "我在" | 唤醒响应 |
| switch_sha256.mp3 | "为你切换到SHA-256" | 切换算法 |
| switch_ascii.mp3 | "为你切换到ASCII编码" | 切换算法 |
| switch_shor.mp3 | "为你切换到Shor算法" | 切换算法 |
| switch_grover.mp3 | "为你切换到Grover算法" | 切换算法 |
| switch_rsa.mp3 | "为你切换到RSA加密" | 切换算法 |
| switch_ecc.mp3 | "为你切换到椭圆曲线加密" | 切换算法 |
| switch_aes.mp3 | "为你切换到AES加密" | 切换算法 |
| gesture_on.mp3 | "为你打开隔空手势交互" | 开启手势 |
| gesture_off.mp3 | "为你关闭隔空手势交互" | 关闭手势 |
| calculate.mp3 | "我现在为你计算" | 执行计算 |
| input.mp3 | "我现在为你输入" | 输入内容 |
| done.mp3 | "已完成" | 操作完成 |
| error.mp3 | "抱歉，出了点问题" | 错误提示 |
| welcome.mp3 | "泡泡鲸语音助手已启动，请说泡泡鲸唤醒我" | 欢迎语 |

## 音频要求

- **格式**: MP3（推荐）或 WAV
- **采样率**: 22050Hz 或 44100Hz
- **音色**: 女声，亲切自然，略带活泼
- **语气**: 友好、专业、有亲和力
- **语速**: 正常偏慢，清晰易懂

## 如何生成音频

### 方法1：使用AI语音合成工具
推荐使用以下工具生成自然语音：
- **讯飞开放平台** - 提供多种中文音色
- **百度语音合成** - 有免费额度
- **Azure TTS** - 微软云服务，音质优秀

### 方法2：使用在线TTS网站
- https://ttsmaker.com/ （免费）
- https://www.text-to-speech.cn/

### 方法3：自己录制
使用专业麦克风录制真人语音，效果最自然。

## 文件结构

```
audio/
├── wake.mp3
├── switch_sha256.mp3
├── switch_ascii.mp3
├── switch_shor.mp3
├── switch_grover.mp3
├── switch_rsa.mp3
├── switch_ecc.mp3
├── switch_aes.mp3
├── gesture_on.mp3
├── gesture_off.mp3
├── calculate.mp3
├── input.mp3
├── done.mp3
├── error.mp3
└── welcome.mp3
```

## 注意事项

1. 如果音频文件不存在，系统会自动回退到Web Speech API
2. 音频文件应尽量小（建议每个文件 < 100KB）
3. 确保音频没有背景噪音
4. 保持所有音频的音量和语速一致
