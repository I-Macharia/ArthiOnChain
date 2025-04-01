const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

async function generateFavicons() {
  const logo = './public/logo.jpeg';
  
  // Favicon sizes needed
  const sizes = [16, 32, 48, 64, 128, 256];
  
  try {
    for (const size of sizes) {
      await sharp(logo)
        .resize(size, size)
        .toFile(`./public/favicon-${size}x${size}.png`);
    }

    // Generate .ico file (contains 16x16 and 32x32)
    await sharp(logo)
      .resize(32, 32)
      .toFile('./public/favicon.ico');

    // Generate apple-touch-icon
    await sharp(logo)
      .resize(180, 180)
      .toFile('./public/apple-touch-icon.png');
    
    console.log('Favicons generated successfully!');
  } catch (error) {
    console.error('Error generating favicons:', error);
  }
}

generateFavicons();