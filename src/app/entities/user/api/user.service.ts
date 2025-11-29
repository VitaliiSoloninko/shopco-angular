import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { CreateUserDto } from '../../../data/users.data';
import { PROFILE_URL, USERS_URL } from '../../../urls';
import { UpdateUserDto, User, UserProfile } from '../model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getProfile(): Observable<UserProfile> {
    return this.http
      .get<User>(PROFILE_URL)
      .pipe(map((user) => this.mapUserToProfile(user)));
  }

  updateProfile(updateData: UpdateUserDto): Observable<UserProfile> {
    return this.http
      .patch<User>(PROFILE_URL, updateData)
      .pipe(map((user) => this.mapUserToProfile(user)));
  }

  /**
   * Get user by ID (admin only)
   */
  getUserById(id: number): Observable<UserProfile> {
    return this.http
      .get<User>(`${USERS_URL}/${id}`)
      .pipe(map((user) => this.mapUserToProfile(user)));
  }

  /**
   * Get all users (admin only)
   */
  getAllUsers(): Observable<UserProfile[]> {
    return this.http
      .get<User[]>(USERS_URL)
      .pipe(map((users) => users.map((user) => this.mapUserToProfile(user))));
  }

  /**
   * Create user (admin only)
   */
  createUser(userData: CreateUserDto): Observable<UserProfile> {
    return this.http
      .post<User>(USERS_URL, userData)
      .pipe(map((user) => this.mapUserToProfile(user)));
  }

  /**
   * Update user (admin only)
   */
  updateUser(id: number, userData: UpdateUserDto): Observable<UserProfile> {
    return this.http
      .patch<User>(`${USERS_URL}/${id}`, userData)
      .pipe(map((user) => this.mapUserToProfile(user)));
  }

  /**
   * Delete user (admin only)
   */
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${USERS_URL}/${id}`);
  }

  /**
   * Get users count (admin only)
   */
  getUsersCount(): Observable<number> {
    return this.getAllUsers().pipe(map((users) => users.length));
  }

  /**
   * Map User to UserProfile (remove sensitive data)
   */
  private mapUserToProfile(user: User): UserProfile {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      street: user.street,
      city: user.city,
      postalCode: user.postalCode,
      country: user.country,
      role: user.role,
      isActive: user.isActive,
      fullName: `${user.firstName} ${user.lastName}`.trim(),
    };
  }
}
