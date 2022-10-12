export class TogglePage {
  constructor(subj, obj, className) {
    this.subj = subj;
    this.obj = obj;
    this.className = className;
  }

  toggleClass() {
    let btn = document.querySelector(this.subj);
    let page = document.querySelector(this.obj);

    btn.addEventListener('click', () => {
      if (page.classList.contains(this.className)) {
        page.classList.remove(this.className);
      } else {
        page.classList.add(this.className);
      }
    });
  }
}