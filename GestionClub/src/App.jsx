// src/App.jsx
import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import NoAccess from './routes/NoAccess';
import PrivateRoute from './routes/PrivateRoute';
import Layout from './components/layout/Layout';
import MainPage from './components/mainPage/MainPage';
import LoginPage from './components/loginPage/LoginPage';
import RegisterPage from './components/registerPage/RegisterPage';
import AboutUs from './components/aboutUs/AboutUs';
import ServicePage from './components/servicePage/servicePage';
import BookingPage from './components/bookingPage/BookingPage';
import UserCenterPage from './components/userCenter/UserCenterPage';
import NewsList from './components/news/NewsList';
import NewsDashboard from './components/news/NewsDashboard';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Layout>
          <MainPage />
        </Layout>
      )
    },
    {
      path: "/login",
      element: (
        <Layout>
          <LoginPage />
        </Layout>
      )
    },
    {
      path: "/register",
      element: (
        <Layout>
          <RegisterPage />
        </Layout>
      )
    },
    {
      path: "/aboutUs",
      element: (
        <PrivateRoute>
          <Layout>
            <AboutUs />
          </Layout>
        </PrivateRoute>
      )
    },
    {
      path: "/servicePage",
      element: (
        <PrivateRoute>
          <Layout>
            <ServicePage />
          </Layout>
        </PrivateRoute>
      )
    },
    {
      path: "/booking",
      element: (
        <PrivateRoute>
          <Layout>
            <BookingPage />
          </Layout>
        </PrivateRoute>
      )
    },
    {
      path: "/userCenter",
      element: (
        <PrivateRoute>
          <Layout>
            <UserCenterPage />
          </Layout>
        </PrivateRoute>
      )
    },
    {
      path: "/news",
      element: (
        <Layout>
          <NewsDashboard />
        </Layout>
      )
    },
    {
      path: "/no-access",
      element: (
        <Layout>
          <NoAccess />
        </Layout>
      )
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
