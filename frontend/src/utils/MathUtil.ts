export class MathUtil {
	public static random(min: number, max: number): number {
		return min + Math.random() * (max - min)
	}
}
