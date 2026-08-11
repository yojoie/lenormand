import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

import './DecayCard.css';

// Images are served from public/images/ for parallel preloading.
// This avoids the sequential chain: main bundle → DecayCard chunk → image fetch.
// Instead, images load in parallel with JS chunks via <link rel="preload"> in index.html.
const cardImages = {
  'fortune-hand-1': '/images/fortune-hand-1.webp',
  'fortune-hand-2': '/images/fortune-hand-2.webp',
  'fortune-hand-3': '/images/fortune-hand-3.webp',
};

const DecayCard = ({
  width = 300,
  height = 400,
  image = 'fortune-hand-1',
  baseFrequency = 0.015,
  numOctaves = 5,
  seed = 4,
  maxDisplacement = 400,
  movementBound = 50,
  onClick,
  filterId = 'imgFilter',
  children
}) => {
  const svgRef = useRef(null);
  const displacementMapRef = useRef(null);
  const cursor = useRef({
    x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0,
    y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0
  });
  const cachedCursor = useRef({ ...cursor.current });
  const winsize = useRef({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });

  useEffect(() => {
    const lerp = (a, b, n) => (1 - n) * a + n * b;

    const map = (x, a, b, c, d) => ((x - a) * (d - c)) / (b - a) + c;

    const distance = (x1, x2, y1, y2) => {
      const a = x1 - x2;
      const b = y1 - y2;
      return Math.hypot(a, b);
    };

    const handleResize = () => {
      winsize.current = { width: window.innerWidth, height: window.innerHeight };
    };

    const handleMouseMove = ev => {
      cursor.current = { x: ev.clientX, y: ev.clientY };
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const imgValues = {
      imgTransforms: { x: 0, y: 0, rz: 0 },
      displacementScale: 50
    };

    let visible = true;
    let rafId = null;

    const render = () => {
      let targetX = lerp(imgValues.imgTransforms.x, map(cursor.current.x, 0, winsize.current.width, -120, 120), 0.1);
      let targetY = lerp(imgValues.imgTransforms.y, map(cursor.current.y, 0, winsize.current.height, -120, 120), 0.1);
      let targetRz = lerp(imgValues.imgTransforms.rz, map(cursor.current.x, 0, winsize.current.width, -10, 10), 0.1);

      if (targetX > movementBound) targetX = movementBound + (targetX - movementBound) * 0.2;
      if (targetX < -movementBound) targetX = -movementBound + (targetX + movementBound) * 0.2;
      if (targetY > movementBound) targetY = movementBound + (targetY - movementBound) * 0.2;
      if (targetY < -movementBound) targetY = -movementBound + (targetY + movementBound) * 0.2;

      imgValues.imgTransforms.x = targetX;
      imgValues.imgTransforms.y = targetY;
      imgValues.imgTransforms.rz = targetRz;

      if (svgRef.current) {
        gsap.set(svgRef.current, {
          x: imgValues.imgTransforms.x,
          y: imgValues.imgTransforms.y,
          rotateZ: imgValues.imgTransforms.rz
        });
      }

      const cursorTravelledDistance = distance(
        cachedCursor.current.x,
        cursor.current.x,
        cachedCursor.current.y,
        cursor.current.y
      );
      imgValues.displacementScale = lerp(
        imgValues.displacementScale,
        map(cursorTravelledDistance, 0, 200, 50, maxDisplacement),
        0.06
      );

      if (displacementMapRef.current) {
        gsap.set(displacementMapRef.current, { attr: { scale: imgValues.displacementScale } });
      }

      cachedCursor.current = { ...cursor.current };

      if (visible) {
        rafId = requestAnimationFrame(render);
      } else {
        rafId = null;
      }
    };

    const start = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(render);
      }
    };

    const stop = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      },
      { threshold: 0 }
    );
    if (svgRef.current) io.observe(svgRef.current);

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      io.disconnect();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [maxDisplacement, movementBound]);

  const edgeScale = Math.round(Math.min(width, height) * 0.15);
  const cornerRadius = Math.round(Math.min(width, height) * 0.2);
  const edgeFilterId = `${filterId}-edge-filter`;
  const edgeMaskId = `${filterId}-edge-mask`;

  return (
    <>
      <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden="true">
        <defs>
          <filter id={edgeFilterId} x="-25%" y="-25%" width="150%" height="150%">
            <feTurbulence type="fractalNoise" baseFrequency="0.025" numOctaves="3" seed={seed} result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale={edgeScale} xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <mask id={edgeMaskId} maskUnits="userSpaceOnUse" x="0" y="0" width={width} height={height}>
            <rect width={width} height={height} rx={cornerRadius} ry={cornerRadius} fill="white" filter={`url(#${edgeFilterId})`} />
          </mask>
        </defs>
      </svg>
      <div
        className="decay-card content"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          WebkitMaskImage: `url(#${edgeMaskId})`,
          maskImage: `url(#${edgeMaskId})`,
        }}
        ref={svgRef}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
    >
      <svg viewBox="0 0 600 750" preserveAspectRatio="xMidYMid slice" className="svg">
        <filter id={filterId} x="-25%" y="-25%" width="150%" height="150%">
          <feTurbulence
            type="turbulence"
            baseFrequency={baseFrequency}
            numOctaves={numOctaves}
            seed={seed}
            stitchTiles="stitch"
            result="turbulence1"
          />
          <feDisplacementMap
            ref={displacementMapRef}
            in="SourceGraphic"
            in2="turbulence1"
            scale="50"
            xChannelSelector="R"
            yChannelSelector="B"
            result="displacementMap3"
          />
        </filter>
        <g>
          <image
            href={cardImages[image] || image}
            x="0"
            y="0"
            width="600"
            height="750"
            filter={`url(#${filterId})`}
            preserveAspectRatio="xMidYMid slice"
          />
        </g>
      </svg>
      <div className="decay-card__watermark-mask" aria-hidden="true" />
      <div className="card-text">{children}</div>
      </div>
    </>
  );
};

export default DecayCard;
