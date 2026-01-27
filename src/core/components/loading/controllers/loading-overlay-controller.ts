// loading-controller.ts
type Listener = (state: LoadingState) => void;

type LoadingState = {
	visible: boolean;
	lockOnly: boolean;
};

class LoadingOverlayController {
	private state: LoadingState = {
		visible: false,
		lockOnly: false,
	};

	private listeners = new Set<Listener>();

	show(lockOnly = false) {
		if (this.state.visible) return;
		this.state = { visible: true, lockOnly };
		this.emit();
	}

	hide() {
		if (!this.state.visible) return;
		this.state = { visible: false, lockOnly: false };
		this.emit();
	}

	subscribe(listener: Listener) {
		this.listeners.add(listener);

		return () => {
			this.listeners.delete(listener);
		};
	}

	private emit() {
		this.listeners.forEach((l) => l(this.state));
	}
}

export const loadingOverlay = new LoadingOverlayController();
