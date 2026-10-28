"""Generate a small synthetic 3D Gaussian splat sample for the Splat lesson."""
import math
import random
import struct
from pathlib import Path

rng = random.Random(101)
output = Path(__file__).resolve().parents[1] / 'public/models/synthetic-orbit.splat'
with output.open('wb') as file:
    for i in range(1800):
        angle = i * 2.399963229728653
        y = 1 - 2 * (i + 0.5) / 1800
        radius = math.sqrt(1 - y * y)
        x = 1.35 * radius * math.cos(angle)
        z = 1.35 * radius * math.sin(angle)
        color = (99 + int(35 * (y + 1) / 2), 102 + int(45 * (y + 1) / 2), 241, 220)
        size = 0.045 + rng.random() * 0.02
        file.write(struct.pack('<6f8B', x, y * 1.35, z, size, size, size, *color, 255, 128, 128, 128))
