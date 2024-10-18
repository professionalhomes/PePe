// convertToWebp.js
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Input and output directories
const inputDir = path.join(__dirname, 'images'); // Replace with your input directory
const outputDir = path.join(__dirname, 'compressed_images'); // Replace with your output directory

// Desired file size in KB (e.g., 200 KB)
const targetFileSizeKB = 200;

// Rounded corner radius values (adjust these to experiment)
const outerRx = 75; // Adjust this value to change the outer corner radius
const outerRy = 75; // Adjust this value to change the outer corner radius
const innerRx = 75; // Adjust this value to change the inner corner radius
const innerRy = 75; // Adjust this value to change the inner corner radius

// Create the output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Function to compress, convert to WebP, and remove white background around rounded corners
async function compressAndRemoveWhiteCorners(inputPath, outputPath) {
  try {
    // Read the image and trim it
    const trimmedImageBuffer = await sharp(inputPath)
      .trim() // Trim the image to remove excess whitespace
      .ensureAlpha() // Ensure the image has an alpha channel
      .toColorspace('srgb') // Convert to standard RGB color space
      .toBuffer();

    const trimmedImage = sharp(trimmedImageBuffer);
    const { width, height } = await trimmedImage.metadata();

    // Create a more precise mask for rounded corners using adjustable rx and ry values
    const maskBuffer = Buffer.from(`
      <svg width="${width}" height="${height}">
        <rect x="0" y="0" width="${width}" height="${height}" fill="white" rx="${outerRx}" ry="${outerRy}"/>  <!-- Outer rounded corners -->
        <rect x="10" y="10" width="${width - 20}" height="${height - 20}" fill="black" rx="${innerRx}" ry="${innerRy}"/> <!-- Inner rectangle -->
      </svg>`);

    const mask = await sharp(maskBuffer)
      .png()
      .resize(width, height) // Ensure the mask has the exact same size as the trimmed image
      .toBuffer();

    // Ensure both images (trimmed and mask) have the exact same size
    const resizedTrimmedImage = await trimmedImage.resize(width, height).toBuffer();
    const transparentImage = await sharp(resizedTrimmedImage)
      .composite([{ input: mask, blend: 'dest-in' }]) // Mask to keep inner content
      .webp({ quality: 80 }); // Initial WebP conversion

    // Compress to WebP format and manage quality
    let quality = 80; // Start with a default quality
    let compressedBuffer = await transparentImage.toBuffer();
    while (compressedBuffer.length / 1024 > targetFileSizeKB && quality > 10) {
      quality -= 10; // Reduce quality by 10 each iteration
      compressedBuffer = await transparentImage.webp({ quality }).toBuffer();
    }

    // Save the compressed image
    await sharp(compressedBuffer).toFile(outputPath);
    console.log(`Compressed and saved: ${outputPath} (Size: ${(compressedBuffer.length / 1024).toFixed(2)} KB)`);
  } catch (error) {
    console.error(`Error processing ${inputPath}:`, error);
  }
}

// Process all images in the input directory
fs.readdir(inputDir, (err, files) => {
  if (err) {
    console.error('Error reading input directory:', err);
    return;
  }

  files.forEach((file) => {
    const inputPath = path.join(inputDir, file);
    const outputFileName = path.parse(file).name + '.webp'; // Change extension to .webp
    const outputPath = path.join(outputDir, outputFileName);

    compressAndRemoveWhiteCorners(inputPath, outputPath);
  });
});
