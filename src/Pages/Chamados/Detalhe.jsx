import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Select, Button, Modal, Input, Switch, message, Alert, Spin, Empty } from 'antd';
import chamadosService from '../../service/chamadosService';
import empresasService from '../../service/empresasService';
import usuariosService from '../../service/usuariosService';
import './detalhe.css';
import Cookies from 'js-cookie';

const ChamadoDetalhes = () => {
  const { IDdoc, IDchamado } = useParams();
  const [chamado, setChamado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [empresas, setEmpresas] = useState([]);
  const [usuario, setUsuario] = useState([]);
  const [responsaveis, setResponsaveis] = useState([]);
  const [tramites, setTramites] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [isChangedModal, setIsChangedModal] = useState(false);
  const [mobile, setMobile] = useState(false);

  // Variáveis temporárias para os campos editáveis
  const [empresaTemp, setEmpresaTemp] = useState(null);
  const [responsavelTemp, setResponsavelTemp] = useState(null);
  const [statusTemp, setStatusTemp] = useState(null);

  // Variáveis para o pop-up
  const [tramiteMessage, setTramiteMessage] = useState('');
  const [sendEmail, setSendEmail] = useState(false);

  const uid = Cookies.get('uid');

  useEffect(() => {
    const handleResize = () => {
      setMobile(window.innerWidth < 768);
    };

    // Verifique o tamanho inicial da janela
    handleResize();

    // Adicione o event listener para escutar mudanças no tamanho da janela
    window.addEventListener('resize', handleResize);

    // Limpe o event listener quando o componente for desmontado
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const fetchUsuario = useCallback(async (uid) => {
    if (!uid) return;

    try {
      const usuarioData = await usuariosService.getUsuarioByUid(uid);
      if (usuarioData) {
        setUsuario(usuarioData);
      } else {
        setUsuario([]);
      }
    } catch (error) {
      console.error('Erro ao buscar o usuário:', error);
      setUsuario([]);
    }
  }, []);

  useEffect(() => {
    async function carregarTramites() {
      try {
        const response = await chamadosService.findTramites(IDdoc, IDchamado);
        if (response.success) {
          setTramites(response.data);
        } else {
          console.error(response.message);
        }
      } catch (error) {
        console.error('Erro ao buscar trâmites:', error);
      }
    }

    carregarTramites();
  }, [IDdoc, IDchamado]);

  useEffect(() => {
    const fetchChamado = async () => {
      try {
        const chamadoData = await chamadosService.findById(IDdoc, IDchamado);
        setChamado(chamadoData);
        setEmpresaTemp(chamadoData.Empresa);
        setResponsavelTemp(chamadoData.Responsavel);
        setStatusTemp(chamadoData.Status);
        setLoading(false);

        fetchUsuario(chamadoData.Usuario);

        // Verifica se o chamado não foi lido e atualiza o campo Lido
        if (!chamadoData.Lido) {
          await chamadosService.updateLido(IDdoc, IDchamado); // Chama a função para atualizar o campo Lido
        }
      } catch (err) {
        setError(`Erro ao carregar os detalhes do chamado: ${err.message}`);
        console.error(err);
        setLoading(false);
      }
    };
    fetchChamado();
  }, [IDdoc, IDchamado, fetchUsuario]);

  useEffect(() => {
    const fetchEmpresas = async () => {
      const empresasData = await empresasService.getEmpresasDisponiveis();
      setEmpresas(empresasData.map((empresa) => ({ value: empresa.IDempresa, label: empresa.RazaoSocial })));
    };

    const fetchResponsaveis = async () => {
      const responsaveisData = await usuariosService.getResponsaveis();
      setResponsaveis(responsaveisData.map((responsavel) => ({ value: responsavel.uid, label: responsavel.Nome })));
    };

    fetchEmpresas();
    fetchResponsaveis();
  }, []);

  const handleSelectChange = (field, value) => {
    setIsChanged(true);
    switch (field) {
      case 'Empresa':
        setEmpresaTemp(value);
        break;
      case 'Responsavel':
        setResponsavelTemp(value);
        break;
      case 'Status':
        setStatusTemp(value);
        break;
      default:
        break;
    }
  };

  const handleSave = async () => {
    try {
      const updatedChamado = {
        ...chamado,
        Empresa: empresaTemp,
        Responsavel: responsavelTemp,
        Status: statusTemp
      };
      await chamadosService.update(updatedChamado);
      alert('Chamado atualizado com sucesso!');
      setChamado(updatedChamado);
      setIsChanged(false);
      // window.location.reload(); // Recarrega a página
    } catch (error) {
      console.error('Erro ao atualizar o chamado:', error);
      alert('Erro ao atualizar o chamado. Tente novamente.');
    }
  };

  const handleCancel = () => {
    // Restaura os dados temporários com os valores originais
    setEmpresaTemp(chamado.Empresa);
    setResponsavelTemp(chamado.Responsavel);
    setStatusTemp(chamado.Status);
    setIsChanged(false);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    if (!tramiteMessage) {
      return message.error('A mensagem do trâmite não pode estar vazia.', 5);
    }
    try {
      // Enviar os dados para a API
      await chamadosService.saveTramite({
        IDempresa: IDdoc,
        IDchamado: IDchamado,
        Mensagem: tramiteMessage,
        Status: statusTemp !== chamado.Status ? statusTemp : ''
      });
      setIsModalOpen(false);
      setTramiteMessage('');
      message.success('Trâmite salvo com sucesso!');
    } catch (err) {
      message.error(`Erro ao salvar o trâmite. ${err.message}`, 5);
    }
  };

  const handleModalSelectChange = (field, value) => {
    setIsChangedModal(true);
    switch (field) {
      case 'Status':
        setStatusTemp(value);
        break;
      default:
        break;
    }
  };

  const handleModalCancel = () => {
    if (isChangedModal) {
      Modal.confirm({
        title: 'Tem certeza que deseja descartar as alterações?',
        onOk: () => {
          setIsModalOpen(false);
          setIsChangedModal(false);

          setStatusTemp(chamado.Status);
          setTramiteMessage('');
          setSendEmail(false);
        }
      });
    } else {
      setIsModalOpen(false);
    }
  };

  return (
    <div className="detalhe-chamado-container">
      <div className="botao-chamado">
        {isChanged && (
          <div className="botoes">
            <Button type="primary" onClick={handleSave}>
              Salvar
            </Button>
            <Button onClick={handleCancel}>Cancelar</Button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="spin-container">
          <Spin tip="Carregando detalhes do chamado..." size="large">
            <div style={{ height: 'auto', width: '200px', background: 'transparent', fontSize: '2rem' }}></div>{' '}
            {/* Elemento aninhado para compatibilidade */}
          </Spin>
        </div>
      ) : error ? (
        <Alert message={error} type="error" showIcon />
      ) : !chamado ? (
        <Alert message="Chamado não encontrado" type="error" showIcon />
      ) : (
        <>
          <div className="dc-content">
            <div className="coluna1">
              <div className="chamado">
                <div className="titulo">
                  <label>
                    #{chamado.IDchamado} - {chamado.Titulo}
                  </label>
                </div>
                <div className="linha"></div>
                <div className="info-data">
                  <label>{usuario ? usuario.nome : 'Usuário não encontrado'} </label>abriu em {chamado.DataCriacao}
                </div>
                <div className="descricao">{chamado.Descricao}</div>
              </div>

              {!mobile && (
                <div className="tramites">
                  <div className="title">
                    <label>Tramites</label>
                    <Button type="primary" onClick={showModal} disabled={isChanged}>
                      Novo
                    </Button>
                  </div>
                  <div className="linha"></div>
                  <div className="tramites-container">
                    {tramites.length > 0 ? (
                      tramites
                        .sort((a, b) => {
                          const parseDate = (dateStr) => {
                            const [datePart, timePart] = dateStr.split(' às ');
                            const [day, month, year] = datePart.split('/').map(Number);
                            const [hours, minutes, seconds] = timePart.split(':').map(Number);
                            return new Date(year, month - 1, day, hours, minutes, seconds);
                          };

                          return parseDate(b.DataMensagem) - parseDate(a.DataMensagem);
                        })
                        .map((tramite, index) => {
                          // Verifique se o IDusuario é igual ao UID armazenado no cookie
                          const isCurrentUser = tramite.usuarioDetalhes.IDusuario === uid;

                          return (
                            <div
                              key={index}
                              className={`tramite-item ${isCurrentUser ? 'tramite-direita' : 'tramite-esquerda'}`}
                            >
                              <div className="tramite-usuario">{tramite.usuarioDetalhes.Nome}:</div>
                              <div className="tramite-mensagem">{tramite.Mensagem}</div>
                              <div className="tramite-data">{tramite.DataMensagem}</div>
                            </div>
                          );
                        })
                    ) : (
                      <Empty description="Não há dados" />
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="coluna2">
              <div className="detalhe">
                <div className="title">
                  <label>Informações</label>
                </div>
                <div className="linha"></div>
                <div className="info">
                  <label>QRcode</label> {chamado.QRcode}
                </div>
                <div className="info">
                  <label>Lido</label> {chamado.Lido ? 'Sim' : 'Não'}
                </div>
                <div className="info">
                  <label>Atualizado em</label> {chamado.DataAtualizacao}
                </div>
              </div>

              <div className="envolvidos">
                <div className="title">
                  <label>Envolvidos</label>
                </div>
                <div className="linha"></div>
                <div className="info">
                  <label>Empresa*</label>
                  <Select
                    showSearch
                    placeholder="Selecione uma empresa"
                    optionFilterProp="label"
                    value={empresaTemp}
                    onChange={(value) => handleSelectChange('Empresa', value)}
                    options={empresas}
                  />
                </div>

                <div className="info">
                  <label>Usuario*</label> {usuario ? usuario.nome : 'Usuário não encontrado'}
                </div>

                <div className="info">
                  <label>Responsável</label>
                  <Select
                    showSearch
                    placeholder="Selecione um responsável"
                    optionFilterProp="label"
                    value={responsavelTemp ? responsavelTemp : 'Selecione um responsável'}
                    onChange={(value) => handleSelectChange('Responsavel', value)}
                    options={responsaveis}
                  />
                </div>
                <div className="info">
                  <label>Status*</label>
                  <Select
                    placeholder="Selecione o status"
                    value={statusTemp} // Alterado de chamado.Status para statusTemp
                    onChange={(value) => handleSelectChange('Status', value)}
                    options={[
                      { value: 'Não iniciado', label: 'Não iniciado' },
                      { value: 'Em andamento', label: 'Em andamento' },
                      { value: 'Aguardando', label: 'Aguardando' },
                      { value: 'Concluído', label: 'Concluído' }
                    ]}
                  />
                </div>
              </div>

              {mobile && (
                <div className="tramites">
                  <div className="title">
                    <label>Tramites</label>
                    <Button type="primary" onClick={showModal} disabled={isChanged}>
                      Novo
                    </Button>
                  </div>
                  <div className="linha"></div>
                  <div className="tramites-container">
                    {tramites.length > 0 ? (
                      tramites
                        .sort((a, b) => {
                          const parseDate = (dateStr) => {
                            const [datePart, timePart] = dateStr.split(' às ');
                            const [day, month, year] = datePart.split('/').map(Number);
                            const [hours, minutes, seconds] = timePart.split(':').map(Number);
                            return new Date(year, month - 1, day, hours, minutes, seconds);
                          };

                          return parseDate(b.DataMensagem) - parseDate(a.DataMensagem);
                        })
                        .map((tramite, index) => {
                          // Verifique se o IDusuario é igual ao UID armazenado no cookie
                          const isCurrentUser = tramite.usuarioDetalhes.IDusuario === uid;

                          return (
                            <div
                              key={index}
                              className={`tramite-item ${isCurrentUser ? 'tramite-direita' : 'tramite-esquerda'}`}
                            >
                              <div className="tramite-usuario">{tramite.usuarioDetalhes.Nome}:</div>
                              <div className="tramite-mensagem">{tramite.Mensagem}</div>
                              <div className="tramite-data">{tramite.DataMensagem}</div>
                            </div>
                          );
                        })
                    ) : (
                      <Empty description="Não há dados" />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <Modal title="Novo Trâmite" open={isModalOpen} onOk={handleOk} onCancel={handleModalCancel} destroyOnClose>
        <Input.TextArea
          value={tramiteMessage}
          onChange={(e) => {
            setTramiteMessage(e.target.value);
            setIsChangedModal(true);
          }}
          placeholder="Digite sua mensagem"
        />
        <Select
          placeholder="Selecione o status"
          value={statusTemp} // Alterado de chamado.Status para statusTemp
          onChange={(value) => handleModalSelectChange('Status', value)}
          options={[
            { value: 'Não iniciado', label: 'Não iniciado' },
            { value: 'Em andamento', label: 'Em andamento' },
            { value: 'Aguardando', label: 'Aguardando' },
            { value: 'Concluído', label: 'Concluído' }
          ]}
        />
        <div style={{ marginTop: '10px' }}>
          <Switch
            checked={sendEmail}
            onChange={(checked) => {
              setSendEmail(checked), setIsChangedModal(true);
            }}
          />
          <span style={{ marginLeft: '10px' }}>Enviar e-mail</span>
        </div>
      </Modal>
    </div>
  );
};

export default ChamadoDetalhes;
