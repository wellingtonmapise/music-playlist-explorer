fetch("data/data.json")
    .then((response) => response.json())
    .then((data) =>{
        console.log(data)
        console.log(data[0])
        displayPlaylists(data);
    })
    .catch((error) =>{
        console.error("Error fetching data:", error);
    });

function displayPlaylists(data){
    const container = document.querySelector(".playlist-cards");
    container.innerHTML = "";

    if (!data|| data.length === 0){
        container.innerHTML = `<p>No playlists to display</p>`;
        return;
    }

    data.forEach((playlist) => {
        const card = document.createElement("div");
        card.classList.add("playlist-card");

        card.innerHTML = `
            <img src="${playlist.playlist_art}" alt="playlist-card">
            <div class="card-content">
            <h2>${playlist.playlist_name}</h2>
            <p>Created by ${playlist.playlist_author}</p>
            <p class="like-container">
            <i class="fa-regular fa-heart"></i>
            <span class="like-count">${playlist.like_count || 0}</span>
            </p>
            </div>
            `;

        card.addEventListener("click",() =>{
            displayModal(playlist);
        });
        container.appendChild(card)
    });

}

document.addEventListener("DOMContentLoaded",() => {
    fetch("data/data.json")
    .then((response) => response.json())
    .then((data) =>{
        console.log(data)
        //displayModal(data[0]);
    })
    .catch((error) =>{
        console.error("Error fetching data:", error);
    });

});


function displayModal(playlist){
    const modal = document.querySelector(".modal-overlay");

    //header
    modal.querySelector(".playlist-header img").src = playlist.playlist_art;
    modal.querySelector(".playlist-header h2").textContent = playlist.playlist_name;
    modal.querySelector(".playlist-header p").textContent = `Created by ${playlist.playlist_author}`;
    //songs

    const songList = modal.querySelector(".song-list");
    songList.innerHTML = "";
    playlist.songs.forEach(song =>{
        const item = document.createElement("div");
        item.classList.add("song-item");
        item.innerHTML = `
            <img src = "${song.cover_art}", alt = "song-cover", width = "50">
            <div class="song-info">
                <p class="song-title">${song.song_title}</p>
                <p>${song.artist}<br> ${song.album}</p>
            </div>
            <p>${song.duration}</p>
        `;
        songList.appendChild(item);
    });
    modal.classList.remove("hidden");
}

const modalOverlay = document.querySelector(".modal-overlay");

modalOverlay.addEventListener("click",(event) =>{
    if (event.target === modalOverlay){
        modalOverlay.classList.add("hidden");
    }
});