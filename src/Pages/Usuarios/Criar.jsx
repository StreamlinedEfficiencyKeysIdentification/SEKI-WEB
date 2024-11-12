// Criar.jsx
import { useState, useEffect } from 'react';
import empresasService from '../../service/empresasService';
import usuariosService from '../../service/usuariosService';
import { Alert, Button, Form, Input, message, Select, Spin } from 'antd';
import './criar.css';

function CriarUsuario() {
  const [form] = Form.useForm();
  const [empresas, setEmpresas] = useState([]);
  const [nivel, setNivel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isChanged, setIsChanged] = useState(false);

  // Função para buscar empresas conforme o nível do usuário
  useEffect(() => {
    async function fetchEmpresas() {
      try {
        const empresas = await empresasService.getEmpresasDisponiveis(); // Implementar esta função no back-end
        setEmpresas(empresas.map((empresa) => ({ value: empresa.IDempresa, label: empresa.RazaoSocial })));

        setLoading(false);
      } catch (err) {
        setError(`Erro ao carregar os detalhes da empresa: ${err.message}`);
        setLoading(false);
      }
    }
    fetchEmpresas();
  }, []);

  useEffect(() => {
    async function fetchNivel() {
      const nivel = await usuariosService.getNivel(); // Implementar esta função no back-end
      setNivel(nivel.map((nivel) => ({ value: nivel.IDdoc, label: nivel.Descricao })));
    }
    fetchNivel();
  }, []);

  const handleSubmit = async (values) => {
    try {
      setIsChanged(false);

      // Chama o serviço para salvar o chamado
      await usuariosService.save(
        values.usuario,
        values.email,
        values.nome,
        values.empresaSelecionada,
        values.nivelSelecionado
      );

      message.success('Usuario criado com sucesso!');

      // Limpa os campos do formulário após o sucesso
      form.resetFields();
    } catch {
      message.error('Erro ao criar o Usuario. Tente novamente mais tarde.');
    }
  };

  return (
    <div className="criar-usuario-container">
      {error ? (
        <Alert message={error} type="error" showIcon />
      ) : (
        <div className="novo-usuario-content">
          <h2>Criação</h2>

          <div className="linha"></div>

          <div className="content-form-usuario">
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
                  label="Usuário"
                  name="usuario"
                  rules={[
                    {
                      required: true,
                      message: 'Por favor, insira um Usuário!'
                    }
                  ]}
                >
                  <Input placeholder="Digite um apelido para o Usuário" />
                </Form.Item>

                <Form.Item
                  label="E-mail"
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: 'Por favor, insira um E-mail válido!',
                      type: 'email'
                    }
                  ]}
                >
                  <Input placeholder="Digite o E-mail do usuário" />
                </Form.Item>

                <Form.Item
                  label="Nome"
                  name="nome"
                  rules={[
                    {
                      required: true,
                      message: 'Por favor, insira um Nome!'
                    }
                  ]}
                >
                  <Input placeholder="Digite o Nome do usuário" />
                </Form.Item>

                <Form.Item
                  label="Empresa"
                  name="empresaSelecionada"
                  rules={[
                    {
                      required: true,
                      message: 'Por favor, selecione uma empresa!'
                    }
                  ]}
                >
                  <Select showSearch placeholder="Selecione uma empresa" optionFilterProp="label" options={empresas} />
                </Form.Item>

                <Form.Item
                  label="Nível de acesso"
                  name="nivelSelecionado"
                  rules={[
                    {
                      required: true,
                      message: 'Por favor, selecione um Nível de acesso!'
                    }
                  ]}
                >
                  <Select
                    showSearch
                    placeholder="Selecione um nível de acesso"
                    optionFilterProp="label"
                    options={nivel}
                  />
                </Form.Item>

                <Form.Item>
                  <div className="botoes">
                    <Button type="primary" htmlType="submit" disabled={!isChanged}>
                      Salvar
                    </Button>
                    <Button
                      onClick={() => {
                        form.resetFields();
                        setIsChanged(false);
                      }}
                      disabled={!isChanged}
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

export default CriarUsuario;
