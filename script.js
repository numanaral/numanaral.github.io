/**
 * 1. Inject .pill into every .fa.icon (so the bg pill scales independently
 *    from the FontAwesome ::before glyph).
 * 2. Lazy-swap LQIP -> full avatar on load.
 * 3. Wire up the details/expand toggle.
 * 4. Drag the whole preview-card around (only when grabbing the card itself).
 */

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

// 1. Inject background pill on icons
$$(".fa.icon").forEach((el) => {
	if (el.querySelector(":scope > .pill")) return;
	const pill = document.createElement("span");
	pill.className = "pill";
	pill.setAttribute("aria-hidden", "true");
	el.prepend(pill);
});

// 2. Lazy-load full avatar
$$(".lazy-img").forEach((img) => {
	if (img.complete && img.naturalWidth > 0) {
		img.classList.add("loaded");
	} else {
		img.addEventListener("load", () => img.classList.add("loaded"), { once: true });
	}
});

// 3. Expand toggle
const stageRoot = $("#previewCard");
const expandToggle = $('[data-action="toggle-expand"]');
if (expandToggle && stageRoot) {
	expandToggle.addEventListener("click", (e) => {
		e.stopPropagation();
		stageRoot.classList.toggle("is-expanded");
		expandToggle.textContent = stageRoot.classList.contains("is-expanded")
			? "close"
			: "details";
	});
}

// 4. Drag the preview-card
/** @see https://www.w3schools.com/howto/howto_js_draggable.asp */
const makeDraggable = (handle, target) => {
	let startX = 0;
	let startY = 0;
	let dx = 0;
	let dy = 0;

	const onDown = (e) => {
		// don't start a drag from links/buttons inside the card
		if (e.target.closest("a, button")) return;
		e.preventDefault();
		target.classList.add("dragging");
		startX = e.clientX;
		startY = e.clientY;
		document.addEventListener("mousemove", onMove);
		document.addEventListener("mouseup", onUp);
	};

	const onMove = (e) => {
		e.preventDefault();
		dx = startX - e.clientX;
		dy = startY - e.clientY;
		startX = e.clientX;
		startY = e.clientY;
		target.style.top = `${target.offsetTop - dy}px`;
		target.style.left = `${target.offsetLeft - dx}px`;
	};

	const onUp = () => {
		target.classList.remove("dragging");
		document.removeEventListener("mousemove", onMove);
		document.removeEventListener("mouseup", onUp);
	};

	handle.addEventListener("mousedown", onDown);
};

const card = $("#card");
const preview = $("#previewCard");
if (card && preview) {
	makeDraggable(card, preview);
	// drop the small intro scale after first paint
	requestAnimationFrame(() => {
		setTimeout(() => card.classList.remove("small"), 80);
	});
}
