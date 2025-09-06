'use client';

import { useState, useEffect } from 'react';

interface WelcomeBannerProps {
  name: string;
}

export function WelcomeBanner({ name }: WelcomeBannerProps) {
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentDate(now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }));
      setCurrentTime(now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }));
    };

    updateDateTime();
    const intervalId = setInterval(updateDateTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="rounded-lg bg-gradient-to-r from-green-500 to-lime-400 p-6 text-white shadow-lg">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {name}!</h1>
          <p className="mt-1 text-lg">{currentDate}</p>
        </div>
        <div className="text-right">
          <p className="text-4xl font-mono font-bold tracking-wider">{currentTime}</p>
          <p className="text-sm">Current Time</p>
        </div>
      </div>
    </div>
  );
}
