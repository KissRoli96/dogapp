export interface User {
  _id: { $oid: string };
  username: string;
  email: string;
  password: string;
  createdAt: { $date: string };
  updatedAt: { $date: string };
  roles: string[];
  profile: {
    firstName: string;
    lastName: string;
    age: number;
    phoneNumber: string;
    address: {
      city: string;
      country: string;
    };
  };
  __v: number;
}
  
  export interface Review {
    user: string; // ObjectId
    service: string; // ObjectId
    content: string;
    date: Date;
    rating: number;
  }
  
  export interface Dog {
    name: string;
    gender: 'male' | 'female';
    breed: string;
    age: number;
    owner: string; // ObjectId
  }
  
  export interface Appointment {
    date: Date;
    time: string;
    duration: number;
    status: Status;
    notes: string;
    service: string; // ObjectId
    dog: string; // ObjectId
    user: string; // ObjectId
  }

  export enum Status {
    Pending = 'pending',
    Accepted = 'accepted',
    Rejected = 'rejected'
}
  
  export interface Application {
    _id: string;
    lastName: string;
    firstName: string;
    dateOfBirth: string;
    placeOfBirth: string;
    motivation: string;
    cv: string;
    email: string;
    phoneNumber: string;
    status: Status;
  }

  export interface Service {
    _id: string;
    name: string;
    description: string;
    price: number;
    __v: number;
    // Add any other fields you might have
  }

  export interface ErrorResponse {
    error: string;
}