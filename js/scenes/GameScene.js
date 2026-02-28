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
            enemy.destroy();
            this.score += 50;

            const uiScene = this.scene.get('UIScene');
            if (uiScene && uiScene.scoreText) {
                uiScene.scoreText.setText(`分数: ${this.score}`);
            }
        } else {
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
