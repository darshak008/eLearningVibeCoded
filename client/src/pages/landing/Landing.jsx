import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiArrowRight, FiPlay, FiStar, FiUsers, FiBookOpen, FiClock,
  FiAward, FiShield, FiTrendingUp, FiCode, FiGlobe, FiMonitor,
  FiCheck, FiChevronRight, FiChevronLeft, FiMail, FiSearch,
  FiPlayCircle, FiBarChart2, FiMessageCircle, FiZap,
  FiChevronDown, FiLayers, FiTarget, FiHeart, FiCamera
} from 'react-icons/fi';
import AnimatedSection from '../../components/animations/AnimatedSection';
import CountUp from '../../components/animations/CountUp';
import FloatingElements from '../../components/animations/FloatingElements';
import { courseAPI } from '../../services/api';
import Rating from '../../components/ui/Rating';
import Badge from '../../components/ui/Badge';

const HeroSection = () => {
  const [email, setEmail] = useState('');

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      <div className="absolute inset-0 hero-gradient" />
      <FloatingElements />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge variant="primary" className="mb-6 px-4 py-2 text-sm">
                <FiZap className="mr-1" /> New: AI-Powered Learning Paths
              </Badge>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl/none font-extrabold mb-6">
                <span className="text-dark-900 dark:text-white">Learn Without</span>
                <br />
                <span className="gradient-text">Limits</span>
              </h1>

              <p className="text-lg sm:text-xl text-dark-500 dark:text-dark-400 mb-8 max-w-xl mx-auto lg:mx-0 text-balance">
                Unlock your potential with world-class courses taught by industry experts.
                Learn at your own pace, anywhere, anytime.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-8">
                <Link
                  to="/courses"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-500 text-white rounded-xl font-semibold text-lg hover:bg-primary-600 transition-all shadow-xl shadow-primary-500/30"
                >
                  Explore Courses
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/auth/register"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 glass rounded-xl font-semibold text-lg text-dark-700 dark:text-dark-200 hover:bg-white/20 transition-all"
                >
                  <FiPlayCircle className="text-primary-500" />
                  Watch Demo
                </Link>
              </div>

              <div className="flex items-center gap-4 justify-center lg:justify-start text-sm text-dark-500 dark:text-dark-400">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-purple-400 border-2 border-white dark:border-dark-900" />
                  ))}
                </div>
                <span className="font-medium"><span className="text-primary-500 font-bold">50K+</span> students enrolled</span>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block relative"
          >
            <div className="relative">
              <div className="w-full aspect-[4/3] rounded-3xl bg-gradient-to-br from-primary-500/20 to-purple-500/20 glass-card overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-6 p-8">
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { icon: FiCode, label: 'Coding', color: 'from-blue-500 to-cyan-500' },
                        { icon: FiMonitor, label: 'Design', color: 'from-purple-500 to-pink-500' },
                        { icon: FiGlobe, label: 'Marketing', color: 'from-emerald-500 to-teal-500' },
                        { icon: FiBarChart2, label: 'Business', color: 'from-amber-500 to-orange-500' },
                      ].map((item, i) => (
                        <motion.div
                          key={i}
                          whileHover={{ scale: 1.05, rotate: [-1, 1, 0] }}
                          className="glass-card rounded-2xl p-6 text-center cursor-pointer hover:shadow-xl transition-all"
                        >
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-3`}>
                            <item.icon className="text-white text-xl" />
                          </div>
                          <p className="text-sm font-semibold text-dark-700 dark:text-dark-200">{item.label}</p>
                        </motion.div>
                      ))}
                    </div>
                    <div className="glass rounded-2xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FiPlay className="text-primary-500 text-2xl" />
                        <div className="text-left">
                          <p className="text-sm font-medium text-dark-700 dark:text-dark-200">Learn at your pace</p>
                          <p className="text-xs text-dark-500">2,500+ video lessons</p>
                        </div>
                      </div>
                      <FiArrowRight className="text-primary-500" />
                    </div>
                  </div>
                </div>
              </div>

              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-4 -right-4 glass-card rounded-2xl p-4 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <FiAward className="text-amber-500 text-2xl" />
                  <div>
                    <p className="text-sm font-bold text-dark-900 dark:text-white">Certificate</p>
                    <p className="text-xs text-dark-500">Upon completion</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -bottom-4 -left-4 glass-card rounded-2xl p-4 shadow-xl"
              >
                <div className="flex items-center gap-2">
                  <Rating value={4.8} size="sm" showCount={false} />
                  <span className="text-sm font-semibold text-dark-900 dark:text-white">4.8/5.0</span>
                  <span className="text-xs text-dark-500">(12K+)</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark-50 dark:from-dark-950 to-transparent" />
    </section>
  );
};

const StatsSection = () => (
  <section className="py-16 relative">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {[
          { value: 50, suffix: 'K+', label: 'Active Students', icon: FiUsers },
          { value: 2500, suffix: '+', label: 'Courses', icon: FiBookOpen },
          { value: 500, suffix: '+', label: 'Expert Instructors', icon: FiAward },
          { value: 95, suffix: '%', label: 'Satisfaction Rate', icon: FiHeart },
        ].map((stat, i) => (
          <AnimatedSection key={i} delay={i * 0.1}>
            <div className="text-center group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <stat.icon className="text-primary-500 text-2xl" />
              </div>
              <div className="text-3xl sm:text-4xl font-bold gradient-text mb-1">
                <CountUp end={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-dark-500 dark:text-dark-400 text-sm font-medium">{stat.label}</p>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  </section>
);

const FeaturedCoursesSection = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    courseAPI.getFeatured().then((res) => {
      setCourses(res.data.courses);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-12">
          <Badge variant="primary" className="mb-4 px-4 py-2">Top Rated</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-dark-900 dark:text-white mb-4">
            Featured <span className="gradient-text">Courses</span>
          </h2>
          <p className="text-dark-500 dark:text-dark-400 max-w-xl mx-auto">
            Handpicked courses by our team to help you start learning today
          </p>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="glass-card rounded-2xl overflow-hidden">
                  <div className="skeleton h-48 w-full" />
                  <div className="p-5 space-y-3">
                    <div className="skeleton h-4 w-3/4 rounded" />
                    <div className="skeleton h-3 w-1/2 rounded" />
                    <div className="skeleton h-3 w-full rounded" />
                  </div>
                </div>
              ))
            : courses.map((course, i) => (
                <AnimatedSection key={course._id} delay={i * 0.1}>
                  <Link to={`/courses/${course.slug}`} className="group block">
                    <div className="glass-card rounded-2xl overflow-hidden card-hover">
                      <div className="relative h-48 bg-gradient-to-br from-primary-500/20 to-purple-500/20 overflow-hidden">
                        {course.thumbnail?.url ? (
                          <img src={course.thumbnail.url} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FiBookOpen className="text-4xl text-primary-500/40" />
                          </div>
                        )}
                        {course.discountPrice > 0 && (
                          <Badge variant="error" className="absolute top-3 left-3">
                            {Math.round((1 - course.discountPrice / course.price) * 100)}% OFF
                          </Badge>
                        )}
                      </div>
                      <div className="p-5">
                        <p className="text-xs font-medium text-primary-500 uppercase tracking-wider mb-1">
                          {course.category?.name}
                        </p>
                        <h3 className="font-semibold text-dark-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary-500 transition-colors">
                          {course.title}
                        </h3>
                        <p className="text-sm text-dark-500 dark:text-dark-400 mb-3">
                          {course.instructor?.name}
                        </p>
                        <div className="flex items-center justify-between">
                          <Rating value={course.avgRating} count={course.totalReviews} />
                          <div className="text-lg font-bold gradient-text">
                            {course.discountPrice > 0 ? (
                              <span>${course.discountPrice} <span className="text-sm text-dark-400 line-through">${course.price}</span></span>
                            ) : course.price === 0 ? (
                              <span className="text-success-500">Free</span>
                            ) : (
                              <span>${course.price}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </AnimatedSection>
              ))}
        </div>

        <AnimatedSection className="text-center mt-12">
          <Link to="/courses" className="inline-flex items-center gap-2 px-8 py-3 glass rounded-xl text-dark-700 dark:text-dark-200 font-semibold hover:bg-white/20 transition-all">
            View All Courses <FiArrowRight />
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
};

const CategoriesSection = () => {
  const categories = [
    { name: 'Web Development', icon: FiCode, color: 'from-blue-500 to-cyan-500', count: '120+ Courses' },
    { name: 'Data Science', icon: FiBarChart2, color: 'from-purple-500 to-pink-500', count: '85+ Courses' },
    { name: 'UI/UX Design', icon: FiCamera, color: 'from-emerald-500 to-teal-500', count: '60+ Courses' },
    { name: 'Business', icon: FiTarget, color: 'from-amber-500 to-orange-500', count: '95+ Courses' },
    { name: 'Marketing', icon: FiTrendingUp, color: 'from-rose-500 to-red-500', count: '70+ Courses' },
    { name: 'Mobile Development', icon: FiMonitor, color: 'from-indigo-500 to-purple-500', count: '45+ Courses' },
  ];

  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-500/5 to-transparent" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-dark-900 dark:text-white mb-4">
            Explore <span className="gradient-text">Categories</span>
          </h2>
          <p className="text-dark-500 dark:text-dark-400 max-w-xl mx-auto">
            Choose from a wide range of categories and find your perfect course
          </p>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, i) => (
            <AnimatedSection key={i} delay={i * 0.08}>
              <Link to={`/courses?category=${cat.name.toLowerCase()}`} className="group block">
                <div className="glass-card rounded-2xl p-6 card-hover flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <cat.icon className="text-white text-2xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark-900 dark:text-white group-hover:text-primary-500 transition-colors">{cat.name}</h3>
                    <p className="text-sm text-dark-500 dark:text-dark-400">{cat.count}</p>
                  </div>
                  <FiChevronRight className="ml-auto text-dark-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

const TestimonialsSection = () => {
  const [current, setCurrent] = useState(0);
  const testimonials = [
    { name: 'Sarah Johnson', role: 'Web Developer', avatar: 'SJ', text: 'This platform transformed my career. The courses are well-structured and the instructors are incredibly knowledgeable. I went from beginner to professional in just 6 months.', rating: 5 },
    { name: 'Michael Chen', role: 'Data Analyst', avatar: 'MC', text: 'The AI-powered learning paths are amazing! The platform adapts to your skill level and recommends the perfect next course. I\'ve learned more here than in traditional education.', rating: 5 },
    { name: 'Emily Rodriguez', role: 'UX Designer', avatar: 'ER', text: 'The interactive projects and real-world assignments helped me build an impressive portfolio. I landed my dream job thanks to the skills I gained here.', rating: 5 },
    { name: 'David Kim', role: 'Entrepreneur', avatar: 'DK', text: 'As a busy professional, I love the flexibility. The mobile app works great and the short, focused lessons fit perfectly into my schedule.', rating: 4 },
  ];

  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-12">
          <Badge variant="primary" className="mb-4 px-4 py-2">Testimonials</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-dark-900 dark:text-white mb-4">
            What Our <span className="gradient-text">Students Say</span>
          </h2>
        </AnimatedSection>

        <div className="relative max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="glass-card rounded-3xl p-8 md:p-12 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl mx-auto mb-6">
                {testimonials[current].avatar}
              </div>
              <Rating value={testimonials[current].rating} size="md" showCount={false} />
              <p className="text-lg text-dark-700 dark:text-dark-200 mt-6 mb-6 italic leading-relaxed">
                "{testimonials[current].text}"
              </p>
              <h4 className="font-semibold text-dark-900 dark:text-white">{testimonials[current].name}</h4>
              <p className="text-sm text-dark-500 dark:text-dark-400">{testimonials[current].role}</p>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${i === current ? 'bg-primary-500 w-8' : 'bg-dark-300 dark:bg-dark-600'}`}
              />
            ))}
          </div>

          <div className="flex justify-between mt-6">
            <button onClick={() => setCurrent((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))} className="p-3 glass-card rounded-xl hover:bg-white/20 transition-all">
              <FiChevronLeft />
            </button>
            <button onClick={() => setCurrent((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))} className="p-3 glass-card rounded-xl hover:bg-white/20 transition-all">
              <FiChevronRight />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

const BenefitsSection = () => (
  <section className="py-20 relative">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <AnimatedSection className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-dark-900 dark:text-white mb-4">
          Why Choose <span className="gradient-text">LearnHub</span>
        </h2>
      </AnimatedSection>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { icon: FiShield, title: 'Lifetime Access', text: 'Learn at your own pace with lifetime access to all course materials' },
          { icon: FiAward, title: 'Expert Instructors', text: 'Learn from industry professionals with years of real-world experience' },
          { icon: FiClock, title: 'Flexible Schedule', text: 'Access courses anytime, anywhere on any device' },
          { icon: FiCode, title: 'Hands-on Projects', text: 'Build real projects and create an impressive portfolio' },
          { icon: FiMessageCircle, title: 'Community Support', text: 'Join a vibrant community of learners and mentors' },
          { icon: FiTrendingUp, title: 'Career Growth', text: 'Get certified and advance your career with recognized credentials' },
        ].map((benefit, i) => (
          <AnimatedSection key={i} delay={i * 0.1}>
            <div className="glass-card rounded-2xl p-6 card-hover">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-purple-500/20 flex items-center justify-center mb-4">
                <benefit.icon className="text-primary-500 text-xl" />
              </div>
              <h3 className="font-semibold text-dark-900 dark:text-white mb-2">{benefit.title}</h3>
              <p className="text-sm text-dark-500 dark:text-dark-400 leading-relaxed">{benefit.text}</p>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  </section>
);

const PricingSection = () => {
  const plans = [
    {
      name: 'Starter',
      price: 0,
      features: ['Access to free courses', 'Basic progress tracking', 'Community forum access', 'Email support'],
      cta: 'Get Started Free',
      popular: false,
    },
    {
      name: 'Pro',
      price: 29,
      period: '/month',
      features: ['All Starter features', 'Unlimited course access', 'Certificate of completion', 'Priority support', 'Project reviews'],
      cta: 'Start Pro Trial',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 99,
      period: '/month',
      features: ['All Pro features', 'Team management', 'Custom learning paths', 'API access', 'Dedicated mentor', 'Analytics dashboard'],
      cta: 'Contact Sales',
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-12">
          <Badge variant="primary" className="mb-4 px-4 py-2">Pricing</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-dark-900 dark:text-white mb-4">
            Simple, <span className="gradient-text">Transparent</span> Pricing
          </h2>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <AnimatedSection key={i} delay={i * 0.1}>
              <div className={`glass-card rounded-3xl p-8 card-hover relative ${plan.popular ? 'border-2 border-primary-500' : ''}`}>
                {plan.popular && (
                  <Badge variant="premium" className="absolute -top-3 left-1/2 -translate-x-1/2 px-6 py-1">
                    Most Popular
                  </Badge>
                )}
                <h3 className="text-xl font-bold text-dark-900 dark:text-white mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold gradient-text">${plan.price}</span>
                  {plan.period && <span className="text-dark-400 text-sm">{plan.period}</span>}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm text-dark-600 dark:text-dark-300">
                      <FiCheck className="text-success-500 mt-0.5 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to={plan.price === 0 ? '/auth/register' : '/auth/register'} className={`block text-center py-3 rounded-xl font-semibold transition-all ${
                  plan.popular
                    ? 'bg-primary-500 text-white hover:bg-primary-600 shadow-lg shadow-primary-500/30'
                    : 'glass hover:bg-white/20 text-dark-700 dark:text-dark-200'
                }`}>
                  {plan.cta}
                </Link>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

const FAQSection = () => {
  const [open, setOpen] = useState(null);
  const faqs = [
    { q: 'How do I get started?', a: 'Simply create a free account and start exploring our course catalog. You can enroll in any course that interests you.' },
    { q: 'Can I learn at my own pace?', a: 'Absolutely! All courses are self-paced. You can access course materials anytime and learn at your convenience.' },
    { q: 'Are the certificates recognized?', a: 'Yes, our certificates are recognized by industry partners and can be shared on LinkedIn.' },
    { q: 'What if I need help?', a: 'You can reach out to instructors via Q&A sections, join community discussions, or contact our support team.' },
    { q: 'Is there a money-back guarantee?', a: 'Yes, we offer a 30-day money-back guarantee on all paid courses. No questions asked.' },
  ];

  return (
    <section id="faq" className="py-20 relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-dark-900 dark:text-white mb-4">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
        </AnimatedSection>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <AnimatedSection key={i} delay={i * 0.05}>
              <div className="glass-card rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-medium text-dark-900 dark:text-white pr-4">{faq.q}</span>
                  <FiChevronDown className={`text-dark-400 transition-transform flex-shrink-0 ${open === i ? 'rotate-180' : ''}`} />
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: open === i ? 'auto' : 0, opacity: open === i ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 text-dark-500 dark:text-dark-400 text-sm leading-relaxed">{faq.a}</p>
                </motion.div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

const NewsletterSection = () => (
  <section className="py-20 relative">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <AnimatedSection>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-500 to-purple-600 p-8 sm:p-12 text-center">
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Stay Ahead in Your Learning Journey
            </h2>
            <p className="text-primary-100 mb-8 max-w-lg mx-auto">
              Get weekly updates on new courses, learning tips, and exclusive offers delivered to your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
              <div className="flex-1 relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-200" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/20 border border-white/30 text-white placeholder-primary-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>
              <button className="px-8 py-3.5 bg-white text-primary-600 rounded-xl font-semibold hover:bg-primary-50 transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </AnimatedSection>
    </div>
  </section>
);

const InstructorCTA = () => (
  <section className="py-20 relative">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <AnimatedSection>
          <Badge variant="primary" className="mb-4 px-4 py-2">Teach on LearnHub</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-dark-900 dark:text-white mb-4">
            Share Your Knowledge. <span className="gradient-text">Inspire Learners.</span>
          </h2>
          <p className="text-dark-500 dark:text-dark-400 mb-6 leading-relaxed">
            Join thousands of instructors who are teaching on LearnHub. Create courses, build your community, and earn revenue while making a difference.
          </p>
          <ul className="space-y-3 mb-8">
            {[
              'Easy-to-use course builder tools',
              'Reach millions of learners worldwide',
              'Competitive revenue sharing model',
              'Dedicated instructor support team',
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-dark-600 dark:text-dark-300">
                <FiCheck className="text-success-500 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <Link
            to="/auth/register"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-all shadow-lg shadow-primary-500/30"
          >
            Start Teaching Today <FiArrowRight />
          </Link>
        </AnimatedSection>

        <AnimatedSection direction="right" className="hidden lg:block">
          <div className="glass-card rounded-3xl p-8">
            <div className="space-y-4">
              {[
                { label: 'Total Students', value: '50K+', change: '+12%' },
                { label: 'Active Courses', value: '2,500+', change: '+8%' },
                { label: 'Instructor Earnings', value: '$2.4M', change: '+15%' },
              ].map((stat, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-dark-50 dark:bg-dark-800/50">
                  <div>
                    <p className="text-sm text-dark-500 dark:text-dark-400">{stat.label}</p>
                    <p className="text-lg font-bold text-dark-900 dark:text-white">{stat.value}</p>
                  </div>
                  <span className="text-sm font-semibold text-success-500 bg-success-500/10 px-3 py-1 rounded-lg">{stat.change}</span>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  </section>
);

const PartnersSection = () => (
  <section className="py-16 relative">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <AnimatedSection className="text-center mb-10">
        <p className="text-sm font-medium text-dark-500 dark:text-dark-400 uppercase tracking-wider">Trusted by leading companies</p>
      </AnimatedSection>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center justify-items-center">
        {['TechCo', 'DataFlow', 'CloudBase', 'AI Labs', 'DevStudio', 'CyberX'].map((name, i) => (
          <AnimatedSection key={i} delay={i * 0.05}>
            <div className="h-10 flex items-center">
              <div className="text-lg font-bold text-dark-300 dark:text-dark-600 hover:text-dark-400 dark:hover:text-dark-500 transition-colors">
                {name}
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  </section>
);

export default function Landing() {
  return (
    <div className="overflow-hidden">
      <HeroSection />
      <StatsSection />
      <FeaturedCoursesSection />
      <CategoriesSection />
      <TestimonialsSection />
      <BenefitsSection />
      <InstructorCTA />
      <PricingSection />
      <FAQSection />
      <PartnersSection />
      <NewsletterSection />
    </div>
  );
}
