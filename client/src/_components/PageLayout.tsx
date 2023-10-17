import React from 'react';
import { Outlet } from 'react-router-dom';

const PageLayout: React.FC = () => {
  return (
    <main className="main-content">
        <Outlet />
    </main>
  )
}

export default PageLayout