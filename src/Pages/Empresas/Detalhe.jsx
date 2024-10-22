import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import empresasService from '../../service/empresasService';

const EmpresaDetalhes = () => {
  const { IDdoc } = useParams(); // Pega os parâmetros da URL
  const [empresa, setEmpresa] = useState(null);
  const [loading, setLoading] = useState(true); // Estado para controlar o carregamento
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmpresa = async () => {
      try {
        // Busca a empresa pelo uidDoc e uidEmpresa
        const empresaData = await empresasService.findById(IDdoc);
        setEmpresa(empresaData); // Armazena os dados da empresa no estado
        setLoading(false); // Define o carregamento como concluído
      } catch (err) {
        setError(`Erro ao carregar os detalhes da empresa: ${err.message}`); // Define uma mensagem de erro
        setLoading(false); // Define o carregamento como concluído
      }
    };

    fetchEmpresa();
  }, [IDdoc]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>{error}</div>; // Exibe a mensagem de erro, se houver
  }

  if (!empresa) {
    return <div>Empresa não encontrada.</div>;
  }

  return (
    <div>
      <h2>Detalhes do Empresa</h2>
      <p>CNPJ: {empresa.CNPJ}</p>
      <p>Razao Social: {empresa.RazaoSocial}</p>
      <p>Status: {empresa.Status}</p>
    </div>
  );
};

export default EmpresaDetalhes;
