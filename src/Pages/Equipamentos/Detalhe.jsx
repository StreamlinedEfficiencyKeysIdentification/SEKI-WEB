import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import equipamentosService from '../../service/equipamentosService';
import usuariosService from '../../service/usuariosService';
import empresasService from '../../service/empresasService';
import { Button, Input, Select, Switch } from 'antd';

const EquipamentoDetalhes = () => {
  const { id } = useParams(); // Pega os parâmetros da URL
  const [equipamento, setEquipamento] = useState(null);
  const [loading, setLoading] = useState(true); // Estado para controlar o carregamento
  const [error, setError] = useState(null);
  const [empresas, setEmpresas] = useState([]);
  const [setores, setSetores] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioByUid, setUsuarioByUid] = useState(null);
  const [isChanged, setIsChanged] = useState(false);

  const [marcaTemp, setMarcaTemp] = useState(null);
  const [modeloTemp, setModeloTemp] = useState(null);
  const [empresaTemp, setEmpresaTemp] = useState(null);
  const [setorTemp, setSetorTemp] = useState(null);
  const [usuarioTemp, setUsuarioTemp] = useState(null);
  const [statusTemp, setStatusTemp] = useState(null);

  const fetchUsuarioByUid = useCallback(async (uid) => {
    if (!uid) return;

    try {
      const usuarioByUidData = await usuariosService.getUsuarioByUid(uid);
      if (usuarioByUidData) {
        setUsuarioByUid(usuarioByUidData);
      } else {
        setUsuarioByUid([]);
      }
    } catch (error) {
      console.error('Erro ao buscar o usuário:', error);
      setUsuarioByUid([]);
    }
  }, []);

  const fetchSetores = useCallback(async (id) => {
    if (!id) return;

    try {
      const setoresData = await empresasService.getSetoresPorEmpresa(id);
      setSetores(setoresData.map((setor) => ({ value: setor.IDdoc, label: setor.Descricao })));
    } catch (error) {
      console.error('Erro ao buscar os setores:', error);
      setSetores([]);
    }
  }, []);

  useEffect(() => {
    const fetchEquipamento = async () => {
      try {
        // Busca a empresa pelo uidDoc e uidEmpresa
        const equipamentoData = await equipamentosService.getEquipamentoById(id);

        setEquipamento(equipamentoData); // Armazena os dados da empresa no estado
        setMarcaTemp(equipamentoData.marca);
        setModeloTemp(equipamentoData.modelo);
        setEmpresaTemp(equipamentoData.idEmpresa);
        setSetorTemp(equipamentoData.idSetor);
        setUsuarioTemp(equipamentoData.idUsuario);
        setStatusTemp(equipamentoData.status);
        setLoading(false); // Define o carregamento como concluído

        fetchUsuarioByUid(equipamentoData.quemCriou);
        fetchSetores(equipamentoData.idEmpresa);
      } catch (err) {
        setError(`Erro ao carregar os detalhes da empresa: ${err.message}`); // Define uma mensagem de erro
        setLoading(false); // Define o carregamento como concluído
      }
    };

    fetchEquipamento();
  }, [id, fetchUsuarioByUid, fetchSetores]);

  useEffect(() => {
    const fetchEmpresas = async () => {
      const empresasData = await empresasService.getEmpresasDisponiveis();
      setEmpresas(empresasData.map((empresa) => ({ value: empresa.IDempresa, label: empresa.RazaoSocial })));
    };

    const fetchUsuarios = async () => {
      const usuariosData = await usuariosService.getUsuariosPorNivel();
      setUsuarios(usuariosData.map((usuario) => ({ value: usuario.uid, label: usuario.Nome })));
    };

    fetchEmpresas();
    fetchUsuarios();
  }, []);

  const handleSelectChange = (field, value) => {
    setIsChanged(true);
    switch (field) {
      case 'Marca':
        setMarcaTemp(value);
        break;
      case 'Modelo':
        setModeloTemp(value);
        break;
      case 'IDempresa':
        setEmpresaTemp(value);
        break;
      case 'IDsetor':
        setSetorTemp(value);
        break;
      case 'IDusuario':
        setUsuarioTemp(value);
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
      const updatedEquipamento = {
        IDdoc: equipamento.id,
        Marca: marcaTemp,
        Modelo: modeloTemp,
        IDempresa: empresaTemp,
        IDsetor: setorTemp,
        IDusuario: usuarioTemp,
        Status: statusTemp ? 'Ativo' : 'Inativo'
      };

      await equipamentosService.update(updatedEquipamento);
      alert('Chamado atualizado com sucesso!');
      setIsChanged(false);
      // window.location.reload(); // Recarrega a página
    } catch (error) {
      console.error('Erro ao atualizar o chamado:', error);
      alert('Erro ao atualizar o chamado. Tente novamente.');
    }
  };

  const handleCancel = () => {
    // Restaura os dados temporários com os valores originais
    setMarcaTemp(equipamento.marca);
    setModeloTemp(equipamento.modelo);
    setEmpresaTemp(equipamento.idEmpresa);
    setSetorTemp(equipamento.idSetor);
    setUsuarioTemp(equipamento.idUsuario);
    setStatusTemp(equipamento.status);
    setIsChanged(false);
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>{error}</div>; // Exibe a mensagem de erro, se houver
  }

  if (!equipamento) {
    return <div>Equipamento não encontrado.</div>;
  }

  return (
    <div>
      <h2>Detalhes do Equipamento</h2>

      <div className="qrcode-container">
        <div className="info">
          <label>QRcode</label> {equipamento.idQrcode}
        </div>
        <div className="gerar-qrcode">
          Salvar QRcode?
          <i
            className="bi bi-qr-code"
            disabled={isChanged}
            style={{ color: isChanged ? 'gray' : 'black', cursor: isChanged ? 'not-allowed' : 'pointer' }}
          ></i>
        </div>
      </div>

      <div>
        <label>Marca:</label>
        <Input
          placeholder="Digite a Marca do equipamento"
          value={marcaTemp}
          onChange={(e) => handleSelectChange('Marca', e.target.value)}
        />
      </div>

      <div>
        <label>Modelo:</label>
        <Input
          placeholder="Digite o Modelo do equipamento"
          value={modeloTemp}
          onChange={(e) => handleSelectChange('Modelo', e.target.value)}
        />
      </div>

      <div>
        <label>Empresa:</label>
        <Select
          showSearch
          placeholder="Selecione uma empresa"
          optionFilterProp="label"
          value={empresaTemp}
          onChange={(value) => handleSelectChange('IDempresa', value)}
          options={empresas}
        />
      </div>

      <div>
        <label>Setor:</label>
        <Select
          showSearch
          placeholder="Selecione um setor"
          optionFilterProp="label"
          value={setorTemp}
          onChange={(value) => handleSelectChange('IDsetor', value)}
          options={setores}
        />
      </div>

      <div>
        <label>Usuario:</label>
        {equipamento.idUsuario ? null : <label> Não pertence a nenhum usuário. Deseja selecionar?</label>}
        <Select
          showSearch
          placeholder="Selecione um usuario"
          optionFilterProp="label"
          value={usuarioTemp}
          onChange={(value) => handleSelectChange('IDusuario', value)}
          options={usuarios}
        />
      </div>

      <p>Quem criou? {usuarioByUid ? usuarioByUid.nome : 'Usuário não encontrado'}</p>

      <div>
        <label>Status:</label>
        <Switch checked={statusTemp} onChange={(checked) => handleSelectChange('Status', checked)} />
      </div>

      {isChanged && (
        <div>
          <Button type="primary" onClick={handleSave}>
            Salvar
          </Button>
          <Button onClick={handleCancel}>Cancelar</Button>
        </div>
      )}
    </div>
  );
};

export default EquipamentoDetalhes;
