/* Finca BIO MASSA – Farmers Registry (Frontend-only, offline) */

const LS_KEY = 'bioMassaFarmersV1';
let farmers = load();

const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

const form = $('#farmerForm');
const rows = $('#rows');
const preview = $('#preview');
const search = $('#search');

form.photo.addEventListener('change', async (e) => {
  const f = e.target.files?.[0];
  if (!f) { preview.style.display='none'; return; }
  const dataUrl = await fileToDataURL(f);
  preview.src = dataUrl;
  preview.style.display = 'block';
  preview.dataset.dataUrl = dataUrl;
});

$('#resetForm').addEventListener('click', () => {
  form.reset(); preview.style.display='none'; preview.removeAttribute('data-url');
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const rec = {
    id: crypto.randomUUID(),
    firstName: form.firstName.value.trim(),
    lastName: form.lastName.value.trim(),
    nationalId: form.nationalId.value.trim(),
    memberNo: form.memberNo.value.trim(),
    birthPlace: form.birthPlace.value.trim(),
    birthDate: form.birthDate.value || '',
    maritalStatus: form.maritalStatus.value,
    children: Number(form.children.value || 0),
    kgPerMonth: Number(form.kgPerMonth.value || 0),
    phone: form.phone.value.trim(),
    altPhone: form.altPhone.value.trim(),
    notes: form.notes.value.trim(),
    photo: preview.dataset.dataUrl || null,
    createdAt: new Date().toISOString()
  };
  farmers.push(rec);
  save(); render();
  form.reset(); preview.style.display='none'; delete preview.dataset.dataUrl;
});

search.addEventListener('input', render);

function render(){
  const q = search.value.trim().toLowerCase();
  const data = !q ? farmers : farmers.filter(f => (
    [f.firstName, f.lastName, f.nationalId, f.phone, f.memberNo].some(x => (x||'').toLowerCase().includes(q))
  ));
  rows.innerHTML = '';
  if (data.length === 0){
    const tr = document.createElement('tr'); tr.className='empty';
    const td = document.createElement('td'); td.colSpan=7; td.textContent='Keine Treffer.';
    tr.appendChild(td); rows.appendChild(tr); return;
  }
  data.forEach(f => {
    const tr = document.createElement('tr');
    const name = `${f.firstName||''} ${f.lastName||''}`.trim();
    tr.innerHTML = `
      <td>${escapeHtml(name)}</td>
      <td>${escapeHtml(f.nationalId||'')}</td>
      <td>${escapeHtml(f.memberNo||'')}</td>
      <td>${Number(f.kgPerMonth||0)}</td>
      <td>${escapeHtml(f.phone||'')}</td>
      <td>${f.photo ? `<img src="${f.photo}" alt="" style="width:42px;height:42px;object-fit:cover;border-radius:6px;border:1px solid #e3e8e5">` : ''}</td>
      <td>
        <button class="btn-ghost" data-act="edit" data-id="${f.id}">✏️</button>
        <button class="btn-ghost" data-act="del" data-id="${f.id}">🗑️</button>
      </td>`;
    rows.appendChild(tr);
  });
}

rows.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-act]');
  if (!btn) return;
  const id = btn.dataset.id; const act = btn.dataset.act;
  const i = farmers.findIndex(x => x.id===id); if (i<0) return;

  if (act==='del'){
    if (confirm('Eintrag wirklich löschen?')) {
      farmers.splice(i,1); save(); render();
    }
  } else if (act==='edit'){
    const f = farmers[i];
    form.firstName.value = f.firstName||''; form.lastName.value=f.lastName||'';
    form.nationalId.value=f.nationalId||''; form.memberNo.value=f.memberNo||'';
    form.birthPlace.value=f.birthPlace||''; form.birthDate.value=f.birthDate||'';
    form.maritalStatus.value=f.maritalStatus||'single';
    form.children.value=f.children||0; form.kgPerMonth.value=f.kgPerMonth||0;
    form.phone.value=f.phone||''; form.altPhone.value=f.altPhone||'';
    form.notes.value=f.notes||'';
    if (f.photo){ preview.src=f.photo; preview.style.display='block'; preview.dataset.dataUrl=f.photo; }
    // nach Edit wird bei Submit ein neuer Datensatz angelegt — bewusst simpel
  }
});

// CSV Export
$('#exportCsv').addEventListener('click', () => {
  const header = ['firstName','lastName','nationalId','memberNo','birthPlace','birthDate','maritalStatus','children','kgPerMonth','phone','altPhone','notes','createdAt'];
  const rows = [header.join(',')].concat(
    farmers.map(f => header.map(k => csvCell(f[k])).join(','))
  );
  download('farmers.csv', rows.join('\n'), 'text/csv;charset=utf-8');
});

// JSON Export/Import
$('#exportJson').addEventListener('click', () => {
  download('farmers.json', JSON.stringify(farmers,null,2), 'application/json');
});
$('#importJson').addEventListener('change', async (e) => {
  const file = e.target.files?.[0]; if (!file) return;
  const text = await file.text();
  try {
    const data = JSON.parse(text);
    if (!Array.isArray(data)) throw new Error('Invalid JSON');
    farmers = data; save(); render(); alert('Import erfolgreich.');
  } catch(err){ alert('Fehler beim Import: '+err.message); }
  e.target.value = '';
});

// Drucken
$('#printList').addEventListener('click', () => window.print());

// i18n
const dict = {
  de: {
    intro: 'Registriere Mitglieder (Bauern). Daten werden lokal im Browser gespeichert. Export/Import möglich.',
    name:'Vorname', surname:'Nachname', id:'Identitätsnummer', member:'Mitglieds-Nr.',
    birthPlace:'Geburtsort', birthDate:'Geburtsdatum', marital:'Familienstand',
    children:'Anzahl Kinder', kg:'Kg pro Monat', whatsapp:'Telefon / WhatsApp',
    altPhone:'Zweitkontakt', photo:'Foto', notes:'Notizen', add:'➕ Hinzufügen',
    tblName:'Name', tblMember:'Mitglied', tblKg:'kg/Monat', tblPhone:'Telefon', tblActions:'Aktionen'
  },
  fr: {
    intro:"Enregistrer les membres (cacaoculteurs). Données stockées localement dans le navigateur. Export/Import possibles.",
    name:'Prénom', surname:'Nom', id:"N° d'identité", member:'N° Membre',
    birthPlace:'Lieu de naissance', birthDate:'Date de naissance', marital:'État civil',
    children:"Nombre d'enfants", kg:'Kg par mois', whatsapp:'Téléphone / WhatsApp',
    altPhone:'Contact secondaire', photo:'Photo', notes:'Remarques', add:'➕ Ajouter',
    tblName:'Nom', tblMember:'Membre', tblKg:'kg/mois', tblPhone:'Téléphone', tblActions:'Actions'
  },
  es: {
    intro:"Registrar socios (cacaocultores). Datos guardados localmente en el navegador. Exportación/Importación disponibles.",
    name:'Nombre', surname:'Apellidos', id:'N° de identidad', member:'N° Socio',
    birthPlace:'Lugar de nacimiento', birthDate:'Fecha de nacimiento', marital:'Estado civil',
    children:'Número de hijos', kg:'Kg por mes', whatsapp:'Tel./WhatsApp',
    altPhone:'Otro contacto', photo:'Foto', notes:'Observaciones', add:'➕ Añadir',
    tblName:'Nombre', tblMember:'Socio', tblKg:'kg/mes', tblPhone:'Teléfono', tblActions:'Acciones'
  }
};
const langSel = document.getElementById('lang');
langSel.addEventListener('change', () => setLang(langSel.value));
function setLang(code){
  const t = dict[code]||dict.de;
  document.getElementById('intro').textContent=t.intro;
  $$('[data-i]').forEach(el => { const k=el.getAttribute('data-i'); if (t[k]) el.textContent=t[k]; });
}
setLang('de');

function save(){ localStorage.setItem(LS_KEY, JSON.stringify(farmers)); }
function load(){ try{ return JSON.parse(localStorage.getItem(LS_KEY)||'[]') }catch{ return [] } }
function escapeHtml(s){ return (s||'').replace(/[&<>"']/g, m=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m])); }
function csvCell(v){
  if (v==null) return '""';
  const s = String(v).replace(/"/g,'""').replace(/\n/g,' ');
  return `"${s}"`;
}
function fileToDataURL(file){
  return new Promise((res,rej)=>{ const r=new FileReader(); r.onload=()=>res(r.result); r.onerror=rej; r.readAsDataURL(file); });
}

// initial render
render();
