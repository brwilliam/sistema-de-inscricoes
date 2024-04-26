import { Router } from "express";
import CandidaturaCtrl from "../Controle/candidaturaCtrl.js";

const candidaturaCtrl = new CandidaturaCtrl();
const rotaCandidatura = new Router();

rotaCandidatura
  .get("/id/:termo", candidaturaCtrl.consultarPorId) // Consulta candidatura por ID
  .get("/", candidaturaCtrl.listarTodasCandidaturas) // Consulta candidatura por ID

  .post("/", candidaturaCtrl.gravar);

export default rotaCandidatura;
