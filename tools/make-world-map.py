#!/usr/bin/env python3
"""Makes assets/about/world-map.svg: a coloured world map with a pin in each visited place.

Data: Natural Earth (public domain, https://www.naturalearthdata.com), the GeoJSON files
ne_50m_admin_0_countries, ne_50m_admin_0_map_units and ne_50m_lakes. Projection: Natural Earth 1.

Usage:  python3 tools/make-world-map.py FOLDER_WITH_THE_GEOJSON_FILES assets/about/world-map.svg
To add or move a pin, edit the PINS list below (label, longitude, latitude) and, if the place is a
whole country, add it to VISITED so the country turns green. Keep the list under "Places I have
visited" in about.html in step with the pins.
"""
import json, math, sys

GEO = (sys.argv[1] if len(sys.argv) > 1 else ".").rstrip("/\\") + "/"
OUT = sys.argv[2] if len(sys.argv) > 2 else "world-map.svg"
W, H = 2500, 667   # frame: 15 : 4 (the cover on the About page is 15 : 4 too)
DX = 0.0           # horizontal shift in SVG units; the world is drawn three times so the sides join up

LAT_TOP, LAT_BOTTOM = 77.0, -50.0   # visible band (degrees)


def ne1(lon, lat):
    lam = math.radians(lon)
    phi = math.radians(lat)
    p2 = phi * phi
    p4 = p2 * p2
    x = lam * (0.8707 - 0.131979 * p2 + p4 * (-0.013791 + p4 * (0.003971 * p2 - 0.001529 * p4)))
    y = phi * (1.007226 + p2 * (0.015085 + p4 * (-0.044475 + 0.028874 * p2 - 0.005916 * p4)))
    return x, y


x_edge = ne1(180, 0)[0]
y_top = ne1(0, LAT_TOP)[1]
y_bot = ne1(0, LAT_BOTTOM)[1]
# The whole latitude band fits the frame height; the world is then narrower than the frame,
# so a copy of the world is drawn on each side (they are faded out by the page).
S = H / (y_top - y_bot)
WORLD_W = 2 * x_edge * S
Y0 = y_top * S
print("world width", round(WORLD_W, 1), "of", W, file=sys.stderr)


def proj(lon, lat):
    x, y = ne1(lon, lat)
    return (W / 2 + DX + x * S, Y0 - y * S)


VISITED = {
    # admin name in countries file -> label
    "Venezuela": 1, "Colombia": 1, "Brazil": 1, "Argentina": 1, "Ecuador": 1, "Peru": 1,
    "Panama": 1, "Costa Rica": 1, "Puerto Rico": 1, "Mexico": 1, "The Bahamas": 1,
    "Saint Kitts and Nevis": 1, "Curaçao": 1, "United States of America": 1, "Canada": 1,
    "Spain": 1, "France": 1, "Italy": 1, "Netherlands": 1, "Romania": 1, "Monaco": 1,
    "Iceland": 1, "Denmark": 1,
}

# Pins: label, lon, lat (tip of the pin)
PINS = [
    ("Venezuela", -66.2, 7.6),
    ("Colombia", -74.1, 4.7),
    ("Brazil", -52.0, -10.5),
    ("Argentina", -63.0, -34.0),
    ("Ecuador", -78.4, -1.3),
    ("Peru", -75.0, -10.0),
    ("Panama", -80.0, 8.6),
    ("Costa Rica", -84.4, 9.9),
    ("Puerto Rico", -66.4, 18.2),
    ("Mexico", -101.5, 23.0),
    ("The Bahamas", -77.3, 25.0),
    ("St Kitts", -62.75, 17.35),
    ("Curaçao", -68.95, 12.15),
    ("United States", -97.0, 38.5),
    ("Canada", -80.95, 47.1),  # Greater Sudbury
    ("Spain", -3.7, 40.2),
    ("France", 2.4, 47.2),
    ("Italy", 12.4, 42.3),
    ("Netherlands", 5.3, 52.2),
    ("Romania", 25.0, 45.9),
    ("Monaco", 7.42, 43.74),
    ("Iceland", -19.0, 64.8),
    ("Denmark", 9.5, 56.0),
    ("England", -1.6, 52.5),
]
assert len(PINS) == 24


def load(name):
    return json.load(open(GEO + name))


def polys(geom):
    if geom["type"] == "Polygon":
        return [geom["coordinates"]]
    return geom["coordinates"]


def ring_path(ring, min_step=1.5):
    pts = [proj(lon, lat) for lon, lat in ring]
    out = [(round(pts[0][0]), round(pts[0][1]))]
    for p in pts[1:-1]:
        q = (round(p[0]), round(p[1]))
        if abs(q[0] - out[-1][0]) + abs(q[1] - out[-1][1]) >= min_step:
            out.append(q)
    if len(out) < 3:
        return None
    d = f"M{out[0][0]} {out[0][1]}l"
    parts = []
    for a, b in zip(out, out[1:]):
        parts.append(f"{b[0]-a[0]} {b[1]-a[1]}")
    return d + " ".join(parts) + "z"


def ring_bbox_ok(pts):
    xs = [p[0] for p in pts]
    ys = [p[1] for p in pts]
    return not (max(xs) < -10 or min(xs) > W + 10 or max(ys) < -10 or min(ys) > H + 10)


def poly_centroid(poly):
    ring = poly[0]
    return (sum(p[0] for p in ring) / len(ring), sum(p[1] for p in ring) / len(ring))


def poly_area(ring):
    a = 0
    pr = [proj(lon, lat) for lon, lat in ring]
    for i in range(len(pr) - 1):
        a += pr[i][0] * pr[i + 1][1] - pr[i + 1][0] * pr[i][1]
    return abs(a) / 2


def build(features, min_area=1.5, keep_tiny=False):
    """features: list of (geometry, visited_bool_per_polygon_fn)"""
    land_v, land_u = [], []
    for geom, is_visited in features:
        for poly in polys(geom):
            if is_visited is None:
                vis = False
            else:
                vis = is_visited(poly)
            pr0 = [proj(lon, lat) for lon, lat in poly[0]]
            if not ring_bbox_ok(pr0):
                continue
            if poly_area(poly[0]) < min_area and not (vis and keep_tiny):
                continue
            parts = []
            for ring in poly:
                d = ring_path(ring)
                if d:
                    parts.append(d)
            if not parts:
                continue
            (land_v if vis else land_u).append("".join(parts))
    return land_v, land_u


countries = load("ne_50m_admin_0_countries.geojson")
units = load("ne_50m_admin_0_map_units.geojson")

feats = []
for f in countries["features"]:
    p = f["properties"]
    admin = p["ADMIN"]
    if admin == "Antarctica" or p["ADM0_A3"] == "ATA":
        continue
    if admin == "United Kingdom":
        continue  # drawn from map units so that only England is highlighted
    if admin in VISITED:
        if admin == "France":
            # mainland only (not French Guiana and the other overseas parts)
            def vis(poly, _):
                c = poly_centroid(poly)
                return c[0] > -10 and 35 < c[1] < 55
            feats.append((f["geometry"], lambda poly: vis(poly, None)))
        elif admin == "Netherlands":
            def vis(poly, _):
                c = poly_centroid(poly)
                return c[1] > 49
            feats.append((f["geometry"], lambda poly: vis(poly, None)))
        elif admin == "Denmark":
            feats.append((f["geometry"], lambda poly: True))
        else:
            feats.append((f["geometry"], lambda poly: True))
    else:
        feats.append((f["geometry"], None))

for f in units["features"]:
    p = f["properties"]
    if p["ADM0_A3"] == "GBR":
        visited = p["NAME"] == "England"
        feats.append((f["geometry"], (lambda poly: True) if visited else None))

# Draw the world three times (left copy, centre, right copy) so the frame is filled.
land_v, land_u, lake_paths, grat = [], [], [], []
lakes = load("ne_50m_lakes.geojson")
for DX in (-WORLD_W, 0.0, WORLD_W):
    v, u = build(feats, min_area=2.0, keep_tiny=True)
    land_v += v
    land_u += u
    # Lakes drawn in the ocean colour on top of the land
    for f in lakes["features"]:
        for poly in polys(f["geometry"]):
            pr0 = [proj(lon, lat) for lon, lat in poly[0]]
            if not ring_bbox_ok(pr0) or poly_area(poly[0]) < 4:
                continue
            d = ring_path(poly[0])
            if d:
                lake_paths.append(d)
    # Graticule every 30 degrees
    for lon in range(-180, 181, 30):
        pts = [proj(lon, lat) for lat in range(int(LAT_BOTTOM) - 10, int(LAT_TOP) + 12, 2)]
        grat.append("M" + "L".join(f"{x:.1f} {y:.1f}" for x, y in pts))
    for lat in range(-30, 91, 30):
        pts = [proj(lon, lat) for lon in range(-180, 181, 5)]
        grat.append("M" + "L".join(f"{x:.1f} {y:.1f}" for x, y in pts))
DX = 0.0  # pins are drawn once, on the centre copy

# Pins
R = 16.0  # head radius in SVG units


def pin(label, lon, lat):
    x, y = proj(lon, lat)
    return x, y, label


pins = sorted((pin(*p) for p in PINS), key=lambda t: t[1])
tx = 0.879 * R
ty = 1.624 * R
pin_defs = (
    f'<g id="pin">'
    f'<ellipse cx="0" cy="0.5" rx="{R*0.62:.1f}" ry="{R*0.2:.1f}" fill="#1a3a52" opacity=".28"/>'
    f'<path d="M0 0L{-tx:.2f} {-ty:.2f}A{R} {R} 0 1 1 {tx:.2f} {-ty:.2f}Z" '
    f'fill="#e5412f" stroke="#fff" stroke-width="3.6" stroke-linejoin="round"/>'
    f'<circle cx="0" cy="{-2.1*R:.2f}" r="{R*0.38:.2f}" fill="#fff"/>'
    f'</g>'
)

svg = []
svg.append(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" '
           f'preserveAspectRatio="xMidYMid slice" role="img" aria-label="World map with pins on the 24 places Miguel has visited">')
svg.append('<defs>'
           '<linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">'
           '<stop offset="0" stop-color="#cfe8f6"/><stop offset="1" stop-color="#a6d0ec"/></linearGradient>'
           + pin_defs + '</defs>')
svg.append(f'<rect width="{W}" height="{H}" fill="url(#sea)"/>')
svg.append('<path d="' + "".join(grat) + '" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="1.3"/>')
svg.append('<g fill-rule="evenodd" stroke="#fff" stroke-width="1.5" stroke-linejoin="round">')
svg.append('<path fill="#efe5c8" d="' + "".join(land_u) + '"/>')
svg.append('<path fill="#79c29a" d="' + "".join(land_v) + '"/>')
svg.append('</g>')
svg.append('<path fill="#bfe0f3" stroke="#fff" stroke-width="1.2" fill-rule="evenodd" d="' + "".join(lake_paths) + '"/>')
svg.append('<g>')
for x, y, label in pins:
    svg.append(f'<use href="#pin" transform="translate({x:.1f} {y:.1f})"/>')
svg.append('</g>')
svg.append('</svg>')
open(OUT, "w").write("\n".join(svg))
print("pins:", [(l, round(x), round(y)) for x, y, l in pins], file=sys.stderr)
