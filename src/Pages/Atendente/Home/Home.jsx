import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import './home.css';

function Home() {
  const [chamadosData, setChamadosData] = useState([]);
  const [usuariosData, setUsuariosData] = useState([]);
  const [empresasData, setEmpresasData] = useState([]);
  const [equipamentosData, setEquipamentosData] = useState([]);
  // const [chamadosSobResponsabilidade, setChamadosSobResponsabilidade] = useState(4); // Exemplo
  const [chamadosRecentes, setChamadosRecentes] = useState([]);

  // Exemplo de cores
  const COLORS = ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0'];

  useEffect(() => {
    // Aqui você faria as chamadas para buscar os dados reais dos gráficos e dos chamados recentes
    setChamadosData([
      { name: 'Não Iniciado', value: 5 },
      { name: 'Em Andamento', value: 10 },
      { name: 'Aguardando', value: 3 },
      { name: 'Concluído', value: 12 }
    ]);

    setUsuariosData([
      { name: 'Ativos', value: 15 },
      { name: 'Inativos', value: 5 }
    ]);

    setEmpresasData([
      { name: 'Ativas', value: 4 },
      { name: 'Inativas', value: 0 }
    ]);

    setEquipamentosData([
      { name: 'Ativos', value: 12 },
      { name: 'Inativos', value: 3 }
    ]);

    // Buscar dados dos chamados recentes do usuário logado
    const chamadosDoUsuario = [
      { id: '000001', titulo: 'Erro no sistema', dataAbertura: '2024-10-25', status: 'Em andamento' },
      { id: '000002', titulo: 'Atualização pendente', dataAbertura: '2024-10-24', status: 'Aguardando' },
      { id: '000003', titulo: 'Problema de rede', dataAbertura: '2024-10-23', status: 'Não iniciado' },
      { id: '000004', titulo: 'Backup de dados', dataAbertura: '2024-10-22', status: 'Concluído' },
      { id: '000005', titulo: 'Erro de login', dataAbertura: '2024-10-21', status: 'Em andamento' }
    ];

    setChamadosRecentes(chamadosDoUsuario.slice(0, 5)); // Pega os 5 últimos chamados
  }, []);

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
          <div className="responsabilidade-box">10</div>
        </div>

        {/* Gráfico de Empresas */}
        <div className="chart">
          <h3>Empresas</h3>
          <PieChart width={250} height={250}>
            <Pie
              data={empresasData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label
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
          <PieChart width={250} height={250}>
            <Pie
              data={usuariosData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label
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
          <PieChart width={250} height={250}>
            <Pie
              data={equipamentosData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
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
            {chamadosRecentes.map((chamado) => (
              <li key={chamado.id} className="chamado-item">
                <div className="chamado-group">
                  <strong>{chamado.id}</strong>
                  {chamado.dataAbertura}
                </div>
                <div className="chamado-group">
                  <div>{chamado.titulo}</div>
                  {chamado.status}
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
