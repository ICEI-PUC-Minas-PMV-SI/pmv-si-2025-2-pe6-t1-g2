import { API_SABERMAIS_URL } from "../config/apiConfig.js";
const token = localStorage.getItem("jwtToken");

(function () {
  // ---------- Configurações ----------
  const API_PROFESSORES = API_SABERMAIS_URL + '/Professores';
  const LIMITE_CARDS = 12;

  // Fallback (se a API falhar) — usei o JSON que você enviou (array com 1 item)
  const MOCK_DATA = [
    {
      "descricao": "Professora de programação.",
      "certificacoes": ["Bacharelado em Sistemas de Informação"],
      "competencias": ["TypeScript", "Node.js"],
      "valorHora": 99.90,
      "areas": [{ "areaId": 1 }, { "areaId": 4 }],
      "agendamentosComoProfessor": [],
      "disponibilidades": [0, 2, 4], // segunda, quarta, sexta (opcional)
      "avaliacoes": [],
      "id": 21,
      "nome": "Ana Beatriz Faria",
      "email": "ana@gmail.com",
      "cpf": "222.968.250-44",
      "tipo": 1,
      "links": []
    },
    {
      "descricao": "Engenheiro de software com foco em back-end e banco de dados.",
      "certificacoes": ["Mestrado em Engenharia de Software"],
      "competencias": ["Java", "Spring Boot", "MySQL"],
      "valorHora": 120.00,
      "areas": [{ "areaId": 1 }, { "areaId": 3 }],
      "agendamentosComoProfessor": [],
      "disponibilidades": [1, 3, 5], // terça, quinta e sábado
      "avaliacoes": [],
      "id": 22,
      "nome": "Lucas Andrade",
      "email": "lucas.andrade@gmail.com",
      "cpf": "518.742.960-12",
      "tipo": 1,
      "links": []
    },
    {
      "descricao": "Desenvolvedora front-end apaixonada por interfaces acessíveis e responsivas.",
      "certificacoes": ["Tecnólogo em Desenvolvimento Web", "Certificação em UX Design"],
      "competencias": ["HTML", "CSS", "JavaScript", "React"],
      "valorHora": 85.50,
      "areas": [{ "areaId": 2 }, { "areaId": 4 }],
      "agendamentosComoProfessor": [],
      "disponibilidades": [0, 3, 4], // segunda, quinta e sexta
      "avaliacoes": [],
      "id": 23,
      "nome": "Mariana Oliveira",
      "email": "mariana.oliveira@gmail.com",
      "cpf": "903.176.850-07",
      "tipo": 1,
      "links": []
    },
    {
      "descricao": "Instrutor de ciência de dados e aprendizado de máquina.",
      "certificacoes": ["Bacharelado em Estatística", "Especialização em Data Science"],
      "competencias": ["Python", "Pandas", "TensorFlow"],
      "valorHora": 150.00,
      "areas": [{ "areaId": 5 }, { "areaId": 6 }],
      "agendamentosComoProfessor": [],
      "disponibilidades": [2, 4, 6], // quarta, sexta e domingo
      "avaliacoes": [],
      "id": 24,
      "nome": "Rafael Costa",
      "email": "rafael.costa@gmail.com",
      "cpf": "337.924.180-55",
      "tipo": 1,
      "links": []
    },
    {
      "descricao": "Professora de design gráfico e desenvolvimento de interfaces digitais.",
      "certificacoes": ["Bacharelado em Design Gráfico"],
      "competencias": ["Figma", "Adobe XD", "UI/UX"],
      "valorHora": 75.00,
      "areas": [{ "areaId": 2 }, { "areaId": 7 }],
      "agendamentosComoProfessor": [],
      "disponibilidades": [1, 2, 4], // terça, quarta e sexta
      "avaliacoes": [],
      "id": 25,
      "nome": "Camila Ribeiro",
      "email": "camila.ribeiro@gmail.com",
      "cpf": "681.457.220-33",
      "tipo": 1,
      "links": []
    }
  ];

  // Mapeamento dia (0 segunda) — usamos mesma convenção
  const diasEnum = { 0: "Segunda", 1: "Terça", 2: "Quarta", 3: "Quinta", 4: "Sexta", 5: "Sábado", 6: "Domingo" };

  // Estado local
  let professores = [];
  let currentProfessor = null;
  let idArea = null;

  // Elementos
  const listaEl = document.getElementById('profLista');
  const tpl = document.getElementById('profCardTemplate');
  const searchForm = document.getElementById('searchForm');
  const searchInput = document.getElementById('q');

  // perfil
  const overlay = document.getElementById('teacherModalOverlay');
  const closeProfileBtn = document.getElementById('closeProfileBtn');
  const profileName = document.getElementById('profileName');
  const profilePrice = document.getElementById('profilePrice');
  // const profileFoto = document.getElementById('profileFoto');
  const profileBio = document.getElementById('profileBio');
  const profileInteresses = document.getElementById('profileInteresses');
  const profileCerts = document.getElementById('profileCerts');
  const profileSubtitle = document.getElementById('profileSubtitle');
  const openScheduleFromProfileBtn = document.getElementById('openScheduleFromProfile');

  // booking
  const bookingDialog = document.getElementById('bookingDialog');
  const bookingForm = document.getElementById('bookingForm');
  const bookingProfId = document.getElementById('bookingProfId');
  const bookingProfName = document.getElementById('bookingProfName');
  const bookingProfPrice = document.getElementById('bookingProfPrice');
  const bookingDate = document.getElementById('bookingDate');
  const bookingDay = document.getElementById('bookingDay');
  const bookingTime = document.getElementById('bookingTime');
  const bookingTopics = document.getElementById('bookingTopics');
  const closeBooking = document.getElementById('closeBooking');
  const cancelBooking = document.getElementById('cancelBooking');

  // ---------- Helpers ----------
  function fmtPrice(v) { return v == null ? 'Valor não informado' : `R$ ${Number(v).toFixed(2)}/h`; }

  function createCard(prof) {
    console.log('createCard chamado com:', prof);

    const tpl = document.getElementById('profCardTemplate');
    if (!tpl) {
      console.error('Template não encontrado: #profCardTemplate');
      return document.createElement('div');
    }

    const clone = tpl.content.cloneNode(true);
    const article = clone.querySelector('.teacher-card');
    article.dataset.id = prof.id ?? '';

    // Nome do professor
    const nomeEl = clone.querySelector('.teacher-card__nome');
    nomeEl.textContent = prof.nome || '(sem nome)';

    // Descrição
    const descEl = clone.querySelector('.teacher-card__descricao');
    descEl.textContent = prof.descricao || 'Sem descrição disponível.';

    // Valor da hora
    const priceEl = clone.querySelector('.valor');
    if (prof.valorHora != null) {
      priceEl.textContent = `R$ ${Number(prof.valorHora).toFixed(2)}`;
    } else {
      priceEl.textContent = '—';
    }

    // Avaliação (se existir no JSON)
    const ratingEl = clone.querySelector('.teacher-card__avaliacao');
    if (prof.avaliacao != null) {
      const estrelas = '★'.repeat(Math.floor(prof.avaliacao)) + '☆'.repeat(5 - Math.floor(prof.avaliacao));
      ratingEl.textContent = `${estrelas} (${prof.avaliacao.toFixed(1)})`;
    } else {
      ratingEl.textContent = 'Sem avaliações';
    }

    // Competências (caso venha no JSON, senão pode deixar vazio)
    const compEl = clone.querySelector('.teacher-card_competencias');
    if (Array.isArray(prof.competencias) && prof.competencias.length > 0) {
      compEl.textContent = prof.competencias.join(', ');
    } else {
      compEl.textContent = '';
    }

    // Botões (para associar eventos, se necessário)
    const btnProfile = clone.querySelector('[data-action="open-profile"]');
    const btnSchedule = clone.querySelector('[data-action="open-schedule"]');

    btnProfile.addEventListener('click', () => {
      console.log(`Abrir perfil do professor ID ${prof.id}`);
      openProfile(prof);
      // aqui você chama a função de abrir o modal de perfil
    });

    btnSchedule.addEventListener('click', () => {
      console.log(`Agendar aula com o professor ID ${prof.id}`);
      if (!token) {
        alert("Ops! É necessário fazer login para realizar esta ação. Entre ou cadastre-se para continuar!")
        setTimeout(() => window.location.href = "../login.html", 1000);
        return;
      } else {
        openBooking(prof);
        // aqui você chama a função de abrir o modal de agendamento, se o usuário estiver logado
      }
    });

    return clone;
  }


  function renderList(list) {
    listaEl.innerHTML = '';
    if (!Array.isArray(list) || list.length === 0) {
      listaEl.innerHTML = `<article class="teacher-card"><div class="teacher-card__body"><h3 class="teacher-card__nome">Nenhum professor encontrado.</h3><p class="teacher-card__Conteúdo">Tente outro termo.</p></div></article>`;
      return;
    }
    list.slice(0, LIMITE_CARDS).forEach(p => listaEl.appendChild(createCard(p)));
  }

  // ---------- API ----------
  async function fetchProfessores() {
    try {
      const resp = await fetch(API_PROFESSORES, { method: 'GET', headers: { 'Accept': 'application/json' } });
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      const data = await resp.json();
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.warn('Falha ao buscar API — usando mock local', err);
      return MOCK_DATA;
    }
  }

  // ---------- Inicialização ----------
  async function init() {
    professores = await fetchProfessores();
    renderList(professores);
  }
  init();

  // ---------- Busca (form) ----------
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const termo = (searchInput.value || '').toLowerCase().trim();
    const filtrados = professores.filter(p => {
      const nome = (p.nome || '').toLowerCase();
      const desc = ((p.descricao || p.area || p.materia) || '').toLowerCase();
      const comps = (Array.isArray(p.competencias) ? p.competencias.join(' ') : (p.competencias || '')).toLowerCase();
      return nome.includes(termo) || desc.includes(termo) || comps.includes(termo);
    });
    renderList(filtrados);
  });

  // ---------- Event delegation para abrir perfil / agendar ----------
  listaEl.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const article = e.target.closest('.teacher-card');
    if (!article) return;
    const profId = article.dataset.id;
    const prof = professores.find(x => String(x.id) === String(profId));
    if (!prof) return;

    if (btn.classList.contains('btn-profile')) {
      openProfile(prof);
    } else if (btn.classList.contains('btn-schedule')) {
      if (!token) {
        alert("Ops! É necessário fazer login para realizar esta ação. Entre ou cadastre-se para continuar!")
        setTimeout(() => window.location.href = "../login.html", 1000);
        return;
      } else {
        openBooking(prof);
      }
    }
  });

  // ---------- Perfil ----------
  async function openProfile(prof) {
    currentProfessor = prof;
    profileName.textContent = prof.nome || '(sem nome)';
    profilePrice.textContent = fmtPrice(prof.valorHora);
    profileBio.textContent = prof.descricao || prof.bio || 'Este professor ainda não adicionou uma descrição detalhada.';
    profileSubtitle.textContent = `${prof.competencias ? (Array.isArray(prof.competencias) ? prof.competencias.join(', ') : prof.competencias) : ''}`;

    // interesses / materias
    const materias = prof.areas && Array.isArray(prof.areas) && prof.areas.length
      ? prof.areas
      : (prof.competencias || []);

    profileInteresses.innerHTML = '';

    for (const a of materias) {
      const li = document.createElement('li');

      let nomeArea;
      if (a.area) {
        // Já possui o nome da área
        nomeArea = a.area;
      } else if (a.areaId) {
        // Precisa buscar o nome via requisição
        nomeArea = await buscarNomeMateria(a.areaId);
      } else {
        nomeArea = '-';
      }

      li.textContent = nomeArea || '-';
      profileInteresses.appendChild(li);
    }

    // certificações
    profileCerts.innerHTML = '';
    (Array.isArray(prof.certificacoes) ? prof.certificacoes : (prof.certificacoes ? [prof.certificacoes] : [])).forEach(c => {
      const li = document.createElement('li'); li.textContent = c; profileCerts.appendChild(li);
    });

    overlay.classList.add('show');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeProfile() {
    overlay.classList.remove('show');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    currentProfessor = null;
  }

  closeProfileBtn.addEventListener('click', closeProfile);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeProfile(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { if (overlay.classList.contains('show')) closeProfile(); if (bookingDialog.open) bookingDialog.close(); } });

  // Ao clicar no botão de agendar dentro do perfil
  openScheduleFromProfileBtn.addEventListener('click', () => {
    if (!currentProfessor) return;
    if (!token) {
      alert("Ops! É necessário fazer login para realizar esta ação. Entre ou cadastre-se para continuar!")
      setTimeout(() => window.location.href = "../login.html", 1000);
      return;
    } else {
      openBooking(currentProfessor);
      closeProfile();
    }
  });

  async function buscarNomeMateria(idArea) {
    try {
      const resp = await fetch(`${API_SABERMAIS_URL}/Areas/${idArea}`, {});
      const area = await resp.json();
      return area.nome || `Área ${idArea}`;
    } catch (erro) {
      console.error("Erro ao buscar nome da matéria:", erro);
      return `Área ${idArea}`;
    }
  }

  // ---------- Agendamento (dialog) ----------
  function openBooking(prof) {
    currentProfessor = prof;
    bookingProfId.value = prof.id;
    bookingProfName.textContent = prof.nome ?? '';
    bookingProfPrice.textContent = fmtPrice(prof.valorHora);

    console.log(currentProfessor);

    // tópicos disponíveis (conteúdos)
    bookingTopics.innerHTML = '';

     const topics = prof.areas && Array.isArray(prof.areas) && prof.areas.length ? prof.areas : ['Conteúdo geral'];

    topics.forEach((t, i) => {
      const id = `topic-${prof.id}-${i}`;
      const wrapper = document.createElement('div');

      // conteúdo inicial (placeholder)
      wrapper.innerHTML = `
      <label>
        <input type="radio" name="topics" value="${t.areaId}" id="${id}">
        <span>Carregando...</span>
      </label>
    `;

      bookingTopics.appendChild(wrapper);

      buscarNomeMateria(t.areaId).then((nome) => {
        const span = wrapper.querySelector("span");
        if (span) span.textContent = nome ?? "Desconhecido";
      }).catch(() => {
        const span = wrapper.querySelector("span");
        if (span) span.textContent = "Erro ao carregar";
      });
    });


    // const topics = prof.areas && Array.isArray(prof.areas) && prof.areas.length ? prof.areas : ['Conteúdo geral'];
    // topics.forEach((t, i) => {

    //   const id = `topic-${prof.id}-${i}`;
    //   const wrapper = document.createElement('div');
    //   wrapper.innerHTML = `<label><input type="radio" name="topics" value="${i}" id="${id}" ${i === 0 ? '' : ''}> <span>${await buscarNomeMateria(t.areaId)}</span></label>`;
    //   bookingTopics.appendChild(wrapper);
    // });

    // preencher horários (se houver disponibilidade explícita de horários, usar; senão, hora padrão)
    populateTimes(prof, []);

    // configurar data mínima/máxima e validação por dia da semana
    configurarDatasDisponiveis(bookingDate, prof.disponibilidades && prof.disponibilidades.length ? prof.disponibilidades : [0, 2, 4]);

    // reset campos
    bookingDate.value = '';
    bookingDay.value = '';
    bookingTime.innerHTML = '<option value="" disabled selected>Selecione</option>';

    // abrir dialog
    try {
      bookingDialog.showModal();
    } catch (er) {
      // fallback: se browser não suportar, simular com overlay
      alert('Seu navegador não suporta <dialog>. Implemente um fallback se necessário.');
    }
  }

  function construirOptionHorario(text, value) { const opt = document.createElement('option'); opt.value = value; opt.textContent = text; return opt; }

  // Exemplo: aqui você preencheria de acordo com prof.disponibilidadesDetalhadas (horários por dia)
  function populateTimes(prof, timesForSelectedDate) {
    bookingTime.innerHTML = '<option value="" disabled selected>Selecione</option>';
    // se timesForSelectedDate fornecido, usa ele; senão horários padrão
    const defaults = ['09:00-10:00', '11:00-12:00', '14:00-15:00', '16:00-17:00'];
    const times = Array.isArray(timesForSelectedDate) && timesForSelectedDate.length ? timesForSelectedDate : defaults;
    times.forEach(t => bookingTime.appendChild(construirOptionHorario(t, t)));
  }

  function configurarDatasDisponiveis(inputDate, diasDisponiveis) {

    const hoje = new Date();
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 2);
    inputDate.min = hoje.toISOString().split('T')[0];
    inputDate.max = maxDate.toISOString().split('T')[0];

    inputDate.addEventListener('change', () => {
      if (!inputDate.value) return;

      const sel = new Date(inputDate.value + 'T00:00:00');
      // getDay() -> 0 domingo ... 6 sábado. Convertemos pra 0=segunda.
      const diaSemana = (sel.getDay() + 6) % 7;
      bookingDay.value = diasEnum[diaSemana] || '';
      // const nomeDia = diasEnum[diaSemana];
      // bookingDay.value = nomeDia;

      const disponibilidade = diasDisponiveis.find(d => d.diaDaSemana === diaSemana);

      if (!disponibilidade) {
        alert(`O professor não atende em ${bookingDay.value || 'este dia da semana'}. Escolha outra data.`);
        inputDate.value = '';
        bookingDay.value = '';
        bookingTime.innerHTML = '<option value="" disabled selected>Selecione</option>';
        return;
      }

      // Se tivesse horários específicos por data, poderíamos buscar aqui.
      // Simulamos: se a data for par, 2 horários; se ímpar, 3 horários (apenas demo)
      // const dayNum = sel.getDate();
      // const times = (dayNum % 2 === 0) ? ['10:00-11:00', '15:00-16:00'] : ['09:00-10:00', '13:00-14:00', '18:00-19:00'];
      // populateTimes(currentProfessor, times);
      // Gerar horários disponíveis com base em horaInicio e horaFim
      const horarios = gerarHorarios(disponibilidade.horaInicio, disponibilidade.horaFim);
      popularHorarios(bookingTime, horarios);
    });

    function gerarHorarios(horaInicio, horaFim) {
      const [hiH, hiM] = horaInicio.split(':').map(Number);
      const [hfH, hfM] = horaFim.split(':').map(Number);
      const horarios = [];

      let horaAtual = new Date();
      horaAtual.setHours(hiH, hiM, 0, 0);

      const horaFinal = new Date();
      horaFinal.setHours(hfH, hfM, 0, 0);

      while (horaAtual < horaFinal) {
        const inicio = horaAtual.toTimeString().substring(0, 5);
        horaAtual.setHours(horaAtual.getHours() + 1);
        const fim = horaAtual.toTimeString().substring(0, 5);
        horarios.push(`${inicio} - ${fim}`);
      }

      return horarios;
    }

    function popularHorarios(select, horarios) {
      select.innerHTML = '<option value="" disabled selected>Selecione</option>';
      horarios.forEach(h => {
        const opt = document.createElement('option');
        opt.value = h;
        opt.textContent = h;
        select.appendChild(opt);
      });
    }

  }

  // fechar dialog
  closeBooking.addEventListener('click', () => bookingDialog.close());
  cancelBooking.addEventListener('click', () => bookingDialog.close());

  // submit do agendamento
  bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const profId = currentProfessor.id;
    const date = bookingDate.value;
    const time = bookingTime.value;
    const startTime = time.split('-')[0].trim();
    const user = await carregarUsuarioLogado();

    const topics = Number(bookingTopics.querySelector('input[name="topics"]:checked')?.value);

    if (!date || !time) { alert('Escolha data e horário.'); return; }

    // construir payload conforme sua API
    const payload = {
      disciplinaId: topics, //errado
      professorId: profId,
      alunoId: user.id,
      status: 0,
      dataHora: `${date}T${startTime}:00`
    };
    console.log("payload: ", payload);

    // tentativa de enviar para API (rota de agendamentos fictícia)
    try {
      const resp = await fetch(API_SABERMAIS_URL + '/Agendamentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!resp.ok) {
        // fallback: se a API retorna erro, apenas mostrar confirmação local
        const txt = await resp.text().catch(() => null);
        console.warn('Resposta não OK ao criar agendamento', resp.status, txt);
        alert('Ops! Não foi possível criar agendamento. Tente novamente.');
      } else {
        alert('Agendamento criado com sucesso!');
      }
    } catch (err) {
      console.warn('Ocorreu um erro rede ao criar agendamento: ', err);
      alert('Ops! Erro ao registrar agendamento.');
    } finally {
      bookingDialog.close();
    }
  });

  async function carregarUsuarioLogado() {
    try {
      const response = await fetch(`${API_SABERMAIS_URL}/Usuarios/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const user = await response.json();
      console.log(user);

      const idUsuario = user.id;

      const response2 = await fetch(`${API_SABERMAIS_URL}/Usuarios/${idUsuario}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const dadosUser = await response2.json(); //Retorna as infos do usuário logado
      console.log(dadosUser);

      return dadosUser;
    }
    catch (error) {
      console.error("Erro ao verificar autenticação:", error);
      alert("Erro ao verificar autenticação.");
      localStorage.removeItem("jwtToken");
      //window.location.href = "../login.html";
    }
  }

  // ---------- Carregamento inicial de exemplo ao clicar em filtro: demonstração ----------
  // (já ativamos init() para carregar lista)
})();



// ======== CONTROLE DO MODAL DE FILTRO ========
const filterModal = document.getElementById('filterModal');
const filterButtons = document.querySelectorAll('[data-filter]');
const closeFilterBtn = document.getElementById('closeModal');
const applyFiltersBtn = document.getElementById('applyFilters');
const clearFiltersBtn = document.getElementById('clearFilters');
const tabs = document.querySelectorAll('.section-tab');
const sections = document.querySelectorAll('.filter-section');

function showTab(targetId) {
  // Remove classe "active" de todas as abas e seções
  tabs.forEach(tab => tab.classList.remove('active'));
  sections.forEach(section => section.classList.remove('active'));

  // Ativa somente a aba e a seção clicadas
  const selectedTab = document.querySelector(`.section-tab[data-target="${targetId}"]`);
  const selectedSection = document.getElementById(targetId);

  if (selectedTab) selectedTab.classList.add('active');
  if (selectedSection) selectedSection.classList.add('active');
}

// Evento para cada aba
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.target;
    showTab(target);
  });
});

// Abre modal e mostra a aba clicada
filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.filter; // valor, categoria ou avaliacao
    filterModal.style.display = 'flex';
    filterModal.setAttribute('aria-hidden', 'false');
    showTab(target);
  });
});

// Fecha modal
closeFilterBtn.addEventListener('click', () => {
  document.activeElement.blur();
  filterModal.style.display = 'none';
  filterModal.setAttribute('aria-hidden', 'true');
});

// Clique nas abas dentro do modal
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.target;
    showTab(target);
  });
});

// ======== APLICAR FILTROS ========
applyFiltersBtn.addEventListener('click', () => {
  const minVal = parseFloat(document.getElementById('minValue').value) || 0;
  const maxVal = parseFloat(document.getElementById('maxValue').value) || Infinity;
  const minRating = parseFloat(document.getElementById('rating').value) || 0;

  const filtrados = professores.filter(p => {
    const preco = p.valorHora || 0;
    const avaliacao = p.avaliacao || 0;
    return preco >= minVal && preco <= maxVal && avaliacao >= minRating;
  });

  renderList(filtrados);
  document.activeElement.blur(); // remove foco ativo
  filterModal.style.display = 'none';
  filterModal.setAttribute('aria-hidden', 'true');
});

// ======== LIMPAR FILTROS ========
clearFiltersBtn.addEventListener('click', () => {
  document.getElementById('minValue').value = 0;
  document.getElementById('maxValue').value = 1000;
  document.getElementById('rating').value = 1;
  renderList(professores);
});

// ======== SINCRONIZAR SLIDERS ========
const priceMin = document.getElementById('priceMin');
const priceMax = document.getElementById('priceMax');
const minValue = document.getElementById('minValue');
const maxValue = document.getElementById('maxValue');

function syncPriceInputs() {
  minValue.value = priceMin.value;
  maxValue.value = priceMax.value;
}
priceMin.addEventListener('input', syncPriceInputs);
priceMax.addEventListener('input', syncPriceInputs);
minValue.addEventListener('input', () => (priceMin.value = minValue.value));
maxValue.addEventListener('input', () => (priceMax.value = maxValue.value));

// ======== EXIBIR VALOR DO SLIDER DE AVALIAÇÃO ========
const ratingSlider = document.getElementById('rating');
const ratingValue = document.getElementById('ratingValue');
ratingSlider.addEventListener('input', () => {
  ratingValue.textContent = ratingSlider.value;
});