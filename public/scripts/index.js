/* global $ recommendit api store */
'use strict';

$(document).ready(function () {
  recommendit.bindEventListeners();
  recommendit.render();

  
  // api.search('/api/items')
  //   .then((items) => {
  //     store.items = items;
  //     recommendit.render();
  //   });
  
});
