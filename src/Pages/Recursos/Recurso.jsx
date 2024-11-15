import GooglePlay from '/GooglePlay.svg';
import AppStore from '/AppStore.svg';
import QrCode from '/QrCode.svg';
import Arrow from '/Arrow.svg';
import RecursoImg from '/Login.png';
import Chamado from '/AberturaChamado.png';
import Rastreio from '/Equipamento.png';
import Filiais from '/Filiais.png';
import Patrimonio from '/ListaEquipamentos.png';
import QRcode from '/QRcode.png';
import './recurso.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CaretRightOutlined } from '@ant-design/icons';
import { Collapse, theme } from 'antd';

function Recurso() {
  const navigate = useNavigate();

  const [imagemAtual, setImagemAtual] = useState(RecursoImg);

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

  const { token } = theme.useToken();
  const panelStyle = {
    marginBottom: 24,
    background: token.colorBgElevated,
    borderRadius: token.borderRadiusLG,
    border: 'none'
  };

  const getItems = (panelStyle) => [
    {
      key: '1',
      label: 'Qual a importância do controle patrimonial para uma empresa?',
      children: (
        <p>
          O controle patrimonial permite que a empresa gerencie seus bens de forma eficiente, evitando perdas e
          facilitando a manutenção dos ativos.
        </p>
      ),
      style: panelStyle
    },
    {
      key: '2',
      label: 'Vou poder utilizar no celular também?',
      children: <p>Sim, o sistema SEKI é compatível com dispositivos móveis, permitindo o uso no celular ou tablet.</p>,
      style: panelStyle
    },
    {
      key: '3',
      label: 'O SEKI pode ser usado offline?',
      children: (
        <p>
          Não, infelizmente o SEKI não possui a funcionalidade de uso offline. Para utilizar o sistema, é necessário se
          conectar à internet.
        </p>
      ),
      style: panelStyle
    }
  ];

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
            <div
              className="resource-box"
              data-aos="fade-down-right"
              data-aos-delay="200"
              onMouseEnter={() => setImagemAtual(Patrimonio)}
              onMouseLeave={() => setImagemAtual(RecursoImg)}
            >
              <h2>Controle de patrimônio</h2>
              <p>Gerencie todos os patrimônios em um só lugar.</p>
            </div>
            <div
              className="resource-box"
              data-aos="fade-right"
              data-aos-delay="200"
              onMouseEnter={() => setImagemAtual(Chamado)}
              onMouseLeave={() => setImagemAtual(RecursoImg)}
            >
              <h2>Abertura de chamados</h2>
              <p>Facilite a resolução de problemas técnicos na sua empresa.</p>
            </div>
            <div
              className="resource-box"
              data-aos="fade-up-right"
              data-aos-delay="200"
              onMouseEnter={() => setImagemAtual(Rastreio)}
              onMouseLeave={() => setImagemAtual(RecursoImg)}
            >
              <h2>Rastreabilidade</h2>
              <p>Tenha, ao seu alcance, os detalhes e os locais onde se encontram seus bens patrimoniais.</p>
            </div>
          </div>

          <div className="recurso" data-aos="zoom-in" data-aos-delay="100">
            {/* Renderiza a imagem de acordo com o estado imagemAtual */}
            <img src={imagemAtual} alt="Imagem do recurso" />
            <div className="sombra-img"></div>
          </div>

          <div className="right-column">
            <div
              className="resource-box"
              data-aos="fade-down-left"
              data-aos-delay="200"
              onMouseEnter={() => setImagemAtual(Filiais)}
              onMouseLeave={() => setImagemAtual(RecursoImg)}
            >
              <h2>Criação de Filiais</h2>
              <p>Tenha o controle de suas filiais na palma da sua mão.</p>
            </div>
            <div
              className="resource-box"
              data-aos="fade-left"
              data-aos-delay="200"
              onMouseEnter={() => setImagemAtual(QRcode)}
              onMouseLeave={() => setImagemAtual(RecursoImg)}
            >
              <h2>QRcode</h2>
              <p>Organize seus patrimônios por QRcode, simplificando a busca e tendo mais agilidade.</p>
            </div>
            <div
              className="resource-box"
              data-aos="fade-up-left"
              data-aos-delay="200"
              onMouseEnter={() => setImagemAtual(RecursoImg)}
              onMouseLeave={() => setImagemAtual(RecursoImg)}
            >
              <h2>Gestão eficiente dos seus bens</h2>
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
          <Collapse
            className="collapse"
            bordered={false}
            defaultActiveKey={['1']}
            expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
            expandIconPosition="end"
            style={{ background: 'transparent' }}
            items={getItems(panelStyle)}
          />

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
