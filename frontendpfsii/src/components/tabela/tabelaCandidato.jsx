import React, { useState, useEffect } from 'react';
import PesquisaCandidatos from '../pesquisa/pesquisarCandidato'; 

function formatarCPF(cpf) {
  return cpf.replace(/\D/g, '') // Remove caracteres não numéricos
            .replace(/(\d{3})(\d)/, '$1.$2') // Adiciona ponto após os 3 primeiros dígitos
            .replace(/(\d{3})(\d)/, '$1.$2') // Adiciona ponto após os 3 próximos dígitos
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // Adiciona hífen antes dos últimos 2 dígitos
}

function TabelaCandidatos() {
  const [candidatos, setCandidatos] = useState([]);
  const [mensagemExclusao, setMensagemExclusao] = useState('');
  const [mensagemEdicao, setMensagemEdicao] = useState('');
  const [editandoCandidato, setEditandoCandidato] = useState(null); 

  useEffect(() => {
    fetch('http://localhost:4000/candidatos')
      .then(response => response.json())
      .then(data => {
        if (data.status && Array.isArray(data.listaCandidatos)) {
          setCandidatos(data.listaCandidatos);
        } else {
          console.error('Formato de resposta inválido:', data);
          setCandidatos([]);
        }
      })
      .catch(error => {
        console.error('Erro ao buscar candidatos:', error);
        setCandidatos([]);
      });
  }, [mensagemExclusao, mensagemEdicao]);

  const handleExcluirCandidato = (cpf) => {
    if (window.confirm('Tem certeza que deseja excluir este candidato?')) {
      fetch('http://localhost:4000/candidatos', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cpf: cpf
        })
      })
        .then(response => response.json())
        .then(data => {
          if (data.status) {
            setCandidatos(candidatos.filter(candidato => candidato.cpf !== cpf));
            setMensagemExclusao('Candidato excluído com sucesso');
            console.log('Candidato excluído com sucesso:', cpf);
            setTimeout(() => {
              setMensagemExclusao('');
            }, 3000);
          } else {
            console.error('Erro ao excluir candidato:', data.mensagem);
          }
        })
        .catch(error => {
          console.error('Erro ao excluir candidato:', error);
        });
    }
  };

  const handleEditarCandidato = (cpf) => {
    if (window.confirm('Tem certeza que deseja editar este candidato?')) {
      setEditandoCandidato(cpf);
    }
  };

  const handleSalvarEdicao = (cpf, novosDados) => {
    // Atualiza o estado local com os novos dados imediatamente
    setCandidatos(candidatos.map(candidato => candidato.cpf === cpf ? { ...candidato, ...novosDados } : candidato));
    
    // Envia a requisição HTTP para salvar as alterações
    fetch(`http://localhost:4000/candidatos`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(novosDados)
    })
      .then(response => response.json())
      .then(data => {
        if (data.status) {
          setEditandoCandidato(null);
          setMensagemEdicao('Candidato atualizado com sucesso');
          console.log('Candidato atualizado com sucesso:', cpf);
          setTimeout(() => {
            setMensagemEdicao('');
          }, 3000);
          
          // Recarrega a página após salvar a edição
          window.location.reload();
        } else {
          console.error('Erro ao editar candidato:', data.mensagem);
        }
      })
      .catch(error => {
        console.error('Erro ao editar candidato:', error);
      });
  };
  

  const handlePesquisar = (termo) => {
    if (termo.trim() === '') {
      // Se o termo de pesquisa estiver vazio, buscar todos os candidatos novamente
      fetch('http://localhost:4000/candidatos')
        .then(response => response.json())
        .then(data => {
          if (data.status && Array.isArray(data.listaCandidatos)) {
            setCandidatos(data.listaCandidatos);
          } else {
            console.error('Formato de resposta inválido:', data);
            setCandidatos([]);
          }
        })
        .catch(error => {
          console.error('Erro ao buscar candidatos:', error);
          setCandidatos([]);
        });
    } else {
      // Filtrar os candidatos com base no termo de pesquisa
      const candidatosFiltrados = candidatos.filter(candidato =>
        candidato.nome.toLowerCase().includes(termo.toLowerCase()) || candidato.cpf.includes(termo)
      );
      setCandidatos(candidatosFiltrados);
    }
  };

  return (
    <div className="container d-flex justify-content-center">
      <div className="w-75">
        <h2 className="text-center">Tabela de Candidatos</h2>
        <br />
        <PesquisaCandidatos onSearch={handlePesquisar} />
        <div className="alert alert-success" style={{ display: mensagemExclusao ? 'block' : 'none' }}>
          {mensagemExclusao}
        </div>
        <div className="alert alert-success" style={{ display: mensagemEdicao ? 'block' : 'none' }}>
          {mensagemEdicao}
        </div>
        <table className="table table-bordered text-center">
          <thead className="table-dark">
            <tr>
              <th scope="col">CPF</th>
              <th scope="col">Nome</th>
              <th scope="col">Email</th>
              <th scope="col">Endereço</th>
              <th scope="col">Ações</th>
            </tr>
          </thead>
          <tbody>
            {candidatos.map(candidato => (
              <tr key={candidato.cpf}>
                <td>{editandoCandidato === candidato.cpf ? (
                  <input type="text" value={candidato.cpf} onChange={(e) => setCandidatos(prevState => prevState.map(item => item.cpf === candidato.cpf ? { ...item, cpf: e.target.value } : item))} />
                ) : formatarCPF(candidato.cpf)}</td>
                <td>{editandoCandidato === candidato.cpf ? (
                  <input type="text" value={candidato.nome} onChange={(e) => setCandidatos(prevState => prevState.map(item => item.cpf === candidato.cpf ? { ...item, nome: e.target.value } : item))} />
                ) : candidato.nome}</td>
                <td>{editandoCandidato === candidato.cpf ? (
                  <input type="text" value={candidato.email} onChange={(e) => setCandidatos(prevState => prevState.map(item => item.cpf === candidato.cpf ? { ...item, email: e.target.value } : item))} />
                ) : candidato.email}</td>
                <td>{editandoCandidato === candidato.cpf ? (
                  <input type="text" value={candidato.endereco} onChange={(e) => setCandidatos(prevState => prevState.map(item => item.cpf === candidato.cpf ? { ...item, endereco: e.target.value } : item))} />
                ) : candidato.endereco}</td>
                <td>
                  {editandoCandidato === candidato.cpf ? (
                    <>
                      <button onClick={() => handleSalvarEdicao(candidato.cpf, candidato)} className="btn btn-success mr-2">Salvar</button>
                      <button onClick={() => setEditandoCandidato(null)} className="btn btn-secondary">Cancelar</button>
                    </>
                  ) : (
                    <button onClick={() => handleEditarCandidato(candidato.cpf)} className="btn btn-primary mr-2">Editar</button>
                  )}
                  <button onClick={() => handleExcluirCandidato(candidato.cpf)} className="btn btn-danger">Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TabelaCandidatos;
