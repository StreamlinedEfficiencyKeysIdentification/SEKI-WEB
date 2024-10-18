import GooglePlay from '/GooglePlay.svg';
import AppStore from '/AppStore.svg';
import QrCode from '/QrCode.svg';
import Arrow from '/Arrow.svg';
import RecursoImg from '/Recurso.svg';
import './recurso.css';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Recurso() {
  const navigate = useNavigate();

  const goToContato = () => {
    navigate('/contato');
  };

  useEffect(() => {
    document.querySelectorAll('details').forEach((faq) => {
      faq.addEventListener('toggle', () => {
        const icon = faq.querySelector('.icon');

        if (faq.open) {
          icon.textContent = '-';
        } else {
          icon.textContent = '+';
        }
      });
    });
  }, []);

  return (
    <section className="section">
      <div className="app">
        <div className="a-container">
          <div className="ac-titulo">
            <p>Baixe nosso App</p>
          </div>
          <div className="ac-info" data-aos="fade-up" data-aos-delay="200">
            <div className="i-download">
              <img src={AppStore} alt="AppStore" />
              <img src={GooglePlay} alt="GooglePlay" />
            </div>
            <div className="i-qrcode">
              <div className="qr-content">
                <div className="i-arrow">
                  <img src={Arrow} alt="" />
                </div>
                <div className="qr-container">
                  <div className="qr-info">
                    <p className="qr-t">Baixe no seu dispositivo</p>
                    <p className="qr-p">Escaneie o QrCode com a câmera do seu celular.</p>
                  </div>
                  <div className="qrcode">
                    <img src={QrCode} alt="QrCode" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="Recurso">
        <div className="rc-titulo">
          <p>Nossos principais recursos</p>
        </div>
        <div className="r-container">
          <div className="left-column">
            <div className="resource-box" data-aos="fade-down-right" data-aos-delay="200">
              <h2>Controle de patrimônio</h2>
              <p>Gerencie todos os patrimônios em um só lugar.</p>
            </div>
            <div className="resource-box" data-aos="fade-right" data-aos-delay="200">
              <h2>Abertura de chamados</h2>
              <p>Facilite a resolução de problemas técnicos na sua empresa.</p>
            </div>
            <div className="resource-box" data-aos="fade-up-right" data-aos-delay="200">
              <h2>Rastreabilidade</h2>
              <p>Tenha, ao seu alcance, os detalhes e os locais onde se encontram seus bens patrimoniais.</p>
            </div>
          </div>

          <div className="recurso" data-aos="zoom-in" data-aos-delay="100">
            <img src={RecursoImg} alt="" />
            <div className="sombra-img"></div>
          </div>

          <div className="right-column">
            <div className="resource-box" data-aos="fade-down-left" data-aos-delay="200">
              <h2>Criação de Filiais</h2>
              <p>Tenha o controle de suas filiais na palma da sua mão.</p>
            </div>
            <div className="resource-box" data-aos="fade-left" data-aos-delay="200">
              <h2>Relatórios</h2>
              <p>Resumos e resultados incríveis, com gráficos simples e completos.</p>
            </div>
            <div className="resource-box" data-aos="fade-up-left" data-aos-delay="200">
              <h2>Gestão Eficiente dos Seus Bens</h2>
              <p>Mantenha um controle preciso sobre seus bens.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="perguntas">
        <div className="rc-titulo">
          <p>Perguntas frequentes</p>
        </div>

        <div className="container-perguntas">
          <div className="faq">
            <details className="faq-item">
              <summary>
                <span>Qual a importância do controle patrimonial para uma empresa?</span>
                <span className="icon">+</span>
              </summary>
              <p>
                O controle patrimonial permite que a empresa gerencie seus bens de forma eficiente, evitando perdas e
                facilitando a manutenção dos ativos.
              </p>
            </details>

            <details className="faq-item">
              <summary>
                <span>Vou poder utilizar no celular também?</span>
                <span className="icon">+</span>
              </summary>
              <p>Sim, o sistema SEKI é compatível com dispositivos móveis, permitindo o uso no celular ou tablet.</p>
            </details>

            <details className="faq-item">
              <summary>
                <span>O SEKI pode ser usado offline?</span>
                <span className="icon">+</span>
              </summary>
              <p>
                Não, infelizmente o SEKI não possui a funcionalidade de uso offline. Para utilizar o sistema, é
                necessário se conectar à internet.
              </p>
            </details>
          </div>

          <div className="contact-section" data-aos="fade-up" data-aos-delay="200">
            <div className="contato-info">
              <h2>Ainda com dúvidas?</h2>
              <p>
                Caso tenha ficado com alguma dúvida sobre o uso do app, entre em contato através do e-mail para você
                aproveitar o SEKI ao máximo!
              </p>
            </div>
            <button onClick={goToContato}>Entre em contato</button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Recurso;
