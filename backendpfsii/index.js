import express from "express";
import cors from "cors";
import rotaCandidato from "./Rotas/rotaCandidato.js";
import rotaVagas from "./Rotas/rotaVaga.js";
import rotaCandidatura from "./Rotas/rotaCandidatura.js";

const host = "0.0.0.0";
const porta = "4000";


const app = express();


app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/candidatos",rotaCandidato); // Use a rota do pedido
app.use("/vagas",rotaVagas); // Use a rota do pedido
app.use("/inscricoes",rotaCandidatura); // Use a rota do pedido

app.listen(porta, host, () => {
  console.log(`Servidor escutando na porta ${host}:${porta}.`);
});
