const canvas = document.getElementById("mapCanvas");
const ctx = canvas.getContext("2d");

let image = new Image();
image.src = "gtav-zones-base.jpg";

let dynamicFont = true;
let scale = 0.30; // Initial zoom level
const MIN_ZOOM = 0.1;
const MAX_ZOOM = 3;
let offsetX = 0; // Will be centered later
let offsetY = 0;
let isDragging = false;
let dragStart = { x: 0, y: 0 };
let regions = {};
let showNames = true;
let hoveredRegion = null;
let mouseX = 0;
let mouseY = 0;

let labelFontFamily = "'Verdana', 'Arial', sans-serif";
let labelFontSize = 18; // in px
let labelFontWeight = "normal";
let labelColor = "white";
let labelHighlightColor = "yellow";
let labelStrokeStyle = "black";
let labelLineWidth = 2;
let labelShadowColor = "black";
let labelShadowBlur = 2;
let labelShadowOffsetX = 1;
let labelShadowOffsetY = 1;

let labelPositions = {
  "North Yankton": [2700, 4630],
  "Cayo Perico": [2700, 4570],
  "Mount Chiliad": [1834.469, 1076.511],
  "Vinewood Hills": [1519.973, 2687.69],
  "Grand Senora Desert": [1927.798, 2080.477],
  "Tataviam Mountains": [2289.525, 2884.698],
  "San Chianski Mountain Range": [2696.908, 1607.85],
  "Los Santos International Airport": [1034.362, 4053.95],
  "Palomino Highlands": [2313.546, 3540.725],
  "Mount Josiah": [1116.564, 1760.843],
  "Alamo Sea": [1880.189, 1578.604],
  "Fort Zancudo": [717.219, 1923.67],
  "Mount Gordo": [2539.36, 881.288],
  "Great Chaparral": [1269.353, 2241.494],
  "Elysian Island": [1528.703, 4107.461],
  "Ron Alternates Wind Farm": [2396.276, 2330.006],
  "Banham Canyon": [585.086, 2711.317],
  "Tongva Hills": [698.905, 2380.722],
  "Chiliad Mountain State Wilderness": [1116.985, 1271.719],
  "El Burro Heights": [2050.071, 3708.377],
  "Raton Canyon": [1058.795, 1492.425],
  "Lago Zancudo": [639.55, 2105.897],
  "Pacific Bluffs": [665.704, 3064.483],
  "Paleto Cove": [891.981, 1049.718],
  "Sandy Shores": [2261.82, 1713.498],
  "Grapeseed": [2298.826, 1315.003],
  "Paleto Bay": [1493.652, 677.2],
  "Paleto Forest": [1312.398, 970.978],
  "North Chumash": [665.451, 1506.598],
  "La Mesa": [1784.453, 3501.547],
  "Rockford Hills": [1190.189, 3103.448],
  "Cypress Flats": [1786.609, 3871.008],
  "Zancudo River": [1371.375, 1946.633],
  "Terminal": [1881.774, 4173.92],
  "Little Seoul": [1271.416, 3363.81],
  "Davis Quartz": [2555.267, 2067.173],
  "West Vinewood": [1383.415, 2977.123],
  "Richman Glen": [874.207, 2704.721],
  "Pillbox Hill": [1491.083, 3372.09],
  "La Puerta 1": [1285.326, 3700.335],
  "Murrieta Heights 2": [1940.096, 3463.012],
  "Downtown Vinewood": [1642.842, 2980.924],
  "Strawberry": [1523.784, 3543.226],
  "Mirror Park 1": [1918.905, 3258.995],
  "Tongva Valley": [982.239, 2397.579],
  "Richman": [897.709, 2955.914],
  "Del Perro": [957.611, 3288.877],
  "Redwood Lights Track": [1883.639, 2220.706],
  "La Puerta 2": [1185.378, 3593.61],
  "Rancho": [1656.359, 3728.068],
  "Vespucci Canals": [1122.451, 3434.037],
  "East Vinewood": [1831.826, 3150.44],
  "Galileo Park": [1740.578, 2596.661],
  "Banning": [1539.76, 3870.626],
  "Burton": [1401.056, 3125.574],
  "Vespucci Beach": [1031.502, 3588.164],
  "Del Perro Beach": [894.783, 3404.198],
  "Davis": [1548.028, 3695.231],
  "Palmer-Taylor Power Station": [2502.256, 2504.913],
  "Land Act Reservoir": [2196.012, 2989.966],
  "GWC and Golfing Society": [1058.078, 2992.929],
  "Cassidy Creek": [1169.198, 1457.94],
  "Chumash": [369.517, 2625.132],
  "Alta": [1599.684, 3175.759],
  "Harmony": [1662.453, 2096.166],
  "Bolingbroke Penitentiary": [2134.955, 2108.916],
  "Vinewood Racetrack": [1926.59, 3007.085],
  "Hawick": [1625.001, 3099.207],
  "Braddock Pass": [2343.98, 933.109],
  "Maze Bank Arena": [1400.789, 3772.887],
  "Procopio Beach": [1896.464, 645.264],
  "Mission Row": [1635.572, 3428.794],
  "Stab City": [1536.433, 1707.257],
  "Morningwood": [972.924, 3151.823],
  "Humane Labs and Research": [2792.789, 1708.024],
  "Baytree Canyon": [1616.402, 2712.123],
  "Downtown": [1489.602, 3255.384],
  "Chamberlain Hills": [1443.996, 3638.414],
  "Banham Canyon Dr": [417.243, 2679.903],
  "Textile City": [1651.228, 3322.293],
  "Pacific Ocean": [792.534, 1281.478],
  "Richards Majestic": [1082.463, 3240.782],
  "Vinewood": [1555.592, 3233.167],
  "N.O.O.S.E": [2424.257, 3194.22],
  "Murrieta Heights 1": [1968.733, 3766.812],
  "Galileo Observatory": [1348.055, 2641.357],
  "Vespucci": [1047.615, 3522.594],
  "El Gordo Lighthouse": [2766.125, 1176.88],
  "Legion Square": [1579.19, 3396.302],
  "Galilee": [1993.83, 1477.093],
  "Mirror Park 2": [1705.688, 3220.197],
  "Braddock Tunnel": [2325.995, 905.563],
  "Land Act Dam": [2113.645, 3063.529],
  "Calafia Bridge": [1446.479, 1514.126],
  "Port of South Los Santos": [1450.301, 3840.179],
};

let imageLoaded = false;
let regionsLoaded = false;

// Show loading spinner
const spinner = document.getElementById("loading");
spinner.style.display = "block";

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  if (imageLoaded && regionsLoaded) draw();
}
window.addEventListener("resize", resizeCanvas);

function screenToWorld(x, y) {
  return [(x - offsetX) / scale, (y - offsetY) / scale];
}

function worldToScreen(x, y) {
  return [x * scale + offsetX, y * scale + offsetY];
}

function parseRegions(text) {
  const lines = text.trim().split("\n");
  let currentName = null;
  for (let line of lines) {
    line = line.trim();
    if (!line) continue;

    if (!line.includes(",")) {
      currentName = line;
      regions[currentName] = [];
    } else if (currentName) {
      const [x, y] = line.split(",").map(Number);
      regions[currentName].push([x, y]);
    }
  }
}


function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, offsetX, offsetY, image.width * scale, image.height * scale);

  for (const [name, coords] of Object.entries(regions)) {
    if (coords.length < 2) continue;

    ctx.beginPath();
    const [startX, startY] = worldToScreen(...coords[0]);
    ctx.moveTo(startX, startY);
    for (const [x, y] of coords.slice(1)) {
      const [sx, sy] = worldToScreen(x, y);
      ctx.lineTo(sx, sy);
    }
    ctx.closePath();

    if (name === hoveredRegion) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fill();
      ctx.strokeStyle = "orange";
      ctx.lineWidth = 3;
    } else {
      ctx.strokeStyle = "red";
      ctx.lineWidth = 1;
    }

    ctx.stroke();
  }

  let zoomedSize = dynamicFont ? labelFontSize * scale * 1.5 : labelFontSize;
  ctx.font = `${labelFontWeight} ${zoomedSize}px ${labelFontFamily}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.strokeStyle = labelStrokeStyle;
  ctx.lineWidth = labelLineWidth;
  ctx.shadowColor = labelShadowColor;
  ctx.shadowBlur = labelShadowBlur;
  ctx.shadowOffsetX = labelShadowOffsetX;
  ctx.shadowOffsetY = labelShadowOffsetY;
  for (const [name, coords] of Object.entries(regions)) {
    if (coords.length < 2) continue;

    ctx.fillStyle = (showNames && name == hoveredRegion)? labelHighlightColor : labelColor;

    if ((showNames || name == hoveredRegion) && labelPositions[name]) {
      const [lx, ly] = worldToScreen(...labelPositions[name]);
      ctx.strokeText(name, lx, ly);
      ctx.fillText(name, lx, ly);
      ctx.fillText(name, lx, ly);
    }
  }
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

}

image.onload = () => {
  imageLoaded = true;

  // Center the image initially
  offsetX = (canvas.width - image.width * scale) / 2;
  offsetY = (canvas.height - image.height * scale) / 2;

  if (regionsLoaded) {
    spinner.style.display = "none";
    draw();
  }
};

fetch("zones-bounds-pixels.txt")
  .then((r) => r.text())
  .then((text) => {
    parseRegions(text);
    regionsLoaded = true;
    if (imageLoaded) {
      spinner.style.display = "none";
      draw();
    }
  });

// Zoom with scroll
canvas.addEventListener("wheel", (e) => {
  e.preventDefault();
  const mouseX = e.offsetX;
  const mouseY = e.offsetY;

  const worldX = (mouseX - offsetX) / scale;
  const worldY = (mouseY - offsetY) / scale;

  const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
  const newScale = scale * zoomFactor;

  if (newScale >= MIN_ZOOM && newScale <= MAX_ZOOM) {
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;
    const wx = (mouseX - offsetX) / scale;
    const wy = (mouseY - offsetY) / scale;

    scale = newScale;

    offsetX = mouseX - wx * scale;
    offsetY = mouseY - wy * scale;

    draw();
  }


  offsetX = mouseX - worldX * scale;
  offsetY = mouseY - worldY * scale;

  draw();
});

// Drag to pan
canvas.addEventListener("mousedown", (e) => {
  isDragging = true;
  dragStart = { x: e.clientX, y: e.clientY };
});

canvas.addEventListener("mousemove", (e) => {
  if (isDragging) {
    offsetX += e.clientX - dragStart.x;
    offsetY += e.clientY - dragStart.y;
    dragStart = { x: e.clientX, y: e.clientY };
    draw();
  }
  else {
    mouseX = e.offsetX;
    mouseY = e.offsetY;

    const [wx, wy] = screenToWorld(mouseX, mouseY);
    hoveredRegion = null;

    for (const [name, coords] of Object.entries(regions).reverse()) {
      const poly = new Path2D();
      const [startX, startY] = worldToScreen(...coords[0]);
      poly.moveTo(startX, startY);
      for (const [x, y] of coords.slice(1)) {
        const [sx, sy] = worldToScreen(x, y);
        poly.lineTo(sx, sy);
      }
      poly.closePath();

      if (ctx.isPointInPath(poly, mouseX, mouseY)) {
        hoveredRegion = name;
        break;
      }
    }
    draw();
  }
});

canvas.addEventListener("mouseup", () => {
  isDragging = false;
});
canvas.addEventListener("mouseleave", () => {
  isDragging = false;
});

document.getElementById("toggleNames").addEventListener("click", () => {
  showNames = !showNames;
  dynamicFont = showNames;
  draw();
});

resizeCanvas();
