import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle'; // Para los toggles de on/off
import { MatSelectModule } from '@angular/material/select'; // Para selectores
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSlideToggleModule,
    MatSelectModule,
  ],
  templateUrl: './configuracion.component.html',
  styleUrl: './configuracion.component.scss',
})
export class ConfiguracionComponent implements OnInit {
  // --- Configuración General ---
  nombreEmpresa: string = 'Mi Empresa S.A.';
  zonaHoraria: string = 'America/Santiago';
  idioma: string = 'es';

  // --- Configuración de Notificaciones ---
  notificacionesEmail: boolean = true;
  notificacionesSMS: boolean = false;
  frecuenciaNotificaciones: string = 'diaria'; // 'diaria', 'semanal', 'mensual'

  // --- Seguridad ---
  autenticacionDosFactores: boolean = false;
  permitirSesionesMultiples: boolean = true;

  // --- Apariencia (ejemplo de un tema) ---
  modoOscuro: boolean = false;

  // --- Gestión de Datos ---
  mostrarConfirmacionBorrarCache: boolean = false;

  // Opciones para selectores
  zonasHorarias: string[] = [
    'America/Santiago',
    'America/New_York',
    'Europe/Madrid',
    'Asia/Tokyo',
  ];
  idiomas: { value: string; viewValue: string }[] = [
    { value: 'es', viewValue: 'Español' },
    { value: 'en', viewValue: 'English' },
    { value: 'pt', viewValue: 'Português' },
  ];
  frecuencias: { value: string; viewValue: string }[] = [
    { value: 'diaria', viewValue: 'Diaria' },
    { value: 'semanal', viewValue: 'Semanal' },
    { value: 'mensual', viewValue: 'Mensual' },
  ];

  constructor() {}

  ngOnInit(): void {
    // Aquí podrías cargar las configuraciones desde un servicio o LocalStorage
    this.cargarConfiguraciones();
  }

  // --- Métodos de Guardar ---
  guardarConfiguracionGeneral() {
    console.log('Guardando configuración general:', {
      nombreEmpresa: this.nombreEmpresa,
      zonaHoraria: this.zonaHoraria,
      idioma: this.idioma,
    });
    // Lógica para enviar a un servicio/API
    this.guardarConfiguraciones();
    toast.success('Configuración general guardada.');
  }

  guardarConfiguracionNotificaciones() {
    console.log('Guardando configuración de notificaciones:', {
      notificacionesEmail: this.notificacionesEmail,
      notificacionesSMS: this.notificacionesSMS,
      frecuenciaNotificaciones: this.frecuenciaNotificaciones,
    });
    // Lógica para enviar a un servicio/API
    this.guardarConfiguraciones();
    toast.success('Configuración de notificaciones guardada.');
  }

  guardarConfiguracionSeguridad() {
    console.log('Guardando configuración de seguridad:', {
      autenticacionDosFactores: this.autenticacionDosFactores,
      permitirSesionesMultiples: this.permitirSesionesMultiples,
    });
    // Lógica para enviar a un servicio/API
    this.guardarConfiguraciones();
    toast.success('Configuración de seguridad guardada.');
  }

  guardarConfiguracionApariencia() {
    console.log('Guardando configuración de apariencia:', {
      modoOscuro: this.modoOscuro,
    });
    // Lógica para aplicar el tema o enviar a un servicio/API
    this.guardarConfiguraciones();
    toast.success('Configuración de apariencia guardada.');
    // Aquí podrías cambiar una clase en el body para aplicar el tema oscuro
    document.body.classList.toggle('dark-mode', this.modoOscuro);
  }

  // --- Métodos de Gestión de Datos ---
  exportarDatos() {
    console.log('Exportando datos...');
    // Lógica para generar y descargar un archivo (ej. CSV, JSON)
    toast.info('Exportando datos (funcionalidad no implementada).');

    // **CAMBIO AQUÍ: Crea un objeto con la configuración actual del componente**
    const currentConfig = {
      nombreEmpresa: this.nombreEmpresa,
      zonaHoraria: this.zonaHoraria,
      idioma: this.idioma,
      notificacionesEmail: this.notificacionesEmail,
      notificacionesSMS: this.notificacionesSMS,
      frecuenciaNotificaciones: this.frecuenciaNotificaciones,
      autenticacionDosFactores: this.autenticacionDosFactores,
      permitirSesionesMultiples: this.permitirSesionesMultiples,
      modoOscuro: this.modoOscuro,
    };

    // Ejemplo de descarga de un archivo simple
    const data = JSON.stringify(
      {
        sucursales: ['Central', 'Puente Alto'], // Datos de ejemplo, reemplazar con datos reales si los tienes
        proveedores: ['Andina', 'Coca-Cola'],
        facturas: ['F001', 'F002'],
        configuracion: currentConfig, // Usa el objeto que acabamos de crear
      },
      null,
      2
    );
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_datos_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  borrarCache() {
    this.mostrarConfirmacionBorrarCache = true;
  }

  confirmarBorrarCache() {
    console.log('Borrando caché...');
    // Lógica para borrar caché (ej. de LocalStorage, service workers)
    localStorage.clear(); // ¡Ten cuidado con esto en una app real!
    this.mostrarConfirmacionBorrarCache = false;
    toast.success('Caché borrada exitosamente.');
  }

  cancelarBorrarCache() {
    this.mostrarConfirmacionBorrarCache = false;
  }

  // --- Persistencia Simple con LocalStorage (para demostración) ---
  private cargarConfiguraciones() {
    const config = localStorage.getItem('appConfiguracion');
    if (config) {
      const parsedConfig = JSON.parse(config);
      this.nombreEmpresa = parsedConfig.nombreEmpresa ?? this.nombreEmpresa;
      this.zonaHoraria = parsedConfig.zonaHoraria ?? this.zonaHoraria;
      this.idioma = parsedConfig.idioma ?? this.idioma;
      this.notificacionesEmail =
        parsedConfig.notificacionesEmail ?? this.notificacionesEmail;
      this.notificacionesSMS =
        parsedConfig.notificacionesSMS ?? this.notificacionesSMS;
      this.frecuenciaNotificaciones =
        parsedConfig.frecuenciaNotificaciones ?? this.frecuenciaNotificaciones;
      this.autenticacionDosFactores =
        parsedConfig.autenticacionDosFactores ?? this.autenticacionDosFactores;
      this.permitirSesionesMultiples =
        parsedConfig.permitirSesionesMultiples ??
        this.permitirSesionesMultiples;
      this.modoOscuro = parsedConfig.modoOscuro ?? this.modoOscuro;
      // Aplicar tema oscuro al cargar
      document.body.classList.toggle('dark-mode', this.modoOscuro);
    }
  }

  private guardarConfiguraciones() {
    const configToSave = {
      nombreEmpresa: this.nombreEmpresa,
      zonaHoraria: this.zonaHoraria,
      idioma: this.idioma,
      notificacionesEmail: this.notificacionesEmail,
      notificacionesSMS: this.notificacionesSMS,
      frecuenciaNotificaciones: this.frecuenciaNotificaciones,
      autenticacionDosFactores: this.autenticacionDosFactores,
      permitirSesionesMultiples: this.permitirSesionesMultiples,
      modoOscuro: this.modoOscuro,
    };
    localStorage.setItem('appConfiguracion', JSON.stringify(configToSave));
  }
}
