import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Header from './Header';
import { getUsers, getForms } from '../utils/localStorage';

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [forms, setForms] = useState([]);
  const [activeTab, setActiveTab] = useState('entries');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setUsers(getUsers());
    setForms(getForms());
  };

  const groupFormsByRole = (forms) => {
    return forms.reduce((acc, form) => {
      if (!acc[form.role]) {
        acc[form.role] = [];
      }
      acc[form.role].push(form);
      return acc;
    }, {});
  };

  const groupedForms = groupFormsByRole(forms);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header showAuth={false} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage users and monitor supply chain entries across the platform.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex space-x-1 bg-gray-200 dark:bg-gray-700 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('entries')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'entries'
                    ? 'bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                Entries
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'users'
                    ? 'bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                Users
              </button>
            </div>

            <Link to="/asdfghfdkjbwefihwedfvoijhnemdfvoi/admin/create">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Create User
              </motion.button>
            </Link>
          </div>

          {/* Entries Tab */}
          {activeTab === 'entries' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid gap-8">
                {Object.keys(groupedForms).length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 dark:text-gray-500 mb-4">
                      <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No entries yet</h3>
                    <p className="text-gray-600 dark:text-gray-400">Supply chain entries will appear here as users create them.</p>
                  </div>
                ) : (
                  Object.entries(groupedForms).map(([role, roleForms]) => (
                    <div key={role} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 capitalize mb-4">
                        {role} Entries ({roleForms.length})
                      </h2>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {roleForms.map((form) => (
                          <motion.div
                            key={form.id}
                            whileHover={{ scale: 1.02 }}
                            className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 p-4 rounded-lg"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className={`w-3 h-3 rounded-full ${
                                role === 'farmer' ? 'bg-green-500' :
                                role === 'distributor' ? 'bg-blue-500' : 'bg-purple-500'
                              }`}></div>
                              <span className="text-xs text-gray-400 dark:text-gray-500">
                                {new Date(form.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-2">
                              {form.content}
                            </p>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              ID: {form.id} | User: {form.userId}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    All Users ({users.length})
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Aadhar
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Address
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Wallet ID
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {users.map((user) => (
                        <motion.tr
                          key={user.id}
                          whileHover={{ backgroundColor: 'var(--tw-color-gray-50)' }}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {user.username}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              ID: {user.id}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.role === 'farmer' ? 'bg-green-100 text-green-800' :
                              user.role === 'distributor' ? 'bg-blue-100 text-blue-800' :
                              'bg-purple-100 text-purple-800'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                            {user.aadhar}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 max-w-xs truncate">
                            {user.address}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                            {user.walletId || 'Not connected'}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default Admin;
