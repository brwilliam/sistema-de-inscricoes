import React, { useState, useEffect } from 'react';
import PesquisaVaga from '../pesquisa/pesquisarVagas';

function TabelaVagas() {
  const [vagas, setVagas] = useState([]);
  const [mensagemExclusao, setMensagemExclusao] = useState('');
  const [mensagemEdicao, setMensagemEdicao] = useState('');
  const [editandoVaga, setEditandoVaga] = useState(null); // Estado para controlar qual vaga está sendo editada

  useEffect(() => {
    fetch('http://localhost:4000/vagas')
      .then(response => response.json())
      .then(data => {
        if (data.status && Array.isArray(data.listaVagas)) {
          setVagas(data.listaVagas);
        } else {
          console.error('Formato de resposta inválido:', data);
          setVagas([]);
        }
      })
      .catch(error => {
        console.error('Erro ao buscar vagas:', error);
        setVagas([]);
      });
  }, [mensagemExclusao, mensagemEdicao]);

  const handleExcluirVaga = (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta vaga?')) {
      fetch('http://localhost:4000/vagas', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: id
        })
      })
        .then(response => response.json())
        .then(data => {
          if (data.status) {
            setVagas(vagas.filter(vaga => vaga.id !== id));
            setMensagemExclusao('Vaga excluída com sucesso');
            console.log('Vaga excluída com sucesso:', id);
            setTimeout(() => {
              setMensagemExclusao('');
            }, 3000);
          } else {
            console.error('Erro ao excluir vaga:', data.mensagem);
          }
        })
        .catch(error => {
          console.error('Erro ao excluir vaga:', error);
        });
    }
  };

  const handleEditarVaga = (id) => {
    if (window.confirm('Tem certeza que deseja editar esta vaga?')) {
      setEditandoVaga(id);
    }
  };

  const handleSalvarEdicao = (id, novosDados) => {
    fetch(`http://localhost:4000/vagas`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(novosDados)
    })
      .then(response => response.json())
      .then(data => {
        if (data.status) {
          setVagas(vagas.map(vaga => vaga.id === id ? { ...vaga, ...novosDados } : vaga));
          setEditandoVaga(null);
          setMensagemEdicao('Vaga editada com sucesso');
          console.log('Vaga editada com sucesso:', id);
          setTimeout(() => {
            setMensagemEdicao('');
          }, 3000);
        } else {
          console.error('Erro ao editar vaga:', data.mensagem);
        }
      })
      .catch(error => {
        console.error('Erro ao editar vaga:', error);
      });
  };

  const handlePesquisar = (termo) => {
    if (termo.trim() === '') {
      // Se o termo de pesquisa estiver vazio, buscar todas as vagas novamente
      fetch('http://localhost:4000/vagas')
        .then(response => response.json())
        .then(data => {
          if (data.status && Array.isArray(data.listaVagas)) {
            setVagas(data.listaVagas);
          } else {
            console.error('Formato de resposta inválido:', data);
            setVagas([]);
          }
        })
        .catch(error => {
          console.error('Erro ao buscar vagas:', error);
          setVagas([]);
        });
    } else {
      // Filtrar as vagas com base no termo de pesquisa
      const vagasFiltradas = vagas.filter(vaga =>
        vaga.cargo.toLowerCase().includes(termo.toLowerCase())
      );
      setVagas(vagasFiltradas);
    }
  };

  return (
    <div className="container d-flex justify-content-center">
      <div className="w-75">
        <h2 className="text-center">Tabela de Vagas</h2>
        <br />
        <PesquisaVaga onSearch={handlePesquisar} /> {/* Adicione o componente PesquisaCandidatos aqui */}
        <div className="alert alert-success" style={{ display: mensagemExclusao ? 'block' : 'none' }}>
          {mensagemExclusao}
        </div>
        <div className="alert alert-success" style={{ display: mensagemEdicao ? 'block' : 'none' }}>
          {mensagemEdicao}
        </div>
        <table className="table table-bordered text-center">
          <thead className="table-dark">
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Cargo</th>
              <th scope="col">Salário</th>
              <th scope="col">Quantidade</th>
              <th scope="col" className='col-3'>Ações</th>
            </tr>
          </thead>
          <tbody>
            {vagas.map(vaga => (
              <tr key={vaga.id}>
                <td>{vaga.id}</td>
                <td>{editandoVaga === vaga.id ? (
                  <input type="text" value={vaga.cargo} onChange={(e) => setVagas(prevState => prevState.map(item => item.id === vaga.id ? { ...item, cargo: e.target.value } : item))} />
                ) : vaga.cargo}</td>
                <td>{editandoVaga === vaga.id ? (
                  <input type="text" value={vaga.salario} onChange={(e) => setVagas(prevState => prevState.map(item => item.id === vaga.id ? { ...item, salario: e.target.value } : item))} />
                ) : vaga.salario}</td>
                <td>{editandoVaga === vaga.id ? (
                  <input type="text" value={vaga.quantidade} onChange={(e) => setVagas(prevState => prevState.map(item => item.id === vaga.id ? { ...item, quantidade: e.target.value } : item))} />
                ) : vaga.quantidade}</td>
                <td>
                  {editandoVaga === vaga.id ? (
                    <>
                      <button onClick={() => handleSalvarEdicao(vaga.id, vaga)} className="btn btn-success mr-2">Salvar</button>
                      <button onClick={() => setEditandoVaga(null)} className="btn btn-secondary">Cancelar</button>
                    </>
                  ) : (
                    <button onClick={() => handleEditarVaga(vaga.id)} className="btn btn-primary mr-2">Editar</button>
                  )}
                  <button onClick={() => handleExcluirVaga(vaga.id)} className="btn btn-danger">Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TabelaVagas;
