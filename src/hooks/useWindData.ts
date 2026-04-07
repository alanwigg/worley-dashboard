"use client";
import { useState, useEffect } from 'react';

const BASE_MW = 8.5; // Changed to match reference scale "8.5 MW / MAX 10 MW"

type DataPoint = { time: string; efficiency: number };

export function useWindData() {
  const [targetMW, setTargetMW] = useState(BASE_MW);
  const [history, setHistory] = useState<DataPoint[]>([]);
  const [realWindSpeed, setRealWindSpeed] = useState(24);
  const [aestTime, setAestTime] = useState("");

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
    let timeStep = 0;
    let lastHistoryUpdate = Date.now();

    const interval = setInterval(() => {
      // 1. Process literal Australian Time
      const options: Intl.DateTimeFormatOptions = { 
        timeZone: 'Australia/Sydney', 
        hour: 'numeric', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: false 
      };
      const sydneyTime = new Date().toLocaleTimeString('en-US', options);
      setAestTime(sydneyTime);

      // 2. Nocturnal Low-Level Jet Model
      // Australian offshore wind generally hits extreme peaks in the dead of night (2 AM) 
      // and troughs slightly during the mid-afternoon (2 PM) due to thermal ocean inversion
      // Base metric derived from constant offshore flow plus randomized micro-variances
      const baseMW = 7.5; // Dropped base payload so it naturally averages in the 7s and 8s
      const now = Date.now();
      const sineWave = Math.sin(now / 3000) * 1.5; // Deeper breathing waveform pushing +/- 1.5 MW
      
      // Calculate a diurnal curve to map the AEST clock into a Nocturnal Low-Level Jet phenomenon
      const hour = new Date().toLocaleTimeString('en-US', { timeZone: 'Australia/Sydney', hour: 'numeric', hour12: false });
      const currentHour = parseInt(hour, 10);
      
      // Higher wind pressure between 10PM and 4AM
      const isNight = currentHour >= 22 || currentHour <= 4;
      const timeOfDay = isNight ? (currentHour >= 22 ? currentHour - 22 : currentHour + 2) / 6 : 0;
      
      // Scale it up slightly at night to hit the high 9s, but let it fall back naturally
      const diurnalCurve = isNight ? Math.sin(timeOfDay * Math.PI) * 0.8 : 0;
      
      const noise = (Math.random() - 0.5) * 0.1; // slightly wider micro stutter
      let newMW = baseMW + sineWave + diurnalCurve + noise;
      
      // Hard clamp MW output so it never touches 10.0, but allow it to fall cleanly to 4.0
      newMW = Math.max(4.0, Math.min(9.95, newMW)); 

      setTargetMW(newMW);

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

  return { targetMW, history, realWindSpeed, aestTime };
}
