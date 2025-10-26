# 💸 GestorDePrestamos-Frontend

## 📄 Descripción del Proyecto

Este repositorio contiene la **interfaz de usuario (Frontend)** para el sistema de gestión de préstamos, desarrollado con **HTML5, CSS3 y JavaScript nativo**.

Actúa como la capa de presentación que se comunica con la API RESTful alojada en el repositorio **[gestor-prestamos-api](https://github.com/EnzoParada/gestor-prestamos-api)**. Esta configuración de dos repositorios forma la solución **Full Stack** completa, donde el Frontend se encarga de la interacción del usuario y el Backend de la lógica de negocio y la persistencia de datos.

---


## 🛠️ Tecnologías Utilizadas

| Tecnología | Propósito |
| :--- | :--- |
| **HTML5** | Estructura semántica de la aplicación. |
| **CSS3** | Estilos, diseño y responsividad de la interfaz. |
| **JavaScript (ES6+)** | Lógica del lado del cliente y manejo de la comunicación con la API Backend . |
---

## 🚀 Puesta en Marcha y Conexión con la API

Para que el Frontend pueda funcionar y acceder a los datos, la API debe estar corriendo y lista para recibir solicitudes.

### 1. Configurar y Levantar el Backend (API)

1.  **Clona el repositorio de la API:**
    ```bash
    git clone [https://github.com/EnzoParada/gestor-prestamos-api.git](https://github.com/EnzoParada/gestor-prestamos-api.git)
    cd gestor-prestamos-api
    ```
2.  **Ejecuta el servicio de la API** (usando tu IDE como IntelliJ/Eclipse o comandos de Spring/Maven/Gradle, asegurando que se ejecute en `localhost:8080` por defecto).

### 2. Configuración de la Conexión en el Frontend

Antes de abrir el Frontend, debes asegurarte de que la **URL base** de la API y las **credenciales de autenticación** estén correctamente configuradas en el código JavaScript.

1.  **Clona el repositorio del Frontend:**
    ```bash
    git clone [https://github.com/EnzoParada/GestorDePrestamos-Frontend.git](https://github.com/EnzoParada/GestorDePrestamos-Frontend.git)
    cd GestorDePrestamos-Frontend
    ```

2.  **Verifica la URL Base:**
    * Revisa los archivos `.js` dentro de la carpeta `/js/`.
    * Asegúrate de que la variable que define la URL de la API (ej. `const API_URL = 'http://localhost:8080/api';`) apunte correctamente a donde esté corriendo tu Backend.

      

### 3. Ejecutar la Aplicación Frontend

Una vez que la API está operativa y has confirmado la configuración de conexión
