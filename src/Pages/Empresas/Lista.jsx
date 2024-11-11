import { Table, Button, Input, Alert, Spin } from 'antd';
import { useEffect, useState } from 'react';
import empresasService from '../../service/empresasService';
import { useNavigate } from 'react-router-dom';
import './lista.css';

function EmpresasLista() {
  const [filtro, setFiltro] = useState('');
  const [empresas, setEmpresas] = useState([]);
  const [empresasOriginais, setEmpresasOriginais] = useState([]); // Estado para os usuários originais
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    empresasService
      .findByUser()
      .then((data) => {
        setEmpresas(data);
        setEmpresasOriginais(data); // Armazena as empresas originais
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

  const handleFiltroChange = (e) => {
    const valorFiltro = e.target.value;
    setFiltro(valorFiltro);

    if (valorFiltro === '') {
      setEmpresas(empresasOriginais);
      return;
    }

    // Nova lógica para incluir Matriz e Filiais no filtro
    let empresasFiltradas = empresasOriginais.filter((empresa) => {
      // Verifica se a Matriz contém o filtro
      return (
        empresa.RazaoSocial.toLowerCase().includes(valorFiltro.toLowerCase()) ||
        empresa.CNPJ.toLowerCase().includes(valorFiltro.toLowerCase())
      );
    });

    // Adiciona as filiais das matrizes filtradas
    const filiaisFiltradas = [];
    empresasFiltradas.forEach((matriz) => {
      if (matriz.EmpresaPai === matriz.IDdoc) {
        // Verifica se é uma Matriz
        const filiais = getFiliais(matriz.IDdoc);
        filiaisFiltradas.push(...filiais);
      }
    });

    // Adiciona as filiais à lista filtrada final
    empresasFiltradas = [...empresasFiltradas, ...filiaisFiltradas];

    // Remove duplicatas se necessário (caso as filiais já estejam na lista)
    const idsUnicos = new Set();
    const resultadoFinal = empresasFiltradas.filter((empresa) => {
      if (!idsUnicos.has(empresa.IDdoc)) {
        idsUnicos.add(empresa.IDdoc);
        return true;
      }
      return false;
    });

    setEmpresas(resultadoFinal);
  };

  function formatarCNPJ(cnpj) {
    // Verifica se o CNPJ é válido e tem 14 dígitos
    if (!cnpj || cnpj.length !== 14) {
      return cnpj; // Retorna o valor original se não for válido
    }
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
  }

  // Configuração das colunas
  const columns = [
    {
      title: 'Razão Social',
      dataIndex: 'RazaoSocial',
      key: 'RazaoSocial'
    },
    {
      title: 'CNPJ',
      dataIndex: 'CNPJ',
      key: 'CNPJ',
      render: (text) => formatarCNPJ(text)
    },
    {
      title: 'Status',
      dataIndex: 'Status',
      key: 'Status'
    },
    {
      title: 'Quem Criou',
      dataIndex: 'NomeQuemCriou',
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
      title: 'Razão Social',
      dataIndex: 'RazaoSocial',
      key: 'RazaoSocial'
    },
    {
      title: 'CNPJ',
      dataIndex: 'CNPJ',
      key: 'CNPJ',
      render: (text) => formatarCNPJ(text)
    },
    {
      title: 'Status',
      dataIndex: 'Status',
      key: 'Status'
    },
    {
      title: 'Quem Criou',
      dataIndex: 'NomeQuemCriou',
      key: 'QuemCriou'
    }
  ];

  const navigate = useNavigate();

  // Função para redirecionar aos detalhes da matriz
  const handleDetalhesMatriz = (record) => {
    navigate(`/atendente/empresa/${record.IDdoc}`);
    // Implementar a navegação para a página de detalhes da matriz
  };

  // Função para redirecionar aos detalhes da filial
  const handleDetalhesFilial = (record) => {
    navigate(`/atendente/empresa/${record.IDdoc}`);
    // Implementar a navegação para a página de detalhes da filial
  };

  return (
    <div className="container-empresa">
      <div className="ce-content">
        {error ? (
          <Alert message="Erro" description={error} type="error" showIcon />
        ) : (
          <Spin spinning={loading} tip="Carregando dados..." size="large">
            <Input
              placeholder="Buscar por CNPJ ou Razão Social"
              value={filtro}
              onChange={handleFiltroChange}
              style={{ marginBottom: '10px', width: '100%' }}
            />
            <Table
              className="empresas-lista"
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
          </Spin>
        )}
      </div>
    </div>
  );
}

export default EmpresasLista;
