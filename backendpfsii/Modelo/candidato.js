import CandidatoDAO from "../Persistencia/candidatoDAO.js";

export default class Candidato {
  // Definição dos atributos privados
  #cpf;
  #nome;
  #email;
  #endereco;

  constructor(cpf = "", nome = "", email = "", endereco = "") {
    this.#cpf = cpf;
    this.#nome = nome;
    this.#email = email;
    this.#endereco = endereco;
  }

  // Métodos de acesso públicos
  get cpf() {
    return this.#cpf;
  }

  set cpf(novoCPF) {
    this.#cpf = novoCPF;
  }

  get nome() {
    return this.#nome;
  }

  set nome(novoNome) {
    this.#nome = novoNome;
  }

  get email() {
    return this.#email;
  }

  set email(novoEmail) {
    this.#email = novoEmail;
  }

  get endereco() {
    return this.#endereco;
  }

  set endereco(novoEndereco) {
    this.#endereco = novoEndereco;
  }

  // Método para converter o objeto Candidato em JSON
  toJSON() {
    return {
      cpf: this.#cpf,
      nome: this.#nome,
      email: this.#email,
      endereco: this.#endereco
    };
  }

  // Camada de modelo acessa a camada de persistência
  async gravar() {
    const candidatoDAO = new CandidatoDAO();
    await candidatoDAO.gravar(this);
  }

  async excluir() {
    const candidatoDAO = new CandidatoDAO();
    await candidatoDAO.excluir(this);
  }

  async atualizar() {
    const candidatoDAO = new CandidatoDAO();
    await candidatoDAO.atualizar(this);
  }

  async consultar(parametro) {
    const candidatoDAO = new CandidatoDAO();
    return await candidatoDAO.consultar(parametro);
  }

  
}
