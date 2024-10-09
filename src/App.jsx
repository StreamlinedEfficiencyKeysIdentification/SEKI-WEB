/* eslint-disable react/react-in-jsx-scope */
import './assets/global.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import Home from './Pages/Home/Home';
import Controle from './Pages/Controle/Controle';
import Recurso from './Pages/Recursos/Recurso';
import Sobre from './Pages/QuemSomos/Sobre';
import Contato from './Pages/Contato/Contato';
import Login from './Pages/Login/Login';
import Cadastro from './Pages/Cadastro/Cadastro';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1200,
    });
  }, []);

  return (
    <Router>
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <Home />
              <Controle />
              <Recurso />
            </div>
          }
        />
        <Route path="/quemsomos" element={<Sobre />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
