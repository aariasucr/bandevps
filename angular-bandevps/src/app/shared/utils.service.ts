import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  constructor() {}

  getMaskedEmail(email) {
    const regexp = /(?<first>[^@])(?<middle>[^@]+)(?<last>@[\w-]+\.+[\w-]+)/;
    const {first, middle, last} = email.match(regexp).groups;
    const mask = middle.replace(/[^@]/gi, '*');
    return `${first}${mask}${last}`;
  }
}
