// import { Navigate, useLocation, useNavigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
// import { CircularProgress, Box, Typography, Button } from '@mui/material';
// import { useEffect, useState } from 'react';
// import { Home } from '@mui/icons-material';

// const ProtectedRoute = ({ children, roles = [] }) => {
//   const { user, loading, error } = useAuth(); // Added error from AuthContext
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [timeoutReached, setTimeoutReached] = useState(false);

//   // Handle authentication timeout (10 seconds)
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (loading) {
//         console.warn('Authentication check timeout');
//         setTimeoutReached(true);
//       }
//     }, 10000);

//     return () => clearTimeout(timer);
//   }, [loading]);

//   // Redirect to intended page after login
//   const redirectPath = location.state?.from?.pathname || '/dashboard';

//   if (error) {
//     return (
//       <Box 
//         display="flex" 
//         justifyContent="center" 
//         alignItems="center" 
//         minHeight="80vh"
//         flexDirection="column"
//         gap={3}
//       >
//         <Typography variant="h5" color="error">
//           Authentication Error
//         </Typography>
//         <Typography>{error.message}</Typography>
//         <Button
//           variant="contained"
//           startIcon={<Home />}
//           onClick={() => navigate('/')}
//         >
//           Return Home
//         </Button>
//       </Box>
//     );
//   }

//   if (loading && !timeoutReached) {
//     return (
//       <Box 
//         display="flex" 
//         justifyContent="center" 
//         alignItems="center" 
//         minHeight="80vh"
//         flexDirection="column"
//         gap={2}
//       >
//         <CircularProgress size={60} />
//         <Typography variant="h6">Authenticating...</Typography>
//       </Box>
//     );
//   }

//   if (!user || timeoutReached) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   if (roles.length > 0 && !roles.some(role => user.roles?.includes(role))) {
//     return (
//       <Box 
//         display="flex" 
//         justifyContent="center" 
//         alignItems="center" 
//         minHeight="80vh"
//         flexDirection="column"
//         gap={3}
//       >
//         <Typography variant="h4" color="error">
//           403 - Access Denied
//         </Typography>
//         <Typography>
//           You don't have permission to access this page
//         </Typography>
//         <Button
//           variant="contained"
//           onClick={() => navigate(redirectPath)}
//         >
//           Go to Your Dashboard
//         </Button>
//       </Box>
//     );
//   }

//   return children;
// };

// export default ProtectedRoute;