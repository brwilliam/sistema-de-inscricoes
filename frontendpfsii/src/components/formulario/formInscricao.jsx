import React, { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

function FormInscricao() {
  const [candidatos, setCandidatos] = useState([]);
  const [candidatoSelecionado, setCandidatoSelecionado] = useState(null);
  const [data, setData] = useState('');
  const [vagasSelecionadas, setVagasSelecionadas] = useState([]);
  const [dataAtual, setDataAtual] = useState('');
  const [cargosDisponiveis, setCargosDisponiveis] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [inscricoes, setInscricoes] = useState([]);
  const [termoBusca, setTermoBusca] = useState('');

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
  
    const cpf = candidatoSelecionado?.cpf || '';
    const finalData = data || dataAtual;

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
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Erro ao cadastrar candidatura:', error);
    }
  };

  // Função para lidar com a busca de candidatos
  const handleBusca = (e) => {
    const termo = e.target.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    setTermoBusca(termo);
  };

  const candidatosFiltrados = candidatos.filter(candidato =>
    candidato.nome.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(termoBusca)
  );

  return (
    <div className="container">
      <br />
      <h2 className="text-center mb-4">Formulário de Inscrição</h2>
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      <div className="row justify-content-center">
        <form onSubmit={handleSubmit} className="col-6">
          <div className="mb-3">
            <label htmlFor="candidato" className="form-label">Candidato</label>
            <Autocomplete
              id="candidato"
              options={candidatosFiltrados}
              getOptionLabel={(option) => option.nome}
              value={candidatoSelecionado}
              onChange={(event, newValue) => {
                setCandidatoSelecionado(newValue);
              }}
              size="small"
              renderInput={(params) => <TextField {...params} label="Buscar candidato..." variant="outlined" onChange={handleBusca} />}
            />
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
              value={vagasSelecionadas.map(vaga => vaga.id)} 
              onChange={(e) => setVagasSelecionadas(e.target.value.map(id => cargosDisponiveis.find(cargo => cargo.id === id)))} 
              renderValue={(selected) => (
                <div>
                  {selected.map((id) => (
                    <span key={id}>{cargosDisponiveis.find(cargo => cargo.id === id).cargo}, </span>
                  ))}
                </div>
              )}
              size="small"
            >
              {cargosDisponiveis.map(cargo => (
                <MenuItem key={cargo.id} value={cargo.id}> 
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
