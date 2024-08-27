// Seleciona os elementos do formulário.
const form = document.querySelector("form")
const amount = document.getElementById("amount")
const expense = document.getElementById("expense")
const category = document.getElementById("category")

// Seleciona os elementos da lista
const expenseList = document.querySelector("ul")
const expensesTotal = document.querySelector("aside header h2")
const expensesQuantity = document.querySelector("aside header p span")

// Capturando o evento de input para formatar o valor
amount.oninput = () => {
  let value = amount.value.replace(/\D/g, "")

  // Transforma valor de centavos para reais.
  value = Number(value)/100
  amount.value = formatCurrencyBRL(value)
}

// Função para formatar o valor para o padrão de moeda.
function formatCurrencyBRL(value){
  value = value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  })

  return value
}

// Captura o evento de submit do formulário para obter os valores
form.onsubmit = (event) => {
  event.preventDefault()

  const newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    created_at: new Date()
  }
  expenseAdd(newExpense)
}

// Adiciona um novo item na lista.
function expenseAdd(newExpense){
  try {
    // Cria o elemento para adicionar à lista de despesas.
    const expenseItem = document.createElement("li")
    expenseItem.classList.add("expense")

    // cria o icone da despesa
    const expenseIcon = document.createElement("img")
    expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)
    expenseIcon.setAttribute("alt", newExpense.category_name)

    // Cria a info da despesa.
    const expenseInfo = document.createElement("div")
    expenseInfo.classList.add("expense-info")

    // Cria o nome da despesa.
    const expenseName = document.createElement("strong")
    expenseName.textContent = newExpense.expense

    // Cria a categoria da despesa.
    const expenseCategory = document.createElement("span")
    expenseCategory.textContent = newExpense.category_name

    // Adiciona nome e categoria na div das informações da despesa.
    expenseInfo.append(expenseName, expenseCategory)

    // Adiciona valor da despesa na div das informações da despesa.
    const expenseAmount = document.createElement("span")
    expenseAmount.classList.add("expense-amount")
    expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount.toUpperCase().replace("R$", "")}`

    // Cria icone de remover
    const removeIcon = document.createElement("img")
    removeIcon.classList.add("remove-icon")
    removeIcon.setAttribute("src", "img/remove.svg")
    removeIcon.setAttribute("alt", "Remover")

    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon)

    expenseList.append(expenseItem)

    // Limpa o formulário para adicionar um novo item.
    formClear()

    //Atualiza os totais
    updateTotals()

  } catch (error) {
    alert("Não foi possível atualizar a lista de despesas.")
    console.log(error)
  }
}

// Atualiza os valores totais.
function updateTotals(){
  try {
    const items = expenseList.children
    expensesQuantity.textContent = `${items.length} ${items.length > 1 ? "despesas" : "despesa"}`

    // Variável para incrementar o total.
    let total = 0
    for(let item = 0; item < items.length; item++) {
      const itemAmount = items[item].querySelector(".expense-amount")


      // Remove caracteres não numéricos e substitui a vírgula pelo ponto.
      let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",", ".")

      // Converte o valor para float.
      value = parseFloat(value)

      // Verificca se é um número válido.
      if(isNaN(value)){
        return alert("Não foi possível calcular o total. O valor não parece ser um número")
      }

      total += Number(value)
    }

    const symbolBRL = document.createElement("small")
    symbolBRL.textContent = "R$"
    total = formatCurrencyBRL(total).toUpperCase().replace("R$", "")
    expensesTotal.innerHTML = ""
    expensesTotal.append(symbolBRL, total)

  } catch (error) {
    console.log(error)
    alert("Não foi possível atualizar os totais")
  }
}

// Captura o clique no botão de remover.
expenseList.addEventListener("click", function (event) {
  if (event.target.classList.contains("remove-icon")) {
    // Obtem a li pai do elemento clicado
    const item = event.target.closest(".expense")
    item.remove()

    console.log(event)
  }
  updateTotals()
})

function formClear(){
  expense.value = ""
  category.value = ""
  amount.value = ""

  expense.focus()
}