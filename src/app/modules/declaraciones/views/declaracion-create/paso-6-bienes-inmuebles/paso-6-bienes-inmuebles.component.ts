import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ValidadorDeclaracionService } from '../../../services/validador-declaracion.service';

interface BienChile {
  region: string;
  comuna: string;
  direccion: string;
  inscripcion: string;
  fojas: string;
  anio: number;
  rolAvaluo: string;
}

interface BienExtranjero {
  pais: string;
  direccion: string;
  observaciones: string;
}

@Component({
  selector: 'app-paso-6-bienes-inmuebles',
  templateUrl: './paso-6-bienes-inmuebles.component.html',
  styleUrls: ['./paso-6-bienes-inmuebles.component.scss']
})
export class Paso6BienesInmueblesComponent {
  tieneChile = 'si';       // radio si/no
  tieneExtranjero = 'no';  // radio si/no

  // Bienes en Chile
  bienesChile: BienChile[] = [
    { region: 'METROPOLITANA', comuna: 'SANTIAGO', direccion: 'EJERCITO 60', inscripcion: '9193', fojas: '5754', anio: 2008, rolAvaluo: '718-140' },
    { region: 'METROPOLITANA', comuna: 'PROVIDENCIA', direccion: 'LOS CAPITANES', inscripcion: '13829', fojas: '11875', anio: 2009, rolAvaluo: '4018-149' }
  ];
  displayedColumnsChile = ['region', 'comuna', 'direccion', 'inscripcion', 'fojas', 'anio', 'rolAvaluo', 'acciones'];

  // Bienes en el Extranjero
  bienesExtranjero: BienExtranjero[] = [];
  displayedColumnsExtranjero = ['pais', 'direccion', 'accionesExt'];

  // Modal Chile
  @ViewChild('bienChileModal') bienChileModal!: TemplateRef<any>;
  bienChileForm!: FormGroup;
  editChile = false;
  currentChile!: BienChile | null;

  // Modal Extranjero
  @ViewChild('bienExtranjeroModal') bienExtranjeroModal!: TemplateRef<any>;
  bienExtranjeroForm!: FormGroup;
  editExtranjero = false;
  currentExtranjero!: BienExtranjero | null;

  regiones = ['METROPOLITANA', 'VALPARAÍSO', 'BIOBÍO'];
  comunas = ['SANTIAGO', 'PROVIDENCIA', 'LAS CONDES'];

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private validadorDeclaracionService: ValidadorDeclaracionService
  ) {}

  // Agregar Chile
  openAddChileModal() {
    this.editChile = false;
    this.currentChile = null;
    this.bienChileForm = this.fb.group({
      region: [''],
      comuna: [''],
      direccion: [''],
      inscripcion: [''],
      fojas: [''],
      anio: [2023],
      rolAvaluo: ['']
    });
    this.dialog.open(this.bienChileModal);
  }

  // Editar Chile
  openEditChileModal(item: BienChile) {
    this.editChile = true;
    this.currentChile = item;
    this.bienChileForm = this.fb.group({
      region: [item.region],
      comuna: [item.comuna],
      direccion: [item.direccion],
      inscripcion: [item.inscripcion],
      fojas: [item.fojas],
      anio: [item.anio],
      rolAvaluo: [item.rolAvaluo]
    });
    this.dialog.open(this.bienChileModal);
  }

  saveBienChile(dialogRef: any) {
    if (this.bienChileForm.valid) {
      const formValue = this.bienChileForm.value as BienChile;
      if (this.editChile && this.currentChile) {
        // Edit
        const index = this.bienesChile.indexOf(this.currentChile);
        if (index >= 0) {
          this.bienesChile[index] = formValue;
        }
      } else {
        // Add
        this.bienesChile.push(formValue);
      }
      dialogRef.close();
      // Marca el paso como completo (o ajusta lógica)
      this.validadorDeclaracionService.setPasoCompleto('paso6', true);
    }
  }

  eliminarBien(b: BienChile) {
    this.bienesChile = this.bienesChile.filter(x => x !== b);
  }

  // Agregar Extranjero
  openAddExtranjeroModal() {
    this.editExtranjero = false;
    this.currentExtranjero = null;
    this.bienExtranjeroForm = this.fb.group({
      pais: [''],
      direccion: [''],
      observaciones: ['']
    });
    this.dialog.open(this.bienExtranjeroModal);
  }

  // Editar Extranjero
  openEditExtranjeroModal(b: BienExtranjero) {
    this.editExtranjero = true;
    this.currentExtranjero = b;
    this.bienExtranjeroForm = this.fb.group({
      pais: [b.pais],
      direccion: [b.direccion],
      observaciones: [b.observaciones || '']
    });
    this.dialog.open(this.bienExtranjeroModal);
  }

  saveBienExtranjero(dialogRef: any) {
    if (this.bienExtranjeroForm.valid) {
      const formValue = this.bienExtranjeroForm.value as BienExtranjero;
      if (this.editExtranjero && this.currentExtranjero) {
        // Edit
        const index = this.bienesExtranjero.indexOf(this.currentExtranjero);
        if (index >= 0) {
          this.bienesExtranjero[index] = formValue;
        }
      } else {
        // Add
        this.bienesExtranjero.push(formValue);
      }
      dialogRef.close();
      this.validadorDeclaracionService.setPasoCompleto('paso6', true);
    }
  }

  eliminarBienExt(b: BienExtranjero) {
    this.bienesExtranjero = this.bienesExtranjero.filter(x => x !== b);
  }

  // Control Radios
  onChileChange(value: string) {
    this.tieneChile = value;
    if (value === 'no') {
      // this.bienesChile = []; // si deseas vaciar, etc.
      this.validadorDeclaracionService.setPasoCompleto('paso6', false);
    }
  }

  onExtranjeroChange(value: string) {
    this.tieneExtranjero = value;
    if (value === 'no') {
      // this.bienesExtranjero = []; // si deseas vaciar, etc.
      this.validadorDeclaracionService.setPasoCompleto('paso6', false);
    }
  }
}
