import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-scroll';
import { RiMenuLine, RiCloseLine } from 'react-icons/ri';
import Logo from '/SEKI.svg';
import './header.css';

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showCloseIcon, setShowCloseIcon] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 1024;
      setIsMobile(newIsMobile);

      if (!newIsMobile && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => setShowCloseIcon(true), 900);
    } else {
      document.body.style.overflow = 'unset';
      setShowCloseIcon(false);
    }
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleOutsideClick = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target) && !e.target.closest('.mobile-menu-button')) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <header>
      <nav className="navbar">
        <div className="navbar-container">
          {isMobile && (
            <button onClick={toggleMenu} className="mobile-menu-button">
              <RiMenuLine size={32} color="black" />
            </button>
          )}

          <div className="header-logo">
            <Link to="home" smooth={true} duration={500}>
              <img src={Logo}></img>
            </Link>
          </div>

          {!isMobile && (
            <>
              <div className="navbar-links">
                <Link to="Sobre" smooth={true} duration={500}>
                  Quem Somos
                </Link>
                <Link to="Recurso" smooth={true} duration={500}>
                  Recursos
                </Link>
                <Link to="Contato" smooth={true} duration={500}>
                  Contato
                </Link>
              </div>
              <div className="navbar-actions">
                <a className="login-button">Entrar</a>
                <button className="cta-button">Comece já!</button>
              </div>
            </>
          )}
        </div>

        {isOpen && isMobile && <div className="overlay" onClick={toggleMenu}></div>}

        <div className={`mobile-menu ${isOpen && isMobile ? 'open' : ''}`} ref={menuRef}>
          <div className="mobile-menu-content">
            <Link to="Sobre" smooth={true} duration={500} onClick={toggleMenu}>
              Quem Somos
            </Link>
            <Link to="Recurso" smooth={true} duration={500} onClick={toggleMenu}>
              Recursos
            </Link>
            <Link to="Contato" smooth={true} duration={500} onClick={toggleMenu}>
              Contato
            </Link>
            <button className="login-button">Entrar</button>
            <button className="cta-button">Comece já!</button>
          </div>
        </div>

        {showCloseIcon && isMobile && (
          <button onClick={!isOpen} className="close-menu-button">
            <RiCloseLine size={32} color="black" />
          </button>
        )}
      </nav>
    </header>
  );
}

export default Header;
