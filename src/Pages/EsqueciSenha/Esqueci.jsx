/* eslint-disable react/react-in-jsx-scope */
import Logo from '/SEKI.svg';
import './esqueci.css';
import { useNavigate } from 'react-router-dom';

function Esqueci() {
  const navigate = useNavigate();
  const handleCadastroClick = () => {
    navigate('/');
  };

  return (
    <section id="Esqueci">
      <div className="container-esqueci">
        <img src={Logo} alt="" onClick={handleCadastroClick} className="logo" />
        <h1>Redefinir senha</h1>
        <form>
          <div className="input-group">
            <label>E-mail</label>
            <input type="text" placeholder="Digite seu E-mail" />
          </div>
          <button>Enviar</button>
          <div className="back-to-login">
            <p>
              Voltar para o<a href="/login">Login</a>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Esqueci;
