import React, { useEffect, useState } from 'react'

function calcOrundum(e) {
  const op = parseInt(e.origPrime) || 0
  const hh = parseInt(e.hhPermits) || 0
  return op * 180 + hh * 600
}

export default function App() {
  const [events, setEvents] = useState([])
  const [selected, setSelected] = useState(new Set())

  useEffect(() => {
    fetch('/events.json')
      .then(r => r.json())
      .then(setEvents)
      .catch(console.error)
  }, [])

  const toggle = (idx) => {
    const copy = new Set(selected)
    if (copy.has(idx)) copy.delete(idx)
    else copy.add(idx)
    setSelected(copy)
  }

  const total = Array.from(selected).reduce((acc, id) => {
    const ev = events[id]
    if (!ev) return acc
    return acc + calcOrundum(ev)
  }, 0)

  return (
    <div style={{ padding: 18, fontFamily: 'Arial, sans-serif' }}>
      <h1>Arknights Events</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#eee', textAlign: 'left' }}>
            <th style={{ width: 110 }}>Image</th>
            <th>Name</th>
            <th style={{ width: 120 }}>Type</th>
            <th style={{ width: 200 }}>Dates</th>
            <th style={{ width: 80 }}>OP</th>
            <th style={{ width: 120 }}>HH Permits</th>
            <th style={{ width: 120 }}>Orundum</th>
            <th style={{ width: 80 }}>Select</th>
          </tr>
        </thead>
        <tbody>
          {events.map((e, idx) => (
            <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: 6 }}>
                {e.image ? <img src={e.image} alt={e.name} style={{ width: 100, height: 'auto' }} /> : null}
              </td>
              <td>{e.link ? <a href={e.link} target="_blank" rel="noreferrer">{e.name}</a> : e.name}</td>
              <td>{e.type || ''}</td>
              <td>{e.start === 'TBD' ? 'TBD' : `${e.start} — ${e.end}`}</td>
              <td>{e.origPrime != null ? String(e.origPrime) : ''}</td>
              <td>{e.hhPermits != null ? String(e.hhPermits) : ''}</td>
              <td>{calcOrundum(e)}</td>
              <td><input type="checkbox" checked={selected.has(String(idx))} onChange={() => toggle(String(idx))} /></td>
            </tr>
          ))}

          {/* Footer row */}
          <tr style={{ borderTop: '2px solid #ccc' }}>
            <td><strong>Total selected Orundum</strong></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td style={{ fontWeight: 700 }}>{total}</td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
