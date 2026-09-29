/* =========================================================
   SEITE 2 – HORIZONTALES SCROLLEN DER KACHELN

   Die vier Kacheln liegen nebeneinander
   und werden per Mausrad (vertikal
   umgesetzt), Trackpad-Geste, Touch-Wisch
   oder den Pfeil-Buttons durchblättert.
   Nur an den Rändern der Kachel-Reihe
   übernimmt die normale Seiten-Navigation.
   ========================================================= */

const andereGrid =
    document.querySelector(".andere-grid");

makeDraggable(andereGrid);


if (andereGrid) {

    andereGrid.addEventListener(
        "wheel",
        (event) => {

            /*
                Ein Element mit eigenem
                vertikalem Scrollraum
                (z. B. die offene Termine-Liste)
                hat Vorrang.
            */

            const verticalScrollable =
                findScrollableAncestor(event.target);

            if (verticalScrollable) {

                const atTop =
                    verticalScrollable.scrollTop <= 0;

                const atBottom =
                    Math.ceil(
                        verticalScrollable.scrollTop +
                        verticalScrollable.clientHeight
                    ) >= verticalScrollable.scrollHeight;

                const scrollingDown =
                    event.deltaY > 0;

                if (
                    (scrollingDown && !atBottom) ||
                    (!scrollingDown && !atTop)
                ) {
                    return;
                }

            }


            /*
                Horizontales Scrollen der Reihe.
                Trackpad-Geste (deltaX) hat Vorrang,
                sonst wird das vertikale Mausrad
                in horizontales Scrollen übersetzt.
            */

            const delta =
                (event.deltaX !== 0 ?
                    event.deltaX :
                    event.deltaY) *
                H_SCROLL_SENSITIVITY;

            const maxScrollLeft =
                andereGrid.scrollWidth -
                andereGrid.clientWidth;

            if (maxScrollLeft <= 0) {
                return;
            }

            const atStart =
                andereGrid.scrollLeft <= 0;

            const atEnd =
                andereGrid.scrollLeft >=
                maxScrollLeft - 1;

            const scrollingForward =
                delta > 0;


            /*
                Am Rand der Kachel-Reihe:
                weiterreichen an die
                Seiten-Navigation.
            */

            if (
                (scrollingForward && atEnd) ||
                (!scrollingForward && atStart)
            ) {
                return;
            }

            event.preventDefault();

            event.stopPropagation();

            andereGrid.scrollLeft += delta;

        },
        { passive: false }
    );

}


document.querySelectorAll(".andere-nav-btn").forEach((button) => {

    button.addEventListener("click", () => {

        if (!andereGrid) {
            return;
        }

        const dir =
            Number(button.getAttribute("data-dir"));

        const tile =
            andereGrid.querySelector(".andere-tile");

        const step =
            tile ?
                tile.getBoundingClientRect().width + 18 :
                andereGrid.clientWidth * 0.8;

        andereGrid.scrollBy({
            left: dir * step,
            behavior: "smooth"
        });

    });

});


/* =========================================================
   SEITE 4 – HORIZONTALES SCROLLEN DER YOUTUBE-REIHE

   Gleiches Prinzip wie bei den Kacheln
   auf Seite 2: Mausrad (vertikal
   umgesetzt), Trackpad-Geste, Touch-Wisch
   oder die Pfeil-Buttons blättern die
   Videos durch. Erst an den Rändern der
   Reihe übernimmt die Seiten-Navigation.
   ========================================================= */

const youtubeGrid =
    document.querySelector(".youtube-grid");

makeDraggable(youtubeGrid);


if (youtubeGrid) {

    youtubeGrid.addEventListener(
        "wheel",
        (event) => {

            const delta =
                (event.deltaX !== 0 ?
                    event.deltaX :
                    event.deltaY) *
                H_SCROLL_SENSITIVITY;

            const maxScrollLeft =
                youtubeGrid.scrollWidth -
                youtubeGrid.clientWidth;

            if (maxScrollLeft <= 0) {
                return;
            }

            const atStart =
                youtubeGrid.scrollLeft <= 0;

            const atEnd =
                youtubeGrid.scrollLeft >=
                maxScrollLeft - 1;

            const scrollingForward =
                delta > 0;


            /*
                Am Rand der Video-Reihe:
                weiterreichen an die
                Seiten-Navigation.
            */

            if (
                (scrollingForward && atEnd) ||
                (!scrollingForward && atStart)
            ) {
                return;
            }

            event.preventDefault();

            event.stopPropagation();

            youtubeGrid.scrollLeft += delta;

        },
        { passive: false }
    );

}


document.querySelectorAll(".youtube-nav-btn").forEach((button) => {

    button.addEventListener("click", () => {

        if (!youtubeGrid) {
            return;
        }

        const dir =
            Number(button.getAttribute("data-dir"));

        const card =
            youtubeGrid.querySelector(".youtube-card");

        const step =
            card ?
                card.getBoundingClientRect().width + 18 :
                youtubeGrid.clientWidth * 0.8;

        youtubeGrid.scrollBy({
            left: dir * step,
            behavior: "smooth"
        });

    });

});


/* =========================================================
   SEITE 6 – HORIZONTALES SCROLLEN DER PLATTFORM-KACHELN
   ========================================================= */

const platformsGrid =
    document.querySelector(".platforms-grid");

makeDraggable(platformsGrid);

if (platformsGrid) {

    platformsGrid.addEventListener(
        "wheel",
        (event) => {

            const delta =
                (event.deltaX !== 0 ?
                    event.deltaX :
                    event.deltaY) *
                H_SCROLL_SENSITIVITY;

            const maxScrollLeft =
                platformsGrid.scrollWidth -
                platformsGrid.clientWidth;

            if (maxScrollLeft <= 0) {
                return;
            }

            const atStart =
                platformsGrid.scrollLeft <= 0;

            const atEnd =
                platformsGrid.scrollLeft >=
                maxScrollLeft - 1;

            const scrollingForward =
                delta > 0;

            if (
                (scrollingForward && atEnd) ||
                (!scrollingForward && atStart)
            ) {
                return;
            }

            event.preventDefault();
            event.stopPropagation();

            platformsGrid.scrollLeft += delta;

        },
        { passive: false }
    );

}


document.querySelectorAll(".platforms-nav-btn").forEach((button) => {

    button.addEventListener("click", () => {

        if (!platformsGrid) {
            return;
        }

        const dir =
            Number(button.getAttribute("data-dir"));

        const tile =
            platformsGrid.querySelector(".platform-tile");

        const step =
            tile ?
                tile.getBoundingClientRect().width + 18 :
                platformsGrid.clientWidth * 0.8;

        platformsGrid.scrollBy({
            left: dir * step,
            behavior: "smooth"
        });

    });

});
