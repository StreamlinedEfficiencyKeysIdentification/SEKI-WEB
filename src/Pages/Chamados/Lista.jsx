import { Alert, Spin, Table } from 'antd';
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
      dataIndex: 'NomeResponsavel',
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
      sorter: (a, b) => {
        const parseDate = (dateStr) => {
          const [datePart, timePart] = dateStr.split(' às ');
          const [day, month, year] = datePart.split('/');
          const [hours, minutes, seconds] = timePart.split(':');
          return new Date(year, month - 1, day, hours, minutes, seconds);
        };

        const dateA = parseDate(a.DataCriacao);
        const dateB = parseDate(b.DataCriacao);
        return dateA - dateB;
      }
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
      dataIndex: 'NomeEmpresa',
      key: 'empresa',
      sorter: (a, b) => a.Empresa.localeCompare(b.Empresa)
    },
    {
      title: 'Usuário',
      dataIndex: 'NomeUsuario',
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

  // Configurações de localização personalizada para a tabela
  const locale = {
    triggerDesc: 'Clique para ordenar em ordem decrescente',
    triggerAsc: 'Clique para ordenar em ordem crescente',
    cancelSort: 'Clique para cancelar a ordenação'
  };

  return (
    <div className="container-chamado">
      <div className="cc-content">
        {error ? (
          <Alert message="Erro" description={error} type="error" showIcon />
        ) : (
          <Spin spinning={loading} tip="Carregando dados..." size="large">
            <Table
              className="chamados-lista"
              columns={columns}
              dataSource={chamados}
              pagination={pagination}
              onChange={handleTableChange}
              rowKey={(record) => `${record.IDdoc}-${record.IDchamado}`} // Definir a chave única
              onRow={(record) => ({
                onClick: () => handleRowClick(record) // Adiciona a função de clique na linha
              })}
              locale={locale}
            />
          </Spin>
        )}
      </div>
    </div>
  );
}

export default ChamadosLista;
