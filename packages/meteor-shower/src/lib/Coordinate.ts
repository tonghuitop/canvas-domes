/**
 * 坐标
 */
class Coordinate {
	public x: number
	public y: number

	constructor(x = 0, y = 0) {
		this.x = x
		this.y = y
	}

	/**
	 * 更新坐标
	 * @param x 横坐标
	 * @param y 纵坐标
	 */
	setCoordinate(x: number, y: number) {
		this.x = x
		this.y = y
	}

	/**
	 * 复制当前坐标
	 * @returns
	 */
	copy() {
		return new Coordinate(this.x, this.y)
	}
}

export default Coordinate
