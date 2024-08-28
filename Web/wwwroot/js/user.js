let searchValue = ""

let page = 1;
let amount = 10;
let maxPage = 1;

let tbody = document.getElementsByTagName("tbody")[0];
let pageCounter = document.getElementById("pageCounter");

function generateTableRow(user) {

    let tr = document.createElement("tr");

    // Creating td elements
    let tdName = document.createElement("td");
    let tdEmail = document.createElement("td");
    let tdPhone = document.createElement("td");
    let tdCompany = document.createElement("td");
    let tdRole = document.createElement("td");
    let tdBtns = document.createElement("td");

    // Styling
    tdName.style = "width:15%";
    tdEmail.style = "width:15%";
    tdPhone.style = "width:15%";
    tdCompany.style = "width:10%";
    tdRole.style = "width:15%";

    //Setting td Id's
    tdName.id = "Title";
    tdEmail.id = "Email";
    tdPhone.id = "Phone";
    tdCompany.id = "Company";

    // Appending td text 
    tdName.innerText = user.name;
    tdEmail.innerText = user.streetAddress;
    tdPhone.innerText = user.city;
    tdCompany.innerText = user.state;
    tdRole.innerText = user.phoneNumber;

    // Creating buttons 
    let lockBtn = document.createElement("a");
    let permissionBtn = document.createElement("a");

    //permissionBtn.onclick = openModal;
    //permissionBtn.url = `/Admin/User/Delete/${company.id}`;
    let today = new Date().getTime()
    let lockoutEnd = new Date(user.lockoutEnd).getTime()

    lockBtn.setAttribute('onClick', `LockUnlock('${user.id}')`)
    permissionBtn.setAttribute('href', `/Admin/User/RoleManagement?userId=${user.id}`);

    if (lockoutEnd > today) {
        lockBtn.innerHTML = "<i class=\"bi bi-lock-fill\"></i> Lock"
    }
    else {
        lockBtn.innerHTML = "<i class=\"bi bi-unlock-fill\"></i> Unlock"
    }

    permissionBtn.innerHTML = "<i class=\"bi bi-pencil-square\" > </i> Delete"

    lockBtn.className = "btn btn-primary mx-2"
    permissionBtn.className = "btn btn-danger mx-2"

    // Creating the row and appending it to the table
    tdBtns.append(lockBtn, permissionBtn)
    tr.append(tdName, tdEmail, tdPhone, tdCompany, tdRole, tdBtns);
    tbody.appendChild(tr);
}

function LockUnlock(id) {
    $.ajax({
        type: 'POST',
        url: '/Admin/User/LockUnlock',
        data: JSON.stringify(id),
        contentType: 'application/json',
        success: data => {
            if (data.success) {
                toastr.success(data.message)
                getPages()
            }
        }
    })
}

function getPages() {
    tbody.innerHTML = ''
    $.ajax({
        // url: `/Admin/Product/getrange?start=${amount*(page-1)}&end=${amount}`,
        url: `/Admin/User/getrange?start=${amount * (page - 1)}&end=${amount * page}&filter=${searchValue}`,
        success: (data) => {
            data["data"].forEach((company) => generateTableRow(company));
        }
    }).then(() => {

    })
}

function getMaxSize() {
    $.ajax({
        url: `/Admin/User/getall?filter=${searchValue}`,
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