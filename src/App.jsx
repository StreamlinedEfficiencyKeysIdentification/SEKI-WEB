/* eslint-disable react/react-in-jsx-scope */
import './assets/global.css';
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import Home from './Pages/Home/Home';
import Controle from './Pages/Controle/Controle';
import Recurso from './Pages/Recursos/Recurso';

function App() {
  return (
    <div>
      <Header />
      <Home />
      <Controle />
      <Recurso />
      <Footer />
    </div>
  );
}

export default App;
