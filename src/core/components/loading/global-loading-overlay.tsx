// GlobalLoadingOverlay.tsx
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { loadingOverlay } from "./controllers/loading-overlay-controller";
import { LineLoading } from "./line-loading";

export function GlobalLoadingOverlay() {
	const [state, setState] = useState({
		visible: false,
		lockOnly: false,
	});

	useEffect(() => {
		return loadingOverlay.subscribe(setState);
	}, []);

	if (!state.visible) return null;

	return createPortal(
		<div className="fixed inset-0 z-[9999]">
			{/* Lock / AbsorbPointer */}
			<div className="absolute inset-0 pointer-events-auto" />

			{!state.lockOnly && (
				<>
					{/* Opacity */}
					<div className="absolute inset-0 bg-black opacity-50" />

					{/* Loader */}
					<div className="absolute inset-0 flex items-center justify-center">
						<LineLoading />
					</div>
				</>
			)}
		</div>,
		document.body,
	);
}
