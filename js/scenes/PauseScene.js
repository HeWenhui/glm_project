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
