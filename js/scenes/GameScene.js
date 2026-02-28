import Player from '../components/Player.js';
import Platform from '../components/Platform.js';
import Collectible from '../components/Collectible.js';
import Enemy from '../components/Enemy.js';
import LevelManager from '../managers/LevelManager.js';
import SaveManager from '../managers/SaveManager.js';
import AudioManager from '../managers/AudioManager.js';
import ParticleSystem from '../components/ParticleSystem.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.platforms = null;
        this.collectibles = null;
        this.enemies = null;
        this.player = null;
        this.levelManager = null;
        this.audioManager = null;
        this.particleSystem = null;
        this.score = 0;
        this.health = 3;
    }

    init(data) {
        window.captureGameLog('info', 'GameScene.init() 开始');
        window.captureGameLog('info', '接收的数据:', data);

        if (data && data.loadGame && data.saveData) {
            this.loadGameData = data.saveData;
            window.captureGameLog('info', '将加载存档');
        }
    }

    create() {
        window.captureGameLog('info', 'GameScene.create() 开始');
        this.cameras.main.setBackgroundColor('#87CEEB');

        this.staticPlatforms = [];
        this.collectibles = this.physics.add.group();
        this.enemies = this.physics.add.group();

        window.captureGameLog('info', '创建Player组件...');
        this.player = new Player(this, 100, 400);
        window.captureGameLog('info', 'Player创建成功');

        window.captureGameLog('info', '创建LevelManager...');
        this.levelManager = new LevelManager(this);

        window.captureGameLog('info', '创建AudioManager...');
        this.audioManager = new AudioManager(this);

        window.captureGameLog('info', '创建ParticleSystem...');
        this.particleSystem = new ParticleSystem(this);

        window.captureGameLog('info', '设置碰撞检测...');
        this.setupCollisions();

        if (this.loadGameData) {
            this.score = this.loadGameData.highScore || 0;
            this.levelManager.currentLevel = this.loadGameData.currentLevel || 1;
            window.captureGameLog('info', '加载关卡:', this.levelManager.currentLevel);
            this.levelManager.loadLevel(this.levelManager.currentLevel);
        } else {
            window.captureGameLog('info', '加载关卡1');
            this.levelManager.loadLevel(1);
        }

        window.captureGameLog('info', '注册玩家受伤事件...');
        this.events.on('player-damaged', this.takeDamage, this);

        window.captureGameLog('info', '启动UI场景...');
        this.scene.launch('UIScene');

        window.captureGameLog('info', '播放背景音乐...');
        this.audioManager.playBackgroundMusic();

        window.captureGameLog('info', 'GameScene.create() 完成！');
        window.captureGameLog('info', '======================');
    }

    completeLevel() {
        const saveData = {
            currentLevel: this.levelManager.currentLevel,
            highScore: this.score,
            unlockedLevels: this.levelManager.currentLevel
        };

        SaveManager.saveGame(saveData);
    }

    setupCollisions() {
        this.physics.add.collider(this.player, this.enemies, this.handleEnemyCollision, null, this);
        this.physics.add.overlap(this.player, this.collectibles, this.collectItem, null, this);
    }

    handleEnemyCollision(player, enemy) {
        if (player.body.blocked.down && player.body.velocity.y > 0) {
            enemy.destroy();
            this.score += 50;
            this.audioManager.playEnemyHit();
            this.particleSystem.createExplosion(enemy.x, enemy.y);
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
        this.audioManager.playCoin();
        this.particleSystem.createCollectEffect(item.x, item.y);
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
