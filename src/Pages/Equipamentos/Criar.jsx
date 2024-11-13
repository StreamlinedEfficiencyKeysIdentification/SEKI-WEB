// Criar.jsx
import { useState, useEffect } from 'react';
import empresasService from '../../service/empresasService';
import usuariosService from '../../service/usuariosService';
import equipamentosService from '../../service/equipamentosService';
import { Alert, Button, Form, Input, message, Select, Spin } from 'antd';
import './criar.css';

function CriarEquipamento() {
  const [form] = Form.useForm();
  const [usuarios, setUsuarios] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [setores, setSetores] = useState([]);
  const [empresaSelecionada, setEmpresaSelecionada] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isChanged, setIsChanged] = useState(false);

  // Função para gerar o hash do QR code
  const handleGenerateQRCode = async (a) => {
    const hash = await equipamentosService.generateQRCodeHash(a);
    return hash; // Define o hash no campo qrcode
  };

  useEffect(() => {
    async function fetchUsuarios() {
      try {
        const usuarios = await usuariosService.getUsuariosPorNivel(); // Implementar esta função no back-end
        setUsuarios(usuarios.map((usuario) => ({ value: usuario.uid, label: usuario.Nome })));
      } catch (error) {
        setError(`Erro ao carregar os usuários ${error.message}`);
        console.error(error);
      }
    }

    fetchUsuarios();
  }, []);

  // Função para buscar empresas conforme o nível do usuário
  useEffect(() => {
    async function fetchEmpresas() {
      try {
        const empresas = await empresasService.getEmpresasDisponiveis(); // Implementar esta função no back-end
        setEmpresas(empresas.map((empresa) => ({ value: empresa.IDempresa, label: empresa.RazaoSocial })));
        setLoading(false);
      } catch (err) {
        setError(`Erro ao carregar as empresas: ${err.message}`);
        setLoading(false);
      }
    }

    fetchEmpresas();
  }, []);

  useEffect(() => {
    async function fetchSetor() {
      if (empresaSelecionada) {
        try {
          const setor = await empresasService.getSetoresPorEmpresa(empresaSelecionada); // Implementar esta função no back-end
          setSetores(setor.map((setor) => ({ value: setor.IDdoc, label: setor.Descricao })));
        } catch (error) {
          setError(`Erro ao carregar os setores ${error.message}`);
          console.error(error);
        }
      }
    }

    fetchSetor();
  }, [empresaSelecionada]);

  const handleSubmit = async (values) => {
    setIsChanged(false);
    try {
      const qrcode = await handleGenerateQRCode();

      try {
        const equipamento = {
          usuario: values.usuario ? values.usuario : '',
          qrcode: qrcode,
          empresaSelecionada: values.empresaSelecionada,
          setorSelecionado: values.setorSelecionado,
          marca: values.marca,
          modelo: values.modelo
        };
        // Chama o serviço para salvar o chamado
        await equipamentosService.save(equipamento); // Implementar esta função no back-end

        message.success('Equipamento criado com sucesso!');

        // Limpa os campos do formulário após o sucesso
        form.resetFields();
      } catch {
        message.error('Erro ao criar o equipamento. Tente novamente mais tarde.');
      }
    } catch {
      message.error('Erro ao gerar qrcode.');
    }
  };

  return (
    <div className="criar-equipamento-container">
      {error ? (
        <Alert message={error} type="error" showIcon />
      ) : (
        <div className="novo-equipamento-content">
          <h2>Criação</h2>

          <div className="linha"></div>

          <div className="content-form-equipamento">
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
                  label="Modelo"
                  name="marca"
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
                  label="Marca"
                  name="modelo"
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
                  label="Empresa"
                  name="empresaSelecionada"
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
                    options={empresas}
                    onChange={(value) => setEmpresaSelecionada(value)}
                  />
                </Form.Item>

                <Form.Item
                  label="Setor"
                  name="setorSelecionado"
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
                    options={setores}
                    disabled={!empresaSelecionada}
                  />
                </Form.Item>

                <Form.Item label="Usuário" name="usuario">
                  <Select showSearch placeholder="Selecione uma empresa" optionFilterProp="label" options={usuarios} />
                </Form.Item>

                <Form.Item>
                  <div className="botoes">
                    <Button type="primary" htmlType="submit" disabled={!isChanged}>
                      Criar
                    </Button>
                    <Button
                      onClick={() => {
                        form.resetFields();
                        setIsChanged(false);
                        setEmpresaSelecionada('');
                      }}
                      disabled={!isChanged}
                    >
                      Limpar
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

export default CriarEquipamento;
