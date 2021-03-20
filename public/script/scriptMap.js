var divstatus, divstations, divreponses, divparis;
var questions = []; // Tableau des stations (question : quelle station va a quel endroit ?)
var reponses = [];  // Tableau des bonnes réponses (coordonnées)
var repondu = [];   // Tableau des réponses du joueur (json, format {"station", "coords"} avec coords un array)
var mymap;          // La carte
var ligne = (new URL(window.location.href)).searchParams.get("num_ligne"); // La ligne avec laquelle l'utilisateur joue
var m = 0;          // Indice du tableau des réponses du joueur, à incrémenter
var markerGroup;    // Groupe / Couche (layer) de markers Leaflet
var tabCheminDeuxPoints = [];

$(document).ready(function() {
    divstatus = $("#status");      // Status de l'affichage de la carte
    divparis = $("#paris");        // Bloc indiquant où se trouve Paris
    divstations = $("#stations");  // Bloc contenant les stations draggable
    divreponses = $("#réponses");  // Bloc contenant les questions droppable
    geolocalisation();  // Affichage de la carte
})

// Géolocalisation et affichage de la carte
function geolocalisation() {
    divstatus.html("<i>Affichage de la carte en cours</i>");

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
                divstatus.html("");  // La carte est affichée, on supprime le message
                ouEstParis();       // Remplissage du bloc qui indique où se trouve Paris
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
                divstatus.html("");  // La carte est affichée, on supprime le message
                ouEstParis();       // Remplissage du bloc qui indique où se trouve Paris
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
        divstatus.html("");  // La carte est affichée, on supprime le message
        ouEstParis();       // Remplissage du bloc qui indique où se trouve Paris
    }
}

// Fonction indiquant où se situe Paris, avec l'utilisation de Nominatim.
function ouEstParis() {
    let latitudeParis = 0, longitudeParis = 0;
    try {
        $.ajax({
            url  : "https://nominatim.openstreetmap.org/search",
            type :"GET",
            dataType : "json",
            data : {format: "json", limit: 1,country: "france", city: "paris"},
            success : function(data){
                console.log(data[0]["lat"]);
                console.log(data[0]["lon"]);
                latitudeParis=data[0]["lat"];
                longitudeParis=data[0]["lon"];
                divparis.html("Cette carte utilise les données des transports en commun en IDF.<br>" +
                    "La capitale, Paris, se trouve aux coordonnées [" + latitudeParis + "," + longitudeParis + "]. " +
                    "(données Nominatim)");
            },
            error : function(error){ alert ("Erreur : " + error); }
        });
    }
    catch (err) { alert ("Erreur : " + err.message); }

    if (ligne != null)
        chargerdonnees();   // Chargement des données
    else
        remplirCarteEntiere();
}

// Fonction ajax pour la lecture des données geojson
function chargerdonnees() {
    try {
        $.ajax({
            url  : "données/emplacement-des-gares-idf.geojson",
            type :"GET",
            dataType : "json",
            success : function(data){
                remplirCarte(data); // Remplir la carte avec les points
            },
            error : function(error){ alert ("Erreur : " + error); }
        });
    }
    catch (err) { alert ("Erreur : " + err.message); }
}

// Remplissage de la carte
function remplirCarte(data) {
    let latitude, longitude;
    var jsonCoord;
    let tabId = [];
    let k = 0;
    console.log(data);
    for (var i = 0; i < Object.keys(data["features"]).length; i++) {
        if (data["features"][i]["properties"]["ligne"] === ligne) {
            latitude = parseFloat(data['features'][i]['geometry']['coordinates'][1]);
            longitude = parseFloat(data['features'][i]['geometry']['coordinates'][0]);

            questions[k] = data['features'][i]['properties']['nomlong']; // Pour la vérification des réponses
            reponses[k] = [{latitude, longitude}];  // Pour la vérification des réponses
            jsonCoord = { latLng: { lat: latitude, lng: longitude } };  // Pour la route
            tabId[k] = {prop: { id: data['features'][i]['properties']['gares_id'], num: k, lat: latitude, lng: longitude, x: data['features'][i]['properties']['x'], y: data['features'][i]['properties']['y']} };

            ajouterStation(data['features'][i]['properties']['nomlong'], ++k);
            ajouterReponse(k);

            console.log(data['features'][i]['properties']['nomlong']);
            console.log(latitude);
            console.log(longitude);

            let marker = L.marker([latitude, longitude]);
            marker.bindPopup(k.toString()).openPopup();
            marker.addTo(mymap);
        }
        $(function () {
            $(".draggable").draggable();
        });
        $(".droppable").droppable({
            drop: function (event, ui) {
                $(this).find("p").html(ui.draggable.find("p").html());
                var s = ui.draggable.find('p').html();          // Texte de la station
                var indice = parseInt($(this).find('h5').html());    // Indice de la boîte de réponse
                ui.draggable.empty();   // La réponse n'est plus disponible, on vide sa div
                sauvegarderReponse(s, indice);
            }
        });
        // Définition de la progressbar : lorsque sa valeur change, elle est affichée en pourcentages (arrondi à l'entier inférieur)
        $("#progressbar").progressbar({value: 0, max: questions.length, change: function() {
                var valeur = (($("#progressbar").progressbar( "value")/questions.length).toFixed(2) * 100).toFixed(0);
                $(".progress-label").text( "Progression : " + valeur + "%" ); }});
    }

    var vraiCoords = [];
    for (var i = tabId.length - 1; i >=1; i--) {
        for (var j = 0; j < i; j++) {
            if (tabId[j]['prop']['x']-tabId[j]['prop']['y'] > tabId[j+1]['prop']['x']-tabId[j]['prop']['y']) {
                temp = tabId[j+1];
                tabId[j+1]=tabId[j];
                tabId[j]=temp;
            }
        }
    }
    console.log(tabId);


    for (var i = 0; i < tabId.length; i++) {
        vraiCoords[i]={ latLng: { lat: tabId[i]['prop']['lat'], lng: tabId[i]['prop']['lng'], label:tabId[i]['id'] } };
    }

    console.log(vraiCoords);

    dir = MQ.routing.directions();

    dir.route({
        locations: vraiCoords
    });

    mymap.addLayer(MQ.routing.routeLayer({
        directions: dir,
        ribbonOptions: {
            ribbonDisplay: { color: 'purple', opacity: 0.5 }
        },
    }));

}

// Affichage des lignes (div draggable), la map devient droppable : lorsqu'une ligne est glissée sur la carte, les stations s'affichent
function remplirCarteEntiere() {
    $("#réponses").empty();
    $("#valider").empty();
    $("#stations").empty().css({ width : 0, height: 0, }); // Pour ne pas être gêné par cette div qui ne nous sert pas
    $("#map").css({margin : 0, });
    var divlignes = $("#lignes");
    try {
        $.ajax({
            url : "données/emplacement-des-gares-idf.geojson",
            type :"GET",
            dataType : "json",
            success : function(data){
                $.getJSON("données/emplacement-des-gares-idf.geojson",
                    function(data) {
                        var arrayLignes = [], arrayImg = [], nomligne, typeligne;
                        // Remplissage des listes de lignes de transport
                        for (var i = 0; i < Object.keys(data["features"]).length; i++) {
                            nomligne = data["features"][i]["properties"]["ligne"];
                            if ((!arrayLignes.includes(nomligne)) && (data["features"][i]["properties"]["reseau"]!=="GRANDES LIGNES")) {
                                arrayLignes.push(nomligne);
                            }
                        }
                        arrayLignes.sort();
                        for (var l = 0; l < arrayLignes.length; l++) {
                            divlignes.html(divlignes.html() + "<div class='draggable uneligne'>" + arrayLignes[l] + "</div>");
                        }
                        $(function () {
                            $(".draggable").draggable({ revert: "valid" });
                        });
                    }
                )

                $( "#map" ).droppable({
                    drop: function (event, ui) {
                        var laligne = ui.draggable.html();
                        //Requete AJAX pour récupérer les coordonnées (lati, longi) du pays
                        $.ajax({
                            url : "données/emplacement-des-gares-idf.geojson",
                            type :"GET",
                            dataType : "json",
                            error: function (xhr, status, error) {
                                alert("ERROR " + error);
                            },
                            success: function (data) {
                                mymap.eachLayer(function (layer) {
                                    if (layer === markerGroup)      // Suppression de la couche contenant les marqueurs
                                        mymap.removeLayer(layer);
                                });
                                markerGroup = L.layerGroup().addTo(mymap);
                                for (var i = 0; i < Object.keys(data["features"]).length; i++) {
                                    if (data["features"][i]["properties"]["ligne"] === laligne) {
                                        latitude = parseFloat(data['features'][i]['geometry']['coordinates'][1]);
                                        longitude = parseFloat(data['features'][i]['geometry']['coordinates'][0]);

                                        let marker = L.marker([latitude, longitude]);
                                        marker.bindPopup(data['features'][i]['properties']['nomlong']).openPopup();
                                        marker.addTo(markerGroup);
                                        marker.on("click", function(event) {
                                            if (tabCheminDeuxPoints[0] == null) {
                                                tabCheminDeuxPoints[0] = { latLng: { lat: event.latlng.lat, lng: event.latlng.lng, label: "Départ"} };
                                            }
                                            else if (tabCheminDeuxPoints[1] == null) {
                                                tabCheminDeuxPoints[1] = { latLng: { lat: event.latlng.lat, lng: event.latlng.lng, label: "Arrivée"} };
                                                dir = MQ.routing.directions();

                                                dir.route({
                                                    locations: tabCheminDeuxPoints
                                                });

                                                mymap.addLayer(MQ.routing.routeLayer({
                                                    directions: dir,
                                                    ribbonOptions: {
                                                        ribbonDisplay: { color: 'purple', opacity: 0.5 }
                                                    },
                                                }));
                                            }
                                            else {  // Il y a déjà un chemin affiché, on en commence un autre
                                                tabCheminDeuxPoints[0] = null;
                                                tabCheminDeuxPoints[1] = null;
                                                tabCheminDeuxPoints[0] = { latLng: { lat: event.latlng.lat, lng: event.latlng.lng, label: "Départ"} };
                                            }
                                        });
                                    }
                                }

                            }
                        });


                    },
                })
            },
            error : function(error){ alert ("Erreur : " + error); }
        });
    }
    catch (err) { alert ("Erreur : " + err.message); }
}

function cheminDeuxPoints(e) {
    if (tabCheminDeuxPoints[0] == null) {
        tabCheminDeuxPoints[0] = { latLng: { lat: latitude, lng: longitude, label: "Départ"} }
    }
    else {
        tabCheminDeuxPoints[1] = { latLng: { lat: latitude, lng: longitude, label: "Arrivée"} }
        dir = MQ.routing.directions();

        dir.route({
            locations: tabCheminDeuxPoints
        });

        mymap.addLayer(MQ.routing.routeLayer({
            directions: dir,
            ribbonOptions: {
                ribbonDisplay: { color: 'purple', opacity: 0.5 }
            },
        }));
    }
}

// Ajout d'un bloc représentant une station (draggable)
function ajouterStation(station, k) {
    divstations.html(divstations.html() + "<div id='station" + k + "' class='draggable unestation'><p>" + station + "</p></div>");
}
// Ajout d'un bloc de réponse (droppable)
function ajouterReponse(k) {
    divreponses.html(divreponses.html() + "<div id='repstation" + k + "' class='droppable uneréponse'><h5>" + k + "</h5><p></p></div>");
}

// Sauvegarde les réponses du joueur dans un tableau
function sauvegarderReponse(station, id) {
    let coords = reponses[--id];
    let trouve=false;
    ++id;
    for (var i = 0; i < repondu.length; i++) {
        if (repondu[i]["station"] === station) {    // Si la station avait déjà été déposée quelque-part
            trouve=true;
            repondu[i] = {station, coords, id};
        }
    }
    if(!trouve) {   // Si la station n'avait pas déjà été déposée dans une div droppable
        repondu[m++] = {station, coords, id};
        $("#progressbar").progressbar({ value: repondu.length });
    }
}

// Annule la dernière réponse (le dernier coup du joueur, la dernière station positionnée)
function reverseReponse() {
    var taille = repondu.length-1;
    var derniereRep;
    if (m>0) { // Possible seulement s'il y a au moins un élément dans la liste des réponses
        ajouterStation(repondu[taille]["station"], 0);  // La dernière station redevient cliquable
        console.log(repondu[taille]);
        derniereRep = "#repstation" + repondu[taille]["id"];
        console.log(derniereRep);
        $(derniereRep).find("p").empty();
        temprepondu = [];
        for (var ind = 0; ind < taille; ind++) {
            temprepondu[ind] = repondu[ind];
        }
        repondu = temprepondu;
        m--;
        $("#progressbar").progressbar({value: m});
        $(function () {
            $(".draggable").draggable();
        });
    } else {    // Il n'y a aucune réponse enregistrée
        alert("Il n'y a aucun coup à annuler ! Essayez de jouer.");
    }
}

// Vérifie les réponses
function checkReponses() {
    let cptbon = 0;     // Nombre de bonnes réponses
    for (var i = 0; i < repondu.length; i++) {
        for (var j = 0; j < questions.length; j++) {
            if ((repondu[i]["station"] === questions[j]) && (repondu[i]["coords"] === reponses[j])) {
                cptbon++;
            }
        }
    }

    if (cptbon===questions.length) {
        alert(cptbon + " bonne(s) réponse(s) sur " + questions.length + " questions. C'est gagné ! Retour à l'écran de sélection.");
        document.location.href="/selection";
    }
    else {
        alert(cptbon + " bonne(s) réponse(s) sur " + questions.length + " questions. Perdu ! Les bonnes réponses vont s'afficher.");
        divstations.empty();
        divreponses.empty();
        for (var k = 0; k < questions.length; k++) {
            divreponses.html(divreponses.html() + "<div id='repstation" + (k + 1) + "' class='droppable uneréponse'><h5>" + (k + 1) + "</h5><p style='color: black'>" + questions[k] + "</p></div>");
        }
    }
}