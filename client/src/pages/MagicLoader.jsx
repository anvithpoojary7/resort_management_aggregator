import React, { useEffect, useRef, useCallback } from 'react';
import { cn } from '../lib/utils';

/**
 * JSDoc comment for documenting the particle object shape.
 * This replaces the TypeScript 'interface Particle'.
 * @typedef {object} Particle
 * @property {number} radius
 * @property {number} x
 * @property {number} y
 * @property {number} angle
 * @property {number} speed
 * @property {number} accel
 * @property {number} decay
 * @property {number} life
 */

/**
 * A magical particle loader component.
 * This replaces the TypeScript 'interface MagicLoaderProps'.
 * @param {object} props - The component props.
 * @param {number} [props.size=200] - The size of the canvas.
 * @param {number} [props.particleCount=1] - The number of particles to add per frame.
 * @param {number} [props.speed=1] - The overall speed of the animation.
 * @param {[number, number]} [props.hueRange=[0, 360]] - The range of hues for the particles.
 * @param {string} [props.className] - Additional CSS classes.
 */
const MagicLoader = ({
  size = 200,
  particleCount = 2,
  speed = 2,
  hueRange = [180, 220],
  className
}) => {
  // Type generics like <HTMLCanvasElement> are removed from useRef
  const canvasRef = useRef(null);
  const animationRef = useRef();
  const particlesRef = useRef([]);
  const tickRef = useRef(0);
  const globalAngleRef = useRef(0);
  const globalRotationRef = useRef(0);

  // Type annotations for parameters (: number) and return value (: Particle) are removed
  const createParticle = useCallback((centerX, centerY, tick, minSize) => {
    return {
      radius: 7,
      x: centerX + Math.cos(tick / 20) * minSize / 2,
      y: centerY + Math.sin(tick / 20) * minSize / 2,
      angle: globalRotationRef.current + globalAngleRef.current,
      speed: 0,
      accel: 0.01,
      decay: 0.01,
      life: 1
    };
  }, []);

  // Type annotations for parameters are removed
  const stepParticle = useCallback((particle, index) => {
    particle.speed += particle.accel;
    particle.x += Math.cos(particle.angle) * particle.speed * speed;
    particle.y += Math.sin(particle.angle) * particle.speed * speed;
    particle.angle += Math.PI / 64;
    particle.accel *= 1.01;
    particle.life -= particle.decay;

    if (particle.life <= 0) {
      particlesRef.current.splice(index, 1);
    }
  }, [speed]);

  // Type annotations for parameters are removed
  const drawParticle = useCallback((ctx, particle, index, tick) => {
    const hue = hueRange[0] + ((tick + (particle.life * 120)) % (hueRange[1] - hueRange[0]));
    ctx.fillStyle = ctx.strokeStyle = `hsla(${hue}, 100%, 60%, ${particle.life})`;

    ctx.beginPath();
    if (particlesRef.current[index - 1]) {
      ctx.moveTo(particle.x, particle.y);
      ctx.lineTo(particlesRef.current[index - 1].x, particlesRef.current[index - 1].y);
    }
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(particle.x, particle.y, Math.max(0.001, particle.life * particle.radius), 0, Math.PI * 2);
    ctx.fill();

    const sparkleSize = Math.random() * 1.25;
    const sparkleX = particle.x + ((Math.random() - 0.5) * 35) * particle.life;
    const sparkleY = particle.y + ((Math.random() - 0.5) * 35) * particle.life;
    ctx.fillRect(Math.floor(sparkleX), Math.floor(sparkleY), sparkleSize, sparkleSize);
  }, [hueRange]);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const minSize = Math.min(rect.width, rect.height) * 0.5;

    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push(createParticle(centerX, centerY, tickRef.current, minSize));
    }

    particlesRef.current.forEach((particle, index) => {
      stepParticle(particle, index);
    });

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particlesRef.current.forEach((particle, index) => {
      drawParticle(ctx, particle, index, tickRef.current);
    });

    globalRotationRef.current += Math.PI / 6 * speed;
    globalAngleRef.current += Math.PI / 6 * speed;
    tickRef.current++;

    animationRef.current = requestAnimationFrame(animate);
  }, [createParticle, stepParticle, drawParticle, particleCount, speed]);

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    ctx.scale(dpr, dpr);
    ctx.globalCompositeOperation = 'lighter';

    particlesRef.current = [];
    tickRef.current = 0;
    globalAngleRef.current = 0;
    globalRotationRef.current = 0;
  }, [size]);

  useEffect(() => {
    setupCanvas();
    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [setupCanvas, animate]);

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <canvas
        ref={canvasRef}
        className="max-w-full max-h-full"
        style={{
          width: size,
          height: size
        }}
      />
    </div>
  );
};

export default MagicLoader;