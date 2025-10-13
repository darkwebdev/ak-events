// Load and display future Arknights events from events.json
console.log('Loading events from events.json...');

function calcOrundum(e) {
  const op = parseInt(e.origPrime) || 0;
  const hh = parseInt(e.hhPermits) || 0;
  return op * 180 + hh * 600;
}

function updateTotal(selectedIds, eventsMap) {
  let sum = 0;
  for (const id of selectedIds) {
    const ev = eventsMap[id];
    if (ev) sum += calcOrundum(ev);
  }
  // Update table total cell (if present)
  if (typeof tableTotalOrundTd !== 'undefined' && tableTotalOrundTd && tableTotalOrundTd instanceof HTMLElement) {
    tableTotalOrundTd.textContent = String(sum);
    tableTotalOrundTd.style.fontWeight = '700';
  }
}

// Reference to the table's total Orundum cell (if table is present)
let tableTotalOrundTd = null;

document.addEventListener('DOMContentLoaded', () => {
  fetch('events.json')
  .then(response => {
    if (!response.ok) throw new Error('Failed to load events.json');
    return response.json();
  })
  .then(events => {
    // Sort events by start date, with TBD at the end
    events.sort((a, b) => {
      if (a.start === 'TBD' && b.start === 'TBD') return 0;
      if (a.start === 'TBD') return 1;
      if (b.start === 'TBD') return -1;
      return new Date(a.start) - new Date(b.start);
    });

  let tbody = document.querySelector('#events-table tbody');
  // if table not present (older index.html), try to find a UL fallback
  const ul = document.querySelector('ul');
  if (!tbody && !ul) throw new Error('No events container found in DOM');
    const eventsMap = {};
    const selected = new Set();

    events.forEach((e, idx) => {
      const row = document.createElement('tr');
      row.style.borderBottom = '1px solid #eee';

      const imgTd = document.createElement('td');
      imgTd.style.padding = '6px';
      imgTd.innerHTML = e.image ? `<img src="${e.image}" alt="${e.name}" style="width:100px; height:auto;">` : '';

      const nameTd = document.createElement('td');
      nameTd.innerHTML = e.link ? `<a href="${e.link}" target="_blank">${e.name}</a>` : e.name;

      const typeTd = document.createElement('td');
      typeTd.textContent = e.type || '';

      const datesTd = document.createElement('td');
      datesTd.textContent = e.start === 'TBD' ? 'TBD' : `${e.start} — ${e.end}`;

      const opTd = document.createElement('td');
      opTd.textContent = e.origPrime != null ? String(e.origPrime) : '';

      const hhTd = document.createElement('td');
      hhTd.textContent = e.hhPermits != null ? String(e.hhPermits) : '';

      const orundTd = document.createElement('td');
      const orund = calcOrundum(e);
      orundTd.textContent = String(orund);

      const selectTd = document.createElement('td');
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.dataset.eventId = String(idx);
      cb.addEventListener('change', (ev) => {
        const id = ev.target.dataset.eventId;
        if (ev.target.checked) selected.add(id); else selected.delete(id);
        updateTotal(selected, eventsMap);
      });
      selectTd.appendChild(cb);

      row.appendChild(imgTd);
      row.appendChild(nameTd);
      row.appendChild(typeTd);
      row.appendChild(datesTd);
      row.appendChild(opTd);
      row.appendChild(hhTd);
      row.appendChild(orundTd);
      row.appendChild(selectTd);

      if (tbody) tbody.appendChild(row);
      else if (ul) {
        // fallback: append as list item
        const li = document.createElement('li');
        li.innerHTML = `${e.image ? `<img src="${e.image}" style="width:100px; height:auto;">` : ''} <strong>${e.name}</strong> (${e.type}) - ${e.start === 'TBD' ? 'TBD' : `${e.start} — ${e.end}`} ${e.origPrime || 0} OP ${e.hhPermits || 0} HH`;
        ul.appendChild(li);
      }

      eventsMap[String(idx)] = e;
    });

    // After populating rows, if we have a table body, append a final bold total row
    if (tbody) {
      const totalRow = document.createElement('tr');
      totalRow.style.borderTop = '2px solid #ccc';

      // First cell: label (Total Orundum)
      const labelTd = document.createElement('td');
      labelTd.innerHTML = '<strong>Total Orundum</strong>';
      labelTd.style.padding = '6px';
      totalRow.appendChild(labelTd);

      // Create empty cells for Name, Type, Dates, OP, HH Permits (5 cells)
      for (let i = 0; i < 5; i++) {
        const emptyTd = document.createElement('td');
        emptyTd.textContent = '';
        totalRow.appendChild(emptyTd);
      }

      // Orundum total cell (bold)
      const totalOrundTd = document.createElement('td');
      totalOrundTd.textContent = '0';
      totalOrundTd.style.fontWeight = '700';
      totalRow.appendChild(totalOrundTd);

      // Empty cell for Select column
      const emptySelectTd = document.createElement('td');
      emptySelectTd.textContent = '';
      totalRow.appendChild(emptySelectTd);

      tbody.appendChild(totalRow);

      // Keep a reference so updateTotal can update this cell
      tableTotalOrundTd = totalOrundTd;
    }

    // Init total
    updateTotal(selected, eventsMap);
  })
  .catch(err => {
    console.error('Error loading events:', err);
    const tbodyFallback = document.querySelector('#events-table tbody');
    const ulFallback = document.querySelector('ul');
    if (tbodyFallback) tbodyFallback.innerHTML = '<tr><td colspan="8">Error loading events. Check console for details.</td></tr>';
    else if (ulFallback) ulFallback.innerHTML = '<li>Error loading events. Check console for details.</li>';
  });
});