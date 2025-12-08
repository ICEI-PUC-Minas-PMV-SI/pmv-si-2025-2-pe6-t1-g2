import { API_SABERMAIS_URL } from "../config/apiConfig.js";

(async function () {
  const token = localStorage.getItem("jwtToken"); //Verifica se tem o JWT Token no localStorage

  if (!token) {
    alert("Ops! É necessário fazer login para continuar.");
    window.location.href = "../login.html"; // Se não tiver token, redireciona para login
    return;

  } else {
    try {
      const response = await fetch(`${API_SABERMAIS_URL}/Usuarios/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        localStorage.removeItem("jwtToken");
        window.location.href = "../login.html";
        return;
      }

      const user = await response.json();
      console.log(user);

      const idUsuario = user.id;

      const info = await fetch(`${API_SABERMAIS_URL}/Usuarios/${idUsuario}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const dadosUser = await info.json(); //Retorna as infos do usuário logado
      const buttonPerfil = document.getElementById("editPerfil"); //Botão Editar Dados do menu
      const buttonPerfilHome = document.getElementById("editarPerfilHome");

      if (dadosUser.tipo == 1) {
        const buttonDashboard = document.getElementById("buttonDashboard"); //Botão Dashboard do menu
        buttonDashboard.classList.remove("hidden");
        
        buttonPerfil.href = "../teachers/editar-perfil.html";
        buttonPerfilHome.href = "../teachers/editar-perfil.html";

      } if (dadosUser.tipo == 0) {
        buttonDashboard.classList.add("hidden");
        buttonPerfil.href = "../student/editar-perfil.html";
        buttonPerfilHome.href = "../student/editar-perfil.html";
      }

      console.log(dadosUser);
      return dadosUser; // retorna o objeto criado, se a API devolver
      //await carregarProfessor(dadosUser);

    }
    catch (error) {
      console.error("Erro ao verificar autenticação:", error);
      alert("Erro ao verificar autenticação.");
      localStorage.removeItem("jwtToken");
      window.location.href = "../login.html";
    }
  }
})();