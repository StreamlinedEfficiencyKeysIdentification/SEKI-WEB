// Criar.jsx
import { useState, useEffect } from 'react';
import empresasService from '../../service/empresasService';

function CriarEmpresa() {
  const [cnpj, setCNPJ] = useState('');
  const [razaoSocial, setRazaoSocial] = useState('');
  const [empresas, setEmpresas] = useState([]);
  const [empresaSelecionada, setEmpresaSelecionada] = useState('');

  // Função para buscar empresas conforme o nível do usuário
  useEffect(() => {
    async function fetchEmpresas() {
      const empresas = await empresasService.getEmpresasPai(); // Implementar esta função no back-end
      setEmpresas(empresas);
    }
    fetchEmpresas();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Chama o serviço para salvar o chamado

      await empresasService.save(cnpj, razaoSocial, empresaSelecionada);

      alert('Empresa criada com sucesso!');

      // Limpa os campos do formulário após o sucesso
      setCNPJ('');
      setRazaoSocial('');
      setEmpresaSelecionada('');
    } catch (error) {
      console.error('Erro ao criar o chamado:', error);
      alert('Erro ao criar o chamado. Tente novamente.');
    }
  };

  return (
    <div>
      <h2>Criar Nova Empresa</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>CNPJ:</label>
          <input type="text" value={cnpj} onChange={(e) => setCNPJ(e.target.value)} required />
        </div>
        <div>
          <label>Razão Social:</label>
          <input type="text" value={razaoSocial} onChange={(e) => setRazaoSocial(e.target.value)} required />
        </div>
        <div>
          <label>Empresa Pai:</label>
          <select value={empresaSelecionada} onChange={(e) => setEmpresaSelecionada(e.target.value)} required>
            <option value="">Selecione uma empresa</option>
            {empresas.map((empresa) => (
              <option key={empresa.IDempresa} value={empresa.IDempresa}>
                {empresa.RazaoSocial}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Criar Chamado</button>
      </form>
    </div>
  );
}

export default CriarEmpresa;
