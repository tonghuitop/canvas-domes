import Coordinate from './Coordinate'
import ShootingStar from './ShootingStar'

interface IProps {
	select: HTMLElement | string
	angle?: number
	starWidth?: number
}

/** 发大的倍数，避免在一些高清屏下canvas模糊的问题 */
const RATIO = 3

class MeteorShower {
	private Timer: number | null = null
	private isStop: boolean
	private playing: boolean
	private ctx: CanvasRenderingContext2D | null = null
	private stars: Array<ShootingStar> = []
	private config = {
		selector: document.body,
		angle: 30,
		starWidth: 8
	}
	private selectorClienRect = { width: 0, height: 0, top: 0, left: 0 }

	constructor({ select, angle = 30, starWidth = 8 }: IProps) {
		if (typeof select === 'string') {
			const selectDom: HTMLElement | null = document.querySelector(select)
			if (selectDom) {
				this.config.selector = selectDom
			} else {
				console.error(`not found, selector: ${select}`)
			}
		} else {
			this.config.selector = select
			this.config.angle = angle
			this.config.starWidth = starWidth
		}
		this.createCanvas()
		this.stars = []
		this.isStop = false
		this.playing = false
	}

	private createCanvas() {
		const selector: HTMLElement = this.config.selector

		const { top, left, width, height } = selector.getBoundingClientRect()
		this.selectorClienRect = {
			top,
			left,
			width: width * RATIO,
			height: height * RATIO
		}

		if (selector.getElementsByTagName('canvas').length === 0) {
			const canvas = document.createElement('canvas')
			canvas.className = 'meteor-shower-canver'
			canvas.style.cssText =
				'position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1'
			canvas.width = this.selectorClienRect.width
			canvas.height = this.selectorClienRect.height

			const div = document.createElement('div')
			div.className = `meteor-shower-wrapper`
			div.style.cssText = 'position: relative; height: 100%;'
			div.appendChild(canvas)

			selector.appendChild(div)

			const canvasSelector: HTMLCanvasElement | null = selector.querySelector(
				'.meteor-shower-canver'
			)

			if (canvasSelector) {
				this.ctx = canvasSelector.getContext('2d')
			}
		}
	}

	private createStar() {
		const { width: containerWidth, height: containerHeight } =
			this.selectorClienRect
		const { angle, starWidth } = this.config
		const distance = Math.random() * containerWidth
		const init = new Coordinate(
			(Math.random() * containerWidth) | 0,
			(Math.random() * containerHeight) | 0
		)
		const final = new Coordinate(
			init.x - distance * Math.cos(angle * 3.14),
			init.y + distance * Math.sin((angle * 3.14) / 180)
		)
		const speed = Math.random() * 400 + 200
		const star = new ShootingStar(init, final, starWidth, speed, angle, () => {
			this.remove(star)
		})
		return star
	}

	remove(star: ShootingStar) {
		this.stars = this.stars.filter((s) => s !== star)
	}

	update(delta: number) {
		if (!this.isStop && this.stars.length < 20) {
			this.stars.push(this.createStar())
		}
		this.stars.forEach((star) => {
			star.draw(this.ctx!, delta)
		})
	}

	tick() {
		if (this.playing) return
		this.playing = true

		const now = new Date().getTime()
		let last = now
		let delta

		const _tick = () => {
			if (this.isStop && this.stars.length === 0) {
				cancelAnimationFrame(this.Timer!)
				this.playing = false
				return
			}

			delta = now - last
			delta = delta > 500 ? 30 : delta < 16 ? 16 : delta
			last = now
			this.Timer = requestAnimationFrame(_tick)
			if (!this.ctx) {
				return
			}
			const { width: containerWidth, height: containerHeight } =
				this.selectorClienRect
			this.ctx?.save()
			this.ctx.fillRect(0, 0, containerWidth, containerHeight)
			this.ctx?.restore()
			this.update(delta)
		}
		_tick()
	}

	start() {
		this.isStop = false
		this.tick()
	}

	stop() {
		this.isStop = true
	}
}

export default MeteorShower
