const canvas_comp = document.getElementById('game_canvas');
const canvas_content = canvas_comp.getContext('2d');
canvas_content.lineWidth=2
const paddle_width = 30
const paddle_height = 5
const paddle_margin_bottom = 20
const ball_radius=4;
let Score=0;
const score_unit=10;
let Level=1;
let Life=80;
let left=false;
let right=false;
let game_over=false;
let Max_level=3;
const paddle = {
    x: canvas_comp.width / 2 - paddle_width / 2,
    y: canvas_comp.height - paddle_height -paddle_margin_bottom,
    width:paddle_width,
    height:paddle_height,
    dx:4
}
const ball={
    x:canvas_comp.width/2,
    y:paddle.y-ball_radius,
    radius:ball_radius,
    speed:2,
    dx:3*(Math.random()*2-1),
    dy:-1
}
const brick = {
    row:1,
    column:10,
    width:20,
    height:5,
    left_offset:10,
    top_offset:7,
    margin_top:10,
    color:"#121212",
    border:"#121212"
}
let bricks = []
function createBricks(){
    for(let i=0;i<brick.row;i++){
        bricks[i]=[]
        for(let j=0;j<brick.column;j++){
            bricks[i][j] = {
                x:j*(brick.left_offset+brick.width)+brick.left_offset,
                y:i*(brick.top_offset+brick.height)+brick.top_offset+brick.margin_top,
                status:true
            }
        }
    }
}
createBricks();
function draw_bricks(){
    for(let i=0;i<brick.row;i++){
        
        for(let j=0;j<brick.column;j++){
            let b = bricks[i][j];
            if(b.status){
               
                canvas_content.fillStyle=brick.color;
                canvas_content.fillRect(b.x,b.y,brick.width,brick.height);
                canvas_content.strokeStyle=brick.border;
                canvas_content.strokeRect(b.x,b.y,brick.width,brick.height);
            }
          
        }
    }
}
function draw_ball(){
    canvas_content.beginPath();
    canvas_content.arc(ball.x,ball.y,ball.radius,0,Math.PI*2);
    canvas_comp.fillStyle = "#000000";
    canvas_content.fill()
    canvas_content.strokeStyle = "#121212";
    canvas_content.stroke();
    canvas_content.closePath();
}

function draw_paddle(){
    canvas_content.fillStyle="#800000";
    canvas_content.fillRect(paddle.x,paddle.y,paddle.width,paddle.height);
    canvas_content.strokeStyle = "#000000";
    canvas_content.strokeRect(paddle.x,paddle.y,paddle.width,paddle.height);

}
function move_ball(){
    ball.x+=ball.dx;
    ball.y+=ball.dy;
}
function ball_wall(){
    if(ball.x+ball.radius>canvas_comp.width || ball.x-ball.radius<0){
        ball.dx=-ball.dx;
        wall_hit.play();
    }
    if(ball.y-ball.radius<0){
        ball.dy=-ball.dy;
        wall_hit.play();
    }
    if(ball.y+ball.radius>canvas_comp.height){
        life_lost.play();
        Life--;
        reset_ball();
    }
}
function ball_paddle(){
    if(ball.x > paddle.x && ball.x < paddle.x+paddle.width && ball.y>paddle.y && ball.y < paddle.y+paddle.height){
        
        let mid_point_of_collision= ball.x-(paddle.x+paddle.width)/2;
        mid_point_of_collision=mid_point_of_collision/paddle.width/2;
        let angle=mid_point_of_collision*Math.PI/3;
        ball.dx=-ball.speed*Math.sin(angle);
        ball.dy=ball.speed*Math.cos(angle)*-1;
    }
    else if(ball.x+ball.radius==paddle.x && ball.y - ball.radius==paddle.y){
        ball.dx=-ball.dx;
    }
    else if(ball.x-ball.radius==paddle.x+paddle.width && ball.y -ball.radius == paddle.y){
        ball.dx=-ball.dx;
    }
}
function ball_brick(){
    for(let i=0;i<brick.row;i++){
        
        for(let j=0;j<brick.column;j++){
            let b = bricks[i][j];
            if(b.status){
                if(ball.x+ball.radius > b.x && ball.x-ball.radius<b.x + brick.width && ball.y+ball.radius > b.y && ball.y -ball.radius < b.y + brick.height){
                    ball_hit.play();
                    b.status=false;
                    ball.dy=-ball.dy;
                    Score+=score_unit;
                }
            }
          
        }
    }
}
function show_text(text,textX,textY,img,imgX,imgY){
    canvas_content.fillStyle = "#000000"
    canvas_content.font = "15px Germania one"
    canvas_content.fillText(text,textX,textY);
    canvas_content.drawImage(img,imgX,imgY,20,height=10);
}
function reset_ball(){
    ball.x=canvas_comp.width/2,
    ball.y=paddle.y-ball_radius,
    ball.radius=ball_radius,
    ball.speed=4,
    ball.dx=3*(Math.random()*2-1),
    ball.dy=-1
}
document.addEventListener('keydown',function(event){
    if(event.keyCode==37){
        left=true;
    }
    else if(event.keyCode==39){
        right=true;
    }
});
document.addEventListener('keyup',function(event){
    if(event.keyCode==37){
        left=false;
    }
    else if(event.keyCode==39){
        right=false;
    }
});
function move_paddle(){
    if(left && paddle.x>0 ){
        paddle.x-=paddle.dx;
    }
    else if(right && paddle.x+paddle.width<canvas_comp.width ){
        paddle.x+=paddle.dx;
    }
}
function gameOver(){
    if(Life<=0){
        showYouLose();
        game_over=true;
       
    }
}
function level_up(){
    let is_level_done=true;
    for(let i=0;i<brick.row;i++){
        for(let j=0;j<brick.column;j++){
            is_level_done=is_level_done&& !bricks[i][j].status;
        }
    }
    if(is_level_done){
        if(Level>=Max_level){
            win.play();
            showYouWin();
            game_over=true;
            return;
        }
        level_up_sound.play();
        brick.row++;
        createBricks();
        ball.speed+=1;
        reset_ball();
        Level++;
    }
}
function draw(){
draw_paddle();
draw_ball();
draw_bricks();
show_text(Score,40,10,score_img,10,2);
show_text(Life,canvas_comp.width-25,10,life_img2,canvas_comp.width-50,2)
show_text(Level,canvas_comp.width/2,10,level_img,canvas_comp.width/2+10,0)
}
function update(){
    //paddle.y-=2;
    move_paddle();
    move_ball();
    ball_wall();
    ball_paddle();
    ball_brick();
    gameOver();
    level_up();
   
}
const soundElem=document.getElementById('sound');
soundElem.addEventListener('click',audioMan);
function audioMan(){
    let imgSrc=soundElem.getAttribute("src");
    let sound_img = imgSrc == "img/sound_on.png" ? "img/sound_off.png": "img/sound_on.png";
    soundElem.setAttribute("src",sound_img);
    wall_hit.muted = wall_hit.muted ? false : true;
    ball_hit.muted = ball_hit.muted ? false : true;
    level_up_sound.muted = level_up_sound.muted ? false : true;
    life_lost.muted = life_lost.muted ? false : true;
    win.muted = win.muted ? false : true;
}
const gameover = document.getElementById("gameover");
const youwin = document.getElementById("youwin");
const youlose = document.getElementById("youlose");
const restart = document.getElementById("restart");

// CLICK ON PLAY AGAIN BUTTON
restart.addEventListener("click", function(){
    location.reload(); // reload the page
})

// SHOW YOU WIN
function showYouWin(){
    gameover.style.display = "block";
    youwon.style.display = "block";
}

// SHOW YOU LOSE
function showYouLose(){
    gameover.style.display = "block";
    youlose.style.display = "block";
}






function loop(){
    canvas_content.drawImage(Bg_img,0,0);
    draw();
    update();
    if(!game_over){
    requestAnimationFrame(loop);
    }
}
loop();
