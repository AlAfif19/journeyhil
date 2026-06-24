from __future__ import annotations

from collections import deque
from pathlib import Path
import sys

from PIL import Image


def is_background(pixel: tuple[int, int, int, int]) -> bool:
    red, green, blue, alpha = pixel
    if alpha < 20:
        return True
    if red >= 248 and green >= 248 and blue >= 248:
        return True
    return abs(red - green) <= 3 and abs(red - blue) <= 3 and 232 <= red <= 247


def transparent_edges(source: Path, dest: Path) -> None:
    image = Image.open(source).convert("RGBA")
    pixels = image.load()
    width, height = image.size
    visited: set[tuple[int, int]] = set()
    queue: deque[tuple[int, int]] = deque()

    for x in range(width):
        queue.append((x, 0))
        queue.append((x, height - 1))
    for y in range(height):
        queue.append((0, y))
        queue.append((width - 1, y))

    while queue:
        x, y = queue.popleft()
        if (x, y) in visited or x < 0 or y < 0 or x >= width or y >= height:
            continue
        visited.add((x, y))

        if not is_background(pixels[x, y]):
            continue

        red, green, blue, _alpha = pixels[x, y]
        pixels[x, y] = (red, green, blue, 0)

        queue.append((x + 1, y))
        queue.append((x - 1, y))
        queue.append((x, y + 1))
        queue.append((x, y - 1))

    dest.parent.mkdir(parents=True, exist_ok=True)
    image.save(dest)


def main() -> int:
    if len(sys.argv) != 3:
        print("Usage: process-transparent-assets.py <source> <dest>", file=sys.stderr)
        return 2

    transparent_edges(Path(sys.argv[1]), Path(sys.argv[2]))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
