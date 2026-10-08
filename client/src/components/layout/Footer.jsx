import { Link } from 'react-router-dom';
import { FiBookOpen, FiMail, FiMapPin, FiGithub, FiTwitter, FiLinkedin, FiInstagram } from 'react-icons/fi';

const footerLinks = {
  Platform: [
    { label: 'Explore Courses', to: '/courses' },
    { label: 'Become an Instructor', to: '/auth/register' },
    { label: 'Pricing', to: '/#pricing' },
    { label: 'FAQ', to: '/#faq' },
  ],
  Company: [
    { label: 'About Us', to: '/#about' },
    { label: 'Careers', to: '/#careers' },
    { label: 'Blog', to: '/#blog' },
    { label: 'Press', to: '/#press' },
  ],
  Support: [
    { label: 'Help Center', to: '/#help' },
    { label: 'Terms of Service', to: '/#terms' },
    { label: 'Privacy Policy', to: '/#privacy' },
    { label: 'Contact Us', to: '/#contact' },
  ],
};

export default function Footer() {
  return (
    <footer className="relative bg-dark-900 dark:bg-dark-950 text-dark-300 border-t border-dark-800">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-purple-500 rounded-xl flex items-center justify-center">
                <FiBookOpen className="text-white text-lg" />
              </div>
              <span className="text-xl font-bold text-white">LearnHub</span>
            </Link>
            <p className="text-dark-400 text-sm leading-relaxed mb-6 max-w-xs">
              Empowering learners worldwide with premium education. Learn from industry experts and advance your career.
            </p>
            <div className="flex gap-3">
              {[FiGithub, FiTwitter, FiLinkedin, FiInstagram].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-xl bg-dark-800 hover:bg-primary-500 flex items-center justify-center text-dark-400 hover:text-white transition-all">
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">{title}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-sm text-dark-400 hover:text-primary-400 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-dark-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-dark-500">
            &copy; {new Date().getFullYear()} LearnHub. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-dark-500">
            <span className="flex items-center gap-1">
              <FiMail className="text-primary-500" /> hello@learnhub.com
            </span>
            <span className="flex items-center gap-1">
              <FiMapPin className="text-primary-500" /> San Francisco, CA
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
