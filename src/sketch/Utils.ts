import p5 from "p5";

export const generateRandomLocation = (_x: number, _y: number, _mag: number, sketch: p5): p5.Vector => {
    let randomDirection = sketch.createVector(sketch.random(0, sketch.width), sketch.random(0, sketch.height));

    let location: p5.Vector = sketch.createVector(_x, _y);
    location.sub(randomDirection);
    location.normalize();
    location.mult(_mag);
    location.add(_x, _y);

    return location;
}

export const dealListForPoem = (str: string): string[] => {
    const words: string[] = [];
    let n = str.split(/，|。|、|\n/);

    for (let i of n) {
        i.trim();
        if (i === "") {
            continue;
        }
        words.push(i);
    }

    return words;
}