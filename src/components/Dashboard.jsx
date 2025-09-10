import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import Header from './Header';
import FloatingChatbot from './FloatingChatbot';
import { getCurrentUser } from '../utils/localStorage';
import apiClient from '../utils/apiClient';

const Dashboard = () => {
  const navigate = useNavigate();
  const { role } = useParams();
  const [currentUser, setCurrentUser] = useState(null);
  const [userForms, setUserForms] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    cropName: '',
    quantity: '',
    quality: '',
    price: '',
    targetEntity: '',
    date: ''
  });
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
    
    // Check both localStorage keys for user data
    let user = null;
    const currentUserData = localStorage.getItem('currentUser');
    const agritrackData = localStorage.getItem('agritrack_current');
    
    if (currentUserData) {
      user = JSON.parse(currentUserData);
    } else if (agritrackData) {
      user = JSON.parse(agritrackData);
    }
    
    console.log('Current user from localStorage:', user);
    
    // Authentication check
    if (!user) {
      console.log('No user found, redirecting to signin');
      setIsLoading(false);
      navigate('/signin');
      return;
    }
    
    // Role check - redirect to correct dashboard if user is on wrong role page
    const userRole = user.role || user.type;
    if (userRole !== role) {
      console.log(`User role ${userRole} doesn't match route role ${role}, redirecting`);
      setIsLoading(false);
      navigate(`/${userRole}/dashboard`);
      return;
    }
    
    console.log('Authentication successful, setting current user');
    setCurrentUser(user);
    // Set token for API calls
    if (localStorage.getItem('token')) {
      apiClient.setToken(localStorage.getItem('token'));
    }
    loadUserForms(user.id || user._id);
    setIsLoading(false);
  }, [role, navigate]);


  const loadUserForms = async (userId) => {
    try {
      const response = await apiClient.getTransactions();
      if (response.success) {
        setUserForms(response.transactions);
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  const handleCreateForm = async (e) => {
    e.preventDefault();
    if (!formData.cropName.trim() || !formData.quantity.trim() || !formData.quality.trim() || 
        !formData.price.trim() || !formData.targetEntity.trim() || !formData.date.trim()) return;

    try {
      const response = await apiClient.createTransaction({
        cropName: formData.cropName,
        quantity: formData.quantity,
        quality: formData.quality,
        price: formData.price,
        targetEntity: formData.targetEntity,
        date: formData.date
      });

      if (response.success) {
        setUserForms(prev => [response.transaction, ...prev]);
        setFormData({
          cropName: '',
          quantity: '',
          quality: '',
          price: '',
          targetEntity: '',
          date: ''
        });
        setShowCreateForm(false);
      }
    } catch (error) {
      console.error('Error creating transaction:', error);
      alert('Failed to create transaction. Please try again.');
    }
  };

  const getTargetEntityLabel = () => {
    switch (role) {
      case 'farmer':
        return 'Distributor ID';
      case 'distributor':
        return 'Retailer ID';
      case 'retailer':
        return 'Consumer ID';
      default:
        return 'Target Entity ID';
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
              >
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  {getFormTitle()}
                </h2>
                <form onSubmit={handleCreateForm} className="space-y-4">
                  {/* Crop Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Crop Name
                    </label>
                    <input
                      type="text"
                      value={formData.cropName}
                      onChange={(e) => handleInputChange('cropName', e.target.value)}
                      placeholder="Enter crop name (e.g., Rice, Wheat, Tomato)"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      required
                    />
                  </div>

                  {/* Quantity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Quantity
                    </label>
                    <input
                      type="text"
                      value={formData.quantity}
                      onChange={(e) => handleInputChange('quantity', e.target.value)}
                      placeholder="Enter quantity (e.g., 100 kg, 50 tons)"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      required
                    />
                  </div>

                  {/* Quality */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Quality
                    </label>
                    <select
                      value={formData.quality}
                      onChange={(e) => handleInputChange('quality', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      required
                    >
                      <option value="">Select quality grade</option>
                      <option value="Premium">Premium</option>
                      <option value="Grade A">Grade A</option>
                      <option value="Grade B">Grade B</option>
                      <option value="Standard">Standard</option>
                      <option value="Organic">Organic</option>
                    </select>
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Price
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      placeholder="Enter price per unit"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      required
                    />
                  </div>

                  {/* Target Entity (Dynamic based on role) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {getTargetEntityLabel()}
                    </label>
                    <input
                      type="text"
                      value={formData.targetEntity}
                      onChange={(e) => handleInputChange('targetEntity', e.target.value)}
                      placeholder={`Enter ${getTargetEntityLabel().toLowerCase()}`}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      required
                    />
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      required
                    />
                  </div>

                  <div className="flex gap-3 mt-6">
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
                  <div className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed space-y-1">
                    {form.cropDetails ? (
                      <>
                        <p><strong>Crop:</strong> {form.cropDetails.cropName}</p>
                        <p><strong>Quantity:</strong> {form.cropDetails.quantity}</p>
                        <p><strong>Quality:</strong> {form.cropDetails.quality}</p>
                        <p><strong>Price:</strong> ₹{form.cropDetails.price}</p>
                        <p><strong>{role === 'farmer' ? 'Distributor' : role === 'distributor' ? 'Retailer' : 'Consumer'}:</strong> {form.targetEntity?.entityId}</p>
                        <p><strong>Date:</strong> {new Date(form.transactionDate).toLocaleDateString()}</p>
                        <p><strong>Status:</strong> <span className={`capitalize ${form.status === 'confirmed' ? 'text-green-600' : form.status === 'pending' ? 'text-yellow-600' : 'text-gray-600'}`}>{form.status}</span></p>
                      </>
                    ) : form.content && typeof form.content === 'object' ? (
                      <>
                        <p><strong>Crop:</strong> {form.content.cropName}</p>
                        <p><strong>Quantity:</strong> {form.content.quantity}</p>
                        <p><strong>Quality:</strong> {form.content.quality}</p>
                        <p><strong>Price:</strong> ₹{form.content.price}</p>
                        <p><strong>{role === 'farmer' ? 'Distributor' : role === 'distributor' ? 'Retailer' : 'Consumer'}:</strong> {form.content.targetEntity}</p>
                        <p><strong>Date:</strong> {form.content.date}</p>
                      </>
                    ) : (
                      <p>{form.content}</p>
                    )}
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      ID: {form.transactionId || form.id}
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </main>
      
      {/* Floating Chatbot */}
      <FloatingChatbot />
    </div>
  );
};

export default Dashboard;
