

export interface Author {
  author_id: string;
  name: string;
}

//export interface Book {
//  _id: string;
//  title: string;
//  description: string;
//  genre: string;
//  author: Author;
//  coverImage: string;
//  file: string;
//  createdAt: string;
//}

export interface Book {
  book_id: string;
  name: string;
  description: string;
  book_category_id: string;
  author: Author;
  coverImageUrl: string;
  coverImage: string;
  fileUrl: string;
  file: string;
  createdBy: string;
  createdAt: string;
  book_category_name: string;
  author_id: string;
  author_name: string;
}

export interface BookCategory {
  book_category_id: string;
  name: string;
  description: string;
}

export interface Class {
  class_id: string;
  name: string;
  name_numeric: string;
  teacher_id: string;
}

export interface Subject {
  subject_id: string;
  name: string;
  class_id: string;
  teacher_id: string;
}