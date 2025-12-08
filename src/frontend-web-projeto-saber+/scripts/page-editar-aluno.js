const mockApiData = {
  nome: "ALUNO A",
  email: "aluno@gmail.com",
  password: "121",
  cpf: "203.411.060-97",
  tipo: "aluno",
  descricao: "Sou um aluno",
};

// carregar dados do backend
function loadData(data) {
  document.getElementById('nome').value = data.nome;
  document.getElementById('email').value = data.email;
  document.getElementById('senha').value = data.password;
  document.getElementById('cpf').value = data.cpf;
  document.getElementById('tipo').value = data.tipo;
  document.getElementById('descricao').value = data.descricao;
}

loadData(mockApiData);

document.getElementById('saveBtn').addEventListener('click', () => {
  const saveObj = {
    nome: document.getElementById('nome').value,
    email: document.getElementById('email').value,
    password: document.getElementById('senha').value,
    cpf: document.getElementById('cpf').value,
    tipo: document.getElementById('tipo').value,
    descricao: document.getElementById('descricao').value,
  };
  console.log('Salvar editar:', saveObj);
  alert("Salvo com sucesso!");
});

if (!document.getElementById('editForm')) {
  console.warn('Página sem formulário de edição, script ignorado.');
}