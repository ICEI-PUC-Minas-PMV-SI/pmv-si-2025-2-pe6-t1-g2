import AreasModule from './cadast/areas.js';
import DisponibilidadeModule from "./cadast/disponibilidade.js";
import { API_SABERMAIS_URL } from "./config/apiConfig.js";

// SCRIPT DO PAGE CADASTRO

async function carregarAreasApi() {
    const token = localStorage.getItem("jwtToken");

    const resp = await fetch(`${API_SABERMAIS_URL}/Areas`, {
        headers: { Authorization: `Bearer ${token}` }
    });

    return await resp.json();
}

async function carregarIdProfessor () {
    const novoProf = await fetch(`${API_SABERMAIS_URL}/Professores`);
    const professor = await novoProf.json();
    const professorId = professor.length - 1;
    return professorId;
}

const weekDays = [
    { val: '0', label: 'Segunda' },
    { val: '1', label: 'Terça' },
    { val: '2', label: 'Quarta' },
    { val: '3', label: 'Quinta' },
    { val: '4', label: 'Sexta' },
    { val: '5', label: 'Sábado' },
    { val: '6', label: 'Domingo' }
];

const areasList = await carregarAreasApi();

const areas = AreasModule({
    inputSel: '#areaInput',
    addBtnSel: '#addAreaBtn',
    suggestionsSel: '#suggestionsBox',
    tagListSel: '#tagList',
    mockAreas: [],           // começa vazio
    apiAreas: areasList       // ← as áreas reais da API
});

const dispo = DisponibilidadeModule({ rowsSelector: '#rows', addBtnSelector: '#addBtn', clearBtnSelector: '#clearBtn', summarySelector: '#summary', weekDays });

document.getElementById('saveBtn').addEventListener('click', async () => {

    
    const areasSelecionadas = areas.getSelectedAreas().map(a => a.areaId);
    const professorId = await carregarIdProfessor();

    // Para cada área, criar e enviar um payload separado
    for (const areaId of areasSelecionadas) {

        const payloadArea = {
            professorId,
            areaId
        };

        console.log("Enviando para API:", payloadArea);

        await salvarAreas(payloadArea);
    }

    // const disponibilidade = dispo.getDisponibilidade().map(d => ({
    //     diaDaSemana: d.DiaDaSemana,
    //     horaInicio: d.HoraInicio,
    //     horaFim: d.HoraFim
    // }));


    // const payloadHorarios = {
    //     disponibilidades: disponibilidade
    // };

    console.log("Enviando para API:", payloadArea);

});

//FUNÇÃO PARA ENVIAR PARA A API
async function salvarAreas(payload) {

    const idProfessor = payload.professorId;

    try {
        const response = await fetch(`${API_SABERMAIS_URL}/Professores/${idProfessor}/areas`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        // SE FALHOU → MOSTRA ERRO REAL DA API
        if (!response.ok) {
            const texto = await response.text();
            console.error("🔴 ERRO DA API:", texto);
            alert("Ops! Não foi possível salvar os dados.");
            return;
        }

        alert("Cadastro finalizado com sucesso!");
    }
    catch (erro) {
        console.error("🔴 ERRO FETCH:", erro);
        alert("Ops! Erro de conexão com a API.");
    }
}


