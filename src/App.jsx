/* eslint-disable react/react-in-jsx-scope */
import './assets/global.css';
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import Home from './Pages/Home/Home';
import Controle from './Pages/Controle/Controle';
import Sobre from './Pages/QuemSomos/Sobre';

function App() {
  return (
    <div>
      <Header />
      <Home />
      <Controle />
      <Sobre />
      <Footer />
    </div>
  );
}

export default App;
