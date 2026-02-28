#!/usr/bin/env python3

"""
Generate minimal PNG images for game assets
"""

import struct
import zlib
import os

# Create assets directory
assets_dir = os.path.join(os.path.dirname(__file__), '..', 'assets')
images_dir = os.path.join(assets_dir, 'images')
sprites_dir = os.path.join(assets_dir, 'sprites')

for d in [assets_dir, images_dir, sprites_dir]:
    os.makedirs(d, exist_ok=True)

def create_png(filename, width, height, r, g, b, a=255):
    """Create a minimal PNG file with solid color"""
    # PNG signature
    png_signature = b'\x89PNG\r\n\x1a\n'

    # IHDR chunk
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 2, 0, 0, 0)
    ihdr_chunk = create_chunk(b'IHDR', ihdr_data)

    # Create image data (solid color)
    scanline_width = (width * 3 + 1)
    scanlines = b''
    for _ in range(height):
        scanlines += struct.pack('B', 0)  # Filter type 0 (None)
        scanlines += bytes([r, g, b] * width)

    # Compress with DEFLATE
    idat_data = zlib.compress(scanlines)
    idat_chunk = create_chunk(b'IDAT', idat_data)

    # IEND chunk
    iend_chunk = create_chunk(b'IEND', b'')

    # Write PNG file
    with open(filename, 'wb') as f:
        f.write(png_signature)
        f.write(ihdr_chunk)
        f.write(idat_chunk)
        f.write(iend_chunk)

def create_chunk(chunk_type, data):
    """Create a PNG chunk"""
    length = struct.pack('>I', len(data))
    crc = zlib.crc32(chunk_type + data) & 0xffffffff
    return length + chunk_type + data + struct.pack('>I', crc)

print('Creating game assets...')

# Generate ground (1600x40, brown)
print('\nGround:')
create_png(os.path.join(images_dir, 'ground.png'), 1600, 40, 139, 69, 19)
print(f'  ✓ {os.path.join("assets/images", "ground.png")}')

# Generate platform (200x20, dark brown)
print('\nPlatform:')
create_png(os.path.join(images_dir, 'platform.png'), 200, 20, 101, 67, 33)
print(f'  ✓ {os.path.join("assets/images", "platform.png")}')

# Generate player sprite (160x48, coral color, for 5 frames of 32x48)
print('\nPlayer sprite sheet (160x48):')
create_png(os.path.join(sprites_dir, 'player.png'), 160, 48, 255, 107, 107)
print(f'  ✓ {os.path.join("assets/sprites", "player.png")}')

# Generate enemy sprite (96x32, red)
print('\nEnemy sprite sheet (96x32):')
create_png(os.path.join(sprites_dir, 'enemy.png'), 96, 32, 255, 68, 68)
print(f'  ✓ {os.path.join("assets/sprites", "enemy.png")}')

# Generate coin sprite (80x20, gold)
print('\nCoin sprite sheet (80x20):')
create_png(os.path.join(sprites_dir, 'coin.png'), 80, 20, 255, 215, 0)
print(f'  ✓ {os.path.join("assets/sprites", "coin.png")}')

# Generate particle effects (32x32 each)
print('\nParticle effects:')

# Explosion particle (light red)
create_png(os.path.join(sprites_dir, 'particle.png'), 32, 32, 255, 150, 150)
print(f'  ✓ {os.path.join("assets/sprites", "particle.png")}')

# Spark particle (yellow)
create_png(os.path.join(sprites_dir, 'spark.png'), 32, 32, 255, 255, 100)
print(f'  ✓ {os.path.join("assets/sprites", "spark.png")}')

# Dust particle (brown)
create_png(os.path.join(sprites_dir, 'dust.png'), 32, 32, 139, 90, 43)
print(f'  ✓ {os.path.join("assets/sprites", "dust.png")}')

print('\n✓ All assets generated successfully!\n')
print('Assets created:')
print('  assets/images/ground.png (1600x40, brown)')
print('  assets/images/platform.png (200x20, dark brown)')
print('  assets/sprites/player.png (160x48, coral, sprite sheet)')
print('  assets/sprites/enemy.png (96x32, red, sprite sheet)')
print('  assets/sprites/coin.png (80x20, gold, sprite sheet)')
print('  assets/sprites/particle.png (32x32, light red)')
print('  assets/sprites/spark.png (32x32, yellow)')
print('  assets/sprites/dust.png (32x32, brown)')
print('\nYou can now run the game with: npm run dev')
