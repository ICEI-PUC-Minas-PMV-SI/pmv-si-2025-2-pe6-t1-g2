/* ----------- Validação de Email ----------- */
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/* ----------- Validação de CPF ----------- */
function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, "");

    if (cpf.length !== 11) return false;
    if (/^(.)\1+$/.test(cpf)) return false;

    let soma = 0, resto;

    for (let i = 1; i <= 9; i++)
        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++)
        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;

    return true;
}

/* ----------- Máscara CPF ----------- */
document.getElementById("cpf").addEventListener("input", function (e) {
    let v = e.target.value.replace(/\D/g, "");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    e.target.value = v;
});

/* ----------- Toggle Senha ----------- */
function setupTogglePassword(toggleId, inputId) {
  const toggle = document.getElementById(toggleId);
  const input = document.getElementById(inputId);

  toggle.addEventListener("click", () => {
    const hidden = input.type === "password";
    input.type = hidden ? "text" : "password";
    toggle.setAttribute("aria-pressed", String(!hidden));

    // Ícones SVG de olho aberto e fechado
    const eyeOpen = `
      <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#434343"><path d="M480-312q70 0 119-49t49-119q0-70-49-119t-119-49q-70 0-119 49t-49 119q0 70 49 119t119 49Zm0-72q-40 0-68-28t-28-68q0-40 28-68t68-28q40 0 68 28t28 68q0 40-28 68t-68 28Zm0 192q-142.6 0-259.8-78.5Q103-349 48-480q55-131 172.2-209.5Q337.4-768 480-768q142.6 0 259.8 78.5Q857-611 912-480q-55 131-172.2 209.5Q622.6-192 480-192Zm0-288Zm0 216q112 0 207-58t146-158q-51-100-146-158t-207-58q-112 0-207 58T127-480q51 100 146 158t207 58Z"/></svg>`;
    const eyeClosed = `
      <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#434343"><path d="m637-425-62-62q4-38-23-65.5T487-576l-62-62q13-5 27-7.5t28-2.5q70 0 119 49t49 119q0 14-2.5 28t-8.5 27Zm133 133-52-52q36-28 65.5-61.5T833-480q-49-101-144.5-158.5T480-696q-26 0-51 3t-49 10l-58-58q38-15 77.5-21t80.5-6q143 0 261.5 77.5T912-480q-22 57-58.5 103.5T770-292Zm-2 202L638-220q-38 14-77.5 21t-80.5 7q-143 0-261.5-77.5T48-480q22-57 58-104t84-85L90-769l51-51 678 679-51 51ZM241-617q-35 28-65 61.5T127-480q49 101 144.5 158.5T480-264q26 0 51-3.5t50-9.5l-45-45q-14 5-28 7.5t-28 2.5q-70 0-119-49t-49-119q0-14 3.5-28t6.5-28l-81-81Zm287 89Zm-96 96Z"/></svg>`;

    toggle.innerHTML = hidden ? eyeClosed: eyeOpen;
  });
}
setupTogglePassword("toggleSenha", "senha");
setupTogglePassword("toggleConfirmarSenha", "confirmarSenha");

/* ----------- Multi-Step ----------- */
const form = document.getElementById('multiStepForm');
const steps = Array.from(form.querySelectorAll('fieldset[data-step]'));
let currentStep = 0;

const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');

function showStep(index) {
    steps.forEach((step, i) => step.hidden = i !== index);
    currentStep = index;
    const pct = Math.round(((index + 1) / steps.length) * 100);
    progressBar.style.width = pct + "%";
    progressText.textContent = `Etapa ${index + 1} de ${steps.length}`;
}

function validateStep(index) {
    const fields = steps[index].querySelectorAll("[required]");
    let valid = true;

    fields.forEach(f => {
        if (!f.value.trim()) {
            f.classList.add("invalid");
            valid = false;
        } else {
            f.classList.remove("invalid");
        }
    });

    return valid;
}

/* ---- Next Step ---- */
document.getElementById("nextBtn1").addEventListener("click", () => {
    if (!validateStep(0)) {
        alert("Preencha todos os campos obrigatórios da etapa 1.");
        return;
    }

    if (!validarEmail(form.email.value)) {
        alert("Por favor, insira um e-mail válido.");
        return;
    }

    if (form.senha.value !== form.confirmarSenha.value) {
        alert("As senhas não coincidem.");
        return;
    }

    showStep(1);
});

/* ---- Voltar ---- */
document.getElementById("backBtn2").addEventListener("click", () => showStep(0));

import { createAluno } from "./services/alunosService.js";
/* ----------- Submit ----------- */
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validateStep(currentStep)) {
        alert("Preencha todos os campos obrigatórios da etapa 2.");
        return;
    }

    if (!validarCPF(form.cpf.value)) {
        alert("CPF inválido. Verifique e tente novamente.");
        return;
    }

    const payload = {
        nome: form.nome.value.trim(),
        email: form.email.value.trim(),
        password: form.senha.value.trim(),
        cpf: form.cpf.value.trim(),
        descricao: form.descricao.value.trim(),
        //tipo: 2 // ALUNO
    };

    const submitBtn = document.getElementById("submitBtn");
    submitBtn.disabled = true;
    submitBtn.textContent = "Enviando...";

    console.log(payload)

    try {
        await createAluno(payload);
        alert("Cadastro realizado com sucesso!");
        form.reset();
        showStep(0);
        window.location.href = "../login.html";

    } catch (err) {
        alert("Erro ao cadastrar: " + err.message);

    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Cadastrar";
    }
});

showStep(0);