(() => {
    // Elementos principais (verificações defensivas)
    const dialog = document.getElementById('editProfileModal');
    const fallbackOverlay = document.getElementById('dialogFallbackOverlay');
    const fallbackContainer = document.querySelector('.dialog-fallback');
    const openButtons = Array.from(document.querySelectorAll('[data-open-edit], .open-edit-profile, [onclick="toggleEditMode()"]'));
    const globalOverlay = document.getElementById('overlay'); // opcional, usado por projeto anterior

    // Estado local para controlar listeners do fallback (para poder remover depois)
    let fallbackOverlayClickHandler = null;
    let fallbackFormSubmitHandler = null;

    // Helper: coloca o texto atual do perfil no textarea (usado antes de abrir modal)
    function populateBioInput(targetRoot = document) {
        const profileBioDisplay = document.getElementById('profileBio');
        const bioText = profileBioDisplay ? profileBioDisplay.textContent.trim() : '';
        const bioInput = targetRoot.querySelector('#profileBioInput') || document.getElementById('profileBioInput');
        if (bioInput) bioInput.value = bioText;
    }

    // --- Abre modal (usa showModal quando suportado; senão usa fallback) ---
    function openEditModal() {
        if (!dialog) return console.warn('Dialog "editProfileModal" não encontrado.');

        // populate bio input in the real DOM (or in cloned dialog later for fallback)
        populateBioInput(document);

        // Preferir API nativa do <dialog>
        if (typeof dialog.showModal === 'function') {
            try {
                dialog.showModal();
            } catch (err) {
                console.warn('Erro ao abrir dialog nativo:', err);
            }
            // se houver overlay global no seu layout, mostre-o também
            if (globalOverlay) globalOverlay.hidden = false;
            return;
        }

        // Fallback: montar markup no overlay
        if (!fallbackOverlay || !fallbackContainer) {
            console.warn('Fallback overlay/container não disponíveis.');
            return;
        }

        // limpar container e clonar conteúdo (clonar não traz listeners, então vamos adicionar os necessários)
        fallbackContainer.innerHTML = '';
        const clone = dialog.cloneNode(true);
        clone.removeAttribute('id'); // evita id duplicado
        fallbackContainer.appendChild(clone);
        fallbackOverlay.hidden = false;

        // preencher textarea do clone com o texto atual
        populateBioInput(clone);

        // fechar quando clicar fora do conteúdo (apenas uma vez)
        fallbackOverlayClickHandler = (ev) => {
            if (ev.target === fallbackOverlay) closeEditModal();
        };
        fallbackOverlay.addEventListener('click', fallbackOverlayClickHandler);

        // conectar botões/ formulário do clone
        const cloneClose = fallbackContainer.querySelector('#closeEditProfileModal');
        const cloneCancel = fallbackContainer.querySelector('#cancelEditBtn');
        const cloneForm = fallbackContainer.querySelector('#editProfileForm');

        if (cloneClose) cloneClose.addEventListener('click', closeEditModal);
        if (cloneCancel) cloneCancel.addEventListener('click', closeEditModal);

        if (cloneForm) {
            // handler guardado para podermos remover depois
            fallbackFormSubmitHandler = (e) => {
                e.preventDefault();
                const nameVal = cloneForm.querySelector('#profileNameInput')?.value ?? '';
                const realName = document.getElementById('profileName');
                if (realName) realName.textContent = nameVal;

                // Atualiza o "Sobre" visível no documento real
                const bioVal = cloneForm.querySelector('#profileBioInput')?.value ?? '';
                const realBio = document.getElementById('profileBio');
                if (realBio) realBio.textContent = bioVal;

                // Se você também quiser sincronizar o nome (caso mantenha o campo), adicione aqui.
                closeEditModal();
            };
            cloneForm.addEventListener('submit', fallbackFormSubmitHandler);
        }
    }

    // --- Fecha modal (funciona para dialog nativo e fallback) ---
    function closeEditModal() {
        // fechar dialog nativo (se aberto)
        if (dialog && typeof dialog.close === 'function' && dialog.hasAttribute('open')) {
            try { dialog.close(); } catch (err) { /* ignora */ }
        }

        // esconder overlay global se existir
        if (globalOverlay) globalOverlay.hidden = true;

        // limpar fallback (remover listeners e conteúdo)
        if (fallbackOverlay) {
            if (fallbackOverlayClickHandler) {
                fallbackOverlay.removeEventListener('click', fallbackOverlayClickHandler);
                fallbackOverlayClickHandler = null;
            }
            if (fallbackContainer) {
                // remover submit listener do form clonado, se houver
                const cloneForm = fallbackContainer.querySelector('#editProfileForm');
                if (cloneForm && fallbackFormSubmitHandler) {
                    cloneForm.removeEventListener('submit', fallbackFormSubmitHandler);
                    fallbackFormSubmitHandler = null;
                }
                fallbackContainer.innerHTML = '';
            }
            fallbackOverlay.hidden = true;
        }
    }

    // Expor função global (compatibilidade com handlers inline antigos)
    window.toggleEditMode = openEditModal;

    // Conectar botões de abertura (se existirem)
    openButtons.forEach(btn => {
        // evite adicionar o mesmo listener múltiplas vezes: removemos antes
        btn.removeEventListener('click', openEditModal);
        btn.addEventListener('click', openEditModal);
    });

    // Conectar botões de fechar/cancelar no dialog nativo (se existirem)
    if (dialog) {
        const closeBtn = dialog.querySelector('#closeEditProfileModal');
        const cancelBtn = dialog.querySelector('#cancelEditBtn');
        if (closeBtn) closeBtn.addEventListener('click', closeEditModal);
        if (cancelBtn) cancelBtn.addEventListener('click', closeEditModal);

        // fechar ao clicar fora do <dialog> (apenas quando showModal é suportado)
        if (typeof dialog.showModal === 'function') {
            dialog.addEventListener('click', (e) => {
                const rect = dialog.getBoundingClientRect();
                const isInDialog = (
                    e.clientX >= rect.left &&
                    e.clientX <= rect.right &&
                    e.clientY >= rect.top &&
                    e.clientY <= rect.bottom
                );
                if (!isInDialog) closeEditModal();
            });

            // intercepte submit do formulário padrão do dialog
            const form = dialog.querySelector('form');
            if (form) {
                form.addEventListener('submit', (ev) => {
                    ev.preventDefault();

                    // Atualiza nome
                    const nameVal = form.querySelector('#profileNameInput')?.value ?? '';
                    const profileNameDisplay = document.getElementById('profileName');
                    if (profileNameDisplay) profileNameDisplay.textContent = nameVal;

                    // Atualiza bio
                    const bioVal = form.querySelector('#profileBioInput')?.value ?? '';
                    const profileBioDisplay = document.getElementById('profileBio');
                    if (profileBioDisplay) profileBioDisplay.textContent = bioVal;

                    try { dialog.close(); } catch (err) { }
                    if (globalOverlay) globalOverlay.hidden = true;
                });
            }
        }
    }

    // Fechar via tecla Esc (apenas um listener global)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeEditModal();
    });

    // ----------------- Outras funções do seu script -----------------

    // shareProfile: tratar quando userProfileData não existir
    function shareProfile() {
        const profileId = window.userProfileData?.id || window.currentUser?.id;
        if (!profileId) {
            if (typeof showError === 'function') showError('ID do perfil não definido.');
            else console.warn('ID do perfil não definido para compartilhar.');
            return;
        }
        const profileUrl = `${window.location.origin}/perfil/${profileId}`;
        const titleName = `${window.userProfileData?.firstName || window.currentUser?.firstName || ''} ${window.userProfileData?.lastName || window.currentUser?.lastName || ''}`.trim();
        if (navigator.share) {
            navigator.share({
                title: `Perfil de ${titleName}`,
                text: 'Confira meu perfil no Saber+',
                url: profileUrl
            }).catch(err => console.warn('Share erro:', err));
        } else if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(profileUrl)
                .then(() => {
                    if (typeof showSuccess === 'function') showSuccess('Link do perfil copiado para a área de transferência!');
                    else console.log('Link copiado:', profileUrl);
                })
                .catch(err => console.warn('Erro ao copiar link:', err));
        } else {
            // fallback final: prompt para copiar manualmente
            window.prompt('Copie o link do perfil abaixo:', profileUrl);
        }
    }
    window.shareProfile = shareProfile;

    // toggleUserMenu — permanece simples, mas defensivo
    function toggleUserMenu() {
        const dropdown = document.getElementById('userDropdown');
        if (!dropdown) return;
        dropdown.classList.toggle('show');
    }
    window.toggleUserMenu = toggleUserMenu;

    // updateUIForLoggedUser — criar DOM ao invés de innerHTML com onclick inline
    window.isLoggedIn = window.isLoggedIn ?? true;
    window.currentUser = window.currentUser ?? { firstName: 'Ana', id: null };

    function updateUIForLoggedUser() {
        const navActions = document.querySelector('.nav-actions');
        if (!navActions) return;
        navActions.innerHTML = ''; // limpar antes
        if (!window.isLoggedIn) return;

        const wrapper = document.createElement('div');
        wrapper.className = 'user-menu';

        const btn = document.createElement('button');
        btn.className = 'user-avatar';
        btn.setAttribute('aria-expanded', 'false');
        btn.type = 'button';
        btn.textContent = (window.currentUser.firstName || 'U').charAt(0);
        btn.addEventListener('click', () => {
            toggleUserMenu();
            btn.setAttribute('aria-expanded', document.getElementById('userDropdown')?.classList.contains('show') ? 'true' : 'false');
        });

        const dropdown = document.createElement('div');
        dropdown.className = 'user-dropdown';
        dropdown.id = 'userDropdown';

        const links = [
            { text: 'Dashboard', fn: () => goToDashboard && goToDashboard() },
            { text: 'Meu Perfil', fn: () => goToProfile && goToProfile() },
            { text: 'Sair', fn: () => logout && logout() }
        ];
        links.forEach(item => {
            const a = document.createElement('a');
            a.href = '#';
            a.textContent = item.text;
            a.addEventListener('click', (e) => {
                e.preventDefault();
                item.fn();
            });
            dropdown.appendChild(a);
        });

        wrapper.appendChild(btn);
        wrapper.appendChild(dropdown);
        navActions.appendChild(wrapper);
    }
    window.updateUIForLoggedUser = updateUIForLoggedUser;

    // inicializa UI
    updateUIForLoggedUser();
})();
