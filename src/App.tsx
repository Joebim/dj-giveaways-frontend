import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { useAuthStore } from './store/useAuthStore';

// Components
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout/AdminLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';

// Pages
import Home from './pages/Home/Home';
import Competitions from './pages/Competitions/CompetitionsList';
import CompetitionDetail from './pages/CompetitionDetail/CompetitionDetail';
import Cart from './pages/Cart/Cart';
import Checkout from './pages/Checkout/Checkout';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import AdminLogin from './pages/Auth/AdminLogin';
import Profile from './pages/Profile/Profile';
import Winners from './pages/Winners/Winners';
import About from './pages/About/About';
import HowItWorks from './pages/HowItWorks/HowItWorks';
import Contact from './pages/Contact/Contact';
import Draws from './pages/Draws/Draws';
import TermsAndConditions from './pages/Legal/TermsAndConditions';
import TermsOfUse from './pages/Legal/TermsOfUse';
import AcceptableUse from './pages/Legal/AcceptableUse';
import PrivacyPolicy from './pages/Legal/PrivacyPolicy';
import FAQ from './pages/Support/FAQ';
import Complaints from './pages/Support/Complaints';

// Admin Pages
import AdminDashboard from './pages/Admin/Dashboard/Dashboard';
import AdminCompetitions from './pages/Admin/Competitions/Competitions';
import AdminCompetitionForm from './pages/Admin/Competitions/CompetitionForm';
import AdminDraws from './pages/Admin/Draws/Draws';
import AdminChampions from './pages/Admin/Champions/Champions';
import AdminUsers from './pages/Admin/Users/Users';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
            <Routes>
              {/* Public Routes */}
          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />
          <Route
            path="/competitions"
            element={
              <Layout>
                <Competitions />
              </Layout>
            }
          />
          <Route
            path="/competitions/:id"
            element={
              <Layout>
                <CompetitionDetail />
              </Layout>
            }
          />
          <Route
            path="/cart"
            element={
              <Layout>
                <Cart />
              </Layout>
            }
          />
          <Route
            path="/winners"
            element={
              <Layout>
                <Winners />
              </Layout>
            }
          />
          <Route
            path="/draws"
            element={
              <Layout>
                <Draws />
              </Layout>
            }
          />
          <Route
            path="/about"
            element={
              <Layout>
                <About />
              </Layout>
            }
          />
          <Route
            path="/how-it-works"
            element={
              <Layout>
                <HowItWorks />
              </Layout>
            }
          />
          <Route
            path="/contact"
            element={
              <Layout>
                <Contact />
              </Layout>
            }
          />
          {/* Legal Pages - Old routes (backward compatibility) */}
          <Route
            path="/terms"
            element={
              <Layout>
                <TermsAndConditions />
              </Layout>
            }
          />
          <Route
            path="/terms-of-use"
            element={
              <Layout>
                <TermsOfUse />
              </Layout>
            }
          />
          <Route
            path="/acceptable-use"
            element={
              <Layout>
                <AcceptableUse />
              </Layout>
            }
          />
          <Route
            path="/privacy"
            element={
              <Layout>
                <PrivacyPolicy />
              </Layout>
            }
          />
          <Route
            path="/faq"
            element={
              <Layout>
                <FAQ />
              </Layout>
            }
          />
          <Route
            path="/complaints"
            element={
              <Layout>
                <Complaints />
              </Layout>
            }
          />
          
          {/* Legal Pages - New routes with /legal/ prefix */}
          <Route
            path="/legal/terms"
            element={
              <Layout>
                <TermsAndConditions />
              </Layout>
            }
          />
          <Route
            path="/legal/terms-of-use"
            element={
              <Layout>
                <TermsOfUse />
              </Layout>
            }
          />
          <Route
            path="/legal/acceptable-use"
            element={
              <Layout>
                <AcceptableUse />
              </Layout>
            }
          />
          <Route
            path="/legal/privacy"
            element={
              <Layout>
                <PrivacyPolicy />
              </Layout>
            }
          />
          
          {/* Support Pages - New routes with /support/ prefix */}
          <Route
            path="/support/faq"
            element={
              <Layout>
                <FAQ />
              </Layout>
            }
          />
          <Route
            path="/support/complaints"
            element={
              <Layout>
                <Complaints />
              </Layout>
            }
          />

              {/* Auth Routes */}
          <Route
            path="/auth/login"
            element={
              <Layout>
                <Login />
              </Layout>
            }
          />
          <Route
            path="/auth/register"
            element={
              <Layout>
                <Register />
              </Layout>
            }
          />
          <Route
            path="/auth/admin/login"
            element={<AdminLogin />}
          />

              {/* Protected Routes */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                <Layout>
                    <Profile />
                </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                <Layout>
                    <Checkout />
                </Layout>
                  </ProtectedRoute>
                }
              />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/competitions"
            element={
              <AdminRoute>
                <AdminLayout>
                  <AdminCompetitions />
                </AdminLayout>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/competitions/add"
            element={
              <AdminRoute>
                <AdminLayout>
                  <AdminCompetitionForm />
                </AdminLayout>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/competitions/edit/:id"
            element={
              <AdminRoute>
                <AdminLayout>
                  <AdminCompetitionForm />
                </AdminLayout>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/draws"
            element={
              <AdminRoute>
                <AdminLayout>
                  <AdminDraws />
                </AdminLayout>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/champions"
            element={
              <AdminRoute>
                <AdminLayout>
                  <AdminChampions />
                </AdminLayout>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminLayout>
                  <AdminUsers />
                </AdminLayout>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/*"
            element={
              <AdminRoute>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </AdminRoute>
            }
          />
            </Routes>
      </Router>

          {/* Toast Notifications - Custom Styled */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#101e2e',
                color: '#ffffff',
                border: '2px solid #E3B03E',
                borderRadius: '8px',
                padding: '16px',
                boxShadow: '0 0 20px rgba(227, 176, 62, 0.3), 0 0 40px rgba(227, 176, 62, 0.2)',
                fontFamily: 'Raleway, sans-serif',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#E3B03E',
                  secondary: '#101e2e',
                },
                style: {
                  background: '#101e2e',
                  color: '#ffffff',
                  border: '2px solid #E3B03E',
                  borderRadius: '8px',
                  boxShadow: '0 0 20px rgba(227, 176, 62, 0.3)',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#101e2e',
                },
                style: {
                  background: '#101e2e',
                  color: '#ffffff',
                  border: '2px solid #EF4444',
                  borderRadius: '8px',
                  boxShadow: '0 0 20px rgba(239, 68, 68, 0.3)',
                },
              },
            }}
          />

      {/* React Query Devtools */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;