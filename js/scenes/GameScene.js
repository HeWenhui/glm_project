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

        const uiScene = this.scene.get('UIScene');
        if (uiScene && uiScene.scoreText) {
            uiScene.scoreText.setText(`分数: ${this.score}`);
        }
    }

    update() {
        this.player.update();
    }
}
