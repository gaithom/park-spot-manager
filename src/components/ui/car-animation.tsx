import { motion } from "framer-motion";
import { Car } from "lucide-react";

interface CarAnimationProps {
  size?: number;
  color?: string;
  className?: string;
  duration?: number;
  delay?: number;
}

export function CarAnimation({
  size = 24,
  color = "currentColor",
  className = "",
  duration = 3,
  delay = 0,
}: CarAnimationProps) {
  return (
    <motion.div
      className={`inline-flex ${className}`}
      animate={{
        x: [0, 20, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
        delay,
      }}
    >
      <Car size={size} color={color} className="relative z-10" />
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        style={{
          transform: 'skewX(-20deg)',
          width: '200%',
          left: '-50%',
        }}
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: duration * 1.5,
          repeat: Infinity,
          ease: 'linear',
          delay,
        }}
      />
    </motion.div>
  );
}
