import React from 'react';
import Header from './Header';
import { Outlet } from 'react-router-dom';

import Loading from './Loading';

const PageLayout: React.FC = () => {
  return (
    <>
      <Header />
      <main className="main-content">
          <Loading />
          <Outlet />
      </main>
    </>
  )
}

export default PageLayout