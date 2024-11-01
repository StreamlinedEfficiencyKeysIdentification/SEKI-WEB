import { useEffect, useState } from 'react';
import { Table, Input } from 'antd';
import usuariosService from '../../service/usuariosService';
import { useNavigate } from 'react-router-dom';

function UsuariosLista() {
  const [filtro, setFiltro] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosOriginais, setUsuariosOriginais] = useState([]); // Estado para os usuários originais
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    pageSizeOptions: ['5', '10', '15', '20', '25'],
    showSizeChanger: true
  });

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  useEffect(() => {
    usuariosService
      .getUsuariosPorNivel()
      .then((data) => {
        setUsuarios(data);
        setUsuariosOriginais(data); // Armazena os usuários originais
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  // Função para lidar com a entrada do filtro
  const handleFiltroChange = (e) => {
    const valorFiltro = e.target.value;
    setFiltro(valorFiltro);

    // Se o filtro estiver vazio, reseta a lista de usuários
    if (valorFiltro === '') {
      setUsuarios(usuariosOriginais);
      return;
    }

    // Filtra os usuários com base no filtro digitado
    const usuariosFiltrados = usuariosOriginais.filter(
      (usuario) =>
        usuario.Nome.toLowerCase().includes(valorFiltro.toLowerCase()) ||
        usuario.Usuario.toLowerCase().includes(valorFiltro.toLowerCase()) ||
        usuario.Email.toLowerCase().includes(valorFiltro.toLowerCase())
    );

    setUsuarios(usuariosFiltrados);
  };

  const navigate = useNavigate();

  // Função para lidar com o clique no registro do usuário
  const handleClick = (record) => {
    navigate(`/atendente/usuarios/${record.uid}`);
  };

  // Definição das colunas para a tabela do Ant Design
  const columns = [
    {
      title: 'Nome',
      dataIndex: 'Nome',
      key: 'Nome'
    },
    {
      title: 'Usuário',
      dataIndex: 'Usuario',
      key: 'Usuario'
    },
    {
      title: 'Email',
      dataIndex: 'Email',
      key: 'Email'
    },
    {
      title: 'Empresa',
      dataIndex: 'NomeEmpresa',
      key: 'IDempresa'
    },
    {
      title: 'Nível',
      dataIndex: 'NomeNivel',
      key: 'IDnivel'
    },
    {
      title: 'Status',
      dataIndex: 'Status',
      key: 'Status'
    }
  ];

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro ao carregar usuários: {error.message}</p>;

  return (
    <div>
      <h2>Lista de Usuários</h2>
      <Input
        placeholder="Buscar por Nome, Usuário ou Email"
        value={filtro}
        onChange={handleFiltroChange}
        style={{ marginBottom: '10px', width: '100%' }}
      />
      <Table
        columns={columns}
        dataSource={usuarios}
        pagination={pagination}
        onChange={handleTableChange}
        rowKey={(record) => record.uid}
        onRow={(record) => ({
          onClick: () => handleClick(record)
        })}
      />
    </div>
  );
}

export default UsuariosLista;
