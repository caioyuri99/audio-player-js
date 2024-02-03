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

document.getElementById("track").addEventListener("timeupdate", () => {
    const progressBarBg = document.getElementById("progress-bar-bg");

    const progress = (audio.currentTime / audio.duration) * 100;
    progressBarBg.style.width = `${progress}%`;

    const currentTime = document.getElementById("current-time");
    currentTime.innerText = formatTime(audio.currentTime);

    const duration = document.getElementById("duration");
    duration.innerText = formatTime(audio.duration);
});

const progressBar = document.getElementById("progress-bar");

progressBar.addEventListener("mousedown", event => {
    if (audio.src === "") return;

    audio.pause();
    updateProgressBar(event);

    document.addEventListener("mousemove", updateProgressBar);

    const mouseUpListener = () => {
        document.removeEventListener("mousemove", updateProgressBar);
        document.removeEventListener("mouseup", mouseUpListener);

        if (isPlaying) {
            audio.play();
        }
    };

    document.addEventListener("mouseup", mouseUpListener);
});
