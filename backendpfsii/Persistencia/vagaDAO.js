import Vaga from "../Modelo/vaga.js";
import conectar from "./conexao.js";

export default class VagaDAO {
  async gravar(vaga) {
    if (vaga instanceof Vaga) {
      const sql =
        "INSERT INTO Vaga (cargo, salario, quantidade) VALUES (?, ?, ?)";
      const parametros = [
        vaga.cargo,
        vaga.salario,
        vaga.quantidade,
      ];
      const conexao = await conectar();
      const retorno = await conexao.execute(sql, parametros);
      global.poolConexoes.releaseConnection(conexao);
      return retorno;
    }
  }

  async atualizar(vaga) {
    if (vaga instanceof Vaga) {
      const sql =
        "UPDATE Vaga SET cargo = ?, salario = ?, quantidade = ? WHERE id = ?";
      const parametros = [
        vaga.cargo,
        vaga.salario,
        vaga.quantidade,
        vaga.id,
      ];
      const conexao = await conectar();
      const retorno = await conexao.execute(sql, parametros);
      global.poolConexoes.releaseConnection(conexao);
      return retorno;
    }
  }

  async excluir(vaga) {
    if (vaga instanceof Vaga) {
      const sql = "DELETE FROM Vaga WHERE id = ?";
      const parametros = [vaga.id];
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
      // Consultar pelo ID da vaga
      sql = "SELECT * FROM Vaga WHERE id = ?";
      parametros = [parametroConsulta];
    } else {
      // Consultar pelo cargo da vaga
      if (!parametroConsulta) {
        parametroConsulta = "";
      }
      sql = "SELECT * FROM Vaga WHERE cargo LIKE ?";
      parametros = ["%" + parametroConsulta + "%"];
    }

    const conexao = await conectar();
    const [registros] = await conexao.execute(sql, parametros);
    const listaVagas = [];

    for (const registro of registros) {
      const vaga = new Vaga(
        registro.id,
        registro.cargo,
        registro.salario,
        registro.quantidade
      );
      listaVagas.push(vaga);
    }

    global.poolConexoes.releaseConnection(conexao);
    return listaVagas;
  };

  
  
}
