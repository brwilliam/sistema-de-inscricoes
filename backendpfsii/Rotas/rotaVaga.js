import { Router } from "express";
import VagaCtrl from "../Controle/vagaCtrl.js";

const vagaCtrl = new VagaCtrl();
const rotaVaga = new Router();

rotaVaga
  .get("/", vagaCtrl.consultar) // Consulta todas as vagas
  .get("/:termo", vagaCtrl.consultar) // Consulta todas as vagas
  // .get("/:id", vagaCtrl.consultarPorId) // Consulta uma vaga específica por ID
  .post("/", vagaCtrl.gravar) // Cria uma nova vaga
  .delete("/", vagaCtrl.excluir) // Exclusão de uma vaga por ID
  .patch("/", vagaCtrl.atualizar) // Atualização parcial de uma vaga por ID
  .put("/", vagaCtrl.atualizar) // Atualização total de uma vaga por ID

export default rotaVaga;
