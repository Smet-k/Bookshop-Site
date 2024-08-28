let currentStatus = document.getElementById("status")

let searchValue = "";

let page = 1;
let amount = 10;
let maxPage = 1;

let tbody = document.getElementsByTagName("tbody")[0];
let pageCounter = document.getElementById("pageCounter");

function generateTableRow(order) {

    let tr = document.createElement("tr");

    // Creating td elements
    let tdId = document.createElement("td");
    let tdName = document.createElement("td");
    let tdPhoneNumber = document.createElement("td");
    let tdApplicationUserEmail = document.createElement("td");
    let tdOrderStatus = document.createElement("td");
    let tdOrderTotal = document.createElement("td");
    let tdBtns = document.createElement("td");

    // Styling
    tdId.style = "width:5%";
    tdName.style = "width:15%";
    tdPhoneNumber.style = "width:15%";
    tdApplicationUserEmail.style = "width:15%";
    tdOrderStatus.style = "width:10%";
    tdOrderTotal.style = "width:15%";

    //Setting td Id's
    tdId.id = "Id";
    tdName.id = "Name";
    tdPhoneNumber.id = "PhoneNumber";
    tdApplicationUserEmail.id = "Email";

    // Appending td text 
    tdId.innerText = order.id
    tdName.innerText = order.name;
    tdPhoneNumber.innerText = order.phoneNumber;
    tdApplicationUserEmail.innerText = order.applicationUser.email
    tdOrderStatus.innerText = order.orderStatus;
    tdOrderTotal.innerText = order.orderTotal;

    // Creating buttons 
    let detailsBtn = document.createElement("a");

    //deleteBtn.onclick = openModal;
    detailsBtn.setAttribute('href', `/Admin/Order/Details/${order.id}`);

    detailsBtn.innerHTML = "<i class=\"bi bi-pencil-square\"></i> Details"

    detailsBtn.className = "btn btn-warning mx-2"

    // Creating the row and appending it to the table
    //tdBtns.append(editBtn, deleteBtn)
    tdBtns.append(detailsBtn)
    tr.append(tdId, tdName, tdPhoneNumber, tdApplicationUserEmail, tdOrderStatus, tdOrderTotal, tdBtns);
    tbody.appendChild(tr);
}

function getPages() {
    tbody.innerHTML = ''
    $.ajax({
        // url: `/Admin/Product/getrange?start=${amount*(page-1)}&end=${amount}`,
        url: `/Admin/Order/getrange?status=${currentStatus.value}&start=${amount * (page - 1)}&end=${amount * page}&filter=${searchValue}`,
        success: (data) => {
            data["data"].forEach((company) => generateTableRow(company));
        }
    })
}

function getMaxSize() {
    $.ajax({
        url: `/Admin/Order/getall?status=${currentStatus.value}&filter=${searchValue}`,
        success: (data) => {
            maxPage = Math.ceil(data["data"].length / amount);
            if (maxPage > 0) {
                page = Math.min(maxPage, page)
                pageCounter.innerText = page;
            }
            getPages();
        }
    })
}

$(() => {
    getMaxSize()

})

function nextPage() {
    if (page < maxPage) {
        page += 1;
        pageCounter.innerText = page;
        getPages();
    }
}

function prevPage() {
    if (page > 1) {
        page -= 1;
        pageCounter.innerText = page;
        getPages();
    }
}

function firstPage() {
    if (page != 1) {
        page = 1;
        pageCounter.innerText = page;
        getPages();
    }
}

function lastPage() {
    if (page != maxPage) {
        page = maxPage;
        pageCounter.innerText = maxPage;
        getPages();
    }
}

function search(e) {
    searchValue = e.value;
    getMaxSize()
}

function Delete(url) {
    $.ajax({
        url: url,
        type: "DELETE",
        success: (data) => {
            toastr.success(data.message)
        }
    }).then(() => {
        window.location.reload()
    })
}


