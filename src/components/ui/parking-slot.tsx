import { motion } from "framer-motion";
import { Car } from "lucide-react";

interface ParkingSlotProps {
  isOccupied?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showCar?: boolean;
  carAnimationDelay?: number;
}

export function ParkingSlot({ 
  isOccupied = false, 
  size = 'md',
  className = '',
  showCar = true,
  carAnimationDelay = 0
}: ParkingSlotProps) {
  const sizeClasses = {
    sm: 'w-16 h-10',
    md: 'w-20 h-12',
    lg: 'w-24 h-16',
  };

  const carSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  return (
    <div className={`relative ${className}`}>
      <div 
        className={`${sizeClasses[size]} border-2 rounded-md flex items-center justify-center overflow-hidden ${
          isOccupied 
            ? 'bg-destructive/10 border-destructive/30' 
            : 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800/50'
        }`}
      >
        {showCar && !isOccupied && (
          <motion.div
            className="absolute"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ 
              delay: 0.5 + (carAnimationDelay * 0.2),
              type: 'spring',
              stiffness: 100,
              damping: 10
            }}
          >
            <Car 
              size={carSizes[size]} 
              className={isOccupied ? 'text-destructive/50' : 'text-green-600 dark:text-green-400'} 
            />
          </motion.div>
        )}
        {isOccupied && (
          <div className="w-full h-full bg-destructive/5 flex items-center justify-center">
            <Car 
              size={carSizes[size] - 8} 
              className="text-destructive/50" 
            />
          </div>
        )}
      </div>
      {!isOccupied && (
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ 
            delay: 1 + (carAnimationDelay * 0.2),
            duration: 1.5, 
            repeat: Infinity, 
            ease: 'easeInOut' 
          }}
          style={{ transform: 'skewX(-20deg)' }}
        />
      )}
    </div>
  );
}

export function ParkingLotGrid({ slots = 6, occupied = 2, className = '' }) {
  return (
    <div className={`grid grid-cols-3 gap-3 ${className}`}>
      {Array.from({ length: slots }).map((_, index) => (
        <ParkingSlot 
          key={index} 
          isOccupied={index < occupied}
          carAnimationDelay={index}
          size="md"
        />
      ))}
    </div>
  );
}
