import zlib
import struct
import math

def generate_casio_icon(size):
    pixels = bytearray(size * size * 4)
    
    # Coordinates in normalized 0.0 - 1.0 space
    for y in range(size):
        ny = y / size
        for x in range(size):
            nx = x / size
            idx = (y * size + x) * 4
            
            # Default dark background #101216
            r, g, b, a = 16, 18, 22, 255
            
            # Corner rounded squircle background
            cx = nx - 0.5
            cy = ny - 0.5
            dist_sq = (abs(cx)**4 + abs(cy)**4)**0.25
            
            # Watch body (center octagonal case: x in 0.18 - 0.82, y in 0.20 - 0.80)
            in_case_x = 0.18 <= nx <= 0.82
            in_case_y = 0.20 <= ny <= 0.80
            
            # Octagon chamfer cutoffs
            chamfer = 0.10
            c1 = (nx - 0.18) + (ny - 0.20) > chamfer
            c2 = (0.82 - nx) + (ny - 0.20) > chamfer
            c3 = (nx - 0.18) + (0.80 - ny) > chamfer
            c4 = (0.82 - nx) + (0.80 - ny) > chamfer
            
            # Straps
            if 0.35 <= nx <= 0.65 and (ny < 0.20 or ny > 0.80):
                r, g, b = 24, 27, 32
                if int(ny * size) % 12 in (0, 1):
                    r, g, b = 12, 14, 16

            # Case
            if in_case_x and in_case_y and c1 and c2 and c3 and c4:
                # Octagonal resin case #282c34 with gradient
                shade = int(35 + (1.0 - ny) * 20)
                r, g, b = shade, shade + 3, shade + 8
                
                # Outer border
                if (nx < 0.20 or nx > 0.80 or ny < 0.22 or ny > 0.78):
                    r, g, b = 15, 17, 20
                
                # Inner faceplate
                if 0.24 <= nx <= 0.76 and 0.26 <= ny <= 0.74:
                    r, g, b = 12, 14, 18
                    
                    # Blue pinstripe
                    if (0.26 <= nx <= 0.74 and (0.28 <= ny <= 0.288 or 0.712 <= ny <= 0.72)) or \
                       (0.732 <= nx <= 0.74 and 0.28 <= ny <= 0.72) or \
                       (0.26 <= nx <= 0.268 and 0.28 <= ny <= 0.72):
                        r, g, b = 30, 95, 185
                    
                    # Red Water Resist badge
                    if 0.58 <= nx <= 0.72 and 0.35 <= ny <= 0.39:
                        r, g, b = 185, 28, 28

                    # LCD screen unit #a4b79a
                    if 0.29 <= nx <= 0.71 and 0.42 <= ny <= 0.68:
                        r, g, b = 164, 183, 154
                        
                        # Digital digits representation (dark charcoal segments #141a14)
                        # Top line day/date
                        if 0.44 <= ny <= 0.47 and (0.33 <= nx <= 0.40 or 0.60 <= nx <= 0.67):
                            r, g, b = 20, 26, 20
                        
                        # Main digits block 10:58
                        if 0.50 <= ny <= 0.62:
                            # 1
                            if 0.34 <= nx <= 0.36:
                                r, g, b = 20, 26, 20
                            # 0
                            if (0.38 <= nx <= 0.44 and (0.50 <= ny <= 0.52 or 0.60 <= ny <= 0.62)) or \
                               (0.50 <= ny <= 0.62 and (0.38 <= nx <= 0.395 or 0.425 <= nx <= 0.44)):
                                r, g, b = 20, 26, 20
                            # :
                            if 0.46 <= nx <= 0.47 and (0.53 <= ny <= 0.545 or 0.575 <= ny <= 0.59):
                                r, g, b = 20, 26, 20
                            # 5
                            if (0.49 <= nx <= 0.55 and (0.50 <= ny <= 0.52 or 0.55 <= ny <= 0.57 or 0.60 <= ny <= 0.62)) or \
                               (0.50 <= ny <= 0.56 and 0.49 <= nx <= 0.505) or \
                               (0.56 <= ny <= 0.62 and 0.535 <= nx <= 0.55):
                                r, g, b = 20, 26, 20
                            # 8
                            if (0.57 <= nx <= 0.63 and (0.50 <= ny <= 0.52 or 0.55 <= ny <= 0.57 or 0.60 <= ny <= 0.62)) or \
                               (0.50 <= ny <= 0.62 and (0.57 <= nx <= 0.585 or 0.615 <= nx <= 0.63)):
                                r, g, b = 20, 26, 20
                            # seconds 32
                            if 0.54 <= ny <= 0.62 and 0.65 <= nx <= 0.69:
                                r, g, b = 25, 32, 25

            # Metallic pushers
            if (0.14 <= nx <= 0.18 and 0.30 <= ny <= 0.37) or \
               (0.14 <= nx <= 0.18 and 0.63 <= ny <= 0.70) or \
               (0.82 <= nx <= 0.86 and 0.63 <= ny <= 0.70):
                r, g, b = 180, 185, 192

            pixels[idx] = r
            pixels[idx + 1] = g
            pixels[idx + 2] = b
            pixels[idx + 3] = a

    # PNG assembly
    raw_lines = bytearray()
    for y in range(size):
        raw_lines.append(0) # Filter byte: None
        start = y * size * 4
        raw_lines.extend(pixels[start:start + size * 4])
        
    compressed = zlib.compress(bytes(raw_lines))
    
    def chunk(tag, data):
        crc = zlib.crc32(tag + data) & 0xffffffff
        return struct.pack('>I', len(data)) + tag + data + struct.pack('>I', crc)

    png = b'\x89PNG\r\n\x1a\n'
    ihdr = struct.pack('>IIBBBBB', size, size, 8, 6, 0, 0, 0)
    png += chunk(b'IHDR', ihdr)
    png += chunk(b'IDAT', compressed)
    png += chunk(b'IEND', b'')
    return png

for sz, filename in [
    (192, 'public/pwa-192x192.png'),
    (512, 'public/pwa-512x512.png'),
    (512, 'public/pwa-maskable-512x512.png'),
    (180, 'public/apple-touch-icon.png'),
    (64,  'public/favicon.ico')
]:
    with open(filename, 'wb') as f:
        f.write(generate_casio_icon(sz))

print("Rendered all Casio PWA icons successfully!")
