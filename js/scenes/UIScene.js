export default class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: 'UIScene' });
    }

    create() {
        this.createHUD();
        this.createPauseButton();
    }

    createHUD() {
        this.add.rectangle(0, 0, this.scale.width, 80, 0x000000, 0.5)
            .setOrigin(0);

        this.scoreText = this.add.text(16, 16, '分数: 0', {
            fontSize: '24px',
            color: '#ffffff',
            fontStyle: 'bold'
        });

        this.healthText = this.add.text(16, 48, '生命: 3', {
            fontSize: '24px',
            color: '#ff0000',
            fontStyle: 'bold'
        });

        this.levelText = this.add.text(this.scale.width - 120, 16, '关卡: 1', {
            fontSize: '24px',
            color: '#ffffff',
            fontStyle: 'bold'
        });
    }

    createPauseButton() {
        const pauseButton = this.add.text(this.scale.width - 120, 48, '暂停', {
            fontSize: '20px',
            color: '#ffffff',
            backgroundColor: '#333333',
            padding: { x: 10, y: 5 }
        }).setOrigin(0).setInteractive();

        pauseButton.on('pointerdown', () => {
            this.scene.pause('GameScene');
            this.scene.launch('PauseScene');
        });
    }

    updateScore(score) {
        if (this.scoreText) {
            this.scoreText.setText(`分数: ${score}`);
        }
    }

    updateHealth(health) {
        if (this.healthText) {
            this.healthText.setText(`生命: ${health}`);
        }
    }

    updateLevel(level) {
        if (this.levelText) {
            this.levelText.setText(`关卡: ${level}`);
        }
    }
}
