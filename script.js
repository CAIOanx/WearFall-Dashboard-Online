const navs = document.querySelectorAll(".nav");
const pages = document.querySelectorAll(".page");
const title = document.getElementById("title");
navs.forEach(n => n.addEventListener("click", () => {
  navs.forEach(x => x.classList.remove("active"));
  n.classList.add("active");
  pages.forEach(p => p.classList.add("hidden"));
  document.getElementById(n.dataset.page).classList.remove("hidden");
  title.textContent = n.textContent.trim();
}));

let online = false;
let lastStatus = null;
let lastHistory = [];
let busy = false;

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}
function formatUptime(ms) {
  if (!Number.isFinite(Number(ms))) return "Tempo não informado";
  const s = Math.floor(Number(ms) / 1000);
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60);
  return `+${h}h ${String(m).padStart(2,"0")}min (desde inicialização)`;
}
function eventStatus(event) {
  if (event.cancelado) return "CANCELADO";
  if (event.quedaConfirmada ?? event.confirmada) return "ALERTA";
  return "DESCARTADA";
}
function showHistory(history) {
  const rows = history.map(event => {
    const tr = document.createElement("tr");
    const status = eventStatus(event);
    const fields = [
      formatUptime(event.tempoMs ?? event.tempo ?? event.millis),
      status === "ALERTA" ? "Possível queda" : status === "CANCELADO" ? "Alerta cancelado" : "Evento descartado",
      status,
      `Rotação: ${event.rotacao ? "sim" : "não"} · Postura: ${event.postura ? "sim" : "não"} · Imobilidade: ${event.imobilidade ? "sim" : "não"}`
    ];
    fields.forEach((value, i) => {
      const td = document.createElement("td");
      if (i === 2) {
        const b = document.createElement("b");
        b.className = status === "ALERTA" ? "warning-text" : status === "CANCELADO" ? "cancel" : "ok";
        b.textContent = value;
        td.appendChild(b);
      } else td.textContent = value;
      tr.appendChild(td);
    });
    return tr;
  });
  for (const id of ["events","eventsFull"]) {
    const tbody = document.getElementById(id);
    tbody.replaceChildren(...rows.map(row => row.cloneNode(true)));
    if (!rows.length) {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.colSpan = 4;
      td.textContent = "Nenhum evento registrado nesta sessão.";
      tr.appendChild(td);
      tbody.appendChild(tr);
    }
  }
}
function setPanel(id, className, symbol, heading, description) {
  const el = document.getElementById(id);
  el.className = className;
  el.replaceChildren();
  if (symbol) {
    const span = document.createElement("span");
    span.textContent = symbol;
    el.appendChild(span);
  }
  const div = document.createElement("div");
  const h2 = document.createElement("h2");
  h2.textContent = heading;
  const p = document.createElement("p");
  p.textContent = description;
  div.append(h2, p);
  el.appendChild(div);
}
function updateConnection(isConnected) {
  online = isConnected;
  const el = document.getElementById("connection");
  el.className = `online ${isConnected ? "connected" : "offline"}`;
  el.textContent = isConnected ? "● PAINEL ATIVO" : "● PAINEL INDISPONÍVEL";
  setText("deviceConnection", isConnected ? "Modo de apresentação" : "Sem dados");
  setText("deviceConnectionUser", isConnected ? "Modo de apresentação" : "Sem dados");
  setText("monitorUser", isConnected ? "Monitorando" : "Sem dados");
  if (!isConnected) {
    lastStatus = null;
    setText("monitorIcon", "…");
    setText("monitorTitle", "Sem comunicação");
    setText("monitorDescription", "Verifique a rede WearFall_AP e o endereço do ESP32.");
    document.getElementById("cancel").disabled = true;
    setPanel("status", "status neutral", "…", "SEM DADOS", "Não é possível verificar o estado atual do dispositivo.");
    setPanel("alertPage", "alert empty", null, "Sem comunicação", "Reconecte o ESP32 para verificar alertas.");
  }
}
function updateStatus(data) {
  lastStatus = data;
  const raw = String(data.estado ?? "").toUpperCase();
  const alert = data.alerta === true || raw === "ALERTA";
  setText("clock", new Date().toLocaleTimeString("pt-BR"));
  setText("battery", data.bateria === null || data.bateria === undefined ? "Não medida" : `${data.bateria}%`);
  setText("monitorIcon", alert ? "!" : "✓");
  setText("monitorTitle", alert ? "Alerta ativo" : "Monitoramento ativo");
  setText("monitorDescription", alert ? "Possível queda identificada no teste." : `Estado atual: ${raw || "MONITORANDO"}`);
  document.getElementById("cancel").disabled = !alert;
  setPanel("status", alert ? "status warning" : "status normal", alert ? "⚠" : "✓",
    alert ? "POSSÍVEL QUEDA" : raw || "MONITORANDO",
    alert ? "Alerta de teste ativado." : "Nenhum alerta ativo.");
  setPanel("alertPage", alert ? "alert active" : "alert empty", null,
    alert ? "⚠ POSSÍVEL QUEDA DETECTADA" : "Nenhum alerta ativo",
    alert ? "Alerta de teste ativado." : "Nenhum alerta ativo.");
}
function updateLastAlert() {
  const recent = lastHistory.find(e => e.quedaConfirmada === true || e.confirmada === true);
  setPanel("lastAlert", "alert empty", null,
    recent ? "Último alerta de queda" : "Nenhum alerta no histórico",
    recent ? formatUptime(recent.tempoMs ?? recent.tempo ?? recent.millis) : "Nenhuma possível queda registrada nesta sessão.");
}

// Modo de apresentacao: estados e eventos locais de teste, sem sensor.
// Nenhuma requisição externa é realizada e nada é armazenado no servidor.
let estadoDemo = "MONITORANDO";
let proximoNumero = 1;
const inicioDemo = Date.now();
function novoEvento(confirmada) {
  const evento = {
    numero: proximoNumero++, tempoMs: Date.now() - inicioDemo,
    rotacao: confirmada, postura: confirmada, imobilidade: confirmada,
    quedaConfirmada: confirmada
  };
  lastHistory.unshift(evento);
  showHistory(lastHistory);
  updateLastAlert();
}
function renderDemo() {
  updateConnection(true);
  updateStatus({estado: estadoDemo, alerta: estadoDemo === "ALERTA", bateria: null});
  showHistory(lastHistory);
  updateLastAlert();
  const cancel = document.getElementById("cancel");
  cancel.disabled = estadoDemo !== "ALERTA";
}
document.getElementById("simulate").addEventListener("click", () => {
  estadoDemo = "ALERTA";
  novoEvento(true);
  renderDemo();
});
document.getElementById("discard").addEventListener("click", () => {
  estadoDemo = "MONITORANDO";
  novoEvento(false);
  renderDemo();
});
document.getElementById("cancel").addEventListener("click", () => {
  estadoDemo = "MONITORANDO";
  renderDemo();
});
document.getElementById("refresh").addEventListener("click", renderDemo);
renderDemo();
