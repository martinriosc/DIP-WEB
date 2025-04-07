import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidadorDeclaracionService } from '../../../services/validador-declaracion.service';

@Component({
  selector: 'app-paso1-declaracion',
  templateUrl: './paso-1-declaracion.component.html',
  styleUrls: ['./paso-1-declaracion.component.scss']
})
export class Paso1DeclaracionComponent implements OnInit {
  formDeclaracion!: FormGroup;

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
    'ANTOFAGASTA'
  ];
  comunas = [
    'SANTIAGO',
    'LAS CONDES',
    'PROVIDENCIA',
    'PUENTE ALTO'
  ];

  constructor(
    private fb: FormBuilder,
    private validadorDeclaracionService: ValidadorDeclaracionService
  ) {}

  ngOnInit(): void {
    this.formDeclaracion = this.fb.group({
      tipo: ['', Validators.required],
      periodo: ['', Validators.required],
      lugar: ['Chile', Validators.required],
      region: ['', Validators.required],
      comuna: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.formDeclaracion.invalid) {
      this.validadorDeclaracionService.setPasoCompleto('paso1', false);
      return;
    }

    this.validadorDeclaracionService.setPasoCompleto('paso1', true);
    console.log('Paso 1 OK:', this.formDeclaracion.value);
  }
}
