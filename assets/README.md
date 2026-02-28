# Assets Placeholder

This directory contains placeholder assets for the game.

## Required Assets

### Player Sprite
- Path: `sprites/player.png`
- Size: 32x48 pixels
- Frames: At least 5 frames for animations (idle, run frames, jump)
- Format: PNG with transparency

### Other Assets
- `images/ground.png` - Ground/platform texture
- `images/platform.png` - Platform texture

## Note

Actual image assets need to be created manually. The game will load these from BootScene.js but will display placeholder/error if files don't exist.

To test player physics without assets, you can enable debug mode in the Phaser game config.
