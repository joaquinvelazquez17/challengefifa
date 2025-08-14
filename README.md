
# Proyecto CHALLENGEFIFA - Backend (NestJS) y Frontend (Angular)

## Descripción

Esta aplicación permite gestionar jugadores de fútbol con funcionalidades de autenticación y autorización usando JWT (JSON Web Token).  
El backend está desarrollado con **NestJS** y el frontend con **Angular**.  
Se implementó un sistema de login, registro de usuarios, manejo de jugadores (crear, editar, listar, detalle) y protección de rutas con guardas de autenticación.

---
## Acceso a la aplicación
Usuario: root
Password: 1234

## Características principales

- Autenticación con JWT (login, refresh token).  
- Registro de usuarios.  
- CRUD de jugadores (Players) con atributos detallados (nombre, club, posición, rating, atributos físicos, etc).  
- Paginación y búsqueda en listado de jugadores.  
- Rutas protegidas con guardas (`AuthGuard`) en Angular para asegurar el acceso solo con token válido.

---

## Tecnologías usadas

- **Backend:** NestJS, TypeScript, JWT, Passport.js  
- **Frontend:** Angular, TypeScript, Angular Router, Guards  
- **Base de datos:** MySQL  
- **Herramientas:** curl para testeo de APIs

---

## Instalación y configuración

1. Renombrar el archivo `.env.sample` a `.env` y configurar las variables de entorno necesarias.  

2. Construir imágenes y levantar contenedores con Docker Compose:  
   ```bash
   docker-compose build
   docker-compose up
   ```

3. Abrir el navegador en [http://localhost:4200](http://localhost:4200) para acceder al frontend.

---

## Endpoints principales

### Autenticación

Login:  
```bash
curl --request POST   --url http://localhost:3000/api/auth/login   --header 'Content-Type: application/json'   --data '{
    "usuario":"root",
    "password":"1234"
}'
```

Refresh token:  
```bash
curl --request POST   --url http://localhost:3000/api/auth/refresh   --header 'Content-Type: application/json'   --data '{
    "usuario":"root",
    "password":"1234"
}'
```

Registro de usuarios:  
```bash
curl --request POST   --url http://localhost:3000/api/users/register   --header 'Content-Type: application/json'   --data '{
    "nombre":"roots",
    "usuario":"roots",
    "password":"1234",
    "email":"root@root.com"
}'
```

---

### Jugadores (Players)

Crear jugador:  
```bash
curl --request POST   --url http://localhost:3000/api/players   --header 'Content-Type: application/json'   --data '{
     "name": "Player",
     "club": "FC Player",
     "position": "Midfielder",
     "nationality": "Argentina",
     "rating": 85,
     "speed": 90,
     "shooting": 75,
     "dribbling": 88,
     "passing": 92,
     "faceUrl":"https://example.com/face.png",
     "potential": 99,
     "age": 31,
     "defending": 80,
     "physic": 85
   }'
```

Actualizar jugador:  
```bash
curl --request PATCH   --url http://localhost:3000/api/players/1   --header 'Content-Type: application/json'   --data '{
     "name": "Lionel Messi",
     "position": "CF",
     "club": "FC Barcelona",
     "nationality": "Argentina",
     "rating": 94,
     "speed": 94,
     "shooting": 91,
     "dribbling": 97,
     "passing": 89,
     "defending": 80,
     "physic": 85
   }'
```

Obtener jugador por ID:  
```bash
curl --request GET   --url http://localhost:3000/api/players/36   --header 'Content-Type: application/json'
```

Listar jugadores con paginación y filtro por nombre:  
```bash
curl --request GET   --url 'http://localhost:3000/api/players?page=1&limit=99&name=Alpaslan'   --header 'Content-Type: application/json'
```

---

## Uso de JWT y Cookies

Para las rutas protegidas es necesario enviar el token JWT en las cookies de la petición.  
Esto permite que el backend valide automáticamente la sesión y permita el acceso a recursos restringidos.

Ejemplo para enviar cookies con curl (asegúrate que la cookie con el token esté configurada correctamente en el navegador o cliente):

```bash
curl --request GET   --url http://localhost:3000/api/players   --cookie "access_token=<token_jwt_aqui>"   --header 'Content-Type: application/json'
```

---

## Rutas Frontend protegidas con AuthGuard (Angular)

```typescript
{ path: 'login', component: LoginComponent },

{
    path: 'players',
    component: PlayersComponent,
    canActivate: [AuthGuard],
},
{
    path: 'players/:id',
    component: PlayerComponent,
    canActivate: [AuthGuard],
},
{
    path: 'players/:id/edit',
    component: UpdatePlayerComponent,
    canActivate: [AuthGuard],
},
{
    path: 'create-player',
    component: CreatePlayerComponent,
    canActivate: [AuthGuard],
},
```

---

