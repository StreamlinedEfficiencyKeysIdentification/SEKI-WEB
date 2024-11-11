// Criar.jsx
import { useState, useEffect } from 'react';
import chamadosService from '../../service/chamadosService';
import empresasService from '../../service/empresasService';
import usuariosService from '../../service/usuariosService';
import './criar.css';
import { Alert, Button, Form, Input, message, Select, Spin } from 'antd';
import TextArea from 'antd/es/input/TextArea';

function CriarChamado() {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [empresas, setEmpresas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [empresaSelecionada, setEmpresaSelecionada] = useState('');
  const [usuarioSelecionado, setUsuarioSelecionado] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [empresaTemp, setEmpresaTemp] = useState(null);
  const [usuarioTemp, setUsuarioTemp] = useState(null);

  // Função para buscar empresas conforme o nível do usuário
  useEffect(() => {
    async function fetchEmpresas() {
      try {
        const empresas = await empresasService.getEmpresasDisponiveis(); // Implementar esta função no back-end
        setEmpresas(empresas.map((empresa) => ({ value: empresa.IDempresa, label: empresa.RazaoSocial })));
        setLoading(false);
      } catch (error) {
        setError(`Erro ao carregar os detalhes do chamado: ${error.message}`);
        console.error(error);
        setLoading(false);
      }
    }
    fetchEmpresas();
  }, []);

  // Função para buscar usuários da empresa selecionada
  useEffect(() => {
    async function fetchUsuarios() {
      if (empresaSelecionada) {
        try {
          const usuarios = await usuariosService.getUsuariosPorEmpresa(empresaSelecionada); // Implementar no back-end
          setUsuarios(usuarios.map((usuario) => ({ value: usuario.uid, label: usuario.Nome })));
        } catch (error) {
          setError(`Erro ao carregar os detalhes do chamado: ${error.message}`);
          console.error(error);
        }
      }
    }
    fetchUsuarios();
  }, [empresaSelecionada]);

  const handleSubmit = async (values) => {
    try {
      // Chama o serviço para salvar o chamado
      await chamadosService.save(values.titulo, values.descricao, empresaSelecionada, usuarioSelecionado);

      message.success('Chamado criado com sucesso!');

      // Limpa os campos do formulário após o sucesso
      onReset();
    } catch (error) {
      console.error(error);
      message.error('Erro ao criar o chamado!');
    }
  };

  const handleSelectChange = (field, value) => {
    switch (field) {
      case 'Empresa':
        setEmpresaTemp(value);
        setEmpresaSelecionada(value);
        break;
      case 'Usuario':
        setUsuarioTemp(value);
        setUsuarioSelecionado(value);
        break;
      case 'Titulo':
        setTitulo(value);
        break;
      case 'Descricao':
        setDescricao(value);
        break;
      default:
        break;
    }
  };

  const [form] = Form.useForm();
  const onReset = () => {
    form.resetFields();
    setEmpresaSelecionada('');
    setUsuarioSelecionado('');
  };

  return (
    <div className="criar-chamado-container">
      {error ? (
        <Alert message={error} type="error" showIcon />
      ) : (
        <div className="novo-chamado-content">
          <h2>Criar Novo Chamado</h2>

          <div className="linha"></div>

          <div className="content-form-chamado">
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
              >
                <Form.Item
                  label="Título"
                  name="titulo"
                  rules={[
                    {
                      required: true,
                      message: 'Por favor, insira um titulo!'
                    }
                  ]}
                >
                  <Input type="text" value={titulo} onChange={(value) => handleSelectChange('Titulo', value)}></Input>
                </Form.Item>

                <Form.Item
                  label="Descrição"
                  name="descricao"
                  rules={[
                    {
                      required: true,
                      message: 'Por favor, insira uma descrição!'
                    }
                  ]}
                >
                  <TextArea value={descricao} onChange={(value) => handleSelectChange('Descricao', value)} />
                </Form.Item>

                <Form.Item
                  label="Empresa"
                  name="empresa"
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
                    value={empresaTemp}
                    onChange={(value) => handleSelectChange('Empresa', value)}
                    options={empresas}
                  />
                </Form.Item>

                <Form.Item
                  label="Usuário"
                  name="usuario"
                  rules={[
                    {
                      required: true,
                      message: 'Por favor, selecione um usuario!'
                    }
                  ]}
                >
                  <Select
                    showSearch
                    placeholder="Selecione um usuário"
                    optionFilterProp="label"
                    value={usuarioTemp}
                    onChange={(value) => handleSelectChange('Usuario', value)}
                    options={usuarios}
                    disabled={!empresaSelecionada}
                  />
                </Form.Item>
                <Form.Item>
                  <div className="botoes">
                    <Button type="primary" htmlType="submit">
                      Criar
                    </Button>
                    <Button onClick={onReset}>Limpar</Button>
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

export default CriarChamado;
