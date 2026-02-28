export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        this.cameras.main.setBackgroundColor('#87CEEB');
        this.add.text(10, 10, '游戏场景 - 待实现', {
            fontSize: '20px',
            color: '#ffffff'
        });
    }

    update() {
        // 更新逻辑
    }
}
