import React, { useState } from 'react';
import InputMask from 'react-input-mask';
import axios from 'axios';

function FormVaga() {
  const [cargo, setCargo] = useState('');
  const [salario, setSalario] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [mensagemCadastro, setMensagemCadastro] = useState('');
  const [validated, setValidated] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
    } else {
      try {
        // Envio dos dados da vaga para o backend
        const response = await axios.post('http://localhost:4000/vagas', {
          cargo,
          salario,
          quantidade
        });
        console.log('Resposta do backend:', response.data);
        // Limpar os campos após o envio bem-sucedido
        setCargo('');
        setSalario('');
        setQuantidade('');
        // Exibir mensagem de sucesso
        setMensagemCadastro('Vaga cadastrada com sucesso');
        // Recarregar a página após 1 segundo
        setTimeout(() => {
          window.location.reload(); // Atualiza a página
        }, 1000);
      } catch (error) {
        console.error('Erro ao gravar vaga:', error);
      }
    }

    setValidated(true);
  };

  const handleCargoChange = (e) => {
    const value = e.target.value.replace(/[0-9]/g, '');
    setCargo(value);
  };

  const handleQuantidadeChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setQuantidade(value);
  };

  return (
    <div className="container">
      <h2 className="text-center mb-4">Cadastrar Vaga</h2>
      <div className="row justify-content-center">
        <form onSubmit={handleSubmit} className="col-6 needs-validation" noValidate validated={validated}>
          <div className="mb-3">
            <label htmlFor="cargo" className="form-label">Cargo</label>
            <input type="text" className="form-control" id="cargo" value={cargo} onChange={handleCargoChange} required />
            <div className="invalid-feedback">
              Por favor, preencha o cargo.
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="salario" className="form-label">Salário</label>
            <div className="input-group">
              <span className="input-group-text">R$</span>
              <InputMask mask="99999.99" maskChar={null} className="form-control" id="salario" value={salario} onChange={(e) => setSalario(e.target.value)} required />
              <div className="invalid-feedback">
                Por favor, preencha o salário.
              </div>
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="quantidade" className="form-label">Quantidade</label>
            <input type="text" className="form-control" id="quantidade" value={quantidade} onChange={handleQuantidadeChange} required />
            <div className="invalid-feedback">
              Por favor, preencha a quantidade.
            </div>
          </div>
          <button type="submit" className="btn btn-success">Cadastrar</button>
          {mensagemCadastro && (
            <div className="alert alert-success mt-3" role="alert">
              {mensagemCadastro}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default FormVaga;
