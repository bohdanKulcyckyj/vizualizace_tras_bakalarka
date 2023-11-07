import React, { useState } from 'react'
import { adminSidebarData, userSidebarData } from '../data/ProfileSidebar';
import { Link } from 'react-router-dom';
import { ISidebar } from '../interfaces/Sidebar';

const Aside : React.FC<ISidebar> = (props) => {
  const [sidebarOpened, setSidebarOpened] = useState(window.innerWidth >= 1250);
  const toggleSidebar = () => {
      setSidebarOpened(!sidebarOpened)
  }
  const sidebarData = props.role === "admin" ? adminSidebarData : userSidebarData;

  return (
    <>
      <div 
      onClick={toggleSidebar} 
      className={`${sidebarOpened ? 'profile-aside__button--active': ''} z-2 flex relative w-6 h-[1rem]
      flex-col justify-between items-center my-auto cursor-pointer profile-aside__button gap-1`}>
        <span className='profile-aside__button-span h-0.5 w-6 transform transition duration-300 ease-in-out' />
        <span className='profile-aside__button-span h-0.5 w-6 transition-all duration-300 ease-in-out' />
        <span className='profile-aside__button-span h-0.5 w-6 transform transition duration-300 ease-in-out' />
      </div>
      <div className={`${sidebarOpened ? 'profile-aside--active mb-4' : ''} profile-aside w-full`}>
        <ul>
          {sidebarData.map((_item, _index) => (
            <li key={_index}>
              <Link 
              to={_item.url}
              className={`${window.location.pathname === _item.url ? 'profile-aside__link--active' : ''} 
              profile-aside__link block py-5 px-6 text-center md:font-medium whitespace-nowrap`}>{_item.label}</Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default Aside