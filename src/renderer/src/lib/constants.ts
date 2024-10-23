export const DEMO_CODE = `// Playwright test code
// The 'page' object is available with autocomplete
await page.goto('https://example.com');
// Try typing 'page.' to see autocomplete suggestions
`

export const PLAY_WRIGHT_DEFINITIONS: string = `type Unboxed<T> = T extends Promise<infer U> ? U : T;

declare namespace playwright {
	type Buffer = any;
	type URL = string;
	type ElementHandle = any;
	type Frame = any;
	type BrowserContext = any;
	type Response = any;
	type Request = any;
	type Worker = any;
	type Route = any;
	type WebSocket = any;
	type Locator = any;
	type FrameLocator = any;
	type Dialog = any;
	type ConsoleMessage = any;
	type Download = any;
	type FileChooser = any;
	type Video = any;
	type APIRequestContext = any;
	type JSHandle = any;
	type PageFunction0<R> = string | (() => R | Promise<R>);
	type PageFunction<Arg, R> = string | ((arg: Unboxed<Arg>) => R | Promise<R>);
	type PageFunctionOn<On, Arg2, R> = string | ((on: On, arg2: Unboxed<Arg2>) => R | Promise<R>);

	// Rest of your existing interfaces...
	interface Mouse {
		click(x: number, y: number, options?: any): Promise<void>;
		move(x: number, y: number, options?: any): Promise<void>;
		down(options?: any): Promise<void>;
		up(options?: any): Promise<void>;
	}

	interface Keyboard {
		down(key: string): Promise<void>;
		up(key: string): Promise<void>;
		press(key: string, options?: { delay?: number }): Promise<void>;
		type(text: string, options?: { delay?: number }): Promise<void>;
	}

	interface Touchscreen {
		tap(x: number, y: number): Promise<void>;
	}

	interface Page {
		goto(
			url: string,
			options?: {
				timeout?: number;
				waitUntil?: "load" | "domcontentloaded" | "networkidle" | "commit";
			}
		): Promise<Response | null>;

		url(): string;
		title(): Promise<string>;
		content(): Promise<string>;

		click(
			selector: string,
			options?: {
				button?: "left" | "right" | "middle";
				clickCount?: number;
				delay?: number;
				force?: boolean;
				timeout?: number;
			}
		): Promise<void>;

		fill(
			selector: string,
			value: string,
			options?: {
				force?: boolean;
				timeout?: number;
			}
		): Promise<void>;

		type(
			selector: string,
			text: string,
			options?: {
				delay?: number;
				timeout?: number;
			}
		): Promise<void>;

		press(
			selector: string,
			key: string,
			options?: {
				delay?: number;
				timeout?: number;
			}
		): Promise<void>;

		evaluate<T>(pageFunction: PageFunction<any, T>, arg?: any): Promise<T>;
		evaluateHandle(pageFunction: PageFunction<any, any>, arg?: any): Promise<JSHandle>;

		$(selector: string): Promise<ElementHandle | null>;
		$$(selector: string): Promise<ElementHandle[]>;
		locator(selector: string): Locator;

		screenshot(options?: { path?: string; fullPage?: boolean; clip?: { x: number; y: number; width: number; height: number }; type?: "png" | "jpeg"; quality?: number }): Promise<Buffer>;

		frame(frameSelector: string | { name?: string; url?: string | RegExp }): Frame | null;
		frames(): Frame[];
		mainFrame(): Frame;

		waitForLoadState(state?: "load" | "domcontentloaded" | "networkidle"): Promise<void>;
		waitForSelector(selector: string, options?: { timeout?: number }): Promise<ElementHandle | null>;
		waitForTimeout(timeout: number): Promise<void>;
		setViewportSize(size: { width: number; height: number }): Promise<void>;

		keyboard: Keyboard;
		mouse: Mouse;
		touchscreen: Touchscreen;

		close(options?: { runBeforeUnload?: boolean }): Promise<void>;
	}
}

declare const page: playwright.Page;
`
