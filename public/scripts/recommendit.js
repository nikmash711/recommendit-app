/* global $ store api moment */
'use strict';

const recommendit = (function () {

  function render() {
    const itemsList = generateItemsList(store.items);
    $('.js-feed-list').html(itemsList);
    if(store.adding){
      const adding_form = generateAddItemForm();
      $('.js-modal').html(adding_form);
    }
    else{
      $('.js-modal').html('');
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
    return `
    <div class="create-new-modal js-create-new-modal">        
    <div class="create-new-modal-content js-create-new-modal-content">
      <a class="close-modal js-close-modal">&times;</a>
      <form action="" class = "create-new-form js-create-new-form">
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
          <option value="">TryIt</option>
          <option value="">DoneIt</option>
        </select>
        
        <label for="subcategory-dropdown">Subcategory</label>
        <select required class = "subcategory-dropdown js-subcategory-dropdown" id = "subcategory-dropdown">
          <option value="" disabled selected>Choose A Subcategory</option>
          <option value="">Show</option>
          <option value="">Movie</option>
          <option value="">Book</option>
          <option value="">Food</option>
          <option value="">Place</option>
          <option value="">Thing-To-Do</option>
          <option value="">Article</option>
          <option value="">Video</option>
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
      </form>
    </div>   
  </div>
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
    $('.js-modal').on('click', '.js-cancel-create-button', event => {
      //toggle adding in the store
      store.toggleCreatingNew();
      render();
    });
  };

  const handleClickingClose = function(){
    //event listener for when user clicks X on the form 
    $('.js-modal').on('click', '.js-close-modal', event => {
      //toggle adding in the store
      store.toggleCreatingNew();
      render();
    });
  };


  function bindEventListeners() {
    handleAddItem();
    handleCancelAddItem();
    handleClickingClose();
  }

  // This object contains the only exposed methods from this module:
  return {
    render,
    bindEventListeners,
  };

}());
