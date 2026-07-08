/**
 * Telefonino — Decodificatore di numeri di telefono italiani
 * Identifica operatore, tipo e prefisso di un numero italiano
 */
(function () {
  'use strict';

  /* ═══════════════════════════════════════════════════════════
     Database prefissi mobili italiani
     ═══════════════════════════════════════════════════════════ */

  const MOBILE_DB = {
    // ── TIM ──
    '330': { operator: 'TIM', color: 'tim', note: '' },
    '331': { operator: 'TIM', color: 'tim', note: '' },
    '332': { operator: 'TIM', color: 'tim', note: '' },
    '333': { operator: 'TIM', color: 'tim', note: '' },
    '334': { operator: 'TIM', color: 'tim', note: '' },
    '335': { operator: 'TIM', color: 'tim', note: '' },
    '336': { operator: 'TIM', color: 'tim', note: '' },
    '337': { operator: 'TIM', color: 'tim', note: '' },
    '338': { operator: 'TIM', color: 'tim', note: '' },
    '339': { operator: 'TIM', color: 'tim', note: '' },
    '360': { operator: 'TIM', color: 'tim', note: '' },
    '366': { operator: 'TIM', color: 'tim', note: '' },
    '368': { operator: 'TIM', color: 'tim', note: '' },

    // ── Vodafone ──
    '340': { operator: 'TIM', color: 'tim', note: 'Storicamente Omnitel / Vodafone' },
    '341': { operator: 'Vodafone', color: 'vodafone', note: '' },
    '342': { operator: 'Vodafone', color: 'vodafone', note: '' },
    '343': { operator: 'Vodafone', color: 'vodafone', note: '' },
    '344': { operator: 'Vodafone', color: 'vodafone', note: '' },
    '345': { operator: 'Vodafone', color: 'vodafone', note: '' },
    '346': { operator: 'Vodafone', color: 'vodafone', note: '' },
    '347': { operator: 'Vodafone', color: 'vodafone', note: '' },
    '348': { operator: 'Vodafone', color: 'vodafone', note: '' },
    '349': { operator: 'Vodafone', color: 'vodafone', note: '' },

    // ── WindTre (ex Wind + 3 Italia) ──
    '320': { operator: 'WindTre', color: 'windtre', note: '' },
    '321': { operator: 'WindTre', color: 'windtre', note: '' },
    '322': { operator: 'WindTre', color: 'windtre', note: '' },
    '323': { operator: 'WindTre', color: 'windtre', note: '' },
    '324': { operator: 'WindTre', color: 'windtre', note: '' },
    '325': { operator: 'WindTre', color: 'windtre', note: '' },
    '326': { operator: 'WindTre', color: 'windtre', note: '' },
    '327': { operator: 'WindTre', color: 'windtre', note: '' },
    '328': { operator: 'WindTre', color: 'windtre', note: '' },
    '329': { operator: 'WindTre', color: 'windtre', note: '' },
    '380': { operator: 'WindTre', color: 'windtre', note: '' },
    '388': { operator: 'WindTre', color: 'windtre', note: '' },
    '389': { operator: 'WindTre', color: 'windtre', note: '' },
    '390': { operator: 'WindTre', color: 'windtre', note: 'Ex 3 Italia / H3G' },
    '391': { operator: 'Vodafone', color: 'vodafone', note: '' },
    '392': { operator: 'WindTre', color: 'windtre', note: 'Ex 3 Italia / H3G' },
    '393': { operator: 'WindTre', color: 'windtre', note: 'Ex 3 Italia / H3G' },
    '394': { operator: 'WindTre', color: 'windtre', note: 'Ex 3 Italia / H3G' },
    '395': { operator: 'WindTre', color: 'windtre', note: 'Ex 3 Italia / H3G' },
    '396': { operator: 'WindTre', color: 'windtre', note: 'Ex 3 Italia / H3G' },
    '397': { operator: 'WindTre', color: 'windtre', note: 'Ex 3 Italia / H3G' },

    // ── Iliad ──
    '350': { operator: 'Iliad', color: 'iliad', note: '' },
    '351': { operator: 'Iliad', color: 'iliad', note: '' },
    '352': { operator: 'Iliad', color: 'iliad', note: '' },
    '353': { operator: 'Iliad', color: 'iliad', note: '' },
    '354': { operator: 'Iliad', color: 'iliad', note: '' },
    '355': { operator: 'Iliad', color: 'iliad', note: '' },
    '356': { operator: 'Iliad', color: 'iliad', note: '' },
    '357': { operator: 'Iliad', color: 'iliad', note: '' },
    '358': { operator: 'Iliad', color: 'iliad', note: '' },
    '359': { operator: 'Iliad', color: 'iliad', note: '' },

    // ── Fastweb ──
    '370': { operator: 'Fastweb', color: 'fastweb', note: '' },
    '372': { operator: 'Fastweb', color: 'fastweb', note: '' },
    '373': { operator: 'Fastweb', color: 'fastweb', note: '' },
    '374': { operator: 'Fastweb', color: 'fastweb', note: '' },
    '375': { operator: 'Fastweb', color: 'fastweb', note: '' },
    '376': { operator: 'Fastweb', color: 'fastweb', note: '' },
    '377': { operator: 'Fastweb', color: 'fastweb', note: '' },
    '378': { operator: 'Fastweb', color: 'fastweb', note: '' },
    '379': { operator: 'Fastweb', color: 'fastweb', note: '' },

    // ── PosteMobile ──
    '371': { operator: 'PosteMobile', color: 'postemobile', note: 'Operatore virtuale su rete WindTre' },

    // ── Kena Mobile (MVNO su rete TIM) ──
    '385': { operator: 'Kena Mobile', color: 'kena', note: 'Operatore virtuale su rete TIM' },

    // ── ho. Mobile (MVNO su rete Vodafone) ──
    '383': { operator: 'ho. Mobile', color: 'ho', note: 'Operatore virtuale su rete Vodafone' },

    // ── Very Mobile (MVNO su rete WindTre) ──
    '384': { operator: 'Very Mobile', color: 'very', note: 'Operatore virtuale su rete WindTre' },

    // ── CoopVoce ──
    '381': { operator: 'CoopVoce', color: 'coopvoce', note: 'Operatore virtuale' },

    // ── Lycamobile ──
    '382': { operator: 'Lycamobile', color: 'lycamobile', note: 'Operatore virtuale' },
  };

  /* ═══════════════════════════════════════════════════════════
     Prefissi geografici (fisso)
     ═══════════════════════════════════════════════════════════ */

  const LANDLINE_DB = {
    '010': 'Genova',
    '011': 'Torino',
    '0121': 'Pinerolo',
    '0122': 'Susa',
    '0123': 'Lanzo Torinese',
    '0124': 'Rivarolo Canavese',
    '0125': 'Ivrea',
    '0131': 'Alessandria',
    '0141': 'Asti',
    '015': 'Biella',
    '0161': 'Vercelli',
    '0163': 'Borgosesia',
    '0165': 'Aosta',
    '0166': 'Saint-Vincent',
    '0171': 'Cuneo',
    '0172': 'Savigliano',
    '0182': 'Albenga',
    '0183': 'Imperia',
    '0184': 'Sanremo',
    '0185': 'Rapallo',
    '0187': 'La Spezia',
    '019': 'Savona',
    '02': 'Milano',
    '030': 'Brescia',
    '031': 'Como',
    '0321': 'Novara',
    '0322': 'Arona',
    '0331': 'Busto Arsizio',
    '0332': 'Varese',
    '0341': 'Lecco',
    '0342': 'Sondrio',
    '0343': 'Chiavenna',
    '035': 'Bergamo',
    '0362': 'Seregno',
    '0363': 'Treviglio',
    '0364': 'Breno',
    '0365': 'Salò',
    '0371': 'Lodi',
    '0372': 'Cremona',
    '0373': 'Crema',
    '0375': 'Casalmaggiore',
    '0376': 'Mantova',
    '0381': 'Vigevano',
    '0382': 'Pavia',
    '039': 'Monza',
    '040': 'Trieste',
    '041': 'Venezia',
    '0421': 'San Donà di Piave',
    '0422': 'Treviso',
    '0423': 'Montebelluna',
    '0424': 'Bassano del Grappa',
    '0425': 'Rovigo',
    '0426': 'Adria',
    '0427': 'Spilimbergo',
    '0428': 'Tarvisio',
    '0429': 'Este',
    '0431': 'Cervignano del Friuli',
    '0432': 'Udine',
    '0434': 'Pordenone',
    '0436': 'Cortina d\'Ampezzo',
    '0437': 'Belluno',
    '0438': 'Conegliano',
    '0439': 'Feltre',
    '0442': 'Legnago',
    '0444': 'Vicenza',
    '0445': 'Schio',
    '045': 'Verona',
    '0461': 'Trento',
    '0462': 'Cavalese',
    '0463': 'Cles',
    '0464': 'Rovereto',
    '0465': 'Tione di Trento',
    '0471': 'Bolzano',
    '0472': 'Bressanone',
    '0473': 'Merano',
    '0474': 'Brunico',
    '0481': 'Gorizia',
    '049': 'Padova',
    '050': 'Pisa',
    '051': 'Bologna',
    '0521': 'Parma',
    '0522': 'Reggio Emilia',
    '0523': 'Piacenza',
    '0524': 'Fidenza',
    '0525': 'Fornovo di Taro',
    '0532': 'Ferrara',
    '0533': 'Comacchio',
    '0534': 'Porretta Terme',
    '0535': 'Mirandola',
    '0536': 'Sassuolo',
    '0541': 'Rimini',
    '0542': 'Imola',
    '0543': 'Forlì',
    '0544': 'Ravenna',
    '0545': 'Lugo',
    '0546': 'Faenza',
    '0547': 'Cesena',
    '0549': 'Rep. di San Marino',
    '055': 'Firenze',
    '0564': 'Grosseto',
    '0565': 'Piombino',
    '0566': 'Follonica',
    '0571': 'Empoli',
    '0572': 'Montecatini Terme',
    '0573': 'Pistoia',
    '0574': 'Prato',
    '0575': 'Arezzo',
    '0577': 'Siena',
    '0578': 'Chianciano Terme',
    '0583': 'Lucca',
    '0584': 'Viareggio',
    '0585': 'Massa',
    '0586': 'Livorno',
    '0587': 'Pontedera',
    '0588': 'Volterra',
    '059': 'Modena',
    '06': 'Roma',
    '070': 'Cagliari',
    '071': 'Ancona',
    '0721': 'Pesaro',
    '0722': 'Urbino',
    '0731': 'Jesi',
    '0732': 'Fabriano',
    '0733': 'Macerata',
    '0734': 'Fermo',
    '0735': 'San Benedetto del Tronto',
    '0736': 'Ascoli Piceno',
    '0737': 'Camerino',
    '0742': 'Foligno',
    '0743': 'Spoleto',
    '0744': 'Terni',
    '075': 'Perugia',
    '0761': 'Viterbo',
    '0763': 'Orvieto',
    '0765': 'Poggio Mirteto',
    '0766': 'Civitavecchia',
    '0771': 'Formia',
    '0773': 'Latina',
    '0774': 'Tivoli',
    '0775': 'Frosinone',
    '0776': 'Cassino',
    '0781': 'Iglesias',
    '0782': 'Nuoro',
    '0783': 'Oristano',
    '0784': 'Tortolì',
    '0785': 'Macomer',
    '0789': 'Olbia',
    '079': 'Sassari',
    '080': 'Bari',
    '081': 'Napoli',
    '0823': 'Caserta',
    '0824': 'Benevento',
    '0825': 'Avellino',
    '0827': 'Sant\'Angelo dei Lombardi',
    '0828': 'Battipaglia',
    '0831': 'Brindisi',
    '0832': 'Lecce',
    '0833': 'Gallipoli',
    '0835': 'Matera',
    '0836': 'Maglie',
    '085': 'Pescara',
    '0861': 'Teramo',
    '0862': 'L\'Aquila',
    '0863': 'Avezzano',
    '0864': 'Sulmona',
    '0865': 'Isernia',
    '0871': 'Chieti',
    '0872': 'Lanciano',
    '0873': 'Vasto',
    '0874': 'Campobasso',
    '0875': 'Termoli',
    '0881': 'Foggia',
    '0882': 'San Severo',
    '0883': 'Andria',
    '0884': 'Manfredonia',
    '0885': 'Cerignola',
    '089': 'Salerno',
    '090': 'Messina',
    '091': 'Palermo',
    '0921': 'Cefalù',
    '0922': 'Agrigento',
    '0923': 'Trapani',
    '0924': 'Alcamo',
    '0925': 'Sciacca',
    '0931': 'Siracusa',
    '0932': 'Ragusa',
    '0933': 'Caltagirone',
    '0934': 'Caltanissetta',
    '0935': 'Enna',
    '0941': 'Patti',
    '0942': 'Taormina',
    '095': 'Catania',
    '0961': 'Catanzaro',
    '0962': 'Crotone',
    '0963': 'Vibo Valentia',
    '0964': 'Locri',
    '0965': 'Reggio Calabria',
    '0966': 'Palmi',
    '0967': 'Soverato',
    '0968': 'Lamezia Terme',
    '0971': 'Potenza',
    '0972': 'Melfi',
    '0973': 'Lagonegro',
    '0974': 'Vallo della Lucania',
    '0975': 'Sala Consilina',
    '0976': 'Muro Lucano',
    '0981': 'Castrovillari',
    '0982': 'Paola',
    '0983': 'Rossano',
    '0984': 'Cosenza',
    '0985': 'Scalea',
    '099': 'Taranto',
  };

  /* ═══════════════════════════════════════════════════════════
     Numeri speciali e di servizio
     ═══════════════════════════════════════════════════════════ */

  const SPECIAL_PREFIXES = {
    '00':   { type: 'Chiamata internazionale' },
    '1':    { type: 'Numero di emergenza / servizio' },
    '112':  { type: 'Numero Unico Emergenza (NUE)' },
    '113':  { type: 'Polizia / Soccorso Pubblico' },
    '115':  { type: 'Vigili del Fuoco' },
    '118':  { type: 'Emergenza Sanitaria' },
    '4':    { type: 'Servizi a sovrapprezzo' },
    '8':    { type: 'Numero verde / tariffa speciale' },
    '800':  { type: 'Numero Verde (gratuito)' },
    '803':  { type: 'Numero a tariffa condivisa' },
    '840':  { type: 'Numero a tariffa urbana' },
    '841':  { type: 'Numero a tariffa specifica' },
    '848':  { type: 'Numero a tariffa speciale' },
    '892':  { type: 'Servizi a sovrapprezzo (892)' },
    '899':  { type: 'Servizi a sovrapprezzo (899)' },
  };

  /* ═══════════════════════════════════════════════════════════
     DOM references
     ═══════════════════════════════════════════════════════════ */

  const form        = document.getElementById('decode-form');
  const input       = document.getElementById('phone-input');
  const errorEl     = document.getElementById('input-error');
  const decodeBtn   = document.getElementById('decode-btn');
  const placeholder = document.getElementById('result-placeholder');
  const content     = document.getElementById('result-content');
  const resultOp    = document.getElementById('result-operator');
  const resultType  = document.getElementById('result-type');
  const resultPref  = document.getElementById('result-prefix');
  const resultNote  = document.getElementById('result-note');
  const resultNoteItem = document.getElementById('result-note-item');

  /* ═══════════════════════════════════════════════════════════
     Utility
     ═══════════════════════════════════════════════════════════ */

  function sanitize(phone) {
    return phone.replace(/[\s.\-()/+]/g, '');
  }

  function isNumeric(str) {
    return /^\d+$/.test(str);
  }

  /* ═══════════════════════════════════════════════════════════
     Core lookup logic
     ═══════════════════════════════════════════════════════════ */

  function normalizeItalianNumber(phone) {
    // Strip international Italy prefix: +39, 0039, or 39 when followed by mobile/landline
    if (phone.startsWith('0039') && phone.length >= 12) {
      return phone.substring(4);
    }
    if (phone.startsWith('39') && phone.length >= 11) {
      var rest = phone.substring(2);
      // Only strip if what follows looks like an Italian number (starts with 0 or 3)
      if (rest.startsWith('0') || rest.startsWith('3')) {
        return rest;
      }
    }
    return phone;
  }

  function decodeNumber(raw) {
    var phone = sanitize(raw);

    // ── Validation ──
    if (!phone) {
      return { error: 'Inserisci un numero di telefono' };
    }

    if (!isNumeric(phone)) {
      return { error: 'Numero non valido' };
    }

    // Normalize international format
    phone = normalizeItalianNumber(phone);

    // Italian numbers: 8-10 digits for mobile, 8-11 for landline
    if (phone.length < 8 || phone.length > 11) {
      return { error: 'Il numero deve avere tra 8 e 11 cifre' };
    }

    // ── Mobile lookup ──
    if (phone.startsWith('3')) {
      // Try 3-digit prefix first
      const prefix3 = phone.substring(0, 3);
      if (MOBILE_DB[prefix3]) {
        const entry = MOBILE_DB[prefix3];
        return {
          operator: entry.operator,
          type: 'Mobile',
          prefix: prefix3,
          note: entry.note || null,
          color: entry.color,
        };
      }

      // Fallback: generic mobile
      return {
        operator: 'Altro operatore mobile',
        type: 'Mobile',
        prefix: phone.substring(0, 4),
        note: 'Prefisso non specificamente censito',
        color: '',
      };
    }

    // ── Landline lookup ──
    if (phone.startsWith('0')) {
      // Try from longest to shortest prefix match (4, 3, 2)
      const candidates = [4, 3, 2];
      for (const len of candidates) {
        if (phone.length >= len) {
          const prefix = phone.substring(0, len);
          if (LANDLINE_DB[prefix]) {
            return {
              operator: 'Rete fissa — ' + LANDLINE_DB[prefix],
              type: 'Fisso',
              prefix: prefix,
              note: 'Prefisso geografico',
              color: '',
            };
          }
        }
      }
      return {
        operator: 'Rete fissa',
        type: 'Fisso',
        prefix: phone.substring(0, 2),
        note: 'Prefisso geografico non censito',
        color: '',
      };
    }

    // ── Special numbers ──
    // Check exact matches first
    for (const [prefix, info] of Object.entries(SPECIAL_PREFIXES)) {
      if (prefix.length >= 2 && phone.startsWith(prefix)) {
        // For single-digit matches, only apply if they are the only match
        if (prefix.length === 1) continue;
        return {
          operator: info.type,
          type: 'Numero speciale',
          prefix: prefix,
          note: 'Numero non geografico',
          color: '',
        };
      }
    }

    // Single-digit special categories
    if (phone.startsWith('1') && phone.length >= 3 && phone.length <= 5) {
      return {
        operator: 'Numero di emergenza o servizio',
        type: 'Numero speciale',
        prefix: phone.substring(0, 3),
        note: 'Numerazione 1xx',
        color: '',
      };
    }

    if (phone.startsWith('8')) {
      return {
        operator: 'Numero a tariffa speciale',
        type: 'Numero speciale',
        prefix: phone.substring(0, 3),
        note: 'Numero verde o a tariffa agevolata',
        color: '',
      };
    }

    if (phone.startsWith('4')) {
      return {
        operator: 'Servizio a sovrapprezzo',
        type: 'Numero speciale',
        prefix: phone.substring(0, 3),
        note: 'Servizi a tariffa maggiorata',
        color: '',
      };
    }

    // ── Fallback ──
    return { error: 'Prefisso non riconosciuto nel piano di numerazione italiano' };
  }

  /* ═══════════════════════════════════════════════════════════
     Render result
     ═══════════════════════════════════════════════════════════ */

  function showResult(result) {
    placeholder.hidden = true;

    if (result.error) {
      // Clear operator classes
      content.className = 'result-content';
      content.querySelectorAll('.result-item').forEach(function (el) {
        el.className = el.className.replace('result-error', '').trim();
        if (!el.classList.contains('result-item')) {
          el.classList.add('result-item');
        }
      });

      // Show error in a dedicated state
      content.innerHTML = '<div class="result-item result-error"><span class="result-value">' +
        escapeHtml(result.error) + '</span></div>';
      content.hidden = false;
      return;
    }

    // Rebuild result content structure
    content.innerHTML =
      '<div class="result-grid">' +
        '<div class="result-item">' +
          '<span class="result-label">Operatore</span>' +
          '<span class="result-value operator-name"></span>' +
        '</div>' +
        '<div class="result-item">' +
          '<span class="result-label">Tipo numero</span>' +
          '<span class="result-value"></span>' +
        '</div>' +
        '<div class="result-item">' +
          '<span class="result-label">Prefisso</span>' +
          '<span class="result-value result-mono"></span>' +
        '</div>' +
        (result.note ? '<div class="result-item result-item-note">' +
          '<span class="result-label">Nota</span>' +
          '<span class="result-value result-note"></span>' +
        '</div>' : '') +
      '</div>';

    content.querySelector('.operator-name').textContent = result.operator;
    content.querySelectorAll('.result-value')[1].textContent = result.type;
    content.querySelector('.result-mono').textContent = result.prefix;

    if (result.note) {
      content.querySelector('.result-note').textContent = result.note;
    }

    // Operator color class
    content.className = 'result-content';
    if (result.color) {
      content.classList.add('operator-' + result.color);
    }

    content.hidden = false;
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  /* ═══════════════════════════════════════════════════════════
     Validation & error display
     ═══════════════════════════════════════════════════════════ */

  function validateInput(val) {
    var clean = sanitize(val);
    if (!val.trim()) return null;
    if (!isNumeric(clean)) return 'Inserisci solo cifre (0–9)';
    // Normalize after sanitize to account for +39 international prefix
    var normalized = normalizeItalianNumber(clean);
    if (normalized.length > 0 && normalized.length < 8) return 'Troppo corto: almeno 8 cifre';
    if (normalized.length > 11) return 'Troppo lungo: massimo 11 cifre';
    return null;
  }

  function setError(msg) {
    if (msg) {
      errorEl.textContent = msg;
      errorEl.classList.add('visible');
      input.classList.add('has-error');
    } else {
      errorEl.textContent = '';
      errorEl.classList.remove('visible');
      input.classList.remove('has-error');
    }
  }

  /* ═══════════════════════════════════════════════════════════
     Event handlers
     ═══════════════════════════════════════════════════════════ */

  // Blur validation
  input.addEventListener('blur', function () {
    var err = validateInput(input.value);
    setError(err);
  });

  // Clear error on input
  input.addEventListener('input', function () {
    if (input.classList.contains('has-error')) {
      var err = validateInput(input.value);
      if (!err) setError(null);
    }
  });

  // Form submit
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var val = input.value.trim();
    var err = validateInput(val);

    if (err) {
      setError(err);
      // Provide user-friendly error in result area
      var clean = sanitize(val);
      if (!clean || !isNumeric(clean)) {
        showResult({ error: 'Numero non valido' });
      } else {
        var normalized = normalizeItalianNumber(clean);
        if (normalized.length < 8 || normalized.length > 11) {
          showResult({ error: 'Il numero deve avere tra 8 e 11 cifre' });
        } else {
          showResult({ error: err });
        }
      }
      return;
    }

    setError(null);
    var result = decodeNumber(val);
    showResult(result);
  });

  /* ═══════════════════════════════════════════════════════════
     Initial state
     ═══════════════════════════════════════════════════════════ */

  placeholder.hidden = false;
  content.hidden = true;

})();
