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
        if (data && data.loadGame && data.saveData) {
            this.loadGameData = data.saveData;
        }
    }

    create() {
        this.cameras.main.setBackgroundColor('#87CEEB');

        this.platforms = this.physics.add.group();
        this.collectibles = this.physics.add.group();
        this.enemies = this.physics.add.group();

        this.player = new Player(this, 100, 400);
        this.levelManager = new LevelManager(this);
        this.audioManager = new AudioManager(this);
        this.particleSystem = new ParticleSystem(this);

        this.setupCollisions();

        if (this.loadGameData) {
            this.score = this.loadGameData.highScore || 0;
            this.levelManager.currentLevel = this.loadGameData.currentLevel || 1;
            this.levelManager.loadLevel(this.levelManager.currentLevel);
        } else {
            this.levelManager.loadLevel(1);
        }

        this.scene.events.on('player-damaged', this.takeDamage, this);
        this.scene.launch('UIScene');
        this.audioManager.playBackgroundMusic();
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
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.player, this.enemies, this.handleEnemyCollision, null, this);
        this.physics.add.collider(this.enemies, this.platforms);
        this.physics.add.overlap(this.player, this.collectibles, this.collectItem, null, this);
    }

    handleEnemyCollision(player, enemy) {
        if (player.body.touching.down && player.body.velocity.y > 0) {
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
