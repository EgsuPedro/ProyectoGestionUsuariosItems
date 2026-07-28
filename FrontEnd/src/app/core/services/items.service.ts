import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Item, CreateItemRequest, UpdateItemRequest } from '../models/item.models';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrls.items}/items`;

  getAll(): Observable<Item[]> {
    return this.http.get<Item[]>(this.apiUrl);
  }

  getById(id: number): Observable<Item> {
    return this.http.get<Item>(`${this.apiUrl}/${id}`);
  }

  create(item: CreateItemRequest): Observable<Item> {
    return this.http.post<Item>(this.apiUrl, item);
  }

  update(id: number, item: UpdateItemRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, item);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}