import {Injectable, TemplateRef} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {BsModalService, BsModalRef} from 'ngx-bootstrap/modal';
import {Observable} from 'rxjs';
import {AlertComponent} from './modals/alert/alert.component';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  modalRef: BsModalRef;

  constructor(private toastr: ToastrService, private modalService: BsModalService) {}

  private toastrSettings = {
    closeButton: true,
    progressBar: true
  };

  showErrorMessage(title: string, message: string) {
    this.toastr.error(message, `💣 ${title}`, this.toastrSettings);
  }

  showSuccessMessage(title: string, message: string) {
    this.toastr.success(message, `☑️ ${title}`, this.toastrSettings);
  }

  showInfoMessageWithConfirmation(message: string) {
    alert(message);
  }

  showConfirmationDialog(message: string, template: TemplateRef<any>) {
    alert(message);
  }

  showAlert(title: string, message: string): Observable<string> {
    const initialState = {
      title,
      message
    };
    this.modalRef = this.modalService.show(AlertComponent, {initialState});

    return new Observable<string>(this.getAlertSubscriber());
  }

  getAlertSubscriber() {
    return (observer) => {
      const subscription = this.modalService.onHidden.subscribe(() => {
        observer.complete();
      });

      return {
        unsubscribe() {
          subscription.unsubscribe();
        }
      };
    };
  }
}
