// Constants
const header = document.querySelector(".inner");
const nav = document.querySelector("nav");
const main = document.querySelector("main");
const modes = document.querySelector(".modes");
const hamburgerIcon = document.querySelector(".hamburger-icon");
const hamSvgColor = document.querySelector(".ham-svg-color");
const inputBox = document.querySelector(".input-box");
const languageSvg = document.querySelector(".svg_box");
const languageSvg2 = document.querySelector(".svg_box2");
const loginSignup = document.querySelector(".user");
const lightMode = document.querySelector(".light-mode");
const darkMode = document.querySelector(".dark-mode");
const carousel = document.querySelector(".carousel");
const prevBtn = document.querySelector(".prevBtn");
const nextBtn = document.querySelector(".nextBtn");
const musicLibrary = document.querySelector(".music-library");
const audioPlayer = document.getElementById("audio_player");
var currentSongObj = {};
const defaultImage = "assests/images/defaultImage.gif";
const songCover = document.querySelector("#song-cover");
const songName = document.querySelector(".song-name");
const albumName = document.querySelector(".album-name");
const songCurrentDuration = document.querySelector(".song-start-time");
const songTotalDuration = document.querySelector(".song-total-time");
const playPause = document.querySelector(".play-pause");
const playingBtn = document.querySelector(".playing");
const pausedBtn = document.querySelector(".paused");
const musicPlayer = document.querySelector(".music-player");
const likeSong = document.querySelector(".fav");
const threeDotSvg = document.querySelector(".threedot_svg");
const songTime = document.querySelector(".song-time");
const previousBtnSvg = document.querySelector(".previous-btn-svg");
const repeatBtnSvg = document.querySelector(".repeat-btn-svg");
const nextBtnSvg = document.querySelector(".next-btn-svg");
const shuffleBtnSvg = document.querySelector(".shuffle-btn-svg");
const volumeBtnSvg = document.querySelector(".volume-btn-svg");
const volume = document.querySelector(".volume");
const volumeSlider = document.querySelector(".volume-slider");
const queueBtnSvg = document.querySelector(".queue-btn-svg");
const nextTrack = document.querySelector(".next-track");
const nextSongName = document.querySelector(".next-song-name");
const footer = document.querySelector(".footer");
const quickLinksHeading = document.querySelector(".quick-links-heading");
const linksHeading = document.querySelectorAll(".text-grey-300");
const listStyle = document.querySelectorAll(".list-style");
const rightsReserved = document.querySelector(".rights-reserved");
const rightsReservedPara = rightsReserved.querySelector("p");
const previousSong = document.querySelector(".previous-song");
const nextSong = document.querySelector(".next-song");
const songProgress = document.getElementById("song-progress");
const progressBar = document.querySelector(".progress-bar");
const repeatBtn = document.querySelector(".repeat");
const repeatBlack = document.querySelector(".repeat_black");
const repeatGreen = document.querySelector(".repeat_green");
const shuffle = document.querySelector(".shuffle");
const navbar = document.querySelector(".navbar");

// Carousel code Starts
document.addEventListener("DOMContentLoaded", function () {
  let currentIndex = 0;

  function updateCarousel() {
    carousel.style.transition = "transform 0.5s ease-in-out";
    carousel.style.transform = `translateX(${-currentIndex * 33.33}%)`;
  }

  function transitionEnd() {
    if (currentIndex === 0) {
      carousel.style.transition = "none";
      carousel.style.transform = `translateX(${
        (-carousel.children.length / 3) * 33.33
      }%)`;
      currentIndex = carousel.children.length / 3;
    } else if (currentIndex === carousel.children.length - 1) {
      carousel.style.transition = "none";
      carousel.style.transform = `translateX(${-33.33}%)`;
      currentIndex = 0;
    }
  }

  carousel.addEventListener("transitionend", transitionEnd);

  setInterval(nextSlide, 3000);

  // Initial setup
  carousel.style.transition = "none";
  carousel.style.transform = `translateX(${-currentIndex * 33.33}%)`;

  function prevSlide() {
    if (currentIndex <= 0) return;
    currentIndex = (currentIndex - 1 / 1) % carousel.children.length;
    updateCarousel();
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % carousel.children.length;
    updateCarousel();
  }

  prevBtn.addEventListener("click", prevSlide);
  nextBtn.addEventListener("click", nextSlide);
});
// Carousel code Ends

// Booting app when page loads
window.addEventListener("load", bootUpApp);

function bootUpApp() {
  fetchAndRenderAllSections();
}

function fetchAndRenderAllSections() {
  // fetch all sections data
  fetch("gaana.json")
    .then((res) => res.json())
    .then((res) => {
      // console.log(res);
      const { cardbox } = res;
      if (Array.isArray(cardbox) && cardbox.length) {
        cardbox.forEach((section) => {
          const { songsbox, songscards } = section;
          renderSongs(songscards);
          renderSection(songsbox, songscards);
        });
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

function renderSection(title, songsList) {
  makeSectionDOM(title, songsList);
}

function makeSectionDOM(title, songsList) {
  const sectionDiv = document.createElement("div");
  sectionDiv.classList.add("songs-section");
  sectionDiv.innerHTML = `
          <div class="section-heading">
            <h1 class="section-title">${title}</h1>
            <h3 class="section-expand">See All</h3>
          </div>
          <div class="songs-container">
          ${songsList.map((songObj) => buildSongsCardDOM(songObj)).join("")}
            <div class="nav-buttons">
              <button class="nav-prevBtn">&lt;</button>
              <button class="nav-nextBtn">&gt;</button>
            </div>
          </div>
          `;
  musicLibrary.appendChild(sectionDiv);
}

function buildSongsCardDOM(songObj) {
  return ` 
              <div class="song-card" onclick="playSong(this)" data-songobj='${JSON.stringify(
                songObj
              )}'>
                <div class="img-container">
                    <img
                      src="${songObj.image_source}"
                      alt="${songObj.song_name}"
                    />
                  <div class="overlay"></div>
                </div>
                <p>${songObj.song_name}</p>
              </div>
            `;
}

// -----------------Music player functions ---------------

// progress bar function
audioPlayer.addEventListener("timeupdate", updateProgressBar);

function updateProgressBar() {
  const percentage = (audioPlayer.currentTime / audioPlayer.duration) * 100;
  songProgress.style.width = `${percentage}%`;
}

progressBar.addEventListener("click", handleProgressBarClick);

function handleProgressBarClick(event) {
  const { duration } = audioPlayer;
  const moveProgress =
    (event.offsetX / event.srcElement.clientWidth) * duration;
  audioPlayer.currentTime = moveProgress;
}

// -----------------------------

function playSong(songObjInStr) {
  const songObj = JSON.parse(songObjInStr.dataset.songobj);
  setAndPlayCurrentSong(songObj);
  musicPlayer.style.display = "flex";
}

function updatePlayerUi(songObj) {
  songCover.src = songObj.image_source;
  songName.innerHTML = songObj.song_name;
  albumName.innerHTML = songObj.album_name;

  songCurrentDuration.innerHTML = Math.floor(audioPlayer.currentTime);
  songTotalDuration.innerHTML = Math.floor(audioPlayer.duration);
}

function togglePlayer() {
  if (audioPlayer.paused || audioPlayer.ended) {
    audioPlayer.play();
    updatePlayPauseImage(true);
  } else audioPlayer.pause();
  updatePlayPauseImage(false);
  updatePlayPauseImage();
}

function updatePlayPauseImage() {
  if (!audioPlayer.paused && !audioPlayer.ended) {
    playingBtn.style.display = "block";
    pausedBtn.style.display = "none";
  } else {
    playingBtn.style.display = "none";
    pausedBtn.style.display = "block";
  }
}

function setAndPlayCurrentSong(songObj) {
  currentSongObj = songObj;
  audioPlayer.pause();
  audioPlayer.src = songObj.quality.low;
  audioPlayer.currentTime = 0;
  audioPlayer.play();
  updatePlayerUi(songObj);
  updatePlayPauseImage();
  updatePlayerTime();
}

function handleSongEnd() {
  audioPlayer.currentTime = 0;
  audioPlayer.play();
  // audioPlayer.pause();
  // audioPlayer.currentTime = 0;
  // updatePlayPauseImage();
}
audioPlayer.addEventListener("loadedmetadata", updatePlayerTime);
function updatePlayerTime() {
  audioPlayer.addEventListener("timeupdate", updatePlayerTime);

  // if (!audioPlayer || isNaN(audioPlayer.paused)) return;
  // const currentTime = audioPlayer.currentTime;
  // const formattedTime = formatTime(currentTime);
  // const totalDuration = audioPlayer.duration;
  // const formattedTotalTime = formatTime(totalDuration);
  // songCurrentDuration.innerHTML = formattedTime;
  // songTotalDuration.innerHTML = formattedTotalTime;

  if (!audioPlayer) return; // Check if audioPlayer is available
  const currentTime = audioPlayer.currentTime;
  const formattedTime = formatTime(currentTime);
  let totalDuration = 0;
  let formattedTotalTime = "00:00";
  // Check if duration is a valid number
  if (!isNaN(audioPlayer.duration) && isFinite(audioPlayer.duration)) {
    totalDuration = audioPlayer.duration;
    formattedTotalTime = formatTime(totalDuration);
  }
  songCurrentDuration.innerHTML = formattedTime;
  songTotalDuration.innerHTML = formattedTotalTime;
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedSeconds =
    remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

  return `${formattedMinutes}:${formattedSeconds}`;
}

// Toggle theme function
let darkTheme = true;
modes.addEventListener("click", toggleTheme);
function toggleTheme() {
  darkTheme = !darkTheme;
  if (!darkTheme) {
    //This happens when the light mode is on
    header.style.backgroundColor = "#F4F4F5";
    loginSignup.style.color = "#000";
    hamSvgColor.style.fill = "#000";
    inputBox.style.backgroundColor = "#FEFEFF";
    let input = inputBox.querySelector("input");
    input.style.color = "#000";
    languageSvg.style.fill = "#fff";
    languageSvg2.style.fill = "#fff";
    lightMode.style.display = "block";
    darkMode.style.display = "none";
    lightMode.style.fill = "#000";

    nav.style.backgroundColor = "#FEFEFF";
    const navbarA = [];
    const navbarAnchor = navbar.querySelectorAll("ul>a");
    navbarA.push(...navbarAnchor);
    navbarA.forEach((a) => {
      a.style.color = "#000";
    });

    main.style.backgroundColor = "#FEFEFF";
    main.style.color = "#000";

    musicPlayer.style.backgroundColor = "#FEFEFF";
    musicPlayer.style.color = "#000";
    likeSong.style.fill = "#000";
    threeDotSvg.style.fill = "#000";
    songTime.style.border = "1px solid #000";
    previousBtnSvg.style.fill = "#000";
    repeatBtnSvg.style.fill = "#000";
    nextBtnSvg.style.fill = "#000";
    shuffleBtnSvg.style.fill = "#000";
    volumeBtnSvg.style.fill = "#000";
    // songQuality.style.color = "#000";
    queueBtnSvg.style.fill = "#000";
    nextTrack.style.color = "#3d3d3d";
    nextSongName.style.color = "#000";

    footer.style.backgroundColor = "#f2f0f0";
    footer.style.color = "#000";
    quickLinksHeading.style.color = "#000";
    linksHeading.forEach((element) => {
      element.style.color = "#050505";
    });
    const allListItems = [];
    listStyle.forEach((div) => {
      const liElements = div.querySelectorAll("ul>li");
      allListItems.push(...liElements);
    });
    allListItems.forEach((li) => {
      li.style.color = "#000000cc";
    });
    rightsReservedPara.style.color = "#000000cc";
  } else {
    // this happens when the dark mode is on
    header.style.backgroundColor = "#222529";
    loginSignup.style.color = "#fff";
    hamSvgColor.style.fill = "#fff";
    inputBox.style.backgroundColor = "#1a1b1a";
    let input = inputBox.querySelector("input");
    input.style.color = "";
    languageSvg.style.fill = "#000";
    languageSvg2.style.fill = "#000";
    lightMode.style.display = "none";
    darkMode.style.display = "block";
    lightMode.style.fill = "#000";

    nav.style.backgroundColor = "";
    const navbarA = [];
    const navbarAnchor = navbar.querySelectorAll("ul>a");
    navbarA.push(...navbarAnchor);
    navbarA.forEach((a) => {
      a.style.color = "";
    });

    main.style.backgroundColor = "#1B1A1A";
    main.style.color = "#E8E9E8";

    musicPlayer.style.backgroundColor = "";
    musicPlayer.style.color = "";
    likeSong.style.fill = "";
    threeDotSvg.style.fill = "";
    songTime.style.border = "";
    previousBtnSvg.style.fill = "";
    repeatBtnSvg.style.fill = "";
    nextBtnSvg.style.fill = "";
    shuffleBtnSvg.style.fill = "";
    volumeBtnSvg.style.fill = "";
    volumeBtnSvg.style.border = "";
    // songQuality.style.color = "";
    queueBtnSvg.style.fill = "";
    nextTrack.style.color = "";
    nextSongName.style.color = "";

    footer.style.backgroundColor = "";
    footer.style.color = "";
    quickLinksHeading.style.color = "";
    linksHeading.forEach((element) => {
      element.style.color = "";
    });
    const allListItems = [];
    listStyle.forEach((div) => {
      const liElements = div.querySelectorAll("ul>li");
      allListItems.push(...liElements);
    });
    allListItems.forEach((li) => {
      li.style.color = "";
    });
    rightsReservedPara.style.color = "";
  }
}
// Making queue of songs
function renderSongs(songs) {
  songs.map((song) => {
    addToQueue(song);
  });
}

// Initializing the song queue
const songQueue = [];
let currentSongIndex = 0;

// Function to add a song to the queue
function addToQueue(song) {
  songQueue.push(song);

  // Checking if the queue was empty, start playing the song if it's the only one
  if (songQueue.length === 1) {
    playSongFromQueue();
  }
}

// Function to play the next song in the queue
function playNextSong() {
  // console.log("playing next song");
  currentSongIndex++;

  // Check if there are more songs in the queue
  if (currentSongIndex < songQueue.length) {
    playSongFromQueue();
  } else {
    currentSongIndex = 0;
    playSongFromQueue();
    // The queue is empty, you might want to handle this case (e.g., stop playback)
    console.log("Queue is empty");
  }
}
function playPerviousSong() {
  currentSongIndex--;
  if (currentSongIndex < songQueue.length) {
    playSongFromQueue();
  } else {
    console.log("Queue is empty");
  }
}

// Function to play the current song in the queue
function playSongFromQueue() {
  const currentSong = songQueue[currentSongIndex];
  // Play the song using setAndPlayCurrentSong function
  setAndPlayCurrentSong(currentSong);
  // For example, set the audio source, play, update UI, etc.
  // console.log(`Playing: ${currentSong.song_name}`);
  // addToQueue(currentSong);
}

// Simulate playing next song after some time (e.g., when the current song ends)
setTimeout(() => {
  playNextSong();
}, 1000); // Simulating a delay of 1 seconds

// function for repeat the song
audioPlayer.addEventListener("ended", updateRepeatButton);
let isRepeatEnabled = false;
function toggleRepeat() {
  isRepeatEnabled = !isRepeatEnabled;
  console.log("Repeat button is enabled");
  updateRepeatButton();
}
function updateRepeatButton() {
  if (isRepeatEnabled) {
    repeatBtn.classList.add("active");
    repeatBlack.style.display = "none";
    repeatGreen.style.display = "block";
    audioPlayer.currentTime = 0;
    audioPlayer.play();
  } else {
    playNextSong();
    repeatBtn.classList.remove("active");
    repeatBlack.style.display = "block";
    repeatGreen.style.display = "none";
  }
}
repeatBtn.addEventListener("click", toggleRepeat);

// function for shuffle songs

function shuffleQueue() {
  for (let i = songQueue.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [songQueue[i], songQueue[j]] = [songQueue[j], songQueue[i]];
  }
}

shuffle.addEventListener("click", handleShuffleSongs);

isShuffleEnabled = false;

function handleShuffleSongs() {
  isShuffleEnabled = !isShuffleEnabled;
  if (!isShuffleEnabled) {
    console.log("shuffle in off");
    shuffle.style.fill = "";
    // currentSongIndex = 0;
    playSongFromQueue(currentSongIndex);
  } else {
    console.log("shuffle is on");
    shuffle.style.fill = "red";
    playShuffledSongs();
  }
}

function playShuffledSongs() {
  shuffleQueue();
  playSongFromQueue();
}

// function for the volume button

volumeSlider.addEventListener("input", function () {
  const volume = volumeSlider.value / 100;
  audioPlayer.volume = volume;
});

const quickLinksDiv = document.querySelector(".quick-links");
const plusSvgs = document.querySelectorAll(".plus-svg");
const minusSvgs = document.querySelectorAll(".minus-svg");
plusSvgs.forEach((svg) => {
  svg.addEventListener("click", function () {
    // svg.style.display = "none";
    // minusSvgs.forEach((svg) => {
    //   svg.style.display = "block";
    // });
    // console.log("clicked");
    const parent = this.closest(".list-style");
    // Find the 'ul' element inside the parent
    const ul = parent.querySelector("ul");
    // Toggle the display of the ul element
    if (ul.style.display === "none" || ul.style.display === "") {
      ul.style.display = "block";
      // minusSvgs.forEach((svg) => {
      //   svg.style.display = "block";
      // });
    } else {
      ul.style.display = "none";
      // minusSvgs.forEach((svg) => {
      //   svg.style.display = "none";
      // });
    }
  });
});

// Write media queries for music player✅
// Upload on github and github pages✅
// Make that plus button work in quick links✅
// Then write media queries for other devices too
