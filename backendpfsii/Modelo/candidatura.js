import CandidaturaDAO from "../Persistencia/candidaturaDAO.js";

export default class Candidatura {
  #id;
  #candidato;
  #data;
  #vagas;

  constructor(id, candidato, data, vagas) {
    this.#id = id;
    this.#candidato = candidato;
    this.#data = data;
    this.#vagas = vagas;
  }

  get id() {
    return this.#id;
  }

  set id(novoId) {
    this.#id = novoId;
  }

  get candidato() {
    return this.#candidato;
  }

  set candidato(novoCCandidato) {
    this.#candidato = novoCCandidato;
  }

  get data() {
    return this.#data;
  }

  set data(novadata) {
    this.#data = novadata;
  }


  get vagas() {
    return this.#vagas;
  }

  set vagas(novaVagas) {
    this.#vagas = novaVagas;
  }

  toJSON() {
    return {
      id: this.#id,
      candidato: this.#candidato,
      data: this.#data,
      vagas: this.#vagas
    };
  }

  async gravar() {
    const candidaturaDAO = new CandidaturaDAO();

    try {
      await candidaturaDAO.gravar(this);
    } catch (error) {
      throw new Error("Erro ao gravar a candidatura: " + error.message);
    }
  }



  async consultarPorId(parametro) {
    const candidaturaDAO = new CandidaturaDAO();
    return await candidaturaDAO.consultarCandidaturaPorId(parametro);
  }

  async listarTodasCandidaturas() {
    const candidaturaDAO = new CandidaturaDAO();
    return await candidaturaDAO.listarTodasCandidaturas();
  }

 
  
 
}
