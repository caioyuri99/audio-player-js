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

function initPlayer(files) {
    trackList.push(...files);

    loadTrack(trackList[0]);

    const playPauseBtn = document.getElementById("play-pause");
    const nextBtn = document.getElementById("next-track");
    const previousBtn = document.getElementById("previous-track");

    playPauseBtn.disabled = false;
    nextBtn.disabled = false;
    previousBtn.disabled = false;

    playPause();
}
