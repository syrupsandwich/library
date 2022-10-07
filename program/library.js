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
  let tableRow = document.createElement('tr');
  for(prop in element){
    if(tableRow.childElementCount < 4){
      let cell = document.createElement('td');
      cell.textContent = element[prop];
      tableRow.appendChild(cell);
    }
  }
  myLibraryTable.appendChild(tableRow);
})

let tableInput = function(){
  this.textInputTitle = document.createElement('input');
  this.textInputAuthor = document.createElement('input');
  this.textInputLength = document.createElement('input');
  this.textInputStatus = document.createElement('input');
}

let addBookBtn = document.querySelector('.add-book');

addBookBtn.addEventListener('click', function(){
  createFormInputs(new tableInput());
  addBookBtn.disabled = true;
});

function createFormInputs(element){
  let tableRow = document.createElement('tr');
  for(prop in element){
    let cell = document.createElement('td');
    let input = document.createElement('input');
    input.className = [`${prop}`]
    input.setAttribute('type', `${prop.match(/[a-z]*(?=[A-Z])?/)}`)
    cell.appendChild(input);
    tableRow.appendChild(cell);
  }
  myLibraryTable.insertBefore(tableRow, myLibraryTable.children[3]);
}
