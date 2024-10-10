/* eslint-disable react/react-in-jsx-scope */
import Logo from '/SEKI.svg';
import './login.css';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const handleCadastroClick = () => {
    navigate('/');
  };

  const handleEntrarClick = () => {
    navigate('/atendente');
  };

  return (
    <section id="Login">
      <div className="container-login">
        <img src={Logo} alt="" onClick={handleCadastroClick} className="logo" />
        <h1>Acesse sua conta</h1>
        <form>
          <div className="input-group">
            <label>E-mail</label>
            <input type="text" placeholder="Digite seu E-mail" />
          </div>
          <div className="input-group">
            <label>Senha</label>
            <input type="password" placeholder="Digite sua senha" />
          </div>
          <div className="lembrar-esqueci">
            <label htmlFor="check-lembrar">
              <input type="checkbox" id="check-lembrar" />
              Lembrar de mim
            </label>
            <a href="/esqueci">Esqueci minha senha</a>
          </div>
          <button onClick={handleEntrarClick}>Entrar</button>
          <div className="dont-have-account">
            <p>
              Ainda não tem conta?
              <a href="/cadastro">Cadastre-se</a>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Login;
