import { Component, input } from '@angular/core';

@Component({
  selector: 'app-field-error',
  imports: [],
  templateUrl: './field-error.html',
  styleUrl: './field-error.scss',
})
export class FieldError {
  readonly show = input<boolean>(false);
  readonly errorList = input<[string, ...string[]] | undefined>();
}
