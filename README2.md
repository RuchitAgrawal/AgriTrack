# AGRITRACK - Supply Chain Transparency Prototype

A React-based frontend prototype for a blockchain-powered agricultural supply chain transparency system. This application demonstrates how farmers, distributors, and retailers can track produce from farm to table with complete transparency.

## 🚀 Features

- **Multi-Role Authentication**: Separate dashboards for Farmers, Distributors, and Retailers
- **Supply Chain Tracking**: Create and view entries at each stage of the supply chain
- **Admin Management**: Secret admin panel for user management and system oversight
- **Mock Blockchain Integration**: Uses localStorage as a mock backend (ready for real blockchain integration)
- **Responsive Design**: Built with Tailwind CSS for modern, mobile-friendly UI
- **Smooth Animations**: Framer Motion animations for enhanced user experience

## 🛠️ Tech Stack

- **Frontend**: React 19 with Vite
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Mock Backend**: Browser localStorage
- **Build Tool**: Vite

## 📦 Installation & Setup

1. **Clone/Navigate to the project directory**
   ```bash
   cd AGRITRACK
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the URL shown in your terminal)

## 🎯 Demo Credentials

The application comes with pre-seeded demo users for testing:

### Farmer
- **Aadhar**: 123456789012
- **Password**: demo123
- **Role**: Farmer

### Distributor
- **Aadhar**: 234567890123
- **Password**: demo123
- **Role**: Distributor

### Retailer
- **Aadhar**: 345678901234
- **Password**: demo123
- **Role**: Retailer

## 🗺️ Application Routes

- `/` - Landing page with application overview
- `/signin` - Authentication page for all user roles
- `/farmer/dashboard` - Farmer dashboard for crop entries
- `/distributor/dashboard` - Distributor dashboard for distribution entries
- `/retailer/dashboard` - Retailer dashboard for retail entries
- `/asdfghfdkjbwefihwedfvoijhnemdfvoi/admin` - Secret admin dashboard
- `/asdfghfdkjbwefihwedfvoijhnemdfvoi/admin/create` - Admin user creation page

## 🔧 Configuration

### Changing the Secret Admin Path
To change the secret admin route, update the paths in `src/App.jsx`:

```jsx
// Current secret path
<Route path="/asdfghfdkjbwefihwedfvoijhnemdfvoi/admin" element={<Admin />} />
<Route path="/asdfghfdkjbwefihwedfvoijhnemdfvoi/admin/create" element={<AdminCreate />} />

// Change to your preferred secret path
<Route path="/your-secret-path/admin" element={<Admin />} />
<Route path="/your-secret-path/admin/create" element={<AdminCreate />} />
```

## 🔄 Mock Data & Storage

The application uses browser localStorage with these keys:
- `agritrack_users` - User accounts
- `agritrack_forms` - Supply chain entries
- `agritrack_current` - Current session data

Data persists between browser sessions and is automatically seeded with demo users on first run.

## 🚀 Production Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Preview the build**
   ```bash
   npm run preview
   ```

3. **Deploy the `dist` folder** to your preferred hosting service (Netlify, Vercel, etc.)

## 🔮 Future Integration Points

The codebase includes TODO comments marking where to integrate real services:

### Blockchain Integration
- Replace localStorage calls in `src/utils/localStorage.js` with blockchain transactions
- Add wallet connection logic in `src/components/Header.jsx`
- Implement smart contract interactions for supply chain entries

### Database Integration
- Replace localStorage with REST API calls
- Add authentication middleware
- Implement real user management system

### Key Files for Integration
- `src/utils/localStorage.js` - All data operations
- `src/components/Dashboard.jsx` - Form creation and display
- `src/components/AdminCreate.jsx` - User creation
- `src/components/SignIn.jsx` - Authentication logic

## 📁 Project Structure

```
AGRITRACK/
├── src/
│   ├── components/
│   │   ├── Header.jsx          # Navigation header with auth
│   │   ├── Landing.jsx         # Landing page
│   │   ├── SignIn.jsx          # Authentication form
│   │   ├── Dashboard.jsx       # Role-based dashboards
│   │   ├── Admin.jsx           # Admin dashboard
│   │   └── AdminCreate.jsx     # Admin user creation
│   ├── utils/
│   │   └── localStorage.js     # Mock backend utilities
│   ├── App.jsx                 # Main app with routing
│   ├── main.jsx               # React entry point
│   └── index.css              # Tailwind CSS imports
├── package.json               # Dependencies and scripts
├── tailwind.config.js         # Tailwind configuration
├── postcss.config.js          # PostCSS configuration
└── README.md                  # This file
```

## 🎨 Design System

The application uses a green-themed color palette suitable for agricultural applications:
- Primary colors: Various shades of green (`primary-50` to `primary-900`)
- Responsive breakpoints: Mobile-first design
- Component library: Custom components with consistent styling
- Animation library: Framer Motion for smooth transitions

## 🔒 Security Notes

- Demo passwords are hardcoded for prototype purposes
- In production, implement proper password hashing
- Add CSRF protection and input validation
- Use HTTPS for all communications
- Implement proper session management

## 🤝 Contributing

This is a prototype application. For production use:
1. Replace mock localStorage with real database
2. Implement proper authentication and authorization
3. Add comprehensive error handling
4. Include unit and integration tests
5. Add proper logging and monitoring

## 📄 License

This project is a prototype for demonstration purposes.
