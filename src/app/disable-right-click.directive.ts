// disable-right-click.directive.ts
import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appDisableRightClick]',
  standalone: true
})
export class DisableRightClickDirective {
  @HostListener('contextmenu', ['$event'])
  onContextMenu(event: Event): void {
    event.preventDefault();
  }
}
