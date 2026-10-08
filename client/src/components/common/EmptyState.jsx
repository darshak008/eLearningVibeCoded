import { motion } from 'framer-motion';

export default function EmptyState({ icon, title, description, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      {icon && (
        <div className="text-6xl mb-6 text-dark-300 dark:text-dark-600">{icon}</div>
      )}
      <h3 className="text-xl font-semibold text-dark-700 dark:text-dark-200 mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-dark-500 dark:text-dark-400 max-w-md mb-6">
          {description}
        </p>
      )}
      {action}
    </motion.div>
  );
}
