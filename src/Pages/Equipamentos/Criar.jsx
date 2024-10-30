// Criar.jsx
import { useState, useEffect } from 'react';
import empresasService from '../../service/empresasService';
import usuariosService from '../../service/usuariosService';
import equipamentosService from '../../service/equipamentosService';

function CriarEquipamento() {
  const [usuario, setUsuario] = useState('');
  const [qrcode, setQrcode] = useState('');
  const [empresaSelecionada, setEmpresaSelecionada] = useState('');
  const [setorSelecionado, setSetorSelecionado] = useState('');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [setores, setSetores] = useState([]);

  // Função para gerar o hash do QR code
  const handleGenerateQRCode = async () => {
    try {
      const hash = await equipamentosService.generateQRCodeHash();
      setQrcode(hash); // Define o hash no campo qrcode
    } catch (error) {
      console.error('Erro ao gerar QR code:', error);
    }
  };

  useEffect(() => {
    async function fetchUsuarios() {
      const usuarios = await usuariosService.getUsuariosPorNivel(); // Implementar esta função no back-end
      setUsuarios(usuarios);
    }
    fetchUsuarios();
  }, []);

  // Função para buscar empresas conforme o nível do usuário
  useEffect(() => {
    async function fetchEmpresas() {
      const empresas = await empresasService.getEmpresasDisponiveis(); // Implementar esta função no back-end
      setEmpresas(empresas);
    }
    fetchEmpresas();
  }, []);

  useEffect(() => {
    async function fetchSetor() {
      if (empresaSelecionada) {
        const setor = await empresasService.getSetoresPorEmpresa(empresaSelecionada); // Implementar esta função no back-end
        setSetores(setor);
      }
    }
    fetchSetor();
  }, [empresaSelecionada]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Chama o serviço para salvar o chamado

      await equipamentosService.save(usuario, qrcode, empresaSelecionada, setorSelecionado, marca, modelo); // Implementar esta função no back-end

      alert('Equipamento criado com sucesso!');

      // Limpa os campos do formulário após o sucesso
      setUsuario('');
      setQrcode('');
      setEmpresaSelecionada('');
      setSetorSelecionado('');
      setMarca('');
      setModelo('');
    } catch (error) {
      console.error('Erro ao criar o equipamento:', error);
      alert('Erro ao criar o equipamento. Tente novamente.');
    }
  };

  return (
    <div>
      <h2>Criar Novo Equipamento</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Qrcode:</label>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="text"
              value={qrcode}
              readOnly // Torna o campo somente leitura
              style={{ marginRight: '8px' }}
              required
            />
            <button type="button" onClick={handleGenerateQRCode}>
              <i className="bi bi-arrow-clockwise"></i>
            </button>
          </div>
        </div>
        <div>
          <label>Marca:</label>
          <input type="text" value={marca} onChange={(e) => setMarca(e.target.value)} required />
        </div>
        <div>
          <label>Modelo:</label>
          <input type="text" value={modelo} onChange={(e) => setModelo(e.target.value)} required />
        </div>
        <div>
          <label>Usuario:</label>
          <select value={usuario} onChange={(e) => setUsuario(e.target.value)} required>
            <option value="">Selecione uma empresa</option>
            {usuarios.map((usuario) => (
              <option key={usuario.uid} value={usuario.uid}>
                {usuario.Nome}
              </option>
            ))}
          </select>
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
          <label>Setor:</label>
          <select
            value={setorSelecionado}
            onChange={(e) => setSetorSelecionado(e.target.value)}
            disabled={!empresaSelecionada}
            required
          >
            <option value="">Selecione um setor</option>
            {setores.map((setor) => (
              <option key={setor.IDdoc} value={setor.IDdoc}>
                {setor.Descricao}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Criar Equipamento</button>
      </form>
    </div>
  );
}

export default CriarEquipamento;
