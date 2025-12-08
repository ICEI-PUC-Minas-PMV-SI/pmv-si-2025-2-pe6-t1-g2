// /* /scripts/disponibilidade.js */
import * as H from './helpers.js';

export default function DisponibilidadeModule({ rowsSelector, addBtnSelector, clearBtnSelector, summarySelector, weekDays } = {}) {
  const rowsEl = document.querySelector(rowsSelector);
  const addBtn = document.querySelector(addBtnSelector);
  const clearBtn = document.querySelector(clearBtnSelector);
  const summaryEl = document.querySelector(summarySelector);
  const addModeBtn = document.getElementById('addModeBtn');
  const clearModeBtn = document.getElementById('clearModeBtn');
  let state = { rows: [] };
  let nextId = Date.now();

  function createRowObj(day = '1', start = '08:00', durationMin = 60) {
    //const id = ++nextId;
    return { day: String(day), start, end: H.addMinutesToTimeString(start, durationMin) };
  }

  function renderAll() {
    const listDays = [
      { val: 0, label: 'Segunda' },
      { val: 1, label: 'Terça' },
      { val: 2, label: 'Quarta' },
      { val: 3, label: 'Quinta' },
      { val: 4, label: 'Sexta' },
      { val: 5, label: 'Sábado' },
      { val: 6, label: 'Domingo' }
    ];

    rowsEl.innerHTML = '';
    state.rows.forEach(r => {
      const row = document.createElement('div');
      row.className = 'row';
      //row.dataset.id = r.id;

      const sel = document.createElement('select');
      sel.className = 'day input-field';
      listDays.forEach(d => {
        const o = document.createElement('option');
        o.value = d.val;
        o.textContent = d.label;
        if (String(d.val) === String(r.day)) o.selected = true;
        sel.appendChild(o);
      });

      const start = document.createElement('input'); start.type = 'time'; start.value = r.start; start.className = 'start input-field';
      const end = document.createElement('input'); end.type = 'time'; end.value = r.end; end.className = 'end input-field';
      const meta = document.createElement('div'); meta.className = 'meta'; meta.textContent = `${(H.durationMinutes(r.start, r.end) / 60).toFixed(1)}h`;
      const del = document.createElement('button'); del.className = 'delete-btn'; del.setAttribute('aria-label', 'Remover horário'); del.innerHTML = '🗑️';
      del.addEventListener('click', () => { state.rows = state.rows.filter(x => x.id !== r.id); renderAll(); });

      [sel, start, end].forEach(inp => inp.addEventListener('change', () => {
        r.day = sel.value; r.start = start.value; r.end = end.value; renderAll();
      }));

      row.append(sel, start, end, meta, del);
      rowsEl.appendChild(row);
    });
    updateSummary();
  }

  function updateSummary() {
    // Soma o total de minutos entre todos os intervalos
    const totalMin = state.rows.reduce((acc, r) => acc + H.durationMinutes(r.start, r.end), 0);

    // Cada 60 minutos = 1 aula
    const totalAulas = Math.floor(totalMin / 60);

    // Atualiza o texto
    if (summaryEl) {
      summaryEl.textContent = `Total de aulas: ${totalAulas} (${Math.floor(totalMin / 60)}h semanais)`;
    }
  }

  function addRow() { state.rows.push(createRowObj()); renderAll(); }
  function clearAll() { if (confirm('Limpar todos os horários?')) { state.rows = []; renderAll(); } }

  function setDisponibilidade(list) {
    if (!Array.isArray(list)) {
      console.warn('setDisponibilidade: lista inválida', list);
      return;
    }

    state.rows = list.map((d, i) => ({
      id: d.id ?? Date.now() + i, // se não tiver id, cria um único diferente para cada linha
      day: d.DiaDaSemana,
      start: (d.HoraInicio ?? '00:00').slice(0, 5), // corta segundos
      end: (d.HoraFim ?? '00:00').slice(0, 5)
    }));

    console.log(state.rows.day)
    renderAll();
  }

  function getDisponibilidade() { return state.rows.map(r => ({ id: r.id, DiaDaSemana: parseInt(r.day), HoraInicio: r.start + ':00', HoraFim: r.end + ':00' })); }

  addBtn && addBtn.addEventListener('click', addRow);
  clearBtn && clearBtn.addEventListener('click', clearAll);

  // init with a default row if empty
  if (state.rows.length === 0) state.rows.push(createRowObj());

  return { renderAll, addRow, clearAll, setDisponibilidade, getDisponibilidade };
}


// const dispon = DisponibilidadeModule({
//   addBtnSel: '#addBtn',
//   clearBtnSel: '#clearBtn',
//   rowsSel: '#rows',
//   summarySel: '#summary'
// });


