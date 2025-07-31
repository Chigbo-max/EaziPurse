# EaziPurse Frontend

A modern, futuristic React frontend for the EaziPurse digital wallet application. Built with React, Redux Toolkit Query, Tailwind CSS, and Framer Motion.

## 🚀 Features

- **Futuristic Design**: Modern, glass-morphism UI with financial theme
- **Mobile Responsive**: Fully responsive design for all devices
- **RTK Query**: Efficient API calls with caching and real-time updates
- **Authentication**: Secure login/register with JWT tokens
- **Wallet Management**: Fund wallet, transfer money, view balance
- **Profile Management**: Update personal information and settings
- **Real-time Updates**: Live balance and transaction updates
- **Smooth Animations**: Framer Motion animations for better UX

## 🛠️ Tech Stack

- **React 18** - UI library
- **Redux Toolkit** - State management
- **RTK Query** - API data fetching and caching
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Heroicons** - Icons
- **React Hot Toast** - Notifications

## 📱 Pages & Components

### Authentication
- **Login** - User authentication with username/password
- **Register** - New user registration with validation

### Dashboard
- **Overview** - Financial summary and quick actions
- **Statistics** - Balance, transactions, and insights
- **Recent Activity** - Latest transactions

### Wallet
- **Balance Display** - Current balance with account details
- **Fund Wallet** - Add money via Paystack integration
- **Transfer Money** - Send money to other users
- **Transaction History** - View all transactions

### Profile
- **Personal Information** - View and edit profile details
- **Security Settings** - Two-factor authentication, password change
- **Preferences** - Notification settings

## 🎨 Design System

### Colors
- **Primary**: Blue gradient (#0ea5e9 to #0369a1)
- **Success**: Green gradient (#22c55e to #15803d)
- **Warning**: Orange gradient (#f59e0b to #b45309)
- **Danger**: Red gradient (#ef4444 to #b91c1c)
- **Gold**: Gold gradient for balance display
- **Dark**: Dark theme for professional look

### Components
- **Glass Effect**: Backdrop blur with transparency
- **Gradient Cards**: Beautiful gradient backgrounds
- **Animated Buttons**: Hover and tap animations
- **Floating Elements**: Subtle floating animations

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Backend server running on localhost:8000

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd eazi-purse-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_ENVIRONMENT=development
```

### Backend Integration
The frontend is configured to work with the Django backend:
- **Base URL**: `http://localhost:8000`
- **Authentication**: JWT tokens
- **API Endpoints**: RESTful API calls

## 📱 Mobile Responsiveness

The application is fully responsive with:
- **Mobile First**: Designed for mobile devices first
- **Tablet Support**: Optimized for tablet screens
- **Desktop Experience**: Enhanced desktop interface
- **Touch Friendly**: Large touch targets and gestures

## 🎯 Key Features

### Authentication Flow
1. User registers with personal information
2. Login with username/password
3. JWT tokens stored securely
4. Protected routes with authentication

### Wallet Operations
1. **Fund Wallet**: 
   - Enter amount (minimum ₦1,000)
   - Redirect to Paystack payment
   - Automatic balance update
   
2. **Transfer Money**:
   - Enter recipient account number
   - Specify amount
   - Instant transfer with confirmation

### Real-time Updates
- Balance updates automatically
- Transaction history refreshes
- Profile changes reflect immediately

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Protected Routes**: Unauthorized access prevention
- **Input Validation**: Client-side form validation
- **Error Handling**: Graceful error messages
- **Secure Storage**: Local storage for tokens

## 🎨 UI/UX Highlights

### Futuristic Design
- **Glass Morphism**: Modern glass effect cards
- **Gradient Backgrounds**: Beautiful color gradients
- **Smooth Animations**: Framer Motion animations
- **Professional Typography**: Inter and Poppins fonts

### Financial Theme
- **Trust & Security**: Professional, trustworthy appearance
- **Wealth & Success**: Gold accents and positive colors
- **Stability**: Calm, stable design elements
- **Confidence**: Clean, organized interface

## 📊 Performance

- **RTK Query Caching**: Efficient data fetching
- **Code Splitting**: Lazy loading for better performance
- **Optimized Images**: Compressed and optimized assets
- **Minimal Bundle**: Tree shaking and optimization

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify/Vercel
1. Connect your repository
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Deploy!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**EaziPurse Frontend** - Your Digital Financial Companion 🚀 