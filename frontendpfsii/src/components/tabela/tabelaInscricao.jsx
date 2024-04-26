import React, { useState, useEffect } from 'react';
import axios from 'axios';

function formatarCPF(cpf) {
  // Formata o CPF para o padrão 999.999.999-99
  return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
}

function PesquisaInscricoes({ onSearch }) {
  const [termo, setTermo] = useState('');

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      onSearch(termo);
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [termo, onSearch]);

  const handleChange = (e) => {
    setTermo(e.target.value);
  };

  return (
    <div className="container d-flex justify-content-center mb-3">
      <form className="w-100">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Pesquisar por nome do candidato ou CPF"
            value={termo}
            onChange={handleChange}
          />
        </div>
      </form>
    </div>
  );
}

function TabelaInscricoes() {
  const [candidaturas, setCandidaturas] = useState([]);
  const [candidaturasFiltradas, setCandidaturasFiltradas] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:4000/inscricoes')
      .then(response => {
        setCandidaturas(response.data.listaCandidaturas);
        setCandidaturasFiltradas(response.data.listaCandidaturas); // Renderizar todos os candidatos inicialmente
      })
      .catch(error => {
        console.error('Erro ao buscar inscrições:', error);
      });
  }, []);

  const handleSearch = (termo) => {
    if (termo === '') {
      setCandidaturasFiltradas(candidaturas);
    } else {
      const candidaturasFiltradas = candidaturas.filter(candidatura =>
        candidatura.nome.toLowerCase().includes(termo.toLowerCase()) ||
        formatarCPF(candidatura.cpf).includes(termo) // Aplicar formato de CPF para a busca
      );
      setCandidaturasFiltradas(candidaturasFiltradas);
    }
  };

  return (
    <div className="container d-flex justify-content-center">
      <div className="w-75">
        <h2 className="text-center">Tabela de Inscrições</h2>
        <br />
        <PesquisaInscricoes onSearch={handleSearch} />
        <table className="table table-bordered">
          <thead className="table-dark text-center">
            <tr>
              <th scope="col">CPF</th>
              <th scope="col">Nome do Candidato</th>
              <th scope="col">Vagas</th>
            </tr>
          </thead>
          <tbody>
            {candidaturasFiltradas.map((candidatura, index) => (
              <tr key={index}>
                <td>{formatarCPF(candidatura.cpf)}</td>
                <td>{candidatura.nome}</td>
                <td>
                  <ul>
                    {candidatura.vagas.map((vaga, index) => (
                      <li key={index}>
                        {vaga.cargo} - Salário: R$ {vaga.salario}
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TabelaInscricoes;
