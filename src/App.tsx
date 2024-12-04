import React, { useEffect, useRef } from 'react';
import './App.scss';
import { sketch5 as sketch } from './sketch';
import p5 from 'p5';

const wordList = ['桃李春风一杯酒，江湖夜雨十年灯'];

const App = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvasDivElement: HTMLElement =
      canvasRef.current as unknown as HTMLElement;
    const s = new p5(sketch(canvasDivElement, wordList), canvasDivElement);

    return () => {
      s.remove();
    };
  }, []);

  return <div ref={canvasRef} className='p5' />;
};

export default App;
