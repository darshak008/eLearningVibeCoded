import { useState } from 'react';
import { FiStar } from 'react-icons/fi';
import EmptyState from '../../components/common/EmptyState';

export default function InstructorReviews() {
  const [reviews, setReviews] = useState([]);

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-dark-900 dark:text-white mb-6">Reviews</h1>
        {reviews.length === 0 ? (
          <EmptyState icon={<FiStar />} title="No reviews yet" description="Reviews from students will appear here" />
        ) : (
          <div className="space-y-3">{/* Review list */}</div>
        )}
      </div>
    </div>
  );
}
