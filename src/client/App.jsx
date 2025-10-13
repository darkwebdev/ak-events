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
    fetch('/data/events.json')
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
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#eee', textAlign: 'left' }}>
            <th style={{ width: 110, padding: 8 }}>Image</th>
            <th style={{ padding: 8 }}>Name</th>
            <th style={{ width: 120, padding: 8 }}>Type</th>
            <th style={{ width: 200, padding: 8 }}>Dates</th>
            <th style={{ width: 80, padding: 8 }}>OP</th>
            <th style={{ width: 120, padding: 8 }}>HH Permits</th>
            <th style={{ width: 120, padding: 8 }}>Orundum</th>
            <th style={{ width: 80, padding: 8 }}>Select</th>
          </tr>
        </thead>
        <tbody>
          {events.map((e, idx) => (
            <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: 6 }}>
                {e.image ? (() => {
                  let img = e.image
                  // normalize different image path formats to absolute paths under /data/
                  if (!img) {
                    img = ''
                  } else if (img.startsWith('http')) {
                    // leave remote URLs alone
                  } else if (img.startsWith('/data/')) {
                    // already correct
                  } else if (img.startsWith('data/')) {
                    img = '/' + img // turn into '/data/...'
                  } else if (img.startsWith('/images/')) {
                    // move /images/... to /data/images/ when possible
                    img = '/data' + img
                  } else if (!img.startsWith('/')) {
                    // relative path like 'images/foo.png' or 'images/foo'
                    img = '/data/' + img.replace(/^\//, '')
                  }
                  return <img src={img} alt={e.name} style={{ width: 100, height: 'auto' }} />
                })() : null}
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
        </tbody>
    <tfoot style={{ borderTop: '2px solid #ccc' }}>
      <tr>
        <td colSpan={2} style={{ padding: 8 }}><strong>Total Orundum</strong></td>
        <td style={{ padding: 8 }}></td>
        <td style={{ padding: 8 }}></td>
        <td style={{ padding: 8 }}></td>
        <td style={{ padding: 8 }}></td>
        <td style={{ fontWeight: 700, padding: 8 }}>{total}</td>
        <td style={{ padding: 8 }}></td>
      </tr>
      <tr>
        <td colSpan={2} style={{ padding: 8 }}><strong>Total Pulls</strong></td>
        <td style={{ padding: 8 }}></td>
        <td style={{ padding: 8 }}></td>
        <td style={{ padding: 8 }}></td>
        <td style={{ padding: 8 }}></td>
        <td style={{ fontWeight: 700, padding: 8 }}>{Math.floor(total / 600)}</td>
        <td style={{ padding: 8 }}></td>
      </tr>
    </tfoot>
      </table>
    </div>
  )
}
