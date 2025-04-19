import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, StopCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface DryingTimerProps {
  duration?: number; // Duration in seconds
  isRunning?: boolean;
  onPause?: () => void;
  onResume?: () => void;
  onStop?: () => void;
  remainingTime?: number; // Remaining time in seconds
}

const DryingTimer: React.FC<DryingTimerProps> = ({
  duration = 3600, // Default 1 hour
  isRunning = false,
  onPause = () => {},
  onResume = () => {},
  onStop = () => {},
  remainingTime = duration,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(remainingTime);
  const [isPaused, setIsPaused] = useState<boolean>(!isRunning);

  // Calculate progress percentage
  const progress = (duration - timeLeft) / duration;
  const circumference = 2 * Math.PI * 70; // Circle radius is 70
  const strokeDashoffset = circumference * (1 - progress);

  // Format time as HH:MM:SS
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isRunning && !isPaused && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, isPaused, timeLeft]);

  // Update timeLeft when remainingTime prop changes
  useEffect(() => {
    setTimeLeft(remainingTime);
  }, [remainingTime]);

  // Update isPaused when isRunning prop changes
  useEffect(() => {
    setIsPaused(!isRunning);
  }, [isRunning]);

  // Determine color based on progress
  const getColor = () => {
    if (progress < 0.33) return "#22c55e"; // Green
    if (progress < 0.66) return "#eab308"; // Yellow
    return "#ef4444"; // Red
  };

  const handlePauseResume = () => {
    if (isPaused) {
      setIsPaused(false);
      onResume();
    } else {
      setIsPaused(true);
      onPause();
    }
  };

  const handleStop = () => {
    setIsPaused(true);
    onStop();
  };

  return (
    <Card className="bg-background p-6 flex flex-col items-center justify-center w-full max-w-[200px] h-[200px] rounded-xl shadow-md">
      <div className="relative flex items-center justify-center w-32 h-32">
        {/* Background circle */}
        <svg
          width="160"
          height="160"
          viewBox="0 0 160 160"
          className="absolute"
        >
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="8"
          />
        </svg>

        {/* Progress circle */}
        <svg
          width="160"
          height="160"
          viewBox="0 0 160 160"
          className="absolute transform -rotate-90"
        >
          <motion.circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke={getColor()}
            strokeWidth="8"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            strokeLinecap="round"
          />
        </svg>

        {/* Time display */}
        <div className="text-center">
          <motion.div
            className="text-xl font-bold"
            initial={{ scale: 1 }}
            animate={{
              scale: [1, 1.05, 1],
              opacity: isPaused ? 0.7 : 1,
            }}
            transition={{ duration: 1, repeat: isPaused ? 0 : Infinity }}
          >
            {formatTime(timeLeft)}
          </motion.div>
          <div className="text-xs text-muted-foreground mt-1">
            {isPaused ? "Paused" : "Remaining"}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2 mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePauseResume}
          className="h-8 w-8 p-0"
        >
          {isPaused ? <Play size={16} /> : <Pause size={16} />}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleStop}
          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
        >
          <StopCircle size={16} />
        </Button>
      </div>
    </Card>
  );
};

export default DryingTimer;
