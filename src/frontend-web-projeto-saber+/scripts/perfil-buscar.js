//Integração com API
    // Ajuste isto para o endereço base real da sua API:
    const API_BASE = 'http://localhost:5041/api';

    // 1. pegar o ID da URL (?id=123)
    function getProfessorIdFromQuery() {
      const params = new URLSearchParams(window.location.search);
      return params.get('id');
    }

    // 2. carregar dados do professor e preencher na tela
    async function carregarProfessor() {
      const idProf = getProfessorIdFromQuery();
      const nomeEl = document.getElementById('profNome');
      const fotoEl = document.getElementById('profFoto');
      const conteudoEl = document.getElementById('profConteudo');
      const certEl = document.getElementById('profCertificacao');
      const compEl = document.getElementById('profCompetencias');
      const cidadeEl = document.getElementById('profCidade');
      const expEl = document.getElementById('profExperiencia');
      const precoEl = document.getElementById('profPreco');
      const bioEl = document.getElementById('profBio');
      const endEl = document.getElementById('profEndereco');
      const infoEl = document.getElementById('profInfoExtra');

      const cardEl = document.getElementById('profCard');
      const btnAgendar = document.getElementById('btnAgendar');
      const contatoFormBtn = document.getElementById('btnEnviarMensagem');

      if (!idProf) {
        nomeEl.textContent = 'Professor não encontrado';
        bioEl.textContent = 'Volte para a busca e selecione um professor.';
        return;
      }

      nomeEl.textContent = 'Carregando...';

      try {
        const resp = await fetch(`${API_BASE}/professores/${idProf}`, {
          method: 'GET',
          headers: { 'Accept': 'application/json' }
        });

        if (!resp.ok) {
          throw new Error('Erro ao buscar professor (' + resp.status + ')');
        }

        const prof = await resp.json();

        // coloca o id no card
        cardEl.dataset.id = prof.id || idProf;

        // nome / foto
        nomeEl.textContent = prof.nome ?? '(Sem nome)';
        fotoEl.src = prof.fotoUrl || '../assets/images/default-prof.png';
        fotoEl.alt = 'Foto de ' + (prof.nome || 'Professor');

        // Conteúdo principal, certificações, competências
        conteudoEl.textContent =
          prof.descricao ||
          prof.area ||
          prof.materia ||
          '';

        certEl.textContent = Array.isArray(prof.certificacoes)
          ? prof.certificacoes.join(', ')
          : (prof.certificacoes || '');

        compEl.textContent = Array.isArray(prof.competencias)
          ? prof.competencias.join(', ')
          : (prof.competencias || '');

        // Cidade / experiência / preço hora
        cidadeEl.textContent = '📍 ' + (prof.cidade || 'Local não informado');

        expEl.textContent = '💼 ' + (
          prof.experiencia_anos != null
            ? prof.experiencia_anos + ' anos'
            : 'Experiência não informada'
        );

        precoEl.textContent = '💲 ' + (
          prof.valorHora != null
            ? `R$ ${Number(prof.valorHora).toFixed(2)}/h`
            : 'Valor não informado'
        );

        // Bio longa
        bioEl.textContent =
          prof.bio ||
          prof.sobre ||
          'Este professor ainda não adicionou uma descrição detalhada.';

        // Endereço e info extra (se existirem)
        endEl.textContent = prof.endereco || 'Não informado';
        infoEl.textContent = prof.informacaoExtra || prof.infoExtra || '';

        // Botão Agendar aponta para página de agendamento, passando o id
        btnAgendar.href = 'agendar.html?id=' + encodeURIComponent(prof.id ?? idProf);

        // Guardar o id no botão de mensagem
        contatoFormBtn.dataset.professorId = prof.id ?? idProf;

      } catch (err) {
        console.error(err);
        nomeEl.textContent = 'Erro ao carregar professor';
        bioEl.textContent = err.message;
      }
    }

    // 3. enviar mensagem rápida ao professor
    async function enviarMensagem() {
      const btn = document.getElementById('btnEnviarMensagem');
      const msgBox = document.getElementById('msg');
      const professorId = btn.dataset.professorId;
      const mensagem = msgBox.value.trim();

      if (!mensagem) {
        alert('Digite uma mensagem antes de enviar.');
        return;
      }

      btn.disabled = true;
      btn.textContent = 'Enviando...';

      const payload = {
        professorId: professorId,
        mensagem: mensagem
        // se você precisar mandar também nome/email do aluno,
        // você pode incluir aqui: alunoNome, alunoContato, etc.
      };

      try {
        const resp = await fetch(`${API_BASE}/mensagens`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!resp.ok) {
          const txt = await resp.text();
          alert('Não foi possível enviar a mensagem:\n' + txt);
        } else {
          alert('Mensagem enviada para o professor!');
          msgBox.value = '';
        }
      } catch (err) {
        console.error(err);
        alert('Erro de rede ao enviar mensagem: ' + err.message);
      } finally {
        btn.disabled = false;
        btn.textContent = 'Enviar mensagem';
      }
    }

    // 4. listeners
    document.getElementById('btnEnviarMensagem').addEventListener('click', enviarMensagem);

    // 5. inicializa carregando os dados do professor
    carregarProfessor();