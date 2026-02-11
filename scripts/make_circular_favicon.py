#!/usr/bin/env python3
"""
Convert favicon from square to circle and regenerate all sizes.
"""
from PIL import Image, ImageDraw
import os
import sys

def make_circular(image_path, output_path):
    """Convert a square image to a circular one."""
    # Open the image
    img = Image.open(image_path).convert("RGBA")
    
    # Get dimensions
    width, height = img.size
    size = min(width, height)
    
    # Create a circular mask
    mask = Image.new("L", (size, size), 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0, size, size), fill=255)
    
    # Resize image to square if needed
    if width != height:
        img = img.resize((size, size), Image.Resampling.LANCZOS)
    
    # Create output image with transparency
    output = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    
    # Apply circular mask
    output.paste(img, (0, 0))
    output.putalpha(mask)
    
    # Save the result
    output.save(output_path, "PNG", optimize=True)
    print(f"Created circular favicon: {output_path}")

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    static_dir = os.path.join(project_root, "static")
    
    favicon_path = os.path.join(static_dir, "favicon.png")
    
    if not os.path.exists(favicon_path):
        print(f"Error: {favicon_path} not found")
        sys.exit(1)
    
    # Create circular version of the original
    circular_favicon = os.path.join(static_dir, "favicon_circular.png")
    make_circular(favicon_path, circular_favicon)
    
    # Sizes to generate
    sizes = [
        (180, 180, "apple-touch-icon.png"),
        (192, 192, "android-chrome-192x192.png"),
        (512, 512, "android-chrome-512x512.png"),
        (32, 32, "favicon-32x32.png"),
        (16, 16, "favicon-16x16.png"),
    ]
    
    # Generate all sizes
    for width, height, filename in sizes:
        output_path = os.path.join(static_dir, filename)
        make_circular(circular_favicon, output_path)
        # Resize to specific dimensions
        img = Image.open(output_path)
        img = img.resize((width, height), Image.Resampling.LANCZOS)
        img.save(output_path, "PNG", optimize=True)
        print(f"Generated {filename} ({width}x{height})")
    
    # Replace original with circular version
    os.replace(circular_favicon, favicon_path)
    print("\n✅ All favicon files have been converted to circular!")

if __name__ == "__main__":
    main()
