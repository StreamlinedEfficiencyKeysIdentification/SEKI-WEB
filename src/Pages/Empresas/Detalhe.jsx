import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Select, Button, Input, Switch } from 'antd';
import empresasService from '../../service/empresasService';

const EmpresaDetalhes = () => {
  const { IDdoc } = useParams();
  const [empresa, setEmpresa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [empresasPai, setEmpresasPai] = useState([]);
  const [isChanged, setIsChanged] = useState(false);

  // Estados para os campos editáveis
  const [cnpj, setCnpj] = useState('');
  const [razaoSocial, setRazaoSocial] = useState('');
  const [empresaPai, setEmpresaPai] = useState(null);
  const [status, setStatus] = useState(false);

  const formatarCNPJ = (value) => {
    return value
      .replace(/\D/g, '') // Remove caracteres não numéricos
      .replace(/^(\d{2})(\d)/, '$1.$2') // Adiciona ponto após os 2 primeiros dígitos
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3') // Adiciona ponto após os 3 próximos dígitos
      .replace(/\.(\d{3})(\d)/, '.$1/$2') // Adiciona a barra
      .replace(/(\d{4})(\d)/, '$1-$2') // Adiciona o traço
      .substring(0, 18); // Limita o comprimento
  };

  const handleCnpjChange = (e) => {
    const value = e.target.value;
    const formattedCNPJ = formatarCNPJ(value); // Formata o valor do CNPJ
    setCnpj(formattedCNPJ); // Atualiza o estado com o CNPJ formatado
    setIsChanged(true);
  };

  useEffect(() => {
    const fetchEmpresa = async () => {
      try {
        const empresaData = await empresasService.findById(IDdoc);
        setEmpresa(empresaData);
        setCnpj(formatarCNPJ(empresaData.CNPJ));
        setRazaoSocial(empresaData.RazaoSocial);
        setEmpresaPai(empresaData.EmpresaPai);
        setStatus(empresaData.Status);
        setLoading(false);
      } catch (err) {
        setError(`Erro ao carregar os detalhes da empresa: ${err.message}`);
        setLoading(false);
      }
    };
    fetchEmpresa();
  }, [IDdoc]);

  // Busca a lista de empresas pai para o select
  useEffect(() => {
    const fetchEmpresasPai = async () => {
      const empresaPaiData = await empresasService.getEmpresasPai();
      setEmpresasPai(empresaPaiData.map((empresa) => ({ value: empresa.IDempresa, label: empresa.RazaoSocial })));
    };
    fetchEmpresasPai();
  }, []);

  const handleFieldChange = (field, value) => {
    setIsChanged(true);
    if (field === 'RazaoSocial') setRazaoSocial(value);
    if (field === 'EmpresaPai') setEmpresaPai(value);
    if (field === 'Status') setStatus(value);
  };

  const handleSave = async () => {
    if (!cnpj || !razaoSocial || !empresaPai) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }
    if (cnpj.length < 18) {
      alert('CNPJ inválido.');
      return;
    }
    try {
      const updatedEmpresa = {
        IDdoc: empresa.IDdoc,
        CNPJ: cnpj.replace(/\D/g, ''),
        RazaoSocial: razaoSocial,
        EmpresaPai: empresaPai,
        Status: status ? 'Ativo' : 'Inativo'
      };
      await empresasService.update(updatedEmpresa);
      alert('Empresa atualizada com sucesso!');
      setIsChanged(false);
    } catch (error) {
      console.error('Erro ao atualizar a empresa:', error);
      alert('Erro ao atualizar a empresa. Tente novamente.');
    }
  };

  const handleCancel = () => {
    setCnpj(formatarCNPJ(empresa.CNPJ));
    setRazaoSocial(empresa.RazaoSocial);
    setEmpresaPai(empresa.EmpresaPai);
    setStatus(empresa.Status);
    setIsChanged(false);
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!empresa) {
    return <div>Empresa não encontrada.</div>;
  }

  return (
    <div>
      <h2>Detalhes da Empresa</h2>
      <div className="input-group">
        <label>CNPJ *</label>
        <Input placeholder="Digite o CNPJ da sua empresa" value={cnpj} onChange={handleCnpjChange} />
      </div>
      <div>
        <label>Razão Social:</label>
        <Input
          placeholder="Digite o Nome da empresa"
          value={razaoSocial}
          onChange={(e) => handleFieldChange('RazaoSocial', e.target.value)}
        />
      </div>
      <div>
        <label>Empresa Pai:</label>
        <Select
          showSearch
          placeholder="Selecione uma empresa"
          optionFilterProp="label"
          value={empresaPai}
          onChange={(value) => handleFieldChange('EmpresaPai', value)}
          options={empresasPai}
        />
      </div>
      <div>
        <label>Status:</label>
        <Switch checked={status} onChange={(checked) => handleFieldChange('Status', checked)} />
      </div>

      {isChanged && (
        <div style={{ marginTop: '20px' }}>
          <Button type="primary" onClick={handleSave} style={{ marginRight: '10px' }}>
            Salvar
          </Button>
          <Button onClick={handleCancel}>Cancelar</Button>
        </div>
      )}
    </div>
  );
};

export default EmpresaDetalhes;
