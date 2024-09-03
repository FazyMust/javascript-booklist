class Book {
  constructor(title, author, isbn) {
    this.title = title
    this.author = author
    this.isbn = isbn
  }
}

class UI {
  addBookToList(book) {
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

  deleteBook(target) {
    if (target.classList.contains('delete')) {
      target.parentElement.parentElement.remove()
    }
  }

  clearFields() {
    document.getElementById('title').value = ''
    document.getElementById('author').value = ''
    document.getElementById('isbn').value = ''
  }

  showAlert(message, className) {
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
}

// Local Storage Class
class Store {
  static getBooks() {
    let books
    if (localStorage.getItem('books') === null) {
      books = []
    } else {
      books = JSON.parse(localStorage.getItem('books'))
    }

    return books
  }

  static displayBooks() {
    const books = Store.getBooks()

        books.forEach(function(book) {
          const ui = new UI()

          // Add book to UI
          ui.addBookToList(book)
        })
  }

  static addBook(book) {
    const books = Store.getBooks()
    if (Array.isArray(books)) {
      books.push(book)
      localStorage.setItem('books', JSON.stringify(books))
    } else {
      console.error('Books is not an array:', books)
    }
  }

  static removeBook(isbn) {
    const books = Store.getBooks()
    
    const updatedBooks = books.filter(book => book.isbn !== isbn)
    
    localStorage.setItem('books', JSON.stringify(updatedBooks))
  }
}

// DOM lord Event
document.addEventListener('DOMContentLoaded',Store.displayBooks)

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
