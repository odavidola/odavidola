"use client"

import {useEffect, useRef} from 'react';

const CanvasComponent = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);


  useEffect(() => {
    const width = 400, height = 400;
    const canvas = canvasRef.current;

    if (!canvas) return;

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    const image = new Image();
    image.src = '/twitter.jpeg';

    image.addEventListener('load', () => {
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      const pixelData = ctx.getImageData(0, 0, width, height).data;
      ctx.clearRect(0, 0, width, height);

      let imageMap = [];

      function getMapValue(r, g, b) {
        return 255 - Math.sqrt(r * r * 0.299 + g * g * 0.587 + b * b * 0.114);
      }

      for (let j = 0; j < height; j++) {
        let row = [];
        for (let i = 0; i < width; i++) {
          row.push([getMapValue(
            pixelData[(j * width + i) * 4],
            pixelData[(j * width + i) * 4 + 1],
            pixelData[(j * width + i) * 4 + 2]
          )]);
        }
        imageMap.push(row);
      }


      let particles = [];
      const numParticles = 8000;


      class Particle {
        // Define properties with initial values
        x: number;
        y: number;
        velo: number;
        acc: number;
        size: number;

        constructor() {
          this.x = Math.random() * width;
          this.y = Math.random() * height;
          this.velo = 0;
          this.acc = Math.random() * 0.5;
          this.size = Math.random() * 0.75;
        }

        update(imageMap: number[][][]) {
          let px = Math.floor(this.x);
          let py = Math.floor(this.y);

          // Check if px and py are within the bounds of the imageMap
          if (py >= 0 && py < imageMap.length && px >= 0 && px < imageMap[py].length) {
            this.velo = imageMap[py][px][0] * 0.02;
          } else {
            this.velo = 0; // Or some default value
          }

          this.y += this.velo + this.acc;
          this.x += (Math.random() - 0.5) * this.velo;

          if (this.x >= width || this.x < 0) {
            this.x = Math.random() * width;
          }

          if (this.y >= height) {
            this.y = 0;
            this.x = Math.random() * width;
          }
        }

        draw(ctx: CanvasRenderingContext2D) {
          ctx.beginPath();
          ctx.fillStyle = 'white';
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }


      function init() {
        for (let i = 0; i < numParticles; i++)
          particles.push(new Particle);
      }

      init();


      function animate() {
        ctx.globalAlpha = 0.03;
        ctx.fillStyle = 'rgb(0,0,0)';
        ctx.fillRect(0, 0, width, height);

        ctx.globalAlpha = 0.2;
        for (let i = 0; i < numParticles; i++) {
          particles[i].update(imageMap);
          ctx.globalAlpha = particles[i].velo;
          particles[i].draw(ctx);
        }
        requestAnimationFrame(animate);
      }

      animate();
    });

    // Cleanup function to stop the animation when the component unmounts
    return () => {
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, width, height);
        }
      }
    };
  }, []);

  return <canvas ref={canvasRef}></canvas>;
};

export default CanvasComponent;
