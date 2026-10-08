import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiSliders, FiGrid, FiList, FiChevronDown, FiBookOpen } from 'react-icons/fi';
import { courseAPI } from '../../services/api';
import Rating from '../../components/ui/Rating';
import Badge from '../../components/ui/Badge';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import AnimatedSection from '../../components/animations/AnimatedSection';

const levels = ['all', 'beginner', 'intermediate', 'advanced'];
const sortOptions = [
  { value: '-createdAt', label: 'Newest' },
  { value: '-totalStudents', label: 'Most Popular' },
  { value: '-avgRating', label: 'Highest Rated' },
  { value: 'price', label: 'Price: Low to High' },
  { value: '-price', label: 'Price: High to Low' },
];

export default function CourseList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [view, setView] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);

  const page = parseInt(searchParams.get('page') || '1');
  const search = searchParams.get('search') || '';
  const level = searchParams.get('level') || 'all';
  const sort = searchParams.get('sort') || '-createdAt';

  useEffect(() => {
    setLoading(true);
    courseAPI.getAll({ page, search, level: level !== 'all' ? level : undefined, sort, limit: 12 })
      .then((res) => {
        setCourses(res.data.courses);
        setTotal(res.data.total);
        setTotalPages(res.data.totalPages);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, search, level, sort]);

  const updateParams = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    if (key !== 'page') params.set('page', '1');
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-dark-900 dark:text-white">Explore Courses</h1>
            <p className="text-dark-500 dark:text-dark-400 mt-1">{total} courses available</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex glass rounded-xl p-1">
              <button onClick={() => setView('grid')} className={`p-2 rounded-lg ${view === 'grid' ? 'bg-primary-500 text-white' : 'text-dark-400 hover:text-dark-600'}`}><FiGrid /></button>
              <button onClick={() => setView('list')} className={`p-2 rounded-lg ${view === 'list' ? 'bg-primary-500 text-white' : 'text-dark-400 hover:text-dark-600'}`}><FiList /></button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-64 flex-shrink-0">
            <div className="glass-card rounded-2xl p-6 space-y-6 sticky top-24">
              <h3 className="font-semibold text-dark-900 dark:text-white flex items-center gap-2">
                <FiSliders /> Filters
              </h3>

              <div>
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={search}
                  onChange={(e) => updateParams('search', e.target.value)}
                  className="w-full px-4 py-2.5 bg-dark-50 dark:bg-dark-800 border border-dark-200 dark:border-dark-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-dark-700 dark:text-dark-300 block mb-2">Level</label>
                <div className="space-y-2">
                  {levels.map((l) => (
                    <button
                      key={l}
                      onClick={() => updateParams('level', l === 'all' ? '' : l)}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        level === l || (l === 'all' && !level)
                          ? 'bg-primary-500/10 text-primary-500 font-medium'
                          : 'text-dark-500 hover:bg-dark-50 dark:hover:bg-dark-800'
                      }`}
                    >
                      {l.charAt(0).toUpperCase() + l.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-dark-700 dark:text-dark-300 block mb-2">Sort By</label>
                <select
                  value={sort}
                  onChange={(e) => updateParams('sort', e.target.value)}
                  className="w-full px-3 py-2.5 bg-dark-50 dark:bg-dark-800 border border-dark-200 dark:border-dark-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex-1">
            {loading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center py-16">
                <FiBookOpen className="text-5xl text-dark-300 dark:text-dark-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-dark-700 dark:text-dark-200">No courses found</h3>
                <p className="text-dark-500 dark:text-dark-400 mt-2">Try adjusting your filters</p>
              </div>
            ) : (
              <div className={`grid ${view === 'grid' ? 'sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                {courses.map((course, i) => (
                  <AnimatedSection key={course._id} delay={i * 0.05}>
                    <Link to={`/courses/${course.slug}`} className="group block">
                      <div className={`glass-card rounded-2xl overflow-hidden card-hover ${view === 'list' ? 'flex' : ''}`}>
                        <div className={`relative ${view === 'list' ? 'w-48 h-full min-h-[180px]' : 'h-48'} bg-gradient-to-br from-primary-500/10 to-purple-500/10 overflow-hidden`}>
                          {course.thumbnail?.url ? (
                            <img src={course.thumbnail.url} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FiBookOpen className="text-4xl text-primary-500/30" />
                            </div>
                          )}
                        </div>
                        <div className="p-5 flex-1">
                          <p className="text-xs font-medium text-primary-500 uppercase tracking-wider mb-1">{course.category?.name}</p>
                          <h3 className="font-semibold text-dark-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary-500 transition-colors">{course.title}</h3>
                          <p className="text-sm text-dark-500 dark:text-dark-400 mb-3">{course.instructor?.name}</p>
                          <div className="flex items-center justify-between">
                            <Rating value={course.avgRating} count={course.totalReviews} />
                            <span className="text-lg font-bold gradient-text">
                              {course.price === 0 ? <span className="text-success-500 text-sm">Free</span> : `$${course.price}`}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </AnimatedSection>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => updateParams('page', (i + 1).toString())}
                    className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                      page === i + 1
                        ? 'bg-primary-500 text-white'
                        : 'glass text-dark-600 dark:text-dark-400 hover:bg-white/20'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
