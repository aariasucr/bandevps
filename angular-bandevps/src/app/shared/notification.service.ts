import {Injectable} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private mySubject = new Subject<any>();

  public emmitter = this.mySubject.asObservable();

  constructor(private toastr: ToastrService) {}

  private toastrSettings = {
    closeButton: true,
    progressBar: true
  };

  showErrorMessage(title: string, message: string) {
    this.toastr.error(message, '💣 ' + title, this.toastrSettings);
  }

  showSuccessMessage(title: string, message: string) {
    this.toastr.success(message, `☑️ ${title}`);
  }

  // banners
  displayBanner(type: string, message: string) {
    this.mySubject.next({type, message});
  }
}
