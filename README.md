# 平台跳跃游戏

基于 Phaser.js 开发的 Web 端跳跃平台游戏。

## 功能特性

- ✅ 平台跳跃游戏机制
- ✅ 多关卡系统
- ✅ 敌人AI和战斗系统
- ✅ 收集物品系统
- ✅ 本地存档功能
- ✅ 音效和背景音乐
- ✅ 粒子特效
- ✅ 完整UI系统

## 快速开始

### 安装依赖

```bash
npm install
```

### 运行游戏

```bash
npm run dev
```

然后在浏览器中打开 http://localhost:8000

## 游戏操作

- **方向键/WSAD**: 移动
- **空格键**: 跳跃（支持二段跳）
- **鼠标点击**: UI交互

## 项目结构

```
├── assets/              # 游戏资源
│   ├── images/         # 图片资源
│   ├── sprites/        # 精灵图
│   └── audio/          # 音频资源
├── js/
│   ├── components/     # 游戏组件
│   │   ├── Player.js
│   │   ├── Enemy.js
│   │   ├── Collectible.js
│   │   ├── Platform.js
│   │   └── ParticleSystem.js
│   ├── managers/       # 管理器
│   │   ├── LevelManager.js
│   │   ├── AudioManager.js
│   │   └── SaveManager.js
│   ├── scenes/         # 游戏场景
│   │   ├── BootScene.js
│   │   ├── MenuScene.js
│   │   ├── GameScene.js
│   │   ├── UIScene.js
│   │   ├── LevelCompleteScene.js
│   │   └── PauseScene.js
│   ├── data/           # 游戏数据
│   │   └── level1.json
│   ├── utils/          # 工具类
│   │   └── Debug.js
│   └── main.js         # 入口文件
├── index.html          # HTML文件
├── package.json        # 项目配置
└── README.md           # 项目文档
```

## 自定义关卡

关卡配置文件位于 `js/data/` 目录，可以参考 `level1.json` 创建新关卡。

### 关卡配置格式

```json
{
  "name": "关卡名称",
  "gravity": 1000,
  "platforms": [...],
  "collectibles": [...],
  "enemies": [...],
  "playerStart": { "x": 100, "y": 400 },
  "goal": { "x": 750, "y": 100 }
}
```

## 技术栈

- **Phaser 3.x**: 2D游戏引擎
- **ES6+ JavaScript**: 游戏逻辑
- **Web Audio API**: 音频系统
- **LocalStorage**: 本地存储

## 浏览器支持

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## 开发

### 添加新功能

1. 在 `components/` 创建新组件
2. 在 `managers/` 添加管理器（如需要）
3. 在对应的 `scenes/` 中集成
4. 更新相关文档

### 添加新关卡

1. 在 `js/data/` 创建新的 JSON 文件
2. 配置平台、收集物、敌人等
3. 在 `LevelManager` 中加载

## License

MIT
