import { API_SABERMAIS_URL } from "../config/apiConfig.js";

// GET: /api/Agendamentos
async function buscarTodosAgendamentos() {
    const url = `${API_SABERMAIS_URL}/Agendamentos`;

    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Erro ao buscar Agendamentos! Status: ${response.status}`);
        }

        const agendamentos = await response.json();
        console.log("Agendamentos encontrados:", agendamentos);
        //renderizarDadosNaTela(agendamentos); // Exibir na tela
        
    } catch (error) {
        console.error("Falha na requisição GET (Agendamentos):", error);
        // Ex: Mostrar uma mensagem de erro na tela
    }
}

// Exemplo de uso
buscarTodosAgendamentos();