import './contato.css';
import ImgContato from '/Contato.svg';
import { useRef } from 'react';
import emailjs from '@emailjs/browser';
import { ToastContainer, toast } from 'react-toastify'; // Importando Toastify
import 'react-toastify/dist/ReactToastify.css';

function Contato() {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm('service_3v4rnsl', 'template_n42j8gg', form.current, 'vfwarZrM3MChAFVqG').then(
      () => {
        toast.success('Mensagem enviada com sucesso!');
        form.current.reset();
      },
      (error) => {
        console.log(error.text);
        toast.error('Erro ao enviar mensagem, tente novamente.');
      }
    );
  };

  return (
    <section id="Contato">
      <div className="contato">
        <div className="contato-container">
          <h1>Envie uma mensagem</h1>
          <form ref={form} onSubmit={sendEmail}>
            <label>E-mail *</label>
            <input type="email" name="user_email" placeholder="Digite seu E-mail" required />
            <label>Nome</label>
            <input type="text" name="user_name" placeholder="Digite seu Nome" required />
            <label>Assunto *</label>
            <input type="text" name="subject" placeholder="Escreva um Assunto" required />
            <label>Descrição *</label>
            <textarea name="message" placeholder="Mensagem" required />

            <div className="form-button">
              <button type="submit">Enviar</button>
            </div>
          </form>
        </div>
        <div className="contato-img">
          <img src={ImgContato} alt="" />
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000} // Fecha automaticamente após 5 segundos
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </section>
  );
}

export default Contato;
