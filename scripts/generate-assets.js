#!/usr/bin/env node

/**
 * Generate placeholder game assets using canvas
 */

const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Create assets directory structure
const assetsDir = path.join(__dirname, '..', 'assets');
const imagesDir = path.join(assetsDir, 'images');
const spritesDir = path.join(assetsDir, 'sprites');

[assetsDir, imagesDir, spritesDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

console.log('Creating game assets...');

/**
 * Generate simple PNG using Canvas
 */
function generatePNG(width, height, color, filename) {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Fill with color
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);

    // Add some detail
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 2;
    ctx.strokeRect(2, 2, width - 4, height - 4);

    // Save as PNG
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(filename, buffer);
    console.log(`  ✓ ${filename}`);
}

// Generate player sprite (32x48, 5 frames for animation)
console.log('\nPlayer sprite (160x48 sprite sheet):');
const playerCanvas = createCanvas(160, 48);
const playerCtx = playerCanvas.getContext('2d');

for (let i = 0; i < 5; i++) {
    // Body color
    playerCtx.fillStyle = '#FF6B6B';
    playerCtx.fillRect(i * 32 + 8, 8, 16, 32);

    // Head
    playerCtx.fillStyle = '#FFE66D';
    playerCtx.fillRect(i * 32 + 10, 4, 12, 12);

    // Eyes
    playerCtx.fillStyle = '#4ECDC4';
    playerCtx.fillRect(i * 32 + 12, 8, 3, 3);
    playerCtx.fillRect(i * 32 + 18, 8, 3, 3);

    // Pupils
    playerCtx.fillStyle = '#000000';
    playerCtx.fillRect(i * 32 + 13, 9, 1.5, 1.5);
    playerCtx.fillRect(i * 32 + 19, 9, 1.5, 1.5);

    // Legs (animated)
    playerCtx.fillStyle = '#FFE66D';
    if (i === 1 || i === 3) {
        // Running pose
        playerCtx.fillRect(i * 32 + 8, 40, 6, 8);
        playerCtx.fillRect(i * 32 + 18, 40, 6, 8);
    } else {
        // Standing/jumping pose
        playerCtx.fillRect(i * 32 + 6, 40, 8, 8);
        playerCtx.fillRect(i * 32 + 18, 40, 8, 8);
    }
}

const playerBuffer = playerCanvas.toBuffer('image/png');
fs.writeFileSync(path.join(spritesDir, 'player.png'), playerBuffer);
console.log('  ✓ sprites/player.png');

// Generate ground (1600x40)
console.log('\nGround (1600x40):');
generatePNG(1600, 40, '#8B4513', path.join(imagesDir, 'ground.png'));

// Generate platform (200x20)
console.log('\nPlatform (200x20):');
generatePNG(200, 20, '#654321', path.join(imagesDir, 'platform.png'));

// Generate enemy sprite (32x32, 3 frames)
console.log('\nEnemy sprite (96x32 sprite sheet):');
const enemyCanvas = createCanvas(96, 32);
const enemyCtx = enemyCanvas.getContext('2d');

for (let i = 0; i < 3; i++) {
    // Body
    enemyCtx.fillStyle = '#FF4444';
    enemyCtx.fillRect(i * 32 + 4, 4, 24, 24);

    // Eyes
    enemyCtx.fillStyle = '#FFFFFF';
    enemyCtx.fillRect(i * 32 + 8, 8, 5, 5);
    enemyCtx.fillRect(i * 32 + 18, 8, 5, 5);

    // Pupils
    enemyCtx.fillStyle = '#000000';
    enemyCtx.fillRect(i * 32 + 10, 10, 2, 2);
    enemyCtx.fillRect(i * 32 + 20, 10, 2, 2);

    // Legs (animated)
    enemyCtx.fillStyle = '#AA2222';
    if (i === 1) {
        // Moving left
        enemyCtx.fillRect(i * 32 + 4, 28, 8, 4);
        enemyCtx.fillRect(i * 32 + 20, 28, 8, 4);
    } else if (i === 2) {
        // Moving right
        enemyCtx.fillRect(i * 32 + 4, 28, 8, 4);
        enemyCtx.fillRect(i * 32 + 20, 28, 8, 4);
    } else {
        // Standing
        enemyCtx.fillRect(i * 32 + 2, 28, 10, 4);
        enemyCtx.fillRect(i * 32 + 20, 28, 10, 4);
    }
}

const enemyBuffer = enemyCanvas.toBuffer('image/png');
fs.writeFileSync(path.join(spritesDir, 'enemy.png'), enemyBuffer);
console.log('  ✓ sprites/enemy.png');

// Generate coin sprite (20x20, 4 frames)
console.log('\nCoin sprite (80x20 sprite sheet):');
const coinCanvas = createCanvas(80, 20);
const coinCtx = coinCanvas.getContext('2d');
const coinColors = ['#FFD700', '#FFC125', '#FFD700', '#FFC125'];

for (let i = 0; i < 4; i++) {
    coinCtx.fillStyle = coinColors[i];
    coinCtx.beginPath();
    coinCtx.arc(i * 20 + 10, 10, 8, 0, Math.PI * 2);
    coinCtx.fill();

    coinCtx.strokeStyle = '#B8860B';
    coinCtx.lineWidth = 2;
    coinCtx.stroke();

    // Dollar sign
    coinCtx.fillStyle = '#B8860B';
    coinCtx.font = 'bold 12px Arial';
    coinCtx.textAlign = 'center';
    coinCtx.textBaseline = 'middle';
    coinCtx.fillText('$', i * 20 + 10, 10);
}

const coinBuffer = coinCanvas.toBuffer('image/png');
fs.writeFileSync(path.join(spritesDir, 'coin.png'), coinBuffer);
console.log('  ✓ sprites/coin.png');

// Generate particle effects (32x32 each)
console.log('\nParticle effects:');

// Explosion particle
const particleCanvas = createCanvas(32, 32);
const particleCtx = particleCanvas.getContext('2d');
const gradient = particleCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
gradient.addColorStop(0, 'rgba(255, 100, 100, 1)');
gradient.addColorStop(1, 'rgba(255, 100, 100, 0)');
particleCtx.fillStyle = gradient;
particleCtx.fillRect(0, 0, 32, 32);
fs.writeFileSync(path.join(spritesDir, 'particle.png'), particleCanvas.toBuffer('image/png'));
console.log('  ✓ sprites/particle.png');

// Spark particle
const sparkCanvas = createCanvas(32, 32);
const sparkCtx = sparkCanvas.getContext('2d');
const sparkGradient = sparkCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
sparkGradient.addColorStop(0, 'rgba(255, 255, 100, 1)');
sparkGradient.addColorStop(1, 'rgba(255, 255, 100, 0)');
sparkCtx.fillStyle = sparkGradient;
sparkCtx.fillRect(0, 0, 32, 32);
fs.writeFileSync(path.join(spritesDir, 'spark.png'), sparkCanvas.toBuffer('image/png'));
console.log('  ✓ sprites/spark.png');

// Dust particle
const dustCanvas = createCanvas(32, 32);
const dustCtx = dustCanvas.getContext('2d');
const dustGradient = dustCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
dustGradient.addColorStop(0, 'rgba(139, 90, 43, 0.8)');
dustGradient.addColorStop(1, 'rgba(139, 90, 43, 0)');
dustCtx.fillStyle = dustGradient;
dustCtx.fillRect(0, 0, 32, 32);
fs.writeFileSync(path.join(spritesDir, 'dust.png'), dustCanvas.toBuffer('image/png'));
console.log('  ✓ sprites/dust.png');

console.log('\n✓ All assets generated successfully!\n');
console.log('Assets created:');
console.log('  assets/images/ground.png (1600x40)');
console.log('  assets/images/platform.png (200x20)');
console.log('  assets/sprites/player.png (160x48 sprite sheet, 5 frames)');
console.log('  assets/sprites/enemy.png (96x32 sprite sheet, 3 frames)');
console.log('  assets/sprites/coin.png (80x20 sprite sheet, 4 frames)');
console.log('  assets/sprites/particle.png (32x32)');
console.log('  assets/sprites/spark.png (32x32)');
console.log('  assets/sprites/dust.png (32x32)');
console.log('\nYou can now run the game with: npm run dev');
