import React, { useState } from 'react';
import axios from 'axios';

function FormCandidato() {
  const [cpf, setCpf] = useState('');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [endereco, setEndereco] = useState('');
  const [mensagemCadastro, setMensagemCadastro] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Enviar os dados do candidato para o backend
      const response = await axios.post('http://localhost:4000/candidatos', {
        cpf: cpf.replace(/\D/g, ''), // Remover não números do CPF antes de enviar
        nome,
        email,
        endereco,
      });
      console.log('Resposta do backend:', response.data);
      // Limpar os campos após o envio bem-sucedido
      setCpf('');
      setNome('');
      setEmail('');
      setEndereco('');
      // Exibir mensagem de sucesso
      setMensagemCadastro('Candidato cadastrado com sucesso');
      // Recarregar a página após 1 segundo
      setTimeout(() => {
        setMensagemCadastro('');
      }, 1000);
    } catch (error) {
      console.error('Erro ao gravar candidato:', error);
    }
  };

  const handleNomeChange = (e) => {
    const inputNome = e.target.value;
    // Remover números do nome utilizando uma expressão regular
    const nomeSemNumeros = inputNome.replace(/[0-9]/g, '');
    setNome(nomeSemNumeros);
  };

  const handleCPFChange = (e) => {
    const inputCPF = e.target.value;
    // Aplicar máscara de CPF
    const cpfFormatado = inputCPF
      .replace(/\D/g, '') // Remove caracteres não numéricos
      .replace(/(\d{3})(\d)/, '$1.$2') // Adiciona ponto após os 3 primeiros dígitos
      .replace(/(\d{3})(\d)/, '$1.$2') // Adiciona ponto após os 3 próximos dígitos
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // Adiciona hífen antes dos últimos 2 dígitos
    setCpf(cpfFormatado); // Mantém o CPF formatado apenas para exibição
  };

  return (
    <div className="container">
      <h2 className="text-center mb-4">Cadastrar Candidato</h2>
      <form onSubmit={handleSubmit} className="w-50 mx-auto">
        <div className="row mb-3">
          <div className="col-6">
            <label htmlFor="cpf" className="form-label">CPF</label>
            <input
              type="text"
              className="form-control"
              id="cpf"
              value={cpf}
              onChange={handleCPFChange}
              maxLength={14} // Limita o tamanho máximo do campo para o formato do CPF
            />
          </div>
          <div className="col-6">
            <label htmlFor="nome" className="form-label">Nome</label>
            <input
              type="text"
              className="form-control"
              id="nome"
              value={nome}
              onChange={handleNomeChange}
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-6">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="col-6">
            <label htmlFor="endereco" className="form-label">Endereço</label>
            <input
              type="text"
              className="form-control"
              id="endereco"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col">
            <button type="submit" className="btn btn-success">Cadastrar</button>
            {mensagemCadastro && (
              <div className="alert alert-success mt-3" role="alert">
                {mensagemCadastro}
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

export default FormCandidato;
