var deltaTime = 10;
var lastTime = 0;

/*
* "Engine"
*/
class Vector{
	constructor(x,y){
		if(isNaN(x) || isNaN(y)){
			console.error("NaN in vector declaration: [" +x+","+y+"]"  );
		}else{
		this.x=x;
		this.y=y;	
		}
		
	}
	toString(){
		return "[" + this.x + "," +this.y+"]";
	}
	vezes(m){
		return new Vector(this.x*m,this.y*m);
	}
	sum(){
		return this.x + this.y;
	}
	plus(other){
		return new Vector(this.x + other.x, this.y + other.y);
	}
	distance(other){
		return Math.sqrt(Math.pow((other.x - this.x),2) + Math.pow((other.y - this.y),2) );
	}
	equals(other){
		return (this.x == other.x && this.y == other.y);
	}
}


class Visual{
	constructor(id){
		this.canvas = document.getElementById(id);
		console.log(this.canvas);
		this.ctx = this.canvas.getContext("2d");
		this.queue = [];

		this.ctx.font = "30px Arial";

	}
	texto(txt, pos = new Vector(0,0), scale = 30){
		var obj = {tipo:VisualObjectTypes.texto,text:txt, position:pos, scale:scale};
		this.queue.push(obj);
	}
	retangulo(pos = new Vector(0,0), scale=new Vector(1,1), color="white", bordas=true ){
		var obj = {tipo:VisualObjectTypes.retangulo, position:pos, scale:scale, color:color, bordas:bordas};
		this.queue.push(obj);
	}
	linha(start, end, scale = 1, color="black"){
		var obj = {tipo:VisualObjectTypes.linha, start:start, end:end, scale:scale, color:color};
		this.queue.push(obj);
	}
	sprite(img,pos=new Vector(0,0),scale = new Vector(1,1)){
		var obj = {tipo:VisualObjectTypes.sprite,img:img, position:pos, scale:scale};
		this.queue.push(obj);	
	}
	gradient(pos = new Vector(0,0), scale = new Vector(1,1), color1="black", color2="white"){
		var obj = {tipo:VisualObjectTypes.gradient, position:pos, scale:scale, color1:color1, color2:color2 };
		this.queue.push(obj);
	}
	clearQueue(){
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.queue = [];
	}
	drawQueue(){
		for (var i = 0; i < this.queue.length; i++) {
			if(this.queue[i].tipo == VisualObjectTypes.texto){
				this.ctx.fillStyle = "black";
				this.ctx.fillText(this.queue[i].text, this.queue[i].position.x, this.queue[i].position.y + this.queue[i].scale);
				this.madeStrings++;
			}
			else if(this.queue[i].tipo == VisualObjectTypes.retangulo){
				this.ctx.beginPath(); 

				this.ctx.fillStyle = this.queue[i].color;
				this.ctx.fillRect(this.queue[i].position.x,this.queue[i].position.y,this.queue[i].scale.x,this.queue[i].scale.y);
				this.ctx.fillStyle = "black";
				if(this.queue[i].bordas){
					this.ctx.rect(this.queue[i].position.x,this.queue[i].position.y,this.queue[i].scale.x,this.queue[i].scale.y);
					this.ctx.stroke();
					
				}
				
			}
			else if(this.queue[i].tipo == VisualObjectTypes.linha){
				this.ctx.strokeStyle = this.queue[i].color;
				
				this.ctx.beginPath(); 
   				this.ctx.moveTo(this.queue[i].start.x,this.queue[i].start.y);
  				this.ctx.lineTo(this.queue[i].end.x,this.queue[i].end.y);
  				this.ctx.stroke();
				this.ctx.strokeStyle = "black";

			}
			else if(this.queue[i].tipo == VisualObjectTypes.sprite){
				//console.log(this.queue[i].img);

				this.ctx.drawImage(this.queue[i].img, this.queue[i].position.x,this.queue[i].position.y, this.queue[i].scale.x, this.queue[i].scale.y);
			}
			else if(this.queue[i].tipo == VisualObjectTypes.gradient){
				// Create gradient
				var grd = this.ctx.createLinearGradient(this.queue[i].position.x, this.queue[i].position.y, this.queue[i].position.x, this.queue[i].position.y + this.queue[i].scale.y);
				grd.addColorStop(0, this.queue[i].color1);
				grd.addColorStop(1, this.queue[i].color2);

				// Fill with gradient
				this.ctx.fillStyle = grd;
				this.ctx.fillRect(this.queue[i].position.x, this.queue[i].position.y, this.queue[i].scale.x, this.queue[i].scale.y);
				this.ctx.fillStyle = "black";
			}
		}
	}
	scale(){
		return new Vector(this.canvas.width, this.canvas.height);
	}
	

}

const VisualObjectTypes = Object.freeze({"texto":1, "retangulo":2, "linha":3, "sprite":4, "gradient":5});





setTimeout(() => {  HiddenLoop(); }, 10);

function HiddenLoop() {
	deltaTime = new Date().getTime() - lastTime;
	lastTime = new Date().getTime();

	if(deltaTime > 1000){
		deltaTime = 10;
	}
	console.log(deltaTime);
	
	Update();

	setTimeout(() => {  HiddenLoop(); }, 1);
}




/*
* Input Section
* Reultilizavel!
*/

var pressedKeys = []; 

window.addEventListener("keydown", function (e) {
	//tested in IE/Chrome/Firefox
	var key = e.key.toLowerCase();
	if(!pressedKeys.includes(key)){
  		pressedKeys.push(key);
  	}
})
window.addEventListener("keyup", function (e) {
	//tested in IE/Chrome/Firefox
	var key = e.key.toLowerCase();

  	if(pressedKeys.includes(key)){
  		//remove key from array
  		var index = pressedKeys.indexOf(key);
		if (index > -1) {
  			pressedKeys.splice(index, 1);
		}
  	}
})
function GetKey(key){
	return pressedKeys.includes(key.toLowerCase());
}




/*
*
*	Game code
*
*/


class Navigation{
	constructor(x,y){
		if(isNaN(x) || isNaN(y)){
			console.error("NaN in vector declaration: [" +x+","+y+"]"  );
		}else{
		this.x=x;
		this.y=y;	
		}
		
	}
	toString(){
		return "[" + this.x + "," +this.y+"]";
	}
}

var playerPos = new Vector(20,10);

var playerHeight = 0;

var playerAngle = 0;

var rotationSpeed = 0.15;
var movementSpeed = 0.02;

var miniMapSize = 150;
var miniMapPos = new Vector(830,10);



var screen = new Visual("mainCanvas");
var miniMap = new Visual("secondaryCanvas");

var mapWidth = 30;
var fieldScale = 100;


//gerado por paint.html
var walls = getOcorrencias(mapWidth,1, "000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000011000000000000111100000000000001100000000000000000000000000000110000000000000000000000000000011000000000000000000000000000001100000000000000000000000000000110000000100000000000000000000010000000100000111111110000000000000000100000100000000000000000000000100000100000000000000000000000100000100000000000000000000000100000100000000000000000000000100000111111100000000000000000100000000000000000000000000000100000000000000000000000000000100000000000000000000000000000100000000000000000000000000000100000000111111111100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000001000000000000000000000000000001000000000011111111111100000001111110000000000000000111100000000000000000000000000000000");

console.log(walls);

var walkCicleStage = 0;
var isWalking = false;

var resolucao = 500;



function Update(){
	screen.clearQueue();

	miniMap.clearQueue();

	var dir = angleToDirection(playerAngle);


	if(GetKey("a")){
		playerAngle -= rotationSpeed*deltaTime;
		while(playerAngle < 0){
			playerAngle += 360;
		}
	}
	else if(GetKey("d")){
		playerAngle += rotationSpeed*deltaTime;
		while(playerAngle > 360){
			playerAngle -= 360;
		}
	}

	if(GetKey("n")){
		
	}

	//movimento
	if(GetKey("w") && Raycast(playerPos, angleToDirection(playerAngle),4) == 4){
		playerPos = playerPos.plus(dir.vezes(deltaTime * movementSpeed)); 
		isWalking = true;
	}
	else if(GetKey("s") && Raycast(playerPos, angleToDirection(playerAngle).vezes(-1),4) == 4){
		playerPos = playerPos.plus(dir.vezes(deltaTime * -movementSpeed)); 
		isWalking = true;
	}
	else{
		isWalking = false;
	}

	if(isWalking){
		walkCicleStage += 0.1*deltaTime;
		while(walkCicleStage > 360){
			walkCicleStage -= 360;
		}
		var h = Math.sin((walkCicleStage)*Math.PI/30)*10;
		playerHeight = h;
	}


	if(playerPos.x > 100){
		playerPos.x = 100;
	}
	else if(playerPos.x < 0){
		playerPos.x = 0;
	}
	if(playerPos.y > 100){
		playerPos.y = 100;
	}
	else if(playerPos.y < 0){
		playerPos.y = 0;
	}




	





	//skybox
	screen.gradient(new Vector(0,0 + (playerHeight/2) - screen.scale().y/2), new Vector(screen.scale().x, screen.scale().y), "#256cfa","#24a0ff");

	//floor
	screen.gradient(new Vector(0,screen.scale().y/2 + (playerHeight/2)), new Vector(screen.scale().x, screen.scale().y), "#3b3b3b","#bababa");
	

	//draw the walls
	var sight = GetSight(playerPos, playerAngle,60, true, resolucao);

	var step = screen.scale().x/sight.length;
	var minWallScale = 50;
	for (var i = 0; i < sight.length; i++) {
		var distance = 150-sight[i];
		var wallHeight = ((screen.scale().y - minWallScale)*distance/150)+minWallScale;
		if(wallHeight > 0){
			var n = (distance*255/150);
			var color = "rgba("+n+", "+n+", "+n+", 255)";
			screen.retangulo(new Vector(i*step, (screen.scale().y - wallHeight)/2 + playerHeight), new Vector(step+1, wallHeight), color, false);
		}
		//var wallHeight = screen.scale().y/(sight[i]+1);
		//screen.retangulo(new Vector(i*step, screen.scale().y/2 + wallHeight ),new Vector(step, wallHeight)); 
	}

	//fps counter
	screen.texto("fps:" + Math.trunc(1000/ deltaTime), new Vector(10,10));
	

	


	//Minimap
	//clear that space in the main
	screen.retangulo(new Vector(842,7), new Vector(150,150), "white");
	//draw the walls
	for (var i = 0; i < walls.length; i++) {
		miniMap.retangulo(walls[i].vezes(miniMapSize/mapWidth), new Vector(miniMapSize/mapWidth,miniMapSize/mapWidth) , "black",false );
	}
	//draw the player
	miniMap.retangulo(playerPos.vezes(miniMapSize/fieldScale), new Vector(4,4), "black",false);
	//console.log(playerPos +" - " + playerPos.vezes(miniMapSize/fieldScale));
	
	//screen.linha(playerPos, playerPos.plus(dir.vezes(100)));

	//miniMap.linha(new Vector(0,0), new Vector(0,0));

	screen.drawQueue();
	miniMap.drawQueue();
	
}



function angleToDirection(angle){
	var rad = AngleToRad(angle);
	return new Vector(Math.cos(rad), Math.sin(rad));
}

function getOcorrencias(size, identifier, strMap){
	var retorno = []; 
	for (var i = 0; i < strMap.length; i++) {
		if(strMap.charAt(i) == identifier){
			retorno.push(new Vector( i%size , ~~(i/size) ));
		}
	}
	return retorno;
}

function Raycast(origin, dir, maxDistance, drawLine = false){
	var step=0.5;
	var distance = 0;
	var retorno = maxDistance;
	for (distance = 0; distance < maxDistance; distance+= step) {
		
		var posInField = origin.plus(dir.vezes(distance));

		var posInMinimap = posInField.vezes(miniMapSize/fieldScale);

		var posInWallMap = posInField.vezes(mapWidth/fieldScale);
		posInWallMap = new Vector(~~posInWallMap.x,~~posInWallMap.y);

		if(posInWallMap.x < 0 || posInWallMap.x > mapWidth ||posInWallMap.y < 0 || posInWallMap.y > mapWidth){
			//is outside map

			//if u want outer walls, uncomment this
			//retorno = distance;

			distance = maxDistance;
		}
		for (var i = 0; i < walls.length; i++) {
			if(walls[i].equals(posInWallMap)){
				retorno = distance;
				distance = maxDistance;
			}
		}
	}
	if(drawLine){
		miniMap.linha(origin.vezes(miniMapSize/fieldScale), posInMinimap, 1, "red");
			//miniMap.retangulo(posInMinimap, new Vector(1,1), "red", false);			
		}
	return retorno;
}

function GetSight(cameraPos, cameraAngle, FOV, drawLine = true, qualidade = 600){
	var sight = [];
	var direcoes = [];
	var numDeRaios = qualidade;

	FOV = ~~(FOV/2);

	direcoes.push(cameraAngle);
	sight.push(Raycast(cameraPos, angleToDirection(cameraAngle), 200, drawLine));
	
	var step = FOV/numDeRaios;
	for (var i = step; i < FOV; i += step) {

		//dont draw all the rays, as it would be too expansive
		//Just one out of every 10
		var desenhar = (~~(i/step)%50 == 0);

		//add to right of view
		direcoes.push(cameraAngle + i);
		sight.push(Raycast(cameraPos, angleToDirection(cameraAngle+ i), 200, desenhar));
		
		//add to start left of view
		direcoes.push(cameraAngle - i);
		sight.unshift(Raycast(cameraPos, angleToDirection(cameraAngle- i), 200, desenhar));
	}
	return sight;


}

function floatMove(a,  b,  maxDelta) {
    var delta = b-a;
    if(delta>maxDelta){
    	delta = maxDelta;
    }
    else if(delta<-maxDelta){
    	delta = -maxDelta;
    }
    return a + delta;
}

function CorrectRayLengthDistortion( dist, angleFromCentre ){

    return dist * Math.cos( AngleToRad( angleFromCentre ) );
}

function AngleToRad(angle){
	return angle * Math.PI/180;
}