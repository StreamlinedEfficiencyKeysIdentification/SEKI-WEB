import { useEffect, useRef, useState, useCallback } from 'react';
import './accessibilityMenu.css';
import { RiCloseLine } from 'react-icons/ri';
import Cookies from 'js-cookie';

function AccessibilityMenu() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [fontStep, setFontStep] = useState(1);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const accessibility = useRef(null);

  // Memorizar a função para evitar recriações em renderizações
  const updateFontSize = useCallback(
    (step) => {
      const nextStep = step !== undefined ? step : fontStep === 4 ? 1 : fontStep + 1;
      setFontStep(nextStep);

      // Salvar o passo do tamanho da fonte no cookie
      Cookies.set('fontStep', nextStep, { expires: 7 });

      let multiplier;
      switch (nextStep) {
        case 1:
          multiplier = 1;
          break;
        case 2:
          multiplier = 1.2;
          break;
        case 3:
          multiplier = 1.4;
          break;
        case 4:
          multiplier = 1.6;
          break;
        default:
          break;
      }

      document.documentElement.style.setProperty('--font-size-multiplier', multiplier);
    },
    [fontStep]
  );

  // Carregar configurações salvas nos cookies
  useEffect(() => {
    const savedFontStep = Cookies.get('fontStep');
    const savedDarkMode = Cookies.get('isDarkMode') === 'true';

    if (savedFontStep) {
      setFontStep(parseInt(savedFontStep));
      updateFontSize(parseInt(savedFontStep));
    }

    setIsDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark-mode');
    }
  }, [updateFontSize]);

  const toggleMenu = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);

    // Salvar a configuração de modo escuro no cookie
    Cookies.set('isDarkMode', newDarkMode, { expires: 7 });

    if (newDarkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  };

  const handleOutsideClick = (e) => {
    if (
      accessibility.current &&
      !accessibility.current.contains(e.target) &&
      !e.target.closest('.mobile-menu-button')
    ) {
      setIsExpanded(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <div className={`accessibility-menu ${isExpanded ? 'expanded' : ''}`} ref={accessibility}>
      <button className="accessibility-button" onClick={toggleMenu}>
        {isExpanded ? (
          <span>
            Acessibilidade <RiCloseLine size={32} color="white" />
          </span>
        ) : (
          '♿'
        )}
      </button>
      {isExpanded && (
        <div className="accessibility-options">
          <div className="box">
            <button className="font-size-button" onClick={() => updateFontSize()}>
              Aumentar fonte
            </button>
            <div className="font-size-indicators">
              <span className={`indicator ${fontStep === 1 ? 'active' : ''}`}></span>
              <span className={`indicator ${fontStep === 2 ? 'active' : ''}`}></span>
              <span className={`indicator ${fontStep === 3 ? 'active' : ''}`}></span>
              <span className={`indicator ${fontStep === 4 ? 'active' : ''}`}></span>
            </div>
          </div>
          <div className="box">
            <button className="dark-mode-button" onClick={toggleDarkMode}>
              {!isDarkMode ? 'Modo Claro' : 'Modo Escuro'}
            </button>
            <div className="font-size-indicators">
              <span className={`indicator ${!isDarkMode ? 'active' : ''}`}></span>
              <span className={`indicator ${isDarkMode ? 'active' : ''}`}></span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AccessibilityMenu;
