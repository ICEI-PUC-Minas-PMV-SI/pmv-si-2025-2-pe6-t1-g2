import { API_SABERMAIS_URL } from "../config/apiConfig.js";

export async function loadUser() {
    const token = localStorage.getItem("jwtToken"); //Verifica se tem o JWT Token no localStorage

    if (!token) {
        alert("Ops! É necessário fazer login para continuar.");
        window.location.href = "../login.html"; // Se não tiver token, redireciona para login
        return;

    } else {
        try {
            const response = await fetch(`${API_SABERMAIS_URL}/Usuarios/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 401) {
                // Não autorizado → token inválido ou expirado
                alert("Sessão expirada. Faça login novamente.");
                window.location.href = "../login.html"
                setTimeout(() => window.location.href = "../login.html", 1000);
                return;
            }

            if (response.status === 404) {
                alert("Professor não encontrado.");
                window.location.href = "../login.html"
                return;
            }

            if (!response.ok) {
                alert("Erro ao carregar informações do professor.");
                window.location.href = "../login.html"
                return;
            }

            const user = await response.json();
            console.log(response);
            console.log(user);

            const idUsuario = user.id;

            const response2 = await fetch(`${API_SABERMAIS_URL}/Professores/${idUsuario}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const dadosUser = await response2.json(); //Retorna as infos do usuário logado
            console.log(dadosUser);
            const tipoUsuario = dadosUser.tipo;

            if (tipoUsuario == 1) {
                const buttonDashboard = document.getElementById("buttonDashboard"); //Botão Dashboard do menu
                buttonDashboard.classList.remove("hidden");
            } if (tipoUsuario == 0) {
                buttonDashboard.classList.add("hidden");
            }

            await carregarProfessor(dadosUser);
            return dadosUser;
        }
        catch (error) {
            console.error("Erro ao verificar autenticação:", error);
            alert("Erro ao verificar autenticação.");
            localStorage.removeItem("jwtToken");
            window.location.href = "../login.html";
        }
    }
};

async function carregarProfessor(professor) {

    document.getElementById("userName").textContent = professor.nome;
    document.getElementById("aulasAgendadas").textContent = professor.agendamentosComoProfessor.length;

    // Função que conta aulas concluídas (status = 2 e 3)
    function contarAulas() {
        if (!professor.agendamentosComoProfessor) return 0;

        const aulasSemAvaliacao = professor.agendamentosComoProfessor.filter(aula => aula.status === 2).length;
        const aulasComAvaliacao = professor.agendamentosComoProfessor.filter(aula => aula.status === 3).length;
        return aulasSemAvaliacao + aulasComAvaliacao;
    }
    document.getElementById("aulasConcluidas").textContent = contarAulas();

    // Função que conta alunos únicos em aulas concluídas
    function contarAlunos() {
        if (!professor.agendamentosComoProfessor) return 0;

        const aulasConcluidas = professor.agendamentosComoProfessor.filter(aula => aula.status === 0);
        const idsAlunos = aulasConcluidas.map(aula => aula.alunoId);
        const alunosUnicos = new Set(idsAlunos); // remove duplicados

        return alunosUnicos.size;
    }
    document.getElementById("totalAlunos").textContent = contarAlunos();

    function somarHorasAulas() {
        if (!professor.agendamentosComoProfessor) return 0;
        const horasSemAvaliacao = professor.agendamentosComoProfessor.filter(aula => aula.status === 2).length * 60;
        const horasComAvaliacao = professor.agendamentosComoProfessor.filter(aula => aula.status === 3).length * 60;
        return horasSemAvaliacao + horasComAvaliacao;
    }
    document.getElementById("horasAulas").textContent = `${somarHorasAulas()} minutos`;

    await carregarAgendamentos(professor);
}


const token = localStorage.getItem("jwtToken");
const activityTimeline = document.getElementById("upcomingLessons");

// Função para formatar data e hora
function formatarDataHora(datetime) {
    const dataObj = new Date(datetime);
    const data = dataObj.toLocaleDateString("pt-BR", { timeZone: "UTC" });
    const hora = dataObj.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC",
    });
    return { data, hora };
}

// Função para criar o card da aula
function criarAula({ materia, aluno, data, hora, id, status }) {
    const card = document.createElement("div");
    card.className = "lesson-item";
    card.dataset.status = status === 0 ? "confirmar" : "confirmado"; // estado inicial

    // Avatar
    const avatar = document.createElement("div");
    avatar.className = "lesson-avatar";
    avatar.textContent = aluno[0].toUpperCase();

    // Info container
    const info = document.createElement("div");
    info.className = "lesson-info";

    const header = document.createElement("div");
    header.className = "lesson-header";

    const title = document.createElement("h4");
    title.textContent = materia;

    const statusSpan = document.createElement("span");
    statusSpan.id = "lesson-status";
    statusSpan.className = status === 0 ? "status-pending" : "status-confirmed";
    statusSpan.textContent = status === 0 ? "Confirmar aula" : "";

    header.appendChild(title);
    header.appendChild(statusSpan);

    const teacher = document.createElement("p");
    teacher.className = "lesson-teacher";
    teacher.textContent = `Aluno ${aluno}`;

    const details = document.createElement("div");
    details.className = "lesson-details";
    details.innerHTML = `
    <span class="lesson-date"><i class="fas fa-calendar"></i> ${data}</span>
    <span class="lesson-time"><i class="fas fa-clock"></i> ${hora}</span>
  `;
    info.appendChild(header);
    info.appendChild(teacher);
    info.appendChild(details);

    // card.innerHTML = `
    //    <div class="lesson-avatar">${aluno[0].toUpperCase()}</div>
    //    <div class="lesson-info">
    //      <div class="lesson-header">
    //        <h4>${materia}</h4>
    //        <span class="lesson-status status-pending">Confirmar aula</span>
    //      </div>
    //      <p class="lesson-teacher">Aluno(a) ${aluno}</p>
    //      <div class="lesson-details">
    //        <span class="lesson-date"><i class="fas fa-calendar"></i> ${data}</span>
    //        <span class="lesson-time"><i class="fas fa-clock"></i> ${hora}</span>
    //      </div>
    //    </div>
    //   <div class="lesson-actions">
    //     <button class="btn-sm btn-primary" onclick="confirmarAula(this)">Confirmar</button>
    //     <button class="btn-sm btn-outline" onclick="negarAula(this)">Negar</button>
    //   </div>
    // `;

    // Ações
    const actions = document.createElement("div");
    actions.className = "lesson-actions";

    if (status == 0) {
        const btnConfirmar = document.createElement("button");
        btnConfirmar.className = "btn-sm btn-primary";
        btnConfirmar.textContent = "Confirmar";
        btnConfirmar.addEventListener("click", () => confirmarAula(btnConfirmar, id));

        const btnNegar = document.createElement("button");
        btnNegar.className = "btn-sm btn-outline";
        btnNegar.textContent = "Negar";
        btnNegar.addEventListener("click", () => negarAula(btnNegar, id));

        actions.appendChild(btnConfirmar);
        actions.appendChild(btnNegar);
    };

    if (status == 1) {
        // Substitui botões por nada até a aula ocorrer
        const btnConfirmado = document.createElement("button");
        btnConfirmado.className = "btn-sm btn-outline-disabled";
        btnConfirmado.textContent = "Confirmado";
        btnConfirmado.disabled = true;

        actions.appendChild(btnConfirmado);
    };

    // Monta o card completo
    card.appendChild(avatar);
    card.appendChild(info);
    card.appendChild(actions);

    activityTimeline.appendChild(card);
}

// Função principal: busca os dados e cria os cards
async function carregarAgendamentos(dadosProfessor) {

    const agendamentos = dadosProfessor.agendamentosComoProfessor;

    for (const agendamento of agendamentos) {
        const { data, hora } = formatarDataHora(agendamento.dataHora);
        const id = agendamento.id;
        const status = agendamento.status;
        console.log(id);
        console.log("status: ", status);

        // Para obter o nome do aluno e da disciplina
        const alunoNome = await buscarNomeAluno(agendamento.alunoId);
        const disciplinaNome = await buscarNomeMateria(agendamento.disciplinaId);

        // Criar card com apenas os agendamentos pendentes e confirmados (status === 0 e 1)
        if (status === 0 || status === 1) {
            criarAula({
                materia: disciplinaNome,
                aluno: alunoNome,
                data,
                hora,
                id,
                status,
            });
        }

        console.log ("dados que estão saindo: ", disciplinaNome, alunoNome, data, status);
        // Criar card para todos os agendamentos
        criarCardAtividade(disciplinaNome, alunoNome, data, status);
    }

}

// Função para buscar o nome do aluno
async function buscarNomeAluno(idAluno) {
    try {
        const resp = await fetch(`${API_SABERMAIS_URL}/Usuarios/${idAluno}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        const aluno = await resp.json();
        return aluno.nome || `ID ${idAluno}`;
    } catch {
        return `ID ${idAluno}`;
    }
}

// Função para buscar o nome da disciplina
async function buscarNomeMateria(idArea) {
    try {
        const resp = await fetch(`${API_SABERMAIS_URL}/Areas/${idArea}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        const area = await resp.json();
        return area.nome || `Área ${idArea}`;
    } catch (erro) {
        console.error("Erro ao buscar nome da matéria:", erro);
        return `Área ${idArea}`;
    }
}

async function atualizarStatusAgendamento(idAgendamento, novoStatus) {
    try {
        const resposta = await fetch(`${API_SABERMAIS_URL}/Agendamentos/${idAgendamento}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            },
        });

        if (!resposta.ok) {
            throw new Error(`Erro ao carregar agendamento: ${resposta.status}`);
        }

        const resultado = await resposta.json();
        console.log(resultado);

        // Atualizar o status via PUT
        const resposta2 = await fetch(`${API_SABERMAIS_URL}/Agendamentos/${idAgendamento}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: idAgendamento,
                status: novoStatus,
                alunoId: resultado.alunoId,
                professorId: resultado.professorId,
                disciplinaId: resultado.disciplinaId,
                dataHora: resultado.dataHora
            })
        });

        if (!resposta2.ok) {
            throw new Error(`Erro ao atualizar status: ${resposta2.status}`);
        } else {
            if (novoStatus === 4) {
                alert("Ok! O agendamento foi negado!");
                window.location.reload();
                return true;
            } if (novoStatus === 1) {
                alert("Sucesso! O agendamento foi confirmado!");
                window.location.reload();
                return true;
            }
        }
    } catch (erro) {
        console.error("Falha ao atualizar o status no banco:", erro);
        alert("Não foi possível atualizar o status da aula. Tente novamente.");
        return false;
    }
}

function negarAula(btn, idAgendamento) {
    const card = btn.closest(".lesson-item");
    const status = card.querySelector("#lesson-status");
    console.log(idAgendamento);

    atualizarStatusAgendamento(idAgendamento, 4); // 4 = Negada

    // if (sucesso) {
    //     status.textContent = "Cancelada";
    //     status.className = "status-cancelled";
    //     card.dataset.status = "cancelada";
    //     card.querySelector(".lesson-actions").innerHTML = `
    //   <button class="btn-sm btn-outline" disabled>Cancelada</button>
    // `;
    // }
}

function confirmarAula(btn, idAgendamento) {
    const card = btn.closest(".lesson-item");
    const status = card.querySelector("#lesson-status");

    atualizarStatusAgendamento(idAgendamento, 1); // 1 = Confirmada
}


// Seleciona o container principal onde os cards serão inseridos
const activityList = document.getElementById("recentActivity");

// Função base: cria um card genérico de atividade
function criarCardAtividade( materia, aluno, data, status ) {

    console.log ("dados recebidos: ", materia, aluno, data, status);
    const statusConfig = {
        0: { texto: "⌛ Pendente", icon: "fas fa-hourglass-half", class: "pending" },
        1: { texto: "📅 Confirmada", icon: "fas fa-calendar-check", class: "confirm" },
        2: { texto: "✅ Concluída", icon: "fas fa-check-circle", class: "success" },
        3: { texto: "⭐ Avaliada", icon: "fas fa-star", class: "review" },
        4: { texto: "❌ Cancelada", icon: "fas fa-times-circle", class: "cancel" }
    };

    const { texto, icon, class: statusClass } = statusConfig[status] || {
        texto: "⚙️ Em andamento",
        icon: "fas fa-spinner",
        class: "default"
    };

    const card = document.createElement("div");
    card.className = `activity-item ${statusClass}`;
    card.innerHTML = `
    <div class="activity-icon ${statusClass}">
      <i class="${icon}"></i>
    </div>
    <div class="activity-info">
      <h4 class="activity-title">${materia}</h4>
      <p class="activity-status">${texto}</p>
      <p class="activity-student">Aluno(a) ${aluno}</p>
      <span class="activity-time">${data}</span>
    </div>
  `;

    activityList.appendChild(card);
    return card;
}

