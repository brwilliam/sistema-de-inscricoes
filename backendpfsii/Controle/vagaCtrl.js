import Vaga from "../Modelo/vaga.js";

export default class VagaCtrl {
  async gravar(requisicao, resposta) {
    resposta.type("application/json");
    if (requisicao.method === "POST" && requisicao.is("application/json")) {
      const dados = requisicao.body;
      const { cargo, salario, quantidade } = dados;

      if (cargo && salario && quantidade) {
        const vaga = new Vaga(null, cargo, salario, quantidade);

        try {
          await vaga.gravar();
          resposta.status(200).json({
            status: true,
            mensagem: "Vaga incluída com sucesso!",
          });
        } catch (erro) {
          resposta.status(500).json({
            status: false,
            mensagem: "Erro ao registrar a vaga: " + erro.message,
          });
        }
      } else {
        resposta.status(400).json({
          status: false,
          mensagem:
            "Por favor, informe todos os dados da vaga conforme a documentação da API!",
        });
      }
    } else {
      resposta.status(400).json({
        status: false,
        mensagem:
          "Por favor, utilize o método POST para cadastrar uma vaga!",
      });
    }
  }

  async atualizar(requisicao, resposta) {
    resposta.type("application/json");
    if (
      (requisicao.method === "PUT" || requisicao.method === "PATCH") &&
      requisicao.is("application/json")
    ) {
      const dados = requisicao.body;
      const { id, cargo, salario, quantidade } = dados;

      if (id && cargo && salario && quantidade) {
        const vaga = new Vaga(id, cargo, salario, quantidade);

        try {
          await vaga.atualizar();
          resposta.status(200).json({
            status: true,
            mensagem: "Vaga atualizada com sucesso!",
          });
        } catch (erro) {
          resposta.status(500).json({
            status: false,
            mensagem: "Erro ao atualizar a vaga: " + erro.message,
          });
        }
      } else {
        resposta.status(400).json({
          status: false,
          mensagem:
            "Por favor, informe todos os dados da vaga conforme a documentação da API!",
        });
      }
    } else {
      resposta.status(400).json({
        status: false,
        mensagem:
          "Por favor, utilize os métodos PUT ou PATCH para atualizar uma vaga!",
      });
    }
  }

  async excluir(requisicao, resposta) {
    resposta.type("application/json");
    if (requisicao.method === "DELETE" && requisicao.is("application/json")) {
      const dados = requisicao.body;
      const id = dados.id;

      if (id) {
        const vaga = new Vaga(id);

        try {
          await vaga.excluir();
          resposta.status(200).json({
            status: true,
            mensagem: "Vaga excluída com sucesso!",
          });
        } catch (erro) {
          resposta.status(500).json({
            status: false,
            mensagem: "Erro ao excluir a vaga: " + erro.message,
          });
        }
      } else {
        resposta.status(400).json({
          status: false,
          mensagem: "Por favor, informe o ID da vaga!",
        });
      }
    } else {
      resposta.status(400).json({
        status: false,
        mensagem:
          "Por favor, utilize o método DELETE para excluir uma vaga!",
      });
    }
  }

  async consultar(requisicao, resposta) {
    resposta.type("application/json");
    let termo = requisicao.params.termo;
    if (!termo) {
      termo = "";
    }
    if (requisicao.method === "GET") {
      const vaga = new Vaga();
      try {
        const listaVagas = await vaga.consultar(termo);
        resposta.json({
          status: true,
          listaVagas,
        });
      } catch (erro) {
        resposta.json({
          status: false,
          mensagem: "Não foi possível obter as vagas: " + erro.message,
        });
      }
    } else {
      resposta.status(400).json({
        status: false,
        mensagem:
          "Por favor, utilize o método GET para consultar vagas!",
      });
    }
  };
  async consultarPorId(requisicao, resposta) {
    resposta.type("application/json");
    let id = requisicao.params.id;
  
    if (!id) {
      resposta.status(400).json({
        status: false,
        mensagem: "Por favor, forneça um ID válido para a consulta!",
      });
      return;
    }
  
    const vaga = new Vaga();
    try {
      const listaVagas = await vaga.consultarPorId(id);
      resposta.json({
        status: true,
        listaVagas,
      });
    } catch (erro) {
      resposta.json({
        status: false,
        mensagem: "Não foi possível obter as vagas: " + erro.message,
      });
    }
  }
  
  
}
