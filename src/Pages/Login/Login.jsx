import Logo from '/SEKI.svg';
import './login.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { auth, db } from './../../service/firebaseConfig';
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [lembrar, setLembrar] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const handleHomeClick = () => {
    navigate('/');
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Usuário autenticado
        navigate('/atendente/home');
      } else {
        // Usuário não autenticado, redireciona para o login
        navigate('/login');
      }
    });

    // Limpa o listener quando o componente desmonta
    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setErrorMessage('Por favor, preencha todos os campos.');
      return;
    }

    try {
      const persistenceType = lembrar ? browserLocalPersistence : browserSessionPersistence;

      // Configurar a persistência antes de fazer login
      await setPersistence(auth, persistenceType);
      // Fazer login com Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const usuarioLogado = userCredential.user.uid;

      // Buscar detalhes do usuário no Firestore
      const userDocRef = doc(db, 'DetalheUsuario', usuarioLogado);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const primeiroAcesso = userData.PrimeiroAcesso || false;
        const redefinirSenha = userData.RedefinirSenha || false;

        // Atualizar o campo 'DataAcesso' no Firestore
        await updateDoc(userDocRef, {
          DataAcesso: serverTimestamp()
        });

        if (primeiroAcesso || redefinirSenha) {
          // Redirecionar para alteração de senha
          navigate('/alterar_senha', { msg: primeiroAcesso ? 'Primeiro Acesso' : 'Redefina sua Senha' });
        } else {
          // Redirecionar para a página principal
          navigate('/atendente/home');
        }
      } else {
        console.log('Documento do usuário não encontrado no Firestore.');
      }
    } catch (error) {
      let message = 'Erro ao fazer login.';
      if (error.code === 'auth/invalid-email') {
        message = 'Email não está no formato correto.';
      } else if (error.code === 'auth/wrong-password') {
        message = 'Usuário e/ou Senha incorretos.';
      } else if (error.code === 'auth/invalid-credential') {
        message = 'Usuário e/ou Senha incorretos.';
      }
      setErrorMessage(message);
    }
  };

  return (
    <section id="Login">
      <div className="container-login">
        <img src={Logo} alt="" onClick={handleHomeClick} className="logo" />
        <h1>Acesse sua conta</h1>
        <form onSubmit={handleLogin}>
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
          <div className="input-group">
            <label>Senha</label>
            <input
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="lembrar-esqueci">
            <label htmlFor="check-lembrar">
              <input type="checkbox" id="check-lembrar" value={lembrar} onChange={(e) => setLembrar(e.target.value)} />
              Lembrar de mim
            </label>
            <a href="/esqueci">Esqueci minha senha</a>
          </div>
          <button type="submit">Entrar</button>
          <div className="dont-have-account">
            <p>
              Ainda não tem conta?
              <a href="/cadastro">Cadastre-se</a>
            </p>
          </div>
        </form>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      </div>
    </section>
  );
}

export default Login;
