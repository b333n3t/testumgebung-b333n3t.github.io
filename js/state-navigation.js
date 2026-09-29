/* =========================================================
   GESPALTEN
   BIDIREKTIONALE NAVIGATION
   ========================================================= */


/*
    Alle Seiten
*/

const pages = Array.from(
    document.querySelectorAll(".page")
);


/*
    Aktuelle Seite

    0 = gespalten
    1 = die andere
    2 = Spotify
    3 = YouTube
    4 = Drei
    5 = Connect
*/

let currentPage = 0;


/*
    Fortschritt des Spalts

    0 = geschlossen
    1 = komplett geöffnet
*/

let progress = 0;


/*
    Richtung

     1 = nach unten
    -1 = nach oben
*/

let direction = 1;


/*
    Animation läuft gerade
*/

let animating = false;


/*
    Scrollgeschwindigkeit
*/

const OPEN_DISTANCE = 900;

/*
    Empfindlichkeit des horizontalen
    Scrollens (Kacheln / YouTube-Reihe).
    Werte über 1 verstärken jede
    Maus-, Trackpad- oder Touch-Geste,
    damit schon ein leichtes Wischen
    bzw. ein kleiner Wheel-Ausschlag
    spürbar etwas bewegt.
*/

const H_SCROLL_SENSITIVITY = 2.6;

/*
    Zusätzliche Verstärkung nur für die
    vertikale Spalt-Geste (Seitenwechsel)
    per Touch. Höher als 1 bedeutet: der
    Spalt öffnet/schließt sich schneller
    und flüssiger, bei gleicher Wisch-
    distanz mit dem Finger.
*/

const TOUCH_SPALT_SENSITIVITY = 1.7;



/* =========================================================
   ZIELSEITE

   Die Zielseite hängt von der aktuell
   laufenden Geste ("direction") ab:

    1 = vorwärts / abwärts  -> nächste Seite
   -1 = rückwärts / aufwärts -> vorherige Seite
   ========================================================= */

function getTargetPage(dir) {

    if (dir === 1) {

        return (
            (currentPage + 1) %
            pages.length
        );

    }

    return (
        (currentPage - 1 + pages.length) %
        pages.length
    );

}


/* =========================================================
   SEITEN-EBENEN AUFBAUEN
   ========================================================= */

function setupLayers(dir) {

    pages.forEach((page) => {

        page.classList.remove("active");
        page.classList.remove("behind");

        page.style.webkitMaskImage = "none";
        page.style.maskImage = "none";

    });


    /*
        Aktuelle Seite liegt oben.
    */

    pages[currentPage]
        .classList.add("active");


    /*
        Zielseite liegt darunter.
    */

    pages[getTargetPage(dir)]
        .classList.add("behind");

}


/* =========================================================
   MASKE

   Es gibt zwei Maskenformen, je nach
   Richtung der aktiven Geste:

   1) VORWÄRTS (direction === 1):
      Ein Spalt öffnet sich in der Mitte
      und wächst nach außen. Die aktuelle
      Seite verschwindet von innen nach
      außen, die nächste Seite kommt zum
      Vorschein.

   2) RÜCKWÄRTS (direction === -1):
      Genau umgekehrt: Die aktuelle Seite
      verschwindet von außen nach innen
      (die Ränder werden zuerst transparent),
      die vorherige Seite kommt von außen
      nach innen zum Vorschein.
   ========================================================= */

function updateMask() {

    const current =
        pages[currentPage];


    if (!current) {
        return;
    }


    if (direction === 1) {

        /*
            VORWÄRTS: Spalt wächst
            von der Mitte nach außen.
        */

        const maxOpening =
            (window.innerWidth / 2) - 1;


        const opening =
            progress * maxOpening;


        const openingPercent =
            (
                opening /
                window.innerWidth
            ) * 100;


        const left =
            50 - openingPercent;


        const right =
            50 + openingPercent;


        const mask =
            `linear-gradient(
                to right,
                black 0%,
                black ${left}%,
                transparent ${left}%,
                transparent ${right}%,
                black ${right}%,
                black 100%
            )`;


        current.style.webkitMaskImage = mask;

        current.style.maskImage = mask;

    } else {

        /*
            RÜCKWÄRTS: die Seite löst
            sich von den Rändern her auf,
            die Auflösung wandert nach innen.
        */

        const edge =
            progress * 50;


        const innerLeft =
            edge;


        const innerRight =
            100 - edge;


        const mask =
            `linear-gradient(
                to right,
                transparent 0%,
                transparent ${innerLeft}%,
                black ${innerLeft}%,
                black ${innerRight}%,
                transparent ${innerRight}%,
                transparent 100%
            )`;


        current.style.webkitMaskImage = mask;

        current.style.maskImage = mask;

    }

}


/* =========================================================
   SEITENWECHSEL
   ========================================================= */

function changePage() {

    /*
        Die Richtung entscheidet,
        welche Seite als nächstes kommt.
    */

    currentPage =
        getTargetPage(direction);


    /*
        Neuer Zustand:

        Die neue Seite ist komplett sichtbar.
    */

    progress = 0;


    /*
        Seite 2 ("die andere") zeigt beim
        ersten Erscheinen den Typewriter-Text.
    */

    if (currentPage === 1) {

        startAboutTypewriter();

    }


    /*
        Ebenen neu sortieren
        (Ziel für die nächste Geste ist
        noch unbekannt, wird beim nächsten
        Scroll neu bestimmt).
    */

    setupLayers(direction);


    /*
        Maske zurücksetzen.
    */

    pages[currentPage]
        .style.webkitMaskImage = "none";

    pages[currentPage]
        .style.maskImage = "none";

}
