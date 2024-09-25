/* eslint-disable react/react-in-jsx-scope */
import './sobre.css';
import { useNavigate } from 'react-router-dom';

function Sobre() {
  const navigate = useNavigate();

  const goToCadastro = () => {
    navigate('/cadastro');
  };

  return (
    <section id="Sobre">
      <div className="s-container">
        <div className="card card1">
          <div className="card-content">
            <h2>Quem somos?</h2>
            <p className="card-text">
              O SEKI nasceu da visão de proporcionar a todos uma ferramenta inovadora para a gestão eficiente da vida
              empresárial. Somos uma equipe dedicada que acredita no poder da tecnologia para transformar a relação das
              pessoas com seus patrimônios.
            </p>
          </div>
        </div>
        <div className="card card2">
          <div className="card-content">
            <h2>Missão</h2>
            <p className="card-text">
              Na base do SEKI está o compromisso com a praticidade e a eficácia. Queremos ser seu parceiro na jornada em
              direção a uma vida financeira mais saudável e sustentável. Nosso aplicativo foi desenvolvido para oferecer
              uma solução completa, intuitiva e segura, permitindo que você tenha o controle total das suas finanças em
              tempo real.
            </p>
          </div>
        </div>
        <div className="card card3">
          <div className="card-content">
            <h2>Valores</h2>
            <p className="card-text">
              <br />
              <strong>Praticidade</strong>
              <br />
              Buscamos simplificar o dia a dia financeiro dos nossos usuários.
              <br />
              <br />
              <strong>Segurança</strong>
              <br />
              Garantimos um ambiente 100% seguro para a gestão dos seus bens patrimôniais.
              <br />
              <br />
              <strong>Inteligência</strong>
              <br />
              Capacitar nossos usuários a tomar decisões mais informadas e alcançar seus objetivos.
            </p>
          </div>
        </div>
        <div className="card card4">
          <div className="card-content">
            <h2>Propósito</h2>
            <p className="card-text">
              Junte-se a nós e descubra como o SEKI pode transformar a maneira como você gerencia seu dinheiro,
              proporcionando mais controle, segurança e inteligência financeira para o seu dia a dia.
            </p>
          </div>
        </div>
      </div>
      <div className="button-sobre">
        <button onClick={goToCadastro}>Experimente gratuitamente!</button>
      </div>
    </section>
  );
}

export default Sobre;
