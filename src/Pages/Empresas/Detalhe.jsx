import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Select, Button, Input, Switch, Spin, Alert, Form, message, Modal, List } from 'antd';
import empresasService from '../../service/empresasService';
import './detalhe.css';

const EmpresaDetalhes = () => {
  const { IDdoc } = useParams();
  const [form] = Form.useForm();
  const [empresa, setEmpresa] = useState(null);
  const [setores, setSetores] = useState([]);
  const [originalSetores, setOriginalSetores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [empresasPai, setEmpresasPai] = useState([]);
  const [isChanged, setIsChanged] = useState(false);
  const [isModalChanged, setIsModalChanged] = useState(false);
  const [isMatriz, setIsMatriz] = useState(false);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [newSetor, setNewSetor] = useState('');
  const [editingSetorId, setEditingSetorId] = useState(null);
  const [savingEmpresa, setSavingEmpresa] = useState(false);

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

        if (empresaData.EmpresaPai === IDdoc) {
          setIsMatriz(true);
        }

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

    setSavingEmpresa(true);

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
      setSavingEmpresa(false);
    } catch {
      setSavingEmpresa(false);
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

  const showLoading = async () => {
    setOpen(true);
    setIsLoading(true);

    try {
      const setoresData = await empresasService.getSetoresPorEmpresa(IDdoc);
      setSetores(setoresData);
      setOriginalSetores(setoresData);

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      message.error('Erro ao carregar setores', error);
      setOpen(false);
    }
  };

  const handleAddSetor = () => {
    if (newSetor.trim() === '') {
      message.warning('Por favor, insira uma descrição para o setor.');
      return;
    }
    const newSetorObj = {
      IDdoc: `temp-${Date.now()}`, // ID temporário
      Descricao: newSetor,
      IDempresa: IDdoc
    };
    setSetores([...setores, newSetorObj]);
    setNewSetor('');
    setIsModalChanged(true);
  };

  const handleEditSetor = (id) => {
    setEditingSetorId(id);
  };

  const handleSaveEdit = (id, newDescricao) => {
    setSetores(setores.map((setor) => (setor.IDdoc === id ? { ...setor, Descricao: newDescricao } : setor)));
    setEditingSetorId(null);
    setIsModalChanged(true);
  };

  const handleDeleteSetor = (id) => {
    setSetores(setores.filter((setor) => setor.IDdoc !== id));
    setIsModalChanged(true);
  };

  const handleOk = async () => {
    if (!isModalChanged) {
      setOpen(false);
      setEditingSetorId(null);
      return;
    }

    try {
      setConfirmLoading(true);

      // Classificar setores em novas adições, edições e exclusões
      const setoresNovos = setores.filter((setor) => !originalSetores.some((orig) => orig.IDdoc === setor.IDdoc));
      const setoresEditados = setores.filter((setor) => {
        const setorOriginal = originalSetores.find((orig) => orig.IDdoc === setor.IDdoc);
        return setorOriginal && setorOriginal.Descricao !== setor.Descricao;
      });
      const setoresRemovidos = originalSetores.filter((orig) => !setores.some((setor) => setor.IDdoc === orig.IDdoc));

      // Preparar o payload para o back-end
      const payload = {
        IDempresa: IDdoc,
        novosSetores: setoresNovos,
        setoresEditados: setoresEditados,
        setoresRemovidos: setoresRemovidos.map((setor) => setor.IDdoc)
      };

      await empresasService.saveSetores(payload);
      setOriginalSetores([...setores]);
      setIsModalChanged(false);
      message.success('Setores salvos com sucesso!');
    } catch {
      message.error('Erro ao salvar setores.');
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleModalCancel = () => {
    if (isModalChanged) {
      Modal.confirm({
        title: 'Descartar mudanças?',
        content: 'Você tem mudanças não salvas. Tem certeza de que deseja sair sem salvar?',
        onOk: () => {
          setOpen(false);
          setIsModalChanged(false);
          setEditingSetorId(null);
        }
      });
    } else {
      setOpen(false);
      setEditingSetorId(null);
    }
  };

  return (
    <div className="detalhe-empresa-container">
      {error ? (
        <Alert message={error} type="error" showIcon />
      ) : (
        <div className="detalhe-empresa-content">
          <h2>Empresa</h2>
          {isMatriz && (
            <div className="setor">
              <Button disabled={isChanged} className="button-setor" type="primary" onClick={showLoading}>
                Setores
              </Button>
            </div>
          )}

          <Modal
            title="Setores"
            open={open}
            onOk={() => {
              if (setores.some((setor) => setor.Descricao.trim() === '')) {
                message.error('Todos os campos devem estar preenchidos.');
              } else {
                handleOk();
              }
            }}
            onCancel={handleModalCancel}
            confirmLoading={confirmLoading}
            loading={isLoading}
            destroyOnClose
          >
            {setores.length === 0 ? (
              <>
                <Alert message="Nenhum setor encontrado. Adicione um novo setor." type="info" showIcon />
                <div className="add-setor">
                  <Input
                    placeholder="Adicionar novo setor"
                    value={newSetor}
                    onChange={(e) => setNewSetor(e.target.value)}
                    onPressEnter={handleAddSetor}
                  />
                  <Button onClick={handleAddSetor} type="primary">
                    Adicionar
                  </Button>
                </div>
              </>
            ) : (
              <>
                <List
                  dataSource={setores}
                  renderItem={(setor) => (
                    <List.Item
                      actions={[
                        <Button onClick={() => handleEditSetor(setor.IDdoc)} key="edit">
                          Editar
                        </Button>,
                        <Button onClick={() => handleDeleteSetor(setor.IDdoc)} danger key="delete">
                          Excluir
                        </Button>
                      ]}
                    >
                      {editingSetorId === setor.IDdoc ? (
                        <Input
                          defaultValue={setor.Descricao}
                          onBlur={(e) => {
                            if (e.target.value.trim() === '') {
                              message.error('Preencha o campo de descrição');
                            } else {
                              handleSaveEdit(setor.IDdoc, e.target.value);
                            }
                          }}
                        />
                      ) : (
                        <span>{setor.Descricao}</span>
                      )}
                    </List.Item>
                  )}
                />
                <div className="add-setor">
                  <Input
                    placeholder="Adicionar novo setor"
                    value={newSetor}
                    onChange={(e) => setNewSetor(e.target.value)}
                    onPressEnter={handleAddSetor}
                  />
                  <Button onClick={handleAddSetor} type="primary">
                    Adicionar
                  </Button>
                </div>
              </>
            )}
          </Modal>

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
                    <Button type="primary" htmlType="submit" disabled={!isChanged || savingEmpresa}>
                      Salvar
                    </Button>
                    <Button onClick={onReset} disabled={!isChanged || savingEmpresa}>
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
