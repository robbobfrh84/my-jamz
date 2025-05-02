let data = [];

const start_featured = function() {
  fetch('./data/data.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(payload => {
      data = payload;
      get_random_playlist(data);
    })
    .catch(error => {
      if (!data || data.length < 1) {
        alert("🔥 😱 Uh oh, we've had a problem getting your data. Make sure you're serving locally to properly get data.json")
      }
    });
}

const get_random_playlist = function(data) {
  const randomIndex = Math.floor(Math.random() * data.length);
  const featuredPlaylist = data[randomIndex];
  set_playlist(featuredPlaylist, randomIndex)
}

const set_playlist = function(playlist, playlistIndex) {
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

  console.log('playlist:',playlist)

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

      console.log('li:',li)

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


start_featured();