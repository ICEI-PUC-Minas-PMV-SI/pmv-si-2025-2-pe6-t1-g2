import { API_SABERMAIS_URL } from "../config/apiConfig.js";

export default function AreasModule({
  inputSel,
  addBtnSel,
  suggestionsSel,
  tagListSel,
  mockAreas = [],
  apiAreas = []
} = {}) {

  console.log("mock: ", mockAreas);

  const areaInput = document.querySelector(inputSel);
  const addAreaBtn = document.querySelector(addBtnSel);
  const suggestionsBox = document.querySelector(suggestionsSel);
  const tagList = document.querySelector(tagListSel);

  // ==========================================================
  // RENDER TAGS
  // ==========================================================
  async function renderTags() {
    tagList.innerHTML = '';

    for (const area of mockAreas) {
      const areaNome = await buscarNomeArea(area.areaId);

      const tag = document.createElement('div');
      tag.className = 'tag';
      tag.innerHTML = `
        <span>${areaNome}</span>
        <button aria-label="Remover área" data-id="${area.areaId}">&times;</button>
      `;

      tag.querySelector('button').addEventListener('click', () => {
        removeAreaById(area.areaId);
      });

      tagList.appendChild(tag);
    }
  }

  // ==========================================================
  // ADICIONAR ÁREA
  // ==========================================================
  async function addAreaByName(name, id) {
    // verificar duplicados
    if (mockAreas.some(a => a.areaId === id)) return;

    mockAreas.push({ areaId: id, nome: name });

    renderTags();
  }

  // ==========================================================
  // REMOVER ÁREA
  // ==========================================================
  function removeAreaById(id) {
    const index = mockAreas.findIndex(a => a.areaId === id);
    if (index !== -1) mockAreas.splice(index, 1);
    renderTags();
  }

  // ==========================================================
  // SET / GET AREAS
  // ==========================================================
  function setSelectedAreas(list) {
    mockAreas.length = 0;
    (list || []).forEach(i => mockAreas.push(i));
    renderTags();
  }

  function getSelectedAreas() {
    return mockAreas.slice();
  }

  // ==========================================================
  // BUSCAR ÁREAS (API)
  // ==========================================================
  async function fetchAreas() {
    const token = localStorage.getItem("jwtToken");

    const response = await fetch(`${API_SABERMAIS_URL}/Areas`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Erro ao buscar áreas");
    return await response.json();
  }

  async function buscarNomeArea(idArea) {
    const token = localStorage.getItem("jwtToken");

    try {
      const resp = await fetch(`${API_SABERMAIS_URL}/Areas/${idArea}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!resp.ok) throw new Error("Erro ao buscar nome da área");

      const area = await resp.json();
      return area.nome || `Área ${idArea}`;

    } catch (erro) {
      console.error("Erro ao buscar nome da matéria:", erro);
      return false;
    }
  }

  // ==========================================================
  // AUTOCOMPLETE
  // ==========================================================
  areaInput.addEventListener('input', async () => {
    const q = areaInput.value.toLowerCase().trim();
    suggestionsBox.innerHTML = '';

    if (!q) {
      suggestionsBox.classList.add('hidden');
      return;
    }

    try {
      const areas = await fetchAreas();
      console.log("Áreas da API:", areas);

      const areasFiltradas = areas.filter(a => {
        const nome = (a.nome ?? a.nomeArea ?? a.Nome ?? "").toLowerCase();
        return nome.includes(q);
      });

      if (areasFiltradas.length === 0) {
        suggestionsBox.classList.add('hidden');
        return;
      }

      areasFiltradas.forEach(area => {
        const nome = (area.nome ?? area.nomeArea ?? area.Nome);
        const id = (area.id ?? area.idArea ?? area.areaId);

        const item = document.createElement('div');
        item.className = 'suggestion-item';
        item.textContent = nome;

        item.addEventListener('click', async () => {
          areaInput.value = nome;
          await addAreaByName(nome, id);
          suggestionsBox.classList.add('hidden');
        });

        suggestionsBox.appendChild(item);
      });

      suggestionsBox.classList.remove('hidden');

    } catch (err) {
      console.error('Erro ao carregar áreas:', err);
      suggestionsBox.classList.add('hidden');
    }
  });

  // FECHAR SUGESTÕES
  document.addEventListener('click', (e) => {
    if (!suggestionsBox.contains(e.target) && e.target !== areaInput) {
      suggestionsBox.classList.add('hidden');
    }
  });

  // render inicial
  renderTags();

  return {
    renderTags,
    addAreaByName,
    getSelectedAreas,
    setSelectedAreas,
    removeAreaById
  };
}
