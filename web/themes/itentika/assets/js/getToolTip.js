import detectOutside from './detectOutside.js';

export default function getToolTip(obj) {
  let buttons = [...document.querySelectorAll(obj)];
  let container;
  let toolTipData;
  let toolTipHTML;

  for (let btn of buttons) {
    btn.addEventListener('click', () => {
      container = btn.parentElement;
      toolTipData = btn.dataset.tooltip;

      if (container.querySelector('.tooltip')) {
        container.querySelector('.tooltip').remove();
      } else {
        toolTipHTML = document.createElement("span");
        toolTipHTML.classList.add('tooltip');
        toolTipHTML.innerHTML = toolTipData;

        container.append(toolTipHTML);
      }
    });

    // detectOutside(container, () => {
    //   console.log('aaa');
    //   container.querySelector('.tooltip').remove();
    // });
  }
}

getToolTip('.Badge--btn'); 