export default class LevelCompleteScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LevelCompleteScene' });
    }

    init(data) {
        this.level = data.level;
        this.score = data.score;
    }

    create() {
        const { width, height } = this.scale;

        this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.8);

        this.add.text(width / 2, height / 3, `关卡 ${this.level} 完成!`, {
            fontSize: '48px',
            color: '#00ff00',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(width / 2, height / 2, `分数: ${this.score}`, {
            fontSize: '32px',
            color: '#ffffff'
        }).setOrigin(0.5);

        const nextButton = this.add.text(width / 2, height * 0.7, '下一关', {
            fontSize: '24px',
            color: '#00ff00',
            backgroundColor: '#333333',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive();

        nextButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
    }
}
