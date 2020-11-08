const dbPromised = idb.open("epl-gallery", 1, upgradedDb => {
  if (!upgradedDb.objectStoreNames.contains('teams')) {
    const TeamsObjectStore = upgradedDb.createObjectStore("teams", {keyPath: "id"});
    TeamsObjectStore.createIndex("name", "name", { unique: false });
  }  
});

const saveTeam = team => {
  return new Promise((resolve, reject) => {
    dbPromised.then(db => {
      const tx = db.transaction("teams", "readwrite");
      const store = tx.objectStore("teams");
      store.put(team);
      return tx;
    })
    .then(tx => {
      if(tx.complete) {
        resolve(alert("Tim berhasil disimpan"))
        window.location = "/#saved";
      } else {
        reject(console.log("Tim gagal disimpan"))
      }
    })
  })
};

const deleteTeam = team => {
  return new Promise((resolve, reject) => {
    dbPromised.then(db => {
      const tx = db.transaction("teams", "readwrite");
      const store = tx.objectStore("teams");
      store.delete(team.id);
      return tx;
    })
    .then(tx => {
      if(tx.complete) {
        resolve(alert("Tim berhasil dihapus"))
        window.location = "/#saved";
      } else {
        reject(console.log("Tim gagal dihapus"))
      }
    })
  })
};


const getAllTeam = () => {
    return new Promise(function(resolve, reject) {
      dbPromised
        .then(db => {
          const tx = db.transaction("teams", "readonly");
          const store = tx.objectStore("teams");
          return store.getAll();
        })
        .then(data => {
          if(data !== undefined) {
            resolve(data)
          } else {
            reject(console.log("Gagal mengambil seluruh data tim"))
          }
        })
    })
};

function getById(id) {
  return new Promise(function(resolve, reject) {
      dbPromised
      .then(function(db) {
          const tx = db.transaction("teams", "readonly");
          const store = tx.objectStore("teams");
          id = Number(id);
          return store.get(id);
      })
      .then(data => {
        resolve(data);
      });
  });
}
