# Pruebas de Integración con Firebase

Este directorio contiene las configuraciones y pruebas de integración para Firebase en el proyecto.

## Estructura

```
testing/
├── firebase-testing.config.ts      # Configuración para pruebas unitarias (mocks)
├── firebase-integration.config.ts  # Configuración para pruebas de integración (Firebase real)
├── README.md                       # Esta documentación
└── [component].integration.spec.ts # Pruebas de integración por componente
```

## Tipos de Pruebas

### 1. Pruebas Unitarias (firebase-testing.config.ts)

- **Propósito**: Probar lógica de componentes y servicios de forma aislada
- **Firebase**: Usa mocks completos de Firebase
- **Velocidad**: Muy rápidas
- **Cobertura**: Lógica de negocio, validaciones, métodos de componentes

### 2. Pruebas de Integración (firebase-integration.config.ts)

- **Propósito**: Probar integración real con Firebase
- **Firebase**: Usa Firebase real o emuladores
- **Velocidad**: Más lentas que las unitarias
- **Cobertura**: Flujos completos, autenticación real, manejo de errores

## Configuración de Firebase Emulator

Para ejecutar las pruebas de integración con emuladores locales:

1. **Instalar Firebase CLI**:

   ```bash
   npm install -g firebase-tools
   ```

2. **Inicializar Firebase** (si no está configurado):

   ```bash
   firebase init emulators
   ```

3. **Iniciar emuladores**:

   ```bash
   firebase emulators:start
   ```

4. **Ejecutar pruebas de integración**:
   ```bash
   npm test -- --include="**/*.integration.spec.ts"
   ```

## Ejecución de Pruebas

### Todas las pruebas

```bash
npm test
```

### Solo pruebas unitarias

```bash
npm test -- --exclude="**/*.integration.spec.ts"
```

### Solo pruebas de integración

```bash
npm test -- --include="**/*.integration.spec.ts"
```

### Pruebas específicas

```bash
npm test -- --include="**/login.component.integration.spec.ts"
```

## Ventajas de las Pruebas de Integración

1. **Verificación Real**: Prueban la integración real con Firebase
2. **Manejo de Errores**: Verifican cómo se manejan errores reales de Firebase
3. **Flujos Completos**: Prueban flujos completos de autenticación
4. **Configuración**: Verifican que la configuración de Firebase funciona correctamente

## Limitaciones

1. **Credenciales**: Las pruebas de login exitoso requieren credenciales válidas
2. **Entorno**: Se recomienda usar emuladores para no afectar datos reales
3. **Velocidad**: Son más lentas que las pruebas unitarias
4. **Dependencias**: Requieren que Firebase esté disponible

## Mejores Prácticas

1. **Separación**: Mantener pruebas unitarias e integración separadas
2. **Limpieza**: Siempre limpiar el estado después de cada prueba
3. **Mocks**: Usar mocks para credenciales sensibles
4. **Emuladores**: Usar emuladores de Firebase para pruebas locales
5. **Documentación**: Documentar casos especiales y configuraciones

## Troubleshooting

### Error: "Firebase emulators not available"

- Asegúrate de que los emuladores estén ejecutándose
- Verifica los puertos en la configuración

### Error: "Cannot match any routes"

- Verifica que las rutas estén configuradas en RouterTestingModule
- Asegúrate de que los componentes estén importados correctamente

### Error: "Firebase API called outside injection context"

- Este es un warning común, no afecta la funcionalidad
- Se puede ignorar en pruebas de integración

## Próximos Pasos

1. **Configurar CI/CD**: Integrar pruebas de integración en el pipeline
2. **Pruebas E2E**: Agregar pruebas end-to-end con Cypress o Playwright
3. **Cobertura**: Mejorar la cobertura de pruebas de integración
4. **Automatización**: Automatizar la configuración de emuladores
