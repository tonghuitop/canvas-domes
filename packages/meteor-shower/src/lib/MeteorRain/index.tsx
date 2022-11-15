interface IProps {
	select: HTMLElement | string
}

/** 发大的倍数，避免在一些高清屏下canvas模糊的问题 */
const RATIO = 3

class MeteorShower {
	private Timer: number | null = null
	private config = {
		selector: document.body
	}
	private stars: Array<any> = []
	private ctx: CanvasRenderingContext2D | null = null
	private clienRect = { width: 0, height: 0, top: 0, left: 0 }

	constructor({ select }: IProps) {
		if (typeof select === 'string') {
			const selectDom: HTMLElement | null = document.querySelector(select)
			if (selectDom) {
				this.config.selector = selectDom
			} else {
				console.error(`not found, selector: ${select}`)
			}
		} else {
			this.config.selector = select
		}
		this.createCanvas()
		this.stars = []
	}

	private createCanvas() {
		const selector: HTMLElement = this.config.selector

		const { top, left, width, height } = selector.getBoundingClientRect()
		this.clienRect = {
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
			canvas.width = this.clienRect.width
			canvas.height = this.clienRect.height

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

	private createStar() {}

	tick() {}
}

export default MeteorShower
