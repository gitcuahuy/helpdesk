import { ElementRef, InjectionToken, Renderer2 } from '@angular/core';

export const RENDER_DIV_NODE_STRATEGY = new InjectionToken<RenderDivNodeStrategy>('RenderDivNode');

export interface RenderDivNodeStrategy {
  renderDiv(renderer: Renderer2, target: ElementRef, divNode: any): void;

  insertDiv(renderer: Renderer2, target: ElementRef, divNode: any): void;
}

export class DefaultRenderDivNodeStrategy implements RenderDivNodeStrategy {
  renderDiv(renderer: Renderer2, target: ElementRef, divNode: any): void {
    renderer.setStyle(divNode, 'color', '#eb2d4b');
    // renderer.setStyle(divNode, 'font-size', '13px');
    renderer.setStyle(divNode, 'margin-top', '5px');
  }

  insertDiv(renderer: Renderer2, target: ElementRef, divNode: any): void {
    renderer.appendChild(target.nativeElement.parentNode, divNode);
  }
}
