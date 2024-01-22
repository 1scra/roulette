var options = [
    { src: '1.jpg', title: '1 Margherita' },
    { src: 'img2.png', title: '1 Boison' },
    { src: 'img3.png', title: '1 Tiramisu' },
    { src: 'img4.png', title: '4 Tenders' },
    { src: 'img4.png', title: '1 Muffin' },
    // ... Ajoutez autant d'images que nécessaire avec les titres correspondants
];

var startAngle = 0;
var arc = Math.PI / (options.length / 2);
var spinTimeout = null;

var ctx;

document.getElementById("spin").addEventListener("click", spin);

function byte2Hex(n) {
    var nybHexString = "0123456789ABCDEF";
    return String(nybHexString.substr((n >> 4) & 0x0F, 1)) + nybHexString.substr(n & 0x0F, 1);
}

function RGB2Color(r, g, b) {
    return '#' + byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
}

function getColor(item, maxitem) {
    var phase = 0;
    var center = 128;
    var width = 127;
    var frequency = Math.PI * 2 / maxitem;

    red = Math.sin(frequency * item + 2 + phase) * width + center;
    green = Math.sin(frequency * item + 0 + phase) * width + center;
    blue = Math.sin(frequency * item + 4 + phase) * width + center;

    return RGB2Color(red, green, blue);
}

function drawRouletteWheel() {
    var canvas = document.getElementById("canvas");
    if (canvas.getContext) {
        var outsideRadius = 200;
        var textRadius = 160;
        var insideRadius = 125;

        ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, 500, 500);

        // Ajouter une ombre à la roue
        ctx.shadowOffsetX = 0; // Décalage horizontal de l'ombre
        ctx.shadowOffsetY = 6; // Décalage vertical de l'ombre
        ctx.shadowBlur = 14; // Flou de l'ombre
        ctx.shadowColor = "rgba(0, 0, 0, 0.2)"; // Couleur de l'ombre

        ctx.strokeStyle = "#fff"; // Couleur de la bordure
        ctx.lineWidth = 2;

        ctx.font = 'bold 14px "Segoe UI", Tahoma, Geneva, Verdana, sans-serif'; // Police du texte

        for (var j = 0; j < options.length; j++) {
            var angle = startAngle + j * arc;

            // Utiliser une version de rouge pour le fond
            ctx.fillStyle = "#e2001a";

            ctx.beginPath();
            ctx.arc(250, 250, outsideRadius, angle, angle + arc, false);
            ctx.arc(250, 250, insideRadius, angle + arc, angle, true);
            ctx.stroke();
            ctx.fill();

            ctx.save();
            ctx.shadowOffsetX = -1;
            ctx.shadowOffsetY = -1;
            ctx.shadowBlur = 5;
            ctx.shadowColor = "rgba(0, 0, 0, 0)";
            ctx.fillStyle = "#000"; // Couleur du texte
            ctx.translate(250 + Math.cos(angle + arc / 2) * textRadius,
                250 + Math.sin(angle + arc / 2) * textRadius);
            ctx.rotate(angle + arc / 2 + Math.PI / 2);

            var img = new Image();
            img.src = options[j].src;
            ctx.drawImage(img, -20, -20, 40, 40); // Taille de l'image

            // Ajouter le titre correspondant
            ctx.font = 'bold 12px "Segoe UI", Tahoma, Geneva, Verdana, sans-serif'; // Police du texte
            ctx.fillText(options[j].title, -ctx.measureText(options[j].title).width / 2, 55); // Position du titre

            ctx.restore();
        }

        ctx.fillStyle = "#333"; // Couleur du triangle
        ctx.beginPath();
        ctx.moveTo(250 - 4, 250 - (outsideRadius + 5));
        ctx.lineTo(250 + 4, 250 - (outsideRadius + 5));
        ctx.lineTo(250 + 4, 250 - (outsideRadius - 5));
        ctx.lineTo(250 + 9, 250 - (outsideRadius - 5));
        ctx.lineTo(250 + 0, 250 - (outsideRadius - 13));
        ctx.lineTo(250 - 9, 250 - (outsideRadius - 5));
        ctx.lineTo(250 - 4, 250 - (outsideRadius - 5));
        ctx.lineTo(250 - 4, 250 - (outsideRadius + 5));
        ctx.fill();
    }
}

function spin() {
    var spinAngleStart = Math.random() * 10 + 10;
    var spinTime = 0;
    var spinTimeTotal = Math.random() * 3 + 4 * 1000;
    rotateWheel(spinAngleStart, spinTime, spinTimeTotal);
}

function rotateWheel(spinAngleStart, spinTime, spinTimeTotal) {
    spinTime += 30;
    if (spinTime >= spinTimeTotal) {
        stopRotateWheel();
        return;
    }
    var spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
    startAngle += (spinAngle * Math.PI / 180);
    drawRouletteWheel();
    spinTimeout = setTimeout(function() { rotateWheel(spinAngleStart, spinTime, spinTimeTotal); }, 30);
}

function stopRotateWheel() {
    clearTimeout(spinTimeout);
    var degrees = startAngle * 180 / Math.PI + 90;
    var arcd = arc * 180 / Math.PI;
    var index = Math.floor((360 - degrees % 360) / arcd);
    ctx.save();
    ctx.font = 'bold 24px "Segoe UI", Tahoma, Geneva, Verdana, sans-serif'; // Police du texte
    var text = options[index].title;
    ctx.fillText(text, 250 - ctx.measureText(text).width / 2, 250 + 10);
    ctx.restore();
}

function easeOut(t, b, c, d) {
    var ts = (t /= d) * t;
    var tc = ts * t;
    return b + c * (tc + -3 * ts + 3 * t);
}

drawRouletteWheel();