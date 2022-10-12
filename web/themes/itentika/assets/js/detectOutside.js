export default function detectOutside(element, callback) {
  document.addEventListener('click', (e) => {
    const isClickInside = element.contains(e.target);

    if (!isClickInside) {
      callback();
    }
  });
}