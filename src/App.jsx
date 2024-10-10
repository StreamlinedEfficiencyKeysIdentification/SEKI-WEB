/* eslint-disable react/react-in-jsx-scope */
import './assets/global.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import Home from './Pages/Home/Home';
import Controle from './Pages/Controle/Controle';
import Recurso from './Pages/Recursos/Recurso';
import Sobre from './Pages/QuemSomos/Sobre';
import Contato from './Pages/Contato/Contato';
import Login from './Pages/Login/Login';
import Cadastro from './Pages/Cadastro/Cadastro';
import Esqueci from './Pages/EsqueciSenha/Esqueci';
import AtendenteLayout from './Pages/Atendente/AtendenteLayout'; // Novo layout
import HomeAtendente from './Pages/Atendente/Home/Home'; // Novo layout
import ChamadosLista from './Pages/Chamados/Lista'; // Nova página
import CriarChamado from './Pages/Chamados/Criar'; // Nova página
import UsuariosLista from './Pages/Usuarios/Lista'; // Nova página

import { useEffect } from 'react';

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1200,
    });
  }, []);

  return (
    <Router>
      {/* Rotas com Header e Footer */}
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Header />
              <div>
                <Home />
                <Controle />
                <Recurso />
              </div>
              <Footer />
            </>
          }
        />
        <Route
          path="/quemsomos"
          element={
            <>
              <Header />
              <Sobre />
              <Footer />
            </>
          }
        />
        <Route
          path="/contato"
          element={
            <>
              <Header />
              <Contato />
              <Footer />
            </>
          }
        />
        <Route
          path="/login"
          element={
            <>
              <Header />
              <Login />
              <Footer />
            </>
          }
        />
        <Route
          path="/cadastro"
          element={
            <>
              <Header />
              <Cadastro />
              <Footer />
            </>
          }
        />
        <Route
          path="/esqueci"
          element={
            <>
              <Header />
              <Esqueci />
              <Footer />
            </>
          }
        />
      </Routes>

      {/* Rotas do atendente sem Header e Footer */}
      <Routes>
        <Route path="/atendente" element={<AtendenteLayout />}>
          <Route path="" element={<Navigate to="home" />} />
          <Route path="home" element={<HomeAtendente />} />
          {/* Redireciona /atendente/chamados para /atendente/chamados/lista */}
          <Route path="chamados" element={<Navigate to="/atendente/chamados/lista" />} />
          <Route path="chamados/lista" element={<ChamadosLista />} />
          <Route path="chamados/criar" element={<CriarChamado />} />

          {/* Redireciona /atendente/usuarios para /atendente/usuarios/lista */}
          <Route path="usuarios" element={<Navigate to="/atendente/usuarios/lista" />} />
          <Route path="usuarios/lista" element={<UsuariosLista />} />
          {/* <Route path="usuarios/criar" element={<CriarUsuario />} /> */}

          {/* Redireciona /atendente/empresa para /atendente/empresa/lista */}
          <Route path="empresa" element={<Navigate to="/atendente/empresa/lista" />} />
          {/* <Route path="empresa/lista" element={<EmpresasLista />} />
          <Route path="empresa/criar" element={<CriarEmpresa />} /> */}

          {/* Redireciona /atendente/equipamento para /atendente/equipamento/lista */}
          <Route path="equipamento" element={<Navigate to="/atendente/equipamento/lista" />} />
          {/* <Route path="equipamento/lista" element={<EquipamentosLista />} />
          <Route path="equipamento/criar" element={<CriarEquipamento />} /> */}
          {/* Adicione mais rotas conforme necessário */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
