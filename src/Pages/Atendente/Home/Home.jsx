import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import './home.css';
import chamadosService from '../../../service/chamadosService';
import { useNavigate } from 'react-router-dom';
import usuariosService from '../../../service/usuariosService';
import empresasService from '../../../service/empresasService';
import equipamentosService from '../../../service/equipamentosService';
import { Alert, Spin } from 'antd';
import Cookies from 'js-cookie';

function Home() {
  const [chamadosData, setChamadosData] = useState([]);
  const [usuariosData, setUsuariosData] = useState([]);
  const [empresasData, setEmpresasData] = useState([]);
  const [equipamentosData, setEquipamentosData] = useState([]);
  const [chamadosSobResponsabilidade, setChamadosSobResponsabilidade] = useState(0);
  const [chamadosRecentes, setChamadosRecentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const nivelData = Cookies.get('nivel');
  const nivel = parseInt(nivelData);

  // Exemplo de cores
  const COLORS = ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0'];

  const navigate = useNavigate();
  const handleRowClick = (record) => {
    navigate(`/atendente/chamados/${record.IDdoc}/${record.IDchamado}`);
  };

  useEffect(() => {
    // Aqui você faria as chamadas para buscar os dados reais dos gráficos e dos chamados recentes
    const fetchData = async () => {
      try {
        if (nivel === 2 || nivel === 1) {
          const statusData = await chamadosService.findByStatus();
          const countData = await chamadosService.findCount();
          const chamadosData = await chamadosService.findByRes();

          const usuarioData = await usuariosService.getUsuariosCount();
          const empresaData = await empresasService.getEmpresasByStatus();
          const equipamentoData = await equipamentosService.getEquipamentosByStatus();

          const statusArray = Object.keys(statusData).map((key) => ({
            name: key,
            value: statusData[key]
          }));

          // Converte o objeto em um array
          const UsuarioArray = Object.keys(usuarioData).map((key) => ({
            name: key,
            value: usuarioData[key]
          }));

          const EmpresaArray = Object.keys(empresaData).map((key) => ({
            name: key,
            value: empresaData[key]
          }));

          const EquipamentoArray = Object.keys(equipamentoData).map((key) => ({
            name: key,
            value: equipamentoData[key]
          }));

          setChamadosData(statusArray);
          setChamadosSobResponsabilidade(countData);
          setChamadosRecentes(chamadosData);

          setUsuariosData(UsuarioArray);
          setEmpresasData(EmpresaArray);
          setEquipamentosData(EquipamentoArray);
        } else if (nivel === 3) {
          const countData = await chamadosService.findCount();
          const chamadosData = await chamadosService.findByRes();

          const usuarioData = await usuariosService.getUsuariosCount();
          const equipamentoData = await equipamentosService.getEquipamentosByStatus();

          // Converte o objeto em um array
          const UsuarioArray = Object.keys(usuarioData).map((key) => ({
            name: key,
            value: usuarioData[key]
          }));

          const EquipamentoArray = Object.keys(equipamentoData).map((key) => ({
            name: key,
            value: equipamentoData[key]
          }));

          setChamadosSobResponsabilidade(countData);
          setChamadosRecentes(chamadosData);

          setUsuariosData(UsuarioArray);
          setEquipamentosData(EquipamentoArray);
        } else if (nivel === 4) {
          const chamadosData = await chamadosService.findByRes();

          setChamadosRecentes(chamadosData);
        }
      } catch (err) {
        setError(`Erro ao carregar os detalhes da empresa: ${err.message}`);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [nivel]);

  return (
    <div className="home-main">
      {loading ? (
        <div className="spin-container">
          <Spin tip="Carregando informações do usuário..." size="large">
            <div style={{ height: 'auto', width: '200px', background: 'transparent', fontSize: '2rem' }}></div>{' '}
            {/* Elemento aninhado para compatibilidade */}
          </Spin>
        </div>
      ) : error ? (
        <Alert message={error} type="error" showIcon />
      ) : (
        <div className="charts-container">
          {nivel <= 2 && (
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
          )}

          {nivel <= 3 && (
            <div className="responsabilidade">
              <i className="bi bi-headphones"></i>
              <h3>Chamados sob minha responsabilidade</h3>
              <div className="responsabilidade-box">{chamadosSobResponsabilidade}</div>
            </div>
          )}

          {nivel <= 2 && (
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
          )}

          {nivel <= 3 && (
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
          )}

          {nivel <= 3 && (
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
          )}

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
      )}
    </div>
  );
}

export default Home;
