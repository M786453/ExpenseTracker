const btnAddExpense = document.getElementById("addExpense");

const add_expense_popup = document.getElementById("add-expense-dialog")

const close_expense_popup = document.getElementById("close-expense-dialog");

btnAddExpense.onclick = () => add_expense_popup.showModal();

close_expense_popup.onclick = () => add_expense_popup.close();

