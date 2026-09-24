from pathlib import Path
import os
import sys

import numpy as np
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
LOCAL_PACKAGES = Path.home() / "AppData" / "Local" / "Temp" / "codex-opencv-personal-portfolio"
sys.path.insert(0, str(LOCAL_PACKAGES))
os.environ.setdefault("U2NET_HOME", str(LOCAL_PACKAGES / "models"))

from rembg import new_session, remove


JOBS = [
    (
        ROOT / "assets" / "generated" / "hero-person-v3.png",
        ROOT / "assets" / "generated" / "hero-person-v3-clean.png",
        ROOT / "qa" / "current" / "hero-person-v3-clean-preview.png",
    ),
    (
        ROOT / "assets" / "generated" / "about-avatar-v3.png",
        ROOT / "assets" / "generated" / "about-avatar-v3-clean.png",
        ROOT / "qa" / "current" / "about-avatar-v3-clean-preview.png",
    ),
]


def clean(source_path, output_path, preview_path, session):
    source = Image.open(source_path).convert("RGB")
    mask_image = remove(
        source,
        session=session,
        only_mask=True,
        post_process_mask=True,
    ).convert("L")

    mask = np.asarray(mask_image, dtype=np.uint8).copy()
    mask[mask < 4] = 0
    mask[mask > 251] = 255

    cleaned = source.convert("RGBA")
    cleaned.putalpha(Image.fromarray(mask, mode="L"))
    cleaned.save(output_path, optimize=True)

    preview_width = source.width * 2
    preview = Image.new("RGBA", (preview_width, source.height), "#f4f0e8")
    preview.alpha_composite(cleaned, (0, 0))
    dark_panel = Image.new("RGBA", source.size, "#06183b")
    dark_panel.alpha_composite(cleaned, (0, 0))
    preview.alpha_composite(dark_panel, (source.width, 0))
    preview_path.parent.mkdir(parents=True, exist_ok=True)
    preview.convert("RGB").save(preview_path, quality=92)

    transparent = int((mask == 0).sum())
    opaque = int((mask == 255).sum())
    print(f"{output_path.name}: {source.width}x{source.height}, transparent={transparent}, opaque={opaque}")


def main():
    session = new_session("u2net_human_seg")
    for source_path, output_path, preview_path in JOBS:
        clean(source_path, output_path, preview_path, session)


if __name__ == "__main__":
    main()
