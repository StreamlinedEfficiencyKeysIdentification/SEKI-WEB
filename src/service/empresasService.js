import { auth } from './firebaseConfig';

const empresasService = {
  findByUser: () => {
    return callApi({
      method: 'GET',
      url: 'http://localhost:3000/empresas'
    });
  },
  getEmpresasDisponiveis: () => {
    return callApi({
      method: 'GET',
      url: 'http://localhost:3000/empresas/disponiveis'
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

export default empresasService;
