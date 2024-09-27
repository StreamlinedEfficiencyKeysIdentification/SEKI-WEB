/* eslint-disable react/react-in-jsx-scope */
import Logo from '/SEKI.svg';
import './login.css';

function Login() {
  return (
    <section id="Login">
      <div className="container-login">
        <img src={Logo} alt="" />
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
            <label>
              <input type="checkbox" className="check-lembrar" />
              Lembrar de mim
            </label>
            <a href="/">Esqueci minha senha</a>
          </div>
          <button>Login</button>
          <div className="dont-have-account">
            <p>
              Ainda não tem conta?
              <a href="/">Cadastre-se</a>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Login;
