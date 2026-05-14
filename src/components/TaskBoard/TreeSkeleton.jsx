import { motion } from 'framer-motion';

const TreeSkeleton = ({ completionProgress = 0 }) => {
  // Define positions along the branches where leaves can sprout
  const MAX_LEAVES = 12;
  const activeLeafCount = Math.floor(completionProgress * MAX_LEAVES);

  const leafPositions = [
    { x: 30, y: 40, rotate: -45 },
    { x: 65, y: 35, rotate: 45 },
    { x: 20, y: 55, rotate: -60 },
    { x: 80, y: 50, rotate: 60 },
    { x: 45, y: 25, rotate: -20 },
    { x: 55, y: 20, rotate: 20 },
    { x: 25, y: 30, rotate: -50 },
    { x: 75, y: 25, rotate: 50 },
    { x: 35, y: 50, rotate: -30 },
    { x: 60, y: 45, rotate: 30 },
    { x: 15, y: 45, rotate: -70 },
    { x: 85, y: 40, rotate: 70 }
  ];

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Dry Tree Skeleton SVG */}
      <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible z-0">
        <path 
          d="M50,90 Q45,60 50,30 M50,70 Q30,55 20,45 M50,65 Q70,55 80,45 M35,48 Q30,35 25,30 M65,48 Q70,35 75,30 M50,45 Q40,30 45,20 M50,40 Q60,30 55,20" 
          stroke="rgba(103, 232, 249, 0.4)" // Dry, muted cyan look
          strokeWidth="3" 
          fill="none" 
          strokeLinecap="round"
          className="drop-shadow-[0_0_5px_rgba(103,232,249,0.2)]"
        />
      </svg>

      {/* Sprouting Leaves */}
      {leafPositions.map((pos, index) => {
        const isSprouted = index < activeLeafCount;
        if (!isSprouted) return null;

        return (
          <motion.div
            key={index}
            className="absolute z-10 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transformOrigin: 'bottom center',
              marginLeft: '-8px',
              marginTop: '-8px'
            }}
            initial={{ scale: 0 }}
            animate={{ 
              scale: [0, 1.2, 1],
              rotate: [pos.rotate, pos.rotate + 10, pos.rotate - 10, pos.rotate]
            }}
            transition={{
              scale: { type: "spring", bounce: 0.5, duration: 0.8 },
              rotate: { duration: 4 + (index % 3), repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" />
              <path d="M12 4C12 4 8 8 8 12C8 16 12 20 12 20C12 20 16 16 16 12C16 8 12 4 12 4Z" />
            </svg>
          </motion.div>
        );
      })}
    </div>
  );
};

export default TreeSkeleton;
