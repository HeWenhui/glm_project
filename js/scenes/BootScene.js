export default class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // 预加载游戏资源
        console.log('Loading game assets...');

        // 错误处理
        this.load.on('loaderror', (file) => {
            console.error('Failed to load:', file.key, file.url);
        });

        this.load.on('complete', () => {
            console.log('All assets loaded successfully!');
        });

        // 加载图片资源
        this.load.image('ground', 'assets/images/ground.png');
        this.load.image('platform', 'assets/images/platform.png');

        // 加载精灵表
        this.load.spritesheet('player', 'assets/sprites/player.png', {
            frameWidth: 32,
            frameHeight: 48
        });

        this.load.spritesheet('enemy', 'assets/sprites/enemy.png', {
            frameWidth: 32,
            frameHeight: 32
        });

        this.load.spritesheet('coin', 'assets/sprites/coin.png', {
            frameWidth: 20,
            frameHeight: 20
        });

        // 加载粒子资源
        this.load.image('particle', 'assets/sprites/particle.png');
        this.load.image('spark', 'assets/sprites/spark.png');
        this.load.image('dust', 'assets/sprites/dust.png');
    }

    create() {
        this.scene.start('MenuScene');
    }
}
