import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiPlay, FiClock, FiUsers, FiBookOpen, FiBarChart2, FiCheck,
  FiChevronDown, FiShare2, FiHeart, FiShoppingCart, FiGlobe,
  FiAward, FiMonitor, FiLayers, FiFileText, FiMessageCircle,
  FiStar,
} from 'react-icons/fi';
import { courseAPI, enrollmentAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Rating from '../../components/ui/Rating';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

export default function CourseDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedModule, setExpandedModule] = useState(null);
  const [enrolling, setEnrolling] = useState(false);
  const [activeTab, setActiveTab] = useState('curriculum');

  useEffect(() => {
    courseAPI.getBySlug(slug)
      .then((res) => {
        setCourse(res.data.course);
        setReviews(res.data.reviews);
      })
      .catch(() => navigate('/404'))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleEnroll = async () => {
    if (!user) return navigate('/auth/login');
    setEnrolling(true);
    try {
      await enrollmentAPI.enroll(course._id);
      toast.success('Enrolled successfully!');
      navigate(`/courses/${course.slug}/learn/${course.modules?.[0]?.lessons?.[0]?._id || ''}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Enrollment failed');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="skeleton h-64 rounded-3xl mb-8" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="skeleton h-8 w-3/4 rounded" />
              <div className="skeleton h-4 w-1/2 rounded" />
              <div className="skeleton h-32 rounded" />
            </div>
            <div className="skeleton h-96 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!course) return null;

  const tabs = [
    { id: 'curriculum', label: 'Curriculum' },
    { id: 'reviews', label: `Reviews (${reviews.length})` },
    { id: 'instructor', label: 'Instructor' },
    { id: 'faq', label: 'FAQ' },
  ];

  return (
    <div className="min-h-screen pt-20">
      <div className="bg-gradient-to-b from-primary-500/10 to-transparent pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Badge variant="primary" className="mb-3">{course.level}</Badge>
              <h1 className="text-3xl lg:text-4xl font-bold text-dark-900 dark:text-white mb-4">{course.title}</h1>
              <p className="text-lg text-dark-500 dark:text-dark-400 mb-4">{course.shortDescription || course.description?.slice(0, 200)}</p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-dark-500 dark:text-dark-400 mb-6">
                <Rating value={course.avgRating} count={course.totalReviews} />
                <span className="flex items-center gap-1"><FiUsers /> {course.totalStudents} students</span>
                <span className="flex items-center gap-1"><FiClock /> {course.duration || 'Self-paced'}</span>
                <span className="flex items-center gap-1"><FiBookOpen /> {course.totalLessons} lessons</span>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                  {course.instructor?.name?.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-dark-900 dark:text-white">Created by <span className="text-primary-500">{course.instructor?.name}</span></p>
                  <p className="text-sm text-dark-500 dark:text-dark-400">{course.instructor?.headline || 'Expert Instructor'}</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-2xl overflow-hidden sticky top-24"
              >
                <div className="aspect-video bg-gradient-to-br from-primary-500/20 to-purple-500/20 flex items-center justify-center">
                  {course.trailer?.url ? (
                    <video src={course.trailer.url} controls className="w-full h-full object-cover" />
                  ) : (
                    <FiPlay className="text-5xl text-primary-500/60" />
                  )}
                </div>
                <div className="p-6">
                  <div className="text-3xl font-bold gradient-text mb-6">
                    {course.discountPrice > 0 ? (
                      <div>
                        ${course.discountPrice}
                        <span className="text-lg text-dark-400 line-through ml-2">${course.price}</span>
                      </div>
                    ) : course.price === 0 ? (
                      <span className="text-success-500">Free</span>
                    ) : (
                      `$${course.price}`
                    )}
                  </div>

                  <Button variant="gradient" size="xl" className="w-full mb-3" onClick={handleEnroll} loading={enrolling}>
                    {course.price === 0 ? <><FiPlay /> Enroll for Free</> : <><FiShoppingCart /> Enroll Now</>}
                  </Button>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3 text-dark-600 dark:text-dark-300">
                      <FiGlobe /> Full lifetime access
                    </div>
                    <div className="flex items-center gap-3 text-dark-600 dark:text-dark-300">
                      <FiMonitor /> Access on all devices
                    </div>
                    <div className="flex items-center gap-3 text-dark-600 dark:text-dark-300">
                      <FiAward /> Certificate of completion
                    </div>
                  </div>

                  <hr className="my-4 border-dark-200 dark:border-dark-700" />

                  <div className="flex items-center gap-4 text-sm">
                    <button className="flex items-center gap-2 text-dark-500 hover:text-primary-500 transition-colors"><FiHeart /> Wishlist</button>
                    <button className="flex items-center gap-2 text-dark-500 hover:text-primary-500 transition-colors"><FiShare2 /> Share</button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-1 p-1 bg-dark-100 dark:bg-dark-800 rounded-xl mb-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary-500 text-white'
                  : 'text-dark-600 dark:text-dark-400 hover:text-dark-900 dark:hover:text-dark-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'curriculum' && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold text-dark-900 dark:text-white mb-4">Course Content</h2>
              <div className="space-y-2">
                {course.modules?.map((mod) => (
                  <div key={mod._id} className="glass-card rounded-2xl overflow-hidden">
                    <button
                      onClick={() => setExpandedModule(expandedModule === mod._id ? null : mod._id)}
                      className="w-full flex items-center justify-between p-5 text-left"
                    >
                      <div>
                        <span className="text-sm text-primary-500 font-medium">Module {mod.order}</span>
                        <h3 className="font-semibold text-dark-900 dark:text-white">{mod.title}</h3>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-dark-400">{mod.lessons?.length || 0} lessons</span>
                        <FiChevronDown className={`text-dark-400 transition-transform ${expandedModule === mod._id ? 'rotate-180' : ''}`} />
                      </div>
                    </button>
                    {expandedModule === mod._id && (
                      <div className="px-5 pb-5 space-y-1">
                        {mod.lessons?.map((lesson) => (
                          <div key={lesson._id} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-dark-50 dark:hover:bg-dark-800/50 transition-colors">
                            <FiPlay className="text-primary-500 text-sm flex-shrink-0" />
                            <span className="text-sm text-dark-700 dark:text-dark-200 flex-1">{lesson.title}</span>
                            <span className="text-xs text-dark-400 flex-shrink-0">{lesson.duration ? `${Math.floor(lesson.duration / 60)}:${lesson.duration % 60}` : ''}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-dark-900 dark:text-white mb-4">What you'll learn</h2>
              <ul className="space-y-3">
                {course.outcomes?.map((outcome, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-dark-600 dark:text-dark-300">
                    <FiCheck className="text-success-500 mt-0.5 flex-shrink-0" />
                    {outcome}
                  </li>
                ))}
              </ul>

              {course.requirements?.length > 0 && (
                <>
                  <h2 className="text-xl font-bold text-dark-900 dark:text-white mt-8 mb-4">Requirements</h2>
                  <ul className="space-y-2">
                    {course.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-dark-600 dark:text-dark-300">
                        <FiBarChart2 className="text-primary-500 mt-0.5 flex-shrink-0" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="max-w-3xl">
            <div className="flex items-center gap-6 mb-8">
              <div className="text-center">
                <div className="text-5xl font-bold gradient-text">{course.avgRating?.toFixed(1)}</div>
                <Rating value={course.avgRating} size="md" showCount={false} />
                <p className="text-sm text-dark-500 mt-1">{course.totalReviews} reviews</p>
              </div>
            </div>
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review._id} className="glass-card rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-purple-400 flex items-center justify-center text-white font-semibold text-sm">
                      {review.student?.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-dark-900 dark:text-white text-sm">{review.student?.name}</p>
                      <Rating value={review.rating} size="sm" showCount={false} />
                    </div>
                  </div>
                  <p className="text-sm text-dark-600 dark:text-dark-300">{review.review}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'instructor' && (
          <div className="max-w-3xl">
            <div className="glass-card rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-white font-bold text-3xl">
                  {course.instructor?.name?.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-dark-900 dark:text-white">{course.instructor?.name}</h2>
                  <p className="text-dark-500 dark:text-dark-400">{course.instructor?.headline || 'Expert Instructor'}</p>
                </div>
              </div>
              <p className="text-dark-600 dark:text-dark-300 leading-relaxed">{course.instructor?.bio || 'An experienced instructor passionate about teaching and helping students achieve their goals.'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
