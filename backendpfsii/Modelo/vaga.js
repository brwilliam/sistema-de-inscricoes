import VagaDAO from "../Persistencia/vagaDAO.js";

export default class Vaga {
  // Definição dos atributos privados
  #id;
  #cargo;
  #salario;
  #quantidade;

  constructor(id = 0, cargo = "", salario = 0, quantidade = 0) {
    this.#id = id;
    this.#cargo = cargo;
    this.#salario = salario;
    this.#quantidade = quantidade;
  }

  // Métodos de acesso públicos
  get id() {
    return this.#id;
  }

  set id(novoId) {
    this.#id = novoId;
  }

  get cargo() {
    return this.#cargo;
  }

  set cargo(novoCargo) {
    this.#cargo = novoCargo;
  }

  get salario() {
    return this.#salario;
  }

  set salario(novoSalario) {
    this.#salario = novoSalario;
  }

  get quantidade() {
    return this.#quantidade;
  }

  set quantidade(novaQuantidade) {
    this.#quantidade = novaQuantidade;
  }

  // Método para converter o objeto Vaga em JSON
  toJSON() {
    return {
      id: this.#id,
      cargo: this.#cargo,
      salario: this.#salario,
      quantidade: this.#quantidade
    };
  }

  // Camada de modelo acessa a camada de persistência
  async gravar() {
    const vagaDAO = new VagaDAO();
    await vagaDAO.gravar(this);
  }

  async excluir() {
    const vagaDAO = new VagaDAO();
    await vagaDAO.excluir(this);
  }

  async atualizar() {
    const vagaDAO = new VagaDAO();
    await vagaDAO.atualizar(this);
  }

  async consultar(parametro) {
    const vagaDAO = new VagaDAO();
    return await vagaDAO.consultar(parametro);
  }
  
}
