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
    const objectURL = URL.createObjectURL(trackFile);
    audio.src = objectURL;

    loadTags(trackFile);
}

function pictureToURL(picture) {
    const bytes = new Uint8Array(picture.data);
    const blob = new Blob([bytes], { type: picture.format });

    return URL.createObjectURL(blob);
}

function playPause() {
    if (audio.paused) {
        audioPlay();

        return;
    }

    audioPause();
}

function nextTrack() {
    previousStack.push(currentTrack);

    currentTrack++;

    if (currentTrack >= trackList.length) {
        currentTrack = 0;
    }

    loadTrack(trackList[currentTrack]);

    const previousBtn = document.getElementById("previous-track");
    previousBtn.disabled = false;

    audioPlay();
}

function previousTrack() {
    currentTrack = previousStack.pop();

    if (previousStack.length === 0) {
        const previousBtn = document.getElementById("previous-track");
        previousBtn.disabled = true;
    }

    loadTrack(trackList[currentTrack]);

    audioPlay();
}

function updateProgressBar(event) {
    const totalWidth = progressBar.offsetWidth;
    const newOffsetX = event.clientX - progressBar.getBoundingClientRect().left;
    let percentage = Math.max(
        0,
        Math.min(100, (newOffsetX / totalWidth) * 100)
    );

    progressBarBg.style.width = `${percentage}%`;
    audio.currentTime = (percentage / 100) * audio.duration;
}

function audioPlay() {
    audio.play();

    const playPauseBtn = document.getElementById("play-pause");

    playPauseBtn.classList.remove("bi-play-circle-fill");
    playPauseBtn.classList.add("bi-pause-circle-fill");
}

function audioPause() {
    audio.pause();

    const playPauseBtn = document.getElementById("play-pause");

    playPauseBtn.classList.remove("bi-pause-circle-fill");
    playPauseBtn.classList.add("bi-play-circle-fill");
}

const trackList = [];
let currentTrack = 0;
const previousStack = [];
const progressBar = document.getElementById("progress-bar");
const progressBarBg = document.getElementById("progress-bar-bg");
const audio = document.getElementById("track");

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
    const progressBarBg = document.getElementById("progress-bar-bg");

    const progress = (audio.currentTime / audio.duration) * 100;
    progressBarBg.style.width = `${progress}%`;
});

progressBar.addEventListener("mousedown", event => {
    if (audio.src === "") return;

    audioPause();
    updateProgressBar(event);

    document.addEventListener("mousemove", updateProgressBar);

    const mouseUpListener = () => {
        document.removeEventListener("mousemove", updateProgressBar);
        document.removeEventListener("mouseup", mouseUpListener);

        audioPlay();
    };

    document.addEventListener("mouseup", mouseUpListener);
});
