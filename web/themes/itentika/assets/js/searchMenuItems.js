import detectOutside from './detectOutside.js';

export default function searchMenuItems() {
  let items = [...document.querySelectorAll('.SubMenu__item > .SubMenu > .SubMenu__item > .SubMenu__link')];
  let input = document.querySelector('.Search__field');
  let form = document.querySelector('.Search__form');
  let searchListContainer = document.querySelector('.Search__result');
  let removeSearchStringBtn = document.querySelector('.Search__icon.close');
  let searchList = [];

  form.addEventListener('submit', (e) => {
    e.preventDefault();
  });

  input.addEventListener('focus', (e) => {
    if (searchList.length === 0) {
      for (let item of items) {
        let searchItemType = item.parentElement.parentElement.previousElementSibling.querySelector('.SubMenu__link').textContent.slice(0, 3);

        let searchItem = {
          type: `${searchItemType}`,
          name: `${item.textContent}`,
          anchor: `${item.hash}`
        }

        searchList.push(searchItem);
      }
    } else {
      showSearchList(e, searchList, searchListContainer, removeSearchStringBtn)
    }
  });

  input.addEventListener('input', (e) => {
    showSearchList(e, searchList, searchListContainer, removeSearchStringBtn)
  });
}


function showSearchList(obj, searchList, searchListContainer, removeBtn) {
  obj.preventDefault();
  obj = obj.target;
  let searchString = obj.value.toLowerCase().trim();
  let filteredSearchList = [];

  if (searchString) {
    if (removeBtn.style.display !== 'block') {
      removeBtn.style.display = 'block';
    }

    filteredSearchList = searchList.filter((searchItem) => {
      return searchItem.name.toLowerCase().includes(searchString);
    });

    filteredSearchList = filteredSearchList.map((searchItem) => {
      let li = `<li><code>${searchItem.type}</code><a href="${searchItem.anchor}">${searchItem.name}</a></li>`;

      return li;
    });

    searchListContainer.innerHTML = filteredSearchList.join('');

    for (const anchor of document.querySelectorAll('.Search__result > li > a')) {
      anchor.addEventListener('click', () => {
        searchListContainer.innerHTML = '';

        setTimeout(() => {
          document.querySelector('.Page').classList.remove('Page--expanded');
        });
      });
    }
  } else {
    removeBtn.style.display = 'none';
    searchListContainer.innerHTML ='';
  }

  removeBtn.addEventListener('click', (e) => {
    if (searchString) {
      e.currentTarget.style.display = 'none';
      obj.value = '';
      searchListContainer.innerHTML = '';
    }
  });

  detectOutside(document.querySelector('.Search'), () => {
    if (searchString) {
      searchListContainer.innerHTML = '';
    }
  });
}
