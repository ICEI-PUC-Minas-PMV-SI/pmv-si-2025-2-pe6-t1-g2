import AreasModule from '../cadast/areas.js';
import DisponibilidadeModule from "../cadast/disponibilidade.js";
import { API_SABERMAIS_URL } from "../config/apiConfig.js";
import { loadUserProfile } from "../config/loadUser.js";

await loadUserProfile();

export async function carregarPerfilProfessor(professor) {
  const token = localStorage.getItem("jwtToken");

  const professorId = professor.id;
  const areasModule = AreasModule({
    inputSel: '#areaInput',
    addBtnSel: '#addAreaBtn',
    suggestionsSel: '#suggestions',
    tagListSel: '#tagList',
    mockAreas: []
  });

  try {
    // Busca os dados do professor
    const response = await fetch(`${API_SABERMAIS_URL}/Professores/${professor.id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar dados do professor: ${response.status}`);
    }

    const professorDados = await response.json();
    console.log("Dados do professor:", professorDados);

    // Preenche os campos do frontend
    document.getElementById('nome').value = professorDados.nome || "";
    document.getElementById('email').value = professorDados.email || "";
    document.getElementById('senha').value = professorDados.password || "";
    document.getElementById('cpf').value = professorDados.cpf || "";
    document.getElementById('tipo').value = professorDados.tipo === 1 ? "Professor/Instrutor" : "Aluno";
    document.getElementById('descricao').value = professorDados.descricao || "";
    document.getElementById('certificacoes').value = professorDados.certificacoes ? professorDados.certificacoes.join(", ") : "";
    document.getElementById('competencias').value = professorDados.competencias ? professorDados.competencias.join(", ") : "";
    document.getElementById('valorHora').value = professorDados.valorHora || "";

    const areasRegistradas = professorDados.areas;
    console.log("areas do prof: ", areasRegistradas);
    retornaAreaProf(areasRegistradas);
    retornaHorariosProf(professorDados.disponibilidades);

    //await carregarAreasSelecionaveis(professorDados.areas || []);
    // areas.setSelectedAreas(area);
    // dispo.setDisponibilidade(hor);

    // Configura o botão de salvar
    const saveBtn = document.getElementById("saveBtn");

    // Remove event listeners antigos (evita duplicação)
    saveBtn.replaceWith(saveBtn.cloneNode(true));
    const newSaveBtn = document.getElementById("saveBtn");

    newSaveBtn.addEventListener('click', async () => {

      const inputSenha = document.getElementById('senha').value;
      if (inputSenha == "") {
        alert("Ops! É necessário informar sua senha para salvar os dados!");
        return;
      }

      const certificacoesArray = document.getElementById("certificacoes").value
        .split(",")               // separa por vírgula
        .map(c => c.trim())       // remove espaços extras
        .filter(c => c !== "");   // remove vazios

      const competenciasArray = document.getElementById('competencias').value
        .split(",")
        .map(c => c.trim())
        .filter(c => c !== "");

      //const areasSelecionadas = getSelectedAreas();

      try {
        const putResponse = await fetch(`${API_SABERMAIS_URL}/Professores/${professor.id}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            id: professor.id,
            nome: document.getElementById("nome").value,
            email: document.getElementById("email").value,
            password: document.getElementById("senha").value,
            cpf: document.getElementById("cpf").value,
            tipo: professor.tipo,
            descricao: document.getElementById("descricao").value,
            certificacoes: certificacoesArray,
            competencias: competenciasArray,
            valorHora: document.getElementById("valorHora").value,

            //Areas: areasSelecionadas,
            //Areas: areas.getSelectedAreas(),
            // Disponibilidade: dispo.getDisponibilidade()
          })
        });

        if (!putResponse.ok) {
          throw new Error(`Erro ao atualizar os dados: ${putResponse.status}`);
        }

        const areas = areasModule.getSelectedAreas();

        // await fetch(`${API_SABERMAIS_URL}/Professores/${professorId}/areas/${}`, {
        //   method: "DELETE",
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // });

        
        alert("Dados atualizados com sucesso!");
        //window.location.reload();

      }
      catch (error) {
        console.error("Erro ao atualizar professor:", error);
        alert("Falha ao salvar alterações. Verifique os dados e tente novamente.");
      }

    });
  }
  catch (error) {
    console.error("Erro ao buscar professor:", error);
    alert("Erro ao buscar informações do professor. Tente novamente.");
  }
}

function retornaAreaProf(areasProf) {
  AreasModule({ inputSel: '#areaInput', addBtnSel: '#addAreaBtn', suggestionsSel: '#suggestionsBox', tagListSel: '#tagList', mockAreas: areasProf });
}

function retornaHorariosProf(horariosProf) {
  console.log(horariosProf);
  DisponibilidadeModule({ rowsSelector: '#rows', addBtnSelector: '#addBtn', clearBtnSelector: '#clearBtn', summarySelector: '#summary', weekDays: horariosProf });
  
}

// async function salvarAreasDoProfessor(idProfessor) {
//   const token = localStorage.getItem("jwtToken");

//   try {
//     for (const area of mockAreas) {
//       await fetch(`${API_SABERMAIS_URL}/Professores/${idProfessor}/areas`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ areaId: area.areaId, professorId:  }),
//       });
//     }
//     console.log("Áreas salvas com sucesso!");
//   } catch (erro) {
//     console.error("Erro ao salvar áreas:", erro);
//   }
// }


// for (const area of areas) {
//           console.log("areaId: ", area.areaId);
//           console.log("professorId: ", professorId);
//           // await fetch(`${API_SABERMAIS_URL}/Professores/${professorId}/areas`, {
//           //   method: "POST",
//           //   headers: {
//           //     "Content-Type": "application/json",
//           //     Authorization: `Bearer ${token}`,
//           //   },
//           //   body: JSON.stringify({
//           //     professorId: professorId,
//           //     areaId: area.areaId
//           //   })
//           // });
//         }


export async function carregarPerfilAluno(aluno) {
  console.log("perfil aluno: ", aluno);
  const token = localStorage.getItem("jwtToken");

  try {
    // Busca os dados do aluno
    const response = await fetch(`${API_SABERMAIS_URL}/Alunos/${aluno.id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar dados do aluno: ${response.status}`);
    }

    const alunoDados = await response.json();
    console.log("Dados do aluno:", alunoDados);

    // Preenche os campos do frontend
    document.getElementById('nome').value = alunoDados.nome || "";
    document.getElementById('email').value = alunoDados.email || "";
    document.getElementById('senha').value = alunoDados.password || "";
    document.getElementById('cpf').value = alunoDados.cpf || "";
    document.getElementById('tipo').value = alunoDados.tipo === 1 ? "Professor/Instrutor" : "Aluno(a)";
    document.getElementById('descricao').value = alunoDados.descricao || "";

    // Configura o botão de salvar
    const saveBtn = document.getElementById("saveBtn");

    // Remove event listeners antigos (evita duplicação)
    saveBtn.replaceWith(saveBtn.cloneNode(true));
    const newSaveBtn = document.getElementById("saveBtn");

    newSaveBtn.addEventListener('click', async () => {

      const inputSenha = document.getElementById('senha').value;
      if (inputSenha == "") {
        alert("Ops! É necessário informar sua senha para salvar os dados!");
        return;
      }

      try {
        const putResponse = await fetch(`${API_SABERMAIS_URL}/Alunos/${aluno.id}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            id: aluno.id,
            nome: document.getElementById("nome").value,
            email: document.getElementById("email").value,
            password: document.getElementById("senha").value,
            cpf: document.getElementById("cpf").value,
            tipo: aluno.tipo,
            descricao: document.getElementById("descricao").value
          })
        });

        if (!putResponse.ok) {
          throw new Error(`Erro ao atualizar os dados: ${putResponse.status}`);
        }
   
        alert("Dados atualizados com sucesso!");
        window.location.reload();

      }
      catch (error) {
        console.error("Erro ao atualizar aluno:", error);
        alert("Falha ao salvar alterações. Verifique os dados e tente novamente.");
      }

    });
  }
  catch (error) {
    console.error("Erro ao buscar aluno:", error);
    alert("Erro ao buscar informações do aluno. Tente novamente.");
  }

}


const weekDays = [
  { id: 1762018461203, DiaDaSemana: 0, HoraInicio: '08:00:00', HoraFim: '09:00:00' },
  { id: 1762018461204, DiaDaSemana: 1, HoraInicio: '13:00:00', HoraFim: '14:00:00' },
  { id: 1762018461205, DiaDaSemana: 4, HoraInicio: '08:00:00', HoraFim: '12:00:00' }
];



if (!document.getElementById('editForm')) {
  console.warn('Página sem formulário de edição, script ignorado.');
}

