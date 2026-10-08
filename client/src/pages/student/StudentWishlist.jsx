import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiBookOpen } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import EmptyState from '../../components/common/EmptyState';

export default function StudentWishlist() {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (user?.wishlist) setWishlist(user.wishlist);
  }, [user]);

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-dark-900 dark:text-white mb-6">My Wishlist</h1>
        {wishlist.length === 0 ? (
          <EmptyState icon={<FiHeart />} title="Your wishlist is empty" description="Save courses you're interested in for later" action={<Link to="/courses" className="px-6 py-3 bg-primary-500 text-white rounded-xl font-semibold">Browse Courses</Link>} />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((course) => (
              <div key={course._id} className="glass-card rounded-2xl overflow-hidden card-hover">
                <div className="h-44 bg-gradient-to-br from-primary-500/20 to-purple-500/20" />
                <div className="p-5">
                  <h3 className="font-semibold text-dark-900 dark:text-white">{course.title}</h3>
                  <p className="text-sm text-dark-500 mt-1">${course.price || 'Free'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
