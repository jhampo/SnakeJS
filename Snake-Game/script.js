const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
// Tutorial: https://youtu.be/Sl6YUIvwbAk

const menu = document.querySelector(".menu");
const score = document.querySelector(".score");
const canvas2 = document.getElementById("snake-1");
const canvas3 = document.getElementById("snake-2");

const ctx2 = canvas2.getContext("2d");
const ctx3 = canvas3.getContext("2d");

canvas2.width = 190;
canvas2.height = 80;
canvas3.width = 190;
canvas3.height = 80;
canvas.width = 650;
canvas.height = 380;

let play = false;
let scoreP = 0;
//YT: jhampier_
class Apple{
    constructor(position,radio,color,context){
        this.position = position;
        this.radio = radio;
        this.color = color;
        this.context = context;
    }
    draw(){
        this.context.save();
        this.context.beginPath();
        this.context.arc(this.position.x,this.position.y,this.radio,0,2*Math.PI);
        this.context.fillStyle = this.color;
        this.context.shadowColor = this.color;
        this.context.shadowBlur = 10;
        this.context.fill();
        this.context.closePath(); 
        this.context.restore();
    }
    collision(snake){
        let v1 = {
            x:this.position.x - snake.position.x,
            y:this.position.y - snake.position.y
        }
        let distance = Math.sqrt(
            (v1.x*v1.x) + (v1.y*v1.y)
        );

        if(distance < snake.radio+this.radio){
           this.position = {
                x: Math.floor(Math.random() *
                     ((canvas.width-this.radio) - this.radio + 1)) + this.radio,
                y: Math.floor(Math.random() *
                     ((canvas.height-this.radio) - this.radio + 1)) + this.radio,
           }
           snake.createBody();
           scoreP++;
           score.textContent = scoreP;
        }
    }
}
class SnakeBody{
    constructor(radio,color,context,path){
        this.radio = radio;
        this.color = color;
        this.context = context;
        this.path = path;
        this.transparency = 1;
    }
    drawCircle(x,y,radio,color){
        this.context.save();
        this.context.beginPath();
        this.context.arc(x,y,radio,0,2*Math.PI);
        this.context.fillStyle = color;
        this.context.globalAlpha = this.transparency;
        this.context.shadowColor = this.color;
        this.context.shadowBlur = 10;
        this.context.fill();
        this.context.closePath();
        this.context.restore();
    }
    draw(){
        this.drawCircle(this.path.slice(-1)[0].x,this.path.slice(-1)[0].y,
            this.radio,this.color);
    }
}
class Snake{
    constructor(position,radio,color,velocity,length,pathLength,context){
        this.position = position;
        this.radio = radio;
        this.color = color;
        this.velocity = velocity;
        this.context = context;
        this.rotation = 0;
        this.transparency = 1;
        this.body = [];
        this.isDeath = false;
        this.length = length;
        this.pathLength = pathLength;
        this.keys = {
            A:false,
            D:false,
            enable: true
        }
        this.keyboard();
    }
    initBody(){
        for(let i=0; i<this.length; i++){
            let path = [];
            for(let k=0; k<this.pathLength; k++){
                path.push({
                    x:this.position.x,
                    y:this.position.y
                });
            }
            this.body.push(new SnakeBody(this.radio,this.color,this.context,path)); 
        }
    }
    createBody(){
        let path = [];
        for(let k=0; k<this.pathLength; k++){
            path.push({
                x:this.body.slice(-1)[0].path.slice(-1)[0].x,
                y:this.body.slice(-1)[0].path.slice(-1)[0].y
            });
        }
        this.body.push(new SnakeBody(this.radio,this.color,this.context,path)); 

        if(this.pathLength < 8){
            this.body.push(new SnakeBody(this.radio,this.color,this.context,[...path]));
            this.body.push(new SnakeBody(this.radio,this.color,this.context,[...path]));
            this.body.push(new SnakeBody(this.radio,this.color,this.context,[...path])); 
        }
    }
    drawCircle(x,y,radio,color,shadowColor){
        this.context.save();
        this.context.beginPath();
        this.context.arc(x,y,radio,0,2*Math.PI);
        this.context.fillStyle = color;
        this.context.globalAlpha = this.transparency;
        this.context.shadowColor = shadowColor;
        this.context.shadowBlur = 10;
        this.context.fill();
        this.context.closePath();
        this.context.restore();
    }
    drawHead(){
        this.drawCircle(this.position.x,this.position.y,this.radio,this.color,this.color);
        
        this.drawCircle(this.position.x,this.position.y-9,this.radio-4,"white","transparent");
        this.drawCircle(this.position.x+1,this.position.y-9,this.radio-6,"black","transparent");
        this.drawCircle(this.position.x+3,this.position.y-8,this.radio-9,"white","transparent");

        this.drawCircle(this.position.x,this.position.y+9,this.radio-4,"white","transparent");
        this.drawCircle(this.position.x+1,this.position.y+9,this.radio-6,"black","transparent");
        this.drawCircle(this.position.x+3,this.position.y+8,this.radio-9,"white","transparent");

    }
    drawBody(){
        this.body[0].path.unshift({
            x:this.position.x,
            y:this.position.y
        });
        this.body[0].draw();

        for(let i = 1; i<this.body.length; i++){
            this.body[i].path.unshift(this.body[i-1].path.pop());
            this.body[i].draw();
        }
        this.body[this.body.length-1].path.pop();
    }
    draw(){
        this.context.save();

        this.context.translate(this.position.x,this.position.y);
        this.context.rotate(this.rotation);
        this.context.translate( -this.position.x, -this.position.y);
        this.drawHead();

        this.context.restore();
    }
    update(){
        if(this.isDeath){
            this.transparency -= 0.02;
            if(this.transparency<=0){
                play = false;
                menu.style.display = "flex";
                return;
            }
        }

        this.drawBody();
        this.draw();
        if(this.keys.A && this.keys.enable ){
            this.rotation -=0.04;
        }
        if(this.keys.D && this.keys.enable){
            this.rotation += 0.04;
        }
        this.position.x += Math.cos(this.rotation)*this.velocity;
        this.position.y += Math.sin(this.rotation)*this.velocity;

        this.collision();
    }
    collision(){
        if(this.position.x-this.radio <= 0 ||
            this.position.x+this.radio >= canvas.width ||
            this.position.y-this.radio <= 0 ||
            this.position.y+this.radio >= canvas.height){

            this.death();
        }
    }
    death(){
        this.velocity = 0;
        this.keys.enable = false;
        this.isDeath = true;
        this.body.forEach((b)=>{
            let lastItem = b.path[b.path.length-1];
            for(let i = 0;i < b.path.length; i++){
                b.path[i] = lastItem;
            }
            b.transparency = this.transparency;
        });
    }
    drawCharacter(){
        for(let i= 1; i<= this.length; i++){
            this.drawCircle(
                this.position.x - (this.pathLength*this.velocity*i),
                this.position.y, this.radio,this.color,this.color
            );
        }
        this.drawHead();
    }
    keyboard(){
        document.addEventListener("keydown",(evt)=>{
            if(evt.key == "a" || evt.key == "A"){
                this.keys.A = true;
            }
            if(evt.key == "d" || evt.key == "D"){
                this.keys.D = true;
            }
        });
        document.addEventListener("keyup",(evt)=>{
            if(evt.key == "a" || evt.key == "A"){
                this.keys.A = false;
            }
            if(evt.key == "d" || evt.key == "D"){
                this.keys.D = false;
            }
        });
    }
}
const snake = new Snake({x:200,y:200},11,"#FEBA39",1.5,3,12,ctx);
snake.initBody();
const snakeP1 = new Snake({x:165,y:40},11,"#FEBA39",1.5,8,12,ctx2);
snakeP1.initBody();
snakeP1.drawCharacter();
const snakeP2 = new Snake({x:165,y:40},11,"#88FC03",1.5,24,4,ctx3);
snakeP2.initBody();
snakeP2.drawCharacter();
const apple = new Apple({x:300,y:300},8,"red",ctx);

canvas2.addEventListener("click",()=>{
    init(3,12,"#FEBA39");
});
canvas3.addEventListener("click",()=>{
    init(8,4,"#88FC03");
});
function init(length,pathLength,color){
    snake.body.length = 0;
    snake.color = color;
    snake.length = length;
    snake.pathLength = pathLength;
    snake.position = {x:200,y:200};
    snake.isDeath = false;
    snake.velocity = 1.5;
    snake.transparency = 1;
    snake.initBody();
    snake.keys.enable = true;
    play = true;
    menu.style.display = "none";
    scoreP = 0;
    score.textContent = scoreP;
}
function background(){
    ctx.fillStyle = "#1B1C30"
    ctx.fillRect(0,0,canvas.width,canvas.height);
    for(let i=0; i<canvas.height; i+=80){
        for(let j=0; j<canvas.width; j+=80){
            ctx.fillStyle = "#23253C";
            ctx.fillRect(j+10,i+10,70,70);
        }
    }
}

function update(){
    background();
    if(play){
        snake.update();
        apple.draw();
        apple.collision(snake);
    }
    requestAnimationFrame(update);
}
update();

