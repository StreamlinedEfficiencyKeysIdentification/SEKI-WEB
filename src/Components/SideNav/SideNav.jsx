import { useState, useEffect } from 'react';
import { AlignLeftOutlined, AlignRightOutlined, CloseOutlined } from '@ant-design/icons';
import { Button, Drawer, Menu } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import Logo from '/SEKI.svg';
import './sideNav.css';
import Cookies from 'js-cookie';

const items = (navigate, nivel) => [
  {
    key: '/atendente/home',
    icon: <i className="bi bi-house"></i>,
    label: 'Home',
    onClick: () => navigate('/atendente/home')
  },
  {
    key: 'sub1',
    label: 'Chamado',
    icon: <i className="bi bi-headphones"></i>,
    children: [
      {
        key: '/atendente/chamados/lista',
        label: 'Lista de Chamados'
      },
      ...(nivel <= 3
        ? [
            {
              key: '/atendente/chamados/criar',
              label: 'Novo Chamado'
            }
          ]
        : [])
    ]
  },
  ...(nivel <= 2
    ? [
        {
          key: 'sub2',
          label: 'Empresa',
          icon: <i className="bi bi-building"></i>,
          children: [
            {
              key: '/atendente/empresa/lista',
              label: 'Lista de Empresas'
            },
            {
              key: '/atendente/empresa/criar',
              label: 'Nova Empresa'
            }
          ]
        }
      ]
    : []),
  ...(nivel <= 3
    ? [
        {
          key: 'sub3',
          label: 'Usuário',
          icon: <i className="bi bi-person"></i>,
          children: [
            {
              key: '/atendente/usuarios/lista',
              label: 'Lista de Usuários'
            },
            {
              key: '/atendente/usuarios/criar',
              label: 'Novo Usuário'
            }
          ]
        }
      ]
    : []),
  ...(nivel <= 3
    ? [
        {
          key: 'sub4',
          label: 'Equipamento',
          icon: <i className="bi bi-pc-display"></i>,
          children: [
            {
              key: '/atendente/equipamento/lista',
              label: 'Lista de Equipamentos'
            },
            {
              key: '/atendente/equipamento/criar',
              label: 'Novo Equipamento'
            }
          ]
        }
      ]
    : [])
];

function SideNav() {
  const location = useLocation(); // Hook para capturar a URL atual
  const navigate = useNavigate(); // Para navegar pelo app
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [open, setOpen] = useState(false);
  const [mobile, setMobile] = useState(false);

  const nivelData = Cookies.get('nivel');
  const nivel = parseInt(nivelData);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 1024;
      setMobile(isMobile);

      if (!isMobile) {
        setOpen(false);
      }
    };

    // Verifique o tamanho inicial da janela
    handleResize();

    // Adicione o event listener para escutar mudanças no tamanho da janela
    window.addEventListener('resize', handleResize);

    // Limpe o event listener quando o componente for desmontado
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Atualiza os itens selecionados com base na URL
  useEffect(() => {
    setSelectedKeys([location.pathname]); // Atualiza o item selecionado baseado na URL atual
  }, [location]);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  // Redireciona para a página correta ao clicar no item
  const handleClick = (e) => {
    navigate(e.key); // Redireciona usando o react-router
  };

  return (
    <div className="container-nav">
      {!mobile ? (
        <div className="side-nav">
          <div
            className="header-side-nav"
            style={{
              justifyContent: collapsed ? 'center' : 'flex-end'
            }}
          >
            {!collapsed && (
              <div className="header-side-logo">
                <img src={Logo} alt="Logo" onClick={() => navigate('/atendente/home')}></img>
              </div>
            )}
            <Button className="button-side-nav" type="primary" onClick={toggleCollapsed}>
              {collapsed ? <AlignLeftOutlined /> : <AlignRightOutlined />}
            </Button>
          </div>
          <div className="menu-side-nav">
            <Menu
              mode="inline"
              theme="light"
              style={{
                width: collapsed ? 60 : 274
              }}
              inlineCollapsed={collapsed}
              onClick={handleClick}
              selectedKeys={selectedKeys}
              items={items(navigate, nivel)}
            />
          </div>
        </div>
      ) : (
        <>
          <div className="container-mobile">
            <Button
              className="button-side-nav"
              type="primary"
              onClick={() => {
                setOpen(true);
              }}
            >
              {<AlignLeftOutlined />}
            </Button>
          </div>
          <Drawer
            closable={false}
            destroyOnClose
            title={
              <div
                className="header-side-nav"
                style={{
                  justifyContent: 'center',
                  backgroundColor: 'transparent'
                }}
              >
                <div className="header-side-logo">
                  <img src={Logo} alt="Logo" onClick={() => navigate('/atendente/home')}></img>
                </div>
                <Button
                  type="text"
                  onClick={() => setOpen(false)}
                  className="button-side-nav"
                  style={{
                    color: 'black'
                  }}
                >
                  <CloseOutlined />
                </Button>
              </div>
            }
            placement="left"
            open={open}
            onClose={() => {
              setOpen(false);
            }}
            className="drawer"
            width={300}
          >
            <Menu
              mode="inline"
              theme="light"
              style={{
                width: '100%'
              }}
              onClick={(e) => {
                navigate(e.key);
                setOpen(false);
              }}
              selectedKeys={selectedKeys}
              items={items(navigate)}
            />
          </Drawer>
        </>
      )}
    </div>
  );
}

export default SideNav;
