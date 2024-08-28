/* eslint-disable react/react-in-jsx-scope */
import { FaArrowRight } from 'react-icons/fa';
import { AiOutlineGlobal } from 'react-icons/ai';
import Ghome from '/G-Home.svg';
import './home.css';

function Home() {
  return (
    <section id="home">
      <div className="container-home">
        <div className="container-home-content">
          <div className="home-content-info">
            <div className="info">
              <h1>
                Toda a <strong>praticidade</strong> que te falta reunida aqui
              </h1>
              <p className="p-info">
                Obtenha o controle total dos seus patrimônios com uma solução completa, prática e segura para organizar
                sua empresa em tempo real.
              </p>
              <div className="experimente">
                <p className="p-exp">Experimente</p>
                <div className="experimente-arrow">
                  <FaArrowRight size={24} color="white" />
                </div>
              </div>
            </div>
            <div className="info-rodape">
              <div className="rodape-icon">
                <AiOutlineGlobal size={24} color="#0072BB" />
              </div>
              <p>Utilize a internet ao seu favor</p>
            </div>
          </div>
          <div className="content-img-multi">
            <img src={Ghome} />
          </div>
        </div>
      </div>
      <div className="container-rodape"></div>
    </section>
  );
}

export default Home;
