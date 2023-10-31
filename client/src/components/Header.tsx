import React, { useState} from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/images/logo-short.svg';
import { FaUserCircle } from 'react-icons/fa';
import { IconContext } from 'react-icons';

const Header: React.FC = (props: any) => {
  const [isMenuOpened, setIsMenuOpened] = useState(false);

  return (
    <header className="header fixed top-0 left-0 w-full">
        <div className="header__container mx-auto px-[1.5rem] md:px-[4rem] py-2 w-full">
            <Link to="/" className="header__logo">
                <img className="w-auto object-cover" src={Logo} alt="WanderMap3D logo" />
            </Link>

            <div className="header__mobile-icon">
                <div className="header__mobile-lines"></div>
            </div>

            <nav className="header__nav">
                <ul className="flex h-full items-center">
                    <li>
                        <Link to="/" className="tracking-widest lg:tracking-wider w-full px-2 xl:mx-3 header__nav-link">
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link to="/" className="tracking-widest lg:tracking-wider w-full px-2 xl:mx-3 header__nav-link">
                            About
                        </Link>
                    </li>
                    {/* <li>
                        <Link to="/dashboard" className="tracking-widest lg:tracking-wider w-full header__nav-link header__nav-link--account">
                        </Link>
                    </li> */}
                    <li className="px-3 lg:px-4">
                        <Link to="/login" className="tracking-widest lg:tracking-wider w-full header__nav-link header__nav-link--account">
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