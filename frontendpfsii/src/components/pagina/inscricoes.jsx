import React from 'react';
import FormInscricao from '../formulario/formInscricao'; // Importe o componente de formulário de inscrição
import TabelaInscricoes from '../tabela/tabelaInscricao'; // Importe o componente de tabela de inscrições

function Inscricao() {


  return (
    <div>
      <FormInscricao />
      <hr />
   
      <br />
      <TabelaInscricoes  />
    </div>
  );
}

export default Inscricao;
