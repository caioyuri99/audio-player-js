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
                const fontColor = isDark(color) ? "#e7e7e7" : "#000007";

                const primaryColor = `rgb(${color.join(",")})`;
                const secondaryColor = `rgb(${calcSecondGradientColor(
                    color
                ).join(",")})`;

                document.documentElement.style.setProperty(
                    "--font-color",
                    fontColor
                );
                document.documentElement.style.setProperty(
                    "--primary-color",
                    primaryColor
                );
                document.documentElement.style.setProperty(
                    "--secondary-color",
                    secondaryColor
                );
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

const dragAndDropMask = document.getElementById("drag-and-drop-mask");

document.addEventListener("dragenter", e => {
    e.preventDefault();
    dragAndDropMask.style.display = "block";
});

dragAndDropMask.addEventListener("dragover", e => {
    e.preventDefault();

    const dragAndDropFeedback = document.getElementById(
        "drag-and-drop-feedback"
    );

    dragAndDropFeedback.style.display = "flex";

    if (dragAndDropFeedback.style.display !== "flex") {
        dragAndDropFeedback.style.display = "flex";
    }

    e.dataTransfer.dropEffect = "copy";
});

dragAndDropMask.addEventListener("dragleave", e => {
    const dragAndDropFeedback = document.getElementById(
        "drag-and-drop-feedback"
    );

    dragAndDropFeedback.style.display = "none";
});

dragAndDropMask.addEventListener("drop", e => {
    const dragAndDropMask = document.getElementById("drag-and-drop-mask");
    const dragAndDropFeedback = document.getElementById(
        "drag-and-drop-feedback"
    );

    dragAndDropMask.style.display = "none";
    dragAndDropFeedback.style.display = "none";

    e.preventDefault();
    initPlayer(e.dataTransfer.files);
});

document
    .getElementById("tracks")
    .addEventListener("change", e => initPlayer(e.target.files));

document.getElementById("track-files").addEventListener("click", () => {
    document.getElementById("tracks").click();
});

document.getElementById("track").addEventListener("ended", nextTrack);
