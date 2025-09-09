// localStorage utilities for AGRITRACK
// TODO: Replace with real database/blockchain calls later

const STORAGE_KEYS = {
  USERS: 'agritrack_users',
  FORMS: 'agritrack_forms', 
  CURRENT: 'agritrack_current'
};

// Initialize with demo seed data on first run
export const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    const seedUsers = [
      {
        id: '1',
        username: 'farmer_demo',
        aadhar: '123456789012',
        password: 'demo123',
        role: 'farmer',
        address: '123 Farm Road, Village ABC',
        walletId: 'wallet_farmer_001'
      },
      {
        id: '2', 
        username: 'distributor_demo',
        aadhar: '234567890123',
        password: 'demo123',
        role: 'distributor',
        address: '456 Distribution Center, City XYZ',
        walletId: 'wallet_dist_001'
      },
      {
        id: '3',
        username: 'retailer_demo', 
        aadhar: '345678901234',
        password: 'demo123',
        role: 'retailer',
        address: '789 Retail Street, Town PQR',
        walletId: 'wallet_retail_001'
      }
    ];
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(seedUsers));
    console.log('Initialized demo users:', seedUsers);
  } else {
    console.log('Users already exist in localStorage');
  }

  if (!localStorage.getItem(STORAGE_KEYS.FORMS)) {
    localStorage.setItem(STORAGE_KEYS.FORMS, JSON.stringify([]));
  }
};

// User management
export const getUsers = () => {
  const users = localStorage.getItem(STORAGE_KEYS.USERS);
  return users ? JSON.parse(users) : [];
};

export const addUser = (user) => {
  const users = getUsers();
  const newUser = {
    ...user,
    id: Date.now().toString()
  };
  users.push(newUser);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  return newUser;
};

export const authenticateUser = (aadhar, password, role) => {
  const users = getUsers();
  console.log('Available users:', users);
  console.log('Searching for:', { aadhar, password, role });
  
  const foundUser = users.find(user => 
    user.aadhar === aadhar && 
    user.password === password && 
    user.role === role
  );
  
  console.log('Found user:', foundUser);
  return foundUser;
};

// Session management
export const getCurrentUser = () => {
  const current = localStorage.getItem(STORAGE_KEYS.CURRENT);
  return current ? JSON.parse(current) : null;
};

export const setCurrentUser = (user) => {
  localStorage.setItem(STORAGE_KEYS.CURRENT, JSON.stringify(user));
};

export const clearCurrentUser = () => {
  localStorage.removeItem(STORAGE_KEYS.CURRENT);
};

// Forms management
export const getForms = () => {
  const forms = localStorage.getItem(STORAGE_KEYS.FORMS);
  return forms ? JSON.parse(forms) : [];
};

export const addForm = (formData, userRole, userId) => {
  const forms = getForms();
  const newForm = {
    id: Date.now().toString(),
    ...formData,
    role: userRole,
    userId: userId,
    createdAt: new Date().toISOString()
  };
  forms.push(newForm);
  localStorage.setItem(STORAGE_KEYS.FORMS, JSON.stringify(forms));
  return newForm;
};

export const getFormsByRole = (role) => {
  const forms = getForms();
  return forms.filter(form => form.role === role);
};

export const getFormsByUser = (userId) => {
  const forms = getForms();
  return forms.filter(form => form.userId === userId);
};

// Validation helpers
export const validateAadhar = (aadhar) => {
  // Loose validation - 12 digits
  return /^\d{12}$/.test(aadhar);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};
