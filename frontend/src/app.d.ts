// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	// เพิ่มการประกาศสำหรับ svelte slot ตรงนี้
	namespace svelte.JSX {
		interface HTMLAttributes<T> {
			slot?: string;
		}
	}
}

export {};