/* eslint-disable react/react-in-jsx-scope */
import './contato.css';
import ImgContato from '/Contato.svg';

function Contato() {
  return (
    <section id="Contato">
      <div className="contato">
        <div className="contato-container">
          <h1>Envie uma mensagem</h1>
          <form>
            <label>E-mail *</label>
            <input type="email" placeholder="Digite seu E-mail" />
            <label>Nome</label>
            <input type="text" placeholder="Digite seu Nome" />
            <label>Assunto *</label>
            <input type="text" placeholder="Escreva um Assunto" />
            <label>Descrição *</label>
            <textarea placeholder="Mensagem" />

            <div className="form-button">
              <button>Enviar</button>
            </div>
          </form>
        </div>
        <div className="contato-img">
          <img src={ImgContato} alt="" />
        </div>
      </div>
    </section>
  );
}

export default Contato;
