import React, { useState, useEffect } from 'react'
import axios from 'axios'
import apiEndpoints from '../constants/apiEndpoints'
import routes from '../constants/routes'
import { saveTokenToCookie } from '../utils/jwt'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../assets/images/logo-short.svg'
import { FaUserCircle } from 'react-icons/fa'
import { RiLogoutBoxRLine } from 'react-icons/ri'
import { IconContext } from 'react-icons'
import { useLocation } from 'react-router-dom'
import { useMainContext } from '../context/MainContext'

const Header: React.FC = (props) => {
  const navigate = useNavigate()
  const { loggedUser, setLoggedUser } = useMainContext()
  const [isMenuOpened, setIsMenuOpened] = useState(false)
  const location = useLocation()

  const toggleMobileMenu = (): void => {
    const width = window.innerWidth
    if (width < 1450) {
      setIsMenuOpened(!isMenuOpened)
    }
  }

  const isLinkActive = (path: string): boolean => {
    return path === location.pathname
  }

  const handleLogout = () => {
    axios
      .get(apiEndpoints.logout)
      .then((res) => console.log(res))
      .then(() => {
        saveTokenToCookie('')
        setLoggedUser(null)
        sessionStorage.removeItem('loggedUser')
        navigate('/')
      })
      .catch((err) => console.error(err))
  }

  useEffect(() => {
    const handleScrollingNavigation = () => {
      const header = document.querySelector('.header')
      if (window.pageYOffset > 0) {
        header.classList.add('header--scroll')
      } else {
        header.classList.remove('header--scroll')
      }
    }

    window.addEventListener('scroll', handleScrollingNavigation)
    return () => {
      window.removeEventListener('scroll', handleScrollingNavigation)
    }
  }, [])

  return (
    <header className='header fixed top-0 left-0 w-full'>
      <div className='header__container mx-auto px-[1.5rem] md:px-[4rem] py-2 w-full'>
        <Link to='/' className='header__logo'>
          <img
            className='w-auto object-cover'
            src={Logo}
            alt='WanderMap3D logo'
          />
        </Link>

        <div
          onClick={toggleMobileMenu}
          className={'header__mobile-icon' + (isMenuOpened ? ' open' : '')}
        >
          <div className='header__mobile-lines'></div>
        </div>

        <nav className={'header__nav' + (isMenuOpened ? ' open' : '')}>
          <ul className='flex h-full items-center'>
            <li>
              <Link
                to={routes.home}
                className={`tracking-widest lg:tracking-wider w-full px-2 xl:mx-3 header__nav-link${isLinkActive(routes.home) ? ' header__nav-link--active' : ''}`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to={routes.about}
                className={`tracking-widest lg:tracking-wider w-full px-2 xl:mx-3 header__nav-link${isLinkActive(routes.about) ? ' header__nav-link--active' : ''}`}
              >
                About
              </Link>
            </li>
            {loggedUser && (
              <li>
                <Link
                  to={routes.dashboard.maps(loggedUser.role)}
                  className={`tracking-widest lg:tracking-wider w-full px-2 xl:mx-3 header__nav-link${isLinkActive(routes.dashboard.maps(loggedUser.role)) ? ' header__nav-link--active' : ''}`}
                >
                  My maps
                </Link>
              </li>
            )}
            <li className='px-3 lg:px-4'>
              {loggedUser ? (
                <Link
                  to={routes.dashboard.profile(loggedUser.role)}
                  className='tracking-widest lg:tracking-wider w-full header__nav-link header__nav-link--account'
                >
                  <IconContext.Provider
                    value={{ size: '2em', className: 'account-icon' }}
                  >
                    <div>
                      <FaUserCircle />
                    </div>
                  </IconContext.Provider>
                </Link>
              ) : (
                <Link
                  to={routes.login}
                  className='tracking-widest lg:tracking-wider w-full header__nav-link'
                >
                  Sign in
                </Link>
              )}
            </li>
            {loggedUser && (
              <li>
                <Link
                  to={routes.home}
                  onClick={handleLogout}
                  className='tracking-widest lg:tracking-wider w-full px-2 xl:pr-2 xl:pl-0 xl:mx-3 header__nav-link header__nav-link--account'
                >
                  <IconContext.Provider
                    value={{ size: '2em', className: 'account-icon' }}
                  >
                    <div>
                      <RiLogoutBoxRLine />
                    </div>
                  </IconContext.Provider>
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header
