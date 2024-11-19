import './atendenteLayout.css';
import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import SideNav from '../../Components/SideNav/SideNav';
import Header from '../../Components/HeaderBody/Header';
import { HomeOutlined } from '@ant-design/icons';
import { Breadcrumb, Tour } from 'antd';
import { auth } from '../../service/firebaseConfig';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import Cookies from 'js-cookie';

const breadcrumbNameMap = {
  '/atendente/home': '',
  '/atendente/chamados/lista': 'Lista de Chamados',
  '/atendente/chamados/criar': 'Novo Chamado',
  '/atendente/usuarios/lista': 'Lista de Usuários',
  '/atendente/usuarios/criar': 'Novo Usuário',
  '/atendente/empresa/lista': 'Lista de Empresas',
  '/atendente/empresa/criar': 'Nova Empresa',
  '/atendente/equipamento/lista': 'Lista de Equipamentos',
  '/atendente/equipamento/criar': 'Novo Equipamento'
  // Adicione mais conforme necessário
};

function AtendenteLayout() {
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);
  const [isTourOpen, setIsTourOpen] = useState(false);

  const steps = [
    {
      title: 'Tour',
      description: 'Vamos fazer um tour pelo sistema.',
      target: null
    },
    {
      title: 'Cabeçalho',
      description: 'Este é o cabeçalho do sistema.',
      target: () => document.querySelector('#tour-header')
    },
    {
      title: 'Chamados recentes',
      description: 'Use esta barra de pesquisa para encontrar os chamados acessados recentemente.',
      target: () => document.querySelector('#tour-search')
    },
    {
      title: 'Ajuda',
      description: 'Aqui você será direcionado para ajuda caso tenha alguma dúvida ou problema.',
      target: () => document.querySelector('#tour-notification')
    },
    {
      title: 'Perfil',
      description:
        'Aqui você pode sair do usuário clicando no ícone ou movendo o mouse em cima para visualizar o usuário e o nome logado',
      target: () => document.querySelector('#tour-profile')
    },
    {
      title: 'Menu lateral',
      description:
        'Aqui está o menu lateral para navegar pelas opções principais. Dentre elas chamados, empresas, usuário e equipamentos.',
      target: () => document.querySelector('#tour-sidenav'),
      placement: 'right'
    },
    {
      title: 'Conteúdo Principal',
      description: 'Esta área mostra as informações da funcionalidade selecionada.',
      target: () => document.querySelector('#tour-outlet')
    }
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // Usuário autenticado
        navigate('/login');
      }
      // else {
      //   user.getIdToken().then((token) => console.log(token));
      // }
    });

    const tourShown = Cookies.get('tourShown');
    if (!tourShown) {
      setIsTourOpen(true);
    }

    // Limpa o listener quando o componente desmonta
    return () => unsubscribe();
  }, [navigate]);

  const handleTourClose = () => {
    setIsTourOpen(false);
    Cookies.set('tourShown', 'true', { expires: 365 }); // Define o cookie para um ano
  };

  const location = useLocation(); // Hook para capturar a localização atual
  const pathSnippets = location.pathname.split('/').filter((i) => i);

  // Cria o Breadcrumb baseado no mapeamento
  const breadcrumbItems = pathSnippets
    .map((_, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
      const breadcrumbLabel = breadcrumbNameMap[url]; // Usa o nome amigável do map

      // Só exibe se houver um nome amigável no map
      if (breadcrumbLabel) {
        return {
          key: url,
          title: <span className="breadcrumb-item">{breadcrumbLabel}</span>
        };
      }

      // Adiciona lógica para a rota de detalhes do chamado
      if (url.match(/\/atendente\/chamados\/[^/]+\/[^/]+/)) {
        return {
          key: url,
          title: <span className="breadcrumb-item">Detalhes do Chamado</span>
        };
      }

      // Adiciona lógica para a rota de detalhes do chamado
      if (url.match(/\/atendente\/empresa\/[^/]+/)) {
        return {
          key: url,
          title: <span className="breadcrumb-item">Detalhes da Empresa</span>
        };
      }

      // Adiciona lógica para a rota de detalhes do chamado
      if (url.match(/\/atendente\/usuarios\/[^/]+/)) {
        return {
          key: url,
          title: <span className="breadcrumb-item">Detalhes do Usuario</span>
        };
      }

      // Adiciona lógica para a rota de detalhes do chamado
      if (url.match(/\/atendente\/equipamentos\/[^/]+/)) {
        return {
          key: url,
          title: <span className="breadcrumb-item">Detalhes do Equipamento</span>
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
            <div className="content-atualizar" onClick={() => setRefreshKey((prevKey) => prevKey + 1)}>
              <i className="bi bi-arrow-clockwise"></i>
              <span>Atualizar</span>
            </div>
          </div>

          <div className="container-outlet" id="tour-outlet">
            <Outlet key={refreshKey} />
          </div>
        </div>
      </div>

      <Tour open={isTourOpen} onClose={handleTourClose} steps={steps} />
    </div>
  );
}

export default AtendenteLayout;
