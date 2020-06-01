import {Injectable} from '@angular/core';
import {NgxSpinnerService} from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  constructor(private spinner: NgxSpinnerService) {}

  showMainSpinner() {
    this.spinner.show('mainSpinner');
  }

  hideMainSpinner() {
    this.spinner.hide('mainSpinner');
  }
}
