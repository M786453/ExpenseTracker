const expenses = [
    {
        "id": crypto.randomUUID(),
        "title": "Grocery",
        "category": "Food",
        "amount": 2500,
        "date": "2026-09-25"
    },
    {
        "id": crypto.randomUUID(),
        "title": "Fuel",
        "category": "Travel",
        "amount": 500,
        "date": "2026-09-25"
    },
    {
        "id": crypto.randomUUID(),
        "title": "Grocery",
        "category": "Food",
        "amount": 100,
        "date": "2026-09-21"
    },
    {
        "id": crypto.randomUUID(),
        "title": "Checkup",
        "category": "Health",
        "amount": 1500,
        "date": "2026-09-22"
    },
    {
        "id": crypto.randomUUID(),
        "title": "Grocery",
        "category": "Food",
        "amount": 500,
        "date": "2026-09-01"
    },
    {
        "id": crypto.randomUUID(),
        "title": "Fuel",
        "category": "Travel",
        "amount": 5500,
        "date": "2026-08-05"
    }
]

const el_total_expenses = document.getElementById("total-expenses");
const el_today_expenses = document.getElementById("today-expenses");
const el_week_expenses = document.getElementById("week-expenses");
const el_expense_count = document.getElementById("expense-count");

setTotalExpneses();
setTodayExpenses();
setExpenseCount();
setWeekExpenses();

function setWeekExpenses(){

    const curr_date = new Date();
    curr_date.setHours(0,0,0,0);

    const day = curr_date.getDay();

    const diff = curr_date.getDate() - day + (day === 0 ? -6 : 1);

    const startWeekDate = new Date(curr_date.setDate(diff));

    const endWeekDate = new Date(curr_date.setDate(diff+6));

    const weekExpenses = expenses.reduce((sum, exp) => {
        const exp_date = new Date(exp.date);

        if(exp_date >= startWeekDate && exp_date <= endWeekDate){
            sum += exp.amount
        }

        return sum;
    },0);

    el_week_expenses.innerText = `PKR ${weekExpenses.toLocaleString()}`;
}


function setExpenseCount(){
    el_expense_count.innerText = expenses.length;
}

function setTotalExpneses(){
    const total_expenses = expenses.reduce((sum, exp) => {return sum+exp.amount} ,0)

    el_total_expenses.innerText = `PKR ${total_expenses.toLocaleString()}`;
}

function setTodayExpenses(){

    const curr_date = new Date();

    const formatted_curr_date = formateDate(curr_date);

    const curr_expenses = expenses.filter((exp) => exp.date === formatted_curr_date).
                            reduce((sum, exp) => {return sum+exp.amount}, 0);

    el_today_expenses.innerText = `PKR ${curr_expenses.toLocaleString()}`;

}


function formateDate(current_date){
    if(current_date){
        const day = String(current_date.getDate()).padStart(2, "0");
        const month = String(current_date.getMonth()+1).padStart(2, "0"); // Months are zero indexed
        return `${current_date.getFullYear()}-${month}-${day}`
    }
    return null;
}