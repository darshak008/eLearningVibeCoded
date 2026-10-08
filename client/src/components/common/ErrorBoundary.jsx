import { Component } from 'react';
import { motion } from 'framer-motion';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center"
        >
          <div className="text-6xl mb-6">⚠️</div>
          <h2 className="text-2xl font-bold text-dark-800 dark:text-dark-100 mb-3">
            Something went wrong
          </h2>
          <p className="text-dark-500 dark:text-dark-400 mb-6 max-w-md">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false });
              window.location.reload();
            }}
            className="px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors"
          >
            Try Again
          </button>
        </motion.div>
      );
    }

    return this.props.children;
  }
}
