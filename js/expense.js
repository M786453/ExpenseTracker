const all_expenses = [];

const btnAddExpense = document.getElementById("addExpense");

const add_expense_popup = document.getElementById("add-expense-dialog");

const btn_add_expense_dlg = document.getElementById("btn-add-expense-dlg");

const btn_close_expense_dlg = document.getElementById("btn-close-expense-dlg");

btnAddExpense.onclick = () => add_expense_popup.showModal();

btn_close_expense_dlg.onclick = () => add_expense_popup.close();

btn_add_expense_dlg.onclick = () => {
    const expense_title = document.getElementById("expense-title-dlg");
    const expense_category = document.getElementById("expense-category-dlg");
    const expense_amount = document.getElementById("expense-amount-dlg");
    const expense_notes = document.getElementById("expense-notes-dlg");

    const curr_date = formateDate(new Date());

    all_expenses.push({
        "id": crypto.randomUUID(),
        "title": expense_title.value,
        "category": expense_category.value,
        "amount": expense_amount.value,
        "notes": expense_notes.value,
        "date": curr_date
    })

    console.log("Expense:", all_expenses[all_expenses.length-1]);

    add_expense_popup.close();

};

function formateDate(current_date){
    if(current_date){
        const day = String(current_date.getDate()).padStart(2, "0");
        const month = String(current_date.getMonth()+1).padStart(2, "0"); // Months are zero indexed
        return `${current_date.getFullYear()}-${month}-${day}`
    }
    return null;
}