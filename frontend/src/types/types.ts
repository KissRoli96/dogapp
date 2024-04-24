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
    status: 'pending' | 'confirmed' | 'cancelled';
    notes: string;
    service: string; // ObjectId
    dog: string; // ObjectId
    user: string; // ObjectId
  }
  
  export interface Application {
    lastName: string;
    firstName: string;
    dateOfBirth: Date;
    placeOfBirth: string;
    motivation: string;
    cv: string;
    email: string;
    phoneNumber: string;
  }