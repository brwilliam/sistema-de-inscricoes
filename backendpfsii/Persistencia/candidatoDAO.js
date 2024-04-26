import Candidato from "../Modelo/candidato.js";
import conectar from "./conexao.js";

export default class CandidatoDAO {
  async gravar(candidato) {
    if (candidato instanceof Candidato) {
      const sql =
        "INSERT INTO Candidato (cpf, nome, email, endereco) VALUES (?, ?, ?, ?)";
      const parametros = [
        candidato.cpf,
        candidato.nome,
        candidato.email,
        candidato.endereco,
      ];
      const conexao = await conectar();
      const retorno = await conexao.execute(sql, parametros);
      global.poolConexoes.releaseConnection(conexao);
      return retorno;
    }
  }

  async atualizar(candidato) {
    if (candidato instanceof Candidato) {
      const sql =
        "UPDATE Candidato SET nome = ?, email = ?, endereco = ? WHERE cpf = ?";
      const parametros = [
        candidato.nome,
        candidato.email,
        candidato.endereco,
        candidato.cpf,
      ];
      const conexao = await conectar();
      const retorno = await conexao.execute(sql, parametros);
      global.poolConexoes.releaseConnection(conexao);
      return retorno;
    }
  }
  

  async excluir(candidato) {
    if (candidato instanceof Candidato) {
      const sql = "DELETE FROM Candidato WHERE cpf = ?";
      const parametros = [candidato.cpf];
      const conexao = await conectar();
      const retorno = await conexao.execute(sql, parametros);
      global.poolConexoes.releaseConnection(conexao);
      return retorno;
    }
  }

  async consultar(parametroConsulta) {
    let sql = "";
    let parametros = [];

    if (!isNaN(parseInt(parametroConsulta))) {
      // Consultar pelo CPF do candidato
      sql = "SELECT * FROM Candidato WHERE cpf = ?";
      parametros = [parametroConsulta];
    } else {
      // Consultar pelo nome do candidato
      if (!parametroConsulta) {
        parametroConsulta = "";
      }
      sql = "SELECT * FROM Candidato WHERE nome LIKE ?";
      parametros = ["%" + parametroConsulta + "%"];
    }

    const conexao = await conectar();
    const [registros] = await conexao.execute(sql, parametros);
    const listaCandidatos = [];

    for (const registro of registros) {
      const candidato = new Candidato(
        registro.cpf,
        registro.nome,
        registro.email,
        registro.endereco
      );
      listaCandidatos.push(candidato);
    }

    global.poolConexoes.releaseConnection(conexao);
    return listaCandidatos;
  }

 
  
}
