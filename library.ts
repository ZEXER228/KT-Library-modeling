interface Reception {
  delivery(reader: Reader): void;
  receive(reader: Reader): void;
}

abstract class Publisher {
  private title: string;
  private author: string;
  private pubYear: number;
  private copies: number;

  constructor(title: string, author: string, pubYear: number, copies: number) {
    this.title = title;
    this.author = author;
    this.pubYear = pubYear;
    this.copies = copies;
  }

  getTitle(): string {
    return this.title;
  }

  setTitle(title: string): void {
    this.title = title;
  }

  getAuthor(): string {
    return this.author;
  }

  setAuthor(author: string): void {
    this.author = author;
  }

  getPubYear(): number {
    return this.pubYear;
  }

  setPubYear(year: number): void {
    this.pubYear = year;
  }

  getCopies(): number {
    return this.copies;
  }

  setCopies(copies: number): void {
    this.copies = copies;
  }

  increaseCopies(): void {
    this.copies++;
  }

  decreaseCopies(): void {
    this.copies--;
  }
}

class Book extends Publisher implements Reception {
  private pages: number;

  constructor(title: string, author: string, pubYear: number, copies: number, pages: number) {
    super(title, author, pubYear, copies);
    this.pages = pages;
  }

  getPages(): number {
    return this.pages;
  }

  setPages(pages: number): void {
    this.pages = pages;
  }

  delivery(reader: Reader): void {
    if (this.getCopies() <= 0) {
      console.log(`Книга "${this.getTitle()}" отсутствует.`);
      return;
    }

    if (!reader.canTakeMore()) {
      console.log(`${reader.getFirstName()} уже взял максимальное количество изданий.`);
      return;
    }

    reader.takeItem(this);
    this.decreaseCopies();
    console.log(`${reader.getFirstName()} получил книгу "${this.getTitle()}"`);
  }

  receive(reader: Reader): void {
    reader.returnItem(this);
    this.increaseCopies();
    console.log(`${reader.getFirstName()} вернул книгу "${this.getTitle()}"`);
  }
}

class Magazine extends Publisher implements Reception {
  private issue: number;

  constructor(title: string, author: string, pubYear: number, copies: number, issue: number) {
    super(title, author, pubYear, copies);
    this.issue = issue;
  }

  getIssue(): number {
    return this.issue;
  }

  setIssue(issue: number): void {
    this.issue = issue;
  }

  delivery(reader: Reader): void {
    if (this.getCopies() <= 0) {
      console.log(`Журнал "${this.getTitle()}" отсутствует.`);
      return;
    }

    if (!reader.canTakeMore()) {
      console.log(`${reader.getFirstName()} уже взял максимальное количество изданий.`);
      return;
    }

    reader.takeItem(this);
    this.decreaseCopies();
    console.log(`${reader.getFirstName()} получил журнал "${this.getTitle()}"`);
  }

  receive(reader: Reader): void {
    reader.returnItem(this);
    this.increaseCopies();
    console.log(`${reader.getFirstName()} вернул журнал "${this.getTitle()}"`);
  }
}

class Reader {
  private firstName: string;
  private lastName: string;
  private items: Publisher[] = [];
  private maxItems: number = 3;

  constructor(firstName: string, lastName: string) {
    this.firstName = firstName;
    this.lastName = lastName;
  }

  getFirstName(): string {
    return this.firstName;
  }

  setFirstName(name: string): void {
    this.firstName = name;
  }

  getLastName(): string {
    return this.lastName;
  }

  setLastName(name: string): void {
    this.lastName = name;
  }

  getItems(): Publisher[] {
    return this.items;
  }

  canTakeMore(): boolean {
    return this.items.length < this.maxItems;
  }

  takeItem(item: Publisher): void {
    this.items.push(item);
  }

  returnItem(item: Publisher): void {
    this.items = this.items.filter(i => i !== item);
  }

  printItems(): void {
    console.log(`Издания у ${this.firstName}:`);
    this.items.forEach(i => console.log(i.getTitle()));
  }
}

class Library {
  private items: Publisher[] = [];

  addItem(item: Publisher): void {
    this.items.push(item);
  }

  removeItem(title: string): void {
    this.items = this.items.filter(i => i.getTitle() !== title);
  }

  printLibrary(): void {
    console.log("Список изданий в библиотеке:");
    this.items.forEach(i => {
      console.log(i.getTitle());
    });
  }
}

const library = new Library();

const book1 = new Book("Война и мир", "Лев Толстой", 1869, 2, 1200);
const book2 = new Book("1984", "Джордж Оруэлл", 1949, 1, 350);
const magazine1 = new Magazine("Science", "AAAS", 2023, 2, 10);

library.addItem(book1);
library.addItem(book2);
library.addItem(magazine1);

library.printLibrary();

const reader1 = new Reader("Иван", "Иванов");

book1.delivery(reader1);
book2.delivery(reader1);
magazine1.delivery(reader1);

reader1.printItems();

book1.receive(reader1);

reader1.printItems();
library.printLibrary();