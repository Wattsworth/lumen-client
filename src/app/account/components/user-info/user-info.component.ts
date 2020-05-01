import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
/*https://github.com/yuyang041060120/ng2-validation*/
import { CustomValidators } from 'ng2-validation';

import { SessionService } from '../../../services'
import { IUserRecord } from '../../../store/data';
import { AccountSelectors } from '../../account.selectors';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit, OnDestroy {


  public form: FormGroup;
  public passwords: FormGroup;
  private sub: Subscription;

  constructor(
    private fb: FormBuilder,
    private sessionService: SessionService,
    private accountSelectors: AccountSelectors
  ) { }

  ngOnInit() {
    this.sub = this.accountSelectors.users$.subscribe(
      users => {
        if (users.current != null &&
          users.entities[users.current] !== undefined) {
          this.buildForm(users.entities[users.current]);
        }
      });
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
  buildForm(user: IUserRecord) {
    this.passwords =  this.fb.group({
      password: [""],
      password_confirmation: [""],
    }, { validator: this.passwordValidator })
    this.form = this.fb.group({
      first_name: [user.first_name, Validators.required],
      last_name: [user.last_name, Validators.required],
      email: [user.email, [Validators.required, CustomValidators.email]],
      passwords: this.passwords,
      current_password: ["", Validators.required]
    });
    
  }

  passwordValidator(group: FormGroup) {
    const password = group.get('password');
    const confirm = group.get('password_confirmation');
    if (password.value === confirm.value) {
      return null; //ok
    }
    return {
      areEqual: false
    }
  }
  onSubmit(formValues: any) {
    const userParams = {
      first_name: formValues.first_name,
      last_name: formValues.last_name,
      current_password: formValues.current_password,
      email: formValues.email,
      password: formValues.passwords.password,
      password_confirmation: formValues.passwords.password_confirmation
    }
    this.sessionService.updateAccount(userParams);
  }

}
