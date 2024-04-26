import React from "react";
import FormCandidato from "../formulario/formCandidato";
import TabelaCandidatos from "../tabela/tabelaCandidato";

function Candidato() {
  return (
    <div>
      <br />
      <FormCandidato />
      <hr />

      <br />
      <TabelaCandidatos />
    </div>
  );
}

export default Candidato;
