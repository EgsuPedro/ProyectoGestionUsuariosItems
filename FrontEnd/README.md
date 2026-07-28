# Estructura General del Proyecto Angular

<img width="607" height="667" alt="image" src="https://github.com/user-attachments/assets/7b89b2d1-546c-4250-89b8-2e299fd0602f" />
<img width="613" height="397" alt="image" src="https://github.com/user-attachments/assets/84591fdf-61c3-4f1c-a56e-7ffe6295e829" />

Desglose de Atomic Design en el Proyecto

<img width="587" height="528" alt="image" src="https://github.com/user-attachments/assets/1b31f896-591e-4d57-b3ac-bd65008bacc9" />

# SERVICIOS HTTP DE ANGULAR
2.1. Archivo: src/app/core/services/usuarios.service.ts
Ubicación: src/app/core/services/usuarios.service.ts

Propósito: Consumir el CRUD del microservicio de Usuarios (http://localhost:5001/api/usuarios).

2.2. Archivo: src/app/core/services/items.service.ts
Ubicación: src/app/core/services/items.service.ts

Propósito: Consumir el CRUD del microservicio de Ítems (http://localhost:5002/api/items).

# ORGANISMO: Tabla de Usuarios
Archivo: src/app/shared/components/organisms/usuarios-table/usuarios-table.component.ts
Ubicación: src/app/shared/components/organisms/usuarios-table/usuarios-table.component.ts

Propósito: Muestra la lista de usuarios y emite eventos hacia la página padre cuando se solicita editar o eliminar un registro.
# ORGANISMO: Modal de Formulario (Crear / Editar)
Archivo: src/app/shared/components/organisms/usuario-form-modal/usuario-form-modal.component.ts
Ubicación: src/app/shared/components/organisms/usuario-form-modal/usuario-form-modal.component.ts

Propósito: Formularios reactivos dinámicos para alta y edición de usuario usando los componentes atómicos.

# Resumen del Flujo de Navegación
<img width="597" height="557" alt="image" src="https://github.com/user-attachments/assets/55a22068-5572-49b6-bc9e-6aa935306f79" />
# Inicio de Login
<img width="489" height="337" alt="image" src="https://github.com/user-attachments/assets/79dbaf93-8734-433f-832a-5a34d4e07de1" />
Usuario: admin@sistema.com  Contraseña: Admin123!


