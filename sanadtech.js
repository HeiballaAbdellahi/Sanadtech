////////watch out of bugs////////
//  .--.       .--.            //
//  _  `    \     /    `  _    //
//   `\.===. \.^./ .===./`     //
//          \/`"`\/            // 
//       ,  | Bug |  ,         //
//      / `\|;-.-'|/` \        //
//     /    |::\  |    \       // 
//  .-' ,-'`|:::; |`'-, '-.    //
//      |   |::::\|   |        //
//      |   |::::;|   |        //
//      |   \:::://   |        // 
//      |    `.://'   |        // 
//     .'             `.       // 
//  _,'                 `,_    //
/////////////////////////////////

    document.getElementById("putSquare").style.backgroundColor = 'rgb(36, 35, 35)';
    var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');
//at the start
    let linked =false;//deactivate linking menue
    let placed =true;//activate placing menue
    //to activate linking function
    function toLink(){
        linked=true;
        placed=false;
        document.getElementById("toLink").style.backgroundColor = 'rgb(36, 35, 35)';
        document.getElementById("putSquare").style.backgroundColor = '#333';
        
    }
    //to activate putting funvtion
    function putSquare(){
        linked=false;
        placed=true;
        document.getElementById("putSquare").style.backgroundColor = 'rgb(36, 35, 35)';
        document.getElementById("toLink").style.backgroundColor = '#333';
    }
    //function to get the square of the position of the click
    function getSquare(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: 1 + (evt.clientX - rect.left) - (evt.clientX - rect.left)%10,
        y: 1 + (evt.clientY - rect.top) - (evt.clientY - rect.top)%10
    };
}
//link square function
function linkSquare(context, x, y){
    context.lineWidth = 4;
   context.strokeStyle = "#E50404"
   context.beginPath();
        context.moveTo(x, y);
        context.lineTo(300, 150);
        context.stroke();
   
}

//drow the grid on canvas
function drawGrid(context) {
    context.save()
    for (var x = 0.5; x < 1000; x += 100) {
      context.moveTo(x, 0);
      context.lineTo(x, 1000);
    }
    
    for (var y = 0.5; y < 1000; y += 100) {
      context.moveTo(0, y);
      context.lineTo(1000, y);
    }
    
    context.strokeStyle = "#ddd";
    context.stroke();

    context.setLineDash( [ 1, 4 ] )
    for (var x = 0.5; x < 1000; x += 10) {
      context.moveTo(x, 0);
      context.lineTo(x, 1000);
    }
    
    for (var y = 0.5; y < 1000; y += 10) {
      context.moveTo(0, y);
      context.lineTo(1000, y);
    }
    
    context.strokeStyle = "#ddd";
    context.stroke();
    context.restore();
}


//function to fill the square with interior color
function fillSquare(context, x, y){
    context.fillStyle = "#FFF2D6"
    context.fillRect(x-34,y-29,72-4,63-4);
}
//function to fill the square with the color that will be shown on the outline
function strokeSquare(context, x, y){
    context.fillStyle = "#777777"
    context.fillRect(x-36,y-31,72,63);
}


//drow grid call
drawGrid(context);

//function to clear the canvas
function clearCanvas(){
   // context.clearRect(0, 0, 1000, 1000); just to clear the canvas but reload will do the job
   // drawGrid(context)
    location.reload()
    document.getElementById("clearCanvas").style.backgroundColor = 'rgb(36, 35, 35)';
}

//list of direction to a square
let dirextion=[

]

//get a list of points between to points
const findway=(start,end)=>{
    for(var j = start.x; j < 1000; j += 100){
    dirextion.push({x:x,y:y});
}}



// grid matrix
let gridMatrix=[];
for(let i=0;i<10;i++){
    gridMatrix[i]=[]
}
for(let i=0;i<10;i++){
    for(let j=0;j<10;j++){
        gridMatrix[i][j]="1";
    }
}

/////////////////////////////////////
//using IA to get the shortest path//
/////////////////////////////////////


//helpers
function createArray(length) {//creat an matrix
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}


//a simulation of ArrayDeque in javascript
function ArrayDeque()
{
    this.stac=new Array();

    this.poll=function(){
        return this.stac.pop();
    }
    this.add=function(item){
        this.stac.push(item);
    }

    this.isEmpty=function(){
        return (this.stac.length == 0)
    }
}
let nodes=[]
//show path
function printPath( node) {
    if (node == undefined) {
        return;
    }
    printPath(node.parent);
    nodes.push({x:node.x,y:node.y})
}


//Lee algorithm was in java so i hade to switch it to javascript

    // maintain a parent node for printing path
    //Node parent;

function Node(x, y, dist, parent) {
    this.x = x || 0;
    this.y = y || 0;
    this.dist = dist || 0;
    this.parent = parent;
    
    this.show=function(){
        return "{" + x + ", " + y + "}"; 
    }
};


//to show and return a table of points between two index plus their distance
function Util(mat,point1,point2){
    // M x N matrix
    let M = 10;//10 meaning 1000 cus each point is 100 point of the grid
    let N = 10;

    //max possible length
    let MAX_VALUE = 10;


	

    // Function to check if it is possible to go to position (row, col)
	// from current position. The function returns false if (row, col)
    // is not a valid position or has value 0 or it is already visited
    function isValid(mat, visited, row, col){
        return (row >= 0) && (row < M) && (col >= 0) && (col < N)
        && mat[row][col] == 1 && !visited[row][col];
    }

    // Find Shortest Possible Route in a matrix mat from source
    // cell (i, j) to destination cell (x, y)
    function BFS(mat, i, j, x, y){
        // construct a matrix to keep track of visited cells
        var visited = createArray(M,N);

        //create an empty queue
        var q = new ArrayDeque();

        // mark source cell as visited and enqueue the source node
        visited[i][j] = true;
        q.add(new Node(i, j, 0));

        // stores length of longest path from source to destination
        var min_dist = MAX_VALUE;
        
// Below arrays details all 4 possible movements from a cell
    //PS: this will lead to is going from top to bottom in this cases it will rend the perfect result
    //i can add for condition i will if i have time befor the delay
    //y1=y2
    var row = [-1, 0, 0, 1];
    var col = [0, -1, 1, 0];

        // run till queue is not empty
        while (!q.isEmpty()) {
            // pop front node from queue and process it
            var node = q.poll();
            
            // (i, j) represents current cell and dist stores its
			// minimum distance from the source
			i = node.x;
			j = node.y;
            var dist = node.dist;
            
            // if destination is found, update min_dist and stop
			if (i == x && j == y)
			{
				min_dist = dist;
				break;
            }
            

			// check for all 4 possible movements from current cell
			// and enqueue each valid movement
			for ( k = 0; k < 4; k++)
			{
				// check if it is possible to go to position
				// (i + row[k], j + col[k]) from current position
				if (isValid(mat, visited, i + row[k], j + col[k]))
				{
					// mark next cell as visited and enqueue it
					visited[i + row[k]][j + col[k]] = true;
					q.add(new Node(i + row[k], j + col[k], dist + 1, node));
				}
			}

        }

		if (min_dist != MAX_VALUE) {
			//document.write("The shortest path from source to destination "
                           // + "has length " + min_dist + "</br>");
                            printPath(node);
		}
		else {
			//document.write("Destination can't be reached from source");
		}
    }


    // Shortest path in a Maze
    

        // input maze    
		

		// Find shortest path from source (0, 0) to
		// destination (7, 5)
		BFS(mat, point1.x, point1.y, point2.x, point2.y);
        //console.log(mat)
        
    

}


//drow direction to a square Array [ {x, y}, {x, y}, {…}, {…} ]
function drawArray(aux){
    //generate a random color for the link and text
    var hue = 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';
    //drow each two elements of aux
    for(let i=0;i<aux.length-1;i++ ){
        draw(aux[i],aux[i+1],hue)
        
    }
    //write the distance on the last square
    context.fillStyle = hue
    context.font = "12px Arial";
    context.fillText("d= "+(aux.length-1)*100, ((points[1].x/100)*100)+20, ((points[1].y/100)*100)-40);
}
const draw=(start,end,hue)=>{
	var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.lineWidth = 4;
    ctx.strokeStyle = hue;
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
}

// list of points
let points=[

]


//list of squares
let squares=[

]

//find a square in list of squares added
const findSquare=(square)=>{
    let exists=false;
    for(let i in squares){
        if(squares[i].x==square.x && squares[i].y==square.y){
            exists=true;
        }
    }
    return exists;
}


//listner to the events 
canvas.addEventListener('click', function(evt) {
    //chck if placed is clicked
    if(placed){
        var mousePos = getSquare(canvas, evt);//turn the position of mouse to square
        const x=(Math.round(mousePos.x/100)*100);//turn the x to the nearest number to a multiple of 100
        const y=(Math.round(mousePos.y/100)*100);//turn the y to the nearest number to a multiple of 100

    if(!findSquare({x:x,y:y})){//check if the square deosnt aready exist 
        squares.push({x:x,y:y});//puch the square to the list of squars
        gridMatrix[x/100][y/100]="0";//set the same place of it in the matrix as notempty
        strokeSquare(context, x, y)//stroke it
        fillSquare(context, x, y)//file it
        //console.log(squares)//to see the squares list in consol
        //console.log(gridMatrix)//shoe the matrix in consol
    }
    };

    //chck if linked is clicked
    if(linked){
        var mousePos = getSquare(canvas, evt);//get square
        if(points.length==0){//check if points list has no points yet
        if(findSquare({x:(Math.round(mousePos.x/100)*100),y:(Math.round(mousePos.y/100)*100)})){//check if the place selected has a square in the squares table
        points.push({x:(Math.round(mousePos.x/100)*100),y:(Math.round(mousePos.y/100)*100)})//puch the first point to the points list
        context.fillStyle = "#F0D1BA"//just to light the selected square
        context.fillRect((Math.round(mousePos.x/100)*100)-34,(Math.round(mousePos.y/100)*100)-29,72-4,63-4);   
        }
    	}
    else if(points.length==1){//check if points list has only one point
        if(findSquare({x:(Math.round(mousePos.x/100)*100),y:(Math.round(mousePos.y/100)*100)})){//once again check if the secound place selected has a square in the squares table
        points.push({x:(Math.round(mousePos.x/100)*100),y:(Math.round(mousePos.y/100)*100)})//puch the secound point to the points list
        context.fillStyle = "#F0D1BA"//just to light the secound selected square
        context.fillRect((Math.round(mousePos.x/100)*100)-34,(Math.round(mousePos.y/100)*100)-29,72-4,63-4);  
        }
    	
    }
   
    
    
    let x1=points[0].x/100
    let y1=points[0].y/100

   let point1={
    x:x1,y:y1
        }
        console.log("the first point")
        console.log(point1)
    let x2=points[1].x/100
    let y2=(points[1].y/100)
    
    let    point2={
        x:x2,y:y2
    }
    console.log("the second point")
        console.log(point2)
        console.log("the hapy node")
        console.log(nodes)
        
        
        console.log(points)
        
        
    gridMatrix[x1][y1]="1";//set the place of the point as the start point in the grid to 1
    gridMatrix[x2][y2]="1";//set the place of the point as the start point in the grid to 1
    console.log("the hapy matrix")
    console.log(gridMatrix)//show the matrix in console
    Util(gridMatrix,point1,point2)
    gridMatrix[x1][y1]="0";//set the place of the point as the start point in the grid to 0
    gridMatrix[x2][y2]="0";//set the place of the point as the start point in the grid to 0
    console.log("the hapyyyyyyy matrix")
    console.log(gridMatrix)//show the matrix in console
    //draw(points[0],points[1])//call the finction to drow direction between the two points in the points list
    
    let aux=[]
        for(var j=0; j<nodes.length; j++){
            aux.push(
                {x:nodes[j].x*100,y:nodes[j].y*100}
            )
        }
    console.log("the happy 100 auxes")
    console.log(aux)
    drawArray(aux)
    aux=[]
    aux=[]
    x1=0
    y1=0
    x2=0
    y2=0
    aux=[]
    nodes=[]
    
    context.fillStyle = "#FFF2D6"//return the two square to their color
    context.fillRect((Math.round(points[0].x/100)*100)-34,(Math.round(points[0].y/100)*100)-29,72-4,63-4);
    context.fillRect((Math.round(points[1].x/100)*100)-34,(Math.round(points[1].y/100)*100)-29,72-4,63-4); 
    
    points=[]
    console.log("points empty")
    console.log(points)
    
    /*Fight Bugs                |     |
                                \\_V_//
                                \/=|=\/
                                 [=v=]
                               __\___/_____
                              /..[  _____  ]
                             /_  [ [  M /] ]
                            /../.[ [ M /@] ]
                           <-->[_[ [M /@/] ]
                          /../ [.[ [ /@/ ] ]
     _________________]\ /__/  [_[ [/@/ C] ]
    <_________________>>0---]  [=\ \@/ C / /
       ___      ___   ]/000o   /__\ \ C / /
          \    /              /....\ \_/ /
       ....\||/....           [___/=\___/
      .    .  .    .          [...] [...]
     .      ..      .         [___/ \___]
     .    0 .. 0    .         <---> <--->
  /\/\.    .  .    ./\/\      [..]   [..]
 / / / .../|  |\... \ \ \    _[__]   [__]_
/ / /       \/       \ \ \  [____>   <____] */    
    
       
    }

   
    
}, false);


