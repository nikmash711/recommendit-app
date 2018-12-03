/* global $ store api moment */
'use strict';

const recommendit = (function () {

  function render() {
    const itemsList = generateItemsList(store.items);
    $('.js-feed-list').html(itemsList);
  }

  function generateItemsList(list = []) {
    const listItems = list.map(item => `
      <li data-id="${item.id}" class="js-item-element item-element ${item.category} ${item.subcategory}">
        <div class = "item-heading">
          <a class = "item-heading-element left ${item.url === '' ? 'inactive-anchor' : ''}" href = "${item.url}" target = "_blank">${item.title} </a>
          <p class = "item-heading-element middle"> ${item.category}</p>
          <p class = "item-heading-element right"> ${item.subcategory}</p>
        </div>
        <p> ${item.notes}</p>
        <p> ${item.category === 'DoneIt' ? item.rating : ''} </p>
        <div class="metadata">
            <div class="date">${moment(item.updatedAt).calendar()}</div>
          </div>
      </li>`);
    return listItems.join('');
  }



  function bindEventListeners() {

  }

  // This object contains the only exposed methods from this module:
  return {
    render,
    bindEventListeners,
  };

}());
