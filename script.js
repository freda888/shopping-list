const itemForm = document.getElementById('item-form')
const itemInput = document.getElementById('item-input')
const itemList = document.getElementById('item-list')

const addItem = e => {
  e.preventDefault()

  const newItem = itemInput.value

  // check for content in the input - if it's empty we'll just return
  if (newItem === '') {
    alert('Please add an item')
    return
  }

  // create list item
  const li = document.createElement('li')
  li.appendChild(document.createTextNode(newItem))

  // set button to a function and pass in the classes the button needs
  const button = createButton('remove-item btn-link text-red')
  // add the button to the li
  li.appendChild(button)

  // add the li to the list
  itemList.appendChild(li)

  itemInput.value = ''
}

// here is our createButton function that takes in the classes it needs we passed in above - at the end, we return the button
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

// event listeners
itemForm.addEventListener('submit', addItem)
