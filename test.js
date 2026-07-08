/**
 * Test suite per Telefonino — Decodificatore numeri di telefono italiani
 */
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
const scriptContent = fs.readFileSync(path.join(__dirname, 'script.js'), 'utf-8');

const dom = new JSDOM(html, {
  url: 'https://cristianporco.it/app/telefonino/',
  runScripts: 'dangerously',
  pretendToBeVisual: true,
});

const scriptEl = dom.window.document.createElement('script');
scriptEl.textContent = scriptContent;
dom.window.document.body.appendChild(scriptEl);

const { document } = dom.window;

function decodeViaForm(value) {
  return new Promise(resolve => {
    setTimeout(() => {
      const input = document.getElementById('phone-input');
      const form = document.getElementById('decode-form');
      input.value = value;
      form.dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true }));

      setTimeout(() => {
        const content = document.getElementById('result-content');
        if (!content || content.hidden) {
          resolve({ error: 'Nessun risultato visibile' });
          return;
        }
        const operatorEl = content.querySelector('.operator-name');
        const errorEl = content.querySelector('.result-error .result-value');
        const typeEls = content.querySelectorAll('.result-value');
        const prefixEl = content.querySelector('.result-mono');
        const noteEl = content.querySelector('.result-note');

        const typeVal = typeEls.length >= 2 ? typeEls[1].textContent : null;
        // If error layout, second .result-value might be null
        let typeIdx = 1;
        if (errorEl) typeIdx = 0;

        resolve({
          operator: operatorEl ? operatorEl.textContent : null,
          type: typeEls.length > typeIdx ? typeEls[typeIdx].textContent : null,
          prefix: prefixEl ? prefixEl.textContent : null,
          note: noteEl ? noteEl.textContent : null,
          error: errorEl ? errorEl.textContent : null,
        });
      }, 20);
    }, 10);
  });
}

async function run() {
  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      passed++;
      console.log(`  \x1b[32m✓\x1b[0m ${name}`);
    } catch (e) {
      failed++;
      console.log(`  \x1b[31m✗\x1b[0m ${name}`);
      console.log(`    ${e.message}`);
    }
  }

  function assert(condition, msg) {
    if (!condition) throw new Error(msg || 'Assertion failed');
  }

  console.log('\n═══ Telefonino Test Suite ═══\n');

  // ── Test di accettazione ──
  console.log('Criteri di accettazione:');

  await test('1) 3401234567 → operatore "TIM"', async () => {
    const r = await decodeViaForm('3401234567');
    assert(r.operator === 'TIM', `Operatore: "${r.operator}"`);
    assert(r.type === 'Mobile', `Tipo: "${r.type}"`);
    assert(r.prefix === '340', `Prefisso: "${r.prefix}"`);
  });

  await test('2) 3911234567 → operatore "Vodafone"', async () => {
    const r = await decodeViaForm('3911234567');
    assert(r.operator === 'Vodafone', `Operatore: "${r.operator}"`);
    assert(r.type === 'Mobile', `Tipo: "${r.type}"`);
    assert(r.prefix === '391', `Prefisso: "${r.prefix}"`);
  });

  await test('3) "abc" → errore "Numero non valido"', async () => {
    const r = await decodeViaForm('abc');
    assert(r.error === 'Numero non valido', `Errore: "${r.error}"`);
  });

  console.log('\nAltri operatori:');

  await test('3201234567 → WindTre', async () => {
    const r = await decodeViaForm('3201234567');
    assert(r.operator === 'WindTre', `Operatore: "${r.operator}"`);
  });

  await test('3501234567 → Iliad', async () => {
    const r = await decodeViaForm('3501234567');
    assert(r.operator === 'Iliad', `Operatore: "${r.operator}"`);
  });

  await test('3711234567 → PosteMobile', async () => {
    const r = await decodeViaForm('3711234567');
    assert(r.operator === 'PosteMobile', `Operatore: "${r.operator}"`);
  });

  await test('3701234567 → Fastweb', async () => {
    const r = await decodeViaForm('3701234567');
    assert(r.operator === 'Fastweb', `Operatore: "${r.operator}"`);
  });

  await test('3851234567 → Kena Mobile', async () => {
    const r = await decodeViaForm('3851234567');
    assert(r.operator === 'Kena Mobile', `Operatore: "${r.operator}"`);
  });

  await test('3831234567 → ho. Mobile', async () => {
    const r = await decodeViaForm('3831234567');
    assert(r.operator === 'ho. Mobile', `Operatore: "${r.operator}"`);
  });

  await test('3841234567 → Very Mobile', async () => {
    const r = await decodeViaForm('3841234567');
    assert(r.operator === 'Very Mobile', `Operatore: "${r.operator}"`);
  });

  await test('3391234567 → TIM', async () => {
    const r = await decodeViaForm('3391234567');
    assert(r.operator === 'TIM', `Operatore: "${r.operator}"`);
  });

  await test('3491234567 → Vodafone', async () => {
    const r = await decodeViaForm('3491234567');
    assert(r.operator === 'Vodafone', `Operatore: "${r.operator}"`);
  });

  await test('3281234567 → WindTre', async () => {
    const r = await decodeViaForm('3281234567');
    assert(r.operator === 'WindTre', `Operatore: "${r.operator}"`);
  });

  await test('3591234567 → Iliad', async () => {
    const r = await decodeViaForm('3591234567');
    assert(r.operator === 'Iliad', `Operatore: "${r.operator}"`);
  });

  await test('3811234567 → CoopVoce', async () => {
    const r = await decodeViaForm('3811234567');
    assert(r.operator === 'CoopVoce', `Operatore: "${r.operator}"`);
  });

  await test('3821234567 → Lycamobile', async () => {
    const r = await decodeViaForm('3821234567');
    assert(r.operator === 'Lycamobile', `Operatore: "${r.operator}"`);
  });

  console.log('\nNumeri fissi:');

  await test('0212345678 → fissa Milano', async () => {
    const r = await decodeViaForm('0212345678');
    assert(r.type === 'Fisso', `Tipo: "${r.type}"`);
    assert(r.operator.includes('Milano'), `Operatore: "${r.operator}"`);
  });

  await test('0634567890 → fissa Roma', async () => {
    const r = await decodeViaForm('0634567890');
    assert(r.type === 'Fisso', `Tipo: "${r.type}"`);
    assert(r.operator.includes('Roma'), `Operatore: "${r.operator}"`);
  });

  await test('0812345678 → fissa Napoli', async () => {
    const r = await decodeViaForm('0812345678');
    assert(r.operator.includes('Napoli'), `Operatore: "${r.operator}"`);
  });

  console.log('\nNumeri speciali:');

  await test('800123456 → numero verde', async () => {
    const r = await decodeViaForm('800123456');
    assert(r.type === 'Numero speciale', `Tipo: "${r.type}"`);
    assert(r.operator.includes('Verde'), `Operatore: "${r.operator}"`);
  });

  await test('899123456 → servizio a sovrapprezzo', async () => {
    const r = await decodeViaForm('899123456');
    assert(r.type === 'Numero speciale', `Tipo: "${r.type}"`);
  });

  await test('118 → emergenza sanitaria', async () => {
    const r = await decodeViaForm('118');
    // 118 is only 3 digits; expect validation message
    assert(r.error !== null, `Errore atteso, ottenuto: "${r.error}"`);
  });

  console.log('\nValidazione:');

  await test('vuoto → errore', async () => {
    const r = await decodeViaForm('');
    assert(r.error !== null, `Errore: "${r.error}"`);
  });

  await test('12345 → errore (troppo corto)', async () => {
    const r = await decodeViaForm('12345');
    assert(r.error !== null, `Errore: "${r.error}"`);
  });

  await test('abc123 → errore (caratteri non validi)', async () => {
    const r = await decodeViaForm('abc123');
    assert(r.error !== null, `Errore: "${r.error}"`);
  });

  await test('+393401234567 → formato internazionale accettato', async () => {
    const r = await decodeViaForm('+393401234567');
    assert(r.operator === 'TIM', `Operatore: "${r.operator}"`);
  });

  await test('340 123 4567 → spazi ignorati', async () => {
    const r = await decodeViaForm('340 123 4567');
    assert(r.operator === 'TIM', `Operatore: "${r.operator}"`);
  });

  // ── Summarize ──
  console.log(`\n─── Risultati ───`);
  console.log(`Passati: ${passed}/${passed + failed}`);
  console.log(`Falliti: ${failed}/${passed + failed}\n`);

  if (failed > 0) process.exit(1);
  process.exit(0);
}

// Allow script to initialize
setTimeout(run, 100);
