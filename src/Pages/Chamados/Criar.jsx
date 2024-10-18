// Criar.jsx
import { useState, useEffect } from 'react';
import chamadosService from '../../service/chamadosService';
import empresasService from '../../service/empresasService';
import usuariosService from '../../service/usuariosService';

function CriarChamado() {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [empresas, setEmpresas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [empresaSelecionada, setEmpresaSelecionada] = useState('');
  const [usuarioSelecionado, setUsuarioSelecionado] = useState('');

  // Função para buscar empresas conforme o nível do usuário
  useEffect(() => {
    async function fetchEmpresas() {
      const empresas = await empresasService.getEmpresasDisponiveis(); // Implementar esta função no back-end
      setEmpresas(empresas);
    }
    fetchEmpresas();
  }, []);

  // Função para buscar usuários da empresa selecionada
  useEffect(() => {
    async function fetchUsuarios() {
      if (empresaSelecionada) {
        const usuarios = await usuariosService.getUsuariosPorEmpresa(empresaSelecionada); // Implementar no back-end
        setUsuarios(usuarios);
      }
    }
    fetchUsuarios();
  }, [empresaSelecionada]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Chama o serviço para salvar o chamado
      const response = await chamadosService.save(titulo, descricao, empresaSelecionada, usuarioSelecionado);

      console.log('Chamado criado com sucesso:', response);
      alert('Chamado criado com sucesso!');

      // Limpa os campos do formulário após o sucesso
      setTitulo('');
      setDescricao('');
      setEmpresaSelecionada('');
      setUsuarioSelecionado('');
    } catch (error) {
      console.error('Erro ao criar o chamado:', error);
      alert('Erro ao criar o chamado. Tente novamente.');
    }

    console.log('Chamado criado:', { titulo, descricao, empresaSelecionada, usuarioSelecionado });
  };

  return (
    <div>
      <h2>Criar Novo Chamado</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Título:</label>
          <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
        </div>
        <div>
          <label>Descrição:</label>
          <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} required />
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
          <label>Usuário:</label>
          <select
            value={usuarioSelecionado}
            onChange={(e) => setUsuarioSelecionado(e.target.value)}
            disabled={!empresaSelecionada}
            required
          >
            <option value="">Selecione um usuário</option>
            {usuarios.map((usuario) => (
              <option key={usuario.uid} value={usuario.uid}>
                {usuario.Nome}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Criar Chamado</button>
      </form>
    </div>
  );
}

export default CriarChamado;
