function getData(key, fallback){
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch(e) {
    console.error('storage get failed', e);
    return fallback;
  }
}

function setData(key, value){
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch(e) {
    console.error('storage set failed', e);
  }
}

document.querySelectorAll('.tab-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
    document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('screen-' + btn.dataset.screen).classList.add('active');
  });
});

const bubbleColors = ['#FF6FA5','#9B6BF2','#5AC8F2','#4DE0C0','#FFCB4D','#FF9E7D'];

// ---------- diary ----------
async function renderDiary(){
  const entries = await getData('diary-entries', []);
  const list = document.getElementById('diary-list');
  if(entries.length === 0){ list.innerHTML = '<div class="empty">No entries yet — write the first one.</div>'; return; }
  const sorted = [...entries].sort((a,b)=> (b.date||'').localeCompare(a.date||''));
  list.innerHTML = sorted.map(e => `
    <div class="diary-entry">
      <div class="meta">
        <span><span class="author">${escapeHtml(e.author||'Someone')}</span> · ${formatDate(e.date)}</span>
        <button class="del-x" data-id="${e.id}">remove</button>
      </div>
      <p>${escapeHtml(e.text)}</p>
    </div>
  `).join('');
  list.querySelectorAll('.del-x').forEach(btn=>{
    btn.addEventListener('click', async ()=>{
      const all = await getData('diary-entries', []);
      await setData('diary-entries', all.filter(x=>x.id !== btn.dataset.id));
      renderDiary();
    });
  });
}
document.getElementById('d-add').addEventListener('click', async ()=>{
  const author = document.getElementById('d-author').value.trim();
  const date = document.getElementById('d-date').value;
  const text = document.getElementById('d-text').value.trim();
  if(!text) return;
  const all = await getData('diary-entries', []);
  all.push({ id: crypto.randomUUID(), author, date, text });
  await setData('diary-entries', all);
  document.getElementById('d-author').value='';
  document.getElementById('d-text').value='';
  renderDiary();
});

// ---------- timeline (growing bubble path) ----------
async function renderTimeline(){
  const items = await getData('timeline-milestones', []);
  const list = document.getElementById('timeline-list');
  const line = document.getElementById('tl-line');
  if(items.length === 0){
    line.style.display = 'none';
    list.innerHTML = '<div class="empty">No milestones yet — add the first one and the timeline will start growing.</div>';
    return;
  }
  line.style.display = 'block';
  const sorted = [...items].sort((a,b)=> (a.date||'').localeCompare(b.date||''));
  list.innerHTML = sorted.map((m, i) => {
    const side = i % 2 === 0 ? 'left' : 'right';
    const color = bubbleColors[i % bubbleColors.length];
    return `
    <div class="tl-item ${side}">
      <div class="tl-node" style="background:${color};"></div>
      <div class="tl-bubble">
        <button class="del-x tl-del" data-id="${m.id}">×</button>
        <div class="tl-date">${formatDate(m.date)}</div>
        <div class="tl-title">${escapeHtml(m.title)}</div>
        ${m.desc ? `<div class="tl-desc">${escapeHtml(m.desc)}</div>` : ''}
      </div>
    </div>`;
  }).join('');
  list.querySelectorAll('.del-x').forEach(btn=>{
    btn.addEventListener('click', async ()=>{
      const all = await getData('timeline-milestones', []);
      await setData('timeline-milestones', all.filter(x=>x.id !== btn.dataset.id));
      renderTimeline();
    });
  });
}
document.getElementById('t-add').addEventListener('click', async ()=>{
  const title = document.getElementById('t-title').value.trim();
  const date = document.getElementById('t-date').value;
  const desc = document.getElementById('t-desc').value.trim();
  if(!title) return;
  const all = await getData('timeline-milestones', []);
  all.push({ id: crypto.randomUUID(), title, date, desc });
  await setData('timeline-milestones', all);
  document.getElementById('t-title').value='';
  document.getElementById('t-desc').value='';
  renderTimeline();
});

// ---------- glossary ----------
async function renderGlossary(){
  const terms = await getData('glossary-terms', []);
  const list = document.getElementById('glossary-list');
  if(terms.length === 0){ list.innerHTML = '<div class="empty">No entries yet — add your first inside joke.</div>'; return; }
  const sorted = [...terms].sort((a,b)=> a.term.localeCompare(b.term));
  list.innerHTML = sorted.map(t => `
    <div class="term-card">
      <div class="term">${escapeHtml(t.term)} <button class="del-x" data-id="${t.id}" style="float:right;">×</button></div>
      <div class="def">${escapeHtml(t.def)}</div>
    </div>
  `).join('');
  list.querySelectorAll('.del-x').forEach(btn=>{
    btn.addEventListener('click', async (e)=>{
      e.stopPropagation();
      const all = await getData('glossary-terms', []);
      await setData('glossary-terms', all.filter(x=>x.id !== btn.dataset.id));
      renderGlossary();
    });
  });
}
document.getElementById('g-add').addEventListener('click', async ()=>{
  const term = document.getElementById('g-term').value.trim();
  const def = document.getElementById('g-def').value.trim();
  if(!term || !def) return;
  const all = await getData('glossary-terms', []);
  all.push({ id: crypto.randomUUID(), term, def });
  await setData('glossary-terms', all);
  document.getElementById('g-term').value='';
  document.getElementById('g-def').value='';
  renderGlossary();
});

// ---------- playlist wall ----------
const coverPalettes = [
  ['#FF6FA5', '#9B6BF2'],
  ['#5AC8F2', '#4DE0C0'],
  ['#FFCB4D', '#FF9E7D'],
  ['#9B6BF2', '#5AC8F2'],
  ['#FF9E7D', '#FF6FA5'],
  ['#4DE0C0', '#5AC8F2']
];
function hashStr(str){ let h=0; for(let i=0;i<str.length;i++){ h=(h*31+str.charCodeAt(i))>>>0; } return h; }

// ---------- playlist wall ----------

async function getAlbumArtwork(song, artist){
  try {
    const searchTerm = encodeURIComponent(`${song} ${artist}`);

    const response = await fetch(
      `https://itunes.apple.com/search?term=${searchTerm}&entity=song&limit=1`
    );

    const data = await response.json();

    if(data.results && data.results.length > 0){
      return data.results[0].artworkUrl100
        .replace('100x100', '600x600');
    }

    return null;

  } catch(error) {
    console.error('Could not find album artwork:', error);
    return null;
  }
}


async function renderPlaylist(){

  const songs = await getData('playlist-songs', []);

  const wall = document.getElementById('playlist-wall');

  if(songs.length === 0){
    wall.innerHTML =
      '<div class="empty">No songs yet — add your first one.</div>';
    return;
  }

  wall.innerHTML = songs.map(s => {

    return `
      <div class="cover"
        data-id="${s.id}"
        style="
          background-image:
            url('${s.artwork || ''}');
        "
      >

        <button
          class="del-x"
          data-id="${s.id}"
          aria-label="Remove song"
          title="Remove song"
        >×</button>

        <div class="txt">

          <div class="song">
            ${escapeHtml(s.song)}
          </div>

          <div class="artist">
            ${escapeHtml(s.artist || '')}
          </div>

        </div>

      </div>
    `;

  }).join('');


  // Delete buttons
  wall.querySelectorAll('.del-x').forEach(btn => {

    btn.addEventListener('click', async () => {

      const all = await getData('playlist-songs', []);

      const updated = all.filter(
        x => x.id !== btn.dataset.id
      );

      await setData('playlist-songs', updated);

      renderPlaylist();

    });

  });
}


// Add new song
document.getElementById('p-add').addEventListener('click', async () => {

  const song =
    document.getElementById('p-song').value.trim();

  const artist =
    document.getElementById('p-artist').value.trim();


  if(!song) return;


  const button = document.getElementById('p-add');

  button.textContent = 'Finding cover...';
  button.disabled = true;


  // Search for album artwork
  const artwork =
    await getAlbumArtwork(song, artist);


  const all =
    await getData('playlist-songs', []);


  all.push({
    id: crypto.randomUUID(),
    song,
    artist,
    artwork
  });


  await setData(
    'playlist-songs',
    all
  );


  // Clear inputs
  document.getElementById('p-song').value = '';
  document.getElementById('p-artist').value = '';


  button.textContent = 'Add song';
  button.disabled = false;


  renderPlaylist();

});

// ---------- utils ----------
function escapeHtml(str){ const d = document.createElement('div'); d.textContent = str || ''; return d.innerHTML; }
function formatDate(d){
  if(!d) return 'undated';
  const dt = new Date(d + 'T00:00:00');
  if(isNaN(dt)) return d;
  return dt.toLocaleDateString(undefined, { year:'numeric', month:'short', day:'numeric' });
}

renderDiary();
renderTimeline();
renderGlossary();
renderPlaylist();