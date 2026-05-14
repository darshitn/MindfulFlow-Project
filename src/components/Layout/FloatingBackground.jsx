import { motion } from 'framer-motion';

const FloatingBackground = ({ mode, theme }) => {
  const isWork = mode === 'work';
  const isSpace = theme === 'deep-space';

  // Define colors based on theme and mode for a dynamic floating feel
  let blob1Color, blob2Color, blob3Color;

  if (isSpace) {
    blob1Color = isWork ? 'rgba(59, 130, 246, 0.2)' : 'rgba(16, 185, 129, 0.2)'; // Blue vs Green
    blob2Color = isWork ? 'rgba(139, 92, 246, 0.2)' : 'rgba(52, 211, 153, 0.2)'; // Purple vs Light Green
    blob3Color = isWork ? 'rgba(37, 99, 235, 0.15)' : 'rgba(4, 120, 87, 0.15)'; // Darker Blue vs Darker Green
  } else {
    // Serene Forest theme
    blob1Color = isWork ? 'rgba(16, 185, 129, 0.2)' : 'rgba(20, 184, 166, 0.2)'; // Emerald vs Teal
    blob2Color = isWork ? 'rgba(52, 211, 153, 0.2)' : 'rgba(45, 212, 191, 0.2)'; // Light Emerald vs Light Teal
    blob3Color = isWork ? 'rgba(4, 120, 87, 0.15)' : 'rgba(15, 118, 110, 0.15)'; // Dark Green vs Dark Teal
  }

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
      <motion.div
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -100, 50, 0],
          scale: [1, 1.2, 0.9, 1],
          backgroundColor: blob1Color
        }}
        transition={{
          x: { duration: 20, repeat: Infinity, ease: "linear" },
          y: { duration: 20, repeat: Infinity, ease: "linear" },
          scale: { duration: 20, repeat: Infinity, ease: "linear" },
          backgroundColor: { duration: 2, ease: "easeInOut" }
        }}
        className="absolute top-[10%] left-[20%] w-[40vw] h-[40vw] rounded-full blur-[100px] mix-blend-screen"
      />
      <motion.div
        animate={{
          x: [0, -120, 80, 0],
          y: [0, 80, -100, 0],
          scale: [1, 1.1, 1.3, 1],
          backgroundColor: blob2Color
        }}
        transition={{
          x: { duration: 25, repeat: Infinity, ease: "linear" },
          y: { duration: 25, repeat: Infinity, ease: "linear" },
          scale: { duration: 25, repeat: Infinity, ease: "linear" },
          backgroundColor: { duration: 2, ease: "easeInOut" }
        }}
        className="absolute bottom-[20%] right-[10%] w-[50vw] h-[50vw] rounded-full blur-[120px] mix-blend-screen"
      />
      <motion.div
        animate={{
          x: [0, 150, -100, 0],
          y: [0, 100, -150, 0],
          scale: [1, 1.4, 0.8, 1],
          backgroundColor: blob3Color
        }}
        transition={{
          x: { duration: 30, repeat: Infinity, ease: "linear" },
          y: { duration: 30, repeat: Infinity, ease: "linear" },
          scale: { duration: 30, repeat: Infinity, ease: "linear" },
          backgroundColor: { duration: 2, ease: "easeInOut" }
        }}
        className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] rounded-full blur-[150px] mix-blend-screen"
      />
    </div>
  );
};

export default FloatingBackground;
