// Load and display future Arknights events from events.json
console.log('Loading events from events.json...');

fetch('events.json')
  .then(response => {
    console.log('Fetch response received:', response.status);
    if (!response.ok) {
      throw new Error('Failed to load events.json');
    }
    return response.json();
  })
  .then(events => {
    console.log('Loaded events:', events);
    // Sort events by start date, with TBD at the end
    events.sort((a, b) => {
      if (a.start === 'TBD' && b.start === 'TBD') return 0;
      if (a.start === 'TBD') return 1;
      if (b.start === 'TBD') return -1;
      return new Date(a.start) - new Date(b.start);
    });
    // Populate ul
    const ul = document.querySelector('ul');
    if (events.length === 0) {
      ul.innerHTML = '<li>No events found.</li>';
      console.log('No events to display, added placeholder');
    } else {
      events.forEach(e => {
        const li = document.createElement('li');
        const dateText = e.start === 'TBD' ? 'Date: TBD' : `${e.start} to ${e.end}`;
        const imageHtml = e.image ? `<img src="${e.image}" alt="${e.name}" style="width: 100px; height: auto; margin-right: 10px;">` : '';
        li.innerHTML = `${imageHtml}<strong>${e.name}</strong> (${e.type}) - ${dateText}`;
        ul.appendChild(li);
        console.log('Added event to list:', e.name);
      });
    }
  })
  .catch(err => {
    console.error('Error loading events:', err);
    const ul = document.querySelector('ul');
    ul.innerHTML = '<li>Error loading events. Check console for details.</li>';
  });