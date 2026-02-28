export default class Collectible extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, type = 'coin') {
        super(scene, x, y, 'coin');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setImmovable(true);
        this.body.allowGravity = false;
        this.body.setSize(20, 20);

        this.type = type;
        this.value = this.getTypeValue();

        this.createAnimations();
    }

    getTypeValue() {
        switch(this.type) {
            case 'coin': return 10;
            case 'gem': return 50;
            case 'heart': return 1;
            default: return 10;
        }
    }

    createAnimations() {
        if (!this.scene.anims.exists('coin-spin')) {
            this.scene.anims.create({
                key: 'coin-spin',
                frames: this.scene.anims.generateFrameNumbers('coin', { start: 0, end: 3 }),
                frameRate: 8,
                repeat: -1
            });
        }
        this.play('coin-spin');
    }

    collect() {
        this.destroy();
        return { type: this.type, value: this.value };
    }
}
