import { useEffect, useState } from "react";
import { useAuth } from '../contexts/AuthContext';
import { 
  Google, GitHub, Logout, AccountCircle, Email,
  CalendarToday, WorkspacePremium, Security
} from '@mui/icons-material';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:8080/api/user", { credentials: "include" }),
      fetch("http://localhost:8080/api/user/stats", { credentials: "include" })
    ])
    .then(async ([userRes, statsRes]) => {
      if (userRes.status === 401) throw new Error("Unauthorized – Please log in");
      if (!userRes.ok) throw new Error("Failed to fetch profile");
      if (!statsRes.ok) throw new Error("Failed to fetch stats");

      const userData = await userRes.json();
      const statsData = await statsRes.json();
      setUserData(userData);
      setStats(statsData);
      setLoading(false);
    })
    .catch(err => {
      setError(err.message);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;
  }

  if (!userData) return null;

  const provider = user.avatar_url ? 'GitHub' : 'Google';
  const { tier = "FREE", planExpiry, lastLogin } = userData;
  const now = new Date();
  const expired = planExpiry ? new Date(planExpiry) < now : false;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <h1 className="text-3xl font-bold mb-4">User Dashboard</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
            <div className="flex gap-6">
              <img src={user.picture || user.avatar_url} className="h-32 w-32 rounded-full" />
              <div>
                <h3 className="text-lg font-medium">{user.name || user.login}</h3>
                <p className="text-gray-500 flex items-center"><Email className="h-4 w-4 mr-2" /> {user.email}</p>
                {lastLogin && (
                  <p className="text-gray-500 flex items-center mt-2"><CalendarToday className="h-4 w-4 mr-2" /> {new Date(lastLogin).toLocaleString()}</p>
                )}
                <button onClick={logout} className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg">Sign Out</button>
              </div>
            </div>
          </div>

          {/* Subscription */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Subscription Plan</h2>
            <span className={`px-3 py-1 rounded-full ${tier === "PREMIUM" ? "bg-purple-100 text-purple-800" : tier === "PRO" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`}>{tier}</span>
            {expired ? (
              <div className="mt-4 p-3 bg-yellow-100 text-yellow-800 rounded-lg">Your free plan has expired.</div>
            ) : (
              <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-lg">Plan Active {planExpiry && `(expires: ${new Date(planExpiry).toLocaleDateString()})`}</div>
            )}
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-xl shadow-sm">
              <h3 className="text-sm text-gray-600">API Calls Today</h3>
              <p className="text-2xl font-bold">{stats.callsToday}</p>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm">
              <h3 className="text-sm text-gray-600">Success Rate</h3>
            <p className="text-2xl font-bold">
                {stats.successRate ? stats.successRate.toFixed(1) : 0}%
              </p>
              <p className="text-2xl font-bold">
                {stats.avgResponseTime ? stats.avgResponseTime.toFixed(1) : 0} ms
              </p>

            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm">
              <h3 className="text-sm text-gray-600">Avg. Response Time</h3>
              <p className="text-2xl font-bold">{stats.avgResponseTime} ms</p>
            </div>
          </div>
        )}

        {/* Activity */}
        {stats?.recentActivity && (
          <div className="mt-8 bg-white rounded-xl shadow-sm">
            <h2 className="p-6 border-b text-xl font-semibold">Recent Activity</h2>
            <div className="p-6 space-y-3">
              {stats.recentActivity.map((act, i) => (
                <div key={i} className="flex justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">{act.method} {act.endpoint}</p>
                    <p className="text-sm text-gray-500">{new Date(act.timestamp).toLocaleString()}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${act.status < 400 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{act.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
