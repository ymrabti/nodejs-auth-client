import React, { Fragment } from 'react'

import { Navbar, Footer } from './partials'
import AuthModal from './auth/AuthModal'

const Layout = ({ children }) => {
  return (
    <Fragment>
      <div className='flex-grow wrapper'>
        <Navbar />
        <div style={{ height: 200 }} ></div>
        <AuthModal />
        {children}
      </div>
      <Footer />
    </Fragment>
  )
}

export default Layout