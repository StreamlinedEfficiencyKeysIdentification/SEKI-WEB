import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import equipamentosService from '../../service/equipamentosService';
import usuariosService from '../../service/usuariosService';
import empresasService from '../../service/empresasService';
import { Alert, Button, Form, Input, message, Select, Spin, Switch } from 'antd';
import './detalhe.css';
import html2canvas from 'html2canvas';
import { QRCodeCanvas } from 'qrcode.react';

const EquipamentoDetalhes = () => {
  const { id } = useParams(); // Pega os parâmetros da URL
  const [form] = Form.useForm();
  const [equipamento, setEquipamento] = useState(null);
  const [loading, setLoading] = useState(true); // Estado para controlar o carregamento
  const [error, setError] = useState(null);
  const [empresas, setEmpresas] = useState([]);
  const [setores, setSetores] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioByUid, setUsuarioByUid] = useState(null);
  const [isChanged, setIsChanged] = useState(false);
  const [nomeEmpresa, setNomeEmpresa] = useState('');
  const [dataFetched, setDataFetched] = useState(false);

  useEffect(() => {
    if (dataFetched) return;

    const fetchEquipamento = async () => {
      try {
        const equipamentoData = await equipamentosService.getEquipamentoById(id);
        setEquipamento(equipamentoData); // Armazena os dados do equipamento no estado

        const usuarioByUidData = await fetchUsuarioByUid(equipamentoData.quemCriou);
        setUsuarioByUid(usuarioByUidData);

        const setoresData = await fetchSetores(equipamentoData.idEmpresa);
        setSetores(setoresData);

        // Depois de carregar todos os dados, marca como "dataFetched"
        setDataFetched(true);
        setLoading(false); // Define o carregamento como concluído
      } catch (error) {
        setError(`Erro ao carregar os detalhes do equipamento: ${error.message}`); // Define uma mensagem de erro
        setLoading(false); // Define o carregamento como concluído
      }
    };

    const fetchEmpresas = async () => {
      try {
        const empresasData = await empresasService.getEmpresasDisponiveis();
        setEmpresas(
          empresasData.map((empresa) => ({
            value: empresa.IDempresa,
            label: empresa.RazaoSocial
          }))
        );

        if (equipamento) {
          // Após buscar as empresas, encontre a empresa correspondente
          const empresaCorrespondente = empresasData.find((empresa) => empresa.IDempresa === equipamento.idEmpresa);
          setNomeEmpresa(empresaCorrespondente ? empresaCorrespondente.RazaoSocial : 'Empresa não encontrada');

          form.setFieldsValue({
            marca: equipamento.marca,
            modelo: equipamento.modelo,
            empresaSelecionada: equipamento.idEmpresa,
            setorSelecionado: equipamento.idSetor,
            usuario: equipamento.idUsuario,
            status: equipamento.status
          });
        }
      } catch (error) {
        setError(`Erro ao buscar as empresas: ${error.message}`);
        setLoading(false);
      }
    };

    const fetchUsuarios = async () => {
      try {
        const usuariosData = await usuariosService.getUsuariosPorNivel();
        setUsuarios(
          usuariosData.map((usuario) => ({
            value: usuario.uid,
            label: usuario.Nome
          }))
        );
      } catch (error) {
        setError(`Erro ao buscar os usuarios: ${error.message}`);
        setLoading(false);
      }
    };

    const fetchUsuarioByUid = async (uid) => {
      try {
        const usuarioByUidData = await usuariosService.getUsuarioByUid(uid);
        return usuarioByUidData;
      } catch (error) {
        console.error('Erro ao buscar o usuário:', error);
      }
    };

    const fetchSetores = async (idEmpresa) => {
      try {
        const setoresData = await empresasService.getSetoresPorEmpresa(idEmpresa);
        return setoresData.map((setor) => ({ value: setor.IDdoc, label: setor.Descricao }));
      } catch (error) {
        console.error('Erro ao buscar os setores:', error);
      }
    };

    // Chama as funções de busca de dados
    fetchEquipamento();
    fetchEmpresas();
    fetchUsuarios();
  }, [form, id, equipamento, dataFetched]);

  const handleSave = async (values) => {
    try {
      const updatedEquipamento = {
        IDdoc: equipamento.id,
        Marca: values.marca,
        Modelo: values.modelo,
        IDempresa: values.empresaSelecionada,
        IDsetor: values.setorSelecionado,
        IDusuario: values.usuario,
        Status: values.status ? 'Ativo' : 'Inativo'
      };

      await equipamentosService.update(updatedEquipamento);
      message.success('Equipamento atualizado com sucesso!');
      setIsChanged(false);
      // window.location.reload(); // Recarrega a página
    } catch {
      message.error('Erro ao atualizar o Equipamento. Tente novamente mais tarde.');
    }
  };

  const onReset = () => {
    form.setFieldsValue({
      marca: equipamento.marca,
      modelo: equipamento.modelo,
      empresaSelecionada: equipamento.idEmpresa,
      setorSelecionado: equipamento.idSetor,
      usuario: equipamento.idUsuario,
      status: equipamento.status
    });
    setIsChanged(false);
  };

  const handleSalvarImagem = async () => {
    const container = document.getElementById('qrcode-container');
    if (container) {
      try {
        const canvas = await html2canvas(container);
        const dataUrl = canvas.toDataURL('image/png');

        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `qrcode_${equipamento.idQrcode}.png`;
        link.click();
      } catch (error) {
        console.error('Erro ao salvar a imagem:', error);
      }
    }
  };

  return (
    <div className="detalhe-equipamento-container">
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
            <div className="equipamento">
              <div className="titulo">
                <label>Equipamento</label>
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
                    label="Marca"
                    name="marca"
                    rules={[
                      {
                        required: true,
                        message: 'Por favor, insira uma marca!'
                      }
                    ]}
                  >
                    <Input placeholder="Digite a marca do equipamento" />
                  </Form.Item>

                  <Form.Item
                    label="Modelo"
                    name="modelo"
                    rules={[
                      {
                        required: true,
                        message: 'Por favor, insira um Modelo!'
                      }
                    ]}
                  >
                    <Input placeholder="Digite o modelo do equipamento" />
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
                    />
                  </Form.Item>

                  <Form.Item
                    label="Setor"
                    name="setorSelecionado"
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
                      options={setores}
                    />
                  </Form.Item>

                  <Form.Item label="Usuario" name="usuario">
                    <Select
                      showSearch
                      placeholder="Selecione um nível de acesso"
                      optionFilterProp="label"
                      options={usuarios}
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
                    <Button type="primary" htmlType="submit" disabled={!isChanged}>
                      Salvar
                    </Button>
                    <Button onClick={onReset} disabled={!isChanged}>
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
              <div>
                <div className="qrcode-container">
                  <div className="info">
                    <label>QRcode</label>
                  </div>
                  <div className="gerar-qrcode">
                    {equipamento.idQrcode}
                    <QRCodeCanvas value={equipamento.idQrcode} size={200} />
                    <label>{nomeEmpresa}</label>
                    <Button type="primary" onClick={handleSalvarImagem}>
                      Salvar como PNG
                    </Button>
                  </div>
                </div>
              </div>

              <div className="info">
                <label>Criado por</label> {usuarioByUid ? usuarioByUid.nome : 'Usuário não encontrado'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipamentoDetalhes;
