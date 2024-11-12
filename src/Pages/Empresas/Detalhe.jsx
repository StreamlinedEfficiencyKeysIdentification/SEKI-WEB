import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Select, Button, Input, Switch, Spin, Alert, Form, message } from 'antd';
import empresasService from '../../service/empresasService';
import './detalhe.css';

const EmpresaDetalhes = () => {
  const { IDdoc } = useParams();
  const [form] = Form.useForm();
  const [empresa, setEmpresa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [empresasPai, setEmpresasPai] = useState([]);
  const [isChanged, setIsChanged] = useState(false);

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
    const formattedCNPJ = formatarCNPJ(value);
    form.setFieldsValue({ cnpj: formattedCNPJ }); // Atualiza o valor formatado no formulário
  };

  useEffect(() => {
    const fetchEmpresa = async () => {
      try {
        const empresaData = await empresasService.findById(IDdoc);
        setEmpresa(empresaData);

        // Define os valores iniciais no formulário
        form.setFieldsValue({
          cnpj: formatarCNPJ(empresaData.CNPJ),
          razaoSocial: empresaData.RazaoSocial,
          empresaPai: empresaData.EmpresaPai,
          status: empresaData.Status
        });

        setLoading(false);
      } catch (err) {
        setError(`Erro ao carregar os detalhes da empresa: ${err.message}`);
        setLoading(false);
      }
    };
    fetchEmpresa();
  }, [IDdoc, form]);

  // Busca a lista de empresas pai para o select
  useEffect(() => {
    const fetchEmpresasPai = async () => {
      const empresaPaiData = await empresasService.getEmpresasPai();
      setEmpresasPai(empresaPaiData.map((empresa) => ({ value: empresa.IDempresa, label: empresa.RazaoSocial })));
    };
    fetchEmpresasPai();
  }, []);

  const handleSave = async (values) => {
    if (!values.cnpj || !values.razaoSocial || !values.empresaPai) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }
    if (values.cnpj.length < 18) {
      alert('CNPJ inválido.');
      return;
    }
    try {
      setIsChanged(false);
      const updatedEmpresa = {
        IDdoc: empresa.IDdoc,
        CNPJ: values.cnpj.replace(/\D/g, ''),
        RazaoSocial: values.razaoSocial,
        EmpresaPai: values.empresaPai,
        Status: values.status ? 'Ativo' : 'Inativo'
      };

      await empresasService.update(updatedEmpresa);

      message.success('Empresa atualizada com sucesso!');
    } catch {
      message.error('Erro ao atualizar empresa!');
    }
  };

  const onReset = () => {
    form.setFieldsValue({
      cnpj: formatarCNPJ(empresa.CNPJ),
      razaoSocial: empresa.RazaoSocial,
      empresaPai: empresa.EmpresaPai,
      status: empresa.Status
    });
    setIsChanged(false);
  };

  return (
    <div className="detalhe-empresa-container">
      {error ? (
        <Alert message={error} type="error" showIcon />
      ) : (
        <div className="detalhe-empresa-content">
          <h2>Empresa</h2>

          <div className="linha"></div>

          <div className="content-form-empresa">
            <Spin spinning={loading} tip="Carregando dados..." size="large">
              <Form
                form={form}
                name="control-hooks"
                layout="vertical"
                style={{
                  maxWidth: 1000
                }}
                initialValues={{
                  remember: true
                }}
                onFinish={handleSave}
                autoComplete="off"
                onValuesChange={() => setIsChanged(true)}
              >
                <Form.Item
                  label="CNPJ"
                  name="cnpj"
                  rules={[
                    {
                      required: true,
                      message: 'Por favor, insira um CNPJ!'
                    }
                  ]}
                >
                  <Input placeholder="Digite o CNPJ da sua empresa" onChange={handleCnpjChange} />
                </Form.Item>

                <Form.Item
                  label="Razão Social"
                  name="razaoSocial"
                  rules={[
                    {
                      required: true,
                      message: 'Por favor, insira uma Razão Social!'
                    }
                  ]}
                >
                  <Input placeholder="Digite a Razão Social da empresa" />
                </Form.Item>

                <Form.Item
                  label="Matriz"
                  name="empresaPai"
                  rules={[
                    {
                      required: true,
                      message: 'Por favor, selecione uma empresa!'
                    }
                  ]}
                >
                  <Select
                    showSearch
                    placeholder="Selecione uma empresa"
                    optionFilterProp="label"
                    options={empresasPai}
                  />
                </Form.Item>

                <Form.Item
                  label="Status"
                  name="status"
                  rules={[
                    {
                      required: true,
                      message: 'Por favor, selecione um usuario!'
                    }
                  ]}
                >
                  <Switch />
                </Form.Item>

                <Form.Item>
                  <div className="botoes">
                    <Button type="primary" htmlType="submit" disabled={!isChanged}>
                      Salvar
                    </Button>
                    <Button onClick={onReset} disabled={!isChanged}>
                      Cancelar
                    </Button>
                  </div>
                </Form.Item>
              </Form>
            </Spin>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmpresaDetalhes;
