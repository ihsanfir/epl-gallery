if ("serviceWorker" in navigator) {
window.addEventListener("load", function() {
    navigator.serviceWorker
        .register("/sw.js")
        .then(function() {
            console.log("Pendaftaran ServiceWorker berhasil");
        })
        .catch(function() {
            console.log("Pendaftaran ServiceWorker gagal");
        });
});
} else {
    console.log("ServiceWorker belum didukung browser ini.");
}

document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const btnSave = document.getElementById("save");
    const btnDelete = document.getElementById("delete");
    const isFromSaved = urlParams.get("saved");
    if (isFromSaved) {
        btnSave.style.display = 'none';
        const item = getSavedTeamById();
        btnDelete.onclick = function() {
            item.then(function(team) {
                deleteTeam(team);
            });
        }
    } else {
        const item = getTeam();
        btnDelete.style.display = 'none';
        btnSave.onclick = function() {
            item.then(function(team) {
                saveTeam(team);
            });
        }
    }
});