// eslint-disable-next-line no-unused-vars
'use strict';

const store = (function () {
  const adding = false; 

  const toggleCreatingNew = function(){
    this.adding = !this.adding;
  };


  return {
    items: [],
    // categories: [],
    // subcategories: [],
    currentItem: {},
    currentQuery: {
      searchTerm: '',
    },
    toggleCreatingNew,
  };

}());
