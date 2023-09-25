import React, { useState} from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../public/assets/logo-short.svg' 

const Header: React.FC = (props: any) => {
  const [isMenuOpened, setIsMenuOpened] = useState(false);

  return (
    <header className="header fixed top-0 left-0 w-full">
        <div className="header__container mx-auto px-[1.5rem] md:px-[4rem] py-6 w-full">
            <a href="{{ route('homePage') }}" className="header__logo">
                <img className="w-auto object-cover" src="{{ asset('images/icons/logo-fk.svg') }}" alt="Fredy Krigl - logo" />
            </a>

            <div className="header__mobile-icon">
                <div className="header__mobile-lines"></div>
            </div>

            <nav className="header__nav">
                <ul className="flex h-full items-center">
                    <li>
                        <Link to="/" className="tracking-widest lg:tracking-wider w-full px-3 xl:mx-2 header__nav-link">
                            Domů
                        </Link>
                    </li>
                    <li>
                        <Link to="/dashboard" className="tracking-widest lg:tracking-wider w-full header__nav-link header__nav-link--account">
                        </Link>
                    </li>
                    <li>
                        <a href="{{ route('homePage') }}" className="tracking-widest lg:tracking-wider w-full px-3 xl:mx-2 header__nav-link">Domu</a>
                    </li>
                    <li>
                        <a href="{{ route('aboutMePage') }}" className="tracking-widest lg:tracking-wider w-full px-3 xl:mx-2 header__nav-link">O mně</a>
                    </li>
                    <li>
                        <a href="{{ route('servicePage') }}" className="tracking-widest lg:tracking-wider w-full px-3 xl:mx-2 header__nav-link">Služby</a>
                    </li>
                    <li>
                        <a href="{{ route('productPage') }}" className="tracking-widest lg:tracking-wider w-full px-3 xl:mx-2 header__nav-link">Produkty</a>
                    </li>
                    <li>
                        <a href="{{ route('blog') }}" className="tracking-widest lg:tracking-wider w-full px-3 xl:mx-2 header__nav-link">Blog</a>
                    </li>
                    <li>
                        <a href="{{ route('vipSection') }}" className="tracking-widest lg:tracking-wider w-full px-3 xl:mx-2 header__nav-link">Vip sekce</a>
                    </li>
                    <li className="px-3 lg:px-4">
                        <a href="{{ route('loginPage') }}" className="tracking-widest lg:tracking-wider w-full header__nav-link header__nav-link--account">
                            <AccountIcon id="fa-account-icon"></AccountIcon>
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    </header>
  );
}

export default Header;