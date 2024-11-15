import './cadastro.css';
import Logo from '/SEKI.svg';
import ImgCad from '/ImgCadastro.svg';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../../service/firebaseConfig';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, doc, setDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import emailjs from '@emailjs/browser';

function Cadastro() {
  const [razaoSocial, setRazaoSocial] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [usuario, setUsuario] = useState('');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [termoCadastro, setTermoCadastro] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [senhaValida, setSenhaValida] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCadastroClick = () => {
    navigate('/');
  };

  const formatarCNPJ = (value) => {
    return value
      .replace(/\D/g, '') // Remove caracteres não numéricos
      .replace(/^(\d{2})(\d)/, '$1.$2') // Adiciona ponto após os 2 primeiros dígitos
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3') // Adiciona ponto após os 3 próximos dígitos
      .replace(/\.(\d{3})(\d)/, '.$1/$2') // Adiciona a barra
      .replace(/(\d{4})(\d)/, '$1-$2') // Adiciona o traço
      .substring(0, 18); // Limita o comprimento
  };

  const handleCnpjChange = (e) => {
    const value = e.target.value;
    setCnpj(formatarCNPJ(value));
  };

  const validarSenha = (senha) => {
    const requisitos = {
      comprimento: senha.length >= 8,
      especial: /[!@#$%^&*(),.?":{}|<>]/.test(senha),
      maiuscula: /[A-Z]/.test(senha),
      minuscula: /[a-z]/.test(senha),
      numero: /\d/.test(senha),
      coincidem: senha === confirmarSenha
    };
    setSenhaValida(requisitos);
  };

  const handleSenhaChange = (e) => {
    const value = e.target.value;
    setSenha(value);
    validarSenha(value);
  };

  const handleConfirmarSenhaChange = (e) => {
    const value = e.target.value;
    setConfirmarSenha(value);
    setSenhaValida((prev) => ({
      ...prev,
      coincidem: value === senha
    }));
  };

  const getProximoId = async () => {
    const querySnapshot = await getDocs(collection(db, 'Empresa'));
    const existingIds = querySnapshot.docs.map((doc) => parseInt(doc.id) || 0);

    let nextId = 1;
    while (existingIds.includes(nextId)) {
      nextId++;
    }
    return nextId;
  };

  const sendEmail = async () => {
    const formEmail = {
      user_subject: 'Criação de Usuário',
      message: `Seu usuário foi criado com sucesso! Para entrar no sistema, acesse o link abaixo com o e-mail e senha cadastrados. `,
      user_email: email,
      user_name: nome
    };

    try {
      // Envia o e-mail usando o EmailJS
      await emailjs.send('service_3v4rnsl', 'template_iecf4gn', formEmail, 'vfwarZrM3MChAFVqG');
      toast.success('Mensagem enviada com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      toast.error('Erro ao enviar mensagem, tente novamente.');
    }
  };

  const cadastrar = async () => {
    if (!termoCadastro) {
      setErrorMessage('Por favor, aceite os termos de uso.');
      return;
    }

    if (!razaoSocial || !cnpj || !usuario || !nome || !email || !senha || !confirmarSenha) {
      setErrorMessage('Por favor, preencha todos os campos.');
      return;
    }

    if (senha !== confirmarSenha || !senhaValida) {
      setErrorMessage('As senhas não coincidem ou não atendem aos requisitos.');
      return;
    }
    setLoading(true);

    const proximoId = await getProximoId();

    const dadosEmpresa = {
      CNPJ: cnpj.replace(/\D/g, ''),
      RazaoSocial: razaoSocial,
      Status: 'Ativo',
      QuemCriou: 'RoUSS0Cd2Tb6bayH5bZ79rn5hdl2',
      EmpresaPai: proximoId.toString()
    };

    const userData = {
      Usuario: usuario,
      Email: email,
      IDempresa: proximoId.toString(),
      IDnivel: '2',
      Nome: nome,
      Status: 'Ativo'
    };

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const uid = userCredential.user.uid;

      await signOut(auth);

      // Cria o documento da empresa com o ID definido
      await setDoc(doc(db, 'Empresa', proximoId.toString()), dadosEmpresa);

      // Adiciona o usuário com o UID como identificador
      await setDoc(doc(db, 'Usuarios', uid), userData);

      // Criar documento em DetalheUsuario
      await setDoc(doc(db, 'DetalheUsuario', uid), {
        PrimeiroAcesso: false,
        QuemCriou: 'RoUSS0Cd2Tb6bayH5bZ79rn5hdl2',
        DataCriacao: serverTimestamp()
      });

      await sendEmail();

      toast.success('Usuário cadastrado com sucesso!');
      setRazaoSocial('');
      setCnpj('');
      setUsuario('');
      setNome('');
      setEmail('');
      setSenha('');
      setConfirmarSenha('');
      setTermoCadastro(false);
      setErrorMessage('');
      setSenhaValida(false);
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);
      toast.error('Erro ao cadastrar!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="Cadastro">
      <div className="container-cadastro">
        <div className="cadastro-content">
          <img src={Logo} alt="Logo da Seki" onClick={handleCadastroClick} className="logo" />
          <h1>Crie sua conta</h1>
          <img src={ImgCad} alt="Imagem tela cadastro" className="img-cadastro" />
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            cadastrar();
          }}
        >
          <div className="input-group">
            <label>Razão Social *</label>
            <input
              type="text"
              placeholder="Digite a Razão Social da empresa"
              value={razaoSocial}
              onChange={(e) => setRazaoSocial(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>CNPJ *</label>
            <input
              type="text"
              placeholder="Digite o CNPJ da sua empresa"
              value={cnpj}
              onChange={handleCnpjChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Usuário *</label>
            <input
              type="text"
              placeholder="Digite o seu usuário"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Nome *</label>
            <input
              type="text"
              placeholder="Digite seu nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>E-mail *</label>
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="senha-info">
            <div className="container-senha">
              <div className="input-group">
                <label>Senha *</label>
                <input
                  type="password"
                  placeholder="Digite sua senha"
                  value={senha}
                  onChange={handleSenhaChange}
                  required
                />
              </div>
              <div className="input-group">
                <label>Confirmar senha *</label>
                <input
                  type="password"
                  placeholder="Confirme sua senha"
                  value={confirmarSenha}
                  onChange={handleConfirmarSenhaChange}
                  required
                />
              </div>
            </div>
            <div className="container-info-senha">
              Requisitos de senha:
              <ul>
                <li style={{ color: senhaValida.comprimento ? 'green' : 'red' }}>Pelo menos 8 Caracteres</li>
                <li style={{ color: senhaValida.especial ? 'green' : 'red' }}>Pelo menos 1 caractere especial</li>
                <li style={{ color: senhaValida.maiuscula ? 'green' : 'red' }}>Pelo menos 1 letra maiúscula</li>
                <li style={{ color: senhaValida.minuscula ? 'green' : 'red' }}>Pelo menos 1 letra minúscula</li>
                <li style={{ color: senhaValida.numero ? 'green' : 'red' }}>Pelo menos 1 número</li>
                <li style={{ color: senhaValida.coincidem ? 'green' : 'red' }}>As senhas coincidem</li>
              </ul>
            </div>
          </div>
          <div className="container-termo">
            <input
              type="checkbox"
              id="check-termo"
              checked={termoCadastro}
              onChange={(e) => setTermoCadastro(e.target.checked)}
            />
            <label htmlFor="check-termo">
              Li e concordo com os
              <a href="/">termos de uso</a>
            </label>
          </div>
          <div className="error-message">{errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}</div>
          <button type="submit" disabled={loading} style={{ backgroundColor: loading ? 'gray' : '#0072bb' }}>
            Cadastrar
          </button>
          <div className="i-have-account">
            <label>
              Já sou cadastrado.
              <a href="/login">Quero fazer Login</a>
            </label>
          </div>
        </form>
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

export default Cadastro;
