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
import NewsDashboard from "./components/news/NewsDashboard";
import NotFound from "./components/notFound/NotFound";
import ResetPassword from "./components/resetPassword/ResetPassword";
import RestorePassword from "./components/restorePassword/RestorePassword";

import ManagerDashboard from "./components/managerDashboard/ManagerDashboard";

import MisReservas from "./components/misReservas/misReservas";


//MERCADOPAGO
import PagoPage from "./components/pago/PagoPage";
import SuccessPage from "./components/pago/SuccessPage";
import FailurePage from "./components/pago/FailurePage";
import PendingPage from "./components/pago/PendingPage";
import MisCuotasPage from "./components/cuotas/MisCuotasPage";
import MonthlyFee from "./components/monthlyFee/MonthlyFee";
import Availability from "./components/availabilityPage/Availability";
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
        <Layout>
          <AboutUs />
        </Layout>
      ),
    },
    {
      path: "/servicePage",
      element: (
        <PrivateRoute allowedRoles={["Admin"]}>
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
        <PrivateRoute allowedRoles={["Admin", "Gerente"]}>
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
      path: "/monthlyFee",
      element: (
        <Layout>
          <MonthlyFee />
        </Layout>
      ),
    },
    {
      path: "/managerDashboard",
      element: (
        <Layout>
          <ManagerDashboard />
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
    {
      path: "/misReservas",
      element: (
        <Layout>
          <MisReservas />
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
    {
      path: "/disponibilidades",
      element: (
        <PrivateRoute allowedRoles={["Admin", "Gerente"]}>
          <Layout>
            <Availability />
          </Layout>
        </PrivateRoute>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
