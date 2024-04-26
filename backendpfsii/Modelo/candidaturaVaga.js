export default class CandidaturaVaga {
    #vaga;
  
    constructor(vaga) {
    
      this.#vaga = vaga;
    }
  
    toJSON() {
      return {
        vaga: this.#vaga
      };
    }
    get vaga() {
      return this.#vaga;
    }
  
    set vaga(novoVaga) {
      this.#vaga = novoVaga;
    }

}