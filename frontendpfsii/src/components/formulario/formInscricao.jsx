import React, { useState, useEffect } from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

function FormInscricao() {
  const [candidatos, setCandidatos] = useState([]);
  const [candidatoSelecionado, setCandidatoSelecionado] = useState({});
  const [data, setData] = useState('');
  const [vagasSelecionadas, setVagasSelecionadas] = useState([]);
  const [dataAtual, setDataAtual] = useState('');
  const [cargosDisponiveis, setCargosDisponiveis] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [inscricoes, setInscricoes] = useState([]); // Estado para armazenar as inscrições existentes

  useEffect(() => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    setDataAtual(formattedDate);
  }, []);

  useEffect(() => {
    fetch('http://localhost:4000/candidatos')
      .then(response => response.json())
      .then(data => {
        if (data && data.listaCandidatos) {
          setCandidatos(data.listaCandidatos);
        }
      })
      .catch(error => {});

    fetch('http://localhost:4000/vagas')
      .then(response => response.json())
      .then(data => {
        if (data && data.listaVagas) {
          setCargosDisponiveis(data.listaVagas);
        }
      })
      .catch(error => {});
  }, []);

  useEffect(() => {
    fetch('http://localhost:4000/inscricoes')
      .then(response => response.json())
      .then(data => {
        if (data && data.listaCandidaturas) {
          setInscricoes(data.listaCandidaturas);
        }
      })
      .catch(error => {
        console.error('Erro ao buscar inscrições:', error);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const cpf = candidatoSelecionado.cpf || '';
    const finalData = data || dataAtual;

    // Verificar se o candidato já está inscrito em alguma das vagas selecionadas
    const candidaturaExistente = inscricoes.find(candidatura => candidatura.cpf === cpf && vagasSelecionadas.some(vaga => candidatura.vagas.find(v => v.id_vaga === vaga.id)));
    if (candidaturaExistente) {
      const vagaInscrita = candidaturaExistente.vagas.find(vaga => vagasSelecionadas.some(v => v.id === vaga.id_vaga));
      alert(`Este candidato já está inscrito na vaga "${vagaInscrita.cargo}".`);
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/inscricoes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          candidato: {
            cpf: cpf,
          },
          dataCandidatura: finalData,
          vagas: vagasSelecionadas.map(vaga => ({ id: vaga.id })),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }

      setSuccessMessage('Candidatura cadastrada com sucesso!');
      setTimeout(() => {
        window.location.reload(); // Recarrega a página após 1 segundo
      }, 1000);
    } catch (error) {
      console.error('Erro ao cadastrar candidatura:', error);
    }
  };

  return (
    <div className="container">
      <br />
      <h2 className="text-center mb-4">Formulário de Inscrição</h2>
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      <div className="row justify-content-center">
        <form onSubmit={handleSubmit} className="col-6">
          <div className="mb-3">
            <label htmlFor="candidato" className="form-label">Candidato</label>
            <select id="candidato" className="form-select mb-3" value={candidatoSelecionado.cpf || ''} onChange={(e) => setCandidatoSelecionado(candidatos.find(c => c.cpf === e.target.value) || {})}>
              <option value="">Selecione um candidato</option>
              {candidatos.map(candidato => (
                <option key={candidato.cpf} value={candidato.cpf}>{candidato.nome}</option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="data" className="form-label">Data</label>
            <input type="date" className="form-control mb-3" id="data" value={data || dataAtual} onChange={(e) => setData(e.target.value)} />
          </div>
          <FormControl fullWidth>
            <InputLabel id="vagas-label">Vagas</InputLabel>
            <Select
              labelId="vagas-label"
              id="vagas"
              multiple
              value={vagasSelecionadas}
              onChange={(e) => setVagasSelecionadas(e.target.value)}
              renderValue={(selected) => (
                <div>
                  {selected.map((value) => (
                    <span key={value.id}>{value.cargo}, </span>
                  ))}
                </div>
              )}
              size="small"
            >
              {cargosDisponiveis.map(cargo => (
                <MenuItem key={cargo.id} value={cargo}>
                  <FormControlLabel
                    control={<Checkbox checked={vagasSelecionadas.some(vaga => vaga.id === cargo.id)} />}
                    label={cargo.cargo}
                  />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <br />
          <button type="submit" className="btn btn-success mt-4">Cadastrar Candidatura</button>
        </form>
      </div>
    </div>
  );
}

export default FormInscricao;
