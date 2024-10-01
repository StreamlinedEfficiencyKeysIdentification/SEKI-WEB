/* eslint-disable react/react-in-jsx-scope */
import './cadastro.css';
import Logo from '/SEKI.svg';
import ImgCad from '/ImgCadastro.svg';
import { useNavigate } from 'react-router-dom';

function Cadastro() {
  const navigate = useNavigate();
  const handleCadastroClick = () => {
    navigate('/');
  };

  return (
    <section id="Cadastro">
      <div className="container-cadastro">
        <div className="cadastro-content">
          <img src={Logo} alt="Logo da Seki" onClick={handleCadastroClick} className="logo" />
          <h1>Crie sua conta</h1>
          <img src={ImgCad} alt="Imagem tela cadastro" className="img-cadastro" />
        </div>
        <form>
          <div className="input-group">
            <label>Razão Social *</label>
            <input type="text" placeholder="Digite a Razão Social da empresa" />
          </div>
          <div className="input-group">
            <label>CNPJ *</label>
            <input type="text" placeholder="Digite o CNPJ da sua empresa" />
          </div>
          <div className="input-group">
            <label>Usuário *</label>
            <input type="text" placeholder="Digite o seu usuário" />
          </div>
          <div className="input-group">
            <label>Nome *</label>
            <input type="text" placeholder="Digite seu nome" />
          </div>
          <div className="input-group">
            <label>E-mail *</label>
            <input type="text" placeholder="E-mail" />
          </div>
          <div className="senha-info">
            <div className="container-senha">
              <div className="input-group">
                <label>Senha *</label>
                <input type="password" placeholder="Digite sua senha" />
              </div>
              <div className="input-group">
                <label>Confirmar senha *</label>
                <input type="password" placeholder="Confirme sua senha" />
              </div>
            </div>
            <div className="container-info-senha">
              Requisitos de senha:
              <ul>
                <li>Pelo menos 8 Caracteres</li>
                <li>Pelo menos 1 caractere especial</li>
                <li>Pelo menos 1 letra maiúscula</li>
                <li>Pelo menos 1 letra minúscula</li>
                <li>Pelo menos 1 número</li>
                <li>As senhas coincidem</li>
              </ul>
            </div>
          </div>
          <div className="container-termo">
            <input type="checkbox" id="check-termo" />
            <label htmlFor="check-termo">
              Li e concordo com os
              <a href="/">termos de uso</a>
            </label>
          </div>
          <button>Cadastrar</button>
          <div className="i-have-account">
            <label>
              Ja sou cadastrado.
              <a href="/login">Quero fazer Login</a>
            </label>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Cadastro;
