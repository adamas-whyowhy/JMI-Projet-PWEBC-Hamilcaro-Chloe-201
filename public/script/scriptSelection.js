var divdonneesFuniculaires,divdonneesVal,divdonneesGrandes,divdonneesTramways;
var divdonneesRER,divdonneesMetro,divdonneesTrain;

$(document).ready(function() {
    divdonneesTrain = $("#tabs-4");
    divdonneesMetro = $("#tabs-2");
    divdonneesRER = $("#tabs-3");
    divdonneesTramways = $("#tabs-1");
    divdonneesGrandes = $("#tabs-6");
    divdonneesVal = $("#tabs-5");
    divdonneesFuniculaires = $("#tabs-7");
    chargerDonnees();   // Chargement des données depuis le fichier JSON
})

function chargerDonnees() {
    $.getJSON("données/emplacement-des-gares-idf.geojson",
        function(data) {
            let arrayTrains = [], arrayMetros = [], arrayRER = [], arrayTramways = [], arrayGrandes = [], arrayVal = [], arrayFuniculaires = [];
            console.log(data);
            console.log(Object.keys(data["features"]).length);
            // Remplissage des listes de lignes de transport
            for (var i = 0; i < Object.keys(data["features"]).length; i++) {
                if (data["features"][i]["properties"]["reseau"] === "TRAIN") {
                    if (arrayTrains.includes(data["features"][i]["properties"]["ligne"])) { }
                    else { arrayTrains.push(data["features"][i]["properties"]["ligne"]); }
                }
                if (data["features"][i]["properties"]["reseau"] === "METRO") {
                    if (arrayMetros.includes(data["features"][i]["properties"]["ligne"])) { }
                    else { arrayMetros.push(data["features"][i]["properties"]["ligne"]); }
                }

                if (data["features"][i]["properties"]["reseau"] === "RER") {
                    if (arrayRER.includes(data["features"][i]["properties"]["ligne"])) { }
                    else { arrayRER.push(data["features"][i]["properties"]["ligne"]); }
                }

                if (data["features"][i]["properties"]["reseau"] === "TRAMWAY") {
                    if (arrayTramways.includes(data["features"][i]["properties"]["ligne"])) { }
                    else { arrayTramways.push(data["features"][i]["properties"]["ligne"]); }
                }

                if (data["features"][i]["properties"]["reseau"] === "GRANDES LIGNES") {
                    if (arrayGrandes.includes(data["features"][i]["properties"]["ligne"])) { }
                    else { arrayGrandes.push(data["features"][i]["properties"]["ligne"]); }
                }

                if (data["features"][i]["properties"]["reseau"] === "VAL") {
                    if (arrayVal.includes(data["features"][i]["properties"]["ligne"])) { }
                    else { arrayVal.push(data["features"][i]["properties"]["ligne"]); }
                }

                if (data["features"][i]["properties"]["reseau"] === "FUNICULAIRE MONTMARTRE") {
                    if (arrayFuniculaires.includes(data["features"][i]["properties"]["ligne"])) { }
                    else { arrayFuniculaires.push(data["features"][i]["properties"]["ligne"]); }
                }
            }
            listeLignes(arrayTrains, "TRAIN");
            listeLignes(arrayMetros, "METRO");
            listeLignes(arrayRER, "RER");
            listeLignes(arrayTramways, "TRAMWAY");
            listeLignes(arrayGrandes, "GRANDES");
            listeLignes(arrayVal, "VAL");
            listeLignes(arrayFuniculaires, "FUNICULAIRE");
        }
    );
}

// Remplissage des div avec les lignes de transport (sous la forme de listes déroulantes)
function listeLignes(tablignes, type) {
    tablignes.sort();   // Tri par ordre alphabétique
    var i;
    var dForm = "<form method='post' action='selection_action'><select name='ligne' class='form-select form-control'>"; // Début du formulaire, structure commune à toutes les lignes
    var dFormDisabled = "<form method='post' action='selection_action'><select name='ligne' class='form-select form-control' disabled>"; // Début du formulaire désactivé, structure commune à toutes les lignes
    var fForm = "</select><div class='d-grid'><button type='submit' class='btn btn-outline-secondary mt-2'>Jouer</button></div></form>"; // Fin du formulaire, structure commune à toutes les lignes
    var fFormDisabled = "</select><div class='d-grid'><button type='submit' class='btn btn-outline-secondary mt-2' disabled>Jouer</button></div></form>"; // Fin du formulaire désactivé, structure commune à toutes les lignes
    var txt = "";
    if (type === "TRAIN") {
        for (i = 0; i < tablignes.length; i++) {
            txt += "<option value='" + tablignes[i] + "'>" + tablignes[i] + "</option>";
        }
        divdonneesTrain.html(divdonneesTrain.html() + dForm + txt + fForm);
    }
    if (type === "METRO") {
        tablignes.sort(function(a, b) {return a-b});    // Tri par ordre croissant des nombres
        for (i = 0; i < tablignes.length; i++) {
            txt += "<option value='" + tablignes[i] + "'>" + tablignes[i] + "</option>";
        }
        divdonneesMetro.html(divdonneesMetro.html() + dForm + txt + fForm);
    }
    if (type === "RER") {
        for (i = 0; i < tablignes.length; i++) {
            txt += "<option value='" + tablignes[i] + "'>" + tablignes[i] + "</option>";
        }
        divdonneesRER.html(divdonneesRER.html() + dForm + txt + fForm);
    }
    if (type === "TRAMWAY") {
        for (i = 0; i < tablignes.length; i++) {
            txt += "<option value='" + tablignes[i] + "'>" + tablignes[i] + "</option>";
        }
        divdonneesTramways.html(divdonneesTramways.html() + dForm + txt + fForm);
    }
    if (type === "GRANDES") {
        for (i = 0; i < tablignes.length; i++) {
            txt += "<option value='" + tablignes[i] + "'>" + tablignes[i] + "</option>";
        }
        divdonneesGrandes.html(divdonneesGrandes.html() + dFormDisabled + txt + fFormDisabled);
    }
    if (type === "VAL") {
        for (i = 0; i < tablignes.length; i++) {
            txt += "<option value='" + tablignes[i] + "'>" + tablignes[i] + "</option>";
        }
        divdonneesVal.html(divdonneesVal.html() + dForm + txt + fForm);
    }
    if (type === "FUNICULAIRE") {
        for (i = 0; i < tablignes.length; i++) {
            txt += "<option value='" + tablignes[i] + "'>" + tablignes[i] + "</option>";
        }
        divdonneesFuniculaires.html(divdonneesFuniculaires.html() + dFormDisabled + txt + fFormDisabled);
    }
}