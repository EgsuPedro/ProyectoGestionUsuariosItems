# ProyectoGestionUsuarios
# Datos de Pruebas
1. Reglas de Negocio del AlgoritmoPara que la asignación sea determinista y fácil de probar,
   el algoritmo debe evaluar las siguientes prioridades en orden estricto:
    Regla de Saturación: Un usuario se considera Saturado si tiene más de 3 ítems de Relevancia Alta pendientes.
   Si un usuario está saturado, se excluye de cualquier asignación.
  1.  Próximo a Vencer (Urgente): Si $\text{Fecha de Entrega} - \text{Fecha Actual} < 3 \text{ días}$.
  2.  Criterio: Se asigna al usuario disponible que tenga menos ítems pendientes totales (sin importar la relevancia de lo que tenga asignado o del ítem actual).
  3.  Relevancia Alta (No urgente):
  4.  Criterio: Se asigna al usuario disponible con menos ítems pendientes totales.
  5.  Relevancia Baja (No urgente):
  6.  Criterio: Se asigna al usuario disponible con menos ítems pendientes totales.
  7.  Ordenamiento: Después de cada asignación, se reordena la cola de pendientes de cada
  8.  usuario (por ejemplo: primero los que vencen antes, luego los de alta relevancia).
     
# Puntos clave a considerar según tus nuevas pautas:
Dos Proyectos de Microservicios Independientes:
Microservicio 1: GestionUsuarios.API (se encarga del registro, estado y tracking de pendientes/completados por usuario).

Microservicio 2: ItemsTrabajo.API (gestiona la creación de ítems, lógica de asignación/distribución y comunicación con el microservicio de usuarios).

Tecnología: .NET 6 o .NET 8 (o superior) en C# usando Visual Studio 2022.

Arquitectura: Estructura clásica en 3 capas (N-Capas) por cada microservicio, sin complicaciones innecesarias:

Capa de Presentación (API / Controllers)

Capa de Negocio (Services / BLL)

Capa de Acceso a Datos (Repository / DAL o In-Memory)

Análisis del Ejemplo que te proporcionaron

Estado inicial:

Usuario A: 3 ítems pendientes (2 Alta Relevancia, 1 Baja Relevancia).

Usuario B: 1 ítem pendiente (0 Alta Relevancia, 1 Baja Relevancia).

Nuevo Ítem: Alta Relevancia | Vence en 2 días (< 3 días → Próximo a vencer).

Evaluación:

¿Usuario A o B están saturados? No (ninguno supera los 3 ítems de alta relevancia).
El ítem vence en 2 días y es relevante.
Se compara el total de ítems pendientes: Usuario A tiene 3, Usuario B tiene 1.
Resultado: Se asigna al Usuario B porque es quien menos ítems pendientes totales tiene.

# Carpeta FrontEnd
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

# Crapeta Backend

# implementacion y ejecucion de prioridades de items para usuario por estados de relevancia y sobre carga de trabajo manejo de fechas



<img width="702" height="155" alt="image" src="https://github.com/user-attachments/assets/65cfc3e2-4c08-4955-b846-78db6f6391a4" />



#  Arquitectura Frontend (Angular + Atomic Design)
Aplicando Atomic Design (Diseño Atómico), estructuraremos el Frontend dividiendo la interfaz en componentes reutilizables y desacoplados:



Para respetar la arquitectura de microservicios y evitar acoplamientos, organizamos la base de datos DbGestionUsuariosItems manteniendo la responsabilidad delimitada por servicio:


<img width="612" height="422" alt="image" src="https://github.com/user-attachments/assets/7544fe86-a141-46df-a396-cba5034d1e2d" />


# Estructura de Proyecto en el Backend (.NET 8)
Asumiendo que tu proyecto de microservicio de usuarios/auth se llama AuthMicroservice, la estructura de carpetas debe quedar organizada de la siguiente manera:

<img width="311" height="482" alt="image" src="https://github.com/user-attachments/assets/d6e68bfc-38ba-484a-8e42-9dccf87aa500" />

# Esquema General de la Solución Backend.

<img width="441" height="623" alt="image" src="https://github.com/user-attachments/assets/fe71ef27-7f86-44b1-a4ea-b051c475d2a4" />


# Resumen de Puertos y URLs del Sistema

<img width="585" height="325" alt="image" src="https://github.com/user-attachments/assets/da58a211-947f-4dc7-9d33-ded97347d14d" />


# Esquema de Base de datos en esta ubicacion:
<img width="1451" height="906" alt="image" src="https://github.com/user-attachments/assets/156c6fbc-d0de-49ae-987f-5477dbfbabd8" />

