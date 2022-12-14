let context, t1, t2
let arr = new Array()
let starCount = 800
let rains = new Array()
let rainCount = 20
let windowWidth = window.innerWidth //当前的窗口的高度
//初始化画布及context
function init() {
	//获取canvas
	let sky = document.querySelector('#sky')
	sky.width = windowWidth
	sky.height = window.innerHeight
	//获取context
	context = sky.getContext('2d')
}


// 创建流星雨对象
class MeteorRain {
	constructor() {
		this.x = -1
		this.y = -1
		this.length = -1 //长度
		this.angle = 30 //倾斜角度
		this.width = -1 //宽度
		this.height = -1 //高度
		this.speed = 1 //速度
		this.offset_x = -1 //横轴移动偏移量
		this.offset_y = -1 //纵轴移动偏移量
		this.alpha = 1 //透明度
		this.color1 = '' //流星的色彩
		this.color2 = '' //流星的色彩
	}
	init() {
		//初始化
		this.getPos()
		this.alpha = 1 //透明度
		this.getRandomColor()
		//最小长度，最大长度
		let x = Math.random() * 80 + 150
		this.length = Math.ceil(x)
		x = Math.random() + 0.5
		this.speed = Math.ceil(x) //流星的速度
		let cos = Math.cos((this.angle * 3.14) / 180)
		let sin = Math.sin((this.angle * 3.14) / 180)
		this.width = this.length * cos //流星所占宽度
		this.height = this.length * sin //流星所占高度
		this.offset_x = this.speed * cos
		this.offset_y = this.speed * sin
	}
	/**获取随机颜色函数**/
	getRandomColor() {
		let a = Math.ceil(255 - 240 * Math.random())
		//中段颜色
		this.color1 = 'rgba(' + a + ',' + a + ',' + a + ',1)'
		//结束颜色
		this.color2 = 'black'
	}
	/**重新计算流星坐标的函数**/
	countPos() {
		//
		//往左下移动,x减少，y增加
		this.x = this.x - this.offset_x
		this.y = this.y + this.offset_y
	}
	/**获取随机坐标的函数**/
	getPos() {
		//
		//横坐标
		this.x = Math.random() * window.innerWidth //窗口高度
		//纵坐标
		this.y = Math.random() * window.innerHeight //窗口宽度
	}
	/**绘制流星**/
	draw() {
		//绘制一个流星的函数
		context.save()
		context.beginPath()
		context.lineWidth = 1 //宽度
		context.globalAlpha = this.alpha //设置透明度
		//创建横向渐变颜色,起点坐标至终点坐标
		let line = context.createLinearGradient(
			this.x,
			this.y,
			this.x + this.width,
			this.y - this.height
		)
		//分段设置颜色
		line.addColorStop(0, 'white')
		line.addColorStop(0.3, this.color1)
		line.addColorStop(0.6, this.color2)
		context.strokeStyle = line
		//起点
		context.moveTo(this.x, this.y)
		//终点
		context.lineTo(this.x + this.width, this.y - this.height)
		context.closePath()
		context.stroke()
		context.restore()
	}
	move() {
		//清空流星像素
		let x = this.x + this.width - this.offset_x
		let y = this.y - this.height
		context.clearRect(x - 3, y - 3, this.offset_x + 5, this.offset_y + 5)
		//重新计算位置，往左下移动
		this.countPos()
		//透明度增加
		this.alpha -= 0.002
		//重绘
		this.draw()
	}
}

//星星闪起来
// function playStars() {
// 	for (let n = 0; n < starCount; n++) {
// 		arr[n].getColor()
// 		arr[n].draw()
// 	}
// 	t1 = requestAnimationFrame(playStars)
// }

//绘制流星
function playRains() {
	for (let n = 0; n < rainCount; n++) {
		// console.log(rains, "--");
		let rain = rains[n]
		rain.move() //移动
		if (rain.y > window.innerHeight) {
			//超出界限后重来
			context.clearRect(rain.x, rain.y - rain.height, rain.width, rain.height)
			rains[n] = new MeteorRain()
			rains[n].init()
		}
	}
	t2 = requestAnimationFrame(playRains)

	// setTimeout("playRains()",2);
}

function initMeteor() {
	init()
	// 画流星
	for (let i = 0; i < rainCount; i++) {
		let rain = new MeteorRain()
		rain.init()
		rain.draw()
		rains.push(rain)
	}
	// playStars() //绘制闪动的星星
	playRains() //绘制流星
}

export { initMeteor }
