import { inject, Injectable,  } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  UserCredential,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _auth = inject(Auth);
  constructor() {}

  login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this._auth, email, password);
  }

  register(email: string, password: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(this._auth, email, password);
  }

  recover(email: string): Promise<void> {
    return sendPasswordResetEmail(this._auth, email);
  }

  logout(): Promise<void> {
    return signOut(this._auth);
  }
}
