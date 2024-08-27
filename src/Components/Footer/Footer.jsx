/* eslint-disable react/react-in-jsx-scope */
import './footer.css';
import Logo from '/SEKI.png';

function Footer() {
  return (
    <footer>
      <div className="footer-container">
        <div className="footer-logo">
          <img src={Logo} />
        </div>
        <div className="footer-direitos">&copy; 2024 SEKI - Todos os direitos reservados</div>
      </div>
    </footer>
  );
}

export default Footer;
