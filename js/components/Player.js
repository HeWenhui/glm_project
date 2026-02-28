export default class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'player');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setCollideWorldBounds(true);
        this.body.setGravityY(1000);
        this.body.setSize(30, 48);

        this.cursors = scene.input.keyboard.createCursorKeys();
        this.jumpKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.jumping = false;
        this.canDoubleJump = false;
        this.isDead = false;

        this.speed = 300;
        this.jumpForce = -500;

        this.createAnimations();
    }

    createAnimations() {
        this.scene.anims.create({
            key: 'idle',
            frames: [{ key: 'player', frame: 0 }],
            frameRate: 1,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'run',
            frames: this.scene.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'jump',
            frames: [{ key: 'player', frame: 4 }],
            frameRate: 1,
            repeat: -1
        });

        this.play('idle');
    }

    update() {
        if (this.isDead) return;

        if (this.cursors.left.isDown) {
            this.body.setVelocityX(-this.speed);
            this.setFlipX(true);
            if (this.body.touching.down) {
                this.play('run', true);
            }
        } else if (this.cursors.right.isDown) {
            this.body.setVelocityX(this.speed);
            this.setFlipX(false);
            if (this.body.touching.down) {
                this.play('run', true);
            }
        } else {
            this.body.setVelocityX(0);
            if (this.body.touching.down) {
                this.play('idle', true);
            }
        }

        if (Phaser.Input.Keyboard.JustDown(this.jumpKey)) {
            if (this.body.touching.down) {
                this.scene.particleSystem?.createJumpDust(this.x, this.y + 24);
                this.body.setVelocityY(this.jumpForce);
                this.jumping = true;
                this.canDoubleJump = true;
                this.play('jump', true);
                this.scene.audioManager?.playJump();
            } else if (this.canDoubleJump) {
                this.body.setVelocityY(this.jumpForce * 0.8);
                this.canDoubleJump = false;
            }
        }

        if (this.body.touching.down) {
            this.jumping = false;
        }
    }

    takeDamage(amount) {
        this.scene.tweens.add({
            targets: this,
            alpha: 0.5,
            duration: 100,
            yoyo: true,
            repeat: 3
        });

        this.scene.events.emit('player-damaged', amount);
    }

    die() {
        this.isDead = true;
        this.body.stop();
        this.play('die', true);

        this.scene.time.delayedCall(2000, () => {
            this.scene.scene.restart();
        });
    }
}
