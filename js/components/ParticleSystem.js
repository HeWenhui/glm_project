export default class ParticleSystem {
    constructor(scene) {
        this.scene = scene;
    }

    createExplosion(x, y, color = 0xff0000) {
        const particles = this.scene.add.particles(x, y, 'particle', {
            speed: { min: 100, max: 300 },
            angle: { min: 0, max: 360 },
            scale: { start: 1, end: 0 },
            lifespan: 1000,
            blendMode: 'ADD',
            tint: color
        });

        this.scene.time.delayedCall(1000, () => {
            particles.destroy();
        });
    }

    createCollectEffect(x, y) {
        const particles = this.scene.add.particles(x, y, 'spark', {
            speed: { min: 50, max: 150 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.5, end: 0 },
            lifespan: 500,
            blendMode: 'ADD'
        });

        this.scene.time.delayedCall(500, () => {
            particles.destroy();
        });
    }

    createJumpDust(x, y) {
        const particles = this.scene.add.particles(x, y, 'dust', {
            speed: { min: 20, max: 50 },
            angle: { min: 0, max: 180 },
            scale: { start: 0.8, end: 0 },
            lifespan: 400,
            alpha: { start: 0.6, end: 0 }
        });

        this.scene.time.delayedCall(400, () => {
            particles.destroy();
        });
    }
}
