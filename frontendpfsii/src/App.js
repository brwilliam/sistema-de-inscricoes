import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import Candidato from './components/pagina/candidatos';
import Vaga from './components/pagina/vagas';
import Inscricoes from './components/pagina/inscricoes';
import PaginaInicial from './components/pagina/paginaInicial'; // Importe o componente PaginaInicial
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <div>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container">
            <Link className="navbar-brand" to="/">+Jobs</Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link" to="/candidatos">Candidato</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/vagas">Vaga</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/inscricoes">Inscrição</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<PaginaInicial />} /> {/* Rota para a página inicial */}
          <Route path="/candidatos" element={<Candidato />} />
          <Route path="/vagas" element={<Vaga />} />
          <Route path="/inscricoes" element={<Inscricoes />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
