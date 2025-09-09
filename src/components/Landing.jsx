import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Header from './Header';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Supply Chain
              <span className="text-primary-600 dark:text-primary-400 block">Transparency</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Track agricultural produce from farm to table with blockchain-powered transparency. 
              Ensuring quality, authenticity, and trust in every step of the supply chain.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Link to="/signin">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
              >
                Get Started
              </motion.button>
            </Link>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-primary-600 dark:border-primary-400 text-primary-600 dark:text-primary-400 hover:bg-primary-600 dark:hover:bg-primary-400 hover:text-white dark:hover:text-gray-900 px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
            >
              Learn More
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid md:grid-cols-3 gap-8 mb-16"
          >
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Verified Quality</h3>
              <p className="text-gray-600 dark:text-gray-300">Every product is verified at each stage with immutable blockchain records.</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Real-time Tracking</h3>
              <p className="text-gray-600 dark:text-gray-300">Track your produce in real-time from farm to consumer with complete visibility.</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Secure & Trusted</h3>
              <p className="text-gray-600 dark:text-gray-300">Blockchain technology ensures data integrity and builds consumer trust.</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Demo Credentials</h2>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
                <h3 className="font-semibold text-primary-600 dark:text-primary-400 mb-2">Farmer</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Aadhar: 123456789012</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Password: demo123</p>
              </div>
              <div className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
                <h3 className="font-semibold text-primary-600 dark:text-primary-400 mb-2">Distributor</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Aadhar: 234567890123</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Password: demo123</p>
              </div>
              <div className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
                <h3 className="font-semibold text-primary-600 dark:text-primary-400 mb-2">Retailer</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Aadhar: 345678901234</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Password: demo123</p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Landing;
