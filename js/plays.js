//获取绘画canvas元素
var canvas = document.getElementById("canvas");
//创建上下文绘图环境
var ctx = canvas.getContext("2d");

//定义变量
var centerX = 300;//大圆圆心x坐标
var centerY = 200;//大圆圆心y坐标
var centerRiuds = 50;//大圆半径
//-------------设置关卡--------
var level;
if(parseInt(window.location.href.split("#")[1])){
	level = parseInt(window.location.href.split("#")[1]);
}else{
	level = 0;
}

//定义变量
var ballRadius = 10;//等待球，转动球半径
//-------initNum：转动球数量（本身有多少个球在转动）；waitNum：等待球数量；speed：转动速度-----------
//定义level数组
var levelArray = [
    {"initNum":3, "waitNum":5, "speed":200},
    {"initNum":4, "waitNum":8, "speed":180},  
    {"initNum":5, "waitNum":5, "speed":160},
    {"initNum":3, "waitNum":5, "speed":140},
    {"initNum":4, "waitNum":8, "speed":120},  
    {"initNum":5, "waitNum":5, "speed":100},
	{"initNum":6, "waitNum":7, "speed":90}
];
//----------------------------设置转动球---------------------
var balls = []; //转动球
var balllen = levelArray[level].initNum;//设置转动球数组长度
var lineLen = 130;//设置大球圆心与转动球之间的距离
//设置转动数组添加旋转角度
for(var i=0;i<balllen;i++){//因为是从0开始，所以是i+1
	//360/balllen 一个球的角度  (360/balllen)*(i+1)  几个球的角度
	var angle = (360/balllen)*(i+1);  //把转动球均匀分配到原本的球上
	balls.push({"angle":angle,"numStr":""}); //把转动球放到balls这个数组中去
}

//----------------------设置等待球---------------------
var waitballs = []; //等待球
var waitOffset = 260;//设置等待球距离上方的距离
var waitballlen = levelArray[level].waitNum;//设置等待球数组长度
//设置等待球数组添加数字文本
for(var i=waitballlen;i>0;i--){
	//通过i--的方式，看总的等待球数组长度，减到没有为止，从而得到等待球数字文本
	waitballs.push({"angle":"","numStr":i});
}

//----------------------绘制等待球---------------------
var waitx = centerX;//绘制等待球的X坐标（与大球的中心坐标相等）
var waity = lineLen + waitOffset;//绘制等待球的Y坐标（大球圆心与转动球之间的距离+等待球距离上方的距离）

//-----------------------------------绘制中间大球---------------------
function big(){
	ctx.beginPath(); //起始一条路径
	ctx.arc(centerX, centerY, centerRiuds, 0, Math.PI * 2, true);  //画圆
	ctx.closePath(); //结束路径
	ctx.fillStyle = "black";  //填充颜色
	ctx.fill();   //填充当前绘图

	//---------------------------------绘制大球中间关卡数----------------- 
	if(level==levelArray.length){
		level = levelArray.length-1;
	}
	var txt = (level  + 1) + "";
	ctx.textAlign = "center";   //字体对齐方式：居中对齐
	ctx.textBaseline = "middle";  //文本基线：方框正中位置
	ctx.font = "60px sans-serif";  //字体大小、字体类型
	ctx.strokeStyle = "#EED5B7";   
	ctx.fillStyle = "#EED5B7";
	ctx.fillText(txt, centerX-2, centerY+5);  //参数1：字体内容  参数2：字体位置
	ctx.strokeText(txt, centerX-2, centerY+5);
}

//---------------------------- 绘制转动球--------------------
function drawball(deg){
	//console.log(balls);
	//遍历ball这个数组
	balls.forEach(function(e) {
		ctx.save();
		ctx.globalCompositeOperation = "destination-over";//二次绘画，设置图形组合,后画的图形到后面去了
		e.angle = e.angle+deg;  //计算出转动球的角度   角度+单位（degree）
		if(e.angle>=360){
			e.angle = 0;   //不让转动球无限循环的加上去
		}
		//绘制大球小球之间的线段
		ctx.moveTo(centerX, centerY);
		var rad = 2 * Math.PI * e.angle / 360;  //计算出弧度
		var x = centerX + lineLen * Math.cos(rad);  //通过三角函数得到X、Y这两点的距离
		var y = centerY + lineLen * Math.sin(rad);
		ctx.strokeStyle = "black";
		ctx.lineTo(x, y);   //画线
		ctx.stroke();    
		ctx.restore();
		ctx.beginPath();
		ctx.arc(x, y, ballRadius, 0, Math.PI * 2, true);  //画圆
		ctx.closePath();
		//填充圆形
		ctx.fillStyle = "black";
		ctx.fill();
		if(e.numStr!="") {   //如果球内有文字的话，就把文字加上去
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.font = "15px sans-serif";
			ctx.strokeStyle = "#fff";
			ctx.fillStyle = "#fff";
			ctx.fillText(e.numStr, x, y);  
			ctx.strokeText(e.numStr, x, y);
		}
		
	});
}

//-------------------------绘制等待球--------------------------------
function drawWait(){
	//ctx.fillStyle="red";
	//ctx.fillRect(0,345,400,300);
	ctx.clearRect(0,345,900,400);
	waitballs.forEach(function(e) {
		//画圆
		ctx.moveTo(waitx, waity);
		ctx.beginPath();
		ctx.arc(waitx, waity, ballRadius, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.fillStyle = "black";
		ctx.fill();
		//修改文字样式
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.font = "15px sans-serif";
		ctx.strokeStyle = "#fff";
		ctx.fillStyle = "#fff";
		ctx.fillText(e.numStr, waitx, waity);  
		ctx.strokeText(e.numStr, waitx, waity);
		waity += 3 * ballRadius;  //每个球之间的间隔
	});
}

//--------------------初始化所有内容--------------------
function init(deg){
	ctx.clearRect(0,0,900,800);  //清空整个画布
	big();
	drawball(deg);
	drawWait();
}
init(0);

//---------------------设置旋转速度----------------------------
setInterval(function(){
	ctx.clearRect(0,0,900,345);
	big();
	drawball(10);
},levelArray[level].speed);

//-------------------点击添加---------------------------
var state;//用于成功或失败
document.onclick = function(){  
	if(waitballs.length==0) return; //说明所有的等待球都放到大球上面了
	//waity = lineLen + 200;  //复原位置，重新绘制等待球
	//drawWait();

	var ball = waitballs.shift();//等待球顶部移除一个，并返回值
	ball.angle = 90;//设置移除的等待球的角度
	var faild = true;//成功或失败跳出循环
	//-----------判断是否闯关成功-------------
	balls.forEach(function(e, index) {//遍历已经在大球上面的小球
		if(!faild) return;
		if(Math.abs(e.angle - ball.angle)/2 < 360 * ballRadius/ (lineLen*Math.PI)) {//小于1度
			//转动球的角度-移除的等待球的角度[90度]<360度*转动球半径[10]/大球圆心与转动球之间的距离[130]*180
			//计算出角度，然后判断角度是否与咱们插入的球接近
			state = 0;
			faild = false;
		} else if(index === balls.length - 1
			&& waitballs.length === 0) {
				faild = false;
				state = 1;
		}
	});

	balls.push(ball);//转动球数组中添加刚才移除的等待球
	//重新绘制等待球
	waity = lineLen + waitOffset;
	drawWait();
	drawball(0);
	if(state==0){
		alert("闯关失败");
		window.location.href = "index.html#"+level;
	}else if(state==1){
		alert("闯关成功");
		level++;
		window.location.href = "index.html#"+level;
	}
}

