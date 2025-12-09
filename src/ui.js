// src/ui.js
export function renderUserProfile(profile) {
  document.getElementById("user-profile").innerHTML = `
    <img src="${profile.images[0]?.url}">
    <div>
      <h3>${profile.display_name}</h3>
      <p>${profile.email}</p>
    </div>
  `;
}

export function renderTopArtists(data) {
  const container = document.getElementById("top-artists");
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
