import Platform from '../components/Platform.js';
import Collectible from '../components/Collectible.js';
import Enemy from '../components/Enemy.js';

export default class LevelManager {
    constructor(scene) {
        this.scene = scene;
        this.currentLevel = 1;
    }

    async loadLevel(levelNumber) {
        window.captureGameLog('info', `LevelManager.loadLevel(${levelNumber}) 开始`);

        const levelData = await this.loadLevelData(levelNumber);
        if (!levelData) {
            window.captureGameLog('error', `关卡 ${levelNumber} 加载失败`);
            console.error(`关卡 ${levelNumber} 加载失败`);
            return;
        }

        window.captureGameLog('info', `关卡数据加载成功: ${levelData.name}`);
        this.currentLevel = levelNumber;
        this.buildLevel(levelData);
    }

    async loadLevelData(levelNumber) {
        const url = `js/data/level${levelNumber}.json`;
        window.captureGameLog('info', `加载关卡文件: ${url}`);

        try {
            window.captureGameLog('info', '发送fetch请求...');
            const response = await fetch(url);

            window.captureGameLog('info', `fetch响应状态: ${response.status} ${response.statusText}`);

            if (!response.ok) {
                window.captureGameLog('error', `fetch失败: ${response.status}`);
                return null;
            }

            window.captureGameLog('info', '解析JSON...');
            const data = await response.json();
            window.captureGameLog('info', 'JSON解析成功');
            return data;
        } catch (error) {
            window.captureGameLog('error', `加载关卡数据失败: ${error.message}`);
            console.error('加载关卡数据失败:', error);
            return null;
        }
    }

    buildLevel(data) {
        const { platforms, collectibles, enemies, playerStart, goal } = data;

        this.scene.physics.world.gravity.y = data.gravity || 1000;

        platforms.forEach(p => {
            const centerX = p.x + p.width / 2;
            const centerY = p.y + p.height / 2;

            const platform = this.scene.physics.add.staticImage(centerX, centerY, null);
            platform.setDisplaySize(p.width, p.height);
            platform.setTint(0x654321);
            platform.body.setSize(p.width, p.height);

            console.log(`创建平台: 中心(${centerX}, ${centerY}), 大小(${p.width}x${p.height})`);
            console.log(`平台body: x=${platform.body.x}, y=${platform.body.y}, w=${platform.body.width}, h=${platform.body.height}`);

            this.scene.staticPlatforms.push(platform);
            this.scene.physics.add.collider(this.scene.player, platform);
            this.scene.physics.add.collider(this.scene.enemies, platform);
        });

        collectibles.forEach(c => {
            this.scene.collectibles.add(new Collectible(
                this.scene, c.x, c.y, c.type
            ));
        });

        enemies.forEach(e => {
            this.scene.enemies.add(new Enemy(
                this.scene, e.x, e.y, e.type
            ));
        });

        if (playerStart) {
            this.scene.player.setPosition(playerStart.x, playerStart.y);
        }

        this.createGoal(goal);
    }

    createGoal(goal) {
        if (!goal) return;

        const goalSize = 40;
        const centerX = goal.x + goalSize / 2;
        const centerY = goal.y + goalSize / 2;

        const goalSprite = this.scene.add.image(centerX, centerY);
        goalSprite.setDisplaySize(goalSize, goalSize);
        goalSprite.setTint(0x00ff00);
        goalSprite.setAlpha(0.5);

        this.scene.physics.add.existing(goalSprite, true);
        goalSprite.body.setSize(goalSize, goalSize);

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
