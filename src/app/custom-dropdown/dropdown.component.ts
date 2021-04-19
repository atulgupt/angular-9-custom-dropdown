import { Component, HostListener, Input, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'custom-dropdown',
  template: `
      <ng-template #UI>
          <ng-content></ng-content>
      </ng-template>`
})
export class DropdownComponent {

  @Input()
  public reference: HTMLElement;
  public showing = false;

  @ViewChild('UI') UI: TemplateRef<any>;
  constructor(private containerRef: ViewContainerRef) {  }

  public show() {
    const view = this.containerRef.createEmbeddedView(this.UI);
    this.showing = true;
  }

  public hide() {
    this.containerRef.detach();
    this.showing = false;
  }
}
