const STORAGE_KEY = 'BOOKSSHELF_STORAGE'
const RENDER_DATA_BOOKS = new Event('RENDER_DATA_BOOKS')
const RENDER_SEARCH_DATA_BOOKS =  new Event('RENDER_SEARCH_DATA_BOOKS')
const books = []

function isStorageExist(){
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage')
    return false
  }
  return true
}

function generateId() {
    return +new Date();
  }
  
  function generateTodoObject(id, title, author, year, isComplete) {
    return {
      id,
      title,
      author,
      year,
      isComplete
    }
  }

window.addEventListener('DOMContentLoaded', function (){

  const bookSubmit = document.getElementById('inputBook')
  bookSubmit.addEventListener('submit', function (e) {
    e.preventDefault()
    const textTitle = document.getElementById('inputBookTitle').value
    const textWriter = document.getElementById('inputBookAuthor').value
    const textYear = parseInt(document.getElementById('inputBookYear').value)
    const isComplete = document.getElementById('checkedIscompleted').checked
    const valueIsCompleted = isComplete ? isComplete : isComplete 

    const idBook = generateId()
    const newBookData = generateTodoObject(idBook, textTitle, textWriter, textYear, valueIsCompleted)
    books.push(newBookData)
    document.dispatchEvent(RENDER_DATA_BOOKS);
    saveData()
   
  })
  if(isStorageExist){
    loadDataFromStorage(); 
  }
})

document.addEventListener('RENDER_DATA_BOOKS', function () {
  const incompleteBookshelfList = document.getElementById('incompleteBookshelfList')
  const completeBookshelfList = document.getElementById('completeBookshelfList')

  incompleteBookshelfList.innerHTML = ""
  completeBookshelfList.innerHTML = ""

  books.forEach( book =>  {
    const bookElement = makeBookElement(book)
    if (book.isComplete) {
      completeBookshelfList.append(bookElement)
    }else{
      incompleteBookshelfList.append(bookElement)
    }
  })
})

function makeBookElement(book) {
 const  {id, title, author, year, isComplete} = book

  const book_list = document.createElement('div')
  book_list.classList.add('book_list')

  const article = document.createElement('article')
  article.classList.add('book_item')

  const icontext = document.createElement('div')
  icontext.classList.add('icon-text')

  const img = document.createElement('img')
  img.setAttribute('src','assets/book-solid.svg')

  const text = document.createElement('div')
  text.classList.add('text')

  const textTitle = document.createElement('h3')
  textTitle.innerText = title
  
  const textWriter = document.createElement('p')
  textWriter.innerText = author
  
  const textYear = document.createElement('p')
  textYear.innerText = year

  const buttons = document.createElement('div')
  buttons.classList.add('action')

  text.append(textTitle,textWriter,textYear)

  icontext.append(img, text)

  article.append(icontext, buttons)

  book_list.append(article)
  if (isComplete) {
    const buttonF = document.createElement('div')
    const buttonED = document.createElement('div')  

    const buttonUnfinish = document.createElement('button')
    buttonUnfinish.classList.add('green')
    buttonUnfinish.innerText = "Belum Selesai"
    buttonUnfinish.addEventListener('click', function () {
      unfinishRead(id)
    })
    
    const buttonDelete = document.createElement('img')
    buttonDelete.setAttribute('src', 'assets/trash-solid.svg')
    buttonDelete.addEventListener('click', function () {
      deleteData(id)
    })

    const buttonEdit = document.createElement('img')
    buttonEdit.setAttribute('src', 'assets/pen-to-square-solid.svg')
    buttonEdit.addEventListener('click', function () {
      editData(id)
    })
    buttonF.append(buttonUnfinish)
    buttonED.append(buttonEdit, buttonDelete)
    buttons.append(buttonF, buttonED)

  }else{
    const buttonF = document.createElement('div')
    const buttonED = document.createElement('div') 
    const buttonFinish = document.createElement('button')
    buttonFinish.classList.add('green')
    buttonFinish.innerText = "Selesai"
    buttonFinish.addEventListener('click', function () {
      finishRead(id)
    })
    
    const buttonDelete = document.createElement('img')
    buttonDelete.setAttribute('src', 'assets/trash-solid.svg')
    buttonDelete.addEventListener('click', function () {
      deleteData(id)
    })

    const buttonEdit = document.createElement('img')
    buttonEdit.setAttribute('src', 'assets/pen-to-square-solid.svg')
    buttonEdit.addEventListener('click', function () {
      editData(id)
    })

    buttonF.append(buttonFinish)
    buttonED.append(buttonEdit, buttonDelete)
    buttons.append(buttonF, buttonED)
  }

return article
}

function unfinishRead(id) {
  const dataBook = findBook(id)
  dataBook.isComplete = false
  document.dispatchEvent(RENDER_DATA_BOOKS)
  saveData()
}

function finishRead(id) {
  const dataBook = findBook(id)
  dataBook.isComplete = true
  document.dispatchEvent(RENDER_DATA_BOOKS)
  saveData()
}

function deleteData(id) {
    for (let i = 0; i < books.length; i++) {
       if (books[i].id === id) { 
        books.splice(i, 1)
        }      
    }
    document.dispatchEvent(RENDER_DATA_BOOKS)
    saveData()
}

function editData(id_book) {
  document.querySelector('.input_edit_cart').removeAttribute('hidden','')
  document.querySelector('.cover').removeAttribute('hidden','')
  
  const dataBook = findBook(id_book)
  const {id, title, author, year, isComplete} = dataBook
  document.getElementById('idBook_edit').setAttribute('value', id)
  document.getElementById('inputBookTitleEdit').setAttribute('value', title)
  document.getElementById('inputBookAuthorEdit').setAttribute('value', author)
  document.getElementById('inputBookYearEdit').setAttribute('value', year)

  const checked = document.getElementById('inputBookIsCompleteEdit')
  if (isComplete) {
       checked.setAttribute('checked', 'checked')
    }else{
      checked.removeAttribute('checked');
  }
}

const xmark = document.querySelector('.xmark')
xmark.addEventListener('click', function () {
  document.querySelector('.input_edit_cart').setAttribute('hidden','')
  document.querySelector('.cover').setAttribute('hidden','')
  document.querySelector('#inputBook_edit').reset()
})

const btnEdit =  document.getElementById('inputBook_edit')
btnEdit.addEventListener('submit', function (e) {
  e.preventDefault()
  const idBook = parseInt(document.getElementById('idBook_edit').value)
  const textTitle = document.getElementById('inputBookTitleEdit').value
  const textAuthor = document.getElementById('inputBookAuthorEdit').value
  const textYear = parseInt(document.getElementById('inputBookYearEdit').value)
  const textIsComplete = document.getElementById('inputBookIsCompleteEdit').checked
  const CheckedisComplete = textIsComplete ? textIsComplete : textIsComplete
  const dataBook = findBook(idBook)
  
  dataBook.title = textTitle
  dataBook.author = textAuthor
  dataBook.year = textYear
  dataBook.isComplete = CheckedisComplete

  document.dispatchEvent(RENDER_DATA_BOOKS)
  saveData()

  document.querySelector('.input_edit_cart').setAttribute('hidden','')
  document.querySelector('.cover').setAttribute('hidden','')
  btnEdit.reset()
  
})

function findBook(id) {
  for (const book of books) { 
    if (book.id === id) { 
      return book;
    }
  }
}

function saveData() {
  if(isStorageExist){
    const dataBooks = JSON.stringify(books)
    localStorage.setItem(STORAGE_KEY, dataBooks)
  }
}

function loadDataFromStorage() {
    const dataBooksFromStorage = localStorage.getItem(STORAGE_KEY)
    const dataBooks = JSON.parse(dataBooksFromStorage)
    if (dataBooks !== null) {
      dataBooks.forEach(dataBook => {
        books.push(dataBook);
      })
    }
    document.dispatchEvent(RENDER_DATA_BOOKS)
}

  const FormSearch = document.getElementById('searchBook')
  FormSearch.addEventListener('submit', function (e) {
    e.preventDefault();
    document.dispatchEvent(RENDER_SEARCH_DATA_BOOKS)
  })

  document.addEventListener('RENDER_SEARCH_DATA_BOOKS', function () {
  const incompleteBookshelfList = document.getElementById('incompleteBookshelfList')
  const completeBookshelfList = document.getElementById('completeBookshelfList')
    
  incompleteBookshelfList.innerHTML = ""
  completeBookshelfList.innerHTML = ""
  
  const dataSearch = document.getElementById('searchBookTitle').value

  const dataBook = findSeacrhBook(dataSearch)
  if (dataBook) {
    const bookElement = makeBookElement(dataBook)
    if (dataBook.isComplete) {
      completeBookshelfList.append(bookElement)
    }else{
      incompleteBookshelfList.append(bookElement)
    }
  }else{
    incompleteBookshelfList.innerHTML = "Data tidak ditemukan"
    completeBookshelfList.innerHTML = "Data tidak ditemukan"
  }
})

function findSeacrhBook(data) {
  for (const book of books) { 
    if (book.title == data) { 
      return book
    }
  }
}

