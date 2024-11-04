import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import './home.css';
import chamadosService from '../../../service/chamadosService';
import { useNavigate } from 'react-router-dom';
import usuariosService from '../../../service/usuariosService';
import empresasService from '../../../service/empresasService';
import equipamentosService from '../../../service/equipamentosService';

function Home() {
  const [chamadosData, setChamadosData] = useState([]);
  const [usuariosData, setUsuariosData] = useState([]);
  const [empresasData, setEmpresasData] = useState([]);
  const [equipamentosData, setEquipamentosData] = useState([]);
  const [chamadosSobResponsabilidade, setChamadosSobResponsabilidade] = useState(0);
  const [chamadosRecentes, setChamadosRecentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Exemplo de cores
  const COLORS = ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0'];

  const navigate = useNavigate();
  const handleRowClick = (record) => {
    navigate(`/atendente/chamados/${record.IDdoc}/${record.IDchamado}`);
  };

  useEffect(() => {
    // Aqui você faria as chamadas para buscar os dados reais dos gráficos e dos chamados recentes
    const fetchChamados = async () => {
      try {
        // Busca a empresa pelo uidDoc e uidEmpresa
        const statusData = await chamadosService.findByStatus();
        const countData = await chamadosService.findCount();
        const chamadosData = await chamadosService.findByRes();

        // Converte o objeto em um array
        const statusArray = Object.keys(statusData).map((key) => ({
          name: key,
          value: statusData[key]
        }));

        setChamadosData(statusArray);
        setChamadosSobResponsabilidade(countData);
        setChamadosRecentes(chamadosData);
        setLoading(false);
      } catch (err) {
        setError(`Erro ao carregar os detalhes da empresa: ${err.message}`);
        setLoading(false);
      }
    };

    const fetchUsuariosByStatus = async () => {
      try {
        // Busca a empresa pelo uidDoc e uidEmpresa
        const statusData = await usuariosService.getUsuariosCount();

        // Converte o objeto em um array
        const statusArray = Object.keys(statusData).map((key) => ({
          name: key,
          value: statusData[key]
        }));

        setUsuariosData(statusArray);
        setLoading(false);
      } catch (err) {
        setError(`Erro ao carregar os detalhes da empresa: ${err.message}`);
        setLoading(false);
      }
    };

    const fetchEmpresasByStatus = async () => {
      try {
        // Busca a empresa pelo uidDoc e uidEmpresa
        const statusData = await empresasService.getEmpresasByStatus();

        // Converte o objeto em um array
        const statusArray = Object.keys(statusData).map((key) => ({
          name: key,
          value: statusData[key]
        }));

        setEmpresasData(statusArray);
        setLoading(false);
      } catch (err) {
        setError(`Erro ao carregar os detalhes da empresa: ${err.message}`);
        setLoading(false);
      }
    };

    const fetchEquipamentosByStatus = async () => {
      try {
        // Busca a empresa pelo uidDoc e uidEmpresa
        const statusData = await equipamentosService.getEquipamentosByStatus();

        // Converte o objeto em um array
        const statusArray = Object.keys(statusData).map((key) => ({
          name: key,
          value: statusData[key]
        }));

        setEquipamentosData(statusArray);
        setLoading(false);
      } catch (err) {
        setError(`Erro ao carregar os detalhes da empresa: ${err.message}`);
        setLoading(false);
      }
    };

    setChamadosRecentes(); // Pega os 5 últimos chamados
    fetchChamados();
    fetchUsuariosByStatus();
    fetchEmpresasByStatus();
    fetchEquipamentosByStatus();
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>{error}</div>; // Exibe a mensagem de erro, se houver
  }

  return (
    <div className="home-main">
      <div className="charts-container">
        {/* Gráfico de Chamados */}
        <div className="chart">
          <h3>Chamados</h3>
          <PieChart width={250} height={300}>
            <Pie
              data={chamadosData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label
              animationDuration={1000} // Define 1 segundo de animação
            >
              {chamadosData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        {/* Exibição de Chamados sob Responsabilidade */}
        <div className="responsabilidade">
          <i className="bi bi-headphones"></i>
          <h3>Chamados sob minha responsabilidade</h3>
          <div className="responsabilidade-box">{chamadosSobResponsabilidade}</div>
        </div>

        {/* Gráfico de Empresas */}
        <div className="chart">
          <h3>Empresas</h3>
          <PieChart width={250} height={300}>
            <Pie
              data={empresasData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label
              animationDuration={1000}
            >
              {empresasData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        {/* Gráfico de Usuários */}
        <div className="chart">
          <h3>Usuários</h3>
          <PieChart width={250} height={300}>
            <Pie
              data={usuariosData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label
              animationDuration={1000}
            >
              {usuariosData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        {/* Gráfico de Equipamentos */}
        <div className="chart">
          <h3>Equipamentos</h3>
          <PieChart width={250} height={300}>
            <Pie
              data={equipamentosData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              animationDuration={1000}
              label
            >
              {equipamentosData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
        <div className="chamados-recentes">
          <div className="chamados-header">
            <h3>Meus chamados</h3>
            <a href="/atendente/chamados/lista" className="icon-link">
              <i className="bi bi-list-ul" size={20}></i>
            </a>
          </div>
          <ul className="chamados-list">
            {chamadosRecentes?.map((chamado) => (
              <li key={chamado.IDchamado} className="chamado-item" onClick={() => handleRowClick(chamado)}>
                <div className="chamado-group">
                  <strong>{chamado.IDchamado}</strong>
                  {chamado.DataCriacao}
                </div>
                <div className="chamado-group">
                  <div>{chamado.Titulo}</div>
                  {chamado.Status}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Home;
