const form = document.getElementById("form-tarefa");
const input = document.getElementById("input-tarefa");
const listaTarefas = document.getElementById("lista-tarefas");
const listaConcluidas = document.getElementById("lista-concluidas");
const cardInfo = document.getElementById("card-info");
const contadorConcluidas = document.getElementById("contador-concluidas");
const tituloConcluidas = document.getElementById("titulo-concluidas");

// Função para exibir a data atual
function atualizarData() {
  const dataElemento = document.getElementById("data-atual");
  const hoje = new Date();
  const opcoes = { weekday: "long", day: "numeric", month: "long" };
  const dataFormatada = hoje.toLocaleDateString("pt-BR", opcoes);
  dataElemento.textContent = dataFormatada;
}

// Carrega tarefas salvas
function carregarTarefas() {
  const tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
  tarefas.forEach((tarefa) => {
    adicionarTarefaNaLista(tarefa.texto, tarefa.concluida);
  });
  atualizarExibicaoCardInfo();
}

// Salva tarefas no localStorage
function salvarTarefas() {
  const tarefas = [];
  document.querySelectorAll("#lista-tarefas li").forEach((li) => {
    tarefas.push({
      texto: li.querySelector("span").textContent,
      concluida: false,
    });
  });
  document.querySelectorAll("#lista-concluidas li").forEach((li) => {
    tarefas.push({
      texto: li.querySelector("span").textContent,
      concluida: true,
    });
  });
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

// Atualiza a visibilidade do card de boas-vindas
function atualizarExibicaoCardInfo() {
  const totalTarefas =
    listaTarefas.children.length + listaConcluidas.children.length;
  cardInfo.style.display = totalTarefas > 0 ? "none" : "block";
}

// Atualiza a contagem de tarefas concluídas
function atualizarContadorConcluidas() {
  const total = listaConcluidas.children.length;
  contadorConcluidas.textContent = total;
  tituloConcluidas.style.display = total > 0 ? "block" : "none";
}

// Cria uma tarefa (pendente ou concluída)
function adicionarTarefaNaLista(texto, concluida = false) {
  const li = document.createElement("li");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = concluida;

  const span = document.createElement("span");
  span.textContent = texto;
  span.style.marginRight = "10px";

  const botaoExcluir = document.createElement("button");
  botaoExcluir.innerHTML = "&#x2716;"; // X
  botaoExcluir.onclick = () => {
    li.remove();
    salvarTarefas();
    atualizarExibicaoCardInfo();
    atualizarContadorConcluidas();
  };

  checkbox.onchange = () => {
    if (checkbox.checked) {
      listaConcluidas.appendChild(li);
    } else {
      listaTarefas.appendChild(li);
    }
    salvarTarefas();
    atualizarContadorConcluidas();
  };

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(botaoExcluir);

  if (concluida) {
    listaConcluidas.appendChild(li);
  } else {
    listaTarefas.appendChild(li);
  }

  atualizarContadorConcluidas();
  atualizarExibicaoCardInfo();
  salvarTarefas();
}

// Evento de envio do formulário
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const texto = input.value.trim();
  if (texto !== "") {
    adicionarTarefaNaLista(texto);
    input.value = "";
  }
});

// Inicia a aplicação
atualizarData();
carregarTarefas();
