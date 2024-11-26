import Logo from '/SEKI.svg';
import './esqueci.css';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { auth } from './../../service/firebaseConfig';
import { useState } from 'react';

function Esqueci() {
  const navigate = useNavigate();
  const handleCadastroClick = () => {
    navigate('/');
  };

  const [errorMessage, setErrorMessage] = useState('');
  const [email, setEmail] = useState('');

  //Função para o envio do e-mail de recuperação de senha
  const resetPassword = async (e) => {
    e.preventDefault();

    auth
      .sendPasswordResetEmail(auth, email)
      .then(() => {
        setErrorMessage('Email enviado.');
      })
      .catch((error) => {
        let message = 'Erro ao enviar email.';
        if (error.code === 'auth/invalid-email') {
          message = 'Email não está no formato correto.';
        } else if (error.code === 'auth/invalid-credential') {
          message = 'Erro ao enviar email.';
        }
        setErrorMessage(message);
      });
  };

  return (
    <section id="Esqueci">
      <div className="container-esqueci">
        <img src={Logo} alt="" onClick={handleCadastroClick} className="logo" />
        <h1>Redefinir senha</h1>
        <form onSubmit={resetPassword}>
          <div className="input-group">
            <label>E-mail</label>
            <input
              type="email"
              placeholder="Digite seu E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit">Enviar</button>
          <div className="back-to-login">
            <p>
              Voltar para o<RouterLink to="/login">Login</RouterLink>
            </p>
          </div>
        </form>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      </div>
    </section>
  );
}

export default Esqueci;
