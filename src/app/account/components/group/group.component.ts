import {
  Component,
  OnChanges,
  SimpleChanges,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { select } from '@angular-redux/store';
import { ModalDirective } from 'ngx-bootstrap/modal';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl
} from '@angular/forms';
/*https://github.com/yuyang041060120/ng2-validation*/
import { CustomValidators } from 'ng2-validation';
import { environment } from '../../../../environments/environment';

import {
  IUserGroup,
  IUser,
  IUserRecords
} from '../../../store/data';

import {
  UserGroupService,
  UserService
} from '../../../services';

@Component({
  selector: 'account-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {
  @ViewChild('userModal', {static: false}) public userModal: ModalDirective;
  @ViewChild('groupModal', {static: false}) public groupModal: ModalDirective;

  @select(['data', 'users', 'entities']) users$: Observable<IUserRecords>
  @select(['ui', 'global', 'email_enabled']) emailEnabled$: Observable<string>;

  @Input() group: IUserGroup;

  public members$: Observable<IUser[]>
  public selectEntries$: Observable<ISelectEntry[]>
  public userType: string;
  public userOptions$: Observable<any[]>;

  public emailForm: FormGroup;
  public emailField: AbstractControl;
  public selectedUser: IUser;
  
  constructor(
    private userGroupService: UserGroupService,
    private userService: UserService,
    public fb: FormBuilder
  ) {
    this.userType = 'select';

     //email must be enabled to invite users
     this.userOptions$ = this.emailEnabled$.pipe(map((val)=>{
      if(val){
        return [
          { value: 'select', label: 'pick an existing user or group' },
          { value: 'invite', label: 'invite a user by e-mail' },
          { value: 'create', label: 'create a new user' }
        ]; 
      } else {
        return [
          { value: 'select', label: 'pick an existing user or group' },
          { value: 'create', label: 'create a new user' }
        ];
      }
     }))
  }


  destroyGroup() {
    this.userGroupService.destroyGroup(this.group);
  }
  updateGroup(values: any) {
    this.userGroupService.updateGroup(
      this.group,
      values.name,
      values.description)
      .subscribe(resp => this.groupModal.hide())
  }
  removeMember(user: IUser) {
    this.userGroupService.removeMember(this.group, user);
  }
  addMember(user: IUser) {
    this.userGroupService.addMember(this.group, user);
  }
  inviteMember(email: string) {
    this.userGroupService.inviteMember(
      this.group,
      this.emailField.value);
  }
  addMemberShown() {
    this.userService.loadUsers();
  }
  cancel() {
    this.userModal.hide();
  }
  createMember(values: any) {
    this.userGroupService.createMember(this.group, values)
      .subscribe(
      success => this.userModal.hide()
      );
  }

  ngOnInit() {
    this.members$ = this.users$.pipe(map(users =>
      this.group.members.map(id => users[id])
    ));
    this.selectEntries$ = this.users$.pipe(map(users => {
      return Object.keys(users).map(id => {
        let user = users[id];
        return { value: user, label: `${user.first_name} ${user.last_name}` }
      });
    }));
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, CustomValidators.email]],
    });
    this.emailField = this.emailForm.controls['email'];
  }
}


interface ISelectEntry {
  value: IUser,
  label: string
}