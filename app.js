// Book Constructor
function Book(title, author, isbn) {
  this.title = title
  this.author = author
  this.isbn = isbn
}

// UI Constructor
function UI() {}

// Add Book to list
UI.prototype.addBookToList = function (book) {
  const list = document.getElementById('book-list')
  const row = document.createElement('tr')

  row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href="#" class="delete">X</a></td>
  `

  list.appendChild(row)
}

// Delete Book from list
UI.prototype.deleteBook = function (target) {
  if (target.classList.contains('delete')) {
    target.parentElement.parentElement.remove()
  }
}

// Clear Fields
UI.prototype.clearFields = function () {
  document.getElementById('title').value = ''
  document.getElementById('author').value = ''
  document.getElementById('isbn').value = ''
}

UI.prototype.showAlert = function (message, className) {
  // Create a div
  const alert = document.createElement('div')

  // Add Class names
  alert.className = `alert ${className}`

  // Add text content
  alert.appendChild(document.createTextNode(message))

  // Insert it into the dom element
  const container = document.querySelector('.container')
  const form = document.querySelector('#book-form')

  // Insert alert before form
  container.insertBefore(alert, form)

  // set time out
  setTimeout(function () {
    alert.remove()
  }, 3000)
}

// Store Constructor
function Store() {}

// Get books from local storage
Store.prototype.getBooks = function () {
  var books
  if (localStorage.getItem('books') === null) {
    books = []
  } else {
    books = JSON.parse(localStorage.getItem('books'))
  }
  return books
}

// Display books in the UI
Store.prototype.displayBooks = function () {
  var books = Store.prototype.getBooks()

  books.forEach(function (book) {
    var ui = new UI()

    // Add book to UI
    ui.addBookToList(book)
  })
}

// Add a new book to local storage
Store.prototype.addBook = function(book) {
  var books = Store.prototype.getBooks()
  if (Array.isArray(books)) {
    books.push(book)
    localStorage.setItem('books', JSON.stringify(books))
  } else {
    console.error('Books is not an array:', books)
  }
}

// Remove a book from local storage
Store.prototype.removeBook = function(isbn) {
  var books = Store.prototype.getBooks()

  // Filter out the book with the matching ISBN
  var updatedBooks = books.filter(function(book) {
    return book.isbn !== isbn
  })

  // Update local storage with the filtered books
  localStorage.setItem('books', JSON.stringify(updatedBooks))
}


// Event Listners

// DOM lord Event
document.addEventListener('DOMContentLoaded', Store.displayBooks)

// Event Listener for add book
document.getElementById('book-form').addEventListener('submit', function (e) {
  // Prevent actual submit
  e.preventDefault()

  // Get form values
  const title = document.getElementById('title').value,
    author = document.getElementById('author').value,
    isbn = document.getElementById('isbn').value

  // Instantiate book
  const book = new Book(title, author, isbn)

  // Instantiate UI
  const ui = new UI()

  console.log(ui)

  // Validating input and adding it
  if (title === '' || author === '' || isbn === '') {
    // Error Alert
    ui.showAlert('Please fill in all fields below', 'error')
  } else {
    // Add book to list
    ui.addBookToList(book)

    // Add to local Storage
    Store.addBook(book)

    // alert success message
    ui.showAlert('Book Added Successfully', 'success')

    // Clear fields
    ui.clearFields()
  }
})

// Delete Book Event Listener
document.getElementById('book-list').addEventListener('click', function (e) {
  // Instantiate UI
  const ui = new UI()

  // Delete book
  ui.deleteBook(e.target)

  // Remove from local Storage
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent)

  // Alert success message
  ui.showAlert('Book Removed Successfully', 'success')

  // Prevent default click event
  e.preventDefault()
})
