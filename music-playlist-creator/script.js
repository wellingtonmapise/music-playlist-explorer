let editingPlaylist = null;
let playlistState;


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
    playlistState.forEach(displaySinglePlaylist);

}


function likePlaylist(likeIcon,likeCount){
        likeIcon.addEventListener("click",(event) =>{
            event.stopPropagation();
            likeIcon.classList.toggle("liked");
            const isLiked = likeIcon.classList.contains("liked");
            let count = parseInt(likeCount.textContent);
            likeCount.textContent = isLiked ? count + 1 : count - 1;

        });


}
function displayModal(playlist){
    
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
            <img src = "${song.cover_art || "assets/img/playlist.png"}", alt = "song-cover", width = "50">
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
   
    modalContent.querySelector(".playlist-header img").src = playlist.playlist_art;
    modalContent.querySelector(".playlist-header h2").textContent = playlist.playlist_name;
    modalContent.querySelector(".playlist-header p").textContent = `Created by ${playlist.playlist_author}`;

   
    const songList = modal.querySelector(".song-list");
    songList.innerHTML = "";
    playlist.songs.forEach(song =>{
        const item = document.createElement("div");
        item.classList.add("song-item");
        item.innerHTML = `
            <img src = "${song.cover_art || assets/img/playlist.png}", alt = "song-cover", width = "50">
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

document.getElementById("add-song-btn").addEventListener("click", () => {
    const songInput = document.createElement("div");
    songInput.className = "song-input";
    songInput.innerHTML = `
        <input type="text" placeholder="Song Title" class="-form" required />
        <input type="text" placeholder="Artist" class="song-artist" required /> 
        <input type="text" placeholder="Duration" class="song-duration" required /> 
    `
    document.getElementById("songs-container").appendChild(songInput);
});

function handleFormSubmit(e) {
  e.preventDefault();

  const name = document.getElementById("playlist-name").value;
  const author = document.getElementById("playlist-author").value;

  const songs = Array.from(document.querySelectorAll(".song-input")).map(songDiv => {
    console.log(songDiv)
    return {
      song_title: songDiv.querySelector(".song-title").value,
      artist: songDiv.querySelector(".song-artist").value,
      duration: songDiv.querySelector(".duration").value,
    };
  });

  if (editingPlaylist) {
    editingPlaylist.playlist_name = name;
    editingPlaylist.playlist_author = author;
    editingPlaylist.songs = songs;
    editingPlaylist = null;
  } else {
    const newPlaylist = {
      playlist_name: name,
      playlist_author: author,
      playlist_art: "assets/img/song.png",
      like_count: 0,
      songs: songs
    };
    playlistState.push(newPlaylist);
  }

  displayPlaylists(playlistState);
  localStorage.setItem("myPlaylists", JSON.stringify(playlistState));

  e.target.reset();
  document.getElementById("songs-container").innerHTML = `
    <div class="song-input"> 
      <input placeholder="Song Title" class="song-title-form" required />
      <input placeholder="Artist" class="song-artist" required /> 
      <input placeholder="Duration" class="duration" required /> 
    </div>
  `;
  document.getElementById("playlist-form").classList.add("hidden");
}
function showForm() {
  const formContent = document.getElementById("playlist-form");
  formContent.classList.remove("hidden");
}

document.getElementById("playlist-form").addEventListener("submit", handleFormSubmit);

document.getElementById("create-new").addEventListener("click", () => {
  showForm(); 
});




function displaySinglePlaylist(playlist){
    const container = document.querySelector(".playlist-cards");
    const card = document.createElement("div");
    card.className ="playlist-card";
    card.innerHTML = `
    <img src="${playlist.playlist_art}" alt="playlist-card">
            <div class="card-content">
            <h2>${playlist.playlist_name}</h2>
            <p>Created by ${playlist.playlist_author}</p>
            <div class="like-container">
            <i class="fa-regular fa-heart"></i>
            <span class="like-count">${playlist.like_count || 0}</span>
            </div>
            <button class ="delete-btn"> 🗑️ Delete </button>
            <button class ="edit-btn"> ✏️ Edit </button>
            </div>
    `;
   
    const likeIcon = card.querySelector(".fa-heart");
    const likeCount = card.querySelector(".like-count");
    likePlaylist(likeIcon,likeCount);

    card.addEventListener("click",() =>{
    displayModal(playlist);
    });
    container.appendChild(card);
   
    const deleteBtn = card.querySelector(".delete-btn");
    deleteBtn.addEventListener("click",(e) => {
        e.stopPropagation();
        card.remove();
    });

    
    const editBtn = card.querySelector(".edit-btn");
    editBtn.addEventListener("click",(e) => {
        showForm();
        e.stopPropagation();
        

        document.getElementById("playlist-name").value = playlist.playlist_name;
        document.getElementById("playlist-author").value = playlist.playlist_author;

        const songsContainer = document.getElementById("songs-container");
        songsContainer.innerHTML ="";

        playlist.songs.forEach(song=>{
            const songInput = document.createElement("div");
            songInput.className = "song-input";
            songInput.innerHTML = `

            <input class="song-title-form" value="${song.song_title}" />
            <input class="song-artist" value="${song.artist}" /> 
            <input class="duration" value="${song.duration}" />   
            `;
            songsContainer.appendChild(songInput);
        });
        editingPlaylist = playlist;
});


}

document.getElementById("search-input").addEventListener("input", function(){

    const query = this.value.toLowerCase();
    const filteredPlaylists = playlistState.filter(playlist =>{
        return(
            playlist.playlist_name.toLowerCase().includes(query) || playlist.playlist_author.toLowerCase().includes(query)
        );
    });
    displayPlaylists(filteredPlaylists);
});


document.getElementById("sort-select").addEventListener("change", function(){
    const sortBy = this.value;
    const sortedPlaylists = [...playlistState];

    if (sortBy === "name"){
        sortedPlaylists.sort((a,b) =>
            a.playlist_name.toLowerCase().localeCompare(b.playlist_name.toLowerCase())
    );
    }
    else if (sortBy === "likes") {
        sortedPlaylists.sort((a,b) => b.like_count - a.like_count);
    }
    displayPlaylists(sortedPlaylists);
});

function closeForm() {
    const formContent = document.getElementById("playlist-form");
    formContent.classList.add("hidden");
}
document.getElementById("create-new").addEventListener("click", () => {
    showForm();
});
document.getElementById("close-form-btn").addEventListener("click", () => {
    closeForm();
});