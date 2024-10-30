import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import equipamentosService from '../../service/equipamentosService';

const EquipamentoDetalhes = () => {
  const { id } = useParams(); // Pega os parâmetros da URL
  const [equipamento, setEquipamento] = useState(null);
  const [loading, setLoading] = useState(true); // Estado para controlar o carregamento
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmpresa = async () => {
      try {
        // Busca a empresa pelo uidDoc e uidEmpresa
        const equipamentoData = await equipamentosService.getEquipamentoById(id);

        setEquipamento(equipamentoData); // Armazena os dados da empresa no estado
        setLoading(false); // Define o carregamento como concluído
      } catch (err) {
        setError(`Erro ao carregar os detalhes da empresa: ${err.message}`); // Define uma mensagem de erro
        setLoading(false); // Define o carregamento como concluído
      }
    };

    fetchEmpresa();
  }, [id]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>{error}</div>; // Exibe a mensagem de erro, se houver
  }

  if (!equipamento) {
    return <div>Equipamento não encontrado.</div>;
  }

  return (
    <div>
      <h2>Detalhes do Equipamento</h2>
      <p>Marca: {equipamento.marca}</p>
      <p>Modelo: {equipamento.modelo}</p>
      <p>QRcode: {equipamento.idQrcode}</p>
    </div>
  );
};

export default EquipamentoDetalhes;
