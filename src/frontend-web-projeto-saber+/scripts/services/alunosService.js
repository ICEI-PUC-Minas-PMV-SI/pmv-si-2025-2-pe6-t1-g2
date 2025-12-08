import { API_SABERMAIS_URL } from "../config/apiConfig.js";

// POST: /api/Alunos
export async function createAluno(payload) {
    const response = await fetch(`${API_SABERMAIS_URL}/Alunos`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Erro ao cadastrar aluno.");
    }

    return response.json(); // retorna o objeto criado, se a API devolver
}