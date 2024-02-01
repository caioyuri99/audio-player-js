const jsmediatags = window.jsmediatags;

function loadTags(file) {
    jsmediatags.read(file, {
        onSuccess: function (tag) {
            const elemCover = document.getElementById("track-cover");
            const elemTitle = document.getElementById("track-title");
            const elemArtist = document.getElementById("track-artist");
            const elemAlbum = document.getElementById("track-album");

            const tags = tag.tags;

            elemCover.src = tags.picture
                ? pictureToURL(tags.picture)
                : "assets/default-cover.png";
            elemTitle.innerText = tags.title ?? file.name;
            elemArtist.innerText = tags.artist ?? "Unknown Artist";
            elemAlbum.innerText = tags.album ?? "Unknown Album";
        },
        onError: function (error) {
            console.error(error);
        }
    });
}

function loadTrack(trackFile) {
    const elemTrack = document.getElementById("track");

    const objectURL = URL.createObjectURL(trackFile);
    elemTrack.src = objectURL;

    loadTags(trackFile);
}

function pictureToURL(picture) {
    const bytes = new Uint8Array(picture.data);
    const blob = new Blob([bytes], { type: picture.format });

    return URL.createObjectURL(blob);
}

function playPause() {
    const audio = document.getElementById("track");
    const playPauseBtn = document.getElementById("play-pause");

    if (audio.paused) {
        audio.play();

        playPauseBtn.classList.toggle("bi-play-circle-fill");
        playPauseBtn.classList.toggle("bi-pause-circle-fill");

        return;
    }

    audio.pause();

    playPauseBtn.classList.toggle("bi-pause-circle-fill");
    playPauseBtn.classList.toggle("bi-play-circle-fill");
}

function nextTrack() {
    const audio = document.getElementById("track");

    previousStack.push(currentTrack);

    currentTrack++;

    if (currentTrack >= trackList.length) {
        currentTrack = 0;
    }

    loadTrack(trackList[currentTrack]);

    const previousBtn = document.getElementById("previous-track");
    previousBtn.disabled = false;

    audio.play();

    const playPauseBtn = document.getElementById("play-pause");
    playPauseBtn.classList.remove("bi-play-circle-fill");
    playPauseBtn.classList.add("bi-pause-circle-fill");
}

function previousTrack() {
    const audio = document.getElementById("track");

    currentTrack = previousStack.pop();

    if (previousStack.length === 0) {
        const previousBtn = document.getElementById("previous-track");
        previousBtn.disabled = true;
    }

    loadTrack(trackList[currentTrack]);

    audio.play();

    const playPauseBtn = document.getElementById("play-pause");
    playPauseBtn.classList.remove("bi-play-circle-fill");
    playPauseBtn.classList.add("bi-pause-circle-fill");
}

const trackList = [];
let currentTrack = 0;
const previousStack = [];

document.getElementById("tracks").addEventListener(
    "change",
    e => {
        trackList.push(...e.target.files);

        loadTrack(trackList[0]);

        const playPauseBtn = document.getElementById("play-pause");
        const nextBtn = document.getElementById("next-track");

        playPauseBtn.disabled = false;
        nextBtn.disabled = false;

        playPause();
    },
    false
);

document.getElementById("track-files").addEventListener("click", () => {
    document.getElementById("tracks").click();
});

document.getElementById("play-pause").addEventListener("click", playPause);
document.getElementById("next-track").addEventListener("click", nextTrack);
document
    .getElementById("previous-track")
    .addEventListener("click", previousTrack);

document.getElementById("track").addEventListener("ended", nextTrack);

document.getElementById("track").addEventListener("timeupdate", () => {
    const audio = document.getElementById("track");
    const progressBarBg = document.getElementById("progress-bar-bg");

    const progress = (audio.currentTime / audio.duration) * 100;
    progressBarBg.style.width = `${progress}%`;
});

document.getElementById("progress-bar").addEventListener("click", e => {
    const audio = document.getElementById("track");

    if (audio.src === "") return;

    const progressBar = document.getElementById("progress-bar");

    const rect = progressBar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const progress = (x / width) * 100;

    audio.currentTime = (progress / 100) * audio.duration;
});
