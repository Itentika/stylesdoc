import searchMenuItems from './searchMenuItems.js';
import getToolTip from './getToolTip.js';
import { TogglePage } from './togglePage.js';

searchMenuItems();

new TogglePage('.js-toogleSidebar', '.Page', 'Page--wide').toggleClass();
new TogglePage('.js-toogleMobileSidebar', '.Page', 'Page--expanded').toggleClass();

function toogleSubMenu(className) {
  let elements = [...document.querySelectorAll('.Menu__head')];

  for (let element of elements) {
    element.querySelector('.shevron').addEventListener('click', (e) => {
      e.preventDefault();

      if (element.classList.contains(className)) {
        element.classList.remove(className);
      } else {
        element.classList.add(className);
      }
    });
  }
}

toogleSubMenu('opened');

function toogleAllMenu(className) {
  let subjs = [...document.querySelectorAll('.Action')];

  let elements = [...document.querySelectorAll('.Menu__item .Menu__head')];

  for (let subj of subjs) {
    subj.addEventListener('click', (e) => {
      e.preventDefault();

      // for (let subj of subjs) {
      //   if (subj === e.currentTarget) {
      //     subj.classList.add('active');
      //   } else {
      //     subj.classList.remove('active');
      //   }
      // }

      if (subj.classList.contains('Action--close')) {
        for (let element of elements) {
          if (element.classList.contains(className)) {
            element.classList.remove(className);
          }
        }
      } else if (subj.classList.contains('Action--expand')) {
        for (let element of elements) {
          if (!element.classList.contains(className)) {
            element.classList.add(className);
          }
        }
      }
    });
  }
}

toogleAllMenu('opened');