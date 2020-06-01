import {Component, OnInit, OnDestroy} from '@angular/core';
import {NgForm, FormGroup, FormControl} from '@angular/forms';
import {NotificationService} from '../shared/notification.service';
import {UserService} from '../shared/user.service';
import {AngularFireAuth} from '@angular/fire/auth';
import {Subscription} from 'rxjs';
import { UserData } from '../shared/models';

@Component({
  selector: 'app-edit-information',
  templateUrl: './edit-information.component.html',
  styleUrls: ['./edit-information.component.css']
})
export class EditInformationComponent implements OnInit, OnDestroy {
  userInfoForm: FormGroup;
  private subscription: Subscription;
  private userData:UserData
  constructor(
    private notificationServie: NotificationService,
    //private spinnerService: SpinnerService,
    private userService: UserService,
    private firebaseAuth: AngularFireAuth
  ) {}

  ngOnInit() {
    this.userInfoForm = new FormGroup({
      phoneNumber: new FormControl(''),
      address: new FormControl(''),
      occupation: new FormControl('')
    });
    this.subscription = this.userService.statusChange.subscribe((userData) => {
      if (userData) {
        this.userData=userData;
        console.log(userData);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  onSubmitUserIdForm() {
    console.log('userIdForm', this.userInfoForm.get('address').value);
  }
}
