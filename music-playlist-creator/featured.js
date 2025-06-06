
fetch("data/data.json")
    .then((response) => response.json())
    .then((data) =>{
        const playlist = data;
        const randomIndex = Math.floor(Math.random()*playlist.length);
        const selected = playlist[randomIndex]
        displayFeatured(selected);
    })
    .catch((error) =>{
        console.error("Error fetching data:", error);
    });


function displayFeatured(playlist){
    document.getElementById("featured-image").src = playlist.playlist_art;
    document.getElementById("featured-title").textContent = playlist.playlist_name;
    const songContainer = document.getElementById("featured-songs");
    songContainer.innerHTML = "";

    playlist.songs.forEach(song => {
        const item = document.createElement("div");
        item.className = "song-row";
        item.innerHTML = `
        <img src = "${song.cover_art}", alt = "song-cover", class="song-cover">
        <div>
            <p><strong>${song.song_title}</strong> by ${song.artist}</p>
            <p>${song.album} - ${song.duration}</p>
        </div>
        `;
        songContainer.appendChild(item);
    }); 
}