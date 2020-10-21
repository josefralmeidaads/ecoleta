import React from 'react';

import './styles.css';
import logo from '../../assets/logo.svg';

const Home: React.FC = () => {
  return (
      <div id="page-home">
          <div className="content">
            <header>
              <img src={logo} alt="Ecoleta"/> 
            </header>

            <main>
              <h1>Seu MarketPlace de Coleta de resíduos</h1>
              <p> 
                  Ajudamos pessoas a encontrarem 
                  pontos de coleta de forma eficiente
              </p>

              <a href="/cadastro-ponto">
                <span>
                  D
                </span>
                <strong>
                  Cadastre um ponto de Coleta
                </strong>
              </a>
            </main> 
          </div>
      </div>
  );
}

export default Home;