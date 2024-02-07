function updateDraggableBar(event, draggableBar, draggableBarBg, barType) {
    const totalWidth = draggableBar.offsetWidth;
    const newOffsetX =
        event.clientX - draggableBar.getBoundingClientRect().left;
    let percentage = Math.max(
        0,
        Math.min(100, (newOffsetX / totalWidth) * 100)
    );

    draggableBarBg.style.width = `${percentage}%`;

    switch (barType) {
        case "track":
            audio.currentTime = (percentage / 100) * audio.duration;

            return;

        case "volume":
            audio.volume = (percentage / 100).toFixed(2);

            if (audio.volume == 0) {
                mute();

                return;
            }

            unmute();
    }
}

function draggableBarHandler(event, draggableBar, draggableBarBg, barType) {
    if (audio.src === "" && barType === "track") return;

    if (barType === "track") audio.pause();

    updateDraggableBar(event, draggableBar, draggableBarBg, barType);

    const mousemoveListener = e =>
        updateDraggableBar(e, draggableBar, draggableBarBg, barType);

    document.addEventListener("mousemove", mousemoveListener);

    const mouseUpListener = () => {
        document.removeEventListener("mousemove", mousemoveListener);
        document.removeEventListener("mouseup", mouseUpListener);

        if (isPlaying && barType === "track") {
            audio.play();
        }
    };

    document.addEventListener("mouseup", mouseUpListener);
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
const progressBarBg = document.getElementById("progress-bar-bg");

progressBar.addEventListener("mousedown", event =>
    draggableBarHandler(event, progressBar, progressBarBg, "track")
);

const volumeBar = document.getElementById("volume-bar");
const volumeBarBg = document.getElementById("volume-bar-bg");

volumeBar.addEventListener("mousedown", event =>
    draggableBarHandler(event, volumeBar, volumeBarBg, "volume")
);

document.getElementById("volume-control").addEventListener("wheel", event => {
    event.preventDefault();

    if (audio.muted) audio.volume = 0;

    audio.volume = Math.max(
        0,
        Math.min((audio.volume - event.deltaY / 1000).toFixed(2), 1)
    );
    volumeBarBg.style.width = `${audio.volume * 100}%`;

    if (audio.volume == 0) {
        mute();

        return;
    }

    unmute();
});
