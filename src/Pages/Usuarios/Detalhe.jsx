import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Select, Button, Switch, Input } from 'antd';
import usuariosService from '../../service/usuariosService';
import empresasService from '../../service/empresasService';

const UsuarioDetalhes = () => {
  const { uid } = useParams(); // Pega os parâmetros da URL
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [empresas, setEmpresas] = useState([]);
  const [niveis, setNiveis] = useState([]);
  const [isChanged, setIsChanged] = useState(false);
  const [usuarioByUid, setUsuarioByUid] = useState(null);

  const [nomeTemp, setNomeTemp] = useState(null);
  const [emailTemp, setEmailTemp] = useState(null);
  const [empresaTemp, setEmpresaTemp] = useState(null);
  const [nivelTemp, setNivelTemp] = useState(null);
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

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        // Busca a empresa pelo uidDoc e uidEmpresa
        const usuarioData = await usuariosService.getUsuarioByUid(uid);

        setUsuario(usuarioData); // Armazena os dados da empresa no estado
        setNomeTemp(usuarioData.nome);
        setEmailTemp(usuarioData.email);
        setEmpresaTemp(usuarioData.idEmpresa);
        setNivelTemp(usuarioData.idNivel);
        setStatusTemp(usuarioData.status);
        setLoading(false); // Define o carregamento como concluído

        fetchUsuarioByUid(usuarioData.quemCriou);
      } catch (err) {
        setError(`Erro ao carregar os detalhes da empresa: ${err.message}`); // Define uma mensagem de erro
        setLoading(false); // Define o carregamento como concluído
      }
    };

    fetchUsuario();
  }, [uid, fetchUsuarioByUid]);

  useEffect(() => {
    const fetchEmpresas = async () => {
      const empresasData = await empresasService.getEmpresasDisponiveis();
      setEmpresas(empresasData.map((empresa) => ({ value: empresa.IDempresa, label: empresa.RazaoSocial })));
    };

    const fetchNiveis = async () => {
      const niveisData = await usuariosService.getNivel();
      setNiveis(niveisData.map((nivel) => ({ value: nivel.IDdoc, label: nivel.Descricao })));
    };

    fetchEmpresas();
    fetchNiveis();
  }, []);

  const handleSelectChange = (field, value) => {
    setIsChanged(true);
    switch (field) {
      case 'nome':
        setNomeTemp(value);
        break;
      case 'email':
        setEmailTemp(value);
        break;
      case 'idEmpresa':
        setEmpresaTemp(value);
        break;
      case 'idNivel':
        setNivelTemp(value);
        break;
      case 'status':
        setStatusTemp(value);
        break;
      default:
        break;
    }
  };

  const handleSave = async () => {
    try {
      const updatedUsuario = {
        uid: usuario.uid,
        Nome: nomeTemp,
        Email: emailTemp,
        IDempresa: empresaTemp,
        IDnivel: nivelTemp,
        Status: statusTemp ? 'Ativo' : 'Inativo'
      };

      await usuariosService.update(updatedUsuario);
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
    setNomeTemp(usuario.nome);
    setEmailTemp(usuario.email);
    setEmpresaTemp(usuario.idEmpresa);
    setNivelTemp(usuario.idNivel);
    setStatusTemp(usuario.status);
    setIsChanged(false);
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>{error}</div>; // Exibe a mensagem de erro, se houver
  }

  if (!usuario) {
    return <div>Usuario não encontrado.</div>;
  }

  return (
    <div>
      <h2>Detalhes do Usuario</h2>
      <p>Usuario: {usuario.usuario}</p>

      <div>
        <label>Nome:</label>
        <Input
          placeholder="Digite o Nome do usuário"
          value={nomeTemp}
          onChange={(e) => handleSelectChange('nome', e.target.value)}
        />
      </div>

      <div>
        <label>E-mail:</label>
        <Input
          placeholder="Digite o E-mail do usuário"
          value={emailTemp}
          onChange={(e) => handleSelectChange('email', e.target.value)}
        />
      </div>

      <div>
        <label>Empresa:</label>
        <Select
          showSearch
          placeholder="Selecione uma empresa"
          optionFilterProp="label"
          value={empresaTemp}
          onChange={(value) => handleSelectChange('idEmpresa', value)}
          options={empresas}
        />
      </div>

      <div>
        <label>Nivel:</label>
        <Select
          showSearch
          placeholder="Selecione um nivel"
          optionFilterProp="label"
          value={nivelTemp == '2' ? 'Master' : nivelTemp}
          onChange={(value) => handleSelectChange('idNivel', value)}
          options={niveis}
        />
      </div>

      <div>
        <label>Status:</label>
        <Switch checked={statusTemp} onChange={(checked) => handleSelectChange('status', checked)} />
      </div>

      {isChanged && (
        <div>
          <Button type="primary" onClick={handleSave}>
            Salvar
          </Button>
          <Button onClick={handleCancel}>Cancelar</Button>
        </div>
      )}

      <p>Criado em: {usuario.dataCriacao}</p>
      <p>Atualizado em: {usuario.dataAcesso}</p>
      <p>Primeiro acesso? {usuario.primeiroAcesso ? 'Sim' : 'Não'}</p>
      <p>Quem criou? {usuarioByUid ? usuarioByUid.nome : 'Usuário não encontrado'}</p>
    </div>
  );
};

export default UsuarioDetalhes;
