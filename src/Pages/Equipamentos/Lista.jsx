import { useEffect, useState } from 'react';
import { Table, Input, Alert, Spin } from 'antd';
import equipamentosService from '../../service/equipamentosService';
import { useNavigate } from 'react-router-dom';
import './lista.css';

function EquipamentosLista() {
  const [filtro, setFiltro] = useState('');
  const [equipamentos, setEquipamentos] = useState([]);
  const [equipamentosOriginais, setEquipamentosOriginais] = useState([]); // Estado para os usuários originais
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
    equipamentosService
      .getEquipamentosPorNivel()
      .then((data) => {
        setEquipamentos(data);
        setEquipamentosOriginais(data); // Armazena os usuários originais
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
      setEquipamentos(equipamentosOriginais);
      return;
    }

    // Filtra os usuários com base no filtro digitado
    const equipamentosFiltrados = equipamentosOriginais.filter(
      (equipamento) =>
        equipamento.Marca.toLowerCase().includes(valorFiltro.toLowerCase()) ||
        equipamento.Modelo.toLowerCase().includes(valorFiltro.toLowerCase()) ||
        equipamento.IDqrcode.includes(valorFiltro)
    );

    setEquipamentos(equipamentosFiltrados);
  };

  const navigate = useNavigate();

  // Função para lidar com o clique no registro do usuário
  const handleClick = (record) => {
    navigate(`/atendente/equipamento/${record.IDdoc}`);
  };

  // Definição das colunas para a tabela do Ant Design
  const columns = [
    {
      title: 'Marca',
      dataIndex: 'Marca',
      key: 'Marca'
    },
    {
      title: 'Modelo',
      dataIndex: 'Modelo',
      key: 'Modelo'
    },
    {
      title: 'QRcode',
      dataIndex: 'IDqrcode',
      key: 'IDqrcode'
    },
    {
      title: 'Empresa',
      dataIndex: 'NomeEmpresa',
      key: 'IDempresa'
    },
    {
      title: 'Setor',
      dataIndex: 'NomeSetor',
      key: 'IDsetor'
    },
    {
      title: 'Usuario',
      dataIndex: 'NomeUsuario',
      key: 'IDusuario'
    },
    {
      title: 'Status',
      dataIndex: 'Status',
      key: 'Status'
    }
  ];

  return (
    <div className="container-equipamento">
      <div className="ce-content">
        {error ? (
          <Alert message="Erro" description={error} type="error" showIcon />
        ) : (
          <Spin spinning={loading} tip="Carregando dados..." size="large">
            <Input
              placeholder="Buscar por Marca, Modelo"
              value={filtro}
              onChange={handleFiltroChange}
              style={{ marginBottom: '10px', width: '100%' }}
            />
            <Table
              className="equipamentos-lista"
              columns={columns}
              dataSource={equipamentos}
              pagination={pagination}
              onChange={handleTableChange}
              rowKey={(record) => record.IDdoc}
              onRow={(record) => ({
                onClick: () => handleClick(record)
              })}
            />
          </Spin>
        )}
      </div>
    </div>
  );
}

export default EquipamentosLista;
