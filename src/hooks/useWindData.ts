"use client";
import { useState, useEffect } from 'react';

const BASE_MW = 8.5; // Changed to match reference scale "8.5 MW / MAX 10 MW"

type DataPoint = { time: string; efficiency: number };

export function useWindData() {
  const [targetMW, setTargetMW] = useState(BASE_MW);
  const [history, setHistory] = useState<DataPoint[]>([]);
  const [realWindSpeed, setRealWindSpeed] = useState(24);

  // Fetch real telemetry (Open-Meteo current wind speed for major Australian coastal windfarm coordinates)
  useEffect(() => {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=-39.9&longitude=143.9&current_weather=true')
      .then(res => res.json())
      .then(data => {
        if (data?.current_weather?.windspeed) {
          setRealWindSpeed(data.current_weather.windspeed);
        }
      })
      .catch(console.error);
  }, []);

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
    let lastHistoryUpdate = Date.now();

    const interval = setInterval(() => {
      // micro-steps for extreme fluidity (10 frames a second)
      timeStep += 0.04;
      const noise = (Math.random() - 0.5) * 0.15;
      const sineWave = Math.sin(timeStep) * 0.6;
      
      const newMW = BASE_MW + sineWave + noise;
      tickMW = Math.max(0, newMW); 

      setTargetMW(tickMW);

      const now = Date.now();
      // Only commit payload memory to the history chart every 3 seconds to avoid visual lightspeed
      if (now - lastHistoryUpdate >= 3000) {
        lastHistoryUpdate = now;
        setHistory(prev => {
          const hnoise = (Math.random() - 0.5) * 5.0; 
          const wave = Math.sin(timeStep * 3) * 6; 
          
          const eff = Math.min(100, Math.max(0, 85 + wave + hnoise + (sineWave * 5)));
          const ineff = Math.min(100, Math.max(0, Math.random() * 8 + (20 - (eff / 5))));

          const next = [...prev, {
            time: new Date().toLocaleTimeString('en-US', { hour12: false, minute: '2-digit', second: '2-digit' }),
            efficiency: eff,
            inefficiency: ineff
          }];
          return next.slice(-6); 
        });
      }

    }, 100);

    return () => clearInterval(interval);
  }, []);

  return { targetMW, history, realWindSpeed };
}
