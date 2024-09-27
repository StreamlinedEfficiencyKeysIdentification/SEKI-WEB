/* eslint-disable react/react-in-jsx-scope */
import './cadastro.css';
import Logo from '/SEKI.svg';
import ImgCad from '/ImgCadastro.svg';

function Cadastro() {
  return (
    <section id="Cadastro">
      <div className="container-cadastro">
        <div className="cadastro-content">
          <img src={Logo} alt="Logo da Seki" />
          <h1>Crie sua conta</h1>
          <img src={ImgCad} alt="Imagem tela cadastro" />
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
          <div className="container-senha">
            <div className="input-group">
              <label>Senha</label>
              <input type="password" placeholder="Digite sua senha" />
            </div>
            <div className="input-group">
              <label>Confirmar senha</label>
              <input type="password" placeholder="Confirme sua senha" />
            </div>
          </div>
          <button>Cadastrar</button>
        </form>
      </div>
    </section>
  );
}

export default Cadastro;
