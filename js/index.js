function MascaraMoeda(objTextBox, SeparadorMilesimo, SeparadorDecimal, e) {
  var sep = 0;
  var key = "";
  var i = (j = 0);
  var len = (len2 = 0);
  var strCheck = "0123456789";
  var aux = (aux2 = "");
  var whichCode = window.Event ? e.which : e.keyCode;
  if (whichCode == 13 || whichCode == 8) return true;
  key = String.fromCharCode(whichCode); // Valor para o código da Chave
  if (strCheck.indexOf(key) == -1) return false; // Chave inválida
  len = objTextBox.value.length;
  for (i = 0; i < len; i++)
    if (
      objTextBox.value.charAt(i) != "0" &&
      objTextBox.value.charAt(i) != SeparadorDecimal
    )
      break;
  aux = "";
  for (; i < len; i++)
    if (strCheck.indexOf(objTextBox.value.charAt(i)) != -1)
      aux += objTextBox.value.charAt(i);
  aux += key;
  len = aux.length;
  if (len == 0) objTextBox.value = "";
  if (len == 1) objTextBox.value = "0" + SeparadorDecimal + "0" + aux;
  if (len == 2) objTextBox.value = "0" + SeparadorDecimal + aux;
  if (len > 2) {
    aux2 = "";
    for (j = 0, i = len - 3; i >= 0; i--) {
      if (j == 3) {
        aux2 += SeparadorMilesimo;
        j = 0;
      }
      aux2 += aux.charAt(i);
      j++;
    }
    objTextBox.value = "";
    len2 = aux2.length;
    for (i = len2 - 1; i >= 0; i--) objTextBox.value += aux2.charAt(i);
    objTextBox.value += SeparadorDecimal + aux.substr(len - 2, len);
  }
  return false;
}
var formatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 2,
});

const extractUl = document.querySelector(".extract-itens");
const extractTotal = document.querySelector(".value-total");
const form = document.querySelector("#formulario_1");
const inputSelect = document.querySelector(".input-select");
const inputMercadoria = document.querySelector(".input-mercadoria");
const inputValor = document.querySelector(".input-valor");
const clean = document.querySelector(".clean");
const prejuizo = document.querySelector(".prejuizo");
const lucro = document.querySelector(".lucro");

var localStorageTransactions = JSON.parse(localStorage.getItem("transactions"));
let transactions =
  localStorage.getItem("transactions") !== null ? localStorageTransactions : [];

clean.addEventListener("click", function cleanner() {
  let confirma = confirm("Todos as transações serão removidas!");
  if (confirma == true) {
    lucro.style.display = "none";
    prejuizo.style.display = "none";
    transactions = [];
    alert("Transações excluídas!");
  } else {
    alert("Operação cancelada!");
  }
  updateLocalStorage();
  desenhaTabela();
});

const addTransactionsIntoDOM = (transactions) => {
  const operador = transactions.operator == "valor1" ? "-" : "+";
  const CSSClass = transactions.amount < 0 ? "minus" : "plus";
  const li = document.createElement("li");

  li.classList.add(CSSClass);
  li.innerHTML = `
  <p class="operador">${operador}</p>
  <p class="conteudo">${transactions.name}</p>
  <p class="valor"> R$${transactions.amount}</p>
    `;
  extractUl.append(li);
};

function valorTotal() {
  let total = 0;
  transactions.forEach((t) => {
    let replace = t.amount.replaceAll(".", "").replaceAll(",", ".");
    total += replace * (t.operator == "valor1" ? -1 : 1);
  });

  if (total > 0) {
    prejuizo.style.display = "none";
    lucro.style.display = "block";
  }
  if (total < 0) {
    lucro.style.display = "none";
    prejuizo.style.display = "block";
  }
  if (total == 0) {
    lucro.style.display = "none";
    prejuizo.style.display = "none";
  }
  extractTotal.textContent = `${formatter.format(total)}`;
}

function desenhaTabela() {
  extractUl.innerHTML = "";
  transactions.forEach(addTransactionsIntoDOM);
  valorTotal();
}
desenhaTabela();

const updateLocalStorage = () => {
  localStorage.setItem("transactions", JSON.stringify(transactions));
};

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const transactionOperator = inputSelect.value.trim();
  const transactionName = inputMercadoria.value.trim();
  const transactionAmount = inputValor.value.trim();

  if (transactionName === "") {
    alert("Por favor preencha o nome da transação!");
    return false;
  }
  if (transactionAmount === "") {
    alert("Por favor preencha o valor da transação!");
    return false;
  }

  const transaction = {
    operator: transactionOperator,
    name: transactionName,
    amount: transactionAmount,
  };

  transactions.push(transaction);
  desenhaTabela();
  updateLocalStorage();
  inputMercadoria.value = "";
  inputValor.value = "";
});

//Não consegui realizar a soma do valor total com a mascara de moeda :(
//Não consegui realizar as ações a partir do input compra/venda... Para que o valor se torne positivo ou negativo :(
