import React, { useState, useEffect } from 'react';
import { Link } from 'react-scroll';
import { RiMenu3Fill, RiCloseLine } from 'react-icons/ri';
import Logo from '/SEKI.png';
import './header.css';

function Header() {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const closeMenu = () => {
    setShowMenu(false);
  };

  useEffect(() => {
    document.addEventListener('click', closeMenu);

    return () => {
      document.removeEventListener('click', closeMenu);
    };
  }, []);

  return (
    <header>
      <div className="content" onClick={(e) => e.stopPropagation()}>
        <div className="header-logo">
          <Link to="home" smooth={true} duration={500} onClick={closeMenu}>
            <img src={Logo}></img>
          </Link>
        </div>
        <nav className={`content-nav ${showMenu ? 'show' : ''}`}>
          <ul>
            <li>
              <Link to="home" smooth={true} duration={500} onClick={closeMenu}>
                Home
              </Link>
            </li>
            <li>
              <Link to="projects" smooth={true} duration={500} onClick={closeMenu}>
                Quem Somos
              </Link>
            </li>
            <li>
              <Link to="about" smooth={true} duration={500} onClick={closeMenu}>
                Recursos
              </Link>
            </li>
            <li>
              <Link to="contact" smooth={true} duration={500} onClick={closeMenu}>
                Contato
              </Link>
            </li>
          </ul>
          <div className="content-auth-nav">
            <Link to="login" smooth={true} duration={500} onClick={closeMenu} className="auth-login">
              Login
            </Link>
            <Link to="register" smooth={true} duration={500} onClick={closeMenu} className="auth-comeceja">
              Comece Já
            </Link>
          </div>
        </nav>
        <div className="content-auth">
          <Link to="login" smooth={true} duration={500} onClick={closeMenu} className="auth-login">
            Login
          </Link>
          <Link to="register" smooth={true} duration={500} onClick={closeMenu} className="auth-comeceja">
            Comece Já!
          </Link>
        </div>
        <div className="content-button" onClick={toggleMenu}>
          {showMenu ? <RiCloseLine size={40} /> : <RiMenu3Fill size={40} />}
        </div>
      </div>
    </header>
  );
}

export default Header;
