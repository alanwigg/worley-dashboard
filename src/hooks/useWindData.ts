"use client";
import { useState, useEffect } from 'react';

const BASE_MW = 8.5; // Changed to match reference scale "8.5 MW / MAX 10 MW"

type DataPoint = { time: string; efficiency: number };

export function useWindData() {
  const [targetMW, setTargetMW] = useState(BASE_MW);
  const [history, setHistory] = useState<DataPoint[]>([]);

  // Initialize history
  useEffect(() => {
    const initial = Array.from({ length: 6 }).map((_, i) => ({
      time: `T-${6 - i}`,
      efficiency: 85 + Math.random() * 10
    }));
    setHistory(initial);
  }, []);

  useEffect(() => {
    let tickMW = BASE_MW;
    let timeStep = 0;

    const interval = setInterval(() => {
      // Create a smooth pseudo-sine wave random walk
      timeStep += 0.2;
      const noise = (Math.random() - 0.5) * 0.4;
      const sineWave = Math.sin(timeStep) * 0.6;
      
      const newMW = BASE_MW + sineWave + noise;
      tickMW = Math.max(0, newMW); 

      setTargetMW(tickMW);

      // Add to history
      setHistory(prev => {
        const next = [...prev, {
          time: new Date().toLocaleTimeString('en-US', { hour12: false, minute: '2-digit', second: '2-digit' }),
          efficiency: Math.min(100, Math.max(0, 80 + (tickMW / 10) * 15 + (Math.random() - 0.5)))
        }];
        return next.slice(-6); 
      });

    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return { targetMW, history };
}
