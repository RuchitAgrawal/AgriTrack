import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import Header from './Header';
import { getCurrentUser, getFormsByUser, addForm } from '../utils/localStorage';

const Dashboard = () => {
  const navigate = useNavigate();
  const { role } = useParams();
  const [currentUser, setCurrentUser] = useState(null);
  const [userForms, setUserForms] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('Dashboard useEffect - checking auth for role:', role);
    
    // Validate role parameter
    if (!role || !['farmer', 'distributor', 'retailer'].includes(role)) {
      console.log('Invalid role parameter:', role);
      setIsLoading(false);
      navigate('/signin');
      return;
    }
    
    const user = getCurrentUser();
    console.log('Current user from localStorage:', user);
    
    // Authentication check
    if (!user) {
      console.log('No user found, redirecting to signin');
      setIsLoading(false);
      navigate('/signin');
      return;
    }
    
    // Role check - redirect to correct dashboard if user is on wrong role page
    if (user.role !== role) {
      console.log(`User role ${user.role} doesn't match route role ${role}, redirecting`);
      setIsLoading(false);
      navigate(`/${user.role}/dashboard`);
      return;
    }
    
    console.log('Authentication successful, setting current user');
    setCurrentUser(user);
    loadUserForms(user.id);
    setIsLoading(false);
  }, [role, navigate]);


  const loadUserForms = (userId) => {
    const forms = getFormsByUser(userId);
    setUserForms(forms);
  };

  const handleCreateForm = (e) => {
    e.preventDefault();
    if (!formData.trim()) return;

    // TODO: Replace with blockchain transaction
    const newForm = addForm(
      { content: formData },
      currentUser.role,
      currentUser.id
    );

    setUserForms(prev => [newForm, ...prev]);
    setFormData('');
    setShowCreateForm(false);
  };

  const getFormPlaceholder = () => {
    switch (role) {
      case 'farmer':
        return 'Enter crop details, harvest date, quality metrics...';
      case 'distributor':
        return 'Enter distribution details, transport info, storage conditions...';
      case 'retailer':
        return 'Enter retail details, sale date, customer info...';
      default:
        return 'Enter form details...';
    }
  };

  const getFormTitle = () => {
    switch (role) {
      case 'farmer':
        return 'Crop Production Entry';
      case 'distributor':
        return 'Distribution Entry';
      case 'retailer':
        return 'Retail Sale Entry';
      default:
        return 'New Entry';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 dark:border-primary-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null; // This should not happen due to redirects, but just in case
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 capitalize">
              {role} Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Welcome back, {currentUser.username}! Manage your supply chain entries below.
            </p>
          </div>

          {/* Create New Form Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowCreateForm(true)}
            className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold mb-8 transition-colors"
          >
            Create New Entry
          </motion.button>

          {/* Create Form Modal */}
          {showCreateForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl max-w-md w-full"
              >
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  {getFormTitle()}
                </h2>
                <form onSubmit={handleCreateForm}>
                  <textarea
                    value={formData}
                    onChange={(e) => setFormData(e.target.value)}
                    placeholder={getFormPlaceholder()}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 h-32 resize-none"
                    required
                  />
                  <div className="flex gap-3 mt-4">
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Submit
                    </motion.button>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowCreateForm(false)}
                      className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}

          {/* Forms Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {userForms.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-12"
              >
                <div className="text-gray-400 dark:text-gray-500 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No entries yet</h3>
                <p className="text-gray-600 dark:text-gray-400">Create your first supply chain entry to get started.</p>
              </motion.div>
            ) : (
              userForms.map((form, index) => (
                <motion.div
                  key={form.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${
                        role === 'farmer' ? 'bg-green-500' :
                        role === 'distributor' ? 'bg-blue-500' : 'bg-purple-500'
                      }`}></div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400 capitalize">
                        {form.role} Entry
                      </span>
                    </div>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {new Date(form.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    {form.content}
                  </p>
                  <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      ID: {form.id}
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
