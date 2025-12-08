const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");

togglePassword.addEventListener("click", () => {
    const isHidden = passwordInput.type === "password";

    // Alternar tipo do input
    passwordInput.type = isHidden ? "text" : "password";

    // Atualizar texto do botão
    togglePassword.textContent = isHidden ? "$" : "%";

    // Acessibilidade (opcional)
    togglePassword.setAttribute("aria-label", isHidden ? "Ocultar senha" : "Mostrar senha");
    togglePassword.setAttribute("aria-pressed", String(!isHidden));
});

/* -------------- Multi-step logic -------------- */
const form = document.getElementById('multiStepForm');
const steps = Array.from(form.querySelectorAll('fieldset[data-step]'));
let currentStep = 0; // index in steps (0-based)
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');

function showStep(index) {
  steps.forEach((s, i) => {
    if (i === index) {
      s.hidden = false;
      s.setAttribute('aria-hidden', 'false');
    } else {
      s.hidden = true;
      s.setAttribute('aria-hidden', 'true');
    }
  });
  currentStep = index;
  const pct = Math.round(((index + 1) / steps.length) * 100);
  progressBar.style.width = pct + '%';
  progressText.textContent = `Etapa ${index + 1} de ${steps.length}`;
  // foco no primeiro input do step
  const firstInput = steps[index].querySelector('input, textarea, select, button');
  if (firstInput) firstInput.focus();
}

function validateStep(index) {
  // valida apenas campos required dentro do step
  const controls = Array.from(steps[index].querySelectorAll('[required]'));
  let valid = true;
  controls.forEach(control => {
    if (!control.value || control.value.trim() === '') {
      valid = false;
      control.classList.add('invalid');
      // opcional: mostrar mensagem de erro
    } else {
      control.classList.remove('invalid');
    }
  });
  return valid;
}

/* Next / Back buttons */
document.getElementById('nextBtn1').addEventListener('click', () => {
  if (!validateStep(0)) {
    alert('Preencha todos os campos obrigatórios da etapa 1.');
    return;
  }
  showStep(1);
});

document.getElementById('backBtn2').addEventListener('click', () => {
  showStep(0);
});

/* Submit final */
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  // valida última etapa
  if (!validateStep(currentStep)) {
    alert('Preencha todos os campos obrigatórios da etapa final.');
    return;
  }

  // coleta todos os campos do formulário (poderia usar FormData)
  const payload = {
    nome: form.nome.value.trim(),
    email: form.email.value.trim(),
    senha: form.senha.value, // cuidado: em produção não envie plain text sem TLS
    cpf: form.cpf.value.trim(),
    descricao: form.descricao.value.trim(),
    certificacoes: form.certificacoes.value.split(',').map(s => s.trim()).filter(Boolean),
    competencias: form.competencias.value.split(',').map(s => s.trim()).filter(Boolean),
    valorHora: parseFloat(form.valorHora.value)
  };

  // Validações extras (ex: CPF simples)
  if (isNaN(payload.valorHora)) {
    alert('Informe um valor por hora válido.');
    return;
  }

  // Desabilitar botão e mostrar loading
  const submitBtn = document.getElementById('submitBtn');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Enviando...';

  try {
    // ajuste a URL para sua API
    const response = await fetch('/api/cadastros/professores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(errText || 'Erro no servidor');
    }

    const data = await response.json();
    // sucesso
    alert('Cadastro realizado com sucesso!');
    // opcional: redirecionar ou limpar o formulário
    form.reset();
    showStep(0);
  } catch (err) {
    console.error(err);
    alert('Ocorreu um erro ao enviar: ' + err.message);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Cadastrar';
  }
});

// Inicializa a primeira tela
showStep(0);
