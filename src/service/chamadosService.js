import { auth } from './firebaseConfig';

const chamadosService = {
  findByUser: () => {
    return callApi({
      method: 'GET',
      url: 'https://seki-api.onrender.com/chamados'
    });
  },
  findByStatus: () => {
    return callApi({
      method: 'GET',
      url: `https://seki-api.onrender.com/chamados/home/chamados`
    });
  },
  findCount: () => {
    return callApi({
      method: 'GET',
      url: `https://seki-api.onrender.com/chamados/home/chamadosCount`
    });
  },
  findByRes: () => {
    return callApi({
      method: 'GET',
      url: `https://seki-api.onrender.com/chamados/home/chamadosRes`
    });
  },
  findById: (IDdoc, IDchamado) => {
    return callApi({
      method: 'GET',
      url: `https://seki-api.onrender.com/chamados/${IDdoc}/${IDchamado}`
    });
  },
  findTramites: (IDdoc, IDchamado) => {
    return callApi({
      method: 'GET',
      url: `https://seki-api.onrender.com/chamados/tramites/${IDdoc}/${IDchamado}`
    });
  },
  getEmpresasDisponiveis: () => {
    return callApi({
      method: 'GET',
      url: 'https://seki-api.onrender.com/empresas/disponiveis'
    });
  },
  getUsuariosPorEmpresa: (empresaSelecionada) => {
    return callApi({
      method: 'GET',
      url: `https://seki-api.onrender.com/empresas/${empresaSelecionada}`
    });
  },
  update: (chamado) => {
    return callApi({
      method: 'PATCH',
      url: `https://seki-api.onrender.com/chamados/update`,
      params: chamado
    });
  },
  updateLido: (IDdoc, IDchamado) => {
    return callApi({
      method: 'PATCH',
      url: `https://seki-api.onrender.com/chamados/updateLido/${IDdoc}/${IDchamado}`
    });
  },
  save: (titulo, descricao, empresaSelecionada, usuarioSelecionado) => {
    return callApi({
      method: 'POST',
      url: `https://seki-api.onrender.com/chamados/create/${titulo}/${descricao}/${empresaSelecionada}/${usuarioSelecionado}`
    });
  },
  saveTramite: (tramite) => {
    return callApi({
      method: 'POST',
      url: `https://seki-api.onrender.com/chamados/create/tramite`,
      params: tramite
    });
  }
};

function callApi({ method, url, params }) {
  return new Promise((resolve, reject) => {
    // Adiciona um listener para monitorar mudanças no estado de autenticação
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Usuário autenticado, tenta obter o token
        try {
          const token = await user.getIdToken();
          const xhr = new XMLHttpRequest();
          xhr.open(method, url, true);
          xhr.setRequestHeader('Authorization', token);
          xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

          xhr.onreadystatechange = function () {
            if (this.readyState == 4) {
              const json = JSON.parse(this.responseText);
              if (this.status != 200) {
                reject(json);
              } else {
                resolve(json);
              }
            }
          };

          xhr.send(JSON.stringify(params));
        } catch (error) {
          reject(error);
        }
      } else {
        // Usuário não autenticado
        reject(new Error('Usuário não autenticado.'));
      }

      // Cancela o listener após o uso
      unsubscribe();
    });
  });
}

export default chamadosService;
