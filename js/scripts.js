const { sin, cos, PI, sqrt, abs, floor, random, round, tan, pow, sign, ceil } = Math

var canvas2 = document.createElement("canvas");
var ctx2 = canvas2.getContext("2d");

document.body.appendChild(canvas2);

var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");

document.body.appendChild(canvas);


var img = new Image();
img.crossOrigin = "Anonymous";
// img.src = 'img/abstract1.jpeg';
// img.src = 'img/teletttt.jpg';
// img.src = 'img/cow.jpg';
// img.src = 'img/_meh3.jpg';
// img.src = 'img/test1.jpg';
// img.src = 'img/eeeeee123123png.png';
img.src = 'img/window1.png';
// img.src = 'img/ava.png';
//canvas.style.height=img.height+"px";
//canvas.style.width=img.width+"px";

var hh = img.height;
var ww = img.width;



img.onload = function () {
    canvas2.setAttribute("height", hh);
    canvas2.setAttribute("width", ww);
    ctx2.drawImage(img, 0, 0);

    canvas.setAttribute("height", hh);
    canvas.setAttribute("width", ww);

    run();
}

img.onerror = function (e) {
    console.log("Not ok", e);
}

function roundNumberByBase(n, m) {
    return n - n % m;
}

const organizeImageData = (imageData) => {

    let organisedData = []
    let dataRow = []
    for (let y = 0; y < hh; y++) {
        for (let x = 0; x < ww * 4; x += 4) {
            dataRow.push({
                r: imageData[y * ww * 4 + x],
                g: imageData[y * ww * 4 + x + 1],
                b: imageData[y * ww * 4 + x + 2],
                a: imageData[y * ww * 4 + x + 3],
            })
        }
        organisedData.push(dataRow)
        dataRow = []
    }
    return organisedData
}

const distance2D = (v1, v2) => {
    return (sqrt(pow((v1.x - v2.x), 2) + pow((v1.y - v2.y), 2)))
}


const distance3D = (v1, v2) => {
    return (sqrt(pow((v1.x - v2.x), 2) + pow((v1.y - v2.y), 2) + pow((v1.z - v2.z), 2)))
}

const smoothStep = (x) => { //Normal smoothstep
    return -2 * pow(x, 3) + 3 * pow(x, 2);
    //I know about x * x * (3 - 2 * x);
}

const colorModF = (c1, c2, a) => {
    // return abs(round(smoothStep((c1 + c2) / (2 * 255)) * 255))
    // return abs(round(smoothStep((sin((c1 * c2 + a) * 0.0001) + 1) / 2)) * 255)
    // return round((c1 + c2) / 2)
    // return round(c1 - (c1 - c2) / 2)
    return c2
}

const pointOfInterest = {
    x: ww/2 + 300,
    y: hh/2 + 4
}

const colorToAlpha = (imageData, colorToCheck, distanceThreshold) => {

    const processedData = JSON.parse(JSON.stringify(imageData))
    let t = 0
    for (let y = 0; y < processedData.length; y++) {
        let dataRow = processedData[y]
        for (let x = 0; x < dataRow.length; x++) {
            t += 1
            let { r, g, b } = imageData[y][x]
            let distanceToCenter = distance2D({ x, y }, { x: ww / 2, y: hh / 2 })
            let distanceToInterest = pow(distance2D({ x, y }, pointOfInterest) / 5000, 3)
            let colorDistance = distance3D(
                { x: r, y: g, z: b },
                // {x:101, y:64, z:56},
                // {x:7, y:2, z:0}
                // { x: 0, y: 0, z: 0 }
                { x: colorToCheck.r, y: colorToCheck.g, z: colorToCheck.b }
            )

            if (colorDistance < distanceThreshold) {
                processedData[y][x].a = 0
            }


        }

    }
    return processedData
}

const modifyNonZeroOpacity = (imageData) => {

    const processedData = JSON.parse(JSON.stringify(imageData))
    let t = 0
    console.log(processedData[0][0].a)
    for (let y = 0; y < processedData.length; y++) {
        let dataRow = processedData[y]
        for (let x = 0; x < dataRow.length; x++) {
            t += 1
            let { r, g, b, a } = imageData[y][x]
            if (a < 255) {
                processedData[y][x].a += 150
            }
            if (processedData[y][x].a > 255) {
                processedData[y][x].a = 255
            }


        }

    }
    return processedData
}

const processData = (imageData) => {

    const processedData = JSON.parse(JSON.stringify(imageData))
    let t = 0
    for (let y = 0; y < processedData.length; y++) {
        let dataRow = processedData[y]
        for (let x = 0; x < dataRow.length; x++) {
            t += 1
            let { r, g, b } = imageData[y][x]
            let distanceToCenter = distance2D({ x, y }, { x: ww / 2, y: hh / 2 })
            let distanceToInterest = pow(distance2D({ x, y }, pointOfInterest) / 5000, 3)
            let colorDistance = distance3D(
                { x: r, y: g, z: b },
                // {x:101, y:64, z:56},
                // {x:7, y:2, z:0}
                // { x: 0, y: 0, z: 0 }
                { x: 240, y: 240, z: 240 }
            )
            // let direction = sin((distanceToCenter) / (hh)) * PI * 2
            let direction = sin(
                // (imageData[y][x].r + imageData[y][x].g + imageData[y][x].b) / (255 * 3) * 
                // 0.0001*t
                // + colorDistance
                // + ((x + y))*colorDistance * 1
                
                t*1010
            ) * 20 * PI
            // direction = colorDistance
            // let walkDistance = 1
            // walkDistance = sin((x*y)*colorDistance / 10000000) * 100
            
            walkDistance = (sin(
                2 * PI * sin(t)
            )+ 1) * 20000 * distanceToInterest

            let rDiff = 1.3
            let gDiff = 1.5
            let bDiff = 1.8

            let newYR = round(y + rDiff * walkDistance * sin(direction))
            let newXR = round(x + rDiff * walkDistance * cos(direction))

            let newYG = round(y + gDiff * walkDistance * sin(direction))
            let newXG = round(x + gDiff * walkDistance * cos(direction))

            let newYB = round(y + bDiff * walkDistance * sin(direction))
            let newXB = round(x + bDiff * walkDistance * cos(direction))

            newYR = abs(newYR) % (processedData.length)
            newXR = abs(newXR) % (dataRow.length)
            newYG = abs(newYG) % (processedData.length)
            newXG = abs(newXG) % (dataRow.length)
            newYB = abs(newYB) % (processedData.length)
            newXB = abs(newXB) % (dataRow.length)

            let diverseByPoint = sin(x+y+t) * 1.1

            processedData[y][x].r = colorModF(processedData[y][x].r, imageData[newYR][newXR].r, diverseByPoint)
            processedData[y][x].g = colorModF(processedData[y][x].g, imageData[newYG][newXG].g, diverseByPoint)
            processedData[y][x].b = colorModF(processedData[y][x].b, imageData[newYB][newXB].b, diverseByPoint)


        }

    }
    return processedData
}

function reDraw() {
    var imD0 = ctx2.getImageData(0, 0, ww, hh);
    var indF = 0;
    var arg = 0;
    var indF2 = 0;
    var arg2 = 0;
    var indF3 = 0;
    var arg3 = 0;
    var counter = 0;

    let organisedData = organizeImageData(imD0.data)
    // const processedData = processData(organisedData)
    // const processedData = colorToAlpha(organisedData, {r: 221, g: 208, b: 214}, 40)
    const processedData = modifyNonZeroOpacity(organisedData)
    for (let y = 0; y < processedData.length; y++) {
        let dataRow = processedData[y]
        for (let x = 0; x < dataRow.length; x++) {
            let colorPoint = dataRow[x]
            imD0.data[y * ww * 4 + x * 4] = colorPoint.r; // red
            imD0.data[y * ww * 4 + x * 4 + 1] = colorPoint.g; // green
            imD0.data[y * ww * 4 + x * 4 + 2] = colorPoint.b; // blue
            imD0.data[y * ww * 4 + x * 4 + 3] = colorPoint.a; // alpha
        }

    }
    ctx.putImageData(imD0, 0, 0);
}

function run() {
    reDraw()
}
