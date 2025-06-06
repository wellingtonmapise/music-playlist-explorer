let playlistState;

//global variable for modalcontent
const modal = document.querySelector(".modal-overlay");

fetch("data/data.json")
    .then((response) => response.json())
    .then((data) =>{
        playlistState = data
        displayPlaylists(playlistState);
    })
    .catch((error) =>{
        console.error("Error fetching data:", error);
    });

function displayPlaylists(playlistState){
    const container = document.querySelector(".playlist-cards");
    container.innerHTML = "";

    if (!playlistState|| playlistState.length === 0){
        container.innerHTML = `<p>No playlists to display</p>`;
        return;
    }

    playlistState.forEach((playlist) => {
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

        const likeIcon = card.querySelector(".fa-heart")
        const likeCount = card.querySelector(".like-count")

        likeIcon.addEventListener("click",(event) =>{
            event.stopPropagation();
            likeIcon.classList.toggle("liked");
            const isLiked = likeIcon.classList.contains("liked");
            let count = parseInt(likeCount.textContent);
            likeCount.textContent = isLiked ? count + 1 : count - 1;

        });
        card.addEventListener("click",() =>{
            displayModal(playlist);
        });
        container.appendChild(card)
    });

}

function displayModal(playlist){
    //header
    modal.querySelector(".playlist-header img").src = playlist.playlist_art;
    modal.querySelector(".playlist-header h2").textContent = playlist.playlist_name;
    modal.querySelector(".playlist-header p").textContent = `Created by ${playlist.playlist_author}`;

    document.getElementById("shuffle-button").addEventListener("click",() => {
        const shuffledSongs = shuffleArray(playlist.songs);

        const shuffledPlaylist = {
            ...playlist,
            songs: shuffledSongs
        };
        const modalContent = document.querySelector(".modal-content");
        updateContent(shuffledPlaylist, modalContent);
        

    });
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

function updateContent(playlist,modalContent){
    //header
    modalContent.querySelector(".playlist-header img").src = playlist.playlist_art;
    modalContent.querySelector(".playlist-header h2").textContent = playlist.playlist_name;
    modalContent.querySelector(".playlist-header p").textContent = `Created by ${playlist.playlist_author}`;

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

function shuffleArray(arr){
    shuffled = arr.slice();
    for (let i = arr.length - 1; i >= 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

