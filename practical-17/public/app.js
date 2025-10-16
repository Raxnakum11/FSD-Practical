document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      if (form.method.toLowerCase() === 'post' && form.action.indexOf('_method=DELETE') !== -1) {
        if (!confirm('Delete this student?')) {
          e.preventDefault();
        }
      }
    });
  });
});
const base = '/api/students';
async function fetchList(){
  const res = await fetch(base);
  const data = await res.json();
  const list = document.getElementById('list');
  list.innerHTML = '';
  data.forEach(s => {
    const div = document.createElement('div');
    div.className = 'list-item';
    div.innerHTML = `<div class="meta"><strong>${s.name}</strong><div>Age: ${s.age || '-'} Email: ${s.email || '-'} Phone: ${s.phone || '-'}</div></div>`;
    const btns = document.createElement('div');
    const edit = document.createElement('button'); edit.textContent='Edit';
    edit.onclick = ()=> loadStudent(s);
    const del = document.createElement('button'); del.textContent='Delete';
    del.onclick = async ()=>{ if(confirm('Delete?')){ await fetch(`${base}/${s._id}`,{method:'DELETE'}); fetchList(); }}
    btns.appendChild(edit); btns.appendChild(del);
    div.appendChild(btns);
    list.appendChild(div);
  })
}

function loadStudent(s){
  document.getElementById('id').value = s._id;
  document.getElementById('name').value = s.name;
  document.getElementById('age').value = s.age || '';
  document.getElementById('phone').value = s.phone || '';
  document.getElementById('email').value = s.email || '';
  document.getElementById('notes').value = s.notes || '';
}

async function submitForm(e){
  e.preventDefault();
  const id = document.getElementById('id').value;
  const body = {
    name: document.getElementById('name').value,
    age: document.getElementById('age').value,
    phone: document.getElementById('phone').value,
    email: document.getElementById('email').value,
    notes: document.getElementById('notes').value
  };
  if(id){
    await fetch(`${base}/${id}`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
  } else {
    await fetch(base,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
  }
  document.getElementById('studentForm').reset();
  fetchList();
}

document.getElementById('studentForm').addEventListener('submit', submitForm);
document.getElementById('resetBtn').addEventListener('click', ()=>document.getElementById('studentForm').reset());

fetchList();
