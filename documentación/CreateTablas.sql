-- Creación de la tabla usuario
CREATE TABLE databeachvolley_usuario (
    last_login DATETIME DEFAULT NULL,
    dni VARCHAR(9) NOT NULL,
    email VARCHAR(50) NOT NULL,
    password VARCHAR(128) NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    tipo VARCHAR(12) NOT NULL,
    PRIMARY KEY (dni),
    UNIQUE KEY (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabla Grupo
CREATE TABLE databeachvolley_grupo (
    id_grupo INT AUTO_INCREMENT,
    email VARCHAR(50) NOT NULL,
    password VARCHAR(128) NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    tipo VARCHAR(12) NOT NULL,
    PRIMARY KEY (id_grupo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabla Pertenece (relación entre Usuario y Grupo)
CREATE TABLE databeachvolley_pertenece (
    id_grupo INT,
    dni VARCHAR(9),
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_grupo, dni),
    FOREIGN KEY (id_grupo) REFERENCES databeachvolley_grupo(id_grupo) ON DELETE CASCADE,
    FOREIGN KEY (dni) REFERENCES databeachvolley_usuario(dni) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabla Sesion
CREATE TABLE databeachvolley_sesion (
    id_sesion INT AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    descripcion TEXT,
    tipo VARCHAR(12) NOT NULL,
    PRIMARY KEY (id_sesion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabla Crea_Grupo (relación entre Usuario y Grupo para creación)
CREATE TABLE databeachvolley_crea_grupo (
    id_grupo INT,
    dni VARCHAR(9),
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_grupo, dni),
    FOREIGN KEY (id_grupo) REFERENCES databeachvolley_grupo(id_grupo) ON DELETE CASCADE,
    FOREIGN KEY (dni) REFERENCES databeachvolley_usuario(dni) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabla Crea_Sesion (relación entre Usuario y Sesión)
CREATE TABLE databeachvolley_crea_sesion (
    id_sesion INT,
    dni VARCHAR(9),
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_sesion, dni),
    FOREIGN KEY (id_sesion) REFERENCES databeachvolley_sesion(id_sesion) ON DELETE CASCADE,
    FOREIGN KEY (dni) REFERENCES databeachvolley_usuario(dni) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabla Contenido
CREATE TABLE databeachvolley_contenido (
    id_contenido INT AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    descripcion TEXT,
    tipo VARCHAR(12) NOT NULL,
    PRIMARY KEY (id_contenido)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabla Envia (relación entre Usuario y Contenido)
CREATE TABLE databeachvolley_envia (
    id_contenido INT,
    dni VARCHAR(9),
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_contenido, dni),
    FOREIGN KEY (id_contenido) REFERENCES databeachvolley_contenido(id_contenido) ON DELETE CASCADE,
    FOREIGN KEY (dni) REFERENCES databeachvolley_usuario(dni) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabla Registra (relación entre Usuario y Contenido estadístico)
CREATE TABLE databeachvolley_registra (
    id_contenido INT,
    dni VARCHAR(9),
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_contenido, dni),
    FOREIGN KEY (id_contenido) REFERENCES databeachvolley_contenido(id_contenido) ON DELETE CASCADE,
    FOREIGN KEY (dni) REFERENCES databeachvolley_usuario(dni) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
-- Tabla para tracking del grupo activo por usuario
CREATE TABLE databeachvolley_grupo_activo (
    dni VARCHAR(9),
    id_grupo INT,
    fecha_activacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (dni),
    FOREIGN KEY (dni) REFERENCES databeachvolley_usuario(dni) ON DELETE CASCADE,
    FOREIGN KEY (id_grupo) REFERENCES databeachvolley_grupo(id_grupo) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabla para invitaciones a grupos
CREATE TABLE databeachvolley_invitaciones (
    id_invitacion INT AUTO_INCREMENT,
    id_grupo INT,
    dni_invitado VARCHAR(9),
    dni_invitador VARCHAR(9),
    estado ENUM('pendiente', 'aceptada', 'rechazada') DEFAULT 'pendiente',
    fecha_invitacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_respuesta DATETIME DEFAULT NULL,
    PRIMARY KEY (id_invitacion),
    FOREIGN KEY (id_grupo) REFERENCES databeachvolley_grupo(id_grupo) ON DELETE CASCADE,
    FOREIGN KEY (dni_invitado) REFERENCES databeachvolley_usuario(dni) ON DELETE CASCADE,
    FOREIGN KEY (dni_invitador) REFERENCES databeachvolley_usuario(dni) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;