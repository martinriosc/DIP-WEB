import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-paso1-declaracion',
  templateUrl: './paso-1-declaracion.component.html',
  styleUrls: ['./paso-1-declaracion.component.scss']
})
export class Paso1DeclaracionComponent implements OnInit {
  formDeclaracion!: FormGroup;

  // Listas de ejemplo para poblar los selects
  tipos = [
    'PRIMERA DECLARACION (POR ASUNCION DE CARGO)',
    'DECLARACION ACTUALIZADA',
    'DECLARACION ANUAL',
  ];

  periodos = [2023, 2024, 2025, 2026];
  regiones = [
    'METROPOLITANA DE SANTIAGO',
    'ARICA Y PARINACOTA',
    'TARAPACÁ',
    'ANTOFAGASTA',
    // Agrega las que necesites
  ];
  comunas = [
    'SANTIAGO',
    'LAS CONDES',
    'PROVIDENCIA',
    'PUENTE ALTO',
    // Otras comunas...
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.formDeclaracion = this.fb.group({
      tipo: ['', Validators.required],
      periodo: ['', Validators.required],
      lugar: ['Chile', Validators.required], // Valor por defecto: Chile
      region: ['', Validators.required],
      comuna: ['', Validators.required]
    });
  }

  onSubmit() {
    // Valida el formulario
    if (this.formDeclaracion.invalid) {
      // Maneja la validación, p.ej. mostrar mensajes
      return;
    }

    // Recolecta los datos del formulario
    const { tipo, periodo, lugar, region, comuna } = this.formDeclaracion.value;

    // Aquí puedes llamar a tu servicio para guardar, o navegar al siguiente paso, etc.
    console.log('Formulario Paso 1:', this.formDeclaracion.value);
  }
}
