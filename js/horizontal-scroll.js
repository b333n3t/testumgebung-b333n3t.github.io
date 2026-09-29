/* =========================================================
   ECHTES HORIZONTALES SCROLLEN
   Kachel-/Videoreihen scrollen wieder nativ horizontal:
   - Touch / Trackpad direkt
   - Mausrad wird innerhalb der Reihe horizontal umgesetzt
   - Maus: klicken + ziehen
   - Pfeilbuttons scrollen um jeweils eine Kachel
   ========================================================= */

function makeDraggable(el) {
    if (!el) return;

    let isDown = false;
    let dragged = false;
    let startX = 0;
    let startScrollLeft = 0;

    function onPointerMove(event) {
        if (!isDown || event.pointerType !== "mouse") return;

        const dx = event.clientX - startX;
        if (Math.abs(dx) > 4) dragged = true;

        if (dragged) {
            event.preventDefault();
            el.scrollLeft = startScrollLeft - dx;
        }
    }

    function endDrag(event) {
        if (event && event.pointerType && event.pointerType !== "mouse") return;

        if (isDown && dragged) {
            const suppressClick = (clickEvent) => {
                clickEvent.preventDefault();
                clickEvent.stopPropagation();
                el.removeEventListener("click", suppressClick, true);
            };
            el.addEventListener("click", suppressClick, true);
        }

        isDown = false;
        dragged = false;
        el.classList.remove("dragging");

        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", endDrag);
        window.removeEventListener("pointercancel", endDrag);
    }

    el.addEventListener("pointerdown", (event) => {
        if (event.pointerType !== "mouse") return;

        isDown = true;
        dragged = false;
        startX = event.clientX;
        startScrollLeft = el.scrollLeft;
        el.classList.add("dragging");

        window.addEventListener("pointermove", onPointerMove);
        window.addEventListener("pointerup", endDrag);
        window.addEventListener("pointercancel", endDrag);
    });
}

function bindHorizontalStrip(grid, itemSelector, navSelector) {
    if (!grid) return;

    const nav = document.querySelector(navSelector);
    if (nav) nav.hidden = false;

    makeDraggable(grid);

    grid.addEventListener("wheel", (event) => {
        /* Eigenes vertikales Scrollen innerhalb einer Kachel hat Vorrang. */
        const inner = event.target.closest(
            ".termine-responsive, .andere-tile, .page-3-content"
        );

        if (inner && inner !== grid && inner.scrollHeight > inner.clientHeight) {
            const atTop = inner.scrollTop <= 0;
            const atBottom = Math.ceil(inner.scrollTop + inner.clientHeight) >= inner.scrollHeight;
            const down = event.deltaY > 0;

            if ((down && !atBottom) || (!down && !atTop)) {
                return;
            }
        }

        const maxScrollLeft = grid.scrollWidth - grid.clientWidth;
        if (maxScrollLeft <= 0) return;

        const delta = event.deltaX !== 0 ? event.deltaX : event.deltaY;
        const atStart = grid.scrollLeft <= 0;
        const atEnd = grid.scrollLeft >= maxScrollLeft - 1;
        const forward = delta > 0;

        /* Am Ende der Reihe darf die Hauptseiten-Navigation wieder übernehmen. */
        if ((forward && atEnd) || (!forward && atStart)) return;

        event.preventDefault();
        event.stopPropagation();
        grid.scrollLeft += delta * 2.6;
    }, { passive: false });

    if (nav) {
        nav.querySelectorAll("button").forEach((button) => {
            button.addEventListener("click", () => {
                const dir = Number(button.getAttribute("data-dir")) || 0;
                const item = grid.querySelector(itemSelector);
                const gap = parseFloat(getComputedStyle(grid).columnGap || getComputedStyle(grid).gap) || 18;
                const step = item
                    ? item.getBoundingClientRect().width + gap
                    : grid.clientWidth * 0.8;

                grid.scrollBy({
                    left: dir * step,
                    behavior: "smooth"
                });
            });
        });
    }
}

bindHorizontalStrip(
    document.querySelector(".andere-grid"),
    ".andere-tile",
    ".andere-nav"
);

bindHorizontalStrip(
    document.querySelector(".youtube-grid"),
    ".youtube-card",
    ".youtube-nav"
);

bindHorizontalStrip(
    document.querySelector(".platforms-grid"),
    ".platform-tile",
    ".platforms-nav"
);

/* Spotify bleibt direkt bedienbar; keine transparente Schutzschicht. */
const spotifyShield = document.querySelector(".spotify-shield");
if (spotifyShield) {
    spotifyShield.hidden = true;
    spotifyShield.style.pointerEvents = "none";
}
