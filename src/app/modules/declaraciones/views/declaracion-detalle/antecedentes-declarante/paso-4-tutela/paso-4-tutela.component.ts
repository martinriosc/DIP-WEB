import { Component, Optional, SkipSelf, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { PersonaRelacionadaService } from 'src/app/modules/declaraciones/services/persona-relacionada.service';
import { DeclaracionService } from 'src/app/modules/declaraciones/services/declaracion.service';
import { DeclaracionHelperService } from 'src/app/modules/declaraciones/services/declaracion-helper.service';
import { ToastrService } from 'ngx-toastr';

import Swal from 'sweetalert2';

interface Tutela {
  run: string;
  tipoRelacion: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
}

interface ParentescoCat { id: number; nombre: string; }

interface Pariente {
  id: string;
  parentescoId: number;
  parentesco?: string;   // nombre descriptivo
  rut: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
}

@Component({
  selector: 'app-paso-4-tutela',
  standalone: false,
  templateUrl: './paso-4-tutela.component.html',
  styleUrls: ['./paso-4-tutela.component.scss']
})
export class Paso4TutelaComponent {
  tieneHijosTutela: boolean = false;

  data: Tutela[] = [];
  parentescos: ParentescoCat[] = [];
  @ViewChild('tutelaModal') tutelaModal!: TemplateRef<any>;
  tutelaForm!: FormGroup;
  editMode = false;
  currentItem: any;

  declaracionId: number = this._declaracionHelper.declaracionId;
  declaranteId: number = this._declaracionHelper.declaranteId;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private _declaracion: DeclaracionService,
    private _personaRelacionada: PersonaRelacionadaService,
    private _declaracionHelper: DeclaracionHelperService,
    private _toastr: ToastrService
  ) { }


  ngOnInit(): void {
    this.loadPersonasRelacionadas();
    this.loadParentescos();
    this.obtenerAplica();
  }

  obtenerAplica() {
    this._declaracion.obtenerAplica(this.declaracionId).subscribe({
      next: (response) => {
        console.log(response)

        this.tieneHijosTutela = response.data
      },
      error: (error) => {
        console.error('Error al cargar subnumerales:', error);
      }
    })
  }

  loadPersonasRelacionadas(): void {
    this._personaRelacionada.listar(this.declaracionId).subscribe({
      next: (response: any) => {

        this.data = response;
      },
      error: (error) => {
        console.error('Error al cargar personas relacionadas:', error);
      }
    })
  }

  loadParentescos(): void {
    this._personaRelacionada.listarParentescos(1).subscribe({
      next: (response: any) => {

        this.parentescos = response;
      },
      error: (error) => {
        console.error('Error al cargar personas relacionadas:', error);
      }
    })
  }



  buildForm(item?: any) {
    const p = item || { parentescoId: '', rut: '', nombre: '', apellidoPaterno: '', apellidoMaterno: ''};
    this.tutelaForm = this.fb.group({
      parentescoId: [p?.parentescoId || '', Validators.required],
      rut: [p?.rut || '', Validators.required],
      nombre: [p?.nombre || '', Validators.required],
      apellidoPaterno: [p?.apellidoPaterno || '', Validators.required],
      apellidoMaterno: [p?.apellidoMaterno || '', Validators.required]
    });
  }

  onSubmit(): void {

    const ok = this.tieneHijosTutela ? this.data.length > 0 : true;
    if (ok) {
      this._declaracionHelper.markStepCompleted(['declarante', 'paso4']);
      this._declaracionHelper.nextStep();
    } else {
      this._declaracionHelper.markStepIncomplete(['declarante', 'paso4']);
    }
  }

  /** Abrir modal para Agregar */
  openAddModal() {
    this.buildForm();
    this.editMode = false;
    this.currentItem = null;
    this.dialog.open(this.tutelaModal, { width: '700px' });
  }

  /** Abrir modal para Editar */
  openEditModal(item: Tutela) {
    this.buildForm(item);
    this.editMode = true;
    this.currentItem = item;
    this.dialog.open(this.tutelaModal, { width: '700px' });
  }

    refreshLista(): void {
    this._personaRelacionada.listar(this.declaracionId).subscribe({
      next: (r:any) => (this.data = r || []),
      error: () => console.error('Error listando parientes')
    });
  }

  saveHijo(ref: any): void {
    if (this.tutelaForm.invalid) return;

    const form = this.tutelaForm.value;
    const payload: Pariente = {
      id: this.editMode && this.currentItem ? this.currentItem.id : '',
      parentescoId: form.parentescoId,
      rut: form.rut,
      nombre: form.nombre,
      apellidoPaterno: form.apellidoPaterno,
      apellidoMaterno: form.apellidoMaterno
    };

    this._personaRelacionada.guardar(payload, this.declaracionId).subscribe({
      next: r => {
        if (r.success) {
          this._toastr.success('Pariente guardado');
          ref.close();
          this.refreshLista();
          this.tieneHijosTutela = true;
          this._declaracionHelper.markStepCompleted(['declarante', 'paso4']);
        } else {
          this._toastr.error('No se pudo guardar');
        }
      },
      error: () => this._toastr.error('Error al guardar')
    });
  }

  eliminarHijo(p: Pariente): void {
    if (!p.id) return;

    Swal.fire({
      title: 'Eliminar pariente',
      text: 'Estas seguro de eliminar el pariente?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this._personaRelacionada.eliminar(p.id).subscribe({
          next: r => {
            if (r.success) {
              this._toastr.success('Pariente eliminado');
              this.refreshLista();
              if (this.data.length === 0) {
                this._declaracionHelper.markStepIncomplete(['declarante', 'paso4']);
              }
            } else {
              this._toastr.error('No se pudo eliminar');
            }
          },
          error: () => this._toastr.error('Error al eliminar')
        });
      }
    })
    
  }

  /* ---------------------- CONTROLES DE STEP ---------------------- */

  onTieneHijosChange(v: boolean): void {
    this.tieneHijosTutela = v;

    this._personaRelacionada.changePersonaRelacionada(this.declaracionId, v).subscribe({
      next: (response) => {
        console.log(response)
      },
      error: (error) => {
        console.error('Error al cambiar persona relacionada:', error);
      }
    })
    if (!v) {
      
      this._declaracionHelper.markStepCompleted(['declarante', 'paso4']);
    }
  }

  /* ---------------------- HELPERS ---------------------- */

  parentescoNombre(id: number): string {
    return this.parentescos.find(p => p.id === id)?.nombre || '';
  }
}
