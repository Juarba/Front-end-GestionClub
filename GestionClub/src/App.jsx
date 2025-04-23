import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './components/layout/Layout'
import MainPage from './components/mainPage/MainPage'
import LoginPage from './components/loginPage/LoginPage'
import RegisterPage from './components/registerPage/RegisterPage'
import AboutUs from './components/aboutUs/AboutUs'
import BookingPage from './components/bookingPage/BookingPage'
import BookingOrder from './components/bookingOrder/BookingOrder'

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Layout>
          <MainPage/>
        </Layout>
      )
    },
    {
      path: "/login",
      element: (
        <Layout>
          <LoginPage/>
        </Layout>
      )
    },
    {
      path: "/register",
      element: (
        <Layout>
          <RegisterPage/>
        </Layout>
      )
    },
    {
      path: "/aboutUs",
      element: (
        <Layout>
          <AboutUs/>
        </Layout>
      )
    },
    {
      path: "/booking",
      element: (
        <Layout>
          <BookingPage/>
        </Layout>
      )
    },
    {
      path: "/bookingOrder",
      element: (
        <Layout>
          <BookingOrder/>
        </Layout>
      )
    },
  ])

  return <RouterProvider router={router} />
}

export default App
