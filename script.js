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
                rgbColor = `rgb(${color.join(",")})`;
                secondColor = `rgb(${calcSecondGradientColor(color).join(
                    ","
                )})`;

                document.body.style.background = `linear-gradient(${rgbColor}, ${secondColor})`;
                document.body.style.backgroundRepeat = "no-repeat";

                fontColor = isDark(color) ? "#e7e7e7" : "#000007";

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

                trackFiles.style.backgroundColor = fontColor;
                trackFiles.style.color = rgbColor;
            };
        },
        onError: error => {
            console.error(error);
        }
    });
}

const trackList = [];
let currentTrack = 0;
const previousStack = [];
const progressBarBg = document.getElementById("progress-bar-bg");
const audio = document.getElementById("track");
let isPlaying = false;
let fontColor = "#e7e7e7";
let rgbColor = "rgb(27, 26, 26)";
let secondColor = "rgb(105, 101, 101)";
const trackFiles = document.getElementById("track-files");

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

document.getElementById("track").addEventListener("ended", nextTrack);

trackFiles.addEventListener("mouseover", () => {
    trackFiles.style.backgroundColor = secondColor;
    trackFiles.style.color = fontColor;
});

trackFiles.addEventListener("mouseout", () => {
    trackFiles.style.backgroundColor = fontColor;
    trackFiles.style.color = rgbColor;
});
