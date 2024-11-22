// Criar.jsx
import { useState, useEffect } from 'react';
import empresasService from '../../service/empresasService';
import './criar.css';
import { Alert, Button, Form, Input, message, Select, Spin } from 'antd';

function CriarEmpresa() {
  const [form] = Form.useForm();
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isChanged, setIsChanged] = useState(false);
  const [savingEmpresa, setSavingEmpresa] = useState(false);

  // Função para buscar empresas conforme o nível do usuário
  useEffect(() => {
    async function fetchEmpresas() {
      try {
        const empresas = await empresasService.getEmpresasPai(); // Implementar esta função no back-end
        setEmpresas(empresas.map((empresa) => ({ value: empresa.IDempresa, label: empresa.RazaoSocial })));

        setLoading(false);
      } catch (err) {
        setError(`Erro ao carregar as empresas: ${err.message}`);
        setLoading(false);
      }
    }
    fetchEmpresas();
  }, []);

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

  const handleSubmit = async (values) => {
    if (!values.cnpj || !values.razaoSocial || !values.empresaPai) {
      message.error('Preencha todos os campos obrigatórios.');
      return;
    }
    if (values.cnpj.length < 18) {
      message.error('CNPJ inválido.');
      return;
    }

    setSavingEmpresa(true);

    try {
      setIsChanged(false);

      // Chama o serviço para salvar o chamado
      await empresasService.save(values.cnpj.replace(/\D/g, ''), values.razaoSocial, values.empresaPai);

      message.success('Empresa criada com sucesso!');

      // Limpa os campos do formulário após o sucesso
      form.resetFields();
      setSavingEmpresa(false);
    } catch {
      setSavingEmpresa(false);
      message.error('Erro ao criar empresa!');
    }
  };

  return (
    <div className="criar-empresa-container">
      {error ? (
        <Alert message={error} type="error" showIcon />
      ) : (
        <div className="novo-empresa-content">
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
                onFinish={handleSubmit}
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
                  <Select showSearch placeholder="Selecione uma empresa" optionFilterProp="label" options={empresas} />
                </Form.Item>

                <Form.Item>
                  <div className="botoes">
                    <Button type="primary" htmlType="submit" disabled={!isChanged || savingEmpresa}>
                      Salvar
                    </Button>
                    <Button
                      onClick={() => {
                        form.resetFields();
                        setIsChanged(false);
                      }}
                      disabled={!isChanged || savingEmpresa}
                    >
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
}

export default CriarEmpresa;
