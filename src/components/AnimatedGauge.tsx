import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface AnimatedGaugeProps {
  value: number;
  min?: number;
  max?: number;
  type?: "temperature" | "humidity";
  size?: number;
  animated?: boolean;
  showValue?: boolean;
  label?: string;
}

const AnimatedGauge = ({
  value = 50,
  min = 0,
  max = 100,
  type = "temperature",
  size = 300,
  animated = true,
  showValue = true,
  label,
}: AnimatedGaugeProps) => {
  const [displayValue, setDisplayValue] = useState(value);

  // Update display value with animation
  useEffect(() => {
    if (animated) {
      // Animate to the new value
      const timer = setTimeout(() => {
        setDisplayValue(value);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setDisplayValue(value);
    }
  }, [value, animated]);

  // Calculate angle based on value
  const calculateRotation = () => {
    const percentage = ((displayValue - min) / (max - min)) * 100;
    const clampedPercentage = Math.min(Math.max(percentage, 0), 100);
    // Convert percentage to angle (0% = -120deg, 100% = 120deg)
    return -120 + (clampedPercentage * 240) / 100;
  };

  // Get color based on value and type
  const getColor = () => {
    if (type === "temperature") {
      if (displayValue < 20) return "#3b82f6"; // Blue for cold
      if (displayValue < 30) return "#10b981"; // Green for normal
      if (displayValue < 40) return "#f59e0b"; // Yellow for warm
      return "#ef4444"; // Red for hot
    } else {
      // Humidity
      if (displayValue < 30) return "#ef4444"; // Red for dry
      if (displayValue < 60) return "#10b981"; // Green for normal
      return "#3b82f6"; // Blue for humid
    }
  };

  // Get unit based on type
  const getUnit = () => {
    return type === "temperature" ? "°C" : "%";
  };

  // Calculate dimensions
  const center = size / 2;
  const strokeWidth = size / 20;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const arcLength = (240 / 360) * circumference; // 240 degrees of the circle

  // Calculate dash offset for the progress arc
  const progressPercentage = ((displayValue - min) / (max - min)) * 100;
  const clampedProgressPercentage = Math.min(
    Math.max(progressPercentage, 0),
    100,
  );
  const dashOffset = arcLength - (clampedProgressPercentage / 100) * arcLength;

  return (
    <div
      className="flex flex-col items-center justify-center bg-background"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Background track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          strokeDasharray={arcLength}
          strokeDashoffset={0}
          strokeLinecap="round"
          style={{ transform: "rotate(150deg)", transformOrigin: "center" }}
        />

        {/* Progress arc */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeDasharray={arcLength}
          initial={{ strokeDashoffset: arcLength }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: animated ? 0.8 : 0, ease: "easeOut" }}
          strokeLinecap="round"
          style={{ transform: "rotate(150deg)", transformOrigin: "center" }}
        />

        {/* Tick marks */}
        {Array.from({ length: 11 }).map((_, i) => {
          const tickPercentage = i * 10;
          const tickAngle = -120 + (tickPercentage * 240) / 100;
          const tickLength =
            i % 5 === 0 ? strokeWidth * 1.5 : strokeWidth * 0.8;
          const innerRadius = radius - strokeWidth / 2 - tickLength;
          const outerRadius = radius - strokeWidth / 2;

          const x1 =
            center + innerRadius * Math.cos((tickAngle * Math.PI) / 180);
          const y1 =
            center + innerRadius * Math.sin((tickAngle * Math.PI) / 180);
          const x2 =
            center + outerRadius * Math.cos((tickAngle * Math.PI) / 180);
          const y2 =
            center + outerRadius * Math.sin((tickAngle * Math.PI) / 180);

          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#9ca3af"
              strokeWidth={i % 5 === 0 ? 2 : 1}
              transform={`rotate(90, ${center}, ${center})`}
            />
          );
        })}
      </svg>

      {/* Needle */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: size,
          height: size,
          transform: `rotate(${calculateRotation()}deg)`,
          transition: animated ? "transform 0.8s ease-out" : "none",
        }}
      >
        <div
          className="absolute bg-gray-800 rounded-full"
          style={{
            width: strokeWidth / 2,
            height: radius * 0.8,
            left: `calc(50% - ${strokeWidth / 4}px)`,
            bottom: "50%",
            transformOrigin: "bottom center",
          }}
        />
        <div
          className="absolute bg-gray-800 rounded-full"
          style={{
            width: strokeWidth * 1.5,
            height: strokeWidth * 1.5,
            left: `calc(50% - ${strokeWidth * 0.75}px)`,
            top: `calc(50% - ${strokeWidth * 0.75}px)`,
          }}
        />
      </div>

      {/* Value display */}
      {showValue && (
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-3xl font-bold" style={{ color: getColor() }}>
            {Math.round(displayValue)}
            {getUnit()}
          </span>
          {label && <span className="text-sm text-gray-500 mt-1">{label}</span>}
        </div>
      )}
    </div>
  );
};

export default AnimatedGauge;
