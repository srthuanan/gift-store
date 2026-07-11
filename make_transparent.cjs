const { Jimp } = require("jimp");

async function removeBackground(inputFile, outputFile, size = 200) {
  try {
    const img = await Jimp.read(inputFile);
    
    img.resize({ w: size, h: size });

    img.scan(0, 0, img.bitmap.width, img.bitmap.height, function (x, y, idx) {
      const r = this.bitmap.data[idx + 0];
      const g = this.bitmap.data[idx + 1];
      const b = this.bitmap.data[idx + 2];

      // Key out white and grey background
      const maxDiff = Math.max(Math.abs(r - g), Math.max(Math.abs(r - b), Math.abs(g - b)));
      
      // If it is very bright and has low saturation (grey/white)
      if (r > 160 && g > 160 && b > 160 && maxDiff < 15) {
        this.bitmap.data[idx + 3] = 0; 
      } else if (r > 140 && g > 140 && b > 140 && maxDiff < 20) {
        // Smooth transition for darker grey borders
        const avg = (r + g + b) / 3;
        const alpha = Math.max(0, Math.min(255, (avg - 140) * 2));
        this.bitmap.data[idx + 3] = 255 - alpha;
      }
    });

    await img.write(outputFile);
    console.log("Processed " + inputFile);
  } catch (err) {
    console.error(err);
  }
}

async function main() {
  await removeBackground("public/demo-timeline/images/petal.png", "public/demo-timeline/images/petal_transparent.png", 200);
  await removeBackground("public/demo-timeline/images/rose.png", "public/demo-timeline/images/rose_transparent.png", 200);
  await removeBackground("public/demo-box/images/box.png", "public/demo-box/images/box_transparent.png", 400);
  await removeBackground("public/demo-box/images/jar.png", "public/demo-box/images/jar_transparent.png", 400);
  await removeBackground("public/demo-box/images/firefly.png", "public/demo-box/images/firefly_transparent.png", 80);
  console.log("All done");
}

main();
