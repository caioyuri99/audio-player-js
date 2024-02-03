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

document.getElementById("play-pause").addEventListener("click", playPause);
document.getElementById("next-track").addEventListener("click", nextTrack);
document
    .getElementById("previous-track")
    .addEventListener("click", previousTrack);
