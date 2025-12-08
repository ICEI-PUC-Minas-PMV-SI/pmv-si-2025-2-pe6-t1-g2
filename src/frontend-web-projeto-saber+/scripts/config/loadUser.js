import { API_SABERMAIS_URL } from "../config/apiConfig.js";
import { carregarPerfilProfessor } from "../services/editUserService.js"
import { carregarPerfilAluno } from "../services/editUserService.js"

export async function loadUserProfile() {
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

            if (response.status === 401) {
                // Não autorizado → token inválido ou expirado
                alert("Sessão expirada. Faça login novamente.");
                window.location.href = "../login.html"
                setTimeout(() => window.location.href = "../login.html", 1000);
                return;
            }

            if (response.status === 404) {
                alert("Usuário não encontrado.");
                window.location.href = "../login.html"
                return;
            }

            if (!response.ok) {
                alert("Erro ao carregar informações do usuário.");
                window.location.href = "../login.html"
                return;
            }

            const user = await response.json();
            console.log(response);
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
            const tipoUsuario = dadosUser.tipo;
            const buttonDashboard = document.getElementById("buttonDashboard"); //Botão Dashboard do menu

            if (tipoUsuario == 1) {
                buttonDashboard.classList.remove("hidden");

                await carregarPerfilProfessor(dadosUser);

            } if (tipoUsuario == 0) {
                buttonDashboard.classList.add("hidden");

                await carregarPerfilAluno(dadosUser);
            }
             return dadosUser;
        }
        catch (error) {
            console.error("Erro ao verificar autenticação:", error);
            alert("Erro ao verificar autenticação.");
            localStorage.removeItem("jwtToken");
            //window.location.href = "../login.html";
        }
    }
};