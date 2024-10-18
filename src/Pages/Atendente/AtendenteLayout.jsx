import './atendenteLayout.css';
import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import SideNav from '../../Components/SideNav/SideNav';
import Header from '../../Components/HeaderBody/Header';
import { HomeOutlined } from '@ant-design/icons';
import { Breadcrumb } from 'antd';
import { auth } from '../../service/firebaseConfig';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';

const breadcrumbNameMap = {
  '/atendente/home': '',
  '/atendente/chamados/lista': 'Lista de Chamados',
  '/atendente/chamados/criar': 'Criar Chamado',
  '/atendente/usuarios/lista': 'Lista de Usuários',
  '/atendente/usuarios/criar': 'Criar Usuário'
  // Adicione mais conforme necessário
};

function AtendenteLayout() {
  const navigate = useNavigate();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // Usuário autenticado
        navigate('/login');
      } else {
        user.getIdToken().then((token) => console.log(token));
      }
    });

    // Limpa o listener quando o componente desmonta
    return () => unsubscribe();
  }, [navigate]);

  const location = useLocation(); // Hook para capturar a localização atual
  const pathSnippets = location.pathname.split('/').filter((i) => i);

  // Cria o Breadcrumb baseado no mapeamento
  const breadcrumbItems = pathSnippets
    .map((_, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
      const breadcrumbLabel = breadcrumbNameMap[url]; // Usa o nome amigável do map

      // Adiciona lógica para a rota de detalhes do chamado
      if (url.match(/\/atendente\/chamados\/[^/]+\/[^/]+/)) {
        return {
          key: url,
          title: <span className="breadcrumb-item">Detalhes do Chamado</span>
        };
      }

      // Só exibe se houver um nome amigável no map
      if (breadcrumbLabel) {
        return {
          key: url,
          title: <span className="breadcrumb-item">{breadcrumbLabel}</span>
        };
      }

      return null;
    })
    .filter(Boolean);

  return (
    <div className="attendant-main">
      <SideNav />
      <div className="main-header-body">
        <Header />
        <div className="main-body">
          <div className="main-body-header">
            <Breadcrumb
              className="breadcrumb"
              items={[
                {
                  title: (
                    <Link className="breadcrumb-item-home" to="/atendente/home">
                      <HomeOutlined />
                      <span>Home</span>
                    </Link>
                  )
                },
                ...breadcrumbItems // Adiciona dinamicamente os itens do breadcrumb
              ]}
            />
            <div className="content-atualizar">
              <i className="bi bi-arrow-clockwise"></i>
              <span>Atualizar</span>
            </div>
          </div>

          <div className="container-outlet">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AtendenteLayout;
