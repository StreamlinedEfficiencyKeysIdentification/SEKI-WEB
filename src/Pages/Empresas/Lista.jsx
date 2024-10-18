import { Table, Button } from 'antd';
import { useEffect, useState } from 'react';
import empresasService from '../../service/empresasService';

function EmpresasLista() {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    empresasService
      .findByUser()
      .then((data) => {
        setEmpresas(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  // Função para obter as filiais de uma matriz
  const getFiliais = (matrizId) => {
    return empresas.filter((empresa) => empresa.EmpresaPai === matrizId && empresa.IDdoc !== matrizId);
  };

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    pageSizeOptions: ['5', '10', '15', '20', '25'],
    showSizeChanger: true
  });

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  // Configuração das colunas
  const columns = [
    {
      title: 'CNPJ',
      dataIndex: 'CNPJ',
      key: 'CNPJ'
    },
    {
      title: 'Razão Social',
      dataIndex: 'RazaoSocial',
      key: 'RazaoSocial'
    },
    {
      title: 'Status',
      dataIndex: 'Status',
      key: 'Status'
    },
    {
      title: 'Quem Criou',
      dataIndex: 'QuemCriou',
      key: 'QuemCriou'
    },
    {
      title: 'Ações',
      key: 'acoes',
      render: (_, record) =>
        record.EmpresaPai === record.IDdoc && ( // Só mostra o botão para matrizes
          <Button onClick={() => handleDetalhesMatriz(record)}>Ver Detalhes</Button>
        )
    }
  ];

  // Configuração das colunas para filiais (sem "Ações")
  const columnsFilial = [
    {
      title: 'CNPJ',
      dataIndex: 'CNPJ',
      key: 'CNPJ'
    },
    {
      title: 'Razão Social',
      dataIndex: 'RazaoSocial',
      key: 'RazaoSocial'
    },
    {
      title: 'Status',
      dataIndex: 'Status',
      key: 'Status'
    },
    {
      title: 'Quem Criou',
      dataIndex: 'QuemCriou',
      key: 'QuemCriou'
    }
  ];

  // Função para redirecionar aos detalhes da matriz
  const handleDetalhesMatriz = (record) => {
    console.log('Abrindo detalhes da matriz:', record);
    // Implementar a navegação para a página de detalhes da matriz
  };

  // Função para redirecionar aos detalhes da filial
  const handleDetalhesFilial = (record) => {
    console.log('Abrindo detalhes da filial:', record);
    // Implementar a navegação para a página de detalhes da filial
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro ao carregar chamados: {error.message}</p>;

  return (
    <Table
      columns={columns}
      dataSource={empresas.filter((empresa) => empresa.EmpresaPai === empresa.IDdoc)} // Filtra apenas as matrizes
      pagination={pagination}
      onChange={handleTableChange}
      rowKey={(record) => record.IDdoc}
      expandable={{
        expandedRowRender: (record) => {
          const filiais = getFiliais(record.IDdoc);
          return filiais.length > 0 ? (
            <Table
              columns={columnsFilial}
              dataSource={filiais}
              pagination={false}
              rowKey={(filial) => filial.IDdoc}
              onRow={(filial) => ({
                onClick: () => handleDetalhesFilial(filial)
              })}
            />
          ) : (
            <p>Nenhuma filial encontrada.</p>
          );
        },
        rowExpandable: (record) => getFiliais(record.IDdoc).length > 0
      }}
    />
  );
}

export default EmpresasLista;
