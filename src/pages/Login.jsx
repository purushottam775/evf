import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaUser, FaLock, FaGoogle } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [emailError, setEmailError] = useState('');
  
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    
    // Clear errors when user starts typing
    if (emailError) {
      setEmailError('');
    }
    
    // Real-time validation
    if (value && !validateEmail(value)) {
      setEmailError('Please enter a valid email address');
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    
    // Clear error message when user starts typing
    
    // Real-time validation
    if (value && value.length < 6) {
      // Don't show error immediately, wait for form submission
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate email before submission
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      setShake(true);
      setTimeout(() => setShake(false), 650);
      
      // Show popup immediately
      showPopup('Please enter a valid email address', 'error');
      return;
    }

    // Validate password
    if (password.length < 6) {
      setShake(true);
      setTimeout(() => setShake(false), 650);
      
      // Show popup immediately
      showPopup('Password must be at least 6 characters long', 'error');
      return;
    }

    setLoading(true);

    try {
      const result = await login(email, password, isAdmin);
      
      if (result.success) {
        if (result.user.isAdmin || result.user.role === 'super admin' || result.user.role === 'station manager') {
          navigate('/admin/dashboard');
        } else {
          navigate('/user/dashboard');
        }
      } else {
        // Show shake animation and popup immediately
        setShake(true);
        setTimeout(() => setShake(false), 650);
        
        // Show popup immediately - no delay
        showPopup('Invalid credentials. Please check your email and password.', 'error');
      }
    } catch (error) {
      // Show shake animation and popup immediately
      console.error('Login error caught in component:', error);
      setShake(true);
      setTimeout(() => setShake(false), 650);
      
      // Show popup immediately - no delay
      showPopup('Login failed. Please check your credentials and try again.', 'error');
    }
    
    setLoading(false);
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    const result = await googleLogin(credentialResponse);
    
    if (result.success) {
      navigate('/user/dashboard');
    }
    
    setLoading(false);
  };

  const handleGoogleError = () => {
    console.log('Google Login Failed');
  };

  // Enhanced popup function with multiple fallbacks
  const showPopup = (message, type = 'error') => {
    console.log(`Showing ${type} popup:`, message);
    
    // Set error message state for visual display
    
    // Method 1: Try toast notification
    try {
      if (type === 'error') {
        toast.error(message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          style: {
            backgroundColor: '#fee2e2',
            color: '#991b1b',
            fontWeight: '600',
            border: '2px solid #dc2626',
            fontSize: '15px',
            boxShadow: '0 8px 20px rgba(220, 38, 38, 0.25)',
            zIndex: 99999,
          }
        });
      } else {
        toast.success(message, {
          position: "top-center",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          style: {
            backgroundColor: '#d1fae5',
            color: '#065f46',
            fontWeight: '600',
            border: '2px solid #10b981',
            fontSize: '15px',
            boxShadow: '0 8px 20px rgba(16, 185, 129, 0.25)',
            zIndex: 99999,
          }
        });
      }
      console.log('Toast notification sent successfully');
      return true;
    } catch (error) {
      console.error('Toast failed:', error);
      
      // Method 2: Try browser alert
      try {
        alert(message);
        console.log('Browser alert shown successfully');
        return true;
      } catch (alertError) {
        console.error('Alert failed:', alertError);
        
        // Method 3: Try console log as last resort
        console.error('FALLBACK MESSAGE:', message);
        return false;
      }
    }
  };


  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-cyan-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full animate-fade-in">
          <div className={`bg-white rounded-2xl shadow-2xl p-8 hover-lift ${shake ? 'animate-shake' : ''}`}>
            {/* Header */}
            <div className="text-center mb-8">
              <div className="mx-auto h-16 w-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mb-4 shadow-glow">
                <span className="text-3xl">⚡</span>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-cyan-600 bg-clip-text text-transparent">
                Welcome Back
              </h2>
              <p className="mt-2 text-gray-600">Sign in to your account</p>
            </div>

            {/* Google Sign-In - Temporarily disabled */}
            {/* Uncomment when you have a valid Google Client ID */}
            {false && !isAdmin && (
              <div className="mb-6">
                <div className="flex items-center justify-center mb-4">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    size="large"
                    text="signin_with"
                    shape="rectangular"
                    logo_alignment="left"
                  />
                </div>
                
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500 font-medium">Or continue with email</span>
                  </div>
                </div>
              </div>
            )}

            {/* Regular Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6" noValidate role="form" aria-label="Login form">
              {/* Hidden status element for screen readers */}
              <div id="login-status" className="sr-only" aria-live="polite" aria-atomic="true"></div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  <FaUser className="inline mr-2 text-green-600" />
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={handleEmailChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition hover:border-green-300 ${
                    emailError ? 'border-red-400' : 'border-gray-200'
                  }`}
                  placeholder="your@email.com"
                  title="Enter your registered email address"
                  aria-describedby={emailError ? "email-error" : undefined}
                  autoComplete="email"
                />
                {emailError && (
                  <p id="email-error" className="text-xs text-red-500 mt-1" role="alert">{emailError}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  <FaLock className="inline mr-2 text-green-600" />
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition hover:border-green-300"
                  placeholder="••••••••"
                  minLength="6"
                  title="Enter your password (minimum 6 characters)"
                  autoComplete="current-password"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isAdmin"
                    checked={isAdmin}
                    onChange={(e) => setIsAdmin(e.target.checked)}
                    className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded cursor-pointer"
                  />
                  <label htmlFor="isAdmin" className="ml-3 block text-sm text-gray-700 font-medium cursor-pointer">
                    Login as Admin
                  </label>
                </div>

                <div className="text-sm">
                  <Link to="/forgot-password" className="text-green-600 hover:text-green-700 font-semibold transition">
                    Forgot password?
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition duration-300 shadow-lg hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
                aria-describedby="login-status"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Register Link */}
            <div className="mt-6 text-center space-y-2">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="text-green-600 hover:text-green-700 font-semibold transition">
                  Create account
                </Link>
              </p>
              <p className="text-gray-600">
                Forgot your password?{' '}
                <Link to="/forgot-password" className="text-blue-600 hover:text-blue-700 font-semibold transition">
                  Reset password
                </Link>
              </p>
            </div>


            {/* Quick Info */}
            <div className="mt-8 p-4 bg-gradient-to-r from-green-50 to-cyan-50 rounded-lg border border-green-200">
              <p className="text-sm text-gray-700 text-center">
                <span className="font-semibold text-green-700">⚡ Quick Tip:</span> Use Google Sign-In for faster access!
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Login;
