import Candidato from "../Modelo/candidato.js";
import Vaga from "../Modelo/vaga.js";
import Candidatura from "../Modelo/candidatura.js";
import CandidaturaVaga from "../Modelo/candidaturaVaga.js";

import CandidaturaDAO from "../Persistencia/candidaturaDAO.js";

export default class CandidaturaCtrl {
  async gravar(requisicao, resposta) {
    resposta.type("application/json");
    if (requisicao.method === "POST" && requisicao.is("application/json")) {
        const dados = requisicao.body;
        //extraindo dados de um novo candidato
        const candidato = dados.candidato;
        const dataCandidatura = dados.dataCandidatura /*new Date(dados.dataCandidatura)*/;
        const candidaturaVaga = dados.vagas;
          //instanciando um objeto do tipo Candidato
        const objCandidato = new Candidato(candidato.cpf);
        let vagas = [];
        for (const vagaSelecionada of candidaturaVaga) {
            const vaga = new Vaga(vagaSelecionada.id);
            const objVaga = new CandidaturaVaga(vaga);
            vagas.push(objVaga);
        }
        const candidatura = new Candidatura(
            0,
            objCandidato,
            dataCandidatura,
            vagas
        );
        candidatura
            .gravar()
            .then(() => {
                resposta.status(200).json({
                    status: true,
                    mensagem: "Candidatura cadastrada com sucesso!",
                    codigo: candidatura.id,
                });
            })
            .catch((erro) => {
                resposta.status(500).json({
                    status: false,
                    mensagem: "Erro ao cadastrar a candidatura: " + erro.message,
                });
            });
    } else {
        resposta.status(400).json({
            status: false,
            mensagem: "Requisição inválida!",
        });
    }
}


consultarPorId(requisicao, resposta) {
    resposta.type("application/json");
    if (requisicao.method === "GET") {
      //tentar obter o código do pedido a partir dos parâmetros da URL
      let termo = requisicao.params.termo;
      if (!isNaN(termo)) {
        const candidatura = new Candidatura(0);
        candidatura
          .consultarPorId(termo)
          .then((listaCandidaturas) => {
            resposta.status(200).json({
              status: true,
              listaCandidaturas: listaCandidaturas,
            });
          })
          .catch((erro) => {
            resposta.status(500).json({
              status: false,
              mensagem: "Erro ao consultar as candidaturas: " + erro.message,
            });
          });
      } else {
        resposta.status(400).json({
          status: false,
          mensagem: "Por favor, informe um códido de candidatura válida!",
        });
      }
    } else {
      resposta.status(400).json({
        status: false,
        mensagem: "Requisição inválida!",
      });
    }
  } 

  listarTodasCandidaturas(requisicao, resposta) {
    resposta.type("application/json");
    if (requisicao.method === "GET") {

        const candidaturaDAO = new CandidaturaDAO();
        candidaturaDAO.listarTodasCandidaturas()
            .then((listaCandidaturas) => {
                if (listaCandidaturas.length > 0) {
                    resposta.status(200).json({
                        status: true,
                        listaCandidaturas: listaCandidaturas,
                    });
                } else {
                    resposta.status(404).json({
                        status: false,
                        mensagem: "Nenhuma candidatura encontrada.",
                    });
                }
            })
            .catch((erro) => {
                resposta.status(500).json({
                    status: false,
                    mensagem: "Erro ao consultar as candidaturas: " + erro.message,
                });
            });
    } else {
        resposta.status(400).json({
            status: false,
            mensagem: "Requisição inválida!",
        });
    }
}


 
  

  
}
