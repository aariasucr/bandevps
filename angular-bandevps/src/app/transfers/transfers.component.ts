import {Component, OnInit} from '@angular/core';
import {UserService} from '../shared/user.service';
import {BankService} from '../shared/bank.service';

@Component({
  selector: 'app-transfers',
  templateUrl: './transfers.component.html',
  styleUrls: ['./transfers.component.css']
})
export class TransfersComponent implements OnInit {
  constructor(private userService: UserService, private bankService: BankService) {}

  ngOnInit() {}
}
