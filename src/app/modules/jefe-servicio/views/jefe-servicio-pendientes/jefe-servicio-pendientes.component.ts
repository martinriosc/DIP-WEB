import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';

export interface DeclaracionJefeServicio {
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
  selector: 'app-jefe-servicio-pendientes',
  standalone: false,
  templateUrl: './jefe-servicio-pendientes.component.html',
  styleUrls: ['./jefe-servicio-pendientes.component.scss']
})
export class JefeServicioPendientesComponent {
  @Input() dataSource!: MatTableDataSource<DeclaracionJefeServicio>;
  @Input() selection!: SelectionModel<DeclaracionJefeServicio>;
  @Input() isLoading = false;

  @Output() bitacora = new EventEmitter<DeclaracionJefeServicio>();
  @Output() firmar = new EventEmitter<void>();
  @Output() derivar = new EventEmitter<void>();
  @Output() enviarOrganismo = new EventEmitter<DeclaracionJefeServicio>();
  @Output() descargar = new EventEmitter<DeclaracionJefeServicio>();
  @Output() archivarSeleccionadas = new EventEmitter<void>();
  @Output() masterToggle = new EventEmitter<void>();
  @Output() toggle = new EventEmitter<DeclaracionJefeServicio>();

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

  onBitacora(element: DeclaracionJefeServicio) {
    this.bitacora.emit(element);
  }

  onFirmar() {
    this.firmar.emit();
  }

  onDerivar() {
    this.derivar.emit();
  }

  onEnviarOrganismo(element: DeclaracionJefeServicio) {
    this.enviarOrganismo.emit(element);
  }

  onDescargar(element: DeclaracionJefeServicio) {
    this.descargar.emit(element);
  }

  onArchivarSeleccionadas() {
    this.archivarSeleccionadas.emit();
  }

  onMasterToggle() {
    this.masterToggle.emit();
  }

  onToggle(element: DeclaracionJefeServicio) {
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

  isSelected(element: DeclaracionJefeServicio): boolean {
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