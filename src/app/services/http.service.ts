import { Injectable } from '@angular/core';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment as env } from 'src/environments/environment';
import { catchError, Observable, throwError } from 'rxjs';
import { Currency } from '../model';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient) {}

  getCurrentNBUData(): Observable<Array<Currency>> {
    return this.http
      .get<Array<Currency>>(env.NBUCurency_URL)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 404) {
      return throwError(() => new Error('Not found'));
    }
    return throwError(() => new Error('Error happend'));
  }
}