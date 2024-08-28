let searchValue = "";

let page = 1;
let amount = 10;
let maxPage = 1;

let tbody = document.getElementsByTagName("tbody")[0];
let pageCounter = document.getElementById("pageCounter");

function generateTableRow(company) {

    let tr = document.createElement("tr");
    

    // Creating td elements
    let tdName = document.createElement("td");
    let tdStreetAddress = document.createElement("td");
    let tdCity = document.createElement("td");
    let tdState = document.createElement("td");
    let tdphoneNumber = document.createElement("td");
    let tdBtns = document.createElement("td");

    // Styling
    tdName.style = "width:15%";
    tdStreetAddress.style = "width:15%";
    tdCity.style = "width:15%";
    tdState.style = "width:10%";
    tdphoneNumber.style = "width:15%";

    //Setting td Id's
    tdName.id = "Title";
    tdStreetAddress.id = "StreetAddress";
    tdCity.id = "City";
    tdState.id = "State";

    // Appending td text 
    tdName.innerText = company.name;
    tdStreetAddress.innerText = company.streetAddress;
    tdCity.innerText = company.city;
    tdState.innerText = company.state;
    tdphoneNumber.innerText = company.phoneNumber;

    // Creating buttons 
    let editBtn = document.createElement("a");
    let deleteBtn = document.createElement("a");

    deleteBtn.onclick = openModal;
    deleteBtn.url = `/admin/company/delete/${company.id}`;

    editBtn.setAttribute('href', `/Admin/Company/Upsert/${company.id}`);

    editBtn.innerHTML = "<i class=\"bi bi-pencil-square\"></i> Edit"
    deleteBtn.innerHTML = "<i class=\"bi bi-trash-fill\" > </i> Delete"

    editBtn.className = "btn btn-primary mx-2"
    deleteBtn.className = "btn btn-danger mx-2"

    // Creating the row and appending it to the table
    tdBtns.append(editBtn, deleteBtn)
    tr.append(tdName, tdStreetAddress, tdCity, tdState, tdphoneNumber, tdBtns);
    tbody.appendChild(tr);
}

function getPages() {
    tbody.innerHTML = ''
    $.ajax({
        // url: `/Admin/Product/getrange?start=${amount*(page-1)}&end=${amount}`,
        url: `/Admin/Company/getrange?start=${amount * (page - 1)}&end=${amount * page}&filter=${searchValue}`,
        success: (data) => {
            data["data"].forEach((company) => generateTableRow(company));
        }
    }).then(() => {

    })
}

function getMaxSize() {
    $.ajax({
        url: `/Admin/Company/getall?filter=${searchValue}`,
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