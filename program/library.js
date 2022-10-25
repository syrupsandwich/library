let myLibrary = [];

function book(title, author, length, status) {
  this.title = title;
  this.author = author;
  this.length = length;
  this.status = status;
}

book.prototype.info = function() {
  return (`${this.title} by ${this.author}, ${this.length} pages, ${this.status}`);
}

function addBookToLibrary(inputTitle, inputAuthor, inputPages, inputStatus) {
  myLibrary.push(new book(inputTitle, inputAuthor, inputPages, inputStatus));
  myLibrary[myLibrary.length - 1].prototype = Object.create(book.prototype);
}

let successOneDayAtATime = new book('Success one day at a time', 'John C. Maxwell', 126, 'read');
successOneDayAtATime.prototype = Object.create(book.prototype);
myLibrary.push(successOneDayAtATime);

let javascriptDefinitiveGuide = new book('JavaScript: The Definitive Guide', 'David Flanagan', 807, 'not yet read');
javascriptDefinitiveGuide.prototype = Object.create(book.prototype);
myLibrary.push(javascriptDefinitiveGuide);

let mossflower = new book('Mossflower', 'Brian Jacques', 500, 'partially read');
mossflower.prototype = Object.create(book.prototype);
myLibrary.push(mossflower);

let theWayOfMen = new book('The Way of Men', 'Jack Donovan', 192, 'read');
theWayOfMen.prototype = Object.create(book.prototype);
myLibrary.push(theWayOfMen);

let aMindForNumbers = new book('A Mind for Numbers', 'Barbara Oakley, Ph.D.', 332, 'read');
aMindForNumbers.prototype = Object.create(book.prototype);
myLibrary.push(aMindForNumbers);

let myLibraryTable = document.querySelector('.shelf');

myLibrary.forEach((element) => {
  createRow(element);
})

let tableInput = function(){
  this.textInputTitle = document.createElement('input');
  this.textInputAuthor = document.createElement('input');
  this.textInputLength = document.createElement('input');
  this.textInputStatus = document.createElement('input');
}

let addBookBtn = document.querySelector('.add-book');
let saveBookBtn = document.querySelector('.save');

addBookBtn.addEventListener('click', function(){
  if (highlightedBookRow !== ''){
    editBookBtn.disabled = true;
    removeBookBtn.disabled = true;
    highlightedBookRow.classList.remove('selected');
    highlightedBookRow = '';
  }
  createFormInputs(new tableInput());
  addBookBtn.disabled = true;
  saveBookBtn.disabled = false;
  cancelEditingBtn.disabled = false;
  editMode = true;
  bookIndex = '';
});

function createFormInputs(element){
  let tableRow = document.createElement('tr');
  for(prop in element){
    let cell = document.createElement('td');
    let input = document.createElement('input');
    input.className = [`${prop}`];
    input.setAttribute('type', `${prop.match(/[a-z]*(?=[A-Z])?/)}`);
    input.required = true;
    cell.appendChild(input);
    tableRow.appendChild(cell);
  }
  myLibraryTable.insertBefore(tableRow, myLibraryTable.children[0]);
}

saveBookBtn.addEventListener('click', function(){
  let inputs = document.querySelectorAll('input');
  let inputsArray = Array.from(inputs);
  if (inputsArray.some((element) => element.value === '')){return};
  if (bookIndex === ''){
    let newBook = new book(`${inputs[0].value}`,`${inputs[1].value}`,`${inputs[2].value}`,`${inputs[3].value}`);
    newBook.prototype = Object.create(book.prototype);
    myLibrary.push(newBook);
    createRow(newBook);
    inputs[0].parentNode.parentNode.remove();
  } else {
    updateLibraryBook(inputs);
    replaceInputs(inputsArray);
    document.getElementById(`${bookIndex}`).classList.remove('selected');
    bookIndex = '';
  }
  cancelEditingBtn.disabled = true;
  highlightedBookRow = '';
  saveBookBtn.disabled = true;
  addBookBtn.disabled = false;
  editMode = false;
  checkIndexSync();
})

function updateLibraryBook(inputs){
  myLibrary[bookIndex].title = inputs[0].value;
  myLibrary[bookIndex].author = inputs[1].value;
  myLibrary[bookIndex].length = inputs[2].value;
  myLibrary[bookIndex].status = inputs[3].value;
};

function replaceInputs(inputsArray){
  for(let i = 0; i < inputsArray.length; i++){
    let input = inputsArray[i].value;
    let inputContainer = inputsArray[i].parentNode;
    inputContainer.children[0].remove();
    inputContainer.textContent = input;
  }
};

function createRow(element) {
  let tableRow = document.createElement('tr');
  tableRow.id = myLibrary.indexOf(element);
  for(prop in element){
    if(tableRow.childElementCount < 4){
      let cell = document.createElement('td');
      cell.textContent = element[prop];
      tableRow.appendChild(cell);
    }
  }
  myLibraryTable.appendChild(tableRow);
}

let bookIndex = '';
let editMode = false;

let editBookBtn = document.querySelector('.edit');
let cancelEditingBtn = document.querySelector('.cancel');

editBookBtn.addEventListener('click', function(){
  removeBookBtn.disabled = true;
  if(editMode === false){
    saveRowData();
    editMode = true;
    editBookBtn.disabled = true;
    cancelEditingBtn.disabled = false;
    addBookBtn.disabled = true;
    if (highlightedBookRow.children[0].nodeName !== 'TD'){return};
    bookIndex = highlightedBookRow.id;
    let cells = Array.from(highlightedBookRow.children);
    cells.forEach(element => {
      let text = element.textContent;
      element.textContent = '';
      element.appendChild(document.createElement('input'));
      element.children[0].value = `${text}`;
    });
    bookIndex = bookIndex;
    saveBookBtn.disabled = false;
  };
});

let backupRowData = [];

function saveRowData() {
  backupRowData = [];
  Array.from(highlightedBookRow.childNodes).forEach(cell => {
    backupRowData.push(cell.textContent);
  });
};

cancelEditingBtn.addEventListener('click', function(){
  if(highlightedBookRow === ''){
    myLibraryTable.children[0].remove();
  } else {
  restoreRow();
  }
  highlightedBookRow = '';
  saveBookBtn.disabled = true;
  addBookBtn.disabled = false;
  editMode = false;
  cancelEditingBtn.disabled = true;
});

function restoreRow() {
  Array.from(highlightedBookRow.childNodes).forEach(cell => {
    cell.children[0].remove();
    cell.textContent = backupRowData.shift();
  });
  highlightedBookRow.classList.remove('selected');
  cancelEditingBtn.disabled = true;
};

let removeBookBtn = document.querySelector('.remove-book');

removeBookBtn.addEventListener('click', function(){
  editBookBtn.disabled = true;
  highlightedBookRow.remove();
  bookIndex = highlightedBookRow.id;
  removeBookBtn.disabled = true;
  myLibrary.splice(bookIndex, 1);
  decrementEachRowId();
  checkIndexSync();
  highlightedBookRow = '';
});

let highlightedBookRow = '';

myLibraryTable.addEventListener('click', function(e){
  if (editMode === true){return};
  if (e.target.nodeName !== 'TD'){return};
  if(switchToNewSelection(e)){return};
  if(unselectSameRow(e)){return};
  removeBookBtn.disabled = false;
  e.target.parentNode.classList.add('selected');
  editBookBtn.disabled = false;
  highlightedBookRow = e.target.parentNode;
});

function switchToNewSelection(e){
  if(highlightedBookRow !== '' && e.target.parentNode !== highlightedBookRow){
    highlightedBookRow.classList.remove('selected');
    e.target.parentNode.classList.add('selected');
    highlightedBookRow = e.target.parentNode;
    return true;
  } else {
    return false;
  };
};

function unselectSameRow(e){
  if (removeBookBtn.disabled === false){
    e.target.parentNode.classList.remove('selected');
    editBookBtn.disabled = true;
    removeBookBtn.disabled = true;
    highlightedBookRow = '';
    return true;
  } else {
    return false;
  };
};

function checkIndexSync(){
  let rows = Array.from(myLibraryTable.childNodes);
  rows.forEach(function(row){
    if(row.nodeName === 'TR' && row.children[0].textContent !== myLibrary[row.id].title){
      console.log('error: row element id does not correspond to myLibrary book index');
      console.log(row);
      console.log(myLibrary);
      return;
    };
  });
};

function decrementEachRowId(){
  let rows = Array.from(myLibraryTable.childNodes);
  rows.forEach(function(row){
    if(row.nodeName === 'TR' && +row.id > bookIndex){
      row.id = `${+row.id - 1}`;
    };
  });
};
