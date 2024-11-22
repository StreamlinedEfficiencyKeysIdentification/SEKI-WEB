import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Select, Button, Switch, Input, Spin, Alert, Form, message } from 'antd';
import usuariosService from '../../service/usuariosService';
import empresasService from '../../service/empresasService';
import './detalhe.css';

const UsuarioDetalhes = () => {
  const { uid } = useParams(); // Pega os parâmetros da URL
  const [form] = Form.useForm();
  const [usuario, setUsuario] = useState(null);
  const [empresas, setEmpresas] = useState([]);
  const [niveis, setNiveis] = useState([]);
  const [usuarioByUid, setUsuarioByUid] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isChanged, setIsChanged] = useState(false);
  const [savingUsuario, setSavingUsuario] = useState(false);

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

        // Define os valores iniciais no formulário
        form.setFieldsValue({
          nome: usuarioData.nome,
          email: usuarioData.email,
          empresa: usuarioData.idEmpresa,
          nivel: usuarioData.idNivel == 2 ? 'Master' : usuarioData.idNivel,
          status: usuarioData.status
        });

        fetchUsuarioByUid(usuarioData.quemCriou);
        setLoading(false); // Define o carregamento como concluído
      } catch (err) {
        setError(`Erro ao carregar os detalhes da empresa: ${err.message}`); // Define uma mensagem de erro
        setLoading(false); // Define o carregamento como concluído
      }
    };

    fetchUsuario();
  }, [uid, fetchUsuarioByUid, form]);

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

  const handleSave = async (values) => {
    setSavingUsuario(true);

    try {
      const updatedUsuario = {
        uid: usuario.uid,
        Nome: values.nome,
        Email: values.email,
        IDempresa: values.empresa,
        IDnivel: values.nivel,
        Status: values.status ? 'Ativo' : 'Inativo'
      };

      await usuariosService.update(updatedUsuario);
      message.success('Chamado atualizado com sucesso!');
      setIsChanged(false);
      setSavingUsuario(false);
    } catch {
      setSavingUsuario(false);
      message.error('Erro ao atualizar o chamado. Tente novamente.');
    }
  };

  const onReset = () => {
    form.setFieldsValue({
      nome: usuario.nome,
      email: usuario.email,
      empresa: usuario.idEmpresa,
      nivel: usuario.idNivel,
      status: usuario.status
    });
    setIsChanged(false);
  };

  return (
    <div className="detalhe-usuario-container">
      {loading ? (
        <div className="spin-container">
          <Spin tip="Carregando detalhes do chamado..." size="large">
            <div style={{ height: 'auto', width: '200px', background: 'transparent', fontSize: '2rem' }}></div>
          </Spin>
        </div>
      ) : error ? (
        <Alert message={error} type="error" showIcon />
      ) : (
        <div className="dc-content">
          <div className="coluna1">
            <div className="usuario">
              <div className="titulo">
                <label>{usuario.usuario}</label>
              </div>
              <div className="linha"></div>
              <div className="info-data">
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
                      options={empresas}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Nível de acesso"
                    name="nivel"
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
                      options={niveis}
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

                  <div className="botoes">
                    <Button type="primary" htmlType="submit" disabled={!isChanged || savingUsuario}>
                      Salvar
                    </Button>
                    <Button onClick={onReset} disabled={!isChanged || savingUsuario}>
                      Cancelar
                    </Button>
                  </div>
                </Form>
              </div>
            </div>
          </div>

          <div className="coluna2">
            <div className="detalhe">
              <div className="title">
                <label>Informações</label>
              </div>
              <div className="linha"></div>
              <div className="info">
                <label>Criado por</label> {usuarioByUid ? usuarioByUid.nome : 'Usuário não encontrado'}
              </div>
              <div className="info">
                <label>Criado em</label> {usuario.dataCriacao}
              </div>
              <div className="info">
                <label>Ultimo acesso em</label> {usuario.dataAcesso}
              </div>
              <div className="info">
                <label>Primeiro Acesso?</label> {usuario.primeiroAcesso ? 'Sim' : 'Não'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsuarioDetalhes;
