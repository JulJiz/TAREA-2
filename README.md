# Interfaces 3 - 2026 02

## Sistema de Gestión de Rutinas y Actividad Física

Una empresa que ofrece servicios relacionados con el bienestar y la actividad física desea desarrollar una aplicación para ayudar a sus usuarios a organizar sus entrenamientos y llevar un control de su progreso. Actualmente, muchas personas utilizan hojas de cálculo, notas en el celular o aplicaciones genéricas para registrar sus actividades, lo que dificulta mantener un historial ordenado y consultar los resultados obtenidos a lo largo del tiempo. Por esta razón, se busca construir una solución que permita a cada usuario crear planes de entrenamiento personalizados, compuestos por diferentes actividades físicas, y utilizarlos durante sus sesiones diarias. Cuando una persona realice un entrenamiento, la aplicación deberá permitir registrar lo que efectivamente hizo, ya que en ocasiones los resultados obtenidos pueden diferir de lo que se había planeado inicialmente. También se desea conservar un historial de las sesiones realizadas para que los usuarios puedan revisar su evolución y analizar su desempeño. Adicionalmente, la organización considera importante que no todas las personas tengan acceso a las mismas funcionalidades dentro de la plataforma, por lo que será necesario contemplar diferentes tipos de usuarios con distintos niveles de acceso. Como parte del proyecto, se espera diseñar una solución que permita almacenar y gestionar toda la información necesaria para soportar estas necesidades de negocio de forma organizada y consistente.

<details>
<summary><strong>Ver propuesta de modelo de datos (solución sugerida)</strong></summary>

```mermaid
erDiagram

    USER {
        int id PK
        int roleId FK
        varchar name
        varchar email UK
        varchar password
        timestamp createdAt
        timestamp updatedAt
    }

    ROLE {
        int id PK
        varchar name UK
        text description
        timestamp createdAt
    }

    PERMISSION {
        int id PK
        varchar name UK
        text description
        timestamp createdAt
    }

    ROLE_PERMISSION {
        int roleId FK
        int permissionId FK
        timestamp createdAt
    }

    EXERCISE {
        int id PK
        varchar name
        text description
        varchar type
        float estimatedCalories
        float estimatedDistanceKm
        int estimatedDurationMin
        varchar icon
        timestamp createdAt
    }

    ROUTINE {
        int id PK
        int userId FK
        varchar name
        text description
        timestamp createdAt
        timestamp updatedAt
    }

    ROUTINE_EXERCISE {
        int id PK
        int routineId FK
        int exerciseId FK
        int orderIndex
        int targetSets
        int targetReps
        float targetWeightKg
        int targetDurationMin
        timestamp createdAt
    }

    ACTIVITY_LOG {
        int id PK
        int userId FK
        int routineId FK
        timestamp startedAt
        timestamp completedAt
        timestamp createdAt
    }

    ACTIVITY_EXERCISE {
        int id PK
        int activityLogId FK
        int routineExerciseId FK
        int actualSets
        int actualReps
        float actualWeightKg
        int actualDurationMin
        float caloriesBurned
        float distanceCoveredKm
        timestamp startedAt
        timestamp completedAt
    }

    ROLE ||--o{ USER : assigned_to
    ROLE ||--o{ ROLE_PERMISSION : has
    PERMISSION ||--o{ ROLE_PERMISSION : granted_to

    USER ||--o{ ROUTINE : creates
    USER ||--o{ ACTIVITY_LOG : performs

    ROUTINE ||--o{ ROUTINE_EXERCISE : contains
    EXERCISE ||--o{ ROUTINE_EXERCISE : used_in

    ROUTINE ||--o{ ACTIVITY_LOG : executed_as

    ACTIVITY_LOG ||--o{ ACTIVITY_EXERCISE : contains

    ROUTINE_EXERCISE ||--o{ ACTIVITY_EXERCISE : executed_as
```

</details>

## Base de Datos

### Sembrado de Datos Iniciales (Seed)

Para ejecutar el script de inserción de datos iniciales en la base de datos PostgreSQL alojada en Docker, ejecuta el siguiente comando:

```bash
docker compose exec -T db psql -U postgres -d mydatabase < db/scripts/inserts.sql
```

## Ejecución del Proyecto

1. Copiar las variables de entorno:
   ```bash
   cp .env.example .env
   ```
2. Levantar la base de datos:
   ```bash
   docker compose up -d
   ```
3. Instalar dependencias e iniciar la aplicación (TypeORM crea las tablas al arrancar):
   ```bash
   npm install
   npm run start:dev
   ```
4. Con la aplicación iniciada, cargar los datos iniciales ejecutando el seed descrito en la sección anterior.

## Autorización

Todas las rutas, excepto `POST /auth/login`, requieren un token JWT en el encabezado `Authorization: Bearer <token>`. Cada método exige un permiso, y el `PermissionsGuard` verifica que el rol del usuario lo tenga:

- Sin token o con token inválido: `401 Unauthorized`
- Con token pero sin el permiso requerido: `403 Forbidden`

### Roles y permisos

| Permiso | Descripción | admin | user |
|---|---|:-:|:-:|
| `manage_users` | Gestionar usuarios | ✅ | ❌ |
| `manage_roles` | Gestionar roles | ✅ | ❌ |
| `manage_exercises` | Crear, actualizar y eliminar ejercicios | ✅ | ❌ |
| `read_exercise` | Consultar ejercicios | ✅ | ✅ |
| `create_routine` | Crear rutinas y sus ejercicios | ✅ | ✅ |
| `read_routine` | Consultar rutinas y sus ejercicios | ✅ | ✅ |
| `update_routine` | Actualizar rutinas y sus ejercicios | ✅ | ✅ |
| `delete_routine` | Eliminar rutinas y sus ejercicios | ✅ | ✅ |
| `create_activity_log` | Registrar sesiones y ejercicios realizados | ✅ | ✅ |
| `read_activity_log` | Consultar sesiones y ejercicios realizados | ✅ | ✅ |
| `update_activity_log` | Actualizar sesiones y ejercicios realizados | ✅ | ✅ |
| `delete_activity_log` | Eliminar sesiones y ejercicios realizados | ✅ | ✅ |

### Endpoints

| Recurso | POST | GET (lista y por id) | PATCH | DELETE |
|---|---|---|---|---|
| `/users` | `manage_users` | `manage_users` | `manage_users` | `manage_users` |
| `/roles` | `manage_roles` | `manage_roles` | `manage_roles` | `manage_roles` |
| `/exercises` | `manage_exercises` | `read_exercise` | `manage_exercises` | `manage_exercises` |
| `/routines` | `create_routine` | `read_routine` | `update_routine` | `delete_routine` |
| `/routine-exercises` | `create_routine` | `read_routine` | `update_routine` | `delete_routine` |
| `/activity-logs` | `create_activity_log` | `read_activity_log` | `update_activity_log` | `delete_activity_log` |
| `/activity-exercises` | `create_activity_log` | `read_activity_log` | `update_activity_log` | `delete_activity_log` |

Al crear rutinas y registros de actividad, el usuario propietario se toma del token.

### Usuarios de prueba

| Correo | Rol | Contraseña |
|---|---|---|
| `admin@gym.com` | admin | `Password123` |
| `juan@example.com` | user | `Password123` |

## Verificación de Accesos

La colección `api-tests/postman_collection.json` comprueba accesos autorizados y denegados para todas las operaciones. Durante la ejecución crea un rol sin permisos y un usuario con ese rol, para verificar respuestas `403` en todos los recursos, y al final elimina los datos creados.

Se puede ejecutar desde Postman (Import → Run collection) o desde la terminal:

```bash
npx newman run api-tests/postman_collection.json
```

Pruebas unitarias del guard de permisos:

```bash
npm test
```
