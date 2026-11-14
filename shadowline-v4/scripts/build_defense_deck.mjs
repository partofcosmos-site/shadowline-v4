import pptxgen from "pptxgenjs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");

const pptx = new pptxgen();
pptx.layout = "LAYOUT_16x9";

for (let i = 1; i <= 10; i++) {
  const slide = pptx.addSlide();
  const slideNum = i < 10 ? `0${i}` : `${i}`;
  const imgPath = path.join(ROOT_DIR, "artifacts", `slide_${slideNum}.png`);
  
  slide.addImage({
    path: imgPath,
    x: 0,
    y: 0,
    w: "100%",
    h: "100%"
  });
}

const outputPath = path.join(ROOT_DIR, "SHADOWLINE_4.0_NASA_Defense_Deck.pptx");
pptx.writeFile({ fileName: outputPath }).then(() => {
  console.log(`[OK] Successfully synchronized presentation master to: ${outputPath}`);
}).catch((err) => {
  console.error(`[ERROR] Failed to compile PPTX master:`, err);
  process.exit(1);
});
