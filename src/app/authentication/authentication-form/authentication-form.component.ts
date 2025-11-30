import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {UsernamePassword} from '../username-password';

@Component({
  selector: 'scms-authentication-form',
  standalone: false,
  templateUrl: './authentication-form.component.html',
  styleUrl: './authentication-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthenticationFormComponent {

  @Input()
  public wrongCredentials: boolean = false;

  @Output()
  public readonly usernamePassword = new EventEmitter<UsernamePassword>();

  public readonly username: FormControl;
  public readonly password: FormControl;

  public readonly formControls: FormGroup;

  constructor(protected fb: FormBuilder) {
    this.username = fb.control(null);
    this.password = fb.control(null);

    this.formControls = fb.group({
      username: this.username,
      password: this.password,
    });
  }

  protected login() {
    const usernamePassword: UsernamePassword = this.formControls.value;
    this.usernamePassword.emit(usernamePassword);
  }
}
