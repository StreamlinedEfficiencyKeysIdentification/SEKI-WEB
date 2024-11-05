import { auth } from './firebaseConfig';

const usuariosService = {
  getUsuariosPorEmpresa: (empresaSelecionada) => {
    return callApi({
      method: 'GET',
      url: `https://seki-api.onrender.com/empresas/${empresaSelecionada}`
    });
  },
  getUsuariosPorNivel: () => {
    return callApi({
      method: 'GET',
      url: `https://seki-api.onrender.com/usuario/nivel`
    });
  },
  getUsuarioByUid: (uid) => {
    return callApi({
      method: 'GET',
      url: `https://seki-api.onrender.com/usuario/${uid}`
    });
  },
  getUsuariosCount: () => {
    return callApi({
      method: 'GET',
      url: `https://seki-api.onrender.com/usuario/home/usuariosCount`
    });
  },
  getNivel: () => {
    return callApi({
      method: 'GET',
      url: `https://seki-api.onrender.com/usuario/find/nivel`
    });
  },
  getResponsaveis: () => {
    return callApi({
      method: 'GET',
      url: `https://seki-api.onrender.com/usuario/responsaveis`
    });
  },
  update: (usuario) => {
    return callApi({
      method: 'PATCH',
      url: `https://seki-api.onrender.com/usuario/update`,
      params: usuario
    });
  },
  save: (usuario, email, nome, empresaSelecionada, nivelSelecionado) => {
    return callApi({
      method: 'POST',
      url: `https://seki-api.onrender.com/usuario/create/${usuario}/${email}/${nome}/${empresaSelecionada}/${nivelSelecionado}`
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

export default usuariosService;
