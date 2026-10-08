import { motion } from 'framer-motion';
import { FiCode, FiMonitor, FiBook, FiGlobe, FiCpu, FiTrendingUp } from 'react-icons/fi';

const icons = [FiCode, FiMonitor, FiBook, FiGlobe, FiCpu, FiTrendingUp];
const colors = ['text-blue-400', 'text-purple-400', 'text-emerald-400', 'text-amber-400', 'text-rose-400', 'text-cyan-400'];

export default function FloatingElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {icons.map((Icon, i) => (
        <motion.div
          key={i}
          className={`absolute ${colors[i]}`}
          style={{
            left: `${15 + i * 14}%`,
            top: `${10 + (i % 3) * 30}%`,
          }}
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.3,
          }}
        >
          <Icon className="text-3xl md:text-4xl opacity-20" />
        </motion.div>
      ))}
    </div>
  );
}
