import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import chamadosService from '../../service/chamadosService';

const ChamadoDetalhes = () => {
  const { IDdoc, IDchamado } = useParams(); // Pega os parâmetros da URL
  const [chamado, setChamado] = useState(null);
  const [loading, setLoading] = useState(true); // Estado para controlar o carregamento
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChamado = async () => {
      try {
        // Busca o chamado pelo uidDoc e uidChamado
        const chamadoData = await chamadosService.findById(IDdoc, IDchamado);
        setChamado(chamadoData); // Armazena os dados do chamado no estado
        setLoading(false); // Define o carregamento como concluído
      } catch (err) {
        setError(`Erro ao carregar os detalhes do chamado: ${err}`); // Define uma mensagem de erro
        console.error(err);
        setLoading(false); // Define o carregamento como concluído
      }
    };

    fetchChamado();
  }, [IDdoc, IDchamado]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>{error}</div>; // Exibe a mensagem de erro, se houver
  }

  if (!chamado) {
    return <div>Chamado não encontrado.</div>;
  }

  return (
    <div>
      <h2>Detalhes do Chamado</h2>
      <p>Responsável: {chamado.Responsavel}</p>
      <p>Status: {chamado.Status}</p>
      <p>Data de Abertura: {chamado.DataCriacao}</p>
      <p>Número: {chamado.IDchamado}</p>
      <p>Título: {chamado.Titulo}</p>
      <p>Empresa: {chamado.Empresa}</p>
      <p>Usuário: {chamado.Usuario}</p>
      <p>Lido: {chamado.Lido ? 'Sim' : 'Não'}</p>
    </div>
  );
};

export default ChamadoDetalhes;
