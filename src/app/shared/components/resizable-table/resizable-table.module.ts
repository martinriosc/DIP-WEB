/* src/app/shared/resizable-table/resizable-table.module.ts */
import {
  NgModule, Directive, ElementRef, Renderer2,
  HostListener, AfterViewInit, Inject
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Directive({
  selector: '[appResizableColumn]'
})
export class ResizableColumnDirective implements AfterViewInit {

  private startX = 0;
  private startWidth = 0;
  private colIndex = 0;
  private dragging = false;
  private handle!: HTMLElement;

  constructor(
    private host: ElementRef<HTMLElement>,
    private rd: Renderer2,
    @Inject(DOCUMENT) private doc: Document
  ) {}

  ngAfterViewInit() {
    /* 1️⃣ garantiza position:relative para que el handle se ubique bien */
    const cell = this.host.nativeElement;
    if (getComputedStyle(cell).position === 'static') {
      this.rd.setStyle(cell, 'position', 'relative');
    }

    /* 2️⃣ crea el mango */
    this.handle = this.rd.createElement('span');
    this.rd.addClass(this.handle, 'resize-handle');
    this.rd.appendChild(cell, this.handle);

    /* 3️⃣ guarda el índice de la columna */
    const th = cell.closest('th, td') as HTMLTableCellElement;
    this.colIndex = th ? th.cellIndex : 0;
  }

  /* ——— gestión de eventos ——— */
  @HostListener('mousedown', ['$event'])
  onMouseDown(evt: MouseEvent) {
    if (evt.target !== this.handle) { return; }

    this.dragging   = true;
    this.startX     = evt.pageX;
    this.startWidth = this.host.nativeElement.offsetWidth;

    this.rd.addClass(this.doc.body, 'no-select');

    /* escuchamos en el documento para no perder el drag */
    this.rd.listen(this.doc, 'mousemove', this.onMouseMove);
    this.rd.listen(this.doc, 'mouseup',   this.onMouseUp);
  }

  onMouseMove = (evt: MouseEvent) => {
    if (!this.dragging) { return; }
    const delta = evt.pageX - this.startX;
    const newWidth = Math.max(this.startWidth + delta, 90);   // min 90 px
    this.applyWidth(`${newWidth}px`);
  };

  onMouseUp = () => {
    this.dragging = false;
    this.rd.removeClass(this.doc.body, 'no-select');
  };

  private applyWidth(w: string) {
    const table = this.host.nativeElement.closest('table');
    if (!table) { return; }
    table.querySelectorAll('tr').forEach(tr => {
      const cell = (tr as HTMLTableRowElement).cells.item(this.colIndex);
      if (cell) { (cell as HTMLElement).style.width = w; }
    });
  }
}

@NgModule({
  declarations: [ResizableColumnDirective],
  exports:      [ResizableColumnDirective]
})
export class ResizableTableModule {}
