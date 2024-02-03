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
    if (audio.currentTime >= 3 || previousStack.length === 0) {
        audio.currentTime = 0;

        return;
    }

    currentTrack = previousStack.pop();

    loadTrack(trackList[currentTrack]);

    audioPlay();
}

document.getElementById("play-pause").addEventListener("click", playPause);
document.getElementById("next-track").addEventListener("click", nextTrack);
document
    .getElementById("previous-track")
    .addEventListener("click", previousTrack);
