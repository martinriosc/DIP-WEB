import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';

export interface DeclaracionMinistroFe {
  id: number;
  idDeclaracion: number;
  fechaDeclaracion: string;
  tipoDeclaracion: string;
  numeral: number | string;
  rut: string;
  declarante: string;
  servicio: string;
  cargo: string;
  estado: string;
  enviadoPor: string;
}

@Component({
  selector: 'app-ministro-fe-pendientes',
  standalone: false,
  templateUrl: './ministro-fe-pendientes.component.html',
  styleUrls: ['./ministro-fe-pendientes.component.scss']
})
export class MinistroFePendientesComponent {
  @Input() dataSource!: MatTableDataSource<DeclaracionMinistroFe>;
  @Input() selection!: SelectionModel<DeclaracionMinistroFe>;
  @Input() isLoading = false;

  @Output() bitacora = new EventEmitter<DeclaracionMinistroFe>();
  @Output() firmar = new EventEmitter<void>();
  @Output() derivar = new EventEmitter<void>();
  @Output() enviarOrganismo = new EventEmitter<DeclaracionMinistroFe>();
  @Output() descargar = new EventEmitter<DeclaracionMinistroFe>();
  @Output() archivarSeleccionadas = new EventEmitter<void>();
  @Output() masterToggle = new EventEmitter<void>();
  @Output() toggle = new EventEmitter<DeclaracionMinistroFe>();

  displayedColumns: string[] = [
    'select',
    'idDeclaracion',
    'fechaDeclaracion',
    'tipoDeclaracion',
    'numeral',
    'rut',
    'declarante',
    'servicio',
    'cargo',
    'estado',
    'enviadoPor',
    'acciones'
  ];

  onBitacora(element: DeclaracionMinistroFe) {
    this.bitacora.emit(element);
  }

  onFirmar() {
    this.firmar.emit();
  }

  onDerivar() {
    this.derivar.emit();
  }

  onEnviarOrganismo(element: DeclaracionMinistroFe) {
    this.enviarOrganismo.emit(element);
  }

  onDescargar(element: DeclaracionMinistroFe) {
    this.descargar.emit(element);
  }

  onArchivarSeleccionadas() {
    this.archivarSeleccionadas.emit();
  }

  onMasterToggle() {
    this.masterToggle.emit();
  }

  onToggle(element: DeclaracionMinistroFe) {
    this.toggle.emit(element);
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  isSomeSelected(): boolean {
    return this.selection.selected.length > 0 && !this.isAllSelected();
  }

  isSelected(element: DeclaracionMinistroFe): boolean {
    return this.selection.isSelected(element);
  }

  pillClass(estado: string): string {
    const estadoLower = estado.toLowerCase();
    if (estadoLower.includes('pendiente')) return 'pill-pending';
    if (estadoLower.includes('recepcionad')) return 'pill-received';
    if (estadoLower.includes('firmad')) return 'pill-signed';
    if (estadoLower.includes('enviad')) return 'pill-sent';
    if (estadoLower.includes('archivad')) return 'pill-archived';
    if (estadoLower.includes('devuelt')) return 'pill-returned';
    if (estadoLower.includes('rechazad')) return 'pill-rejected';
    if (estadoLower.includes('observad')) return 'pill-observed';
    return 'pill-default';
  }
} 