import { Directive, ElementRef, Renderer2, HostListener  } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
  // wherever I want to use this directive, I will use an attribute called appHighlight whith that particular element in my template
})
export class HighlightDirective {

  constructor(private el: ElementRef,
              private renderer: Renderer2) { }

  @HostListener('mouseenter') onMouseEnter() { // onmousehover highlight
    this.renderer.addClass(this.el.nativeElement, 'highlight');
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.renderer.removeClass(this.el.nativeElement, 'highlight');
  }

}
