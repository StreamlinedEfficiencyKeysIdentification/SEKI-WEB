import { Table } from 'antd';
import { useEffect, useState } from 'react';
import './lista.css';
import { useNavigate } from 'react-router-dom';
import chamadosService from '../../service/chamadosService';

function ChamadosLista() {
  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    chamadosService
      .findByUser()
      .then((data) => {
        setChamados(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    pageSizeOptions: ['5', '10', '15', '20', '25'],
    showSizeChanger: true
  });

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  const navigate = useNavigate();

  // Função para ir para a página com os detalhes do chamado
  const handleRowClick = (record) => {
    navigate(`/atendente/chamados/${record.IDdoc}/${record.IDchamado}`);
  };

  // Definição das colunas da tabela
  const columns = [
    {
      title: 'Responsável',
      dataIndex: 'Responsavel',
      key: 'responsavel',
      sorter: (a, b) => a.Responsavel.localeCompare(b.Responsavel)
    },
    {
      title: 'Status',
      dataIndex: 'Status',
      key: 'status',
      sorter: (a, b) => a.Status.localeCompare(b.Status)
    },
    {
      title: 'Data de Abertura',
      dataIndex: 'DataCriacao',
      key: 'dataAbertura',
      sorter: (a, b) => new Date(a.DataCriacao) - new Date(b.DataCriacao)
    },
    {
      title: 'Número',
      dataIndex: 'IDchamado',
      key: 'numero',
      sorter: (a, b) => a.IDchamado.localeCompare(b.IDchamado)
    },
    {
      title: 'Título',
      dataIndex: 'Titulo',
      key: 'titulo',
      sorter: (a, b) => a.Titulo.localeCompare(b.Titulo)
    },
    {
      title: 'Empresa',
      dataIndex: 'Empresa',
      key: 'empresa',
      sorter: (a, b) => a.Empresa.localeCompare(b.Empresa)
    },
    {
      title: 'Usuário',
      dataIndex: 'Usuario',
      key: 'usuario',
      sorter: (a, b) => a.Usuario.localeCompare(b.Usuario)
    },
    {
      title: 'Lido',
      dataIndex: 'Lido',
      key: 'lido',
      sorter: (a, b) => a.Lido - b.Lido,
      render: (text) => (text ? 'Sim' : 'Não') // Mostrar "Sim" ou "Não" para o campo booleano
    }
  ];

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro ao carregar chamados: {error.message}</p>;

  return (
    <Table
      columns={columns}
      dataSource={chamados}
      pagination={pagination}
      onChange={handleTableChange}
      rowKey={(record) => `${record.IDdoc}-${record.IDchamado}`} // Definir a chave única
      onRow={(record) => ({
        onClick: () => handleRowClick(record) // Adiciona a função de clique na linha
      })}
    />
  );
}

export default ChamadosLista;
