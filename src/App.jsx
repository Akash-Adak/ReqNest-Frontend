import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import HomePage from "./pages/HomePage";
import UploadSchema from "./components/UploadSchema";
import AppList from "./pages/AppList";
import Profile from "./pages/Profile";
import { APIDocsWrapper } from "./components/APIDocs";
import ApiTesterTabs from "./pages/ApiTesterTabs";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import Plans from "./pages/Plans";
import Footer from "./components/Footer";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<HomePage />} />

          {/* Protected Routes */}
          <Route
            path="/upload"
            element={
              <PrivateRoute>
                <UploadSchema />
              </PrivateRoute>
            }
          />
          <Route
            path="/apis"
            element={
              <PrivateRoute>
                <AppList />
              </PrivateRoute>
            }
          />
          <Route
            path="/test/:apiName"
            element={
              <PrivateRoute>
                <ApiTesterTabs />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />

           <Route
            path="/plans"
            element={
              // <PrivateRoute>
                <Plans />
              // </PrivateRoute>
            }
          />

           <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/docs/:apiName"
            element={
              // <PrivateRoute>
                <APIDocsWrapper  />
              //  </PrivateRoute> 
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer/>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
