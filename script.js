// ---------- Data ----------
const events = [
  {id:1,name:"CodeStorm Hackathon",cat:"Tech",date:"2026-12-12T09:00",venue:"KIIT Campus 14, Bhubaneswar",emoji:"💻",color:"#6c5ce7,#a29bfe",desc:"24-hour hackathon to build innovative solutions with mentors and prizes worth ₹1 Lakh."},
  {id:2,name:"Sunburn Music Night",cat:"Music",date:"2026-12-20T18:00",venue:"Kalinga Stadium, Bhubaneswar",emoji:"🎵",color:"#e84393,#fd79a8",desc:"An electrifying night with live DJs and top indie artists."},
  {id:3,name:"UI/UX Design Workshop",cat:"Workshop",date:"2026-11-28T10:00",venue:"Innovation Hub, KIIT",emoji:"🎨",color:"#00b4d8,#90e0ef",desc:"Hands-on Figma workshop covering design thinking and prototyping."},
  {id:4,name:"Startup Pitch Fest",cat:"Business",date:"2027-01-08T11:00",venue:"Mayfair Convention, Bhubaneswar",emoji:"🚀",color:"#f39c12,#fdcb6e",desc:"Founders pitch to investors; network with the startup ecosystem."},
  {id:5,name:"AI & ML Summit",cat:"Tech",date:"2027-01-18T09:30",venue:"Biju Patnaik Auditorium",emoji:"🤖",color:"#00b894,#55efc4",desc:"Talks and demos from industry leaders on the future of AI."},
  {id:6,name:"Photography Walk",cat:"Workshop",date:"2026-11-22T06:30",venue:"Dhauli Hills, Bhubaneswar",emoji:"📷",color:"#636e72,#b2bec3",desc:"Golden-hour photo walk with pro photographers' tips included."}
];
const $ = s => document.querySelector(s);
let activeCat = "All", current = null;

// ---------- Theme ----------
const root = document.documentElement;
const setTheme = t => { root.dataset.theme = t; $("#themeBtn").textContent = t === "dark" ? "☀️" : "🌙"; localStorage.setItem("theme", t); };
setTheme(localStorage.getItem("theme") || "light");
$("#themeBtn").onclick = () => setTheme(root.dataset.theme === "dark" ? "light" : "dark");
$("#menuBtn").onclick = () => $("#navLinks").classList.toggle("open");
$("#navLinks").onclick = () => $("#navLinks").classList.remove("open");

// ---------- Helpers ----------
const fmtDate = d => new Date(d).toLocaleString("en-IN",{dateStyle:"medium",timeStyle:"short"});
function countdown(d){
  const ms = new Date(d) - Date.now();
  if (ms <= 0) return "Event started";
  const dd = Math.floor(ms/864e5), h = Math.floor(ms/36e5)%24, m = Math.floor(ms/6e4)%60, s = Math.floor(ms/1e3)%60;
  return `⏳ ${dd}d ${h}h ${m}m ${s}s`;
}

// ---------- Render ----------
const cats = ["All", ...new Set(events.map(e => e.cat))];
$("#chips").innerHTML = cats.map(c => `<button class="chip ${c==="All"?"active":""}" data-cat="${c}">${c}</button>`).join("");
$("#chips").onclick = e => {
  if (!e.target.dataset.cat) return;
  activeCat = e.target.dataset.cat;
  document.querySelectorAll(".chip").forEach(c => c.classList.toggle("active", c === e.target));
  render();
};
$("#search").oninput = render;

function render(){
  const q = $("#search").value.trim().toLowerCase();
  const list = events.filter(e => (activeCat==="All"||e.cat===activeCat) && (e.name+e.venue+e.desc+e.cat).toLowerCase().includes(q));
  $("#grid").innerHTML = list.map(e => `
    <article class="card event">
      <div class="thumb" style="background:linear-gradient(135deg,${e.color})">${e.emoji}</div>
      <div class="body">
        <span class="tag">${e.cat}</span>
        <h3>${e.name}</h3>
        <div class="meta">📅 ${fmtDate(e.date)}<br>📍 ${e.venue}</div>
        <p>${e.desc}</p>
        <div class="count" data-date="${e.date}">${countdown(e.date)}</div>
        <button class="btn" data-id="${e.id}">View &amp; Register</button>
      </div>
    </article>`).join("");
  $("#empty").hidden = list.length > 0;
}
$("#grid").onclick = e => { if (e.target.dataset.id) openModal(+e.target.dataset.id); };
setInterval(() => document.querySelectorAll(".count").forEach(c => c.textContent = countdown(c.dataset.date)), 1000);

// ---------- Modal ----------
function openModal(id){
  current = events.find(e => e.id === id);
  $("#detail").innerHTML = `<span class="tag">${current.cat}</span><h2>${current.emoji} ${current.name}</h2>
    <div class="meta">📅 ${fmtDate(current.date)}<br>📍 ${current.venue}</div><p>${current.desc}</p>`;
  $("#evt").value = current.name;
  $("#form").hidden = false; $("#success").hidden = true; $("#form").reset(); $("#evt").value = current.name;
  document.querySelectorAll("#form input").forEach(i => { i.className = ""; if (i.nextElementSibling) i.nextElementSibling.textContent = ""; });
  $("#modal").hidden = false; document.body.style.overflow = "hidden";
}
function closeModal(){ $("#modal").hidden = true; document.body.style.overflow = ""; }
$("#closeBtn").onclick = closeModal;
$("#modal").onclick = e => { if (e.target.id === "modal") closeModal(); };
document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

// ---------- Validation ----------
const rules = {
  name:  v => /^[A-Za-z][A-Za-z .'-]{2,}$/.test(v) || "Enter a valid name (min 3 letters).",
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) || "Enter a valid email address.",
  phone: v => /^[6-9]\d{9}$/.test(v) || "Enter a valid 10-digit Indian mobile number."
};
function check(id){
  const el = $("#"+id), res = rules[id](el.value.trim());
  el.className = res === true ? "ok" : "bad";
  el.nextElementSibling.textContent = res === true ? "" : res;
  return res === true;
}
Object.keys(rules).forEach(id => $("#"+id).addEventListener("input", () => check(id)));

$("#form").onsubmit = e => {
  e.preventDefault();
  if (!Object.keys(rules).map(check).every(Boolean)) return;
  const regs = JSON.parse(localStorage.getItem("registrations") || "[]");
  if (regs.some(r => r.email === $("#email").value.trim() && r.eventId === current.id)) {
    $("#email").className = "bad"; $("#email").nextElementSibling.textContent = "This email is already registered for this event."; return;
  }
  regs.push({eventId:current.id, event:current.name, name:$("#name").value.trim(), email:$("#email").value.trim(), phone:$("#phone").value.trim(), at:new Date().toISOString()});
  localStorage.setItem("registrations", JSON.stringify(regs));
  $("#form").hidden = true;
  $("#success").hidden = false;
  $("#success").innerHTML = `<div class="tick">🎉</div><h3>You're in, ${$("#name").value.trim().split(" ")[0]}!</h3>
    <p>Registration confirmed for <b>${current.name}</b>.<br>A confirmation will be sent to ${$("#email").value.trim()}.</p>`;
};
render();
