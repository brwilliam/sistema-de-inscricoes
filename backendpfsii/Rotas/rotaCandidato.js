import { Router } from "express";
import CandidatoCtrl from "../Controle/candidatoCtrl.js";

const candidatoCtrl = new CandidatoCtrl();
const rotaCandidato = new Router();

rotaCandidato
  .get("/", candidatoCtrl.consultar)
  .get("/:termo", candidatoCtrl.consultar)
  .post("/", candidatoCtrl.gravar)
  .patch("/", candidatoCtrl.atualizar) 
  .put("/", candidatoCtrl.atualizar)
  .delete("/", candidatoCtrl.excluir);

export default rotaCandidato;
