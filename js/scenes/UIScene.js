export default class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: 'UIScene' });
    }

    create() {
        // HUD显示
        this.scoreText = this.add.text(16, 16, '分数: 0', {
            fontSize: '20px',
            color: '#ffffff'
        });

        this.healthText = this.add.text(16, 48, '生命: 3', {
            fontSize: '20px',
            color: '#ffffff'
        });
    }
}
