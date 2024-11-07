import { useNavigate } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import { AiOutlineGlobal } from 'react-icons/ai';
import Ghome from '/HOME.png';
import Ghome2 from '/Home1.png';
import './home.css';

function Home() {
  const navigate = useNavigate();

  const goToCadastro = () => {
    navigate('/cadastro');
  };

  return (
    <section id="home">
      <div className="h-container">
        <div className="hc-content">
          <div className="hcc-info" data-aos="fade-up" data-aos-delay="200">
            <h1>
              Controle patrimonial e muito mais com toda a{' '}
              <div className="h-span">
                <span>praticidade</span>
              </div>{' '}
              que você merece.
            </h1>
            <p>
              Obtenha o controle total dos seus patrimônios com uma solução completa, prática e segura para organizar
              sua empresa em tempo real.
            </p>
            <a onClick={goToCadastro} className="experimente">
              Experimente
              <div className="experimente-arrow">
                <FaArrowRight size={'1.5rem'} color="white" />
              </div>
            </a>
            <div className="i-rodape">
              <div className="ir-icon">
                <AiOutlineGlobal size={42} color="#0072BB" />
              </div>
              <p>Utilize a internet ao seu favor</p>
            </div>
          </div>
        </div>
        <div className="hc-img">
          <img src={Ghome} alt="Versão Web SEKI" className="img-web" data-aos="fade-up-left" data-aos-delay="300" />
          <img
            src={Ghome2}
            alt="Versão Mobile SEKI"
            className="img-mobile"
            data-aos="fade-up-left"
            data-aos-delay="500"
          />
        </div>
      </div>
    </section>
  );
}

export default Home;
