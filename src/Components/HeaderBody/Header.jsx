import './header.css';
import { Input, Popover, Tooltip } from 'antd';
import { signOut } from 'firebase/auth';
import { auth } from '../../service/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

function Header() {
  // Estado para armazenar os últimos 5 chamados
  const [recentCalls, setRecentCalls] = useState([]);
  const [clicked, setClicked] = useState(false);
  const navigate = useNavigate();
  const [title, setTitle] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const usuario = Cookies.get('usuario');
      const nome = Cookies.get('nome');

      setTitle(
        <label>
          {usuario} <br /> {nome}
        </label>
      );
    };
    fetchUser();
  }, []);

  // Função para simular a obtenção dos últimos 5 chamados (exemplo)
  const fetchRecentCalls = () => {
    // Aqui você pode fazer uma requisição para obter os dados reais ou utilizar dados mockados
    const callsFromCookies = Cookies.get('recentChamados');
    if (callsFromCookies) {
      setRecentCalls(JSON.parse(callsFromCookies)); // Converte de volta para objeto JavaScript
    }
  };

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

  // Conteúdo do Popover, exibindo os últimos chamados
  const popoverContent = (
    <div className="popover-call">
      {recentCalls.length > 0 ? (
        recentCalls.map((call) => (
          <div key={call.IDchamado} className="call-item" onClick={() => handleClick(call)}>
            <label>#{call.IDchamado}</label>
            <div>-</div>
            <div className="item-titulo">{call.Titulo}</div>
          </div>
        ))
      ) : (
        <div>Sem chamados recentes</div>
      )}
    </div>
  );

  const handleClickChange = (open) => {
    setClicked(open);
  };

  // Função para ir para a página com os detalhes do chamado
  const handleClick = (record) => {
    navigate(`/atendente/chamados/${record.IDdoc}/${record.IDchamado}`);
  };

  return (
    <div className="header-nav" id="tour-header">
      <div className="header-nav-search" id="tour-search">
        <Popover
          content={popoverContent}
          title="Últimos chamados"
          trigger="click"
          open={clicked}
          onOpenChange={(open) => {
            fetchRecentCalls();
            handleClickChange(open);
          }}
        >
          <i className="bi bi-search"></i>
          <Input className="search" type="text" allowClear placeholder="Número do Chamado ou Título" />
        </Popover>
      </div>
      <div className="header-nav-personal">
        <i className="bi bi-question-circle" id="tour-notification"></i>
        <div className="personal">
          <Tooltip placement="bottom" title={title}>
            <i className="bi bi-person-circle" id="tour-profile" onClick={logout}></i>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}

export default Header;
