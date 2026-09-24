from pathlib import Path
import os
import sys

import numpy as np
from PIL import Image, ImageFilter


CV2_SITE = Path.home() / "AppData" / "Local" / "Temp" / "codex-opencv-personal-portfolio"
if CV2_SITE.exists():
    sys.path.insert(0, str(CV2_SITE))
os.environ.setdefault("U2NET_HOME", str(CV2_SITE / "models"))

try:
    import cv2
except ImportError:
    cv2 = None

try:
    from rembg import new_session, remove
except ImportError:
    new_session = None
    remove = None


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets" / "source" / "profile-home-master.jpg"
OUTPUT = ROOT / "assets" / "source" / "profile-original-cutout.png"
PREVIEW = ROOT / "qa" / "current" / "profile-original-cutout-preview.png"


# The source portrait is a single continuous silhouette. These hand-checked
# guide points follow its outside edge; local image gradients then snap the
# guide to the photographed edge without inventing or repainting any pixels.
LEFT_GUIDE = [
    (210, 427), (214, 401), (220, 376), (238, 356), (260, 347),
    (282, 348), (302, 346), (320, 349), (338, 338), (352, 331),
    (368, 313), (390, 298), (430, 284), (500, 272), (580, 258),
    (650, 252), (690, 256), (718, 270), (735, 296), (746, 319),
    (760, 329), (785, 335), (820, 337), (880, 329), (952, 320),
]

RIGHT_GUIDE = [
    (210, 433), (214, 467), (220, 490), (238, 505), (260, 515),
    (282, 519), (302, 516), (320, 519), (338, 516), (352, 526),
    (368, 548), (390, 570), (430, 584), (500, 595), (580, 606),
    (650, 616), (690, 618), (718, 609), (735, 590), (746, 570),
    (760, 560), (785, 554), (820, 550), (880, 553), (952, 560),
]


def interpolate_guide(points, height):
    ys = np.array([point[0] for point in points], dtype=np.float32)
    xs = np.array([point[1] for point in points], dtype=np.float32)
    return np.interp(np.arange(height), ys, xs)


def smooth(values, radius=3):
    padded = np.pad(values, radius, mode="edge")
    return np.array([
        np.median(padded[index:index + radius * 2 + 1])
        for index in range(len(values))
    ])


def snap_edge(gradient, guide, first_y, last_y, side):
    result = guide.copy()
    previous = guide[first_y]
    for y in range(first_y, last_y + 1):
        expected = guide[y]
        search_radius = 7 if y < 370 else 6
        start = max(2, int(round(expected - search_radius)))
        end = min(gradient.shape[1] - 3, int(round(expected + search_radius)))
        candidates = np.arange(start, end + 1)
        edge_strength = gradient[y, candidates]
        guide_cost = np.abs(candidates - expected) * 4.4
        continuity_cost = np.abs(candidates - previous) * 0.45
        score = edge_strength - guide_cost - continuity_cost
        chosen = float(candidates[int(np.argmax(score))])
        if side == "left":
            chosen += 0.35
        else:
            chosen -= 0.35
        result[y] = chosen
        previous = chosen
    result[first_y:last_y + 1] = smooth(result[first_y:last_y + 1], radius=3)
    return result


def main():
    portrait = Image.open(SOURCE).convert("RGB")
    pixels = np.asarray(portrait, dtype=np.float32)
    height, width = pixels.shape[:2]

    # Horizontal colour contrast is strongest at the person's outside edge.
    gradient = np.zeros((height, width), dtype=np.float32)
    gradient[:, 2:-2] = np.linalg.norm(pixels[:, 4:] - pixels[:, :-4], axis=2)

    first_y = LEFT_GUIDE[0][0]
    last_y = min(height - 1, LEFT_GUIDE[-1][0])
    left_guide = interpolate_guide(LEFT_GUIDE, height)
    right_guide = interpolate_guide(RIGHT_GUIDE, height)
    left_guide[first_y:last_y + 1] += np.where(
        np.arange(first_y, last_y + 1) < 350, 2.0, 4.0
    )
    right_guide[first_y:last_y + 1] -= 5.0
    left = snap_edge(gradient, left_guide, first_y, last_y, "left")
    right = snap_edge(gradient, right_guide, first_y, last_y, "right")

    silhouette = np.zeros((height, width), dtype=np.uint8)
    for y in range(first_y, last_y + 1):
        x0 = max(0, int(round(left[y])))
        x1 = min(width - 1, int(round(right[y])))
        if x1 >= x0:
            silhouette[y, x0:x1 + 1] = 255

    if remove is not None and new_session is not None:
        extracted_mask = remove(
            portrait,
            session=new_session("u2net_human_seg"),
            only_mask=True,
            post_process_mask=True,
        )
        mask = np.asarray(extracted_mask.convert("L"), dtype=np.uint8).copy()
    elif cv2 is not None:
        # GrabCut separates the background visible inside the coarse outline
        # (notably beside the arms and hair) while keeping the original pixels.
        grab_mask = np.full((height, width), cv2.GC_BGD, dtype=np.uint8)
        grab_mask[silhouette > 0] = cv2.GC_PR_FGD

        sure_foreground = np.zeros((height, width), dtype=np.uint8)
        cv2.ellipse(sure_foreground, (433, 292), (42, 61), 0, 0, 360, 255, -1)
        cv2.ellipse(sure_foreground, (431, 267), (58, 44), 0, 0, 360, 255, -1)
        cv2.fillPoly(sure_foreground, [np.array([
            (345, 382), (508, 382), (535, 474), (522, 650),
            (473, 687), (370, 680), (326, 635), (320, 474),
        ], dtype=np.int32)], 255)
        cv2.fillPoly(sure_foreground, [np.array([
            (296, 418), (324, 410), (316, 662), (290, 711), (266, 684), (270, 548),
        ], dtype=np.int32)], 255)
        cv2.fillPoly(sure_foreground, [np.array([
            (542, 412), (571, 425), (601, 671), (579, 716), (552, 683), (535, 533),
        ], dtype=np.int32)], 255)
        cv2.fillPoly(sure_foreground, [np.array([
            (344, 687), (520, 687), (542, 952), (330, 952),
        ], dtype=np.int32)], 255)
        cv2.ellipse(sure_foreground, (340, 735), (13, 36), -18, 0, 360, 255, -1)
        cv2.ellipse(sure_foreground, (558, 742), (13, 34), 18, 0, 360, 255, -1)
        grab_mask[sure_foreground > 0] = cv2.GC_FGD

        background_model = np.zeros((1, 65), np.float64)
        foreground_model = np.zeros((1, 65), np.float64)
        bgr = cv2.cvtColor(np.asarray(portrait), cv2.COLOR_RGB2BGR)
        cv2.grabCut(
            bgr,
            grab_mask,
            None,
            background_model,
            foreground_model,
            8,
            cv2.GC_INIT_WITH_MASK,
        )
        mask = np.where(
            (grab_mask == cv2.GC_FGD) | (grab_mask == cv2.GC_PR_FGD),
            255,
            0,
        ).astype(np.uint8)

        # Keep the connected component containing the subject's torso.
        count, labels, stats, _ = cv2.connectedComponentsWithStats(mask, 8)
        subject_label = labels[510, 430]
        if subject_label > 0 and subject_label < count:
            mask = np.where(labels == subject_label, 255, 0).astype(np.uint8)
        cv2.fillPoly(mask, [np.array([
            (428, 842), (445, 842), (455, 952), (418, 952),
        ], dtype=np.int32)], 0)
        mask = cv2.erode(mask, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3)), iterations=1)
    else:
        mask = silhouette

    # Pull the mask one pixel inward and softly feather only the photographed edge.
    alpha = Image.fromarray(mask, mode="L").filter(ImageFilter.MinFilter(3))
    alpha = alpha.filter(ImageFilter.GaussianBlur(1.15))
    alpha_values = np.asarray(alpha).copy()
    alpha_values[alpha_values < 6] = 0
    alpha_values[alpha_values > 249] = 255
    alpha = Image.fromarray(alpha_values, mode="L")

    cutout = portrait.convert("RGBA")
    cutout.putalpha(alpha)
    bounds = alpha.getbbox()
    if bounds:
        padding = 14
        bounds = (
            max(0, bounds[0] - padding),
            max(0, bounds[1] - padding),
            min(width, bounds[2] + padding),
            min(height, bounds[3] + padding),
        )
        cutout = cutout.crop(bounds)
    cutout.save(OUTPUT, optimize=True)

    preview = Image.new("RGBA", (cutout.width * 2, cutout.height), "#f4f0e8")
    preview.alpha_composite(cutout, (0, 0))
    navy_panel = Image.new("RGBA", cutout.size, "#06183b")
    navy_panel.alpha_composite(cutout, (0, 0))
    preview.alpha_composite(navy_panel, (cutout.width, 0))
    PREVIEW.parent.mkdir(parents=True, exist_ok=True)
    preview.convert("RGB").save(PREVIEW, quality=92)
    print(f"Wrote {OUTPUT} ({cutout.width}x{cutout.height})")


if __name__ == "__main__":
    main()
