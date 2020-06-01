import {Component, OnInit, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-user-password-editor',
  templateUrl: './user-password-editor.component.html',
  styleUrls: ['./user-password-editor.component.css']
})
export class UserPasswordEditorComponent implements OnInit {
  @Input() form: FormGroup;

  constructor() {}

  ngOnInit() {}
}
