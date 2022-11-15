import Coordinate from './Coordinate'

const a = Math.ceil(255 - 240 * Math.random())

// 流星
class ShootingStar {
	/** 初始位置 */
	private init: Coordinate
	/** 最终位置  */
	private final: Coordinate
	/** 流星运行的宽度 */
	private size: number
	/** 速度 */
	private speed: number
	/** 飞行总时间 */
	private dur: number
	/** 已过去的时间 */
	private pass: number
	/** 当前位置 */
	private now: Coordinate
	/** 方法回调 */
	private onDistory: Function | null
	/** 透明度 */
	private alpha: number = 1
	/** 长度, 150 - 230 之间 */
	private length: number = 0
	/** 长三角的宽度 */
	private width: number = 0
	/** 长三角的高度 */
	private height: number = 0
	/** 中段、结束颜色 */
	private color1: string = 'rgba(' + a + ',' + a + ',' + a + ',1)'
	private color2: string = 'black'

	constructor(
		init = new Coordinate(),
		final = new Coordinate(),
		size = 3,
		speed = 200,
		angle = 30,
		onDistory = () => {}
	) {
		this.init = init
		this.final = final
		this.size = size
		this.speed = speed

		this.dur =
			(Math.sqrt(
				Math.pow(this.final.x - this.init.x, 2) +
					Math.pow(this.final.y - this.init.y, 2)
			) *
				1000) /
			this.speed
		// 最小长度，最大长度
		const xLen = Math.random() * 80 + 150
		this.length = Math.ceil(xLen)
		const cos = Math.cos(angle * 3.14)
		const sin = Math.sin((angle * 3.14) / 180)
		this.width = this.length * cos
		this.height = this.length * sin

		this.pass = 0
		this.now = this.init.copy() // 当前位置
		this.onDistory = onDistory
	}

	distory() {
		this.onDistory && this.onDistory()
	}

	/** 绘制流星 */
	draw(ctx: CanvasRenderingContext2D, delta: number) {
		this.pass += delta
		this.pass = Math.min(this.pass, this.dur)

		// 当前已飞行的时间
		const percent = this.pass / this.dur

		this.now.setCoordinate(
			this.init.x + (this.final.x - this.init.x) * percent,
			this.init.y + (this.final.y - this.init.y) * percent
		)

		// 绘制一个流星的函数
		ctx.save()
		ctx.beginPath()
		ctx.lineWidth = this.size // 宽度
		ctx.globalAlpha = this.alpha
		/** 创建横向渐变颜色，起点坐标至终点坐标 */
		const line = ctx.createLinearGradient(
			this.now.x,
			this.now.y,
			this.now.x + this.width,
			this.now.y - this.height
		)
		// 分段设置颜色
		line.addColorStop(0, 'white')
		line.addColorStop(0.3, this.color1)
		line.addColorStop(0.6, this.color2)
		ctx.strokeStyle = line
		// 起点
		ctx.moveTo(this.now.x, this.now.y)
		// 终点
		ctx.lineTo(this.now.x + this.width, this.now.y - this.height)
		ctx.closePath()
		ctx.stroke()
		ctx.restore()

		// 当飞出到了外面
		if (this.pass >= this.dur) {
			this.distory()
		}
	}
}

export default ShootingStar
