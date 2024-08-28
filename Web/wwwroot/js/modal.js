let modal = document.getElementById("modal");

let btn = document.getElementById("myBtn");

let dim = document.getElementsByClassName("dim")[0];

function openModal(e) {
    let url = e.currentTarget.url;
    modal.style.display = "block";
    dim.style.display = "block";

    let deleteBtn = document.getElementById("modalDeleteBtn");
    let closeBtn = document.getElementById("modalCloseBtn");


    deleteBtn.onclick = function () {
        modal.style.display = "none";
        dim.style.display = "none";
        Delete(url)
    }

    closeBtn.onclick = function () {
        modal.style.display = "none";
        dim.style.display = "none";
    }

}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
        dim.style.display = "none";
    }
}