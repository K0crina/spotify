// src/ui.js
//Actualizăm structura paginilor html introducând datele utilizatorului

export function renderUserProfile(profile) {
  // Selectăm elementul HTML unde afișăm profilul
  // și îi înlocuim complet conținutul
  document.getElementById("user-profile").innerHTML = `
    <img src="${profile.images[0]?.url}">
    <div>
      <h3>${profile.display_name}</h3>
      <p>${profile.email}</p>
    </div>
  `;
}

export function renderTopArtists(data) {
   // Selectăm containerul unde vor fi afișați artiștii
  const container = document.getElementById("top-artists");
   // Curățăm conținutul anterior pentru a evita duplicarea
  container.innerHTML = "";

  data.items.forEach((artist) => {
    container.innerHTML += `
      <div class="item-card">
        <img src="${artist.images[0]?.url}">
        <p>${artist.name}</p>
      </div>
    `;
  });
}

export function renderTopAlbums(albums) {
  // Selectăm containerul pentru albume
  const container = document.getElementById("top-albums");
  container.innerHTML = "";

  albums.forEach((album) => {
    container.innerHTML += `
      <div class="item-card">
        <img src="${album.images[0]?.url}">
        <p>${album.name}</p>
      </div>
    `;
  });
}
// Afișează rezultatele de căutare (artiști și melodii)
//Înainte de a reactualiza datele cu cele ale utilizatorului curățăm ce era 
//înainte
export function renderSearchResults(data) {
  const container = document.getElementById("search-results");
  container.innerHTML = "";

  data.artists.items.forEach((artist) => {
    container.innerHTML += `<p>${artist.name}</p>`;
  });

  data.tracks.items.forEach((track) => {
    container.innerHTML += `<p>${track.name}</p>`;
  });
}
