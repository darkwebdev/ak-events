import React, { useEffect, useState } from 'react'
import './App.css'

function calcOrundum(e) {
  const op = parseInt(e.origPrime) || 0
  const hh = parseInt(e.hhPermits) || 0
  return op * 180 + hh * 600
}

function normalizeImageSrc(raw) {
  if (!raw) return null;
  // If it's already a remote URL, just encode and return.
  if (raw.startsWith('http')) return encodeURI(raw);
  const BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL) ? import.meta.env.BASE_URL : '/';
  // If it's an absolute path starting with '/' and the BASE is not root,
  // prefix it with BASE so GitHub Pages project sites resolve correctly.
  if (raw.startsWith('/')) {
    if (BASE === '/' || raw.startsWith(BASE)) return encodeURI(raw);
    return encodeURI(BASE + raw.replace(/^\//, ''));
  }
  // Otherwise we expect stored images to live under /data/images/
  return encodeURI(BASE + 'data/images/' + raw.replace(/^\//, ''));
}

export default function App() {
  const [events, setEvents] = useState([])
  const [selected, setSelected] = useState(new Set())

  useEffect(() => {
    const BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL) ? import.meta.env.BASE_URL : '/';
    fetch(BASE + 'data/events.json')
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
    <div className="ak-root">
      <table className="ak-table">
        <thead>
          <tr className="ak-thead-tr">
          <th className="ak-th col-img">Image</th>
          <th className="ak-th">Name</th>
          <th className="ak-th col-type">Type</th>
          <th className="ak-th col-dates">Global Dates</th>
          <th className="ak-th col-op">OP</th>
          <th className="ak-th col-hh">HH Permits</th>
          <th className="ak-th col-orundum">Orundum</th>
          <th className="ak-th col-select">Select</th>
          </tr>
        </thead>
        <tbody>
          {events.map((e, idx) => (
            <tr key={idx} className="ak-row">
              <td className="ak-img-td">
                {(() => {
                  const src = normalizeImageSrc(e.image);
                  return src ? <img src={src} alt={e.name} className="ak-img" /> : null;
                })()}
              </td>
              <td>{e.link ? <a href={e.link} target="_blank" rel="noreferrer">{e.name}</a> : e.name}</td>
              <td>{e.type || ''}</td>
              <td>{(() => {
                // Display rules: if start is falsy/null -> show nothing.
                // If start exists but end is falsy -> show start only.
                // If both exist -> show start — end.
                if (!e.start) return '';
                if (!e.end) return e.start;
                return `${e.start} — ${e.end}`;
              })()}</td>
              <td>{e.origPrime != null ? String(e.origPrime) : ''}</td>
              <td>{e.hhPermits != null ? String(e.hhPermits) : ''}</td>
              <td>{calcOrundum(e)}</td>
              <td><input type="checkbox" checked={selected.has(String(idx))} onChange={() => toggle(String(idx))} /></td>
            </tr>
          ))}
        </tbody>
    <tfoot className="ak-tfoot">
      <tr>
        <td colSpan={2} className="ak-strong"><strong>Total Orundum</strong></td>
        <td className="ak-cell"></td>
        <td className="ak-cell"></td>
        <td className="ak-cell"></td>
        <td className="ak-cell"></td>
        <td className="ak-value">{total}</td>
        <td className="ak-cell"></td>
      </tr>
      <tr>
        <td colSpan={2} className="ak-strong"><strong>Total Pulls</strong></td>
        <td className="ak-cell"></td>
        <td className="ak-cell"></td>
        <td className="ak-cell"></td>
        <td className="ak-cell"></td>
        <td className="ak-value">{Math.floor(total / 600)}</td>
        <td className="ak-cell"></td>
      </tr>
    </tfoot>
      </table>
    </div>
  )
}
