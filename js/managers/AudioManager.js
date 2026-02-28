export default class AudioManager {
    constructor(scene) {
        this.scene = scene;
        this.soundEnabled = true;
        this.musicEnabled = true;

        this.initAudio();
    }

    initAudio() {
        console.log('Audio system initialized');
    }

    playJump() {
        if (this.soundEnabled) {
            console.log('Jump sound');
        }
    }

    playCoin() {
        if (this.soundEnabled) {
            console.log('Coin sound');
        }
    }

    playEnemyHit() {
        if (this.soundEnabled) {
            console.log('Enemy hit sound');
        }
    }

    playBackgroundMusic() {
        if (this.musicEnabled) {
            console.log('Background music started');
        }
    }

    stopBackgroundMusic() {
        if (this.bgMusic) {
            this.bgMusic.stop();
        }
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        return this.soundEnabled;
    }

    toggleMusic() {
        this.musicEnabled = !this.musicEnabled;
        if (this.musicEnabled) {
            this.playBackgroundMusic();
        } else {
            this.stopBackgroundMusic();
        }
        return this.musicEnabled;
    }
}
