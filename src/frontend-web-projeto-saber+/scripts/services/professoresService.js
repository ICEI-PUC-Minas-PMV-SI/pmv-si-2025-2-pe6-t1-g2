import { API_SABERMAIS_URL } from "../config/apiConfig.js";
import { verifyAuth } from "../services/autenticaçãoService.js";

// GET: /api/Professores
async function buscarTodosProfessores() {
  const url = `${API_SABERMAIS_URL}/Professores`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Erro ao buscar Professores! Status: ${response.status}`);
    }

    const professores = await response.json();
    console.log("Professores encontrados:", professores);
    //renderizarDadosNaTela(professores); // Exibir na tela

  } catch (error) {
    console.error("Falha na requisição GET (Professores):", error);
    // Ex: Mostrar uma mensagem de erro na tela
  }
}

// POST: /api/Professores
export async function createProfessor(payload) {
  const response = await fetch(`${API_SABERMAIS_URL}/professores`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Erro ao cadastrar professor.");
  }

  return response.json(); // retorna o objeto criado, se a API devolver
}

async function getLoggedUser() {
  const token = localStorage.getItem("jwtToken");
  if (!token) return null;

  const response = await fetch(`${API_SABERMAIS_URL}/Usuarios/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) return null;

  const user = await response.json();
  console.log("Usuário logado:", user);
  return user;
}

