import Player from '../components/Player.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        this.cameras.main.setBackgroundColor('#87CEEB');

        this.player = new Player(this, 100, 400);

        this.createGround();
        this.physics.add.collider(this.player, this.ground);

        this.scene.launch('UIScene');
    }

    createGround() {
        this.ground = this.add.rectangle(400, 580, 1600, 40, 0x8B4513);
        this.physics.add.existing(this.ground, true);
    }

    update() {
        this.player.update();
    }
}
