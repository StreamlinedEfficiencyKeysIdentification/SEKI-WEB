import { useState, useEffect } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import './scroll.css';

function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Exibir o botão apenas quando o usuário rolar a página para baixo
  const toggleVisibility = () => {
    if (window.pageYOffset > 1) {
      // Quando o usuário rolar mais de 300px
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <div>
      {isVisible && (
        <ScrollLink to="home" className="scroll-to-top" smooth={true} duration={500}>
          Voltar ao topo
        </ScrollLink>
      )}
    </div>
  );
}

export default ScrollToTop;
