#!/usr/bin/env node
/**
 * Convert favicon from square to circle and regenerate all sizes.
 */
const fs = require('fs');
const path = require('path');

async function makeCircularFavicon() {
  let sharp;
  try {
    sharp = require('sharp');
  } catch (e) {
    console.error('Error: sharp module not found. Installing...');
    console.error('Please run: npm install sharp');
    process.exit(1);
  }

  const staticDir = path.join(__dirname, '..', 'static');
  const faviconPath = path.join(staticDir, 'favicon.png');

  if (!fs.existsSync(faviconPath)) {
    console.error(`Error: ${faviconPath} not found`);
    process.exit(1);
  }

  // Read the original image
  const image = sharp(faviconPath);
  const metadata = await image.metadata();
  const size = Math.min(metadata.width, metadata.height);

  // Create a circular mask
  const svgMask = `
    <svg width="${size}" height="${size}">
      <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="white"/>
    </svg>
  `;

  // Apply circular mask to create circular favicon
  const circularBuffer = await image
    .resize(size, size, { fit: 'cover' })
    .composite([{
      input: Buffer.from(svgMask),
      blend: 'dest-in'
    }])
    .png()
    .toBuffer();

  // Save circular version
  const circularPath = path.join(staticDir, 'favicon_circular.png');
  fs.writeFileSync(circularPath, circularBuffer);
  console.log('Created circular favicon base');

  // Sizes to generate
  const sizes = [
    { width: 180, height: 180, name: 'apple-touch-icon.png' },
    { width: 192, height: 192, name: 'android-chrome-192x192.png' },
    { width: 512, height: 512, name: 'android-chrome-512x512.png' },
    { width: 32, height: 32, name: 'favicon-32x32.png' },
    { width: 16, height: 16, name: 'favicon-16x16.png' },
  ];

  // Generate all sizes
  for (const { width, height, name } of sizes) {
    const svgMaskSize = `
      <svg width="${width}" height="${height}">
        <circle cx="${width / 2}" cy="${height / 2}" r="${width / 2}" fill="white"/>
      </svg>
    `;

    const outputBuffer = await sharp(circularPath)
      .resize(width, height, { fit: 'cover' })
      .composite([{
        input: Buffer.from(svgMaskSize),
        blend: 'dest-in'
      }])
      .png()
      .toBuffer();

    const outputPath = path.join(staticDir, name);
    fs.writeFileSync(outputPath, outputBuffer);
    console.log(`Generated ${name} (${width}x${height})`);
  }

  // Replace original with circular version
  fs.renameSync(circularPath, faviconPath);
  console.log('\n✅ All favicon files have been converted to circular!');
}

makeCircularFavicon().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
