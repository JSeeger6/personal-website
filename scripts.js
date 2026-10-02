// Show touch/pen feedback immediately, without delaying navigation or scrolling.
const pressedCards = new Map();

function clearPress(pointerId) {
    const press = pressedCards.get(pointerId);
    if (!press) return;
    press.link.classList.remove('is-pressed');
    pressedCards.delete(pointerId);
}

function clearAllPresses() {
    for (const pointerId of pressedCards.keys()) clearPress(pointerId);
}

document.querySelectorAll('.card-link').forEach((link) => {
    link.addEventListener('pointerdown', (event) => {
        if (event.pointerType === 'mouse' || event.button !== 0) return;
        clearAllPresses();
        pressedCards.set(event.pointerId, {
            link,
            x: event.clientX,
            y: event.clientY,
        });
        link.classList.add('is-pressed');
    }, { passive: true });
});

window.addEventListener('pointermove', (event) => {
    const press = pressedCards.get(event.pointerId);
    if (press && Math.hypot(event.clientX - press.x, event.clientY - press.y) > 10) {
        clearPress(event.pointerId);
    }
}, { passive: true });

for (const type of ['pointerup', 'pointercancel']) {
    window.addEventListener(type, (event) => clearPress(event.pointerId), { passive: true });
}
window.addEventListener('scroll', clearAllPresses, { passive: true, capture: true });
window.addEventListener('blur', clearAllPresses);
document.addEventListener('visibilitychange', clearAllPresses);
