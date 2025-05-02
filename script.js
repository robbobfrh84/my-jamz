let data = [];

const start = function() {
  fetch('./data/data.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(payload => {
      data = payload
      add_playlist_cards(data);
    })
    .catch(error => {
      if (!data || data.length < 1) {
        alert("🔥 😱 Uh oh, we've had a problem getting your data. Make sure you're serving locally to properly get data.json")
      }    
    });
}


const add_playlist_cards = function(data) {
  const elm = document.getElementById('playlistCards')
  let html = "";
  const noImg = "assets/img/no_image.png"
  // * 👀 ☝️: fall-back image

  // data = []
  // * 👀 ☝️: The above code will allow you to test when there isn't any playlists

  data.forEach( (playlist, index) => {
    html +=
      `<div class="card" onclick="open_playlist_modal(${playlist.playlistID},${index})">

      <img src='${playlist.playlist_art || noImg}' alt='Playlist Image' width='100%'>

      <h3>${playlist.playlist_name}</h3>

      <div class="cursor-default">

        <p>${playlist.playlist_author}</p>

        <svg id="heart-${playlist.playlistID}" 
          onclick="event.stopPropagation(); heart_playlist(${playlist.playlistID})"
          onmouseover="this.querySelector('path').setAttribute('fill', 'red')"
          onmouseout="this.querySelector('path').setAttribute('fill', 'none')"
          class="svg-heart" width="20" height="20" viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M12 21s-6-4.35-9-8.6C1.5 9.1 2.42 5.5 5.5 4.5 7.24 3.93 9 5 12 8c3-3 4.76-4.07 6.5-3.5 3.08 1 4 4.6 2.5 7.9C18 16.65 12 21 12 21z" 
            fill="none" 
            stroke=${ playlist.likes ? "red" : "black" } 
            stroke-width="2"
          />
        </svg>

        <span>${ playlist.likes || 0 }</span>

        </div>

      </div>`
  })

  if (data.length < 1) {
    errorMessage.innerHTML = `
      <br>
      Looks like you don't have any playlists yet. <br>
      That's ok. <br>
      Let's make one! <br>
      <button class="main-button">Create A Playlist</button>`
  }

  elm.innerHTML = html;
}

const heart_playlist = function(playlistID) {
  const playlist = data.find(p => p.playlistID == playlistID);
  if (playlist.hearted) {
    playlist.likes--
    playlist.hearted = false
  } else {
    playlist.likes++
    playlist.hearted = true
  }
  add_playlist_cards(data)
}


const open_playlist_modal = function(playlistID, playlistIndex) {
  const playlist = data.find(p => p.playlistID == playlistID);
  const noImg = "assets/img/no_image.png";
  document.getElementById('playlistName').innerText = playlist.playlist_name;
  document.getElementById('playlistAuthor').innerText = "Created by " + playlist.playlist_author;
  document.getElementById('playlistImage').src = playlist.playlist_art || noImg;
  shuffle_button.onclick = function() {
    shuffle_songs(playlistIndex);
  }
  add_songs(playlist);
  modal.style.display = "block";
}


const add_songs = function(playlist) {
  playlistSongs = document.getElementById('playlistSongs');
  playlistSongs.innerHTML = "";
  const noSongImage = "assets/img/no_song_image.png";
  // * 👀 ☝️: The above code will allow you to test when there isn't any playlists

  playlist.songs.forEach( song => {
    const li = document.createElement('li');
    li.innerText = song.title;
    li.innerHTML = `
      <img src='${song.image || noSongImage}' alt='Song Image' width='100' height=100'>
      <div>
        <h3>${song.title}</h3>
        <p>${song.artist}</p>
        <p>${song.album}</p>
      </div>
      <time>${song.length}</time>`;

    playlistSongs.appendChild(li);
  })

  if (playlist.songs.length < 1) {
    playlistSongs.innerHTML = " * No Songs in thie Playlist 😢.";
  }
}

const shuffle_songs = function(playlistIndex) { 
  
  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  const playlistCopy = JSON.parse(JSON.stringify(data[playlistIndex]));
  playlistCopy.songs = shuffleArray(playlistCopy.songs);
  // * 👀 ☝️: The above code actually shuffles the songs only while the modal is open. So, closing and opening again will erase the shuffle.

  // data[playlistIndex].songs = playlistCopy.songs;
  // * 👀 ☝️: The above code actually shuffles the data index, so that the shuffle order will stay the same even if you jump around playlists.

  add_songs(playlistCopy);
}



// * JavaScript for Opening and Closing the Modal
var modal = document.getElementById("playlistModal");
var span = document.getElementsByClassName("close")[0];

span.onclick = function() {
  modal.style.display = "none";
}
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}


start();