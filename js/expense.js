let all_expenses = [];

let current_page_no = 1;

let total_expenses_per_page = 5;

if(localStorage.getItem("all_expenses")){
    all_expenses = JSON.parse(localStorage.getItem("all_expenses"));

    console.log("Fetched expenses:", all_expenses);
}

setupSearch();

setupCategoryFilter();

setupDateFilter();

setupAddExpenseDialog();

setupAmountRangeDailog();

renderAllExpenses(all_expenses);

function renderAllExpenses(expenses){

    const table = document.querySelector("table tbody");

    table.innerHTML = "";

    let exp_idx = 0;

    if(current_page_no > 1)
        exp_idx = (current_page_no*total_expenses_per_page) - total_expenses_per_page

    while(exp_idx < current_page_no*total_expenses_per_page){
        addExpense(expenses[exp_idx]);
        exp_idx += 1;
    }

    // render Footer with pagination

    let total_pages = parseInt(expenses.length/total_expenses_per_page);

    if(expenses.length%total_expenses_per_page > 0){
        total_pages += 1;
    }

    console.log("Total Expenses:", expenses.length);

    renderFooter(total_pages, expenses);

    showHideNoExpensesBanner(expenses.length);
}

function showHideNoExpensesBanner(total_expenses){

    const el_no_expense_banner = document.querySelector(".no-expenses-banner");

    if(total_expenses > 0){
        el_no_expense_banner.classList.add("hide-expenses-banner");
    }else{
        el_no_expense_banner.classList.remove("hide-expenses-banner");
    }

}

function addExpense(expense){

    if(!expense)
        return

    const table = document.querySelector("table tbody");

    const expense_row = document.createElement("tr");

    expense_row.dataset.id = expense.id;

    expense_row.classList.add("expense");

    const expense_title = document.createElement("td");
    expense_title.innerText = expense.title;

    const expense_category = document.createElement("td");
    expense_category.innerText = expense.category;

    const expense_amount = document.createElement("td");
    expense_amount.innerText = expense.amount.toLocaleString();

    const expense_date = document.createElement("td");
    expense_date.innerText = expense.date_created;

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

    expense_edit_btn.onclick = () => {  
        console.log("Updating expense...");
        updateExpense(expense);
    }

    const expense_delete_btn = document.createElement("i");
    expense_delete_btn.classList.add("fa-solid");
    expense_delete_btn.classList.add("fa-trash");

    expense_delete_btn.onclick = () => {
        console.log("Deleting expense...");
        
        deleteExpense(expense);

        renderAllExpenses(filterExpenses());
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

function deleteExpense(expense){

    for(const exp_index in all_expenses){

        const exp = all_expenses[exp_index];

        if(exp.id === expense.id){
            all_expenses.splice(exp_index,1);
            console.log("Expense Removed.");
            break;
        }

    }

    localStorage.setItem("all_expenses", JSON.stringify(all_expenses));
    
}

function viewExpense(expense){

    const view_expense_dialog = document.getElementById("view-expense-dialog");

    const view_expense_title = document.getElementById("view-expense-title");
    view_expense_title.innerText = expense.title;

    const view_expense_category = document.getElementById("view-expense-category");
    view_expense_category.innerText = expense.category;

    const view_expense_amount = document.getElementById("view-expense-amount");
    view_expense_amount.innerText = expense.amount.toLocaleString();

    const view_expense_notes = document.getElementById("view-expense-notes");
    view_expense_notes.innerText = expense.notes;

    const view_expense_date_created = document.getElementById("view-expense-date-created");
    view_expense_date_created.innerText = expense.date_created;

    const view_expense_date_modified = document.getElementById("view-expense-date-modified");
    view_expense_date_modified.innerText = expense.date_modified;

    const close_view_expense_dialog = document.getElementById("close-view-expense-dialog");

    close_view_expense_dialog.onclick = () => {

        view_expense_dialog.close();

    }

    view_expense_dialog.showModal();

}

function updateExpense(expense){

    const update_expense_dialog = document.getElementById("update-expense-dialog");

    const update_expense_title = document.getElementById("update-expense-title-dlg");
    update_expense_title.value = expense.title;

    const update_expense_category = document.getElementById("update-expense-category-dlg");
    update_expense_category.value = expense.category;

    const update_expense_amount = document.getElementById("update-expense-amount-dlg");
    update_expense_amount.value = expense.amount;

    const update_expense_notes = document.getElementById("update-expense-notes-dlg");
    update_expense_notes.value = expense.notes;

    const btn_update_expense_dlg = document.getElementById("btn-update-expense-dlg");

    const btn_close_expense_dlg = document.getElementById("btn-close-update-expense-dlg");

    btn_update_expense_dlg.onclick = () => {

        const exp_title = update_expense_title.value.trim();
        const exp_category = update_expense_category.value;
        const exp_amount = parseFloat(update_expense_amount.value);
        const exp_notes = update_expense_notes.value;
        const exp_date_modified = formateDate(new Date());

        if(!exp_title){
            alert("Please enter expense title.");
            return;
        }

        if(!exp_category){
            alert("Please enter expense category.");
            return;
        }

        if(exp_category === "Choose Category"){
            alert("Please select valid category.");
            return;
        }

        if(!exp_amount || exp_amount <= 0){
            alert("Please enter valid expense amount.");
            return;
        }

        if(!exp_notes){
            alert("Please enter expense notes.");
            return;
        }

        expense.title = exp_title;
        expense.category = exp_category;
        expense.amount = exp_amount;
        expense.notes = exp_notes;
        expense.date_modified = exp_date_modified;

        localStorage.setItem("all_expenses", JSON.stringify(all_expenses));

        console.log("Updated Expenses:", all_expenses);

        renderAllExpenses(all_expenses);

        update_expense_dialog.close();
    }

    btn_close_expense_dlg.onclick = () => {
        console.log("closing update dialog...");
        update_expense_dialog.close();
    }

    update_expense_dialog.showModal();

}


function setupAddExpenseDialog(){

    const btnAddExpense = document.getElementById("addExpense");

    const add_expense_popup = document.getElementById("add-expense-dialog");

    const btn_add_expense_dlg = document.getElementById("btn-add-expense-dlg");

    const btn_close_expense_dlg = document.getElementById("btn-close-expense-dlg");

    btnAddExpense.onclick = () => add_expense_popup.showModal();

    btn_close_expense_dlg.onclick = () => add_expense_popup.close();

    btn_add_expense_dlg.onclick = () => {
        
        const el_expense_title = document.getElementById("expense-title-dlg");
        const exp_title = el_expense_title.value.trim();
        
        const el_expense_category = document.getElementById("expense-category-dlg");
        const exp_category = el_expense_category.value;
        
        const el_expense_amount = document.getElementById("expense-amount-dlg");
        const exp_amount = parseFloat(el_expense_amount.value);

        const el_expense_notes = document.getElementById("expense-notes-dlg");
        const exp_notes = el_expense_notes.value;

        const el_expense_date = document.getElementById("expense-date-dlg");
        const exp_date = el_expense_date.value;

        if(!exp_title){
            alert("Please enter an expense title.");
            return;
        }

        if(!exp_category){
            alert("Please select expense category.");
            return;
        }

        if(exp_category === "Choose Category"){
            alert("Please select valid category.");
            return;
        }

        if(!exp_amount || exp_amount <= 0){
            alert("Please enter a vaild amount.");
            return;
        }

        if(!exp_notes){
            alert("Please enter expense notes.");
            return;
        }

        if(!exp_date){
            alert("Please enter expense date.");
            return;
        }

        const expense = {
            "id": crypto.randomUUID(),
            "title": exp_title,
            "category": exp_category,
            "amount": exp_amount,
            "notes": exp_notes,
            "date_created": exp_date,
            "date_modified": exp_date
        }; 

        all_expenses.push(expense);

        localStorage.setItem("all_expenses", JSON.stringify(all_expenses));

        current_page_no = 1;

        renderAllExpenses(filterExpenses())

        el_expense_title.value = "";
        el_expense_category.value = "Choose Category";
        el_expense_amount.value = "";
        el_expense_notes.value = "";

        console.log("Expense:", all_expenses[all_expenses.length-1]);

        add_expense_popup.close();

    };

}

function setupAmountRangeDailog(){

    const el_amount_range = document.getElementById("amount-range");

    const amount_range_dialog = document.getElementById("amount-range-dialog");

    const amnt_range_apply =document.getElementById("amnt-range-apply");

    const amnt_range_clear =document.getElementById("amnt-range-clear");

    el_amount_range.onclick = () => {
        amount_range_dialog.showModal();
    };

    amnt_range_apply.onclick = () => {

        const el_start_range = document.getElementById("amount-range-start");

        const el_end_range = document.getElementById("amount-range-end");

        const start_range_value = el_start_range.value;

        const end_range_value = el_end_range.value;

        if(!start_range_value){
            alert("Enter Start Range.");
            return;
        }

        if(!end_range_value){
            alert("Enter End Range.");
            return;
        }

        const start_range = parseFloat(start_range_value);

        const end_range = parseFloat(end_range_value);

        if(start_range < 0 || end_range < 0){
            alert("Either of the range is negative. Please enter positive range.");
            return;
        }

        if(start_range > end_range){
            alert("Start Range should be lesser than end range.");
            return;
        }

        const filteredExpenses = filterExpenses();

        renderAllExpenses(filteredExpenses);

        el_amount_range.innerText = `PKR. (${start_range} - ${end_range})`

        amount_range_dialog.close();

    };

    amnt_range_clear.onclick = () => {

        const el_start_range = document.getElementById("amount-range-start");

        const el_end_range = document.getElementById("amount-range-end");

        el_start_range.value = "";

        el_end_range.value = "";

        el_amount_range.innerText = "Amount Range";

        const filteredExpenses = filterExpenses();

        renderAllExpenses(filteredExpenses);

        amount_range_dialog.close();
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

function setupSearch(){

    const el_search = document.getElementById("search");

    let timeoutId = null;

    el_search.onkeydown = (e) => {  

        timeoutId = searchExpenses(timeoutId);

    };
}

function searchExpenses(timeoutId){

    if(timeoutId)
        clearTimeout(timeoutId);

    return setTimeout(() => {

        const filteredExpenses = filterExpenses();

        renderAllExpenses(filteredExpenses);

    }, 500);
}

function setupCategoryFilter(){

    const el_category = document.getElementById("category-filter");

    el_category.onchange = (e) => {

        const filteredExpenses = filterExpenses();

        renderAllExpenses(filteredExpenses);

    };

}

function setupDateFilter(){

    const dateFilter = document.getElementById("dateFilter");

    dateFilter.onclick = () => {
        dateFilter.showPicker();
    }

    dateFilter.onchange = () => {

        const filteredExpenses = filterExpenses();

        renderAllExpenses(filteredExpenses);

    }

}

function filterExpenses(){

    const search_value = document.getElementById("search").value;

    const category_value = document.getElementById("category-filter").value;

    const date_value = document.getElementById("dateFilter").value;

    const start_value = document.getElementById("amount-range-start").value;

    const start_range = start_value === "" ? null : Number(start_value);

    const end_value = document.getElementById("amount-range-end").value;

    const end_range = end_value === "" ? null : Number(end_value);

    let filtered_expenses = all_expenses;

    console.log("Search Value:", search_value);

    filtered_expenses = filterExpensesByQuery(search_value, filtered_expenses);

    console.log("Query Filtered Expenses:", filtered_expenses);

    console.log("Category:", category_value);

    filtered_expenses = filterExpensesByCategory(category_value, filtered_expenses);

    console.log("Category Filtered Expenses:", filtered_expenses);

    console.log("Date:", date_value);

    filtered_expenses = filterExpensesByDate(date_value, filtered_expenses);

    console.log("Date Filtered Expenses:", filtered_expenses);

    console.log("Start Range:", start_range);

    console.log("End Range:", end_range);

    filtered_expenses = filterExpensesByAmountRange(start_range, end_range, filtered_expenses);

    console.log("Amount Filtered Expenses:", filtered_expenses);

    return filtered_expenses;
}

function renderFooter(total_pages, expenses){

    console.log("Total Pages:", total_pages);

    const el_footer = document.querySelector("footer");

    el_footer.innerHTML = "";

    for(let i=1; i<=total_pages; i++){
        
        const btn_page = document.createElement("button");

        if(current_page_no === i)
            btn_page.classList.add("active");

        btn_page.innerText = i;

        btn_page.dataset.id = i;

        btn_page.onclick = () => {
            current_page_no = i;
            renderAllExpenses(expenses);
        }

        el_footer.appendChild(btn_page);

    }

    if(total_pages > 1){

        const last_page_btn = createLastPageButton(total_pages);

        last_page_btn.onclick = () => {
            current_page_no = total_pages;
            renderAllExpenses(expenses);
        }

        el_footer.appendChild(last_page_btn);

    }

}

function createLastPageButton(total_pages){

    const last_page_btn = document.createElement("button");

    last_page_btn.dataset.id = total_pages;

    const last_page_btn_icon = document.createElement("i");

    last_page_btn_icon.classList.add("fa-solid");

    last_page_btn_icon.classList.add("fa-forward");

    last_page_btn.appendChild(last_page_btn_icon);

    return last_page_btn;
}

function filterExpensesByCategory(category, expenses){

    if(category === "All Categories")
        return expenses;

    return expenses.filter(exp => exp.category === category);
}

function filterExpensesByDate(selected_date, expenses){

    if(!selected_date){
        return expenses;
    }

    return expenses.filter(exp => exp.date_created === selected_date);
}

function filterExpensesByAmountRange(start_range, end_range, expenses){

    if(start_range && end_range && start_range > 0 && end_range > 0 && start_range < end_range){
        return expenses.filter(exp => exp.amount >= start_range && exp.amount <= end_range);
    }else{
        return expenses;
    }
}

function filterExpensesByQuery(search_value, expenses){
    return expenses.filter(exp => exp.title.toLowerCase().includes(search_value.toLowerCase()));
}