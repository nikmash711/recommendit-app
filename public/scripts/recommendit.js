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
    const listItems = list.map(item => 
      `
      <li data-id="${item.id}" class="js-item-element item-element ${item.category} ${item.subcategory}">
      <div class = "float-right">
        <button aria-label = "edit item" class = "edit-item  js-edit-item"><i class="fas fa-edit"></i></button>
        <span class = "edit-span js-edit-span">Edit</span>
        <button aria-label = "delete item" class = "delete-item js-delete-item"><i class="fas fa-trash-alt "></i></button>
        <span class = "delete-span js-delete-span">Delete</span>
      </div>
        <div class = "item-heading">
          <a class = "item-heading-element left ${item.url === '' ? 'inactive-anchor' : ''}" href = "${item.url=== ''? '#': item.url}" target = "_blank">${item.subcategory}: ${item.title} </a>
        </div>
        <p> ${item.category === 'DoneIt' ? generateStars(item.rating) : ''} </p>
        <p> ${item.notes==='' ? '' : item.notes}</p>
        <div class="metadata">
            <div class="date">${moment(item.updatedAt).calendar()}</div>
          </div>
      </li>`
    );
    return listItems.join('');
  }

  function generateStars(rating){
    if(rating){
      const number_of_stars = rating;
      rating = '';
      for (let i =0; i < number_of_stars; i++){
        rating+='<i class="fas fa-star"></i>';
      }
      //also put in empty stars
      for(let i = 0; i < 5 - number_of_stars; i++){
        rating+='<i class="far fa-star"></i>';
      }
    }
    else{
      rating = '';
    }
    return rating;
  }

  function generateAddItemForm(){
    return `
    <h3>Create New</h3>
    <label for = "title">Title:</label>
    <input required id = "title" name = "title" type="text" class = "input-title js-input-title" placeholder = "Title">
    
    <label for = "url">URL:</label>
    <input id = "url" name = "url"  type="url" class = "input-url js-input-url" placeholder="URL">
    
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
      <option value="Game">Game</option>
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

  function getIdFromItem(item){
    return $(item).closest('.js-item-element').data('id');
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
      
      api.create('/api/items', itemObj)
        .then(createResponse => {
          return api.search('/api/items', store.currentQuery);
        })
        .then(response => {
          store.items = response;
          store.toggleCreatingNew();
          render();
        })
        .catch(err => {
          console.log(err);
        });
    });
  };

  function handleItemSearchSubmit() {
    $('.js-search-form').on('submit', event => {
      event.preventDefault();

      store.currentQuery.searchTerm = $(event.currentTarget).find('input').val();

      api.search('/api/items', store.currentQuery)
        .then(response => {
          store.items = response;
          render();
        })
        .catch(err => {
          console.log(err);
        });
    });
  }

  function handleFilterCategory(){
    $('.js-filter-category-dropdown').change(event=>{
      store.currentQuery.searchCategory = $(event.currentTarget).val();
      api.search('/api/items', store.currentQuery)
        .then(response => {
          store.items = response;
          render();
        })
        .catch(err => {
          console.log(err);
        });
      //render
      render();
    });
  }

  function handleFilterSubcategory(){
    $('.js-filter-subcategory-dropdown').change(event=>{
      store.currentQuery.searchSubcategory = $(event.currentTarget).val();
      api.search('/api/items', store.currentQuery)
        .then(response => {
          store.items = response;
          render();
        })
        .catch(err => {
          console.log(err);
        });
      //render
      render();
    });
  }

  //handles user wanting to delete an item
  const handleDeleteItem = function(){
    //event listener for when user clicks on trash icon 
    $('.js-feed-list').on('click', '.js-delete-item', event=>{
      //first make sure they really want to delete 
      const delete_confirm = confirm('Are you sure you want to delete this item?');
      //if they confirm, go forward to delete
      if(delete_confirm){
      //figure out which item we're deleting - get its id 
        const itemId = getIdFromItem(event.target);
        //make a request to server to delete it from the server (it doesnt return anything)
        api.remove(`/api/items/${itemId}`)
          .then(() => {
            return api.search('/api/items', store.currentQuery);
          })
          .then(response => {
            store.items = response;
            render();
          })
          .catch(err => {
            console.log(err);
          });
      }
    });
  };


  function bindEventListeners() {
    handleAddItem();
    handleCancelAddItem();
    handleClickingClose();
    handleCreateItem();
    handleItemSearchSubmit();
    handleFilterCategory();
    handleFilterSubcategory();
    handleDeleteItem();
  }

  // This object contains the only exposed methods from this module:
  return {
    render,
    bindEventListeners,
  };

}());
