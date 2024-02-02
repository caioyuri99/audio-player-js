const jsmediatags = window.jsmediatags;
const colorThief = new window.ColorThief();

function loadTags(file) {
    jsmediatags.read(file, {
        onSuccess: tag => {
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

            const coverImg = document.getElementById("track-cover");

            coverImg.onload = () => {
                const color = colorThief.getColor(coverImg);
                const rgbColor = `rgb(${color.join(",")})`;

                document.body.style.background = `linear-gradient(${rgbColor}, rgb(${calcSecondGradientColor(
                    color
                ).join(",")}))`;
                document.body.style.backgroundRepeat = "no-repeat";

                const fontColor = isDark(color) ? "#e7e7e7" : "#000007";

                document.body.style.color = fontColor;
                document.getElementById("previous-track").style.color =
                    fontColor;
                document.getElementById("next-track").style.color = fontColor;
                document.getElementById("play-pause").style.color = fontColor;
                document.getElementById(
                    "progress-bar-bg"
                ).style.backgroundColor = fontColor;
                document.getElementById("ball-position").style.borderColor =
                    fontColor;
                document.getElementById("inside-ball").style.backgroundColor =
                    fontColor;

                document.getElementById("progress-bar").style.backgroundColor =
                    rgbColor;
            };
        },
        onError: error => {
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
    isPlaying = true;

    const playPauseBtn = document.getElementById("play-pause");

    playPauseBtn.classList.remove("bi-play-circle-fill");
    playPauseBtn.classList.add("bi-pause-circle-fill");
}

function audioPause() {
    audio.pause();
    isPlaying = false;

    const playPauseBtn = document.getElementById("play-pause");

    playPauseBtn.classList.remove("bi-pause-circle-fill");
    playPauseBtn.classList.add("bi-play-circle-fill");
}

function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${isNaN(minutes) ? "0" : minutes}:${
        isNaN(seconds) ? "00" : String(seconds).padStart(2, "0")
    }`;
}

function calcSecondGradientColor(firstColor) {
    const hsl = rgbToHsl(firstColor[0], firstColor[1], firstColor[2]);

    hsl[2] = hsl[2] > 50 ? hsl[2] - 30 : hsl[2] + 30;

    return hslToRgb(hsl[0], hsl[1], hsl[2]);
}

function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    let h,
        s,
        l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;

        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }

        h /= 6;
    }

    return [h * 360, s * 100, l * 100];
}

function hslToRgb(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;

    let r, g, b;

    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;

            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;

            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;

        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function isDark(color) {
    const r = color[0] / 255;
    const g = color[1] / 255;
    const b = color[2] / 255;

    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    return brightness < 0.5;
}

const trackList = [];
let currentTrack = 0;
const previousStack = [];
const progressBar = document.getElementById("progress-bar");
const progressBarBg = document.getElementById("progress-bar-bg");
const audio = document.getElementById("track");
let isPlaying = false;

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

    const currentTime = document.getElementById("current-time");
    currentTime.innerText = formatTime(audio.currentTime);

    const duration = document.getElementById("duration");
    duration.innerText = formatTime(audio.duration);
});

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
