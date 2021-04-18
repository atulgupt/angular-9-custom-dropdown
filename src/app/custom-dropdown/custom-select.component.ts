import {
  AfterViewInit,
  Component,
  ContentChildren,
  ElementRef,
  forwardRef,
  Input,
  QueryList,
  ViewChild, HostListener, Renderer2
} from '@angular/core';
import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CustomDropdownService } from './custom-dropdown.service';
import { CustomSelectOptionComponent } from './custom-select-option.component';
import { DropdownComponent } from './dropdown.component';

@Component({
  selector: 'custom-select',
  templateUrl: './custom-select.html',
  styleUrls: ['./_custom-select.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomSelectComponent),
      multi: true
    },
    CustomDropdownService
  ]
})
export class CustomSelectComponent implements AfterViewInit, ControlValueAccessor {

  @Input()
  public label: string;

  @Input()
  public placeholder: string;

  @Input()
  public selected: any;

  @Input()
  public required = false;

  @Input()
  public disabled = false;

  @ViewChild('input')
  public input: ElementRef;

  @ViewChild(DropdownComponent)
  public dropdown: DropdownComponent;

  @ContentChildren(CustomSelectOptionComponent)
  public options: QueryList<CustomSelectOptionComponent>;

  public selectedOption: CustomSelectOptionComponent;

  public displayText: string;

  public onChangeFn = (_: any) => { };

  public onTouchedFn = () => { };

  private keyManager: ActiveDescendantKeyManager<CustomSelectOptionComponent>;

  @ViewChild('dropreference', { static: false }) dropdownReference: ElementRef;


  constructor(private dropdownService: CustomDropdownService, private renderer: Renderer2) {
    this.dropdownService.register(this);
    this.renderer.listen('window', 'click', (e: Event) => {
      /**
       * Only run when toggleButton is not clicked
       * If we don't check this, all clicks (even on the toggle button) gets into this
       * section which in the result we might never see the menu open!
       * And the menu itself is checked here, and it's where we check just outside of
       * the menu and button the condition abbove must close the menu
       */
      if (!this.dropdownReference.nativeElement.contains(e.target)) {
        this.hideDropdown();
      }

    });
  }

  public ngAfterViewInit() {
    setTimeout(() => {
      this.selectedOption = this.options.toArray().find(option => option.key === this.selected);
      this.displayText = this.selectedOption ? this.selectedOption.value : '';
      this.keyManager = new ActiveDescendantKeyManager(this.options)
        .withHorizontalOrientation('ltr')
        .withVerticalOrientation()
        .withWrap();
    });
  }

  public showDropdown() {
    this.dropdown.showing ? this.hideDropdown() : this.dropdown.show();
    //

    if (!this.options.length) {
      return;
    }

    this.selected ? this.keyManager.setActiveItem(this.selectedOption) : this.keyManager.setFirstItemActive();
  }

  public hideDropdown() {
    this.dropdown.hide();
  }

  public onDropMenuIconClick(event: UIEvent) {
    event.stopPropagation();
    setTimeout(() => {
      this.input.nativeElement.focus();
      this.input.nativeElement.click();
    }, 10);
  }

  public onKeyDown(event: KeyboardEvent) {
    if (['Enter', ' ', 'ArrowDown', 'Down', 'ArrowUp', 'Up'].indexOf(event.key) > -1) {
      if (!this.dropdown.showing) {
        this.showDropdown();
        return;
      }

      if (!this.options.length) {
        event.preventDefault();
        return;
      }
    }

    if (event.key === 'Enter' || event.key === ' ') {
      this.selectedOption = this.keyManager.activeItem;
      this.selected = this.selectedOption.key;
      this.displayText = this.selectedOption ? this.selectedOption.value : '';
      this.hideDropdown();
      this.onChange();
    } else if (event.key === 'Escape' || event.key === 'Esc') {
      this.dropdown.showing && this.hideDropdown();
    } else if (['ArrowUp', 'Up', 'ArrowDown', 'Down', 'ArrowRight', 'Right', 'ArrowLeft', 'Left']
      .indexOf(event.key) > -1) {
      this.keyManager.onKeydown(event);
    } else if (event.key === 'PageUp' || event.key === 'PageDown' || event.key === 'Tab') {
      this.dropdown.showing && event.preventDefault();
    }
  }

  public selectOption(option: CustomSelectOptionComponent) {
    console.log(option, '<===option');
    this.keyManager.setActiveItem(option);
    this.selected = option.key;
    this.selectedOption = option;
    this.displayText = this.selectedOption ? this.selectedOption.value : '';
    this.hideDropdown();
    this.input.nativeElement.focus();
    this.onChange();
  }

  public registerOnChange(fn: any): void {
    this.onChangeFn = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouchedFn = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public writeValue(obj: any): void {
    this.selected = obj;
  }

  public onTouched(event: UIEvent) {
    event.stopPropagation();
    this.onTouchedFn();
    console.log(this.dropdownService.getSelect(), '<=== service');
    console.log(this.selectedOption, '<=== option component');
    // setTimeout(() => {
    //   if (this.dropdown.show && !this.selectedOption) {
    //     this.dropdown.hide();
    //   }
    // }, 100);
  }

  public onChange() {
    this.onChangeFn(this.selected);
  }
}
