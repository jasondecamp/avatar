"""Measured body-outline centerlines for the shared blank body (base/body.png), plus path helpers.

Every character body uses the same silhouette (the werewolf adds fur tufts outside it at the shoulders).
Points are the centers of the body's ~10-12px black outline in 800x800 canvas coordinates,
measured with `measure.mjs rows|cols`. Stroke a garment edge 12px wide on these points and it covers
the body outline exactly. Viewer's left is L.

Import from a scratch generator:
    import sys; sys.path.insert(0, '.claude/skills/outfit-part/scripts')
    from body_outline import *
"""

# Neck opening, right neck point to left neck point (hidden under the head, which reaches y≈504)
NECK = [(481, 458), (455, 470), (420, 479), (388, 483), (355, 479), (325, 470), (300, 461)]

# Shoulder line from the neck point outward
L_SHOULDER = [(287, 468), (274, 474), (263.5, 480), (253, 486)]
R_SHOULDER = [(522, 480), (511.5, 474), (499.5, 468), (488, 462)]  # ordered outward → neck

# Outer arm edge, shoulder → down to sleeve-hem height (y≈547)
L_ARM = [(243.5, 492), (234.5, 498), (226, 504), (218.5, 510), (210.5, 516), (203.5, 522), (197, 528), (191, 534), (185.5, 540), (180, 547)]
R_ARM = [(604, 553), (599.5, 546), (595.5, 540), (590, 534), (585, 528), (579.5, 522), (573, 516), (566, 510), (558.5, 504), (550, 498), (541, 492), (531.5, 486)]  # ordered up

# Outer arm edge continued around the hand (approximate; re-measure before long sleeves or gloves)
L_HAND = [(175.5, 552), (168, 564), (162, 576), (158, 588), (156.5, 600), (158.5, 612), (165, 624), (179.5, 636), (200, 645), (222, 642), (232.5, 630), (239, 612)]
R_HAND = [(607, 558), (612, 570), (615.5, 582), (616.5, 594), (614.5, 606), (609.5, 618), (598, 630), (585, 638), (562, 645), (548.5, 636), (540, 624), (528, 606)]

# Torso side line, armpit → bottom of the leg. Above y≈600 it is also the arm/torso crease
# (a tapering wedge that starts at (288,528) on the left and (491,522) on the right).
L_TORSO = [(271, 566), (265.5, 576), (259.5, 588), (254, 600), (252.5, 612), (248.5, 624), (245, 636), (241.5, 648), (237.5, 660), (233.5, 672), (229.5, 684), (226.5, 696), (222.5, 708), (218.5, 720), (217.5, 726)]
R_TORSO = [(554.5, 726), (553.5, 720), (550.5, 708), (548.5, 696), (545.5, 684), (542.5, 672), (539.5, 660), (536.5, 648), (532.5, 636), (529.5, 624), (527.5, 612), (524, 600), (517.5, 588), (513, 576), (509, 566)]  # ordered up

# Leg bottoms and crotch, left outer corner → right outer corner. The bottom dips to y≈744.5 mid-leg.
LEGS = [(224, 734.5), (232, 738.5), (244, 741.5), (264, 744.5), (296, 744.5), (320, 742.5), (336, 739.5), (352, 734.5), (361, 729), (366, 720), (367.5, 708), (368, 697), (374, 690), (388, 687.5), (401, 690), (406, 698), (408, 710), (410, 724), (416, 733.5), (432, 739.5), (456, 742), (480, 743.5), (512, 743.5), (528, 741.5), (544, 737.5), (551.5, 732)]

# Bottom of the head outline (centerline), jaw to jaw. Every head shares it, including the werewolf.
# Anything an outfit draws above this line is hidden by the head on the stage but shows on the
# outfit picker's dummy, so clip outfits to BELOW_HEAD.
HEAD_CHIN = [(260, 436.5), (275, 448), (290, 462), (305, 474), (320, 483), (335, 489.5), (350, 494.5), (365, 497.5), (380, 499), (395, 499), (410, 497.5), (425, 495.5), (440, 491.5), (455, 485.5), (470, 477.5), (485, 467.5), (500, 455), (515, 439), (530, 436.5)]
BELOW_HEAD = 'M -10 430 L ' + ' L '.join(f'{x:g} {y:g}' for x, y in HEAD_CHIN) + ' L 810 430 V 810 H -10 Z'

# Gi-style short sleeve hems: mirrored bell curves from the sleeve tip to the armpit line
L_HEM = [(176, 552), (198, 543), (234, 546), (271, 566)]
R_HEM = [(509, 566), (546, 546), (582, 543), (608, 557)]

# Full short-sleeve garment silhouette (shirt + pants), clockwise from the left shoulder
SHORT_SLEEVE_SUIT = L_SHOULDER + L_ARM + L_HEM + L_TORSO[1:] + LEGS + R_TORSO + R_HEM[1:] + R_ARM + R_SHOULDER + NECK


def torso_x(side, y):
    """x of the torso side line at height y (linear between measured points). side: 'L' or 'R'."""
    pts = sorted(L_TORSO if side == 'L' else R_TORSO, key=lambda p: p[1])
    for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
        if y0 <= y <= y1:
            return x0 + (x1 - x0) * (y - y0) / (y1 - y0)
    raise ValueError(f'y={y} is outside the torso line ({pts[0][1]}–{pts[-1][1]})')


def smooth(pts, closed=False):
    """Catmull-Rom spline through every point, as an SVG path ('M … C …').

    Overshoots at sharp corners: split the chain there and join with straight 'L' segments
    (or hide the corner under another element), or the curve bulges past the body outline.
    """
    n = len(pts)
    d = f'M {pts[0][0]:.1f} {pts[0][1]:.1f}'
    for i in range(n if closed else n - 1):
        p0 = pts[(i - 1) % n] if (closed or i > 0) else pts[i]
        p1, p2 = pts[i], pts[(i + 1) % n]
        p3 = pts[(i + 2) % n] if (closed or i + 2 < n) else p2
        c1 = (p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6)
        c2 = (p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6)
        d += f' C {c1[0]:.1f} {c1[1]:.1f} {c2[0]:.1f} {c2[1]:.1f} {p2[0]:.1f} {p2[1]:.1f}'
    return d + (' Z' if closed else '')


def segs(pts):
    """Curve segments only (no leading M), to continue a path that already has a current point."""
    d = smooth(pts)
    return d[d.index(' C'):] if len(pts) > 1 else ''


def by_y(pts, y0, y1):
    return [p for p in pts if y0 <= p[1] <= y1]


def lift(pts, dy):
    """Shift points up by dy (e.g. a hem shadow band = hem curve and the hem lifted 12px)."""
    return [(x, y - dy) for x, y in pts]


def P(pts):
    """Points as a polyline string for 'M … L …' paths."""
    return ' '.join(f'{x:g} {y:g}' for x, y in pts)
