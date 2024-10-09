import React, { useState, useEffect, useRef } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { RiMenuLine, RiCloseLine } from 'react-icons/ri';
import Logo from '/SEKI.svg';
import './header.css';

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showCloseIcon, setShowCloseIcon] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleCadastroClick = () => {
    navigate('/cadastro');
  };

  const handleScrollToResources = () => {
    navigate('/', { state: { scrollTo: 'Recurso' } });
  };

  useEffect(() => {
    if (location.state?.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        window.scrollTo({
          top: element.offsetTop,
        });
      }
    }
  }, [location.state]);

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
            <RouterLink
              onClick={() => {
                window.location.href = '/';
              }}
            >
              <img src={Logo}></img>
            </RouterLink>
          </div>

          {!isMobile && (
            <>
              <div className="navbar-links">
                <RouterLink to="/quemsomos">Quem Somos</RouterLink>
                <ScrollLink onClick={handleScrollToResources} to="Recurso" smooth={true} duration={500}>
                  Recursos
                </ScrollLink>
                <RouterLink to="/contato">Contato</RouterLink>
              </div>
              <div className="navbar-actions">
                <RouterLink to="/login" className="login-button">
                  Entrar
                </RouterLink>
                <button onClick={handleCadastroClick} className="cta-button">
                  Comece já!
                </button>
              </div>
            </>
          )}
        </div>

        {isOpen && isMobile && <div className="overlay" onClick={toggleMenu}></div>}

        <div className={`mobile-menu ${isOpen && isMobile ? 'open' : ''}`} ref={menuRef}>
          <div className="mobile-menu-content">
            <div className="menu-content">
              <RouterLink to="/quemsomos" onClick={toggleMenu}>
                Quem Somos
              </RouterLink>
              <ScrollLink
                to=""
                onClick={() => {
                  handleScrollToResources();
                  toggleMenu();
                }}
              >
                Recursos
              </ScrollLink>
              <RouterLink to="/contato" onClick={toggleMenu}>
                Contato
              </RouterLink>
            </div>
            <div className="navactions">
              <RouterLink to="/login" className="login-button" onClick={toggleMenu}>
                Entrar
              </RouterLink>
              <button
                onClick={() => {
                  handleCadastroClick();
                  toggleMenu();
                }}
                className="cta-button"
              >
                Comece já!
              </button>
            </div>
          </div>
        </div>

        {isOpen && showCloseIcon && isMobile && (
          <button onClick={toggleMenu} className="close-menu-button">
            <RiCloseLine size={32} color="black" />
          </button>
        )}
      </nav>
    </header>
  );
}

export default Header;
