import {Component, OnInit, OnDestroy, AfterContentChecked, ChangeDetectorRef} from '@angular/core';
import {FormGroup, FormControl} from '@angular/forms';
import {NotificationService} from '../shared/notification.service';
import {UserService} from '../shared/user.service';
import {Subscription} from 'rxjs';
import {UserData, UserInformation} from '../shared/models';
import {SpinnerService} from '../shared/spinner.service';

@Component({
  selector: 'app-edit-information',
  templateUrl: './edit-information.component.html',
  styleUrls: ['./edit-information.component.css']
})
export class EditInformationComponent implements OnInit, OnDestroy, AfterContentChecked {
  userInfoForm: FormGroup;
  private subscription: Subscription;
  private userData: UserData;
  constructor(
    private notificationService: NotificationService,
    private spinnerService: SpinnerService,
    private userService: UserService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.userInfoForm = new FormGroup({
      phoneNumber: new FormControl(''),
      address: new FormControl(''),
      occupation: new FormControl('')
    });

    this.subscription = this.userService.statusChange.subscribe((userData) => {
      if (userData) {
        this.userData = userData;
        console.log(userData);
        this.spinnerService.showMainSpinner();
        this.userService
          .getUserInfoFromFirebaseWithId(userData.id)
          .then((userInfo: UserInformation) => {
            console.log(userInfo);
            this.userInfoForm.get('address').patchValue(userInfo.address),
              this.userInfoForm.get('occupation').patchValue(userInfo.occupation),
              this.userInfoForm.get('phoneNumber').patchValue(userInfo.phoneNumber);
            this.spinnerService.hideMainSpinner();
          })
          .catch((error) => {
            this.notificationService.showInfoMessageWithConfirmation(error);
            this.spinnerService.hideMainSpinner();
          });
      }
    });
  }

  ngAfterContentChecked(): void {
    this.cdRef.detectChanges();
  }

  onSubmit() {
    const userInfo: UserInformation = {
      address: this.userInfoForm.get('address').value,
      occupation: this.userInfoForm.get('occupation').value,
      phoneNumber: this.userInfoForm.get('phoneNumber').value
    };
    this.spinnerService.showMainSpinner();
    this.userService
      .updateUserInfo(this.userData, userInfo)
      .then(() => {
        this.notificationService.showInfoMessageWithConfirmation(
          'Se actualizo la información correctamente'
        );
        this.spinnerService.hideMainSpinner();
      })
      .catch((error) => {
        this.notificationService.showInfoMessageWithConfirmation(error);
        this.spinnerService.hideMainSpinner();
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
