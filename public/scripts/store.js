// eslint-disable-next-line no-unused-vars
'use strict';

const store = (function () {
  const adding = false; 

  const toggleCreatingNew = function(){
    this.adding = !this.adding;
  };


  return {
    items: [
      {
        title: 'Fantastic Beasts',
        url: 'http://google.com',
        notes: 'Great movie, must watch!',
        category: 'DoneIt',
        subcategory: 'Movie',
        rating: 5, 
      },
      {
        title: 'Italy',
        url: '',
        notes:'',
        category: 'TryIt',
        subcategory: 'Place',
        rating: 0, 
      }
    ],
    // categories: [],
    // subcategories: [],
    currentItem: {},
    currentQuery: {
      searchTerm: '',
    },
    toggleCreatingNew,
  };

}());
