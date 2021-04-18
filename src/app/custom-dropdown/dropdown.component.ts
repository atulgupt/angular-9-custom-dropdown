import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { CdkPortal } from '@angular/cdk/portal';
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

  // @ViewChild(CdkPortal)
  // public contentTemplate: CdkPortal;

  // protected overlayRef: OverlayRef;

  public showing = false;

  @ViewChild('UI') UI: TemplateRef<any>;
  constructor(protected overlay: Overlay, public containerRef: ViewContainerRef) {
  }

  public show() {
    // this.overlayRef = this.overlay.create(this.getOverlayConfig());
    // this.overlayRef.attach(this.contentTemplate);
    // this.overlayRef.backdropClick().subscribe(() => this.hide());

    const view = this.containerRef.createEmbeddedView(this.UI);
    console.log(view, this.UI);

    // this.syncWidth();
    this.showing = true;
  }

  public hide() {
    // this.overlayRef.detach();
    this.containerRef.detach();
    // this.containerRef.clear();
    this.showing = false;
  }

  @HostListener('window:resize')
  public onWinResize() {
    this.syncWidth();
  }

  protected getOverlayConfig(): OverlayConfig {
    const positionStrategy = this.overlay.position()
      .flexibleConnectedTo(this.reference)
      .withPush(false)
      .withPositions([{
        originX: 'start',
        originY: 'bottom',
        overlayX: 'start',
        overlayY: 'top'
      }, {
        originX: 'start',
        originY: 'top',
        overlayX: 'start',
        overlayY: 'bottom'
      }]);

    const scrollStrategy = this.overlay.scrollStrategies.reposition();

    return new OverlayConfig({
      positionStrategy: positionStrategy,
      scrollStrategy: scrollStrategy,
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop'
    });
  }

  private syncWidth() {
    if (!this.containerRef) {
      return;
    }
    // const refRect = this.reference.getBoundingClientRect();
    // this.overlayRef.updateSize({ width: refRect.width });
  }
}
