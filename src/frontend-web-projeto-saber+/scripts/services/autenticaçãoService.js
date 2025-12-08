import { API_SABERMAIS_URL } from "../config/apiConfig.js";

export async function verifyAuth() {
  const token = localStorage.getItem("jwtToken");

  // Se não tiver token, redireciona para login
  if (!token) {
    window.location.href = "../login.html";
    return;
  }

  try {
    // Faz a verificação do token com o backend
    const response = await fetch(`${API_SABERMAIS_URL}/Usuarios/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Se o token for inválido, expirado ou o backend não responder 200
    if (!response.ok) {
      localStorage.removeItem("jwtToken");
      window.location.href = "../login.html";
      return;
    }

    // Token válido → pega os dados do usuário logado
    const user = await response.json();
    await redirecionarUsuarioLogado(user);
    return user;

  } catch (error) {
    console.error("Erro ao verificar autenticação:", error);
    localStorage.removeItem("jwtToken");
    window.location.href = "../login/login.html";
  }
};

export async function redirecionarUsuarioLogado(usuario) {
  try {
    const response = await fetch(`${API_SABERMAIS_URL}/Usuarios/${usuario.id}`, {
      method: "GET"
    });
    const userDados = response.json();
    if(userDados.tipo == 0) {
      console.log("Aluno");
    } if (userDados.tipo == 1) {
      console.log("Professor");
    }

  } catch(error) {
    console.error("Erro:", error);
  }
  
};
