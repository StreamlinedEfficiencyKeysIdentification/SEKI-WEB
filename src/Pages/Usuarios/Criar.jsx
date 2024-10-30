// Criar.jsx
import { useState, useEffect } from 'react';
import empresasService from '../../service/empresasService';
import usuariosService from '../../service/usuariosService';

function CriarUsuario() {
  const [usuario, setUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [nome, setNome] = useState('');
  const [empresas, setEmpresas] = useState([]);
  const [nivel, setNivel] = useState([]);
  const [empresaSelecionada, setEmpresaSelecionada] = useState('');
  const [nivelSelecionado, setNivelSelecionado] = useState('');

  // Função para buscar empresas conforme o nível do usuário
  useEffect(() => {
    async function fetchEmpresas() {
      const empresas = await empresasService.getEmpresasDisponiveis(); // Implementar esta função no back-end
      setEmpresas(empresas);
    }
    fetchEmpresas();
  }, []);

  useEffect(() => {
    async function fetchNivel() {
      const nivel = await usuariosService.getNivel(); // Implementar esta função no back-end
      setNivel(nivel);
    }
    fetchNivel();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Chama o serviço para salvar o chamado

      await usuariosService.save(usuario, email, nome, empresaSelecionada, nivelSelecionado); // Implementar esta função no back-end

      alert('Usuario criado com sucesso!');

      // Limpa os campos do formulário após o sucesso
      setUsuario('');
      setEmail('');
      setNome('');
      setEmpresaSelecionada('');
      setNivelSelecionado('');
    } catch (error) {
      console.error('Erro ao criar o Usuario:', error);
      alert('Erro ao criar o Usuario. Tente novamente.');
    }
  };

  return (
    <div>
      <h2>Criar Novo Chamado</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Usuario:</label>
          <input type="text" value={usuario} onChange={(e) => setUsuario(e.target.value)} required />
        </div>
        <div>
          <label>E-mail:</label>
          <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Nome:</label>
          <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />
        </div>
        <div>
          <label>Empresa:</label>
          <select value={empresaSelecionada} onChange={(e) => setEmpresaSelecionada(e.target.value)} required>
            <option value="">Selecione uma empresa</option>
            {empresas.map((empresa) => (
              <option key={empresa.IDempresa} value={empresa.IDempresa}>
                {empresa.RazaoSocial}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Nivel:</label>
          <select value={nivelSelecionado} onChange={(e) => setNivelSelecionado(e.target.value)} required>
            <option value="">Selecione um nivel</option>
            {nivel.map((nivel) => (
              <option key={nivel.IDdoc} value={nivel.IDdoc}>
                {nivel.Descricao}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Criar Equipamento</button>
      </form>
    </div>
  );
}

export default CriarUsuario;
