// Initializes map
var map = L.map("map").setView([49.895077, -97.138451], 13);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

// Map click handler
function onMapClick(e) {
  createNewMarker(e.latlng);
}

// This function creates a new feature on the map
function createNewMarker(latlng) {
  var marker = L.marker(latlng, {
    draggable: true,
    autoPan: true,
    interactive: true,
  }).addTo(map);
  var markerId = marker._leaflet_id;
  marker
    .bindPopup(
      `
    <span class="title">Feature #${markerId}</span><br>
    <input class="search-bar" id="search-${markerId}" oninput="highlight(${markerId})" type="text" placeholder="Search.."><br>
    <p id="text-${markerId}"></p><br>
    <form name="message" action="">
    <textarea style="display:none;" id="text-input-${markerId}" rows="4" placeholder="Hit 'Enter' to submit">
    </textarea>
    </form>
    <button id="edit-btn-${markerId}" onclick="editMarkerText(${markerId})">Add Text</button>
    <button onclick="removeMarker(${markerId})">Remove Feature</button>`
    )
    .openPopup();
}

// This function removes the selected feature from the map
function removeMarker(markerId) {
  map.removeLayer(map._layers[markerId]);
}

// This function enables the user to edit the text content of a selected feature on the map
function editMarkerText(markerId) {
  const textContent = document.getElementById(`text-${markerId}`);
  const textInput = document.getElementById(`text-input-${markerId}`);
  const editButton = document.getElementById(`edit-btn-${markerId}`);

  textContent.style.display = "none";
  textInput.style.display = "block";
  textInput.value = textContent.innerText;

  textInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && !event.shiftKey) {
      textContent.innerText = textInput.value;
      textContent.style.display = "block";
      textInput.style.display = "none";
      textContent.innerText
        ? (editButton.innerText = "Edit Text")
        : (editButton.innerText = "Add Text");
      const marker = map._layers[markerId];
      marker.setPopupContent(getPopupContent(markerId));

      event.preventDefault();
    }
  });
}
// This function generates the text content and toggles the 'Add/Edit' button's title
function getPopupContent(markerId) {
  const textContent = document.getElementById(`text-${markerId}`).innerText;
  return `
    <span class="title">Feature #${markerId}</span><br>
    <input class="search-bar" id="search-${markerId}" oninput="highlight(${markerId})" type="text" placeholder="Search.."><br>
    <p id="text-${markerId}">${textContent}</p><br>
    <form name="message" action="">
    <textarea style="display:none;" id="text-input-${markerId}" rows="4" placeholder="Hit 'Enter' to submit"></textarea>
    </form>
    <button id="edit-btn-${markerId}" onclick="editMarkerText(${markerId})">${
    textContent ? "Edit Text" : "Add Text"
  }</button>
    <button onclick="removeMarker(${markerId})">Remove Feature</button>`;
}

// This function highlights matching search terms in a feature's text box
function highlight(markerId) {
  var inputText = document.getElementById(`search-${markerId}`).value;
  var searchText = document.getElementById(`text-${markerId}`).innerText;
  var index = searchText.toLowerCase().indexOf(inputText.toLowerCase());
  if (index >= 0) {
    var highlightedText =
      searchText.substring(0, index) +
      "<mark>" +
      searchText.substring(index, index + inputText.length) +
      "</mark>" +
      searchText.substring(index + inputText.length);
    document.getElementById(`text-${markerId}`).innerHTML = highlightedText;
  }
}

map.on("click", onMapClick);
