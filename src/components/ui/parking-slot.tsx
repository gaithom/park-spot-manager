import { motion, AnimatePresence } from "framer-motion";
import { Car, ParkingMeter, ParkingSquare, CarFront } from "lucide-react";

interface ParkingSlotProps {
  isOccupied?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showCar?: boolean;
  carAnimationDelay?: number;
}

import type { Variants } from 'framer-motion';

const carVariants: Variants = {
  initial: { y: -20, opacity: 0 },
  animate: (custom: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: custom * 0.1,
      type: 'spring' as const,
      stiffness: 100,
      damping: 10
    }
  }),
  hover: {
    y: -5,
    transition: { type: 'spring' as const, stiffness: 400, damping: 10 }
  }
};

export function ParkingSlot({ 
  isOccupied = false, 
  size = 'md',
  className = '',
  showCar = true,
  carAnimationDelay = 0
}: ParkingSlotProps) {
  const sizeClasses = {
    sm: 'w-16 h-10',
    md: 'w-20 h-14',
    lg: 'w-24 h-18',
  };

  const carSizes = {
    sm: 16,
    md: 22,
    lg: 28,
  };

  return (
    <motion.div 
      className={`relative ${className}`}
      variants={carVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      custom={carAnimationDelay}
    >
      <div 
        className={`${sizeClasses[size]} border-2 rounded-md flex items-center justify-center overflow-hidden ${
          isOccupied 
            ? 'bg-destructive/5 border-destructive/20' 
            : 'bg-green-50/80 border-green-200 dark:bg-green-900/10 dark:border-green-800/30'
        } transition-colors duration-300`}
      >
        {isOccupied ? (
          <motion.div 
            className="relative w-full h-full flex items-center justify-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              transition: { 
                delay: 0.2 + (carAnimationDelay * 0.1),
                type: 'spring',
                stiffness: 100,
                damping: 10
              }
            }}
          >
            <CarFront 
              size={carSizes[size] - 4} 
              className="text-destructive/80 absolute"
            />
            <motion.div 
              className="absolute inset-0 bg-destructive/5"
              animate={{
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            />
          </motion.div>
        ) : (
          <motion.div
            className="flex flex-col items-center justify-center"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              transition: { 
                delay: 0.5 + (carAnimationDelay * 0.1),
                type: 'spring',
                stiffness: 100,
                damping: 10
              }
            }}
          >
            <ParkingSquare 
              size={carSizes[size] - 8} 
              className="text-green-600/50 dark:text-green-400/50"
            />
            <span className="text-[8px] mt-1 text-green-600/60 dark:text-green-400/60">
              AVAILABLE
            </span>
          </motion.div>
        )}
      </div>
      
      {!isOccupied && (
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ 
            delay: 1 + (carAnimationDelay * 0.1),
            duration: 1.5, 
            repeat: Infinity, 
            ease: 'easeInOut' 
          }}
          style={{ transform: 'skewX(-20deg)' }}
        />
      )}
    </motion.div>
  );
}

interface ParkingLotGridProps {
  slots?: number;
  occupied?: number;
  className?: string;
  title?: string;
  showTitle?: boolean;
}

export function ParkingLotGrid({ 
  slots = 6, 
  occupied = 2, 
  className = '',
  title = 'Parking Lot',
  showTitle = true
}: ParkingLotGridProps) {
  const totalSlots = Math.max(slots, 1);
  const occupiedSlots = Math.min(occupied, totalSlots);
  
  return (
    <div className={`space-y-4 ${className}`}>
      {showTitle && (
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-foreground/80">{title}</h3>
          <div className="text-xs text-muted-foreground">
            <span className="text-green-600 dark:text-green-400">{totalSlots - occupiedSlots} available</span>
            <span className="mx-1">•</span>
            <span className="text-destructive/80">{occupiedSlots} occupied</span>
          </div>
        </div>
      )}
      
      <AnimatePresence>
        <motion.div 
          className="grid grid-cols-3 gap-3"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
              }
            }
          }}
        >
          {Array.from({ length: totalSlots }).map((_, index) => (
            <ParkingSlot 
              key={index}
              isOccupied={index < occupiedSlots}
              carAnimationDelay={index}
              size="md"
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
