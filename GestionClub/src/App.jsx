// src/App.jsx
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NoAccess from "./routes/NoAccess";
import PrivateRoute from "./routes/PrivateRoute";
import Layout from "./components/layout/Layout";
import MainPage from "./components/mainPage/MainPage";
import LoginPage from "./components/loginPage/LoginPage";
import RegisterPage from "./components/registerPage/RegisterPage";
import AboutUs from "./components/aboutUs/AboutUs";
import ServicePage from "./components/servicePage/servicePage";
import BookingPage from "./components/bookingPage/BookingPage";
import UserCenterPage from "./components/userCenter/UserCenterPage";
import NewsList from "./components/news/NewsList";
import NewsDashboard from "./components/news/NewsDashboard";
import NotFound from "./components/notFound/NotFound";
import ResetPassword from "./components/resetPassword/ResetPassword";
import RestorePassword from "./components/restorePassword/RestorePassword";

//MERCADOPAGO
import PagoPage from "./components/pago/PagoPage";
import SuccessPage from "./components/pago/SuccessPage";
import FailurePage from "./components/pago/FailurePage";
import PendingPage from "./components/pago/PendingPage";
import MisCuotasPage from "./components/cuotas/MisCuotasPage";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Layout>
          <MainPage />
        </Layout>
      ),
    },
    {
      path: "/login",
      element: (
        <Layout>
          <LoginPage />
        </Layout>
      ),
    },
    {
      path: "/register",
      element: (
        <Layout>
          <RegisterPage />
        </Layout>
      ),
    },
    {
      path: "/reset-password",
      element: (
        <Layout>
          <ResetPassword />
        </Layout>
      ),
    },
    {
      path: "/restore-password",
      element: (
        <Layout>
          <RestorePassword />
        </Layout>
      ),
    },
    {
      path: "/aboutUs",
      element: (
        <PrivateRoute>
          <Layout>
            <AboutUs />
          </Layout>
        </PrivateRoute>
      ),
    },
    {
      path: "/servicePage",
      element: (
        <PrivateRoute>
          <Layout>
            <ServicePage />
          </Layout>
        </PrivateRoute>
      ),
    },
    {
      path: "/booking",
      element: (
        <PrivateRoute>
          <Layout>
            <BookingPage />
          </Layout>
        </PrivateRoute>
      ),
    },
    {
      path: "/userCenter",
      element: (
        <PrivateRoute>
          <Layout>
            <UserCenterPage />
          </Layout>
        </PrivateRoute>
      ),
    },
    {
      path: "/news",
      element: (
        <Layout>
          <NewsDashboard />
        </Layout>
      ),
    },
    {
      path: "/no-access",
      element: (
        <Layout>
          <NoAccess />
        </Layout>
      ),
    },
    {
      path: "*",
      element: (
        <Layout>
          <NotFound />
        </Layout>
      ),
    },

    //MERCADOPAGO
    {
      path: "/pago",
      element: (
        <PrivateRoute>
          <Layout>
            <PagoPage />
          </Layout>
        </PrivateRoute>
      ),
    },
    {
      path: "/pago-exitoso",
      element: (
        <Layout>
          <SuccessPage />
        </Layout>
      ),
    },
    {
      path: "/pago-fallido",
      element: (
        <Layout>
          <FailurePage />
        </Layout>
      ),
    },
    {
      path: "/pago-pendiente",
      element: (
        <Layout>
          <PendingPage />
        </Layout>
      ),
    },
    {
      path: "/mis-cuotas",
      element: (
        <Layout>
          <MisCuotasPage />
        </Layout>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
