const token = "57ca3cb758e24958a17b68ca6656ac27";
const baseUrl = "https://api.football-data.org/v2/";

// Blok kode yang akan di panggil jika fetch berhasil
function status(response) {
    if (response.status !== 200) {
        console.log("Error : " + response.status);
        // Method reject() akan membuat blok catch terpanggil
        return Promise.reject(new Error(response.statusText));
    } else {
        // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
        return Promise.resolve(response);
    }
}

// Blok kode untuk memparsing json menjadi array JavaScript
function json(response) {
    return response.json();
}

// Blok kode untuk meng-handle kesalahan di blok catch
function error(error) {
    // Parameter error berasal dari Promise.reject()
    console.log("Error : " + error);
}
// Fetch list team di home
function getListTeams(idLeague) {
    if('caches' in window) {
        caches.match(`${baseUrl}competitions/${idLeague}/teams`, {
            headers: {
                "X-Auth-Token" : token
            }
        })
        .then(function(response) {
            if(response) {
                response.json().then(function(data) {
                    let listHTML = "";
                    data.teams.forEach(function(team) {
                        listHTML += 
                            `
                            <div class="col s6 m6 l4 xl3">
                                <a href="./tim.html?id=${team.id}">
                                <div class="card">
                                    <div class="card-image">
                                        <img src="${team.crestUrl}">
                                    </div>
                                </div>
                                </a>
                            </div>
                            `
                    });
                    document.getElementById("list-tim").innerHTML = listHTML;
                })
            }
        })
    }

    fetch(`${baseUrl}competitions/${idLeague}/teams`, {
        headers: {
            "X-Auth-Token" : token
        }
    })
    .then(status)
    .then(json)
    .then(function(data) {
        let listHTML = "";
            data.teams.forEach(function(team) {
                listHTML += 
                    `
                    <div class="col s6 m6 l4 xl3">
                        <a href="./tim.html?id=${team.id}">
                        <div class="card">
                            <div class="card-image">
                                <img src="${team.crestUrl}">
                            </div>
                        </div>
                        </a>
                    </div>
                    `
        });
        document.getElementById("list-tim").innerHTML = listHTML;
    })
    .catch(error);

}

// Fetch Jadwal
function getSchedule(idLeague) {
    if ('caches' in window) {
        caches.match(`${baseUrl}competitions/${idLeague}/matches`, {
            headers: {
                "X-Auth-Token" : token
            }
        })
        .then(function(response) {
            if(response) {
                response.json().then(function(data) {
                    let scheduleHTML = `
                    <h1 class="center">Jadwal Pertandingan</h1>
                    <table class="centered">
                        <thead>
                            <th>Tanggal</th>
                            <th>Home</th>
                            <th>Score</th>
                            <th>Away</th>
                        </thead>
                        <tbody>`;
                    data.matches.forEach(function(match){
                        if(match["matchday"] === match["season"].currentMatchday) {
                            const tanggal = match["utcDate"].slice(0, 10);
                            let scoreHome = "";
                            let scoreAway = "";
                            if(match["score"].fullTime["homeTeam"] === null)
                                scoreHome = "-";
                            else
                                scoreHome = match["score"].fullTime["homeTeam"]; 
                            
                            if(match["score"].fullTime["awayTeam"] === null)
                                scoreAway = "-";
                            else
                                scoreAway = match["score"].fullTime["awayTeam"]; 
                            scheduleHTML += `
                                <tr>
                                    <td>${tanggal}</td>
                                    <td>${match["homeTeam"].name}</td>
                                    <td>${scoreHome} : ${scoreAway}</td>
                                    <td>${match["awayTeam"].name}</td>
                                </tr>
                            `;
                        }
                    });
                    scheduleHTML += `
                        </tbody>
                        </table>
                        `;
                    document.getElementById("jadwal-pertandingan").innerHTML = scheduleHTML;
                });
            }
        });
    }
    
    fetch(`${baseUrl}competitions/${idLeague}/matches`, {
        headers: {
            "X-Auth-Token" : token
        }
    })
    .then(status)
    .then(json)
    .then(function(data){
        let scheduleHTML = `
            <h1 class="center">Jadwal Pertandingan</h1>
            <table class="centered">
                <thead>
                    <th>Tanggal</th>
                    <th>Home</th>
                    <th>Score</th>
                    <th>Away</th>
                </thead>
                <tbody>`;
        data.matches.forEach(function(match){
            if(match["matchday"] === match["season"].currentMatchday) {
                const tanggal = match["utcDate"].slice(0, 10);
                let scoreHome = "";
                let scoreAway = "";
                if(match["score"].fullTime["homeTeam"] === null)
                    scoreHome = "-";
                else
                    scoreHome = match["score"].fullTime["homeTeam"]; 
                
                if(match["score"].fullTime["awayTeam"] === null)
                    scoreAway = "-";
                else
                    scoreAway = match["score"].fullTime["awayTeam"]; 
                
                scheduleHTML += `
                    <tr>
                        <td>${tanggal}</td>
                        <td>${match["homeTeam"].name}</td>
                        <td>${scoreHome} : ${scoreAway}</td>
                        <td>${match["awayTeam"].name}</td>
                    </tr>
                `;
            }
        });
        scheduleHTML += `
            </tbody>
            </table>
            `;
        document.getElementById("jadwal-pertandingan").innerHTML = scheduleHTML;
    })
    .catch(error);
}

// Fetch Klasemen
function getStanding(idLeague) {
    if('caches' in window) {
        caches.match(`${baseUrl}competitions/${idLeague}/standings`, {
            headers: {
                "X-Auth-Token" : token
            }
        })
        .then(function(response){
            if(response) {
                response.json().then(function(data) {
                    let standingHTML = "";
                    data.standings[0].table.forEach(function(stand) {
                        standingHTML += `
                            <tr>
                                <td>${stand.position}</td>
                                <td>
                                    <img src="${stand.team['crestUrl']}" id="img-klasemen">
                                </td>
                                <td style="text-align: left;">${stand.team["name"]}</td>
                                <td>${stand.playedGames}</td>
                                <td>${stand.won}</td>
                                <td>${stand.draw}</td>
                                <td>${stand.lost}</td>
                                <td>${stand.goalsFor}</td>
                                <td>${stand.goalsAgainst}</td>
                                <td>${stand.goalDifference}</td>
                                <td>${stand.points}</td>
                            </tr>
                        `;
                    });
                    document.getElementById("klasemen-list").innerHTML = standingHTML;
                });
            }
        });
    }

    fetch(`${baseUrl}competitions/${idLeague}/standings`, {
        headers: {
            "X-Auth-Token" : token
        }
    })
    .then(status)
    .then(json)
    .then(function (data) {
        let standingHTML = "";
        data.standings[0].table.forEach(function(stand) {
            standingHTML += `
                <tr>
                    <td>${stand.position}</td>
                    <td>
                        <img src="${stand.team['crestUrl']}" id="img-klasemen">
                    </td>
                    <td style="text-align: left;">${stand.team["name"]}</td>
                    <td>${stand.playedGames}</td>
                    <td>${stand.won}</td>
                    <td>${stand.draw}</td>
                    <td>${stand.lost}</td>
                    <td>${stand.goalsFor}</td>
                    <td>${stand.goalsAgainst}</td>
                    <td>${stand.goalDifference}</td>
                    <td>${stand.points}</td>
                </tr>
            `;
        });
        document.getElementById("klasemen-list").innerHTML = standingHTML;
    })
    .catch(error);
}

// Fecth Tim Favorit
function getTeam() {
    return new Promise(function(resolve, reject){
        let urlParams = new URLSearchParams(window.location.search);
        let idParam = urlParams.get("id");

        if('caches' in window) {
            caches.match(`${baseUrl}teams/${idParam}`, {
                headers: {
                    "X-Auth-Token" : token
                }
            })
            .then(function(response) {
                if(response) {
                    response.json().then(function(info){
                        let teamHTML = "";
                        let pelatih = "-";
                        info.squad.find(coach => {
                            if(coach.role === "COACH")
                                pelatih =  coach.name;
                        });
                        teamHTML += `
                            <h1 class="header center">${info.name}</h1>
                            <div class="card horizontal">
        
                                <div class="card-image info-image col s3 m4>
                                    <img src="${info.crestUrl}">
                                </div>
        
                                <div class="card-stacked col s9 m8">
                                    <div class="card-content">
                                        <table>
                                        <tr>
                                            <td>Founded</td>
                                            <td>:</td>
                                            <td>${info.founded}</td>
                                        </tr>
                                        <tr>
                                            <td>Address</td>
                                            <td>:</td>
                                            <td>${info.address}</td>
                                        </tr>
                                        <tr>
                                            <td>Phone</td>
                                            <td>:</td>
                                            <td>${info.phone}</td>
                                        </tr>
                                        <tr>
                                            <td>E-mail</td>
                                            <td>:</td>
                                            <td>${info.email}</td>
                                        </tr>
                                        <tr>
                                            <td>Stadium</td>
                                            <td>:</td>
                                            <td>${info.venue}</td>
                                        </tr>
                                        <tr>
                                            <td>Pelatih</td>
                                            <td>:</td>
                                            <td>${pelatih}</td>
                                        </tr>
                                        <table>
                                    </div>
                                </div>
        
                                <div class="card-action">
                                    <a class="btn-small waves-effect waves-light" href="${info.website}" id="website-btn">Website</a>
                                </div>
                            </div>
                        `;
                        let count = 1;
                        let playerHTML = `
                            <table class="centered">
                            <thead>
                                <th>No</th>
                                <th>Nama</th>
                                <th>Posisi</th>
                                <th>Kebangsaan</th>
                            <thead>
                            <tbody>
                        `;
                        info.squad.forEach(player => {
                            if(player.role === "PLAYER") {
                                playerHTML += `
                                <tr>
                                    <td>${count}</td>
                                    <td>${player.name}</td>
                                    <td>${player.position}</td>
                                    <td>${player.nationality}</td>
                                </tr>
                                `;
                                count += 1;
                            }
                        });
                        playerHTML += `
                                </tbody>
                            </table>
                            </div>`;
                        document.getElementById("tim").innerHTML = teamHTML;
                        document.getElementById("player").innerHTML = playerHTML;
                        resolve(info);
                    });
                }
            });
        }

        fetch(`${baseUrl}teams/${idParam}`, {
            headers: {
                "X-Auth-Token" : token
            }
        })
        .then(status)
        .then(json)
        .then(function(info){
            let teamHTML = "";
            let pelatih = "-";
            info.squad.find(coach => {
                if(coach.role === "COACH")
                    pelatih =  coach.name;
            });
            teamHTML += `
                <h1 class="header center">${info.name}</h1>
                <div class="card horizontal">

                    <div class="card-image info-image col s3 m4">
                        <img src="${info.crestUrl}">
                    </div>

                    <div class="card-stacked col s9 m8">
                        <div class="card-content">
                            <table>
                            <tr>
                                <td>Founded</td>
                                <td>:</td>
                                <td>${info.founded}</td>
                            </tr>
                            <tr>
                                <td>Address</td>
                                <td>:</td>
                                <td>${info.address}</td>
                            </tr>
                            <tr>
                                <td>Phone</td>
                                <td>:</td>
                                <td>${info.phone}</td>
                            </tr>
                            <tr>
                                <td>E-mail</td>
                                <td>:</td>
                                <td>${info.email}</td>
                            </tr>
                            <tr>
                                <td>Stadium</td>
                                <td>:</td>
                                <td>${info.venue}</td>
                            </tr>
                            <tr>
                                <td>Pelatih</td>
                                <td>:</td>
                                <td>${pelatih}</td>
                            </tr>
                            <table>
                        </div>
                    </div>

                    <div class="card-action">
                        <a class="btn-small waves-effect waves-light" href="${info.website}" id="website-btn">Website</a>
                    </div>
                </div>
            `;
            let count = 1;
            let playerHTML = `
                <table class="centered">
                <thead>
                    <th>No</th>
                    <th>Nama</th>
                    <th>Posisi</th>
                    <th>Kebangsaan</th>
                <thead>
                <tbody>
            `;
            info.squad.forEach(player => {
                if(player.role === "PLAYER") {
                    playerHTML += `
                    <tr>
                        <td>${count}</td>
                        <td>${player.name}</td>
                        <td>${player.position}</td>
                        <td>${player.nationality}</td>
                    </tr>
                    `;
                    count += 1;
                }
            });
            playerHTML += `
                    </tbody>
                </table>
                </div>`;
            document.getElementById("tim").innerHTML = teamHTML;
            document.getElementById("player").innerHTML = playerHTML;
            resolve(info);
        })
        .catch(error);
    });
}

// Fetch list tim favorit
function getSavedTeams() {
    getAllTeam().then(function(teams) {
        let teamsHTML = `
            <h1 class="header center">Team Favorit</h1>
        `;
        if (teams.length === 0) {
            teamsHTML += `
                <div class="row">
                    <h5 class="center red-text">Belum ada tim yang disimpan!</h5>
                </div>
            `
        }
        teams.forEach(function(team) {
        teamsHTML += `
            <div class="col s6 m6 l4 xl3">
                <a href="./tim.html?id=${team.id}&saved=true">
                    <div class="card">
                        <div class="card-image">
                            <img src="${team.crestUrl}">
                        </div>
                    </div>
                </a>
            </div>
                    `;
        });
        document.getElementById("teams").innerHTML = teamsHTML;
    });
}

// Fetch tim favorit
function getSavedTeamById() {
    return new Promise(function(resolve, reject){
        let urlParams = new URLSearchParams(window.location.search);
        let idParam = urlParams.get("id");

        getById(idParam).then(function(info) {
            let teamHTML = "";
            let pelatih = "-";
            info.squad.find(coach => {
                if(coach.role === "COACH")
                    pelatih =  coach.name;
            });
            teamHTML += `
                <h1 class="header center">${info.name}</h1>
                <div class="card horizontal">

                    <div class="card-image info-image col s3 m4">
                        <img src="${info.crestUrl}">
                    </div>

                    <div class="card-stacked col s9 m8">
                        <div class="card-content">
                            <table>
                            <tr>
                                <td>Founded</td>
                                <td>:</td>
                                <td>${info.founded}</td>
                            </tr>
                            <tr>
                                <td>Address</td>
                                <td>:</td>
                                <td>${info.address}</td>
                            </tr>
                            <tr>
                                <td>Phone</td>
                                <td>:</td>
                                <td>${info.phone}</td>
                            </tr>
                            <tr>
                                <td>E-mail</td>
                                <td>:</td>
                                <td>${info.email}</td>
                            </tr>
                            <tr>
                                <td>Stadium</td>
                                <td>:</td>
                                <td>${info.venue}</td>
                            </tr>
                            <tr>
                                <td>Pelatih</td>
                                <td>:</td>
                                <td>${pelatih}</td>
                            </tr>
                            <table>
                        </div>
                    </div>

                    <div class="card-action">
                        <a class="btn-small waves-effect waves-light" href="${info.website}" id="website-btn">Website</a>
                    </div>
                </div>
            `;
            let count = 1;
            let playerHTML = `
                <table class="centered">
                <thead>
                    <th>No</th>
                    <th>Nama</th>
                    <th>Posisi</th>
                    <th>Kebangsaan</th>
                <thead>
                <tbody>
            `;
            info.squad.forEach(player => {
                if(player.role === "PLAYER") {
                    playerHTML += `
                    <tr>
                        <td>${count}</td>
                        <td>${player.name}</td>
                        <td>${player.position}</td>
                        <td>${player.nationality}</td>
                    </tr>
                    `;
                    count += 1;
                }
            });
            playerHTML += `
                    </tbody>
                </table>
                </div>`;
            document.getElementById("tim").innerHTML = teamHTML;
            document.getElementById("player").innerHTML = playerHTML;
            resolve(info);
        });
    });
}