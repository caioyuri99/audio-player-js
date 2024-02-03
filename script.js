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

const trackList = [];
let currentTrack = 0;
const previousStack = [];
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

document.getElementById("track").addEventListener("ended", nextTrack);
