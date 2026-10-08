import { FiStar } from 'react-icons/fi';

export default function Rating({ value = 0, count, size = 'sm', showCount = true }) {
  const sizes = { sm: 'text-sm', md: 'text-base', lg: 'text-lg' };

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <FiStar
            key={star}
            className={`${sizes[size]} ${star <= Math.round(value) ? 'text-accent-500 fill-accent-500' : 'text-dark-300 dark:text-dark-600'}`}
          />
        ))}
      </div>
      {value > 0 && (
        <span className="text-sm font-medium text-dark-600 dark:text-dark-400">
          {value.toFixed(1)}
        </span>
      )}
      {showCount && count !== undefined && (
        <span className="text-sm text-dark-400 dark:text-dark-500">
          ({count.toLocaleString()})
        </span>
      )}
    </div>
  );
}
