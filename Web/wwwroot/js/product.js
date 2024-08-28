let searchValue = "";

let page = 1;
let amount = 10;
let maxPage = 1;

let tbody = document.getElementsByTagName("tbody")[0];
let pageCounter = document.getElementById("pageCounter");

function generateTableRow(product) {

    let tr = document.createElement("tr");

    // Creating td elements
    let tdTitle = document.createElement("td");
    let tdISBN = document.createElement("td");
    let tdAuthor = document.createElement("td");
    let tdListPrice = document.createElement("td");
    let tdCategory = document.createElement("td");
    let tdBtns = document.createElement("td");

    // Styling
    tdTitle.style = "width:15%";
    tdISBN.style = "width:15%";
    tdListPrice.style = "width:10%";
    tdAuthor.style = "width:15%";
    tdCategory.style = "width:15%";

    //Setting td Id's
    tdTitle.id = "Title";
    tdISBN.id = "ISBN";
    tdAuthor.id = "Author";
    tdCategory.id = "Category";

    // Appending td text 
        tdTitle.innerText = product.title;
    tdISBN.innerText = product.isbn;
    tdAuthor.innerText = product.author;
    tdListPrice.innerText = product.listPrice;
    tdCategory.innerText = product.category.name;

    // Creating buttons 
        let editBtn = document.createElement("a");
    let deleteBtn = document.createElement("a");

    deleteBtn.onclick = openModal;
    deleteBtn.url = `/admin/product/delete/${product.id}`;

    editBtn.setAttribute('href', `/Admin/Product/Upsert/${product.id}`);

    editBtn.innerHTML = "<i class=\"bi bi-pencil-square\"></i> Edit"
    deleteBtn.innerHTML = "<i class=\"bi bi-trash-fill\" > </i> Delete"

    editBtn.className = "btn btn-primary mx-2"
    deleteBtn.className = "btn btn-danger mx-2"

    // Creating the row and appending it to the table
    tdBtns.append(editBtn, deleteBtn)
    tr.append(tdTitle, tdISBN, tdListPrice, tdAuthor, tdCategory, tdBtns);
    tbody.appendChild(tr);
}

function getPages() {
    tbody.innerHTML = ''
    $.ajax({
        // url: `/Admin/Product/getrange?start=${amount*(page-1)}&end=${amount}`,
        url: `/Admin/Product/getrange?start=${amount * (page - 1)}&end=${amount * page}&filter=${searchValue}`,
        success: (data) => {
            data["data"].forEach((product) => generateTableRow(product));
        }
    }).then(() => {

    })
}

function getMaxSize() {
    $.ajax({
        url: `/Admin/Product/getall?filter=${searchValue}`,
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