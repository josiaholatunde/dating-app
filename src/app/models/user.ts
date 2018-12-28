import { Photo } from './photo';

export interface User {
  id: number;
  username: string;
  gender: string;
  age: number;
  knownAs: string;
  created: Date;
  lastActive: Date;
  city: string;
  country: string;
  photoUrl: string;
  lookingFor?: string;
  introduction?: string;
  interests?: string;
  photos?: Photo[];
}
