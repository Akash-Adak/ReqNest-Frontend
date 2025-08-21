import { useEffect, useState } from "react";
import { useAuth } from '../contexts/AuthContext';
import { 
  Google, 
  GitHub, 
  Logout,
  AccountCircle,
  Email,
  CalendarToday,
  WorkspacePremium,
  Security
} from '@mui/icons-material';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/user", {
      method: "GET",
      credentials: "include",
    })
      .then((r) => {
        if (r.status === 401) throw new Error("Unauthorized – Please log in");
        if (!r.ok) throw new Error("Failed to fetch profile");
        return r.json();
      })
      .then((user) => {
        setUserData(user);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md text-center max-w-md">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Authentication Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.href = "/login"}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-600">No user data found. Please try logging in again.</p>
        </div>
      </div>
    );
  }

  // Determine which provider was used
  const provider = user.avatar_url ? 'GitHub' : 'Google';
  const providerIcon = provider === 'GitHub' ? <GitHub className="h-5 w-5" /> : <Google className="h-5 w-5" />;
  
  // Check plan status
  const { tier = "FREE", planExpiry, lastLogin } = userData;
  const now = new Date();
  const expired = planExpiry ? new Date(planExpiry) < now : false;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">User Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your account and subscription</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">Profile Information</h2>
                <p className="text-gray-600 mt-1">Your personal account details</p>
              </div>
              
              <div className="p-6">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <img
                      src={user.picture || user.avatar_url}
                      alt={user.name || user.login}
                      className="h-32 w-32 rounded-full object-cover border-4 border-gray-100 shadow-sm"
                    />
                    <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
                      {providerIcon}
                      <span className="ml-2">Signed in with {provider}</span>
                    </div>
                  </div>
                  
                  {/* User Info */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{user.name || user.login}</h3>
                      <p className="text-gray-500 flex items-center mt-1">
                        <Email className="h-4 w-4 mr-2" />
                        {user.email || 'No email provided'}
                      </p>
                    </div>
                    
                    {provider === 'GitHub' && user.login && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">GitHub Profile</p>
                        <a 
                          href={`https://github.com/${user.login}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm inline-flex items-center"
                        >
                          github.com/{user.login}
                        </a>
                      </div>
                    )}
                    
                    {lastLogin && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">Last Login</p>
                        <p className="text-gray-500 flex items-center">
                          <CalendarToday className="h-4 w-4 mr-2" />
                          {new Date(lastLogin).toLocaleString()}
                        </p>
                      </div>
                    )}
                    
                    <button
                      onClick={logout}
                      className="flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors mt-4"
                    >
                      <Logout className="h-5 w-5 mr-2" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Subscription Status Card */}
          <div>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden h-full">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">Subscription Plan</h2>
                <p className="text-gray-600 mt-1">Your current membership status</p>
              </div>
              
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <WorkspacePremium className="h-6 w-6 text-blue-500 mr-2" />
                  <span className="text-lg font-medium text-gray-900">Current Plan</span>
                </div>
                
                <div className="mb-6">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    tier === "PREMIUM" ? "bg-purple-100 text-purple-800" : 
                    tier === "PRO" ? "bg-blue-100 text-blue-800" : 
                    "bg-gray-100 text-gray-800"
                  }`}>
                    {tier}
                  </div>
                </div>
                
                {tier === "FREE" && expired ? (
                  <div className="p-4 border rounded-lg bg-yellow-50 border-yellow-200">
                    <h3 className="font-semibold text-yellow-800 mb-2">Free Tier Expired</h3>
                    <p className="text-yellow-700 text-sm">
                      You've used up your free tier. Please wait until it resets, or upgrade to continue.
                    </p>
                    <div className="mt-4">
                      <button
                        onClick={() => (window.location.href = "/upgrade")}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Upgrade Plan
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 border rounded-lg bg-green-50 border-green-200">
                    <h3 className="font-semibold text-green-800 mb-2 flex items-center">
                      <Security className="h-5 w-5 mr-2" />
                      Plan Active
                    </h3>
                    <p className="text-green-700 text-sm">
                      You can continue using all available APIs and features.
                    </p>
                    {planExpiry && (
                      <p className="text-green-700 text-sm mt-2">
                        Expires: {new Date(planExpiry).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* API Usage Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <AccountCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-600">API Calls Today</h3>
                <p className="text-2xl font-bold text-gray-900">142</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-600">Success Rate</h3>
                <p className="text-2xl font-bold text-gray-900">98.2%</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-600">Avg. Response Time</h3>
                <p className="text-2xl font-bold text-gray-900">128ms</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Recent Activity</h2>
            <p className="text-gray-600 mt-1">Your API usage history</p>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div>
                  <p className="font-medium">GET /users</p>
                  <p className="text-sm text-gray-500">2 minutes ago</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">200 OK</span>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div>
                  <p className="font-medium">POST /auth/login</p>
                  <p className="text-sm text-gray-500">15 minutes ago</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">201 Created</span>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div>
                  <p className="font-medium">GET /products</p>
                  <p className="text-sm text-gray-500">1 hour ago</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">200 OK</span>
              </div>
            </div>
            
            <button className="w-full mt-4 text-center text-blue-600 hover:text-blue-800 text-sm font-medium">
              View Full Activity History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}