import p5 from 'p5';
import Particle from './Particles';
import fontFile from '../../assets/fonts/lingfeijin.ttf';

const mySketch =
  (parentElement: HTMLElement, wordList: string[]) => (p: p5) => {
    let particles: Particle[] = [];
    let pixelSteps: number = 12;
    let words: string[] = [];
    let wordIndex: number = 0;
    let fontName: p5.Font;
    let bgColor: p5.Color = p.color(0, 50);

    const displayWord = (word: string, sketch: p5) => {
      const wordsTemp: string[] = word.split(/，|。|、|\n/);
      const colorNums: number = 5;
      const maxFontSize: number = 160;
      const newColors: p5.Color[] = [];

      let pg: p5.Graphics = sketch.createGraphics(sketch.width, sketch.height);
      pg.background(0);
      pg.fill(255, 255, 0);
      const fontSize: number = Math.min(
        maxFontSize,
        Math.floor(sketch.width / 6),
      );
      pg.textSize(fontSize);
      pg.textAlign('center', 'center');
      pg.textFont(fontName);

      pg.text(wordsTemp[0], pg.width / 2, pg.height / 5);
      pg.text(wordsTemp[1], pg.width / 2, (3 * pg.height) / 5);
      pg.loadPixels();

      for (let i = 0; i < colorNums; i++) {
        let newColor: p5.Color = sketch.color(
          sketch.random(128, 255),
          sketch.random(176, 255),
          sketch.random(176, 255),
        );
        newColors.push(newColor);
      }

      let particleCount = particles.length;
      let particleIndex = 0;

      let coordsIndexes: number[] = [];

      for (let i = 0; i < pg.width * pg.height; i += pixelSteps) {
        coordsIndexes.push(i);
      }
      const nums = coordsIndexes.length;

      for (let i = 0; i < nums; i++) {
        let randomIndex = Math.floor(sketch.random(0, coordsIndexes.length));
        let coordIndex = coordsIndexes[randomIndex];
        coordsIndexes.splice(randomIndex, 1);

        if (pg.pixels[coordIndex * 4] !== 0) {
          let x = coordIndex % pg.width;
          let y = Math.floor(coordIndex / pg.width);
          let newParticle = new Particle(sketch);

          if (particleIndex < particleCount) {
            newParticle = particles[particleIndex];
            particleIndex += 1;
          } else {
            newParticle.location.x = x;
            newParticle.location.y = y;
            newParticle.particleSize = sketch.random(3, 6);
            particles.push(newParticle);
          }

          newParticle.color = newColors[Math.floor(Math.random() * colorNums)];
        }
      }
    };

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
      words = wordList;

      const width = Math.floor(
        parentElement.offsetWidth > 1250 ? 1250 : parentElement.offsetWidth,
      );
      const height = Math.floor(width / 2);
      p.createCanvas(width, height);
      p.background(0, 0, 0);
      p.pixelDensity(1);
      displayWord(words[wordIndex], p);
      displayBackground(words[wordIndex], p);
    };

    p.draw = async () => {
      p.background(bgColor);
      displayBackground(words[wordIndex], p);
      for (let i = particles.length - 1; i >= 0; i--) {
        let particle = particles[i];
        particle.display();
      }
    };
  };

export default mySketch;
