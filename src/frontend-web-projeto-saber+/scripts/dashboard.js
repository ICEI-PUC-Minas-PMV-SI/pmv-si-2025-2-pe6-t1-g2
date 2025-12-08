import { API_SABERMAIS_URL } from "./config/apiConfig.js";
import { loadUser } from "./services/dashboardService.js";

// const activityTimeline = document.getElementById("upcomingLessons");
const avaliacaoModal = document.getElementById("avaliacaoModal");
let aulaSelecionada = null;

// // Cria um card de aula
// function criarAula({ materia, aluno, tema, data, hora, tipo }) {
//     const card = document.createElement("div");
//     card.className = "lesson-item";
//     card.dataset.status = "confirmar"; // estado inicial
//     card.innerHTML = `
//       <div class="lesson-avatar">${materia[0].toUpperCase()}</div>
//       <div class="lesson-info">
//         <div class="lesson-header">
//           <h4>${materia}</h4>
//           <span class="lesson-status status-pending">Confirmar aula</span>
//         </div>
//         <p class="lesson-teacher">Aluno ${aluno}</p>
//         <p class="lesson-topic">${tema}</p>
//         <div class="lesson-details">
//           <span class="lesson-date"><i class="fas fa-calendar"></i> ${data}</span>
//           <span class="lesson-time"><i class="fas fa-clock"></i> ${hora}</span>
//           <span class="lesson-type"><i class="fas fa-video"></i> ${tipo}</span>
//         </div>
//       </div>
//       <div class="lesson-actions">
//         <button class="btn-sm btn-primary" onclick="confirmarAula(this)">Confirmar</button>
//         <button class="btn-sm btn-outline" onclick="negarAula(this)">Negar</button>
//       </div>
//     `;
//     activityTimeline.appendChild(card);
// }

// Cria um card de aula
// function criarAula({ materia, aluno, data, hora}) {
//     const card = document.createElement("div");
//     card.className = "lesson-item";
//     card.dataset.status = "confirmar"; // estado inicial
//     card.innerHTML = `
//        <div class="lesson-avatar">${aluno[0].toUpperCase()}</div>
//        <div class="lesson-info">
//          <div class="lesson-header">
//            <h4>${materia}</h4>
//            <span class="lesson-status status-pending">Confirmar aula</span>
//          </div>
//          <p class="lesson-teacher">Aluno ${aluno}</p>
//          <div class="lesson-details">
//            <span class="lesson-date"><i class="fas fa-calendar"></i> ${data}</span>
//            <span class="lesson-time"><i class="fas fa-clock"></i> ${hora}</span>
//          </div>
//        </div>
//       <div class="lesson-actions">
//         <button class="btn-sm btn-primary" onclick="confirmarAula(this)">Confirmar</button>
//         <button class="btn-sm btn-outline" onclick="negarAula(this)">Negar</button>
//       </div>
//     `;
//     activityTimeline.appendChild(card);
// }

// Confirma aula --> usada no "dashboardService.js"
// function confirmarAula(btn) {
//     const card = btn.closest(".lesson-item");
//     card.querySelector(".lesson-status").textContent = "Confirmado";
//     card.querySelector(".lesson-status").className = "lesson-status status-confirmed";
//     card.dataset.status = "confirmado";

//     // Substitui botões por nada até a aula ocorrer
//     card.querySelector(".lesson-actions").innerHTML = `
//       <button class="btn-sm btn-outline" disabled>Confirmado</button>
//     `;

//     // Simula passagem do tempo para teste
//     setTimeout(() => pendenteAvaliacao(card), 5000); // depois de 5s aparece a avaliação
// }

// Cancela aula --> usada no "dashboardService.js"
// function negarAula(btn) {
//     const card = btn.closest(".lesson-item");
//     card.querySelector(".lesson-status").textContent = "Cancelada";
//     card.querySelector(".lesson-status").className = "lesson-status status-cancelled";
//     card.dataset.status = "cancelada";
//     card.querySelector(".lesson-actions").innerHTML = `
//       <button class="btn-sm btn-outline" disabled>Cancelada</button>
//     `;
// }

// Após o horário da aula
function pendenteAvaliacao(card) {
    if (card.dataset.status !== "confirmado") return;
    card.querySelector(".lesson-status").textContent = "Avaliação pendente";
    card.querySelector(".lesson-status").className = "lesson-status status-evaluate";
    card.querySelector(".lesson-actions").innerHTML = `
      <button class="btn-evaluate" onclick="abrirAvaliacao(this)">
        <i class="fas fa-star-half-alt"></i> Avaliar
      </button>
    `;
}

// Abre modal de avaliação
const form = document.getElementById("avaliacaoForm");
const contador = document.getElementById("contadorCaracteres");
const estrelas = document.querySelectorAll("#estrelas i");
let notaSelecionada = 0;


// Abrir modal
function abrirAvaliacao(btn) {
    aulaSelecionada = btn.closest(".lesson-item");
    avaliacaoModal.showModal();

    // Preenche campos ocultos
    document.getElementById("agendamentoId").value = aulaSelecionada.dataset.agendamentoId;
    document.getElementById("avaliadorAlunoId").value = aulaSelecionada.dataset.alunoId;
    document.getElementById("avaliadorProfessorId").value = aulaSelecionada.dataset.professorId;
}

// Fechar modal
function fecharAvaliacao() {
    avaliacaoModal.close();
    form.reset();
    notaSelecionada = 0;
    atualizarEstrelas(0);
    contador.textContent = "0 / 500";
}

// Contador de caracteres
document.getElementById("avaliacaoTexto").addEventListener("input", e => {
    contador.textContent = `${e.target.value.length} / 500`;
});

// Selecionar nota por estrela
estrelas.forEach(estrela => {
    estrela.addEventListener("click", () => {
        notaSelecionada = parseInt(estrela.dataset.value);
        atualizarEstrelas(notaSelecionada);
    });
});

function atualizarEstrelas(qtd) {
    estrelas.forEach(e => {
        e.classList.toggle("ativa", e.dataset.value <= qtd);
    });
}

// Salvar avaliação
document.getElementById("salvarAvaliacao").addEventListener("click", () => {
    const comentario = document.getElementById("avaliacaoTexto").value.trim();
    const agendamentoId = document.getElementById("agendamentoId").value;
    const alunoId = document.getElementById("avaliadorAlunoId").value;
    const professorId = document.getElementById("avaliadorProfessorId").value;

    if (!notaSelecionada) return alert("Por favor, selecione uma nota.");
    if (!comentario) return alert("O comentário é obrigatório.");
    if (comentario.length > 500) return alert("O comentário não pode exceder 500 caracteres.");

    const avaliacao = {
        Nota: notaSelecionada,
        Comentario: comentario,
        AgendamentoId: parseInt(agendamentoId),
        AvaliadorAlunoId: parseInt(alunoId),
        AvaliadorProfessorId: parseInt(professorId),
        Agendamento: null, // apenas retorno
        AvaliadorAluno: null,
        AvaliadorProfessor: null
    };

    console.log("📘 Avaliação enviada:", avaliacao);

    aulaSelecionada.querySelector(".lesson-status").textContent = "Avaliado";
    aulaSelecionada.querySelector(".lesson-status").className = "lesson-status status-done";
    aulaSelecionada.querySelector(".lesson-actions").innerHTML = `
      <button class="btn-sm btn-outline" disabled>Avaliado</button>
    `;

    fecharAvaliacao();
});

// Exemplo de uso:
// criarAula({
//     materia: "Português",
//     aluno: "Carlos Souza",
//     data: "Qua., 30 out",
//     hora: "14:00 (60min)",
// });

await loadUser(); //Carrega os dados do usuário usando o Id
