import { motion } from 'framer-motion';

export default function Tabs({ tabs, activeTab, onChange, className = '' }) {
  return (
    <div className={`flex gap-1 p-1 bg-dark-100 dark:bg-dark-800 rounded-xl ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === tab.id
              ? 'text-white'
              : 'text-dark-600 dark:text-dark-400 hover:text-dark-900 dark:hover:text-dark-200'
          }`}
        >
          {activeTab === tab.id && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-primary-500 rounded-lg"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
          <span className="relative z-10">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
