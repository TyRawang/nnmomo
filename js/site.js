// Shared behaviour for every page: mobile nav, inquiry forms, footer year.
const EMAIL = 'nomnommomocatering@gmail.com';
// Mobile nav
const toggle = document.querySelector('.menu-toggle'), nav = document.getElementById('nav');
toggle.addEventListener('click', () => toggle.setAttribute('aria-expanded', nav.classList.toggle('open')));
nav.addEventListener('click', e => { if (e.target.tagName === 'A') { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', false); } });

// Inquiry forms (the pop-up dialog and the inline form on the contact page share this)
const now = new Date();
document.querySelectorAll('.inq-form input[name="date"]').forEach(i => i.min = now.toISOString().slice(0, 10));
const dlg = document.getElementById('inquiry');
const openInquiry = (email, item) => {
  if (!dlg) return document.getElementById('form')?.scrollIntoView({ behavior: 'smooth' });
  const form = dlg.querySelector('.inq-form');
  dlg.classList.remove('done');
  if (email) form.email.value = email;
  if (item && !form.notes.value.includes(item)) form.notes.value = `I'm interested in: ${item}\n` + form.notes.value;
  dlg.showModal(); form.name.focus();
};
// Delegated so buttons rendered later (menu cards) work too; data-inquire="Dish name" pre-fills the notes.
document.addEventListener('click', e => { const b = e.target.closest('[data-inquire]'); if (b) openInquiry('', b.dataset.inquire); });
document.getElementById('quick')?.addEventListener('submit', e => { e.preventDefault(); openInquiry(document.getElementById('quick-email').value.trim()); });
document.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', () => b.closest('dialog').close()));
document.querySelectorAll('.inq-form').forEach(form => {
  const box = form.closest('.inquiry-box');
  let requestText = '';
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const d = new FormData(form);
    const subject = `Catering inquiry — ${d.get('date')} — ${d.get('guests')} guests`;
    const body = ['Hello Nom Nom Momo,', '', 'I would like to discuss catering for my gathering.', '',
      `Name: ${d.get('name')}`, `Reply email: ${d.get('email')}`, `Event date: ${d.get('date')}`, `Estimated guests: ${d.get('guests')}`, `Event location: ${d.get('location')}`, '',
      'Event notes / dietary requests / menu preferences:', String(d.get('notes') || 'Please help me choose a menu.'), '',
      'Please confirm availability, the final quote, and fulfillment arrangements.', 'Thank you!'].join('\n');
    requestText = `To: ${EMAIL}\nSubject: ${subject}\n\n${body}`;
    box.querySelector('.mail-link').href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    box.classList.add('done');
  });
  box.querySelector('.copy-req').addEventListener('click', async e => {
    try { await navigator.clipboard.writeText(requestText); e.target.textContent = 'Copied. Paste it into an email to ' + EMAIL; }
    catch { e.target.textContent = 'Copy failed. Email ' + EMAIL + ' directly.'; }
  });
  box.querySelector('.edit-req')?.addEventListener('click', () => box.classList.remove('done'));
});
document.getElementById('year').textContent = now.getFullYear();
