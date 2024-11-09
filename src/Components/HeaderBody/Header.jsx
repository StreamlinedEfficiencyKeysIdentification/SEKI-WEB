import './header.css';
import { Input } from 'antd';
import { signOut } from 'firebase/auth';
import { auth } from '../../service/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function Header() {
  const navigate = useNavigate();

  // Função de logout do Firebase
  const logout = async () => {
    try {
      await signOut(auth);
      Cookies.remove('uid');
      navigate('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <div className="header-nav">
      <div className="header-nav-search">
        <i className="bi bi-search"></i>
        <Input className="search" type="text" allowClear placeholder="Número do Chamado ou Título" />
      </div>
      <div className="header-nav-personal">
        <i className="bi bi-question-circle"></i>
        <div className="personal">
          <i className="bi bi-person-circle" onClick={logout}></i>
        </div>
      </div>
    </div>
  );
}

export default Header;
