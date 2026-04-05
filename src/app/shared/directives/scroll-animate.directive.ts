import { Directive, ElementRef, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appScrollAnimate]',
  standalone: true
})
export class ScrollAnimateDirective implements OnInit {

  constructor(private el: ElementRef, private rd: Renderer2) {}

  ngOnInit() {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.rd.addClass(this.el.nativeElement, 'show');
        }
      });
    }, { threshold: 0.2 });

    observer.observe(this.el.nativeElement);
  }
}