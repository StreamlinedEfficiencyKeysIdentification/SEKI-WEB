import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import usuariosService from '../../service/usuariosService';

const UsuarioDetalhes = () => {
  const { uid } = useParams(); // Pega os parâmetros da URL
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true); // Estado para controlar o carregamento
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmpresa = async () => {
      try {
        // Busca a empresa pelo uidDoc e uidEmpresa
        const usuarioData = await usuariosService.getUsuarioByUid(uid);

        setUsuario(usuarioData); // Armazena os dados da empresa no estado
        setLoading(false); // Define o carregamento como concluído
      } catch (err) {
        setError(`Erro ao carregar os detalhes da empresa: ${err.message}`); // Define uma mensagem de erro
        setLoading(false); // Define o carregamento como concluído
      }
    };

    fetchEmpresa();
  }, [uid]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>{error}</div>; // Exibe a mensagem de erro, se houver
  }

  if (!usuario) {
    return <div>Usuario não encontrado.</div>;
  }

  return (
    <div>
      <h2>Detalhes do Usuario</h2>
      <p>Nome: {usuario.nome}</p>
      <p>Usuario: {usuario.usuario}</p>
      <p>Email: {usuario.email}</p>
    </div>
  );
};

export default UsuarioDetalhes;
