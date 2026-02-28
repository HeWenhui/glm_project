export default class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // 预加载游戏资源（占位符，稍后创建实际资源）
        console.log('Loading placeholder assets - actual assets to be created in future tasks');
        this.load.on('loaderror', (file) => console.error('Failed to load:', file.key));

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
