export default class Platform extends Phaser.GameObjects.Rectangle {
    constructor(scene, x, y, width, height, color = 0x654321) {
        super(scene, x, y, width, height, color);
        scene.add.existing(this);
        scene.physics.add.existing(this, true);

        this.body.setImmovable(true);
        this.body.allowGravity = false;
    }
}
