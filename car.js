class Car{
    constructor(x, y, width, height, controlType, maxspeed=3, accelaration=0.2, friction=0.05){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = 0;
        this.accelaration = 0.2;
        this.maxspeed = maxspeed;
        this.friction = 0.05;
        this.angle = 0;
        this.traffic = this.traffic;
        this.damaged = false;
        this.useBrain = controlType =="AI";
        if (controlType != "DUMMY"){
            this.sensor = new Sensor(this);
            this.brain = new NeuralNetwork(
                [this.sensor.rayCount,6,4]);
        }
        this.controlls = new Controlls(controlType);
        
        
    }

    
     
    update(roadBorders, traffic){
        if (!this.damaged){
            this.#move();
            this.polygon = this.#createPolygon();
            this.damaged = this.assessDamage(roadBorders, traffic);
        }
        if (this.sensor){
            this.sensor.update(roadBorders, traffic);
            const offsets=this.sensor.readings.map(
                s=>s==null?0:1-s.offset
            );
            const outputs = NeuralNetwork.feedForward(offsets, this.brain);
            if (this.useBrain){
                this.controlls.forward = outputs[0];
                this.controlls.left = outputs[1];
                this.controlls.right = outputs[2];
                this.controlls.reverse = outputs[3];
        }

        }
        
}

    #createPolygon(){
        const points=[];
        const rad=Math.hypot(this.width,this.height)/2;
        const alpha=Math.atan2(this.width,this.height);
        points.push({
            x:this.x-Math.sin(this.angle-alpha)*rad,
            y:this.y-Math.cos(this.angle-alpha)*rad
        });
        points.push({
            x:this.x-Math.sin(this.angle+alpha)*rad,
            y:this.y-Math.cos(this.angle+alpha)*rad
        });
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle-alpha)*rad,
            y:this.y-Math.cos(Math.PI+this.angle-alpha)*rad
        });
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle+alpha)*rad,
            y:this.y-Math.cos(Math.PI+this.angle+alpha)*rad
        });
        return points;
    }

    assessDamage(roadBorders, traffic){
        for(let i=0; i<roadBorders.length; i++){
            if (polyIntersect(this.polygon, roadBorders[i])){
                return true;
            }
        }
            for(let i=0; i<traffic.length; i++){
                if (polyIntersect(this.polygon, traffic[i].polygon)){
                    return true;
                }
        }
    return false;
    }

    #move(){
        if(this.controlls.forward){
            this.speed += this.accelaration;
        }
        if(this.controlls.reverse){
            this.speed -= this.accelaration;
        }
        if(this.speed > this.maxspeed){
            this.speed = this.maxspeed;
        }
        if (this.speed < -this.maxspeed/2){
            this.speed = -this.maxspeed/2;
        }

        if (this.speed > 0) {
            this.speed -= this.friction;
        }
        if (this.speed < 0) {
            this.speed += this.friction;
        }

        if (Math.abs(this.speed) < this.friction) {
            this.speed = 0;
        }

        if (this.speed != 0) {
            const flip = this.speed > 0 ? 1 : -1;
            if (this.controlls.right){
                this.angle -= 0.03 * flip;
            }
            if (this.controlls.left){
                this.angle += 0.03 * flip;
            }
        }

        this.x -= Math.sin(this.angle) * this.speed;
        this.y -= Math.cos(this.angle) * this.speed;
    }

    draw(ctx, color, drawSensor=false){
        if(this.damaged){
            ctx.fillStyle="red";
        }else{
            ctx.fillStyle=color;
        }
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
        for (let i=1; i < this.polygon.length; i++){
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
        }
        ctx.fill();
        if (this.sensor && drawSensor){
            this.sensor.draw(ctx);
        }

    }
}
