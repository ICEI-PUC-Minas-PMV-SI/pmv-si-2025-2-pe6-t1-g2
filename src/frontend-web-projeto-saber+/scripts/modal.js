const modal = document.getElementById('modal');
const openModal = document.getElementById('openModal');
const closeModal = document.getElementById('closeModal');

openModal.addEventListener('click', () => {
  modal.style.display = 'flex';
});

closeModal.addEventListener('click', () => {
  modal.style.display = 'none';
});

// Fechar ao clicar fora do conteúdo
window.addEventListener('click', (e) => {
  if (e.target === modal) modal.style.display = 'none';
});


const modalCadastro = document.getElementById('modalCadastro');
const openModalCadastro = document.getElementById('openModalCadastro');
const closeModalCadastro = document.getElementById('closeModalCadastro');

openModalCadastro.addEventListener('click', () => {
  modalCadastro.style.display = 'flex';
});

closeModalCadastro.addEventListener('click', () => {
  modalCadastro.style.display = 'none';
});

// Fechar ao clicar fora do conteúdo
window.addEventListener('click', (e) => {
  if (e.target === modalCadastro) modalCadastro.style.display = 'none';
});