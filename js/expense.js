const all_expenses = [];

setupAddExpenseDailog();

function addExpense(expense){

    const table = document.querySelector("table tbody");

    const expense_row = document.createElement("tr");

    expense_row.classList.add("expense");

    const expense_title = document.createElement("td");
    expense_title.innerText = expense.title;

    const expense_category = document.createElement("td");
    expense_category.innerText = expense.category;

    const expense_amount = document.createElement("td");
    expense_amount.innerText = parseInt(expense.amount).toLocaleString();

    const expense_date = document.createElement("td");
    expense_date.innerText = expense.date;

    const expense_actions = document.createElement("td");

    const expense_actions_div = document.createElement("div");
    expense_actions_div.classList.add("expense-actions");

    const expense_view_btn = document.createElement("i");
    expense_view_btn.classList.add("fa-regular");
    expense_view_btn.classList.add("fa-eye");

    expense_view_btn.onclick = () => {
        console.log("Viewing expense...");
        viewExpense(expense);
    }

    const expense_edit_btn = document.createElement("i");
    expense_edit_btn.classList.add("fa-solid");
    expense_edit_btn.classList.add("fa-pencil");

    const expense_delete_btn = document.createElement("i");
    expense_delete_btn.classList.add("fa-solid");
    expense_delete_btn.classList.add("fa-trash");

    expense_delete_btn.onclick = () => {
        table.removeChild(expense_row);
    };

    expense_actions_div.appendChild(expense_view_btn);
    expense_actions_div.appendChild(expense_edit_btn);
    expense_actions_div.appendChild(expense_delete_btn);

    expense_actions.appendChild(expense_actions_div);

    expense_row.appendChild(expense_title);
    expense_row.appendChild(expense_category);
    expense_row.appendChild(expense_amount);
    expense_row.appendChild(expense_date);
    expense_row.appendChild(expense_actions);

    table.appendChild(expense_row);
}

function viewExpense(expense){

    const view_expense_dailog = document.getElementById("view-expense-dailog");

    const view_expense_title = document.getElementById("view-expense-title");
    view_expense_title.innerText = expense.title;

    const view_expense_category = document.getElementById("view-expense-category");
    view_expense_category.innerText = expense.category;

    const view_expense_amount = document.getElementById("view-expense-amount");
    view_expense_amount.innerText = parseInt(expense.amount).toLocaleString();

    const view_expense_notes = document.getElementById("view-expense-notes");
    view_expense_notes.innerText = expense.notes;

    const view_expense_date = document.getElementById("view-expense-date");
    view_expense_date.innerText = expense.date;

    const close_view_expense_dailog = document.getElementById("close-view-expense-dailog");

    close_view_expense_dailog.onclick = () => {

        view_expense_dailog.close();

    }

    view_expense_dailog.showModal();

}

function setupAddExpenseDailog(){

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

        const expense = {
            "id": crypto.randomUUID(),
            "title": expense_title.value,
            "category": expense_category.value,
            "amount": expense_amount.value,
            "notes": expense_notes.value,
            "date": curr_date
        }; 

        all_expenses.push(expense);

        addExpense(expense);

        expense_title.value = "";
        expense_category.value = "";
        expense_amount.value = "";
        expense_notes.value = "";

        console.log("Expense:", all_expenses[all_expenses.length-1]);

        add_expense_popup.close();

    };

}

function formateDate(current_date){
    if(current_date){
        const day = String(current_date.getDate()).padStart(2, "0");
        const month = String(current_date.getMonth()+1).padStart(2, "0"); // Months are zero indexed
        return `${current_date.getFullYear()}-${month}-${day}`
    }
    return null;
}