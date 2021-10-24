// pinSVGHole from: https://stackoverflow.com/questions/2472957/how-can-i-change-the-color-of-a-google-maps-marker
const pinSVGHole =
    "M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z";

export const blackMarker = {
    path: pinSVGHole,
    anchor: { x: 12, y: 17 },
    fillOpacity: 1,
    fillColor: "#000000",
    strokeWeight: 2,
    strokeColor: "white",
    scale: 2,
};

export const greenMarker = {
    path: pinSVGHole,
    anchor: { x: 12, y: 17 },
    fillOpacity: 1,
    fillColor: "#28a745",
    strokeWeight: 2,
    strokeColor: "white",
    scale: 2,
};
