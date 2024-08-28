let searchValue = "";

let page = 1;
let amount = 2;
let maxPage = 1;

let tbody = document.getElementsByTagName("tbody")[0];
let pageCounter = document.getElementById("pageCounter");

function generateTableRow(banner) {

    let tr = document.createElement("tr");

    // Creating td elements
    let tdId = document.createElement("td");
    let tdName = document.createElement("td");
    let tdUrl = document.createElement("td");
    let tdImage = document.createElement("td");
    let tdBtns = document.createElement("td");

    // Styling
    tdId.style = "width:10%";
    tdName.style = "width:10%";
    tdUrl.style = "width:20%";
    tdImage.style = "width:40%";

    //Setting td Id's
    tdId.id = "Id";
    tdName.id = "Name";
    tdUrl.id = "Url";
    tdImage.id = "Image";

    // Appending td text 
    tdId.innerText = banner.id;
    tdName.innerText = banner.name;
    tdUrl.innerText = banner.imageUrl;

    let image = document.createElement("img");
    image.src = banner.imageUrl;
    image.style = "width:200px;height:200px;object-fit:contain;";
    tdImage.appendChild(image);

    // Creating buttons 
    let deleteBtn = document.createElement("a");
    let editBtn = document.createElement("a");

    deleteBtn.onclick = openModal;
    deleteBtn.url = `/admin/banner/delete/${banner.id}`;

    editBtn.setAttribute('href', `/Admin/Banner/Upsert/${banner.id}`);

    editBtn.innerHTML = "<i class=\"bi bi-pencil-square\"></i> Edit"
    deleteBtn.innerHTML = "<i class=\"bi bi-trash-fill\" > </i> Delete"

    editBtn.className = "btn btn-primary mx-2"
    deleteBtn.className = "btn btn-danger mx-2"

    // Creating the row and appending it to the table
    tdBtns.append(editBtn, deleteBtn)
    tr.append(tdId, tdName, tdUrl, tdImage, tdBtns);
    tbody.appendChild(tr);
}

function getPages() {
    tbody.innerHTML = ''
    $.ajax({
        url: `/Admin/Banner/getrange?start=${amount * (page - 1)}&end=${amount * page}&filter=${searchValue}`,
        success: (data) => {
            data["data"].forEach((banner) => generateTableRow(banner));
        }
    }).then(() => {

    })
}

function getMaxSize() {
    $.ajax({
        url: `/Admin/Banner/getall?filter=${searchValue}`,
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