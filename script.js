// Mobile menu
const menuBtn = document.getElementById('menu-btn');
const menu = document.getElementById('menu');
if (menuBtn) menuBtn.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open);
});

// ---------- Academic Planner ----------
const taskForm = document.getElementById('task-form');
if (taskForm) {
  const input = document.getElementById('task-input');
  const list = document.getElementById('task-list');
  const count = document.getElementById('task-count');
  let tasks = JSON.parse(localStorage.getItem('tasks') || '[]'); // array of {id, text, done}

  function save() { localStorage.setItem('tasks', JSON.stringify(tasks)); }

  function render() {
    list.innerHTML = '';
    if (tasks.length === 0) {
      list.innerHTML = '<li class="empty">No tasks yet. Add your first one above.</li>';
    }
    tasks.forEach(task => {
      const li = document.createElement('li');
      if (task.done) li.classList.add('done');
      li.innerHTML = '<input type="checkbox" aria-label="Mark complete"><span></span><button type="button">Delete</button>';
      li.querySelector('span').textContent = task.text;
      const box = li.querySelector('input');
      box.checked = task.done;
      box.addEventListener('change', () => toggleTask(task.id));
      li.querySelector('button').addEventListener('click', () => deleteTask(task.id));
      list.appendChild(li);
    });
    const left = tasks.filter(t => !t.done).length;
    count.textContent = left + ' of ' + tasks.length + ' tasks left';
  }
  function addTask(text) { tasks.push({ id: Date.now(), text: text, done: false }); save(); render(); }
  function toggleTask(id) { tasks = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t); save(); render(); }
  function deleteTask(id) { tasks = tasks.filter(t => t.id !== id); save(); render(); }

  taskForm.addEventListener('submit', e => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) { input.focus(); return; }
    addTask(text);
    input.value = '';
  });
  render();
}

// ---------- Contact form validation ----------
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  function setError(id, msg) { document.getElementById(id + '-error').textContent = msg; return msg === ''; }
  function validate() {
    const name = contactForm.name.value.trim();
    const email = contactForm.email.value.trim();
    const phone = contactForm.phone.value.trim();
    const message = contactForm.message.value.trim();
    let ok = true;
    ok = setError('name', name ? '' : 'Enter your name.') && ok;
    ok = setError('email', !email ? 'Enter your email address.' :
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? '' : 'Enter a valid email, like name@example.com.') && ok;
    ok = setError('phone', !phone ? 'Enter your phone number.' :
      /^\d+$/.test(phone) ? '' : 'Use digits only, with no spaces or symbols.') && ok;
    ok = setError('message', message ? '' : 'Write a message.') && ok;
    return ok;
  }
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const box = document.getElementById('success');
    if (validate()) { box.style.display = 'block'; contactForm.reset(); }
    else box.style.display = 'none';
  });
}
