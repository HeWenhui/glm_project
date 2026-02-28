export default class Enemy extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, type = 'walker') {
        super(scene, x, y, 'enemy');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.type = type;
        this.speed = 100;
        this.patrolDistance = 150;
        this.startX = x;
        this.direction = 1;

        this.body.setSize(30, 30);
        this.body.setCollideWorldBounds(true);

        this.createAnimations();
        this.setupAI();
    }

    createAnimations() {
        if (!this.scene.anims.exists('enemy-walk')) {
            console.log('Creating enemy animation');
            try {
                this.scene.anims.create({
                    key: 'enemy-walk',
                    frames: this.scene.anims.generateFrameNumbers('enemy', { start: 0, end: 2 }),
                    frameRate: 8,
                    repeat: -1
                });
                console.log('Enemy animation created successfully');
            } catch (e) {
                console.error('Failed to create enemy animation:', e);
            }
        }
        this.play('enemy-walk');
    }

    setupAI() {
        this.scene.events.on('update', this.updateAI, this);
    }

    updateAI() {
        this.body.setVelocityX(this.speed * this.direction);

        if (this.x > this.startX + this.patrolDistance) {
            this.direction = -1;
            this.setFlipX(true);
        } else if (this.x < this.startX - this.patrolDistance) {
            this.direction = 1;
            this.setFlipX(false);
        }
    }

    destroy() {
        this.scene.events.off('update', this.updateAI, this);
        super.destroy();
    }
}
