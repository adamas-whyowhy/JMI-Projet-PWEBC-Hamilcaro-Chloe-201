var mymap;

window.onload = function () {
    chargerCarte();
}

function chargerCarte() {   // Géolocalisation
    if ('geolocation' in navigator) { // Géolocalisation supportée par le navigateur
        navigator.geolocation.getCurrentPosition((position) => {    // Si localisation autorisée / succès
                mymap = L.map('map').setView([position.coords.latitude, position.coords.longitude], 13);
                L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=TcyoqW24ssJZ5YEpGHn1', {
                    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.maptiler.com/">Maptiler</a>',
                    maxZoom: 18,
                    id: 'maptiler/streets',
                    tileSize: 512,
                    zoomOffset: -1
                }).addTo(mymap);
                trouvemoiParis();       // Remplissage du bloc qui indique où se trouve Paris
            },
            () => {     // Si localisation n'est pas autorisée / erreur
                mymap = L.map('map').setView([48.856614, 2.3522219], 13);    // Localisation de Paris
                L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=TcyoqW24ssJZ5YEpGHn1', {
                    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.maptiler.com/">Maptiler</a>',
                    maxZoom: 18,
                    id: 'maptiler/streets',
                    tileSize: 512,
                    zoomOffset: -1
                }).addTo(mymap);
                trouvemoiParis();       // Remplissage du bloc qui indique où se trouve Paris
            }
        );

    } else {    // Géolocalisation non-supportée par le navigateur
        mymap = L.map('map').setView([48.856614, 2.3522219], 13);    // Localisation de Paris
        L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=TcyoqW24ssJZ5YEpGHn1', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.maptiler.com/">Maptiler</a>',
            maxZoom: 18,
            id: 'maptiler/streets',
            tileSize: 512,
            zoomOffset: -1
        }).addTo(mymap);
        trouvemoiParis();       // Remplissage du bloc qui indique où se trouve Paris
    }

}

function trouvemoiParis() {
    mesDonnees();
}

function mesDonnees() {
    var donnees = ['143 avenue de Versailles, Paris, France',
        'Tour Eiffel, Paris, France',
        'Arc de Triomphe, Paris, France'];
    remplissageCarte(donnees);
}

function remplissageCarte(donnees) {
    dir = MQ.routing.directions();

    dir.route({
        locations: donnees
    });

    mymap.addLayer(MQ.routing.routeLayer({
        directions: dir,
        fitBounds: true
    }));
}

function lesdir() {
    dir = MQ.routing.directions();

    dir.route({
        locations: [
            '143 avenue de Versailles, Paris, France',
            'Tour Eiffel, Paris, France',
            'Arc de Triomphe, Paris, France'
        ]
    });

    mymap.addLayer(MQ.routing.routeLayer({
        directions: dir,
        fitBounds: true
    }));
}