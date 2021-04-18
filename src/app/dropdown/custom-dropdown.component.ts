import { Component, OnInit, Input, forwardRef, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors } from '@angular/forms';
import { CustomDropdownService } from './custom-dropdown.service';

@Component({
  selector: 'custom-dropdown-a',
  templateUrl: './custom-dropdown.component.html',
  styleUrls: ['./custom-dropdown.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    multi: true,
    useExisting: forwardRef(() => CustomDropdownComponent)
  },
  {
    provide: NG_VALIDATORS,
    multi: true,
    useExisting: CustomDropdownComponent
  }, CustomDropdownService]
})
export class CustomDropdownComponent implements OnInit {

  item: any;
  @Input() selectedItem: any;
  @Input() list: any;
  @Input() placeholder: string;
  @Input() public selected: string;
  @ViewChild('input')
  public input: ElementRef;
  displayText: string = '';
  onChange = (item) => { };
  onTouched = () => { };
  touched = false;
  disabled = false;
  show = false;

  constructor() { }

  ngOnInit(): void { }

  validate(control: AbstractControl): ValidationErrors | null {
    const item = control.value;
    if (!item) {
      return {
        mustBePositive: {
          item
        }
      };
    }
  }

  onSelectItem(item) {
    this.markAsTouched();
    if (!this.disabled) {
      this.item = item;
      this.displayText = item.name;
      this.toggleClass();
      this.onChange(this.item);
    }
  }

  writeValue(item: any) {
    this.item = item;
  }

  registerOnChange(onChange: any) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any) {
    this.onTouched = onTouched;
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }

  toggleClass() {
    this.show = !this.show;
  }

  public onDropMenuIconClick(event: UIEvent) {
    event.stopPropagation();
    setTimeout(() => {
      this.input.nativeElement.focus();
      this.input.nativeElement.click();
    }, 10);
  }

  public onKeyDown(event) {

  }
}
