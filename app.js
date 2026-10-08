// ============================================================
// LOGO FIJO
// ============================================================
const LOGO_FIJO = 'hospital.png';

// ============================================================
// ESTADO
// ============================================================
const nombresMeses = ['','enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];

const ESTADO_DEFECTO = {
  tipoDoc: 'informe',
  fecha: '',
  institucion: 'Hospital Julio César Villanueva',
  destinatario: '',
  profNombre: '', profMatricula: '', profEspecialidad: '',
  profColegio: '', profDomicilio: '', profContacto: '',
  pacNombre: '', pacDni: '', pacEdad: '', pacDomicilio: '',
  pacObra: '', pacOcupacion: '', pacDerivante: '',
  bloques: []
};

let estadoNota = JSON.parse(JSON.stringify(ESTADO_DEFECTO));

// ============================================================
// TÍTULOS POR TIPO DE DOCUMENTO
// ============================================================
const TITULOS_DOC = {
  informe:        'Informe Psicológico',
  nota:           'Nota de Derivación',
  constancia:     'Constancia de Tratamiento',
  consentimiento: 'Consentimiento Informado',
  evolucion:      'Evolución / Nota de Sesión',
  alta:           'Informe de Alta Psicológica'
};

// ============================================================
// PLANTILLAS POR TIPO DE DOCUMENTO
// ============================================================
const PLANTILLAS = {
  informe: [
    { tipo: 'texto', titulo: 'Motivo de consulta', contenido: '' },
    { tipo: 'texto', titulo: 'Antecedentes relevantes', contenido: '' },
    { tipo: 'items', titulo: 'Técnicas e instrumentos administrados', items: ['Entrevista psicológica inicial', 'Observación clínica', ''] },
    { tipo: 'texto', titulo: 'Resultados / observaciones', contenido: '' },
    { tipo: 'texto', titulo: 'Diagnóstico presuntivo (CIE-10 / DSM-5)', contenido: '' },
    { tipo: 'texto', titulo: 'Indicaciones y recomendaciones', contenido: '' },
    { tipo: 'texto', titulo: 'Pronóstico', contenido: '' }
  ],
  nota: [
    { tipo: 'texto', titulo: 'Motivo de la derivación', contenido: '' },
    { tipo: 'texto', titulo: 'Síntesis del caso', contenido: '' },
    { tipo: 'texto', titulo: 'Profesional / servicio al que se deriva', contenido: '' }
  ],
  constancia: [
    { tipo: 'texto', titulo: 'Detalle', contenido: 'Se deja constancia que el/la paciente se encuentra en tratamiento psicológico en este servicio, con una frecuencia de ______ sesiones.' }
  ],
  consentimiento: [
    { tipo: 'texto', titulo: 'Objetivo del tratamiento', contenido: '' },
    { tipo: 'texto', titulo: 'Modalidad y frecuencia', contenido: '' },
    { tipo: 'texto', titulo: 'Duración estimada', contenido: '' },
    { tipo: 'texto', titulo: 'Confidencialidad y sus límites', contenido: 'La información será tratada bajo secreto profesional. Los límites del mismo son: riesgo cierto e inminente para el paciente o terceros, y requerimiento judicial expreso.' },
    { tipo: 'texto', titulo: 'Derechos del paciente', contenido: 'El/la paciente puede interrumpir el tratamiento en cualquier momento, solicitar el acceso a su historia clínica y revocar el presente consentimiento por escrito.' }
  ],
  evolucion: [
    { tipo: 'texto', titulo: 'Modalidad y encuadre', contenido: '' },
    { tipo: 'texto', titulo: 'Contenido de la sesión', contenido: '' },
    { tipo: 'texto', titulo: 'Observaciones clínicas', contenido: '' },
    { tipo: 'texto', titulo: 'Indicaciones para el próximo encuentro', contenido: '' }
  ],
  alta: [
    { tipo: 'texto', titulo: 'Síntesis del proceso terapéutico', contenido: '' },
    { tipo: 'texto', titulo: 'Logros alcanzados', contenido: '' },
    { tipo: 'texto', titulo: 'Estado actual', contenido: '' },
    { tipo: 'texto', titulo: 'Recomendaciones al alta', contenido: '' }
  ]
};

// ============================================================
// FECHAS
// ============================================================
function hoyISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function formatearFechaLarga(iso) {
  if (!iso) return '';
  const [y,m,d] = iso.split('-');
  if (!y||!m||!d) return '';
  return `${parseInt(d)} de ${nombresMeses[parseInt(m)]} de ${y}`;
}

// ============================================================
// PERSISTENCIA
// ============================================================
const STORAGE_KEY = 'psico_estado_v2';

function guardar() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(estadoNota));
  } catch(e) {
    console.warn('No se pudo guardar', e);
  }
}

function cargar() {
  // Aplicar logo fijo
  const brand = document.getElementById('brandLogo');
  if (brand) brand.src = LOGO_FIJO;
  const fav = document.getElementById('favicon');
  if (fav) fav.href = LOGO_FIJO;

  // Cargar estado guardado (si existe y es válido)
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      const data = JSON.parse(raw);
      if (data && typeof data === 'object') {
        estadoNota = { ...ESTADO_DEFECTO, ...data };
        if (!Array.isArray(estadoNota.bloques)) estadoNota.bloques = [];
      }
    } catch(e) {
      console.warn('Error cargando estado, se usa el por defecto', e);
      estadoNota = JSON.parse(JSON.stringify(ESTADO_DEFECTO));
    }
  }

  // Fecha siempre hoy
  estadoNota.fecha = hoyISO();

  // Reflejar en los inputs (con guard para no romper si falta algún id)
  setVal('cfgFecha', formatearFechaLarga(estadoNota.fecha));
  setVal('cfgTipoDoc', estadoNota.tipoDoc || 'informe');
  setVal('cfgInstitucion', estadoNota.institucion || '');
  setVal('cfgDestinatario', estadoNota.destinatario || '');
  setVal('cfgProfNombre', estadoNota.profNombre || '');
  setVal('cfgProfMatricula', estadoNota.profMatricula || '');
  setVal('cfgProfEspecialidad', estadoNota.profEspecialidad || '');
  setVal('cfgProfColegio', estadoNota.profColegio || '');
  setVal('cfgProfDomicilio', estadoNota.profDomicilio || '');
  setVal('cfgProfContacto', estadoNota.profContacto || '');
  setVal('cfgPacNombre', estadoNota.pacNombre || '');
  setVal('cfgPacDni', estadoNota.pacDni || '');
  setVal('cfgPacEdad', estadoNota.pacEdad || '');
  setVal('cfgPacDomicilio', estadoNota.pacDomicilio || '');
  setVal('cfgPacObra', estadoNota.pacObra || '');
  setVal('cfgPacOcupacion', estadoNota.pacOcupacion || '');
  setVal('cfgPacDerivante', estadoNota.pacDerivante || '');

  guardar();
  renderBloques();
  renderPreview();
}

function setVal(id, valor) {
  const el = document.getElementById(id);
  if (el) el.value = valor;
}

// ============================================================
// CONFIG
// ============================================================
function actualizarConfig() {
  estadoNota.institucion = getVal('cfgInstitucion');
  estadoNota.destinatario = getVal('cfgDestinatario');
  estadoNota.profNombre = getVal('cfgProfNombre').toUpperCase();
  estadoNota.profMatricula = getVal('cfgProfMatricula');
  estadoNota.profEspecialidad = getVal('cfgProfEspecialidad');
  estadoNota.profColegio = getVal('cfgProfColegio');
  estadoNota.profDomicilio = getVal('cfgProfDomicilio');
  estadoNota.profContacto = getVal('cfgProfContacto');
  estadoNota.pacNombre = getVal('cfgPacNombre');
  estadoNota.pacDni = getVal('cfgPacDni');
  estadoNota.pacEdad = getVal('cfgPacEdad');
  estadoNota.pacDomicilio = getVal('cfgPacDomicilio');
  estadoNota.pacObra = getVal('cfgPacObra');
  estadoNota.pacOcupacion = getVal('cfgPacOcupacion');
  estadoNota.pacDerivante = getVal('cfgPacDerivante');
  guardar();
  renderPreview();
}

function getVal(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

function cambiarTipoDoc(tipo) {
  estadoNota.tipoDoc = tipo;
  guardar();
  renderPreview();
}

// ============================================================
// BLOQUES
// ============================================================
function agregarBloque(tipo) {
  if (tipo === 'texto') {
    estadoNota.bloques.push({ tipo: 'texto', titulo: '', contenido: '' });
  } else if (tipo === 'items') {
    estadoNota.bloques.push({ tipo: 'items', titulo: '', items: [''] });
  }
  guardar();
  renderBloques();
  renderPreview();
}

function cargarPlantilla() {
  const tipo = estadoNota.tipoDoc;
  if (!PLANTILLAS[tipo]) return;
  if (estadoNota.bloques.length > 0 && !confirm('Esto reemplaza los bloques actuales. ¿Continuar?')) return;
  estadoNota.bloques = JSON.parse(JSON.stringify(PLANTILLAS[tipo]));
  guardar();
  renderBloques();
  renderPreview();
}

function quitarBloque(idx) {
  if (!confirm('¿Quitar este bloque?')) return;
  estadoNota.bloques.splice(idx, 1);
  guardar();
  renderBloques();
  renderPreview();
}
function moverBloque(idx, dir) {
  const n = idx + dir;
  if (n < 0 || n >= estadoNota.bloques.length) return;
  [estadoNota.bloques[idx], estadoNota.bloques[n]] = [estadoNota.bloques[n], estadoNota.bloques[idx]];
  guardar();
  renderBloques();
  renderPreview();
}
function actualizarTituloBloque(idx, valor) {
  estadoNota.bloques[idx].titulo = valor;
  guardar();
  renderPreview();
}
function actualizarTextoBloque(idx, valor) {
  estadoNota.bloques[idx].contenido = valor;
  guardar();
  renderPreview();
}

function agregarItemBloque(bIdx, valor = '') {
  if (!estadoNota.bloques[bIdx].items) estadoNota.bloques[bIdx].items = [];
  estadoNota.bloques[bIdx].items.push(valor);
  guardar();
  renderBloques();
  renderPreview();
}
function quitarItemBloque(bIdx, iIdx) {
  estadoNota.bloques[bIdx].items.splice(iIdx, 1);
  guardar();
  renderBloques();
  renderPreview();
}
function actualizarItemBloque(bIdx, iIdx, valor) {
  estadoNota.bloques[bIdx].items[iIdx] = valor;
  guardar();
  renderPreview();
}
function moverItemBloque(bIdx, iIdx, dir) {
  const arr = estadoNota.bloques[bIdx].items;
  const n = iIdx + dir;
  if (n < 0 || n >= arr.length) return;
  [arr[iIdx], arr[n]] = [arr[n], arr[iIdx]];
  guardar();
  renderBloques();
  renderPreview();
}

// ============================================================
// RENDER — editor de bloques
// ============================================================
function renderBloques() {
  const cont = document.getElementById('bloquesList');
  const empty = document.getElementById('emptyBloques');
  const contador = document.getElementById('contadorBloques');
  if (!cont || !empty || !contador) return;

  contador.textContent = `${estadoNota.bloques.length} bloque${estadoNota.bloques.length === 1 ? '' : 's'}`;

  if (estadoNota.bloques.length === 0) {
    cont.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  cont.innerHTML = estadoNota.bloques.map((b, i) => {
    const moverBotones = `
      <div class="bloque-acciones">
        <button onclick="moverBloque(${i}, -1)" title="Subir" ${i === 0 ? 'disabled' : ''}>↑</button>
        <button onclick="moverBloque(${i}, 1)" title="Bajar" ${i === estadoNota.bloques.length - 1 ? 'disabled' : ''}>↓</button>
        <button class="danger" onclick="quitarBloque(${i})" title="Quitar">✕</button>
      </div>
    `;
    const tituloInput = `
      <input type="text" class="bloque-titulo-input" value="${escapeAttr(b.titulo || '')}"
             placeholder="Título del apartado (opcional)"
             oninput="actualizarTituloBloque(${i}, this.value)"
             style="width:100%;padding:6px 10px;border:1px solid #d1d5db;border-radius:6px;font-size:12.5px;font-weight:600;margin-bottom:6px;font-family:inherit;">
    `;

    if (b.tipo === 'texto') {
      return `
        <div class="bloque" data-idx="${i}">
          <div class="bloque-head">
            <span class="bloque-tipo">📝 Texto</span>
            ${moverBotones}
          </div>
          ${tituloInput}
          <textarea class="bloque-textarea" placeholder="Escribí el contenido..."
                    oninput="actualizarTextoBloque(${i}, this.value)">${escapeHtml(b.contenido || '')}</textarea>
        </div>
      `;
    }

    if (b.tipo === 'items') {
      const items = (b.items || ['']).map((it, j) => `
        <div class="bloque-item-row">
          <span class="num">${j + 1}.</span>
          <input type="text" value="${escapeAttr(it)}" placeholder="Ítem..."
                 oninput="actualizarItemBloque(${i}, ${j}, this.value)"
                 onkeydown="if(event.key==='Enter'){event.preventDefault();agregarItemBloque(${i});}">
          <button class="btn-mini" onclick="moverItemBloque(${i}, ${j}, -1)" title="Subir" ${j === 0 ? 'disabled' : ''}>↑</button>
          <button class="btn-mini" onclick="moverItemBloque(${i}, ${j}, 1)" title="Bajar" ${j === b.items.length - 1 ? 'disabled' : ''}>↓</button>
          <button class="btn-mini danger" onclick="quitarItemBloque(${i}, ${j})" title="Quitar">✕</button>
        </div>
      `).join('');
      return `
        <div class="bloque" data-idx="${i}">
          <div class="bloque-head">
            <span class="bloque-tipo">📋 Lista</span>
            ${moverBotones}
          </div>
          ${tituloInput}
          <div class="bloque-items-list">${items}</div>
          <button class="bloque-add-item" onclick="agregarItemBloque(${i})">+ Agregar ítem</button>
        </div>
      `;
    }
    return '';
  }).join('');
}

// ============================================================
// DOCUMENTO — render imprimible
// ============================================================
function bloquesHTML() {
  return estadoNota.bloques.map(b => {
    const titulo = b.titulo ? `<div class="titulo-bloque">${escapeHtml(b.titulo)}</div>` : '';
    if (b.tipo === 'texto') {
      const txt = (b.contenido || '').trim();
      if (!txt) return '';
      return `<div class="nota-bloque texto">${titulo}<p>${escapeHtml(txt).replace(/\n/g, '<br>')}</p></div>`;
    }
    if (b.tipo === 'items') {
      const items = (b.items || []).filter(i => i && i.trim());
      if (!items.length) return '';
      return `
        <div class="nota-bloque lista">
          ${titulo}
          <ol>${items.map(i => `<li>${escapeHtml(i)}</li>`).join('')}</ol>
        </div>
      `;
    }
    return '';
  }).join('');
}

function fichaPacienteHTML() {
  const campos = [];
  if (estadoNota.pacNombre) campos.push(`<p><strong>Paciente:</strong> ${escapeHtml(estadoNota.pacNombre)}</p>`);
  if (estadoNota.pacDni) campos.push(`<p><strong>DNI:</strong> ${escapeHtml(estadoNota.pacDni)}</p>`);
  if (estadoNota.pacEdad) campos.push(`<p><strong>Edad / F. nac.:</strong> ${escapeHtml(estadoNota.pacEdad)}</p>`);
  if (estadoNota.pacDomicilio) campos.push(`<p><strong>Domicilio:</strong> ${escapeHtml(estadoNota.pacDomicilio)}</p>`);
  if (estadoNota.pacObra) campos.push(`<p><strong>Obra social:</strong> ${escapeHtml(estadoNota.pacObra)}</p>`);
  if (estadoNota.pacOcupacion) campos.push(`<p><strong>Escolaridad / ocupación:</strong> ${escapeHtml(estadoNota.pacOcupacion)}</p>`);
  if (estadoNota.pacDerivante) campos.push(`<p class="full"><strong>Derivante:</strong> ${escapeHtml(estadoNota.pacDerivante)}</p>`);
  if (estadoNota.destinatario) campos.push(`<p class="full"><strong>Destinatario:</strong> ${escapeHtml(estadoNota.destinatario)}</p>`);
  if (!campos.length) return '';
  return `<div class="nota-ficha">${campos.join('')}</div>`;
}

function notaHTML() {
  const fechaLarga = estadoNota.fecha ? formatearFechaLarga(estadoNota.fecha) : '—';
  const tituloDoc = TITULOS_DOC[estadoNota.tipoDoc] || 'Documento';
  const institucion = estadoNota.institucion || 'Hospital Julio César Villanueva';

  const profNombre = estadoNota.profNombre || '________________________';
  const profMatricula = estadoNota.profMatricula || '________';
  const profEspecialidad = estadoNota.profEspecialidad || '';
  const profColegio = estadoNota.profColegio || '';

  return `
    <div class="nota-doc">
      <div class="nota-header">
        <img src="santa fe.webp" alt="Santa Fe Provincia" class="logo-santafe">
        <img src="${LOGO_FIJO}" alt="${escapeHtml(institucion)}" class="logo-hospital">
        <h3>${escapeHtml(institucion)}</h3>
        <div class="sub">Servicio de Psicología — San Cristóbal, Santa Fe</div>
      </div>

      <div class="nota-titulo-doc">${escapeHtml(tituloDoc)}</div>

      <p class="nota-lugar">San Cristóbal, ${fechaLarga}.-</p>

      ${fichaPacienteHTML()}

      ${bloquesHTML()}

      <div class="nota-remitente">
        <p><strong>${escapeHtml(profNombre)}</strong></p>
        ${profEspecialidad ? `<p class="cargo">${escapeHtml(profEspecialidad)}</p>` : ''}
        ${profMatricula && profMatricula !== '________' ? `<p class="cargo">Matrícula: ${escapeHtml(profMatricula)}</p>` : ''}
        ${profColegio ? `<p class="cargo">${escapeHtml(profColegio)}</p>` : ''}
      </div>

      <div class="nota-firma">
        <div class="firma-box">
          <strong>Firma y sello</strong><br>
          ${escapeHtml(profNombre)}<br>
          Mat. ${escapeHtml(profMatricula)}
        </div>
      </div>

      <div class="nota-legal">
        <strong>Confidencialidad:</strong> El presente documento contiene información amparada por el secreto profesional
        (Código de Ética del Colegio de Psicólogos y Ley 25.326 de Protección de Datos Personales). Su divulgación
        a terceros no autorizados constituye una violación al deber de confidencialidad.
        <br><br>
        <strong>Validez:</strong> El documento solo adquiere validez con firma, sello y matrícula profesional del psicólogo interviniente.
        <br><br>
        <strong>Datos del profesional:</strong> ${escapeHtml(profNombre)} — Mat. ${escapeHtml(profMatricula)}
        ${estadoNota.profDomicilio ? ` — ${escapeHtml(estadoNota.profDomicilio)}` : ''}
        ${estadoNota.profContacto ? ` — ${escapeHtml(estadoNota.profContacto)}` : ''}.
      </div>
    </div>
  `;
}

function renderPreview() {
  const cont = document.getElementById('previewNota');
  if (!cont) return;
  cont.innerHTML = notaHTML();
}

// ============================================================
// IMPRESIÓN
// ============================================================
function imprimirNota() {
  if (!estadoNota.profMatricula) {
    if (!confirm('No cargaste la matrícula profesional. El documento sin matrícula no tiene validez legal. ¿Imprimir igual?')) return;
  }
  if (!estadoNota.pacNombre) {
    if (!confirm('No cargaste el nombre del paciente. ¿Imprimir igual?')) return;
  }

  estadoNota.fecha = hoyISO();
  guardar();
  setVal('cfgFecha', formatearFechaLarga(estadoNota.fecha));

  const zona = document.getElementById('zonaImpresion');
  if (zona) zona.innerHTML = notaHTML();
  setTimeout(() => window.print(), 150);
}

// ============================================================
// VACIAR
// ============================================================
function vaciarTodo() {
  if (!confirm('¿Vaciar el documento actual? Esta acción no se puede deshacer.')) return;
  estadoNota = JSON.parse(JSON.stringify(ESTADO_DEFECTO));
  estadoNota.fecha = hoyISO();
  guardar();
  cargar();
}

// ============================================================
// UTILIDADES
// ============================================================
function escapeHtml(s) {
  if (s === undefined || s === null) return '';
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function escapeAttr(s) {
  return escapeHtml(s).replace(/`/g, '&#96;');
}

// ============================================================
// INICIALIZACIÓN
// ============================================================
window.addEventListener('DOMContentLoaded', cargar);