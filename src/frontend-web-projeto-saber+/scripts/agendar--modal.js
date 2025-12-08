const modalAgendar = document.getElementById("agendarModal");

// Botões que abrem o modal
const btnAbrirPerfil = document.getElementById("agendarOpenModalPerfil");
const btnAbrirAgendar = document.getElementById("agendarOpenModalAgendar");

// Botão que fecha o modal
const btnFechar = document.getElementById("btnFecharModal");

// Abrir modal pelos dois botões
btnAbrirPerfil.addEventListener("click", () => {
    modalAgendar.showModal();
});

btnAbrirAgendar.addEventListener("click", () => {
    modalAgendar.showModal();
});

// Fechar modal
btnFechar.addEventListener("click", () => {
    modalAgendar.close();
});

// Fechar ao clicar fora
modalAgendar.addEventListener("click", (e) => {
    const dialogDimensions = modalAgendar.getBoundingClientRect();
    if (
        e.clientX < dialogDimensions.left ||
        e.clientX > dialogDimensions.right ||
        e.clientY < dialogDimensions.top ||
        e.clientY > dialogDimensions.bottom
    ) {
        modalAgendar.close();
    }
});


/* ===============================
   Controle de dias disponíveis
   =============================== */

// Enum dos dias da semana (0=Segunda, 6=Domingo)
const diasEnum = {
  0: "Segunda",
  1: "Terça",
  2: "Quarta",
  3: "Quinta",
  4: "Sexta",
  5: "Sábado",
  6: "Domingo"
};

// Exemplo: o professor só atende Segunda, Quarta e Sexta
const diasDisponiveis = [0, 2, 4];

/**
 * Bloqueia no calendário as datas que não estão nos dias disponíveis.
 * @param {HTMLInputElement} inputDate 
 * @param {number[]} diasDisponiveis 
 */
function configurarDatasDisponiveis(inputDate, diasDisponiveis) {
  const hoje = new Date();
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 2); // limite de 2 meses pra frente

  // Define limites no input
  inputDate.min = hoje.toISOString().split("T")[0];
  inputDate.max = maxDate.toISOString().split("T")[0];

  // Validação ao escolher uma data
  inputDate.addEventListener("change", () => {
    const dataSelecionada = new Date(inputDate.value);
    const diaSemana = (dataSelecionada.getDay() + 6) % 7; // ajusta pra começar em segunda (0)

    if (!diasDisponiveis.includes(diaSemana)) {
      alert(`O professor não atende em ${diasEnum[diaSemana]}.`);
      inputDate.value = "";
    }
  });
}

/* ===============================
   Inicialização
   =============================== */
document.addEventListener("DOMContentLoaded", () => {
  const inputData = document.getElementById("dataAgendamento");
  if (inputData) configurarDatasDisponiveis(inputData, diasDisponiveis);
});
