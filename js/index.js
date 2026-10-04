let expenses = [];

if(localStorage.getItem("all_expenses")){
    expenses = JSON.parse(localStorage.getItem("all_expenses"));

    console.log("All Expenses:", expenses);
}

const el_total_expenses = document.getElementById("total-expenses");
const el_today_expenses = document.getElementById("today-expenses");
const el_week_expenses = document.getElementById("week-expenses");
const el_expense_count = document.getElementById("expense-count");

setTotalExpenses();
setTodayExpenses();
setExpenseCount();
setWeekExpenses();

renderWeeklyExpenseOverviewChart();

renderWeeklyCategoryBreakdownChart();

renderRecentExpenses();

function setWeekExpenses(){

    try{

        const weekExpenses = filterWeeklyExpenses();

        const total_week_expenses = weekExpenses.reduce((sum, exp) => sum+exp.amount,0);

        el_week_expenses.innerText = `PKR ${total_week_expenses.toLocaleString()}`;

    }catch(e){
        console.log("Error in setting week expenses:", e);
    }

    
}


function setExpenseCount(){
    try{
        el_expense_count.innerText = expenses.length;
    }catch(e){
        console.log("Error in setting expense count:", e);
    }
}

function setTotalExpenses(){

    try{
        const total_expenses = expenses.reduce((sum, exp) => {return sum+exp.amount} ,0)

        el_total_expenses.innerText = `PKR ${total_expenses.toLocaleString()}`;
    }catch(e){
        console.log("Error in setting total expenses:", e);
    }
}

function setTodayExpenses(){

    try{

        const curr_date = new Date();

        const formatted_curr_date = formateDate(curr_date);

        const curr_expenses = expenses.filter((exp) => exp.date_created === formatted_curr_date).
                                reduce((sum, exp) => {return sum+exp.amount}, 0);

        el_today_expenses.innerText = `PKR ${curr_expenses.toLocaleString()}`;

    }catch(e){
        console.log("Error in setting today expenses:", e);
    }

}


function formateDate(current_date){
    if(current_date){
        const day = String(current_date.getDate()).padStart(2, "0");
        const month = String(current_date.getMonth()+1).padStart(2, "0"); // Months are zero indexed
        return `${current_date.getFullYear()}-${month}-${day}`
    }
    return null;
}

function renderRecentExpenses(){

    const expenses_table_body = document.querySelector("table tbody");

    console.log("Expenses Table Body:", expenses_table_body);

    for(let exp_idx = expenses.length-5; exp_idx < expenses.length; exp_idx++){

        try{

            const exp = expenses[exp_idx];

            if(!exp)
                continue

            const expense_row = document.createElement("tr");

            expense_row.classList.add("expense");

            const title = document.createElement("td");
            title.innerText = exp.title;

            const category = document.createElement("td");
            category.innerText = exp.category;

            const amount = document.createElement("td");
            amount.innerText = `PKR ${exp.amount.toLocaleString()}`;

            const date = document.createElement("td");
            date.innerText = exp.date_created;

            expense_row.appendChild(title);
            expense_row.appendChild(category);
            expense_row.appendChild(amount);
            expense_row.appendChild(date);

            expenses_table_body.appendChild(expense_row);

        }catch(e){
            console.log("Errror in rendering recent expenses:", e);
        }
    }

    
}

function renderWeeklyExpenseOverviewChart(){

    const weeklyExpenses = filterWeeklyExpenses();

    const weeklyExpensesMap = {};

    const weekDates = getWeekStartEndDates();

    for(let i=0; i<7; i++){

        const weekDay = new Date(weekDates.weekStartDate);

        weekDay.setDate(weekDay.getDate() + i);

        weeklyExpensesMap[formateDate(weekDay)] = 0;
    }

    for(const exp of weeklyExpenses){
        
        if(exp.expense_date in weeklyExpensesMap){
            weeklyExpensesMap[exp.expense_date] += exp.amount;
        }else{
            weeklyExpensesMap[exp.expense_date] = exp.amount;
        }
    }

    renderOverviewChart(weeklyExpensesMap);

}

function renderWeeklyCategoryBreakdownChart(){

    const weeklyExpenses = filterWeeklyExpenses();

    const categoryMap = {
        "Food": 0,
        "Travel": 0,
        "Bills": 0,
        "Health": 0,
        "Shopping": 0,
        "Other": 0
    };

    for(const exp of weeklyExpenses){

        if(exp.category in categoryMap){
            categoryMap[exp.category] += exp.amount;
        }else{
            categoryMap[exp.category] = exp.amount;
        }

    }

    renderDoughnutChart(categoryMap);

}

function filterWeeklyExpenses(){

    const weekStartEndDates = getWeekStartEndDates();

    const weekStartDate = weekStartEndDates.weekStartDate;
    const weekEndDate = weekStartEndDates.weekEndDate;

    const weeklyExpenses = expenses.filter((exp) => {

        const exp_date = new Date(exp.expense_date);
        exp_date.setHours(0,0,0,0);

        return exp_date >= weekStartDate && exp_date <= weekEndDate;
    });

    return weeklyExpenses;
}

function renderOverviewChart(chart_expenses){

    const ctx = document.getElementById("expenseOverviewChart");

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: Object.keys(chart_expenses),
            datasets: [{
                label: "Expenses (PKR)",
                data: Object.values(chart_expenses),
                backgroudColor: "#6366f1",
                borderRadius: 6
            }],
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        }
    });

}

function renderDoughnutChart(categories_data){

    const ctx = document.getElementById("categoryBreakdownChart");

    new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: Object.keys(categories_data),
            datasets: [
                {
                    data: Object.values(categories_data),
                    backgroundColor: [
                        "#6366f1",
                        "#14b8a6",
                        "#f59e0b",
                        "#ec4899",
                        "#8b5cf6",
                        "#06b6d4"
                    ],
                    borderWidth: 2,
                    borderColor: "#ffffff",
                    hoverOffset: 6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: "65%"
        }
    });

}

function getWeekStartEndDates(){
    const curr_date = new Date();
    curr_date.setHours(0,0,0, 0);

    const day = curr_date.getDay();

    const diff = curr_date.getDate() - day + (day === 0 ? -6 : 1);

    const weekStartDate = new Date();
    weekStartDate.setDate(diff);
    weekStartDate.setHours(0,0,0,0);

    const weekEndDate = new Date();
    weekEndDate.setDate(diff+6);
    weekEndDate.setHours(0,0,0,0);

    return {
        "weekStartDate": weekStartDate,
        "weekEndDate": weekEndDate
    }
}