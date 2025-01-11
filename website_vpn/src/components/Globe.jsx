// src/components/Globe.jsx

import React, { useCallback, useEffect, useRef, useState } from "react";
import createGlobe from "cobe";


const GLOBE_CONFIG = {
  width: 300,
  height: 300,
  onRender: () => { },
  devicePixelRatio: window.devicePixelRatio || 2,
  phi: 0,
  theta: 0.3,
  dark: 0.1,
  diffuse: 1,
  opacity: 0.8,
  mapSamples: 25000,
  mapBrightness: 2,
  mapBaseBrightness: 0.1,
  baseColor: [0.9, 0.9, 0.9],
  markerColor: [255 / 255, 0 / 255, 0 / 255],
  glowColor: [0.9, 0.9, 0.9],
  markers: [
    { location: [40.4172, -3.684], size: 0.1 }, // Espagne (Madrid)
    { location: [37.751, -97.822], size: 0.1 }, // États-Unis (San Francisco)
  ]
};

export function Globe({ className, config = GLOBE_CONFIG }) {
  const canvasRef = useRef(null);
  const [r, setR] = useState(0);
  const pointerInteracting = useRef(null);
  const pointerInteractionMovement = useRef(0);
  let phi = 0;
  let width = 0;
  

  const updatePointerInteraction = (value) => {
    pointerInteracting.current = value;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value ? "grabbing" : "grab";
    }
  };

  const updateMovement = (clientX) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current;
      pointerInteractionMovement.current = delta;
      setR(delta / 200);
    }
  };

  const onRender = useCallback((state) => {
    if (!pointerInteracting.current) phi += 0.005;
    state.phi = phi + r;
    state.width = width;
    state.height = width;
  }, [r]);

  const onResize = () => {
    if (canvasRef.current) {
      width = canvasRef.current.offsetWidth;
    }
  };

  useEffect(() => {
    window.addEventListener("resize", onResize);
    onResize();

    const globe = createGlobe(canvasRef.current, {
      ...config,
      width: width,
      height: width,
      onRender,
    });

    setTimeout(() => (canvasRef.current.style.opacity = "1"));
    return () => globe.destroy();
  }, []);

  return (
    <div className={className}>
      <canvas ref={canvasRef} className="opacity-0 transition-opacity duration-500" />
    </div>
  );
  
}
