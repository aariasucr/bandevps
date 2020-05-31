import {Component, OnInit, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-user-data-editor',
  templateUrl: './user-data-editor.component.html',
  styleUrls: ['./user-data-editor.component.css']
})
export class UserDataEditorComponent implements OnInit {
  @Input() form: FormGroup;

  constructor() {}

  ngOnInit() {}
}
