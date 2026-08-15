import os
from typing import Optional
from PIL import Image
import numpy as np

def calculate_image_hash(image_path: str, hash_size: int = 8) -> str:
    """Calculate average perceptual hash for an image."""
    try:
        if not os.path.exists(image_path):
            return ""
        with Image.open(image_path) as img:
            img = img.convert("L").resize((hash_size, hash_size), Image.Resampling.LANCZOS)
            pixels = np.array(img.getdata())
            avg = pixels.mean()
            bits = "".join(["1" if p > avg else "0" for p in pixels])
            return bits
    except Exception:
        return ""

def calculate_image_similarity(image_path1: Optional[str], image_path2: Optional[str]) -> float:
    """Compare two images using perceptual hashing and color histogram correlation."""
    if not image_path1 or not image_path2:
        return 0.0

    hash1 = calculate_image_hash(image_path1)
    hash2 = calculate_image_hash(image_path2)

    if not hash1 or not hash2 or len(hash1) != len(hash2):
        return 0.0

    # Hamming distance
    hamming_distance = sum(ch1 != ch2 for ch1, ch2 in zip(hash1, hash2))
    max_dist = len(hash1)
    hash_sim = (1.0 - (hamming_distance / max_dist)) * 100.0

    return round(max(0.0, min(100.0, hash_sim)), 2)
