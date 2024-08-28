let searchValue = "";

let page = 1;
let amount = 10;
let maxPage = 1;

let tbody = document.getElementsByTagName("tbody")[0];
let pageCounter = document.getElementById("pageCounter");

function generateTableRow(category) {

    let tr = document.createElement("tr");

    // Creating td elements
    let tdName = document.createElement("td");
    let tdDisplayOrder = document.createElement("td");
    let tdBtns = document.createElement("td");

    // Styling
    tdName.style = "width:50%";
    tdDisplayOrder.style = "width:25%";


    //Setting td Id's
    tdName.id = "Name";
    tdDisplayOrder.id = "DisplayOrder";


    // Appending td text 
    tdName.innerText = category.name;
    tdDisplayOrder.innerText = category.displayOrder;


    // Creating buttons 
    let editBtn = document.createElement("a");
    let deleteBtn = document.createElement("a");

    deleteBtn.onclick = openModal;
    deleteBtn.url = `/admin/category/delete/${category.id}`;

    editBtn.setAttribute('href', `/Admin/Category/Upsert/${category.id}`);

    editBtn.innerHTML = "<i class=\"bi bi-pencil-square\"></i> Edit"
    deleteBtn.innerHTML = "<i class=\"bi bi-trash-fill\" > </i> Delete"

    editBtn.className = "btn btn-primary mx-2"
    deleteBtn.className = "btn btn-danger mx-2"

    // Creating the row and appending it to the table
    tdBtns.append(editBtn, deleteBtn)
    tr.append(tdName, tdDisplayOrder, tdBtns);
    tbody.appendChild(tr);
}

function getPages() {
    tbody.innerHTML = ''
    $.ajax({
        // url: `/Admin/Product/getrange?start=${amount*(page-1)}&end=${amount}`,
        url: `/Admin/Category/getrange?start=${amount * (page - 1)}&end=${amount * page}&filter=${searchValue}`,
        success: (data) => {
            data["data"].forEach((category) => generateTableRow(category));
        }
    }).then(() => {

    })
}

function getMaxSize() {
    $.ajax({
        url: `/Admin/Category/getall?filter=${searchValue}`,
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