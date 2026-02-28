import SaveManager from '../managers/SaveManager.js';

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        const { width, height } = this.scale;

        this.add.text(width / 2, height / 4, '平台跳跃游戏', {
            fontSize: '48px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const startButton = this.add.text(width / 2, height / 2, '新游戏', {
            fontSize: '24px',
            color: '#00ff00',
            backgroundColor: '#333333',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive();

        startButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });

        if (SaveManager.hasSave()) {
            const continueButton = this.add.text(width / 2, height / 2 + 60, '继续游戏', {
                fontSize: '24px',
                color: '#ffff00',
                backgroundColor: '#333333',
                padding: { x: 20, y: 10 }
            }).setOrigin(0.5).setInteractive();

            continueButton.on('pointerdown', () => {
                const saveData = SaveManager.loadGame();
                this.scene.start('GameScene', { loadGame: true, saveData });
            });
        }
    }
}
