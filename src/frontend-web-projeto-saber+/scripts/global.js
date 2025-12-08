// =========================
// MENU HAMBÚRGUER
// =========================
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");

if (hamburger && navMenu) {
  hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("active");
  });
}

// =========================
// MODAL DE LOGIN
// =========================
const modal = document.getElementById("modal");
const openModal = document.getElementById("openModal");
const closeModal = document.getElementById("closeModal");

if (openModal && modal) {
  openModal.addEventListener("click", () => {
    modal.style.display = "flex";
  });
}

if (closeModal && modal) {
  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });
}

// Fechar modal de login ao clicar fora
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

// =========================
// MODAL DE CADASTRO
// =========================
const modalCadastro = document.getElementById("modalCadastro");
const openModalCadastro = document.getElementById("openModalCadastro");
const closeModalCadastro = document.getElementById("closeModalCadastro");

if (openModalCadastro && modalCadastro) {
  openModalCadastro.addEventListener("click", () => {
    modalCadastro.style.display = "flex";
  });
}

if (closeModalCadastro && modalCadastro) {
  closeModalCadastro.addEventListener("click", () => {
    modalCadastro.style.display = "none";
  });
}

// Fechar modal de cadastro ao clicar fora
window.addEventListener("click", (e) => {
  if (e.target === modalCadastro) {
    modalCadastro.style.display = "none";
  }
});


// MODAL DE PERFIL NO HEADER
// toggleUserMenu — permanece simples, mas defensivo
function toggleUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    if (!dropdown) return;
    dropdown.classList.toggle('show');
}
window.toggleUserMenu = toggleUserMenu;

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
        btn.setAttribute(
            'aria-expanded',
            document.getElementById('userDropdown')?.classList.contains('show')
                ? 'true'
                : 'false'
        );
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