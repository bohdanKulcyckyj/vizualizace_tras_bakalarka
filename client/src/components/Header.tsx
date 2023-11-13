import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/images/logo-short.svg';
import { FaUserCircle } from 'react-icons/fa';
import { IconContext } from 'react-icons';
import { useLocation } from 'react-router-dom';

const Header: React.FC = (props) => {
  const [isMenuOpened, setIsMenuOpened] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () : void => {
    const width = window.innerWidth;
    if(width < 1450) {
        setIsMenuOpened(!isMenuOpened);
    }
  }

  const isLinkActive = (path : string) : boolean => {
    return path === location.pathname;
  }

  useEffect(() => {
    const handleScrollingNavigation = () => {
        const header = document.querySelector(".header");  
        if(window.pageYOffset > 0) {
            header.classList.add("header--scroll");
        } else {
            header.classList.remove("header--scroll");
        }
    }

    window.addEventListener("scroll", handleScrollingNavigation);
    return () => {
        window.removeEventListener("scroll", handleScrollingNavigation);
    }
  }, [])

  useEffect(() => {
    console.log(location);
  }, [location])

  return (
    <header className="header fixed top-0 left-0 w-full">
        <div className="header__container mx-auto px-[1.5rem] md:px-[4rem] py-2 w-full">
            <Link to="/" className="header__logo">
                <img className="w-auto object-cover" src={Logo} alt="WanderMap3D logo" />
            </Link>

            <div onClick={toggleMobileMenu} className={"header__mobile-icon" + (isMenuOpened ? " open" : "")}>
                <div className="header__mobile-lines"></div>
            </div>

            <nav className={"header__nav" + (isMenuOpened ? " open" : "")}>
                <ul className="flex h-full items-center">
                    <li>
                        <Link to="/" className={`tracking-widest lg:tracking-wider w-full px-2 xl:mx-3 header__nav-link${isLinkActive("/") ? " header__nav-link--active" : ""}`}>
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link to="/about" className={`tracking-widest lg:tracking-wider w-full px-2 xl:mx-3 header__nav-link${isLinkActive("/about") ? " header__nav-link--active" : ""}`}>
                            About
                        </Link>
                    </li>
                    <li className="px-3 lg:px-4">
                        <Link to="/admin/maps" className="tracking-widest lg:tracking-wider w-full header__nav-link header__nav-link--account">
                            <IconContext.Provider value={{ size: "2em", className: "account-icon" }}>
                                <div>
                                    <FaUserCircle />
                                </div>
                            </IconContext.Provider>
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    </header>
  );
}

export default Header;