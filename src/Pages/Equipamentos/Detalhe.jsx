import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import equipamentosService from '../../service/equipamentosService';
import usuariosService from '../../service/usuariosService';
import empresasService from '../../service/empresasService';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Alert, Button, Form, Input, message, QRCode, Segmented, Select, Space, Spin, Switch } from 'antd';
import './detalhe.css';
import html2canvas from 'html2canvas';

const MIN_SIZE = 48;
const MAX_SIZE = 300;

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
  const [renderType, setRenderType] = useState('canvas');
  const [size, setSize] = useState(160);
  const spaceRef = useRef(null);

  useEffect(() => {
    const fetchEquipamento = async () => {
      try {
        const equipamentoData = await equipamentosService.getEquipamentoById(id);
        setEquipamento(equipamentoData); // Armazena os dados do equipamento no estado

        const empresasData = await empresasService.getEmpresasDisponiveis();
        setEmpresas(
          empresasData.map((empresa) => ({
            value: empresa.IDempresa,
            label: empresa.RazaoSocial
          }))
        );

        const usuariosData = await usuariosService.getUsuariosPorNivel();
        setUsuarios(
          usuariosData.map((usuario) => ({
            value: usuario.uid,
            label: usuario.Nome
          }))
        );

        if (equipamentoData && empresasData) {
          const usuarioByUidData = await usuariosService.getUsuarioByUid(equipamentoData.quemCriou);
          setUsuarioByUid(usuarioByUidData);

          const setoresData = await empresasService.getSetoresPorEmpresa(equipamentoData.idEmpresa);
          setSetores(setoresData.map((setor) => ({ value: setor.IDdoc, label: setor.Descricao })));

          // Após buscar as empresas, encontre a empresa correspondente
          const empresaCorrespondente = empresasData.find((empresa) => empresa.IDempresa === equipamentoData.idEmpresa);
          setNomeEmpresa(empresaCorrespondente ? empresaCorrespondente.RazaoSocial : 'Empresa não encontrada');

          form.setFieldsValue({
            marca: equipamentoData.marca,
            modelo: equipamentoData.modelo,
            empresaSelecionada: equipamentoData.idEmpresa,
            setorSelecionado: equipamentoData.idSetor,
            usuario: equipamentoData.idUsuario,
            status: equipamentoData.status
          });
        }

        setLoading(false); // Define o carregamento como concluído
      } catch (error) {
        setError(`Erro ao carregar os detalhes do equipamento: ${error.message}`); // Define uma mensagem de erro
        setLoading(false); // Define o carregamento como concluído
      }
    };

    // Chama as funções de busca de dados
    fetchEquipamento();
  }, [form, id]);

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

  function doDownload(url, fileName) {
    const a = document.createElement('a');
    a.download = fileName;
    a.href = url;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  const handleDownload = async () => {
    if (spaceRef.current) {
      const canvas = await html2canvas(spaceRef.current);
      const link = document.createElement('a');
      link.download = `QRCode${equipamento.idQrcode}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  // const downloadCanvasQRCode = () => {
  //   const canvas = document.getElementById('myqrcode')?.querySelector('canvas');
  //   if (canvas) {
  //     const url = canvas.toDataURL();
  //     doDownload(url, `QRCode${equipamento.idQrcode}.png`);
  //   }
  // };

  const downloadSvgQRCode = () => {
    // const svg = document.getElementById('myqrcode')?.querySelector('svg');
    const svgData = new XMLSerializer().serializeToString(spaceRef.current);
    const blob = new Blob([svgData], {
      type: 'image/svg+xml;charset=utf-8'
    });
    const url = URL.createObjectURL(blob);
    doDownload(url, `QRCode${equipamento.idQrcode}.svg`);
  };

  const increase = () => {
    setSize((prevSize) => {
      const newSize = prevSize + 10;
      if (newSize >= MAX_SIZE) {
        return MAX_SIZE;
      }
      return newSize;
    });
  };
  const decline = () => {
    setSize((prevSize) => {
      const newSize = prevSize - 10;
      if (newSize <= MIN_SIZE) {
        return MIN_SIZE;
      }
      return newSize;
    });
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
                  <Space className="space" direction="vertical">
                    <Button.Group className="botoes-group">
                      <div>
                        <Button onClick={decline} disabled={size <= MIN_SIZE} icon={<MinusOutlined />}>
                          Smaller
                        </Button>
                        <Button onClick={increase} disabled={size >= MAX_SIZE} icon={<PlusOutlined />}>
                          Larger
                        </Button>
                      </div>
                      Tamanho: {size}px
                    </Button.Group>
                    <Segmented
                      options={['canvas', 'svg']}
                      value={renderType}
                      onChange={setRenderType}
                      style={{
                        marginBottom: 16
                      }}
                    />
                    <div className="qr-content" id="myqrcode" ref={spaceRef}>
                      <label>{equipamento.idQrcode}</label>
                      <QRCode
                        type={renderType}
                        value={equipamento.idQrcode}
                        bgColor="#fff"
                        size={size}
                        iconSize={size / 4}
                        icon="https://i.imgur.com/aBY5Kgf.png"
                      />
                      <label>{nomeEmpresa}</label>
                    </div>
                    <Button
                      type="primary"
                      onClick={renderType === 'canvas' ? handleDownload : downloadSvgQRCode}
                      style={{
                        marginTop: 16
                      }}
                    >
                      Download
                    </Button>
                  </Space>
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
