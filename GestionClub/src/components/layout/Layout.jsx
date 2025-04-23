import React from 'react'
import LayoutNav from '../layoutNav/LayoutNav'
import LayoutFooter from '../layoutFooter/LayoutFooter'

const Layout = ({ children }) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <LayoutNav />
      <div className="flex-grow-1">
        {children}
      </div>
      <LayoutFooter />
    </div>
  )
}

export default Layout