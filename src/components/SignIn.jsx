import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import { validateAadhar } from '../utils/localStorage';
import apiClient from '../utils/apiClient';

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    aadhar: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.aadhar) {
      newErrors.aadhar = 'Aadhar number is required';
    } else if (!validateAadhar(formData.aadhar)) {
      newErrors.aadhar = 'Please enter a valid 12-digit Aadhar number';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          aadhar: formData.aadhar,
          password: formData.password
        })
      });

      const data = await response.json();
      
      console.log('Full response data:', data);
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (response.ok && data.success) {
        console.log('User data received:', data.user);
        console.log('User role:', data.user.role);
        
        // Store user data in both keys for compatibility
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        localStorage.setItem('agritrack_current', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        
        const dashboardPath = `/${data.user.role}/dashboard`;
        console.log('Attempting to navigate to:', dashboardPath);
        
        // Force navigation with replace to avoid back button issues
        navigate(dashboardPath, { replace: true });
      } else {
        console.log('Login failed:', data);
        setErrors({
          general: data.message || 'Invalid credentials. User not found in database.'
        });
      }

    } catch (error) {
      console.error('Login error:', error);
      setErrors({
        general: error.message || 'Failed to connect to server. Please check your connection.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800">
      <Header showAuth={false} />
      
      <main className="max-w-md mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg"
        >
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 text-center mb-6">
            Sign In to AGRITRACK
          </h1>

          {errors.general && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-4"
            >
              {errors.general}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="aadhar" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Aadhar Number
              </label>
              <input
                type="text"
                id="aadhar"
                name="aadhar"
                value={formData.aadhar}
                onChange={handleChange}
                placeholder="Enter 12-digit Aadhar number"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                  errors.aadhar ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                }`}
                maxLength="12"
              />
              {errors.aadhar && (
                <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.aadhar}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                  errors.password ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.password && (
                <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              className={`w-full py-3 rounded-lg font-semibold text-white transition-colors ${
                isLoading 
                  ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed' 
                  : 'bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600'
              }`}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Use the Aadhar number and password from user creation
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default SignIn;
