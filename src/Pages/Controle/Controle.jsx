/* eslint-disable react/react-in-jsx-scope */
import Cadeado from '/Cadeado.svg';
import ImgC from '/Controle.svg';
import './controle.css';

function Controle() {
  return (
    <section id="Controle">
      <div className="c-container">
        <div className="r-content w">
          <div className="rodape-info">
            <img src={Cadeado} />
            <p className="p-rodape">Segurança em primeiro lugar</p>
          </div>
        </div>
        <div className="c-c-l">
          <div className="l w"></div>
        </div>
        <div className="c-c-content w">
          <div className="c-label">
            <p>Organize seus patrimônios</p>
          </div>
          <div className="img-info">
            <div className="c-c-c-img">
              <img src={ImgC} />
            </div>
            <div className="c-c-c-info">
              <div className="i-titulo">
                <p>O seu controle esta aqui</p>
              </div>
              <div className="i-group">
                <div className="g-sub1">
                  <div className="s-topico1">
                    <div className="t-titulo">
                      <path>Seus resultados e organização em um só lugar</path>
                    </div>
                    <div className="t-info">
                      <p>
                        Comece cadastrando suas filiais e seus equipamentos para ter uma visao maior dos seus
                        patrimônios
                      </p>
                    </div>
                  </div>
                  <div className="s-topico2">
                    <div className="t-titulo">
                      <p>Saiba o destino de cada coisa</p>
                    </div>
                    <div className="t-info">
                      <p>Mantenha tudo sob controle informando sua usuarios vinculados e não perca nada de vista.</p>
                    </div>
                  </div>
                </div>
                <div className="g-sub2">
                  <div className="s-topico3">
                    <div className="t-titulo">
                      <p>Relatórios financeiros simplificados</p>
                    </div>
                    <div className="t-info">
                      <p>
                        Gere relatórios detalhados sobre seus patrimônios e despesas com poucos cliques, ajudando na
                        análise e planejamento financeiro.
                      </p>
                    </div>
                  </div>
                  <div className="s-topico4">
                    <div className="t-titulo">
                      <p>Controle de manutenção e garantia</p>
                    </div>
                    <div className="t-info">
                      <p>
                        Registre e acompanhe manutenções realizadas e garantias em vigor, garantindo que todos os itens
                        estejam em ótimo estado e protegidos.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="c-c-l">
          <div className="l w"></div>
        </div>
      </div>
    </section>
  );
}

export default Controle;
