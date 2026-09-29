/* =========================================================
   VIDEO-MODAL (INLINE-WIEDERGABE)

   Beim Klick auf eine YouTube-Karte wird
   das Video direkt in einem Overlay
   abgespielt, statt zu YouTube zu
   verlinken.
   ========================================================= */

let videoModalOpen = false;

const videoModal =
    document.getElementById("video-modal");

const videoModalIframe =
    document.getElementById("video-modal-iframe");


function openVideoModal(embedSrc) {

    if (!videoModal || !videoModalIframe) {
        return;
    }

    const separator =
        embedSrc.indexOf("?") === -1 ? "?" : "&";

    videoModalIframe.src =
        embedSrc + separator + "autoplay=1&rel=0";

    videoModal.classList.add("open");

    videoModal.setAttribute("aria-hidden", "false");

    videoModalOpen = true;

}


function closeVideoModal() {

    if (!videoModal || !videoModalIframe) {
        return;
    }

    videoModal.classList.remove("open");

    videoModal.setAttribute("aria-hidden", "true");


    /*
        Iframe-Quelle leeren, damit das
        Video wirklich stoppt und nicht
        nur unsichtbar weiterläuft.
    */

    videoModalIframe.src = "";

    videoModalOpen = false;

}


document.querySelectorAll(".youtube-card").forEach((card) => {

    card.addEventListener("click", () => {

        const embedSrc =
            card.getAttribute("data-embed-src");

        if (embedSrc) {
            openVideoModal(embedSrc);
        }

    });


    card.addEventListener("keydown", (event) => {

        if (event.key === "Enter" || event.key === " ") {

            event.preventDefault();

            card.click();

        }

    });

});


if (videoModal) {

    videoModal
        .querySelectorAll("[data-close]")
        .forEach((el) => {

            el.addEventListener(
                "click",
                closeVideoModal
            );

        });

}
