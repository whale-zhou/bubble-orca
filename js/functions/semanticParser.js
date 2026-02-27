// 语义理解模块 - 轻量级意图识别
// 无需LLM，基于关键词和规则的理解系统

class SemanticParser {
    constructor() {
        this.intents = {
            switch_algorithm: {
                keywords: ['切换', '转到', '换到', '打开', '使用', '运行', '执行', '选择'],
                entities: {
                    sha256: ['sha256', 'sha-256', '哈希', '散列', '摘要', 'hash'],
                    ascii: ['ascii', '编码', '转码', '字符编码', '文本编码'],
                    shor: ['shor', '肖尔', '素因数', '质因数', '分解', '因式分解'],
                    grover: ['grover', '格罗弗', '搜索', '查找', '量子搜索'],
                    rsa: ['rsa', '非对称', '公钥加密', '私钥'],
                    ecc: ['ecc', '椭圆曲线', '椭圆加密', '椭圆'],
                    aes: ['aes', '对称加密', '对称', '块加密']
                }
            },
            toggle_gesture: {
                keywords: ['手势', '隔空', '挥手', '动作控制'],
                actions: {
                    on: ['打开', '开启', '启用', '启动', '开', 'on'],
                    off: ['关闭', '停用', '关掉', '关', 'off', '停止']
                }
            },
            calculate: {
                keywords: ['计算', '算', '求', '运算', '执行', '开始', '运行'],
                numberPattern: /(\d+)/
            },
            screenshot: {
                keywords: ['截图', '截屏', '抓图', '保存画面', '拍照']
            },
            settings: {
                keywords: ['设置', '配置', '选项', '参数', '偏好'],
                actions: {
                    open: ['打开', '显示', '进入', '查看'],
                    close: ['关闭', '退出', '隐藏']
                }
            },
            scroll: {
                keywords: ['滚动', '翻页', '滑动', '移到'],
                directions: {
                    top: ['顶部', '上面', '上', '开头', '开始', '最上'],
                    bottom: ['底部', '下面', '下', '结尾', '最后', '最下']
                }
            },
            help: {
                keywords: ['帮助', '功能', '能做什么', '怎么用', '使用方法', '教程', '说明']
            },
            close: {
                keywords: ['关闭', '退出', '结束', '取消', '算了', '不用了']
            }
        };
        
        this.synonyms = {
            '切换': ['换', '转', '跳转', '跳'],
            '打开': ['开启', '启用', '启动', '开'],
            '关闭': ['关', '停用', '停止', '关掉'],
            '计算': ['算', '求', '运算', '执行'],
            '截图': ['截屏', '抓图', '拍照'],
            '设置': ['配置', '选项', '参数']
        };
    }
    
    parse(text) {
        const normalizedText = this.normalize(text);
        const result = {
            intent: null,
            entities: {},
            confidence: 0,
            originalText: text,
            normalizedText: normalizedText
        };
        
        const scores = {};
        
        for (const [intentName, intentConfig] of Object.entries(this.intents)) {
            scores[intentName] = this.calculateIntentScore(normalizedText, intentConfig);
        }
        
        const sortedIntents = Object.entries(scores)
            .sort((a, b) => b[1].score - a[1].score);
        
        if (sortedIntents.length > 0 && sortedIntents[0][1].score > 0) {
            const [bestIntent, intentData] = sortedIntents[0];
            result.intent = bestIntent;
            result.entities = intentData.entities || {};
            result.confidence = intentData.score;
        }
        
        return result;
    }
    
    normalize(text) {
        return text
            .toLowerCase()
            .replace(/\s+/g, '')
            .replace(/[，。！？、]/g, '')
            .trim();
    }
    
    calculateIntentScore(text, config) {
        let score = 0;
        const entities = {};
        
        for (const keyword of config.keywords) {
            if (text.includes(keyword)) {
                score += 0.3;
            }
        }
        
        if (config.entities) {
            for (const [entityName, entityKeywords] of Object.entries(config.entities)) {
                for (const keyword of entityKeywords) {
                    if (text.includes(keyword.toLowerCase())) {
                        entities.algorithm = entityName;
                        score += 0.5;
                        break;
                    }
                }
            }
        }
        
        if (config.actions) {
            for (const [actionName, actionKeywords] of Object.entries(config.actions)) {
                for (const keyword of actionKeywords) {
                    if (text.includes(keyword)) {
                        entities.action = actionName;
                        score += 0.4;
                        break;
                    }
                }
            }
        }
        
        if (config.directions) {
            for (const [dirName, dirKeywords] of Object.entries(config.directions)) {
                for (const keyword of dirKeywords) {
                    if (text.includes(keyword)) {
                        entities.direction = dirName;
                        score += 0.4;
                        break;
                    }
                }
            }
        }
        
        if (config.numberPattern) {
            const match = text.match(config.numberPattern);
            if (match) {
                entities.value = match[1];
                score += 0.3;
            }
        }
        
        return { score: Math.min(score, 1), entities };
    }
    
    extractNumber(text) {
        const patterns = [
            /(\d+)/,
            /零|一|二|三|四|五|六|七|八|九|十/,
            /百|千|万/
        ];
        
        for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match) {
                return this.convertToNumber(match[0]);
            }
        }
        return null;
    }
    
    convertToNumber(str) {
        const chineseNums = {
            '零': 0, '一': 1, '二': 2, '三': 3, '四': 4,
            '五': 5, '六': 6, '七': 7, '八': 8, '九': 9, '十': 10
        };
        
        if (/^\d+$/.test(str)) {
            return parseInt(str);
        }
        
        if (chineseNums[str] !== undefined) {
            return chineseNums[str];
        }
        
        return null;
    }
    
    fuzzyMatch(text, pattern, threshold = 0.6) {
        const normalizedText = text.toLowerCase();
        const normalizedPattern = pattern.toLowerCase();
        
        if (normalizedText.includes(normalizedPattern)) {
            return true;
        }
        
        const similarity = this.calculateSimilarity(normalizedText, normalizedPattern);
        return similarity >= threshold;
    }
    
    calculateSimilarity(str1, str2) {
        const len1 = str1.length;
        const len2 = str2.length;
        
        if (len1 === 0 || len2 === 0) return 0;
        
        const matrix = [];
        for (let i = 0; i <= len1; i++) {
            matrix[i] = [i];
        }
        for (let j = 0; j <= len2; j++) {
            matrix[0][j] = j;
        }
        
        for (let i = 1; i <= len1; i++) {
            for (let j = 1; j <= len2; j++) {
                const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
                matrix[i][j] = Math.min(
                    matrix[i - 1][j] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j - 1] + cost
                );
            }
        }
        
        const maxLen = Math.max(len1, len2);
        return (maxLen - matrix[len1][len2]) / maxLen;
    }
    
    suggestCommand(text) {
        const suggestions = [];
        const normalizedText = this.normalize(text);
        
        const commonCommands = [
            { text: '切换到SHA-256', intent: 'switch_algorithm', entity: 'sha256' },
            { text: '切换到ASCII', intent: 'switch_algorithm', entity: 'ascii' },
            { text: '打开手势控制', intent: 'toggle_gesture', entity: 'on' },
            { text: '关闭手势控制', intent: 'toggle_gesture', entity: 'off' },
            { text: '开始计算', intent: 'calculate' },
            { text: '截图', intent: 'screenshot' },
            { text: '打开设置', intent: 'settings', entity: 'open' },
            { text: '滚动到顶部', intent: 'scroll', entity: 'top' },
            { text: '帮助', intent: 'help' }
        ];
        
        for (const cmd of commonCommands) {
            if (this.fuzzyMatch(normalizedText, this.normalize(cmd.text), 0.4)) {
                suggestions.push(cmd);
            }
        }
        
        return suggestions.slice(0, 3);
    }
}

const semanticParser = new SemanticParser();

export default semanticParser;
export { SemanticParser };
