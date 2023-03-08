const itemForm = document.getElementById('item-form')
const itemInput = document.getElementById('item-input')
const itemList = document.getElementById('item-list')
const clearBtn = document.getElementById('clear')
const itemFilter = document.getElementById('filter')
const formBtn = itemForm.querySelector('button')

// set a global variable to deal with state
let isEditMode = false

const displayItems = () => {
  const itemsFromStorage = getItemsFromStorage()
  itemsFromStorage.forEach(item => {
    addItemToDOM(item)
  })
  checkUI()
}

const onAddItemSubmit = e => {
  e.preventDefault()

  const newItem = itemInput.value

  // check for content in the input - if it's empty we'll just return
  if (newItem === '') {
    alert('Please add an item')
    return
  }

  addItemToDOM(newItem)
  addItemToStorage(newItem)
  checkUI()

  itemInput.value = ''
}

const addItemToDOM = item => {
  // create list item and pass in the value from the input (newItem)
  const li = document.createElement('li')
  li.appendChild(document.createTextNode(item))

  // set button to a function and pass in the classes the button needs
  const button = createButton('remove-item btn-link text-red')
  // add the button to the li
  li.appendChild(button)

  // add the li to the list
  itemList.appendChild(li)
}

// here is our createButton function that takes in the classes it needs that we passed in above - at the end, we return the button
const createButton = classes => {
  const button = document.createElement('button')
  button.className = classes
  // create and append the icon
  const icon = createIcon('fa-solid fa-xmark')
  button.appendChild(icon)
  return button
}

// we do the same for the icon inside the button
const createIcon = classes => {
  const icon = document.createElement('i')
  icon.className = classes
  return icon
}

const getItemsFromStorage = () => {
  let itemsFromStorage
  // if local storage is empty, set itemsFromStorage to an empty array, otherwise parse the strings and add the item(s) to the array
  if (localStorage.getItem('items') === null) {
    itemsFromStorage = []
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem('items'))
  }

  return itemsFromStorage
}

const addItemToStorage = item => {
  // itemsFromStorage is returned from getItemsFromStorage() above
  const itemsFromStorage = getItemsFromStorage()

  itemsFromStorage.push(item)

  // now we add the JSON objects in the array to local storage - we call the key items and values are the names of the items
  localStorage.setItem('items', JSON.stringify(itemsFromStorage))
}

const onClickItem = e => {
  // we want to remove the li when clicking the icon that is inside the button - we know the classes on the button so we'll check to see if what is clicked has the right class
  if (e.target.parentElement.classList.contains('remove-item')) {
    // if it's the element we want to remove, we call removeItem() passing in the item
    removeItem(e.target.parentElement.parentElement)
  }
  // if it's not the icon that was clicked, it was the li and we'll call a function that sets it to edit mode
  else {
    setItemToEdit(e.target)
  }
}

const setItemToEdit = item => {
  isEditMode = true

  itemList.querySelectorAll('li').forEach(i => i.classList.remove('edit-mode'))

  item.classList.add('edit-mode')
  formBtn.innerHTML = '<i class="fa-solid fa-pen"></i>   Update Item'
  formBtn.style.backgroundColor = '#228B22'
  itemInput.value = item.textContent
}

const removeItem = item => {
  if (confirm('Are you sure?')) {
    item.remove()

    removeItemFromStorage(item.textContent)

    checkUI()
  }
}

const removeItemFromStorage = item => {
  let itemsFromStorage = getItemsFromStorage()

  // filter item to be removed - will return a new array without the deleted item
  itemsFromStorage = itemsFromStorage.filter(i => i !== item)

  // reset to local storage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage))
}

const clearItems = e => {
  // itemList.innerHTML = ''
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild)
  }

  // clear from local storage
  localStorage.removeItem('items')

  checkUI()
}

const filterItems = e => {
  const text = e.target.value.toLowerCase()
  const items = itemList.querySelectorAll('li')

  items.forEach(item => {
    // the first child in the button is a text node with the name of the item
    const itemName = item.firstChild.textContent.toLocaleLowerCase()

    // indexOf is either true or -1, so it the item name matches the text in the input
    if (itemName.indexOf(text) != -1) {
      item.style.display = 'flex'
    } else {
      item.style.display = 'none'
    }
  })
}

// check the ui to see if there are items in the shopping list
const checkUI = () => {
  const items = itemList.querySelectorAll('li')
  if (items.length === 0) {
    clearBtn.style.display = 'none'
    itemFilter.style.display = 'none'
  } else {
    clearBtn.style.display = 'block'
    itemFilter.style.display = 'block'
  }
}

// Initialize app
const init = () => {
  // event listeners
  itemForm.addEventListener('submit', onAddItemSubmit)
  // here, we're putting a click event on the ul and will use event delegation in removeItem() to target individual list items
  itemList.addEventListener('click', onClickItem)
  clearBtn.addEventListener('click', clearItems)
  // we'll call filterItems every time the input event fires
  itemFilter.addEventListener('input', filterItems)

  // fire on page load and call displayItems()
  document.addEventListener('DOMContentLoaded', displayItems)

  checkUI()
}

init()
