/* global $ store api moment */
'use strict';

const recommendit = (function () {

  function render() {
    const itemsList = generateItemsList(store.items);
    $('.js-feed-list').html(itemsList);
    if(store.adding){
      const adding_form = generateAddItemForm();
      $('.js-create-new-modal').css('display', 'block');
      $('.js-create-new-form').html(adding_form);
    }
    else{
      $('.js-create-new-form').html('');
      $('.js-create-new-modal').css('display', 'none');
    }
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

  function generateAddItemForm(){
    console.log('here');
    return `
    <h3>Create New</h3>
    <label for = "title">Title:</label>
    <input required id = "title" name = "title" type="text" class = "input-title js-input-title" placeholder = "Title">
    
    <label for = "url">URL:</label>
    <input id = "url" name = "url" type="text" class = "input-url js-input-url" placeholder="URL">
    
    <label for = "notes">Notes:</label>
    <textarea id = "notes" name = "notes" name="notes" class = "input-notes js-input-notes" placeholder="Write a brief note. If you'd like to, that is!" rows = "4"></textarea>
    
    <label for="category-dropdown">Category</label>
    <select required class = "category-dropdown js-category-dropdown" id = "category-dropdown">
      <option value="" disabled selected>Choose A Category</option>
      <option value="TryIt">TryIt</option>
      <option value="DoneIt">DoneIt</option>
    </select>
    
    <label for="subcategory-dropdown">Subcategory</label>
    <select required class = "subcategory-dropdown js-subcategory-dropdown" id = "subcategory-dropdown">
      <option value="" disabled selected>Choose A Subcategory</option>
      <option value="Show">Show</option>
      <option value="Movie">Movie</option>
      <option value="Book">Book</option>
      <option value="Food">Food</option>
      <option value="Place">Place</option>
      <option value="Thing-To-Do">Thing-To-Do</option>
      <option value="Article">Article</option>
      <option value="Video">Video</option>
    </select>

    <label for="rating">Rate It!</label>
    <select id = "rating" name = "rating" class = "input-rating js-input-rating">
      <option selected disabled>Choose a Rating</option>
      <option value="1">1 Star</option>
      <option value="2">2 Stars</option>
      <option value="3">3 Stars</option>
      <option value="4">4 Stars</option>
      <option value="5">5 Stars</option>
    </select>
    <p class = "error-message js-error-message"></p>
    <button type = "submit" class = "submit-new-button js-submit-new-button">Create</button>
    <button type = "button" class = "cancel-create-button js-cancel-create-button">Cancel </button>
    `;
  }

  // HANDLER FUNCTIONS 

  const handleAddItem = function(){
    //event listener for when user hits create new
    $('.js-create-new-button').click(event=>{
      //toggle adding in store
      store.toggleCreatingNew(); 
      //dont keep any error messages that might have been left over
      // store.setError(null);  
      //render the adding form 
      render();
    });
  };

  const handleCancelAddItem = function(){
    //event listener for when user clicks cancel in the form
    $('.js-create-new-modal').on('click', '.js-cancel-create-button', event => {
      //toggle adding in the store
      store.toggleCreatingNew();
      render();
    });
  };

  const handleClickingClose = function(){
    //event listener for when user clicks X on the form 
    $('.js-create-new-modal').on('click', '.js-close-modal', event => {
      //toggle adding in the store
      store.toggleCreatingNew();
      render();
    });
  };

  //handles when the user clicks create bookmark
  const handleCreateItem = function(){
    //event listener on the create button in the form
    $('.js-create-new-form').on('submit', event => {
      console.log('here in create');
      //prevent default bc its submt
      event.preventDefault();      
      
      const form = $(event.currentTarget);
      const itemObj = {
        title: form.find('.js-input-title').val(),
        url: form.find('.js-input-url').val(),
        notes: form.find('.js-input-notes').val(),
        category: form.find('.js-category-dropdown').val(),
        subcategory: form.find('.js-subcategory-dropdown').val(),
        rating: form.find('.js-input-rating').val(),
      };
      
      console.log(itemObj);

      api.create('/api/items', itemObj)
        .then(createResponse => {
          return api.search('/api/items', store.currentQuery);
        })
        .then(response => {
          store.items = response;
          render();
        })
        .catch(handleErrors);
    });
  };


  function bindEventListeners() {
    handleAddItem();
    handleCancelAddItem();
    handleClickingClose();
    handleCreateItem();
  }

  // This object contains the only exposed methods from this module:
  return {
    render,
    bindEventListeners,
  };

}());
