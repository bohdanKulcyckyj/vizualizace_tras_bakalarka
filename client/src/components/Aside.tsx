import { FC, useState } from 'react'
import routes from '../constants/apiEndpoints';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { adminSidebarData, userSidebarData } from '../data/ProfileSidebar';
import { Link } from 'react-router-dom';
import { ISidebar } from '../interfaces/Sidebar';
import { saveTokenToCookie } from '../utils/jwt';

const Aside : FC<ISidebar> = (props) => {
  const [sidebarOpened, setSidebarOpened] = useState(window.innerWidth >= 1250);
  const toggleSidebar = () => {
      setSidebarOpened(!sidebarOpened)
  }
  const navigate = useNavigate();
  const sidebarData = props.role === "admin" ? adminSidebarData : userSidebarData;

  const handleLogout = () => {
    axios.get(routes.logout)
    .then(res => console.log(res))
    .then(() => {
      saveTokenToCookie("")
      navigate("/")
    })
    .catch(err => console.error(err))
  }

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
          {sidebarData.map((_item, _index) => {
            if(_item.url === '/logout') {
              return (<li key={_index}>
              <button
              onClick={handleLogout}
              className="profile-aside__link w-full block py-5 px-6 text-center md:font-medium whitespace-nowrap">{_item.label}</button>
              </li>)
            }
            
            return (<li key={_index}>
              <Link 
              to={_item.url}
              className={`${window.location.pathname === _item.url ? 'profile-aside__link--active' : ''} 
              profile-aside__link block py-5 px-6 text-center md:font-medium whitespace-nowrap`}>{_item.label}</Link>
            </li>
            )
          })}
        </ul>
      </div>
    </>
  )
}

export default Aside