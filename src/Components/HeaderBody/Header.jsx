/* eslint-disable react/react-in-jsx-scope */
import './header.css';
import { Input } from 'antd';

function Header() {
  return (
    <div className="header-nav">
      <div className="header-nav-search">
        <i className="bi bi-search"></i>
        <Input className="search" type="text" allowClear placeholder="Número do Chamado ou Título" />
      </div>
      <div className="header-nav-personal">
        <i className="bi bi-question-circle"></i>
        <div className="personal">
          <i className="bi bi-person-circle"></i>
        </div>
      </div>
    </div>
  );
}

export default Header;
