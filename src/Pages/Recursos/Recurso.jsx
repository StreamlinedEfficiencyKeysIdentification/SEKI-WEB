/* eslint-disable react/react-in-jsx-scope */
import GooglePlay from '/GooglePlay.svg';
import AppStore from '/AppStore.svg';
import QrCode from '/QrCode.svg';
import Arrow from '/Arrow.svg';
import RecursoImg from '/Recurso.svg';
import './recurso.css';

function Recurso() {
  return (
    <section className="section">
      <div className="app">
        <div className="a-container">
          <div className="ac-titulo">
            <p>Baixe nosso App</p>
          </div>
          <div className="ac-info">
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
        <div className="r-container">
          <div className="rc-titulo">
            <p>Nossos principais recursos</p>
          </div>
          <div className="recurso">
            <img src={RecursoImg} alt="" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Recurso;
