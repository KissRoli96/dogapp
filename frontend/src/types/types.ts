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


export enum ReviewStatus {
  Pending = 'pending',
  Published = 'published',
  Reject = 'rejected'
}
  
  
  export interface Review {
    _id: string;
    user: string; // ObjectId
    service: string; // ObjectId
    content: string;
    date: Date;
    rating: number;
    status: ReviewStatus;
  }
  
  export interface Dog {
    _id: string;
    name: string;
    gender: 'male' | 'female';
    breed: string;
    weight: number;
    age: number;
    owner: string; // ObjectId
    picture: string
  }
  
  export interface Appointment {
    startTime: string;
    endTime: string;
    date: string;
    status: AppointmentStatus;
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

export enum AppointmentStatus {
  Pending = 'pending',
  Confirmed = 'confirmed',
  Cancelled = 'cancelled'
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
    duration: number;
  }

  export interface ErrorResponse {
    error: string;
}