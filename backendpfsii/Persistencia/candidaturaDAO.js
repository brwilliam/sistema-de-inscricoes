import Vaga from "../Modelo/vaga.js";
import Candidatura from "../Modelo/candidatura.js";
import Candidato from "../Modelo/candidato.js";
import conectar from "./conexao.js";

export default class CandidaturaVagaDAO {
    async gravar(candidatura) {
        // Verifica se o objeto fornecido é uma instância de Candidatura
        if (candidatura instanceof Candidatura) {
            const conexao = await conectar(); // Estabelece a conexão com o banco de dados
    
            // Garante a transação das operações para que seja realizada de forma atômica
            await conexao.beginTransaction();
    
            try {
                // Insere na tabela Candidatura
                const sql = 'INSERT INTO candidatura(cpf, data_inscricao) VALUES (?, STR_TO_DATE(?, "%Y-%m-%d"))';
                const parametros = [candidatura.candidato.cpf, candidatura.data];
                const retorno = await conexao.execute(sql, parametros);
                candidatura.id = retorno[0].insertId;
    
                // Insere na tabela Candidatura_Vaga para cada vaga associada à candidatura
                const sql2 = 'INSERT INTO candidatura_vaga(id_Candidatura, id_Vaga) VALUES (?, ?)';
                for (const vaga of candidatura.vagas) {
                    const parametros2 = [candidatura.id, vaga.vaga.id];
                    await conexao.execute(sql2, parametros2);
                }
    
                await conexao.commit(); // Se chegou até aqui sem erros, confirma as inclusões
            } catch (error) {
                await conexao.rollback(); // Volta o banco de dados ao estado anterior em caso de erro
                throw error; // Lança o erro para ser tratado no nível superior
            }
        }
    }
    


async consultarCandidaturaPorId(termoBusca) {
  const listaCandidaturas = [];
  if (!isNaN(termoBusca)) { // Verifica se o termo de busca é um número
      const conexao = await conectar(); // Estabelece a conexão com o banco de dados
      const sql = `SELECT candidatura.id, candidatura.cpf, DATE_FORMAT(candidatura.data_inscricao, '%Y-%m-%d') AS data_inscricao,
                  candidato.nome, candidato.email, candidato.endereco,
                  vaga.id AS id_vaga, vaga.cargo, vaga.salario, vaga.quantidade
                  FROM Candidatura AS candidatura
                  INNER JOIN Candidatura_Vaga AS cv ON candidatura.id = cv.id_Candidatura
                  INNER JOIN Vaga AS vaga ON cv.id_Vaga = vaga.id
                  INNER JOIN Candidato AS candidato ON candidatura.cpf = candidato.cpf
                  WHERE candidatura.id = ?`;
      const [registros, campos] = await conexao.execute(sql, [termoBusca]);

      if (registros.length > 0) {
          const candidato = new Candidato(registros[0].cpf, registros[0].nome, registros[0].email, registros[0].endereco);
          const vagas = registros.map(registro => new Vaga(registro.id_vaga, registro.cargo, registro.salario, registro.quantidade));
          const candidatura = new Candidatura(registros[0].id, candidato, registros[0].data_inscricao, vagas);
          listaCandidaturas.push(candidatura);
      }
  }
  return listaCandidaturas;
}



  async  listarTodasCandidaturas() {
    const listaCandidaturas = [];
    const conexao = await conectar(); // Estabelece a conexão com o banco de dados
    const sql = `
      SELECT 
        candidatura.cpf,
        candidato.nome,
        candidato.email,
        candidato.endereco,
        vaga.id AS id_vaga,
        vaga.cargo,
        vaga.salario
      FROM 
        Candidatura AS candidatura
      INNER JOIN 
        Candidatura_Vaga AS cv ON candidatura.id = cv.id_Candidatura
      INNER JOIN 
        Vaga AS vaga ON cv.id_Vaga = vaga.id
      INNER JOIN 
        Candidato AS candidato ON candidatura.cpf = candidato.cpf;
    `;

    const [registros] = await conexao.execute(sql);

    // Estrutura para armazenar temporariamente os candidatos e suas vagas
    const candidatosMap = new Map();

    registros.forEach(registro => {
      // Se o candidato já foi adicionado, apenas acrescenta a vaga à sua lista
      if (candidatosMap.has(registro.cpf)) {
        candidatosMap.get(registro.cpf).vagas.push({
          id_vaga: registro.id_vaga,
          cargo: registro.cargo,
          salario: registro.salario
        });
      } else {
        // Se é a primeira vez que encontramos o candidato, cria um novo objeto para ele
        candidatosMap.set(registro.cpf, {
          cpf: registro.cpf,
          nome: registro.nome,
          email: registro.email,
          endereco: registro.endereco,
          vagas: [{
            id_vaga: registro.id_vaga,
            cargo: registro.cargo,
            salario: registro.salario
          }]
        });
      }
    });

    // Converte o Map em um array de objetos para retorno
    return Array.from(candidatosMap.values());
}


  
}


  









 
