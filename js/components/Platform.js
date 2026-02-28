export default class Platform extends Phaser.GameObjects.Image {
    constructor(scene, x, y, width, height, color = 0x654321) {
        // x, y 是左上角坐标，需要转换为 Phaser 的中心点坐标
        const centerX = x + width / 2;
        const centerY = y + height / 2;

        super(scene, centerX, centerY);

        scene.add.existing(this);

        this.setDisplaySize(width, height);
        this.setTint(color);
        this.setAlpha(1);

        scene.physics.add.existing(this, true);
        this.body.setSize(width, height);
    }
}
