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

        this.physics.add.collider(this.player, this.platforms);

        this.scene.launch('UIScene');
    }

    createLevel() {
        new Platform(this, 400, 580, 1600, 40);

        this.platforms.add(new Platform(this, 300, 450, 200, 20));
        this.platforms.add(new Platform(this, 600, 350, 200, 20));
        this.platforms.add(new Platform(this, 200, 250, 150, 20));
        this.platforms.add(new Platform(this, 500, 150, 200, 20));
    }

    update() {
        this.player.update();
    }
}
