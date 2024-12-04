import p5 from 'p5';
import fontFile from '../../assets/fonts/lingfeijin.ttf';

const mySketch =
  (parentElement: HTMLElement, wordList: string[]) => (p: p5) => {
    let fontName: p5.Font;
    let bgColor: p5.Color = p.color(0, 50);
    let words = wordList;

    const displayBackground = (word: string, sketch: p5) => {
      sketch.push();

      const wordsTemp: string[] = word.split(/，|。|、|\n/);
      const maxFontSize: number = 120;
      const fontSize: number =
        Math.floor(sketch.width / 6) > maxFontSize
          ? maxFontSize
          : Math.floor(sketch.width / 8);
      sketch.fill(255, 255, 255, 30);
      sketch.textFont(fontName);
      sketch.textSize(fontSize);
      sketch.textAlign('center', 'center');
      sketch.text(wordsTemp[0], sketch.width / 2, (2 * sketch.height) / 5);
      sketch.text(wordsTemp[1], sketch.width / 2, (4 * sketch.height) / 5);

      sketch.pop();
    };

    p.preload = () => {
      fontName = p.loadFont(fontFile);
    };

    p.setup = () => {
      p.frameRate(30);
      const width = Math.floor(
        parentElement.offsetWidth > 1250 ? 1250 : parentElement.offsetWidth,
      );
      const height = Math.floor(width / 2);
      p.createCanvas(width, height);
      p.background(0, 0, 0);
      p.pixelDensity(1);
      displayBackground(words[0], p);
    };

    p.draw = async () => {
      p.background(bgColor);
      displayBackground(words[0], p);
    };
  };

export default mySketch;
