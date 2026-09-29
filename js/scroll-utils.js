/* =========================================================
   INNERES SCROLLEN ERKENNEN

   Manche Kacheln (Termine, YouTube-Grid, ...)
   haben eigenen Inhalt zum Scrollen. Befindet
   sich der Mauszeiger über so einem Bereich
   und ist dort noch Scrollraum in die gewünschte
   Richtung vorhanden, soll normal gescrollt
   werden statt die Seite umzublättern.
   ========================================================= */

function findScrollableAncestor(element) {

    /*
        Performance-Fix: Statt bei jedem
        Wheel-Event den DOM-Baum manuell mit
        getComputedStyle() hochzulaufen (das
        erzwingt bei jedem Schritt ein Style-
        Recalc – "Forced Reflow"), nutzen wir
        das native, günstige closest() und
        prüfen nur an EINER Stelle die reinen
        Geometrie-Werte. Es gibt im Projekt nur
        zwei bewusst scrollbare Container.
    */

    const scrollable =
        element.closest(
            ".termine-responsive, .andere-tile, .page-3-content"
        );

    if (
        scrollable &&
        scrollable.scrollHeight > scrollable.clientHeight
    ) {
        return scrollable;
    }

    return null;

}


/* =========================================================
   KLICK-UND-ZIEHEN MIT DER NORMALEN MAUS
   Erlaubt horizontales Scrollen der
   Kacheln bzw. der YouTube-Reihe auch
   ganz ohne Mausrad/Trackpad – einfach
   klicken, halten und ziehen. Reagiert
   nur auf echte Mausereignisse (nicht
   auf Touch, das läuft nativ).
   ========================================================= */

function makeDraggable(el) {

    if (!el) {
        return;
    }

    let isDown = false;
    let dragged = false;
    let startX = 0;
    let startScrollLeft = 0;

    /*
        Performance-Fix: pointermove/-up/
        -cancel werden erst WÄHREND eines
        Drags an window gehängt (statt
        dauerhaft für jede der 3 Kachel-
        Reihen zu lauschen) – spart auf
        jeder normalen Mausbewegung drei
        überflüssige Funktionsaufrufe.
    */

    function onPointerMove(event) {

        if (!isDown || event.pointerType !== "mouse") {
            return;
        }

        const dx = event.clientX - startX;

        if (Math.abs(dx) > 4) {
            dragged = true;
        }

        if (dragged) {
            event.preventDefault();
            el.scrollLeft = startScrollLeft - dx;
        }

    }

    function endDrag(event) {

        if (event && event.pointerType && event.pointerType !== "mouse") {
            return;
        }

        if (isDown && dragged) {

            /*
                Verhindert, dass der Klick
                nach dem Ziehen noch ein
                Video öffnet oder einen
                Link auslöst.
            */

            const suppressClick = (clickEvent) => {
                clickEvent.preventDefault();
                clickEvent.stopPropagation();
                el.removeEventListener(
                    "click",
                    suppressClick,
                    true
                );
            };

            el.addEventListener(
                "click",
                suppressClick,
                true
            );

        }

        isDown = false;
        dragged = false;

        el.classList.remove("dragging");

        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", endDrag);
        window.removeEventListener("pointercancel", endDrag);

    }

    el.addEventListener("pointerdown", (event) => {

        if (event.pointerType !== "mouse") {
            return;
        }

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
