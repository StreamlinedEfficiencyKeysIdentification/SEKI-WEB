import { useState, useEffect } from 'react';
import { AlignLeftOutlined, AlignRightOutlined } from '@ant-design/icons';
import { Button, Drawer, Menu } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import Logo from '/SEKI.svg';
import './sideNav.css';

const items = (navigate) => [
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
      {
        key: '/atendente/chamados/criar',
        label: 'Novo Chamado'
      }
    ]
  },
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
  },
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
  },
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
];

function SideNav() {
  const location = useLocation(); // Hook para capturar a URL atual
  const navigate = useNavigate(); // Para navegar pelo app
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [open, setOpen] = useState(false);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setMobile(window.innerWidth < 1024);
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
                <img src={Logo}></img>
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
              items={items(navigate)}
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
            closable
            destroyOnClose
            title={<img src={Logo}></img>}
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
