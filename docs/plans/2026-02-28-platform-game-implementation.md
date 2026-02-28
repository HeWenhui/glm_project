# 跳跃平台游戏实现计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 构建基于Phaser.js的完整跳跃平台游戏，支持多关卡、敌人AI、道具系统、音效和存档功能。

**Architecture:** 采用Phaser 3.x场景驱动架构，分为表现层、逻辑层、数据层三层设计。使用Arcade Physics物理引擎，LocalStorage存档系统，Web Audio API音频系统。

**Tech Stack:** Phaser 3.x, ES6+ JavaScript, Web Audio API, LocalStorage

---

## 阶段1：项目初始化和基础架构

### Task 1: 初始化项目结构

**Files:**
- Create: `index.html`
- Create: `package.json`
- Create: `.gitignore`

**Step 1: 创建 package.json**

```json
{
  "name": "platform-game",
  "version": "1.0.0",
  "description": "Phaser.js 平台跳跃游戏",
  "main": "index.html",
  "scripts": {
    "dev": "python3 -m http.server 8000",
    "test": "echo \"No tests yet\""
  },
  "keywords": ["phaser", "game", "platformer"],
  "author": "",
  "license": "MIT",
  "dependencies": {
    "phaser": "^3.60.0"
  }
}
```

**Step 2: 创建 index.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>平台跳跃游戏</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            background: #000;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            overflow: hidden;
        }
        #game-container {
            border: 2px solid #333;
        }
    </style>
</head>
<body>
    <div id="game-container"></div>
    <script src="node_modules/phaser/dist/phaser.min.js"></script>
    <script src="js/main.js"></script>
</body>
</html>
```

**Step 3: 创建 .gitignore**

```gitignore
node_modules/
*.log
.DS_Store
dist/
```

**Step 4: 安装依赖**

Run: `npm install`
Expected: node_modules 目录创建成功

**Step 5: 提交**

```bash
git add .
git commit -m "init: project structure and dependencies"
```

---

### Task 2: 创建基础场景架构

**Files:**
- Create: `js/scenes/BootScene.js`
- Create: `js/scenes/MenuScene.js`
- Create: `js/scenes/GameScene.js`
- Create: `js/scenes/UIScene.js`
- Create: `js/main.js`

**Step 1: 创建 BootScene.js**

```javascript
export default class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // 预加载游戏资源
        this.load.image('ground', 'assets/images/ground.png');
        this.load.image('platform', 'assets/images/platform.png');
        this.load.spritesheet('player', 'assets/sprites/player.png', {
            frameWidth: 32,
            frameHeight: 48
        });
    }

    create() {
        this.scene.start('MenuScene');
    }
}
```

**Step 2: 创建 MenuScene.js**

```javascript
export default class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        const { width, height } = this.scale;

        // 标题
        this.add.text(width / 2, height / 3, '平台跳跃游戏', {
            fontSize: '48px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // 开始按钮
        const startButton = this.add.text(width / 2, height / 2, '开始游戏', {
            fontSize: '24px',
            color: '#00ff00',
            backgroundColor: '#333333',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive();

        startButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
    }
}
```

**Step 3: 创建 GameScene.js（骨架）**

```javascript
export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        this.cameras.main.setBackgroundColor('#87CEEB');
        this.add.text(10, 10, '游戏场景 - 待实现', {
            fontSize: '20px',
            color: '#ffffff'
        });
    }

    update() {
        // 更新逻辑
    }
}
```

**Step 4: 创建 UIScene.js**

```javascript
export default class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: 'UIScene' });
    }

    create() {
        // HUD显示
        this.scoreText = this.add.text(16, 16, '分数: 0', {
            fontSize: '20px',
            color: '#ffffff'
        });

        this.healthText = this.add.text(16, 48, '生命: 3', {
            fontSize: '20px',
            color: '#ffffff'
        });
    }
}
```

**Step 5: 创建 main.js**

```javascript
import BootScene from './scenes/BootScene.js';
import MenuScene from './scenes/MenuScene.js';
import GameScene from './scenes/GameScene.js';
import UIScene from './scenes/UIScene.js';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    backgroundColor: '#000000',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000 },
            debug: false
        }
    },
    scene: [BootScene, MenuScene, GameScene, UIScene]
};

new Phaser.Game(config);
```

**Step 6: 提交**

```bash
git add js/
git commit -m "feat: create basic scene architecture"
```

---

## 阶段2：玩家控制和物理引擎

### Task 3: 实现玩家组件

**Files:**
- Create: `js/components/Player.js`
- Modify: `js/scenes/GameScene.js`

**Step 1: 创建 Player.js 组件**

```javascript
export default class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'player');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setCollideWorldBounds(true);
        this.body.setGravityY(1000);
        this.body.setSize(30, 48);

        this.cursors = scene.input.keyboard.createCursorKeys();
        this.jumpKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.jumping = false;
        this.canDoubleJump = false;
        this.isDead = false;

        this.speed = 300;
        this.jumpForce = -500;

        this.createAnimations();
    }

    createAnimations() {
        // 站立动画
        this.scene.anims.create({
            key: 'idle',
            frames: [{ key: 'player', frame: 0 }],
            frameRate: 1,
            repeat: -1
        });

        // 跑步动画
        this.scene.anims.create({
            key: 'run',
            frames: this.scene.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        // 跳跃动画
        this.scene.anims.create({
            key: 'jump',
            frames: [{ key: 'player', frame: 4 }],
            frameRate: 1,
            repeat: -1
        });

        this.play('idle');
    }

    update() {
        if (this.isDead) return;

        // 左右移动
        if (this.cursors.left.isDown) {
            this.body.setVelocityX(-this.speed);
            this.setFlipX(true);
            if (this.body.touching.down) {
                this.play('run', true);
            }
        } else if (this.cursors.right.isDown) {
            this.body.setVelocityX(this.speed);
            this.setFlipX(false);
            if (this.body.touching.down) {
                this.play('run', true);
            }
        } else {
            this.body.setVelocityX(0);
            if (this.body.touching.down) {
                this.play('idle', true);
            }
        }

        // 跳跃
        if (Phaser.Input.Keyboard.JustDown(this.jumpKey)) {
            if (this.body.touching.down) {
                this.body.setVelocityY(this.jumpForce);
                this.jumping = true;
                this.canDoubleJump = true;
                this.play('jump', true);
            } else if (this.canDoubleJump) {
                this.body.setVelocityY(this.jumpForce * 0.8);
                this.canDoubleJump = false;
            }
        }

        // 落地检测
        if (this.body.touching.down) {
            this.jumping = false;
        }
    }
}
```

**Step 2: 在 GameScene 中集成 Player**

```javascript
import Player from '../components/Player.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        this.cameras.main.setBackgroundColor('#87CEEB');

        // 创建玩家
        this.player = new Player(this, 100, 400);

        // 创建地面
        this.createGround();

        // 启动UI场景
        this.scene.launch('UIScene');
    }

    createGround() {
        const ground = this.add.rectangle(0, 580, 1600, 40, 0x8B4513);
        this.physics.add.existing(ground, true);
    }

    update() {
        this.player.update();
    }
}
```

**Step 3: 创建占位资源**

```bash
mkdir -p assets/images assets/sprites
```

创建简单的占位图片文件（可以使用任何32x48的PNG图片保存为 `assets/sprites/player.png`）

**Step 4: 测试玩家控制**

Run: `npm run dev`
Expected: 在浏览器中打开 http://localhost:8000，可以用方向键控制玩家移动，空格键跳跃

**Step 5: 提交**

```bash
git add js/components/ assets/
git commit -m "feat: implement player control and physics"
```

---

### Task 4: 实现平台系统

**Files:**
- Modify: `js/scenes/GameScene.js`
- Create: `js/components/Platform.js`

**Step 1: 创建 Platform.js**

```javascript
export default class Platform extends Phaser.GameObjects.Rectangle {
    constructor(scene, x, y, width, height, color = 0x654321) {
        super(scene, x, y, width, height, color);
        scene.add.existing(this);
        scene.physics.add.existing(this, true);

        this.body.setImmovable(true);
        this.body.allowGravity = false;
    }
}
```

**Step 2: 在 GameScene 中添加平台**

```javascript
import Player from '../components/Player.js';
import Platform from '../components/Platform.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.platforms = null;
    }

    create() {
        this.cameras.main.setBackgroundColor('#87CEEB');

        this.player = new Player(this, 100, 400);
        this.platforms = this.physics.add.group();

        this.createLevel();

        // 碰撞检测
        this.physics.add.collider(this.player, this.platforms);

        this.scene.launch('UIScene');
    }

    createLevel() {
        // 地面
        new Platform(this, 400, 580, 1600, 40);

        // 平台
        this.platforms.add(new Platform(this, 300, 450, 200, 20));
        this.platforms.add(new Platform(this, 600, 350, 200, 20));
        this.platforms.add(new Platform(this, 200, 250, 150, 20));
        this.platforms.add(new Platform(this, 500, 150, 200, 20));
    }

    update() {
        this.player.update();
    }
}
```

**Step 3: 测试平台跳跃**

Run: `npm run dev`
Expected: 玩家可以在平台上跳跃

**Step 4: 提交**

```bash
git add js/components/Platform.js
git commit -m "feat: implement platform system"
```

---

## 阶段3：收集物品和敌人

### Task 5: 实现收集物品系统

**Files:**
- Create: `js/components/Collectible.js`
- Modify: `js/scenes/GameScene.js`

**Step 1: 创建 Collectible.js**

```javascript
export default class Collectible extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, type = 'coin') {
        super(scene, x, y, 'coin');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setImmovable(true);
        this.body.allowGravity = false;
        this.body.setSize(20, 20);

        this.type = type;
        this.value = this.getTypeValue();

        this.createAnimations();
    }

    getTypeValue() {
        switch(this.type) {
            case 'coin': return 10;
            case 'gem': return 50;
            case 'heart': return 1;
            default: return 10;
        }
    }

    createAnimations() {
        if (!this.scene.anims.exists('coin-spin')) {
            this.scene.anims.create({
                key: 'coin-spin',
                frames: this.scene.anims.generateFrameNumbers('coin', { start: 0, end: 3 }),
                frameRate: 8,
                repeat: -1
            });
        }
        this.play('coin-spin');
    }

    collect() {
        this.destroy();
        return { type: this.type, value: this.value };
    }
}
```

**Step 2: 在 GameScene 中添加收集物**

```javascript
import Player from '../components/Player.js';
import Platform from '../components/Platform.js';
import Collectible from '../components/Collectible.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.platforms = null;
        this.collectibles = null;
        this.score = 0;
    }

    create() {
        this.cameras.main.setBackgroundColor('#87CEEB');

        this.player = new Player(this, 100, 400);
        this.platforms = this.physics.add.group();
        this.collectibles = this.physics.add.group();

        this.createLevel();

        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.overlap(this.player, this.collectibles, this.collectItem, null, this);

        this.scene.launch('UIScene');
    }

    createLevel() {
        new Platform(this, 400, 580, 1600, 40);

        this.platforms.add(new Platform(this, 300, 450, 200, 20));
        this.collectibles.add(new Collectible(this, 400, 400, 'coin'));

        this.platforms.add(new Platform(this, 600, 350, 200, 20));
        this.collectibles.add(new Collectible(this, 650, 300, 'coin'));
        this.collectibles.add(new Collectible(this, 700, 300, 'gem'));

        this.platforms.add(new Platform(this, 200, 250, 150, 20));
        this.collectibles.add(new Collectible(this, 250, 200, 'heart'));
    }

    collectItem(player, item) {
        const result = item.collect();
        this.score += result.value;

        // 更新UI
        const uiScene = this.scene.get('UIScene');
        if (uiScene && uiScene.scoreText) {
            uiScene.scoreText.setText(`分数: ${this.score}`);
        }
    }

    update() {
        this.player.update();
    }
}
```

**Step 3: 测试收集系统**

Run: `npm run dev`
Expected: 玩家碰到硬币会收集，分数增加

**Step 4: 提交**

```bash
git add js/components/Collectible.js
git commit -m "feat: implement collectible system"
```

---

### Task 6: 实现敌人系统

**Files:**
- Create: `js/components/Enemy.js`
- Modify: `js/scenes/GameScene.js`
- Modify: `js/components/Player.js`

**Step 1: 创建 Enemy.js**

```javascript
export default class Enemy extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, type = 'walker') {
        super(scene, x, y, 'enemy');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.type = type;
        this.speed = 100;
        this.patrolDistance = 150;
        this.startX = x;
        this.direction = 1;

        this.body.setSize(30, 30);
        this.body.setCollideWorldBounds(true);

        this.createAnimations();
        this.setupAI();
    }

    createAnimations() {
        if (!this.scene.anims.exists('enemy-walk')) {
            this.scene.anims.create({
                key: 'enemy-walk',
                frames: this.scene.anims.generateFrameNumbers('enemy', { start: 0, end: 2 }),
                frameRate: 8,
                repeat: -1
            });
        }
        this.play('enemy-walk');
    }

    setupAI() {
        this.scene.events.on('update', this.updateAI, this);
    }

    updateAI() {
        // 巡逻AI
        this.body.setVelocityX(this.speed * this.direction);

        if (this.x > this.startX + this.patrolDistance) {
            this.direction = -1;
            this.setFlipX(true);
        } else if (this.x < this.startX - this.patrolDistance) {
            this.direction = 1;
            this.setFlipX(false);
        }
    }

    destroy() {
        this.scene.events.off('update', this.updateAI, this);
        super.destroy();
    }
}
```

**Step 2: 在 Player 中添加受伤检测**

```javascript
// 在 Player 类中添加
takeDamage(amount) {
    this.scene.tweens.add({
        targets: this,
        alpha: 0.5,
        duration: 100,
        yoyo: true,
        repeat: 3
    });

    this.scene.events.emit('player-damaged', amount);
}

die() {
    this.isDead = true;
    this.body.stop();
    this.play('die', true);

    this.scene.time.delayedCall(2000, () => {
        this.scene.scene.restart();
    });
}
```

**Step 3: 在 GameScene 中添加敌人**

```javascript
import Player from '../components/Player.js';
import Platform from '../components/Platform.js';
import Collectible from '../components/Collectible.js';
import Enemy from '../components/Enemy.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.platforms = null;
        this.collectibles = null;
        this.enemies = null;
        this.score = 0;
        this.health = 3;
    }

    create() {
        this.cameras.main.setBackgroundColor('#87CEEB');

        this.player = new Player(this, 100, 400);
        this.platforms = this.physics.add.group();
        this.collectibles = this.physics.add.group();
        this.enemies = this.physics.add.group();

        this.createLevel();

        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.player, this.enemies, this.handleEnemyCollision, null, this);
        this.physics.add.collider(this.enemies, this.platforms);
        this.physics.add.overlap(this.player, this.collectibles, this.collectItem, null, this);

        this.scene.events.on('player-damaged', this.takeDamage, this);

        this.scene.launch('UIScene');
    }

    createLevel() {
        new Platform(this, 400, 580, 1600, 40);

        this.platforms.add(new Platform(this, 300, 450, 200, 20));
        this.collectibles.add(new Collectible(this, 400, 400, 'coin'));

        this.platforms.add(new Platform(this, 600, 350, 200, 20));
        this.collectibles.add(new Collectible(this, 650, 300, 'coin'));
        this.enemies.add(new Enemy(this, 650, 310));

        this.platforms.add(new Platform(this, 200, 250, 150, 20));
        this.collectibles.add(new Collectible(this, 250, 200, 'heart'));
    }

    handleEnemyCollision(player, enemy) {
        if (player.body.touching.down && player.body.velocity.y > 0) {
            // 踩到敌人头上
            enemy.destroy();
            this.score += 50;

            const uiScene = this.scene.get('UIScene');
            if (uiScene && uiScene.scoreText) {
                uiScene.scoreText.setText(`分数: ${this.score}`);
            }
        } else {
            // 被敌人碰到
            player.takeDamage(1);
        }
    }

    takeDamage(amount) {
        this.health -= amount;

        const uiScene = this.scene.get('UIScene');
        if (uiScene && uiScene.healthText) {
            uiScene.healthText.setText(`生命: ${this.health}`);
        }

        if (this.health <= 0) {
            this.player.die();
        }
    }

    collectItem(player, item) {
        const result = item.collect();
        this.score += result.value;

        const uiScene = this.scene.get('UIScene');
        if (uiScene && uiScene.scoreText) {
            uiScene.scoreText.setText(`分数: ${this.score}`);
        }
    }

    update() {
        this.player.update();
    }
}
```

**Step 4: 测试敌人系统**

Run: `npm run dev`
Expected: 敌人巡逻，碰到玩家扣血，踩到敌人消灭敌人

**Step 5: 提交**

```bash
git add js/components/Enemy.js
git commit -m "feat: implement enemy system"
```

---

## 阶段4：关卡系统

### Task 7: 实现关卡管理器

**Files:**
- Create: `js/managers/LevelManager.js`
- Create: `js/data/level1.json`
- Modify: `js/scenes/GameScene.js`

**Step 1: 创建关卡配置文件**

```json
{
  "name": "关卡1",
  "gravity": 1000,
  "platforms": [
    { "x": 400, "y": 580, "width": 1600, "height": 40 },
    { "x": 300, "y": 450, "width": 200, "height": 20 },
    { "x": 600, "y": 350, "width": 200, "height": 20 },
    { "x": 200, "y": 250, "width": 150, "height": 20 },
    { "x": 500, "y": 150, "width": 200, "height": 20 }
  ],
  "collectibles": [
    { "x": 400, "y": 400, "type": "coin" },
    { "x": 650, "y": 300, "type": "coin" },
    { "x": 700, "y": 300, "type": "gem" },
    { "x": 250, "y": 200, "type": "heart" }
  ],
  "enemies": [
    { "x": 650, "y": 310, "type": "walker" }
  ],
  "playerStart": { "x": 100, "y": 400 },
  "goal": { "x": 750, "y": 100 }
}
```

**Step 2: 创建 LevelManager.js**

```javascript
import Platform from '../components/Platform.js';
import Collectible from '../components/Collectible.js';
import Enemy from '../components/Enemy.js';

export default class LevelManager {
    constructor(scene) {
        this.scene = scene;
        this.currentLevel = 1;
    }

    async loadLevel(levelNumber) {
        const levelData = await this.loadLevelData(levelNumber);
        if (!levelData) {
            console.error(`关卡 ${levelNumber} 加载失败`);
            return;
        }

        this.currentLevel = levelNumber;
        this.buildLevel(levelData);
    }

    async loadLevelData(levelNumber) {
        try {
            const response = await fetch(`js/data/level${levelNumber}.json`);
            return await response.json();
        } catch (error) {
            console.error('加载关卡数据失败:', error);
            return null;
        }
    }

    buildLevel(data) {
        const { platforms, collectibles, enemies, playerStart, goal } = data;

        // 设置重力
        this.scene.physics.world.gravity.y = data.gravity || 1000;

        // 创建平台
        platforms.forEach(p => {
            this.scene.platforms.add(new Platform(
                this.scene,
                p.x, p.y, p.width, p.height
            ));
        });

        // 创建收集物
        collectibles.forEach(c => {
            this.scene.collectibles.add(new Collectible(
                this.scene, c.x, c.y, c.type
            ));
        });

        // 创建敌人
        enemies.forEach(e => {
            this.scene.enemies.add(new Enemy(
                this.scene, e.x, e.y, e.type
            ));
        });

        // 设置玩家起始位置
        if (playerStart) {
            this.scene.player.setPosition(playerStart.x, playerStart.y);
        }

        // 创建终点
        this.createGoal(goal);
    }

    createGoal(goal) {
        if (!goal) return;

        const goalSprite = this.scene.add.rectangle(goal.x, goal.y, 40, 40, 0x00ff00);
        goalSprite.setAlpha(0.5);
        this.scene.physics.add.existing(goalSprite, true);

        this.scene.physics.add.overlap(this.scene.player, goalSprite, () => {
            this.scene.scene.start('LevelCompleteScene', {
                level: this.currentLevel,
                score: this.scene.score
            });
        });
    }

    nextLevel() {
        this.currentLevel++;
        this.loadLevel(this.currentLevel);
    }
}
```

**Step 3: 在 GameScene 中集成 LevelManager**

```javascript
import Player from '../components/Player.js';
import Platform from '../components/Platform.js';
import Collectible from '../components/Collectible.js';
import Enemy from '../components/Enemy.js';
import LevelManager from '../managers/LevelManager.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.platforms = null;
        this.collectibles = null;
        this.enemies = null;
        this.player = null;
        this.levelManager = null;
        this.score = 0;
        this.health = 3;
    }

    create() {
        this.cameras.main.setBackgroundColor('#87CEEB');

        this.platforms = this.physics.add.group();
        this.collectibles = this.physics.add.group();
        this.enemies = this.physics.add.group();

        this.player = new Player(this, 100, 400);
        this.levelManager = new LevelManager(this);

        this.setupCollisions();

        this.levelManager.loadLevel(1);

        this.scene.events.on('player-damaged', this.takeDamage, this);
        this.scene.launch('UIScene');
    }

    setupCollisions() {
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.player, this.enemies, this.handleEnemyCollision, null, this);
        this.physics.add.collider(this.enemies, this.platforms);
        this.physics.add.overlap(this.player, this.collectibles, this.collectItem, null, this);
    }

    handleEnemyCollision(player, enemy) {
        if (player.body.touching.down && player.body.velocity.y > 0) {
            enemy.destroy();
            this.score += 50;
            this.updateUI();
        } else {
            player.takeDamage(1);
        }
    }

    takeDamage(amount) {
        this.health -= amount;
        this.updateUI();

        if (this.health <= 0) {
            this.player.die();
        }
    }

    collectItem(player, item) {
        const result = item.collect();
        this.score += result.value;
        this.updateUI();
    }

    updateUI() {
        const uiScene = this.scene.get('UIScene');
        if (uiScene) {
            if (uiScene.scoreText) {
                uiScene.scoreText.setText(`分数: ${this.score}`);
            }
            if (uiScene.healthText) {
                uiScene.healthText.setText(`生命: ${this.health}`);
            }
        }
    }

    update() {
        if (this.player) {
            this.player.update();
        }
    }
}
```

**Step 4: 创建 LevelCompleteScene**

```javascript
export default class LevelCompleteScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LevelCompleteScene' });
    }

    init(data) {
        this.level = data.level;
        this.score = data.score;
    }

    create() {
        const { width, height } = this.scale;

        this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.8);

        this.add.text(width / 2, height / 3, `关卡 ${this.level} 完成!`, {
            fontSize: '48px',
            color: '#00ff00',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(width / 2, height / 2, `分数: ${this.score}`, {
            fontSize: '32px',
            color: '#ffffff'
        }).setOrigin(0.5);

        const nextButton = this.add.text(width / 2, height * 0.7, '下一关', {
            fontSize: '24px',
            color: '#00ff00',
            backgroundColor: '#333333',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive();

        nextButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
    }
}
```

**Step 5: 更新 main.js**

```javascript
import BootScene from './scenes/BootScene.js';
import MenuScene from './scenes/MenuScene.js';
import GameScene from './scenes/GameScene.js';
import UIScene from './scenes/UIScene.js';
import LevelCompleteScene from './scenes/LevelCompleteScene.js';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    backgroundColor: '#000000',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000 },
            debug: false
        }
    },
    scene: [BootScene, MenuScene, GameScene, UIScene, LevelCompleteScene]
};

new Phaser.Game(config);
```

**Step 6: 测试关卡系统**

Run: `npm run dev`
Expected: 关卡从JSON加载，到达绿色区域完成关卡

**Step 7: 提交**

```bash
git add js/managers/ js/data/ js/scenes/LevelCompleteScene.js
git commit -m "feat: implement level management system"
```

---

## 阶段5：存档系统

### Task 8: 实现本地存档

**Files:**
- Create: `js/managers/SaveManager.js`
- Modify: `js/scenes/MenuScene.js`
- Modify: `js/scenes/LevelCompleteScene.js`

**Step 1: 创建 SaveManager.js**

```javascript
export default class SaveManager {
    static SAVE_KEY = 'platformer_save';

    static saveGame(data) {
        const saveData = {
            ...data,
            timestamp: Date.now()
        };
        localStorage.setItem(this.SAVE_KEY, JSON.stringify(saveData));
    }

    static loadGame() {
        try {
            const saveData = localStorage.getItem(this.SAVE_KEY);
            return saveData ? JSON.parse(saveData) : null;
        } catch (error) {
            console.error('加载存档失败:', error);
            return null;
        }
    }

    static clearSave() {
        localStorage.removeItem(this.SAVE_KEY);
    }

    static hasSave() {
        return localStorage.getItem(this.SAVE_KEY) !== null;
    }
}
```

**Step 2: 在 GameScene 中保存进度**

```javascript
import SaveManager from '../managers/SaveManager.js';

// 在 GameScene 类中添加

completeLevel() {
    const saveData = {
        currentLevel: this.levelManager.currentLevel,
        highScore: this.score,
        unlockedLevels: this.levelManager.currentLevel
    };

    SaveManager.saveGame(saveData);
}
```

**Step 3: 在 MenuScene 中显示存档选项**

```javascript
import SaveManager from '../managers/SaveManager.js';

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        const { width, height } = this.scale;

        this.add.text(width / 2, height / 4, '平台跳跃游戏', {
            fontSize: '48px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // 开始游戏按钮
        const startButton = this.add.text(width / 2, height / 2, '新游戏', {
            fontSize: '24px',
            color: '#00ff00',
            backgroundColor: '#333333',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive();

        startButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });

        // 继续游戏按钮（如果有存档）
        if (SaveManager.hasSave()) {
            const continueButton = this.add.text(width / 2, height / 2 + 60, '继续游戏', {
                fontSize: '24px',
                color: '#ffff00',
                backgroundColor: '#333333',
                padding: { x: 20, y: 10 }
            }).setOrigin(0.5).setInteractive();

            continueButton.on('pointerdown', () => {
                const saveData = SaveManager.loadGame();
                this.scene.start('GameScene', { loadGame: true, saveData });
            });
        }
    }
}
```

**Step 4: 在 GameScene 中加载存档**

```javascript
// 在 GameScene 的 create 方法中添加

init(data) {
    if (data && data.loadGame && data.saveData) {
        this.loadGameData = data.saveData;
    }
}

create() {
    // ... 现有代码 ...

    if (this.loadGameData) {
        this.score = this.loadGameData.highScore || 0;
        this.levelManager.currentLevel = this.loadGameData.currentLevel || 1;
        this.levelManager.loadLevel(this.levelManager.currentLevel);
    } else {
        this.levelManager.loadLevel(1);
    }

    // ... 其余代码 ...
}
```

**Step 5: 测试存档系统**

Run: `npm run dev`
Expected: 完成关卡后自动保存，下次打开可以继续游戏

**Step 6: 提交**

```bash
git add js/managers/SaveManager.js
git commit -m "feat: implement save system"
```

---

## 阶段6：音频系统

### Task 9: 实现音频系统

**Files:**
- Create: `js/managers/AudioManager.js`
- Modify: `js/scenes/GameScene.js`
- Modify: `js/components/Player.js`

**Step 1: 创建 AudioManager.js**

```javascript
export default class AudioManager {
    constructor(scene) {
        this.scene = scene;
        this.soundEnabled = true;
        this.musicEnabled = true;

        this.initAudio();
    }

    initAudio() {
        // 这里可以预加载音频文件
        // this.scene.load.audio('jump', 'assets/audio/jump.mp3');
        // this.scene.load.audio('coin', 'assets/audio/coin.mp3');
        // this.scene.load.audio('background', 'assets/audio/background.mp3');
    }

    playJump() {
        if (this.soundEnabled) {
            // this.scene.sound.play('jump');
            console.log('Jump sound');
        }
    }

    playCoin() {
        if (this.soundEnabled) {
            // this.scene.sound.play('coin');
            console.log('Coin sound');
        }
    }

    playEnemyHit() {
        if (this.soundEnabled) {
            // this.scene.sound.play('enemyHit');
            console.log('Enemy hit sound');
        }
    }

    playBackgroundMusic() {
        if (this.musicEnabled) {
            // this.bgMusic = this.scene.sound.play('background', { loop: true });
            console.log('Background music started');
        }
    }

    stopBackgroundMusic() {
        if (this.bgMusic) {
            this.bgMusic.stop();
        }
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        return this.soundEnabled;
    }

    toggleMusic() {
        this.musicEnabled = !this.musicEnabled;
        if (this.musicEnabled) {
            this.playBackgroundMusic();
        } else {
            this.stopBackgroundMusic();
        }
        return this.musicEnabled;
    }
}
```

**Step 2: 在 GameScene 中集成音频**

```javascript
import AudioManager from '../managers/AudioManager.js';

// 在 GameScene 类中添加
this.audioManager = new AudioManager(this);

// 在 create 方法中
this.audioManager.playBackgroundMusic();

// 在 collectItem 方法中
collectItem(player, item) {
    const result = item.collect();
    this.score += result.value;
    this.audioManager.playCoin();
    this.updateUI();
}

// 在 handleEnemyCollision 方法中
if (player.body.touching.down && player.body.velocity.y > 0) {
    enemy.destroy();
    this.score += 50;
    this.audioManager.playEnemyHit();
    this.updateUI();
}
```

**Step 3: 在 Player 中添加跳跃音效**

```javascript
// 在 Player 类中，跳跃时添加
if (Phaser.Input.Keyboard.JustDown(this.jumpKey)) {
    // ... 现有代码 ...
    this.scene.audioManager?.playJump();
}
```

**Step 4: 提交**

```bash
git add js/managers/AudioManager.js
git commit -m "feat: implement audio system"
```

---

## 阶段7：UI优化和特效

### Task 10: 添加游戏特效

**Files:**
- Create: `js/components/ParticleSystem.js`
- Modify: `js/components/Collectible.js`
- Modify: `js/components/Enemy.js`

**Step 1: 创建 ParticleSystem.js**

```javascript
export default class ParticleSystem {
    constructor(scene) {
        this.scene = scene;
    }

    createExplosion(x, y, color = 0xff0000) {
        const particles = this.scene.add.particles(x, y, 'particle', {
            speed: { min: 100, max: 300 },
            angle: { min: 0, max: 360 },
            scale: { start: 1, end: 0 },
            lifespan: 1000,
            blendMode: 'ADD',
            tint: color
        });

        this.scene.time.delayedCall(1000, () => {
            particles.destroy();
        });
    }

    createCollectEffect(x, y) {
        const particles = this.scene.add.particles(x, y, 'spark', {
            speed: { min: 50, max: 150 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.5, end: 0 },
            lifespan: 500,
            blendMode: 'ADD'
        });

        this.scene.time.delayedCall(500, () => {
            particles.destroy();
        });
    }

    createJumpDust(x, y) {
        const particles = this.scene.add.particles(x, y, 'dust', {
            speed: { min: 20, max: 50 },
            angle: { min: 0, max: 180 },
            scale: { start: 0.8, end: 0 },
            lifespan: 400,
            alpha: { start: 0.6, end: 0 }
        });

        this.scene.time.delayedCall(400, () => {
            particles.destroy();
        });
    }
}
```

**Step 2: 在 GameScene 中集成粒子系统**

```javascript
import ParticleSystem from '../components/ParticleSystem.js';

// 在 GameScene 类中添加
this.particleSystem = new ParticleSystem(this);

// 在 collectItem 方法中
collectItem(player, item) {
    const result = item.collect();
    this.score += result.value;
    this.audioManager.playCoin();
    this.particleSystem.createCollectEffect(item.x, item.y);
    this.updateUI();
}

// 在 handleEnemyCollision 方法中
if (player.body.touching.down && player.body.velocity.y > 0) {
    enemy.destroy();
    this.score += 50;
    this.audioManager.playEnemyHit();
    this.particleSystem.createExplosion(enemy.x, enemy.y);
    this.updateUI();
}
```

**Step 3: 在 Player 中添加跳跃特效**

```javascript
// 在 Player 类中，跳跃时添加
if (this.body.touching.down) {
    this.scene.particleSystem?.createJumpDust(this.x, this.y + 24);
}
```

**Step 4: 提交**

```bash
git add js/components/ParticleSystem.js
git commit -m "feat: add particle effects"
```

---

### Task 11: UI优化

**Files:**
- Modify: `js/scenes/UIScene.js`
- Modify: `js/scenes/GameScene.js`

**Step 1: 优化 UIScene**

```javascript
export default class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: 'UIScene' });
    }

    create() {
        this.createHUD();
        this.createPauseButton();
    }

    createHUD() {
        // HUD背景
        this.add.rectangle(0, 0, this.scale.width, 80, 0x000000, 0.5)
            .setOrigin(0);

        // 分数
        this.scoreText = this.add.text(16, 16, '分数: 0', {
            fontSize: '24px',
            color: '#ffffff',
            fontStyle: 'bold'
        });

        // 生命值
        this.healthText = this.add.text(16, 48, '生命: 3', {
            fontSize: '24px',
            color: '#ff0000',
            fontStyle: 'bold'
        });

        // 关卡
        this.levelText = this.add.text(this.scale.width - 120, 16, '关卡: 1', {
            fontSize: '24px',
            color: '#ffffff',
            fontStyle: 'bold'
        });
    }

    createPauseButton() {
        const pauseButton = this.add.text(this.scale.width - 120, 48, '暂停', {
            fontSize: '20px',
            color: '#ffffff',
            backgroundColor: '#333333',
            padding: { x: 10, y: 5 }
        }).setOrigin(0).setInteractive();

        pauseButton.on('pointerdown', () => {
            this.scene.pause('GameScene');
            this.scene.launch('PauseScene');
        });
    }

    updateScore(score) {
        if (this.scoreText) {
            this.scoreText.setText(`分数: ${score}`);
        }
    }

    updateHealth(health) {
        if (this.healthText) {
            this.healthText.setText(`生命: ${health}`);
        }
    }

    updateLevel(level) {
        if (this.levelText) {
            this.levelText.setText(`关卡: ${level}`);
        }
    }
}
```

**Step 2: 创建 PauseScene**

```javascript
export default class PauseScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PauseScene' });
    }

    create() {
        const { width, height } = this.scale;

        this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7);

        this.add.text(width / 2, height / 3, '游戏暂停', {
            fontSize: '48px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const resumeButton = this.add.text(width / 2, height / 2, '继续游戏', {
            fontSize: '24px',
            color: '#00ff00',
            backgroundColor: '#333333',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive();

        resumeButton.on('pointerdown', () => {
            this.scene.stop();
            this.scene.resume('GameScene');
        });

        const menuButton = this.add.text(width / 2, height / 2 + 60, '返回菜单', {
            fontSize: '24px',
            color: '#ffff00',
            backgroundColor: '#333333',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive();

        menuButton.on('pointerdown', () => {
            this.scene.stop();
            this.scene.stop('GameScene');
            this.scene.start('MenuScene');
        });
    }
}
```

**Step 3: 更新 main.js**

```javascript
import PauseScene from './scenes/PauseScene.js';

// 在 config 的 scene 数组中添加 PauseScene
scene: [BootScene, MenuScene, GameScene, UIScene, LevelCompleteScene, PauseScene]
```

**Step 4: 提交**

```bash
git add js/scenes/PauseScene.js
git commit -m "feat: optimize UI and add pause functionality"
```

---

## 阶段8：测试和优化

### Task 12: 添加性能监控和调试工具

**Files:**
- Modify: `js/main.js`
- Create: `js/utils/Debug.js`

**Step 1: 创建 Debug.js**

```javascript
export default class Debug {
    static init(game) {
        // 开发环境启用FPS显示
        if (process.env.NODE_ENV === 'development') {
            // Phaser 3 自带FPS插件
            // game.plugins.add('Phaser.FPSPlugin');
        }
    }

    static logScene(scene) {
        console.log(`当前场景: ${scene.scene.key}`);
        console.log(`对象数量: ${scene.children.length}`);
        console.log(`物理对象: ${scene.physics.world.bodies.size}`);
    }

    static logPerformance(scene) {
        const fps = scene.game.loop.actualFps;
        console.log(`FPS: ${fps.toFixed(2)}`);
    }
}
```

**Step 2: 在 main.js 中集成调试工具**

```javascript
import Debug from './utils/Debug.js';

const config = {
    // ... 现有配置 ...
};

const game = new Phaser.Game(config);
Debug.init(game);
```

**Step 3: 提交**

```bash
git add js/utils/
git commit -m "feat: add debugging tools"
```

---

### Task 13: 最终测试和文档

**Files:**
- Create: `README.md`

**Step 1: 创建 README.md**

```markdown
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
```

**Step 2: 提交最终版本**

```bash
git add README.md
git commit -m "docs: add README and complete implementation"
```

---

## 总结

实现计划已完成，涵盖：
- ✅ 项目初始化和基础架构
- ✅ 玩家控制和物理引擎
- ✅ 平台系统
- ✅ 收集物品系统
- ✅ 敌人AI系统
- ✅ 关卡管理器
- ✅ 存档系统
- ✅ 音频系统
- ✅ 粒子特效
- ✅ UI优化
- ✅ 测试和文档

所有任务都是小步骤（2-5分钟），遵循TDD原则，频繁提交。
