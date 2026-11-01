# Sistema de Turnos

Sistema de turnos para **múltiples servicios y profesionales**, con tres roles:

- **Cliente**: se registra, ve las disponibilidades de los profesionales, reserva turnos y los cancela.
- **Profesional**: carga sus franjas horarias semanales y gestiona el estado de los turnos que recibe.
- **Admin**: ABM de servicios, usuarios y profesionales.

## Arranque rápido (TL;DR)

Hacen falta **dos terminales**. Con JDK 21 y Node 20+ instalados:

```bash
# Terminal 1 — backend (API en :8080)
cd backend && ./gradlew bootRun

# Terminal 2 — frontend (app en :4200)
cd frontend && npm install && npm start
```

Después abrí **http://localhost:4200** e ingresá con cualquiera de los usuarios de prueba,
que se crean solos al levantar el backend:

| Rol         | Email                    | Password      |
| ----------- | ------------------------ | ------------- |
| ADMIN       | `admin@email.com`        | `admin`       |
| PROFESIONAL | `profesional@email.com`  | `profesional` |
| CLIENTE     | `cliente@email.com`      | `cliente`     |

No hay que crear la base ni correr ningún script: H2 arma el schema y carga estos datos
al arrancar. La app cambia de menú y de pantallas según el rol con el que entres.

## Requisitos

- **JDK 21**. El repo lo fija con [mise](https://mise.jdx.dev) (`mise.toml`); si ya tenés
  un JDK 21 instalado por tu cuenta, también sirve. **Gradle no hace falta instalarlo**:
  el wrapper (`./gradlew`) se descarga solo.
- **Node.js 20+** y **npm**. **El Angular CLI tampoco hace falta instalarlo global**:
  viene como dependencia del proyecto y `npm start` lo usa desde `node_modules`.

## Qué se puede probar (recorrido sugerido)

1. **Registro**: en http://localhost:4200 → *"¿No tenés cuenta? Creá una"*. El alta por
   pantalla siempre crea un **CLIENTE** (los otros roles se cargan desde el ABM de admin).
2. Entrá como **`profesional@email.com`** → *Crear disponibilidad*: cargá una franja
   semanal (día + hora inicio + hora fin).
3. Entrá como **`admin@email.com`** → *Servicios*: creá al menos un servicio (nombre,
   duración, precio). Hace falta para poder reservar.
4. Entrá como **`cliente@email.com`** → *Disponibilidades*: elegí una franja, se abre el
   modal de reserva (servicio + fecha). El calendario solo habilita **el día de la semana
   de esa franja** y hasta **30 días** hacia adelante.
5. **Mis turnos** (cliente): ves el turno y podés cancelarlo.
6. **Mis turnos** (profesional): sobre ese mismo turno podés **confirmar**, **completar**
   o marcar **no asistió**.

## Stack

| Capa      | Tecnología                                                          |
| --------- | ------------------------------------------------------------------- |
| Backend   | Java 21 · Spring Boot 3.5.3 · Gradle                                |
| Seguridad | Spring Security + JWT (jjwt) · roles ADMIN / PROFESIONAL / CLIENTE   |
| ORM / DB  | Spring Data JPA (Hibernate) · H2 en archivo (→ PostgreSQL a futuro)  |
| API docs  | springdoc-openapi (OpenAPI 3 + Swagger UI)                          |
| Frontend  | Angular 21 (standalone, signals, zoneless) · Angular Material        |
| Tipos     | orval — genera cliente y tipos TS desde el OpenAPI del backend       |

## Estructura

```
taller4_sistema_turnos/
├── backend/    # Spring Boot (API REST en :8080)
└── frontend/   # Angular 21 (dev server en :4200, proxy /api → :8080)
```

## URLs útiles

| Qué                | Dónde                                     |
| ------------------ | ----------------------------------------- |
| App                | http://localhost:4200                     |
| Health de la API   | http://localhost:8080/api/health          |
| Swagger UI         | http://localhost:8080/swagger-ui.html     |
| Consola H2         | http://localhost:8080/h2-console          |

> En Swagger, los endpoints protegidos requieren token: pegá el `token` que devuelve
> `POST /api/auth/login` en el botón **Authorize** (esquema `bearerAuth`).

El dev server de Angular proxya `/api` hacia el backend (`frontend/proxy.conf.json`),
así que no hay problemas de CORS en desarrollo.

## Comandos

Backend (desde `backend/`):

```bash
./gradlew bootRun         # levanta la API en :8080
./gradlew build           # compila + corre los tests
./gradlew test            # solo los tests
```

Frontend (desde `frontend/`):

```bash
npm install               # solo la primera vez
npm start                 # dev server en :4200
npm test                  # tests (vitest)
npm run build             # build de producción
npm run gen:api           # regenera el cliente TS desde el OpenAPI (backend corriendo)
```

## Base de datos (H2)

La base es **H2 en archivo**: vive en `backend/data/sistematurnos.mv.db` y persiste entre
reinicios. Las tablas las crea Hibernate al levantar el backend (`ddl-auto: update`), así
que **no hace falta ningún script de schema**.

### Datos de prueba (seed)

Al iniciar, el backend crea **un usuario por rol** (tabla de credenciales más arriba).
Es **idempotente**: solo crea lo que falta, así que se puede reiniciar sin duplicar nada.
El usuario `profesional@email.com` ya viene con su registro `Profesional` asociado.
La lógica está en `config/DataSeeder`.

### Inspeccionarla con la consola H2

1. Levantá el backend (`./gradlew bootRun`).
2. Abrí http://localhost:8080/h2-console.
3. Completá el formulario con **estos** valores (el default que trae, `jdbc:h2:mem:testdb`,
   es otra base en memoria — hay que reemplazarlo):

   | Campo        | Valor                                                |
   | ------------ | ---------------------------------------------------- |
   | Driver Class | `org.h2.Driver`                                      |
   | JDBC URL     | `jdbc:h2:file:./data/sistematurnos;AUTO_SERVER=TRUE` |
   | User Name    | `sa`                                                 |
   | Password     | *(vacío)*                                            |

4. **Connect**.

> **`AUTO_SERVER=TRUE` es lo que permite conectarse mientras el backend está corriendo**
> (varias conexiones sobre el mismo archivo). Sin eso, H2 toma un lock exclusivo y la
> consola falla con *"Database may be already in use"*. Es el mismo motivo por el que el
> `spring.datasource.url` del backend ya lo incluye.

### Para empezar de cero

Apagá el backend y borrá los archivos de la base; se regeneran vacíos (y con el seed) en
el próximo arranque:

```bash
rm backend/data/sistematurnos.mv.db backend/data/sistematurnos.lock.db
```

## Autenticación (JWT)

`POST /api/auth/register` (alta de CLIENTE) y `POST /api/auth/login` devuelven
`{ token, usuario }`. El front guarda el token y lo manda en `Authorization: Bearer …`
vía interceptor. Son públicos `/api/auth/**`, `/api/health`, Swagger y `/h2-console/**`;
**todo el resto requiere token** (sin token o inválido → 401, rol insuficiente → 403).

> **Secret de JWT.** La firma usa `app.jwt.secret`, que se lee de la variable de entorno
> **`APP_JWT_SECRET`** y, si no está, cae a un default de desarrollo definido en
> `application.yml`. **Para correr el TP no hace falta tocar nada.** En producción,
> definila (mín. 32 caracteres) antes de arrancar:
>
> ```bash
> export APP_JWT_SECRET="una-cadena-larga-y-aleatoria-de-al-menos-32-caracteres"
> ./gradlew bootRun
> ```

## Tipos compartidos backend ↔ frontend

Los tipos del frontend **no se escriben a mano**: se generan desde el esquema OpenAPI que
expone el backend. Con el backend corriendo:

```bash
cd frontend
npm run gen:api
```

Esto regenera `frontend/src/app/core/api/generated/` (cliente Angular + interfaces TS).
Flujo de propagación: **DTO Java → OpenAPI → orval → servicio/tipos TS**. Cada vez que
cambie un DTO o endpoint en el backend, volvé a correr `npm run gen:api`.

## Limitaciones conocidas

Alcance de MVP; quedaron fuera a propósito:

- No se validan **solapamientos** de franjas ni doble reserva del mismo horario.
- El backend no impone una **máquina de estados** de turnos (las transiciones válidas las
  ofrece el front según el estado actual).
- La autorización es **por rol, no por dueño del recurso** (el `clienteId`/`profesionalId`
  viaja en el DTO en vez de salir del token).
- Un **servicio no está vinculado a un profesional** ni a una franja: el cliente elige
  cualquier servicio al reservar dentro de la disponibilidad del profesional.
- Migración de H2 a **PostgreSQL** (con migraciones reales, Flyway) pendiente, de ser necesario.
