import { API_SABERMAIS_URL } from "../config/apiConfig.js";

(function () {
    // ---------- Configurações ----------
    //const API_BASE = 'http://localhost:5041/api'; // ajuste para produção
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

    // Elementos
    const listaEl = document.getElementById('profLista');
    const tpl = document.getElementById('profCardTemplate');
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('inputBuscar');

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
        const priceEl = clone.querySelector('.price');
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
            openBooking(prof);
            // aqui você chama a função de abrir o modal de agendamento
        });

        return clone;
    }

    function renderList(list) {

        console.log("função renderList, list: ", list);
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
            console.warn('Falha ao buscar API. ', err);
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
            openBooking(prof);
        }
    });

    // function checkLogin() {
    //     const token = localStorage.getItem("jwtToken");
    //     console.log(token);
    //     if (!token) {
    //         alert("Ops! É necessário fazer login para realizar esta ação. Faça login ou cadastre-se para continuar!")
    //         //setTimeout(() => window.location.href = "../login.html", 1000);
    //         return;
    //     };
    //     // const response = await fetch(`${API_SABERMAIS_URL}/Usuarios/me`, {
    //     //     headers: {
    //     //         Authorization: `Bearer ${token}`,
    //     //     },
    //     // });
    //     // if (!response.ok) return null;
    //     // const user = await response.json();
    //     // console.log("Usuário logado:", user);
    //     return;
    // }

    // ---------- Perfil ----------
    function openProfile(prof) {
        currentProfessor = prof;
        profileName.textContent = prof.nome || '(sem nome)';
        profilePrice.textContent = fmtPrice(prof.valorHora);
        profileBio.textContent = prof.descricao || prof.bio || 'Este professor ainda não adicionou uma descrição detalhada.';
        profileSubtitle.textContent = `${prof.competencias ? (Array.isArray(prof.competencias) ? prof.competencias.join(', ') : prof.competencias) : ''}`;

        // interesses / materias
        profileInteresses.innerHTML = '';
        const materias = prof.areas && Array.isArray(prof.areas) && prof.areas.length ? prof.areas.map(a => a.area || `Área ${a.areaId || ''}`) : (prof.competencias || []);
        (Array.isArray(materias) ? materias : [materias]).forEach(it => {
            const li = document.createElement('li'); li.textContent = it || '-'; profileInteresses.appendChild(li);
        });

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
        openBooking(currentProfessor);
        closeProfile();
    });

    // ---------- Agendamento (dialog) ----------
    function openBooking(prof) {
        currentProfessor = prof;
        bookingProfId.value = prof.id ?? '';
        bookingProfName.textContent = prof.nome ?? '';
        bookingProfPrice.textContent = fmtPrice(prof.valorHora);

        // tópicos disponíveis (conteúdos)
        bookingTopics.innerHTML = '';
        const topics = prof.competencias && Array.isArray(prof.competencias) && prof.competencias.length ? prof.competencias : ['Conteúdo geral'];
        topics.forEach((t, i) => {
            const id = `topic-${prof.id}-${i}`;
            const wrapper = document.createElement('div');
            wrapper.innerHTML = `<label><input type="checkbox" name="topics" value="${t}" id="${id}" ${i === 0 ? 'checked' : ''}> <span>${t}</span></label>`;
            bookingTopics.appendChild(wrapper);
        });

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
            if (!diasDisponiveis.includes(diaSemana)) {
                alert(`O professor não atende em ${bookingDay.value || 'este dia da semana'}. Escolha outra data.`);
                inputDate.value = '';
                bookingDay.value = '';
                bookingTime.innerHTML = '<option value="" disabled selected>Selecione</option>';
                return;
            }

            // Se tivesse horários específicos por data, poderíamos buscar aqui.
            // Simulamos: se a data for par, 2 horários; se ímpar, 3 horários (apenas demo)
            const dayNum = sel.getDate();
            const times = (dayNum % 2 === 0) ? ['10:00-11:00', '15:00-16:00'] : ['09:00-10:00', '13:00-14:00', '18:00-19:00'];
            populateTimes(currentProfessor, times);
        });
    }

    // fechar dialog
    closeBooking.addEventListener('click', () => bookingDialog.close());
    cancelBooking.addEventListener('click', () => bookingDialog.close());

    // submit do agendamento
    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const profId = bookingProfId.value;
        const date = bookingDate.value;
        const time = bookingTime.value;
        const topics = Array.from(bookingTopics.querySelectorAll('input[name="topics"]:checked')).map(i => i.value);

        if (!date || !time) { alert('Escolha data e horário.'); return; }

        // construir payload conforme sua API
        const payload = {
            professorId: profId,
            dataHora: date + 'T' + time.split('-')[0] + ':00',
            topicos: topics
        };

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
                alert('Não foi possível criar agendamento na API. (Simulação local) — ver console.');
            } else {
                alert('Agendamento criado com sucesso!');
            }
        } catch (err) {
            console.warn('Erro rede ao criar agendamento (mock)', err);
            alert('Agendamento confirmado (modo offline).');
        } finally {
            bookingDialog.close();
        }
    });

    // ---------- Carregamento inicial de exemplo ao clicar em filtro: demonstração ----------
    // (já ativamos init() para carregar lista)
})();

(function () {
    // ---------- Configurações ----------
    //const API_BASE = 'http://localhost:5041/api'; // ajuste para produção
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

    // Elementos
    const listaEl = document.getElementById('profLista');
    const tpl = document.getElementById('profCardTemplate');
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('inputBuscar');

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
        const priceEl = clone.querySelector('.price');
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
            //verifica se usuário está logado


            console.log(`Abrir perfil do professor ID ${prof.id}`);
            openProfile(prof);
            // aqui você chama a função de abrir o modal de perfil
        });

        btnSchedule.addEventListener('click', () => {
            console.log(`Agendar aula com o professor ID ${prof.id}`);
            openBooking(prof);
            // aqui você chama a função de abrir o modal de agendamento
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
            console.warn('Falha ao buscar API. ', err);
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
            openBooking(prof);
        }
    });

    // ---------- Perfil ----------
    function openProfile(prof) {
        currentProfessor = prof;
        profileName.textContent = prof.nome || '(sem nome)';
        profilePrice.textContent = fmtPrice(prof.valorHora);
        profileBio.textContent = prof.descricao || prof.bio || 'Este professor ainda não adicionou uma descrição detalhada.';
        profileSubtitle.textContent = `${prof.competencias ? (Array.isArray(prof.competencias) ? prof.competencias.join(', ') : prof.competencias) : ''}`;

        // interesses / materias
        profileInteresses.innerHTML = '';
        const materias = prof.areas && Array.isArray(prof.areas) && prof.areas.length ? prof.areas.map(a => a.area || `Área ${a.areaId || ''}`) : (prof.competencias || []);
        (Array.isArray(materias) ? materias : [materias]).forEach(it => {
            const li = document.createElement('li'); li.textContent = it || '-'; profileInteresses.appendChild(li);
        });

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
        openBooking(currentProfessor);
        closeProfile();
    });

    // ---------- Agendamento (dialog) ----------
    function openBooking(prof) {
        currentProfessor = prof;
        bookingProfId.value = prof.id ?? '';
        bookingProfName.textContent = prof.nome ?? '';
        bookingProfPrice.textContent = fmtPrice(prof.valorHora);

        // tópicos disponíveis (conteúdos)
        bookingTopics.innerHTML = '';
        const topics = prof.competencias && Array.isArray(prof.competencias) && prof.competencias.length ? prof.competencias : ['Conteúdo geral'];
        topics.forEach((t, i) => {
            const id = `topic-${prof.id}-${i}`;
            const wrapper = document.createElement('div');
            wrapper.innerHTML = `<label><input type="checkbox" name="topics" value="${t}" id="${id}" ${i === 0 ? 'checked' : ''}> <span>${t}</span></label>`;
            bookingTopics.appendChild(wrapper);
        });

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
            if (!diasDisponiveis.includes(diaSemana)) {
                alert(`O professor não atende em ${bookingDay.value || 'este dia da semana'}. Escolha outra data.`);
                inputDate.value = '';
                bookingDay.value = '';
                bookingTime.innerHTML = '<option value="" disabled selected>Selecione</option>';
                return;
            }

            // Se tivesse horários específicos por data, poderíamos buscar aqui.
            // Simulamos: se a data for par, 2 horários; se ímpar, 3 horários (apenas demo)
            const dayNum = sel.getDate();
            const times = (dayNum % 2 === 0) ? ['10:00-11:00', '15:00-16:00'] : ['09:00-10:00', '13:00-14:00', '18:00-19:00'];
            populateTimes(currentProfessor, times);
        });
    }

    // fechar dialog
    closeBooking.addEventListener('click', () => bookingDialog.close());
    cancelBooking.addEventListener('click', () => bookingDialog.close());

    // submit do agendamento
    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const profId = bookingProfId.value;
        const date = bookingDate.value;
        const time = bookingTime.value;
        const topics = Array.from(bookingTopics.querySelectorAll('input[name="topics"]:checked')).map(i => i.value);

        if (!date || !time) { alert('Escolha data e horário.'); return; }

        // construir payload conforme sua API
        const payload = {
            professorId: profId,
            dataHora: date + 'T' + time.split('-')[0] + ':00',
            topicos: topics
        };

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
                alert('Não foi possível criar agendamento na API. (Simulação local) — ver console.');
            } else {
                alert('Agendamento criado com sucesso!');
            }
        } catch (err) {
            console.warn('Erro rede ao criar agendamento (mock)', err);
            alert('Agendamento confirmado (modo offline).');
        } finally {
            bookingDialog.close();
        }
    });

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

// Função para exibir apenas a aba selecionada
function showTab(targetId) {
    // remove classe ativa de tudo
    tabs.forEach(t => t.classList.remove('active'));
    sections.forEach(s => s.classList.remove('active'));

    // adiciona classe ativa à aba e à seção correspondentes
    const activeTab = [...tabs].find(t => t.dataset.target === targetId);
    if (activeTab) activeTab.classList.add('active');
    const activeSection = document.getElementById(targetId);
    if (activeSection) activeSection.classList.add('active');
}
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
    filterModal.style.display = 'none';
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