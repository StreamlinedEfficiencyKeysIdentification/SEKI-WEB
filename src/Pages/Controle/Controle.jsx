/* eslint-disable react/react-in-jsx-scope */
import ImgC2 from '/Controle2.svg';
import Cadeado from '/Cadeado.svg';
import ImgC from '/Controle.svg';
import './controle.css';

function Controle() {
  return (
    <section id="Controle">
      <div className="rodape-info">
        <img src={Cadeado} />
        <p className="p-rodape margin">Segurança em primeiro lugar</p>
      </div>
      <div className="linha"></div>
      <div className="c-container">
        <div className="ccc-img">
          <img src={ImgC} />
        </div>
        <div className="cc-content">
          <div className="ccc-info">
            <div className="c-label">
              <p>Organize seus patrimônios</p>
            </div>
            <div className="i-titulo">
              <p className="margin">
                A melhor solução para o <br /> gerenciamento da sua empresa
              </p>
            </div>
            <div className="i-group">
              <div className="s-topico">
                <div className="t-numero">1</div>
                <div className="t-content">
                  <div className="t-titulo">
                    <p className="margin">Seus resultados e organização em um só lugar</p>
                  </div>
                  <div className="t-info">
                    <p>
                      Comece cadastrando suas filiais e seus equipamentos para ter uma visao maior dos seus patrimônios.
                    </p>
                  </div>
                </div>
              </div>
              <div className="s-topico">
                <div className="t-numero">2</div>
                <div className="t-content">
                  <div className="t-titulo">
                    <p className="margin">Saiba o destino de cada coisa</p>
                  </div>
                  <div className="t-info">
                    <p>Mantenha tudo sob controle informando sua usuarios vinculados e não perca nada de vista.</p>
                  </div>
                </div>
              </div>
              <div className="s-topico">
                <div className="t-numero">3</div>
                <div className="t-content">
                  <div className="t-titulo">
                    <p className="margin">Relatórios financeiros simplificados</p>
                  </div>
                  <div className="t-info">
                    <p>
                      Gere relatórios detalhados sobre seus patrimônios e despesas com poucos cliques, ajudando na
                      análise e planejamento financeiro.
                    </p>
                  </div>
                </div>
              </div>
              <div className="s-topico">
                <div className="t-numero">4</div>
                <div className="t-content">
                  <div className="t-titulo">
                    <p className="margin">Controle de manutenção e garantia</p>
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
      <div className="content2">
        <div className="c2-container">
          <div className="c2c-label">
            <p>Organize sua empresa</p>
          </div>
          <div className="c2c-titulo">
            <p>Você, no controle da sua empresa</p>
          </div>
          <div className="c2c-info">
            <div className="i-grid">
              <div className="g-titulo">
                <p>Colaboração e compartilhamento</p>
              </div>
              <div className="g-text">
                <p>
                  Permita que sua equipe ou colaboradores acessem e atualizem informações conforme necessário, com
                  permissões personalizáveis para cada usuário.
                </p>
              </div>
            </div>
            <div className="i-grid">
              <div className="g-titulo">
                <p>Organização e visibilidade</p>
              </div>
              <div className="g-text">
                <p>
                  As filiais e os patrimônios devem ser organizados e mantidos em seus devidos locais, com o objetivo de
                  assegurar um controle eficiente e uma visibilidade clara dos mesmos.
                </p>
              </div>
            </div>
            <div className="i-grid">
              <div className="g-titulo">
                <p>Segurança reforçada</p>
              </div>
              <div className="g-text">
                <p>As informações com vinculos de usuários e abertura de chamados nunca foi tao segura.</p>
              </div>
            </div>
            <div className="i-grid">
              <div className="g-titulo">
                <p>Simples de usar</p>
              </div>
              <div className="g-text">
                <p>
                  Navegue pela interface intuitiva e amigável do SEKI, que facilita a organização e o controle dos seus
                  patrimônios sem complicações.
                </p>
              </div>
            </div>
            <div className="i-grid">
              <div className="g-titulo">
                <p>Sem anúncios</p>
              </div>
              <div className="g-text">
                <p>
                  Aqui você pode focar no que realmente importa: Sua organização de ativos. Não te distraímos com
                  propagandas ou ofertas de serviço de terceiros dentro do app.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="linha"></div>
      <div className="rodape-info">
        <img src={ImgC2} />
        <p className="p-rodape margin">Acesse de onde quiser</p>
      </div>
    </section>
  );
}

export default Controle;
