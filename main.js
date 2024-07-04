const carCanvas=document.getElementById("carCanvas");
carCanvas.width=200;
const networkCanvas=document.getElementById("networkCanvas");
networkCanvas.width=300;
const playerCanvas=document.getElementById("playerCanvas");
playerCanvas.width=200;


const playerCtx= playerCanvas.getContext("2d");
const AICTX = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

CANVAS_HEIGHT = window.innerHeight;


const road=new Road(carCanvas.width/2,carCanvas.width*0.9);
const road1=new Road(playerCanvas.width/2,playerCanvas.width*0.9);

const playerCar = new Car(road1.getLaneCenter(0),600,30,50,"KEYS");

const cars= generateCars(100);
let bestCar=cars[0];
if (localStorage.getItem("bestBrain")){
    for(let i=0;i<cars.length;i++){
        cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
    
    if (i != 0) {
        NeuralNetwork.mutate(cars[i].brain, 0.2);
    }
}
}
const traffic=generateTraffic(20);

const traffic2=generateTraffic2(20);

animate();

function save(){
    localStorage.setItem("bestBrain",
        JSON.stringify(bestCar.brain));
}

function discard(){
    localStorage.removeItem("bestBrain");
}

function generateTraffic(n){
    let traffic=[];
    for(let i=0;i<n;i++){
        traffic.push(new Car(
            road.getLaneCenter(Math.ceil(Math.random()* 5) - 1),
            Math.random() * -1000,
            30, 
            50,
            "DUMMY",
            2
        ));
    }
    return traffic;
}

function generateTraffic2(n){
    let traffic=[];
    for(let i=0;i<n;i++){
        traffic.push(new Car(
            road1.getLaneCenter(Math.ceil(Math.random()* 5) - 1),
            Math.random() * -1000,
            30, 
            50,
            "DUMMY",
            2
        ));
    }
    return traffic;
}



function generateCars(n){
    let cars=[];
    const num = Math.random() * 4;
    for(let i=0;i<n;i++){
        cars.push(new Car(
            road.getLaneCenter(num),
            600,
            30,
            50,
            "AI"
        ));
       
    }
    return cars;
}

function animate(time){
    traffic.forEach(car => car.update(road.borders, []));
    traffic2.forEach(car => car.update(road1.borders, []));
    cars.forEach(car => car.update(road.borders, traffic));

    bestCar = cars.reduce((best, car) => car.y < best.y ? car : best, cars[0]);
    playerCar.update(road1.borders, traffic2);

    carCanvas.height = CANVAS_HEIGHT;
    networkCanvas.height = CANVAS_HEIGHT;
    playerCanvas.height = CANVAS_HEIGHT;

    playerCtx.save();
    playerCtx.translate(0, -playerCar.y + carCanvas.height * 0.7);
    AICTX.save();
    AICTX.translate(0, -bestCar.y + carCanvas.height * 0.7);

    road1.draw(playerCtx);
    road.draw(AICTX);
    
    traffic.forEach(car => car.draw(AICTX, "green"));
    traffic2.forEach(car => car.draw(playerCtx, "green"));

    AICTX.globalAlpha = 0.2;
    cars.forEach(car => car.draw(AICTX, "blue"));
    AICTX.globalAlpha = 1;

    bestCar.draw(AICTX, "blue", true);
    playerCar.draw(playerCtx, "blue", true);

    AICTX.restore();
    playerCtx.restore();

    networkCtx.lineDashOffset = -time / 50;
    Visualizer.drawNetwork(networkCtx, bestCar.brain);

    requestAnimationFrame(animate);
}