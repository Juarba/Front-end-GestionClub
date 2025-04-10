import React from 'react'
import LayoutNav from '../layoutNav/LayoutNav'
import LayoutFooter from '../layoutFooter/LayoutFooter'

const Layout = ({ children }) => {
  return (
    <div>
        <LayoutNav/>
        {children}
        <LayoutFooter/>
    </div>
  )
}

export default Layout