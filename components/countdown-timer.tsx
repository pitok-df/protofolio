"use client";

import { useEffect, useState } from 'react';
import Counter from './Counter';

interface CountdownTimerProps {
  targetDate: Date;
}

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      setTimeLeft({

        days: distance < 0 ? 0 : Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: distance < 0 ? 0 : Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: distance < 0 ? 0 : Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: distance < 0 ? 0 : Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex gap-4 justify-center">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="text-center">
          <div className="w-16 h-16 flex items-center justify-center bg-primary/10 rounded-lg">
            {/* <span className="text-2xl font-bold">{value}</span> */}
            <Counter
              value={value}
              fontSize={24}
              places={unit == `days` ? [100, 10, 1] : [10, 1]}
              digitStyle={{ fontSize: '1.5rem', color: 'white' }}
              gradientHeight={16}
              gradientFrom="#4F46E5"
              gradientTo="#3B82F6"
              topGradientStyle={{ background: 'linear-gradient(to top, #4F46E5, #3B82F6)' }}
              bottomGradientStyle={{ background: 'linear-gradient(to bottom, #4F46E5, #3B82F6)' }}
              containerStyle={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              counterStyle={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              horizontalPadding={0}
              gap={1}
            />
          </div>
          <span className="text-sm text-muted-foreground mt-1 capitalize">{unit}</span>
        </div>
      ))}
    </div>
  );
}