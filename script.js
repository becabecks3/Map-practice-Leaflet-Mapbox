const MAPBOX_API = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}'

const ATTRIBUTION =
  'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';
// Este token será el que obtengamos en la web de Mapbox
const ACCESS_TOKEN =
  'pk.eyJ1IjoicmFkdS1hIiwiYSI6ImNsaHM2aXVoNDJpZmEzbG9kYmVzc24yeTEifQ.g7HhKn-rVtWYe8DMCpctlg';



// Ejercicio 1

if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(position => {
        const latitude = position.coords.latitude.toFixed(4);
        const longitude = position.coords.longitude.toFixed(4);

        var map = L.map('map').setView([latitude, longitude], 13);

        // L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        //     maxZoom: 19,
        //     attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        // }).addTo(map);

        L.tileLayer(MAPBOX_API, {
            attribution: ATTRIBUTION,
            maxZoom: 18,
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: ACCESS_TOKEN
          }).addTo(map);
        
        var marker1 = L.marker([latitude, longitude]).addTo(map);
        var marker2 = L.marker([43.36607674873576, -8.406192688978976]).addTo(map);
        
    });
} else {
  console.warn("Tu navegador no soporta Geolocalización!!");
}

// Ejercicio 2

//pintamos el mapa de Los Angeles
var map2 = L.map('map2').setView([34.052267353174344, -118.24388574337601], 13);

        // L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        //     maxZoom: 19,
        //     attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        // }).addTo(map2);

        L.tileLayer(MAPBOX_API, {
            attribution: ATTRIBUTION,
            maxZoom: 18,
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: ACCESS_TOKEN
          }).addTo(map2);

//pintamos los marcadores de cada metro
function printMarker() {
    fetch('https://api.metro.net/LACMTA_Rail/vehicle_positions/all?geojson=false')
    .then(res=>res.json())
    .then(data=> {
        // creo tanto el array de 'markers' como la 'layer group' fuera del bucle para 
        let markerAll = [];
        let myLayer;
        data.forEach((element, i) => {
            // declaro variables que usaré en los marcadores y pop ups
            const latitude = element.position.latitude;
            const longitude = element.position.longitude;
            const id = element.vehicle.vehicle_id;
            // declaro marcador
            var marker = L.marker([latitude, longitude]);
            // añado marcadores mediante array a la capa
            markerAll.push(marker);
            myLayer = L.layerGroup(markerAll).addTo(map2);
            // añado popup al evento click
            marker.addEventListener("click", function() {
                var popup = L.popup()
                    .setLatLng([latitude, longitude])
                    .setContent(id)
                    .openOn(map2);
            });
        });
        // pasados 3 segundos la capa se borra y llamo de nuevo a la función
        setTimeout(() => {
            myLayer.remove();
            printMarker()
        }, 3000);
    })
}
printMarker()

