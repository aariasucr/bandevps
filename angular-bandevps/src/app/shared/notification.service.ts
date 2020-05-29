import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor() {}

  showInfoMessageWithConfirmation(message: string) {
    alert(message);
  }
}
