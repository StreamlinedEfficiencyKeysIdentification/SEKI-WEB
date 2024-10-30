import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Select, Button } from 'antd';
import chamadosService from '../../service/chamadosService';
import empresasService from '../../service/empresasService';
import usuariosService from '../../service/usuariosService';

const ChamadoDetalhes = () => {
  const { IDdoc, IDchamado } = useParams();
  const [chamado, setChamado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [empresas, setEmpresas] = useState([]);
  const [usuario, setUsuario] = useState([]);
  const [responsaveis, setResponsaveis] = useState([]);
  const [isChanged, setIsChanged] = useState(false);

  // Variáveis temporárias para os campos editáveis
  const [empresaTemp, setEmpresaTemp] = useState(null);
  const [responsavelTemp, setResponsavelTemp] = useState(null);
  const [statusTemp, setStatusTemp] = useState(null);

  const fetchUsuario = useCallback(async (uid) => {
    if (!uid) return;

    try {
      const usuarioData = await usuariosService.getUsuarioByUid(uid);
      if (usuarioData) {
        setUsuario(usuarioData);
      } else {
        setUsuario([]);
      }
    } catch (error) {
      console.error('Erro ao buscar o usuário:', error);
      setUsuario([]);
    }
  }, []);

  useEffect(() => {
    const fetchChamado = async () => {
      try {
        const chamadoData = await chamadosService.findById(IDdoc, IDchamado);
        setChamado(chamadoData);
        setEmpresaTemp(chamadoData.Empresa);
        setResponsavelTemp(chamadoData.Responsavel);
        setStatusTemp(chamadoData.Status);
        setLoading(false);

        fetchUsuario(chamadoData.Usuario);

        // Verifica se o chamado não foi lido e atualiza o campo Lido
        if (!chamadoData.Lido) {
          await chamadosService.updateLido(IDdoc, IDchamado); // Chama a função para atualizar o campo Lido
        }
      } catch (err) {
        setError(`Erro ao carregar os detalhes do chamado: ${err.message}`);
        console.error(err);
        setLoading(false);
      }
    };
    fetchChamado();
  }, [IDdoc, IDchamado, fetchUsuario]);

  useEffect(() => {
    const fetchEmpresas = async () => {
      const empresasData = await empresasService.getEmpresasDisponiveis();
      setEmpresas(empresasData.map((empresa) => ({ value: empresa.IDempresa, label: empresa.RazaoSocial })));
    };

    const fetchResponsaveis = async () => {
      const responsaveisData = await usuariosService.getResponsaveis();
      setResponsaveis(responsaveisData.map((responsavel) => ({ value: responsavel.uid, label: responsavel.Nome })));
    };

    fetchEmpresas();
    fetchResponsaveis();
  }, []);

  const handleSelectChange = (field, value) => {
    setIsChanged(true);
    switch (field) {
      case 'Empresa':
        setEmpresaTemp(value);
        break;
      case 'Responsavel':
        setResponsavelTemp(value);
        break;
      case 'Status':
        setStatusTemp(value);
        break;
      default:
        break;
    }
  };

  const handleSave = async () => {
    try {
      const updatedChamado = {
        ...chamado,
        Empresa: empresaTemp,
        Responsavel: responsavelTemp,
        Status: statusTemp
      };
      await chamadosService.update(updatedChamado);
      alert('Chamado atualizado com sucesso!');
      setChamado(updatedChamado);
      setIsChanged(false);
      // window.location.reload(); // Recarrega a página
    } catch (error) {
      console.error('Erro ao atualizar o chamado:', error);
      alert('Erro ao atualizar o chamado. Tente novamente.');
    }
  };

  const handleCancel = () => {
    // Restaura os dados temporários com os valores originais
    setEmpresaTemp(chamado.Empresa);
    setResponsavelTemp(chamado.Responsavel);
    setStatusTemp(chamado.Status);
    setIsChanged(false);
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>{error}</div>; // Exibe a mensagem de erro, se houver
  }

  if (!chamado) {
    return <div>Chamado não encontrado.</div>;
  }

  return (
    <div>
      <p>
        {chamado.IDchamado} - {chamado.Titulo}
      </p>
      <p>
        {usuario ? usuario.nome : 'Usuário não encontrado'} abriu em {chamado.DataCriacao}
      </p>
      <p>Descrição: {chamado.Descricao}</p>

      <div>
        <label>Empresa:</label>
        <Select
          showSearch
          placeholder="Selecione uma empresa"
          optionFilterProp="label"
          value={empresaTemp}
          onChange={(value) => handleSelectChange('Empresa', value)}
          options={empresas}
        />
      </div>

      <p>Usuario: {usuario ? usuario.nome : 'Usuário não encontrado'}</p>

      <div>
        <label>Responsável:</label>
        <Select
          showSearch
          placeholder="Selecione um responsável"
          optionFilterProp="label"
          value={responsavelTemp}
          onChange={(value) => handleSelectChange('Responsavel', value)}
          options={responsaveis}
        />
      </div>

      <div>
        <label>Status:</label>
        <Select
          placeholder="Selecione o status"
          value={statusTemp} // Alterado de chamado.Status para statusTemp
          onChange={(value) => handleSelectChange('Status', value)}
          options={[
            { value: 'Não iniciado', label: 'Não iniciado' },
            { value: 'Em andamento', label: 'Em andamento' },
            { value: 'Aguardando', label: 'Aguardando' },
            { value: 'Concluído', label: 'Concluído' }
          ]}
        />
      </div>

      {isChanged && (
        <div>
          <Button type="primary" onClick={handleSave}>
            Salvar
          </Button>
          <Button onClick={handleCancel}>Cancelar</Button>
        </div>
      )}

      <p>Equipamento: {chamado.QRcode}</p>
      <p>Lido: {chamado.Lido ? 'Sim' : 'Não'}</p>
      <p>Atualizado em: {chamado.DataAtualizacao}</p>
    </div>
  );
};

export default ChamadoDetalhes;
