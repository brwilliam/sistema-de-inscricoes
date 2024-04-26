import Candidato from "../Modelo/candidato.js";

export default class CandidatoCtrl {
  async gravar(requisicao, resposta) {
    resposta.type("application/json");
    if (requisicao.method === "POST" && requisicao.is("application/json")) {
      const dados = requisicao.body;
      const { cpf, nome, email, endereco } = dados;

      if (cpf && nome && email && endereco) {
        const candidato = new Candidato(cpf, nome, email, endereco);

        try {
          await candidato.gravar();
          resposta.status(200).json({
            status: true,
            mensagem: "Candidato incluído com sucesso!",
          });
        } catch (erro) {
          resposta.status(500).json({
            status: false,
            mensagem: "Erro ao registrar o candidato: " + erro.message,
          });
        }
      } else {
        resposta.status(400).json({
          status: false,
          mensagem:
            "Por favor, informe todos os dados do candidato conforme a documentação da API!",
        });
      }
    } else {
      resposta.status(400).json({
        status: false,
        mensagem:
          "Por favor, utilize o método POST para cadastrar um candidato!",
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
      const { cpf, nome, email, endereco } = dados;

      if (cpf && nome && email && endereco) {
        const candidato = new Candidato(cpf, nome, email, endereco);

        try {
          await candidato.atualizar();
          resposta.status(200).json({
            status: true,
            mensagem: "Candidato atualizado com sucesso!",
          });
        } catch (erro) {
          resposta.status(500).json({
            status: false,
            mensagem: "Erro ao atualizar o candidato: " + erro.message,
          });
        }
      } else {
        resposta.status(400).json({
          status: false,
          mensagem:
            "Por favor, informe todos os dados do candidato conforme a documentação da API!",
        });
      }
    } else {
      resposta.status(400).json({
        status: false,
        mensagem:
          "Por favor, utilize os métodos PUT ou PATCH para atualizar um candidato!",
      });
    }
  }

  async excluir(requisicao, resposta) {
    resposta.type("application/json");
    if (requisicao.method === "DELETE" && requisicao.is("application/json")) {
      const dados = requisicao.body;
      const cpf = dados.cpf;

      if (cpf) {
        const candidato = new Candidato(cpf);

        try {
          await candidato.excluir();
          resposta.status(200).json({
            status: true,
            mensagem: "Candidato excluído com sucesso!",
          });
        } catch (erro) {
          resposta.status(500).json({
            status: false,
            mensagem: "Erro ao excluir o candidato: " + erro.message,
          });
        }
      } else {
        resposta.status(400).json({
          status: false,
          mensagem: "Por favor, informe o CPF do candidato!",
        });
      }
    } else {
      resposta.status(400).json({
        status: false,
        mensagem:
          "Por favor, utilize o método DELETE para excluir um candidato!",
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
      const candidato = new Candidato();
      try {
        const listaCandidatos = await candidato.consultar(termo);
        resposta.json({
          status: true,
          listaCandidatos,
        });
      } catch (erro) {
        resposta.json({
          status: false,
          mensagem: "Não foi possível obter os candidatos: " + erro.message,
        });
      }
    } else {
      resposta.status(400).json({
        status: false,
        mensagem:
          "Por favor, utilize o método GET para consultar candidatos!",
      });
    }
  }

  

  
}





  
  




  
  

