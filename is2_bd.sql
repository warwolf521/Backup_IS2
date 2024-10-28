DROP TABLE IF EXISTS cliente, hitos, rutina, sesion, usuario, ejercicio, tiene, serie, implemento, utiliza;
DROP SEQUENCE IF EXISTS seq_id_rutina, seq_id_ejercicio, seq_id_serie;

CREATE SEQUENCE IF NOT EXISTS seq_id_rutina AS INT START WITH 1 INCREMENT BY 1 MINVALUE 1 NO MAXVALUE NO CYCLE;
CREATE SEQUENCE IF NOT EXISTS seq_id_ejercicio AS INT START WITH 1 INCREMENT BY 1 MINVALUE 1 NO MAXVALUE NO CYCLE;
CREATE SEQUENCE IF NOT EXISTS seq_id_serie AS INT START WITH 1 INCREMENT BY 1 MINVALUE 1 NO MAXVALUE NO CYCLE;
CREATE SEQUENCE IF NOT EXISTS seq_id_hito AS INT START WITH 1 INCREMENT BY 1 MINVALUE 1 NO MAXVALUE NO CYCLE;

CREATE TABLE IF NOT EXISTS cliente (rut_cliente INT NOT NULL, nombre VARCHAR(255), apellidos VARCHAR(255), PRIMARY KEY(rut_cliente));
CREATE TABLE IF NOT EXISTS hitos (id_hito INT NOT NULL DEFAULT NEXTVAL('seq_id_hito'), rut_cliente INT REFERENCES cliente(rut_cliente) ON DELETE CASCADE ON UPDATE CASCADE, masa INT, estatura INT, edad INT, objetivo VARCHAR(255), PRIMARY KEY(id_hito));
CREATE TABLE IF NOT EXISTS usuario (rut_usuario INT NOT NULL, nombre VARCHAR(255), apellidos VARCHAR(255), tipo VARCHAR(10) CONSTRAINT type_of_user CHECK (tipo IN ('trainer','admin')), contraseña VARCHAR(32), estado VARCHAR(10) CONSTRAINT state_of_user CHECK (estado IN ('activo','inactivo')),  PRIMARY KEY(rut_usuario));
CREATE TABLE IF NOT EXISTS sesion (uuid INT, rut_usuario INT REFERENCES usuario(rut_usuario) ON DELETE RESTRICT ON UPDATE CASCADE, expiracion TIMESTAMP, PRIMARY KEY(uuid));
CREATE TABLE IF NOT EXISTS rutina (id_rutina INT NOT NULL DEFAULT NEXTVAL('seq_id_rutina'), timestamp_inicio timestamp, timestamp_final timestamp, comentario VARCHAR(256), rut_cliente INT REFERENCES cliente(rut_cliente) ON DELETE CASCADE ON UPDATE CASCADE, rut_usuario INT REFERENCES usuario(rut_usuario) ON DELETE RESTRICT ON UPDATE CASCADE, PRIMARY KEY(id_rutina));
CREATE TABLE IF NOT EXISTS serie (id_serie INT NOT NULL DEFAULT NEXTVAL('seq_id_serie'), id_rutina INT REFERENCES rutina(id_rutina) ON DELETE CASCADE ON UPDATE CASCADE, cantidad INT, PRIMARY KEY(id_serie));
CREATE TABLE IF NOT EXISTS ejercicio (id_ejercicio INT NOT NULL DEFAULT NEXTVAL('seq_id_ejercicio'), nombre VARCHAR(255), PRIMARY KEY(id_ejercicio), unidad VARCHAR(15) CONSTRAINT type_of_unit CHECK (unidad IN ('Repeticiones','Segundos')));
CREATE TABLE IF NOT EXISTS implemento (sku INT NOT NULL, nombre VARCHAR(255), PRIMARY KEY(sku));
CREATE TABLE IF NOT EXISTS tiene (id_serie INT REFERENCES serie(id_serie) ON DELETE CASCADE ON UPDATE CASCADE, id_ejercicio INT REFERENCES ejercicio(id_ejercicio) ON DELETE RESTRICT ON UPDATE CASCADE, cantidad INT, PRIMARY KEY(id_serie, id_ejercicio));
CREATE TABLE IF NOT EXISTS utiliza (id_ejercicio INT REFERENCES ejercicio(id_ejercicio) ON DELETE CASCADE ON UPDATE CASCADE, sku INT REFERENCES implemento(sku) ON DELETE CASCADE ON UPDATE CASCADE, PRIMARY KEY(id_ejercicio, sku));

-- Tuplas de prueba para la tabla ejercicio
INSERT INTO ejercicio (nombre, unidad) VALUES 
('Flexiones de brazos', 'Repeticiones'),
('Sentadillas', 'Repeticiones'),
('Plancha abdominal', 'Segundos'),
('Curl de bíceps', 'Repeticiones'),
('Press de hombros', 'Repeticiones');

-- Tuplas de prueba para la tabla implemento
INSERT INTO implemento (sku, nombre) VALUES
(101, 'Mancuernas de 5kg'),
(102, 'Barra olímpica'),
(103, 'Bosu'),
(104, 'Banda elástica'),
(105, 'Kettlebell de 10kg');

-- Tuplas de prueba para la tabla utiliza
INSERT INTO utiliza (id_ejercicio, sku) VALUES
(1, 101), -- Flexiones de brazos con mancuernas de 5kg
(2, 102), -- Sentadillas con barra olímpica
(4, 101), -- Curl de bíceps con mancuernas de 5kg
(5, 102), -- Press de hombros con barra olímpica
(5, 104); -- Press de hombros con banda elástica

INSERT INTO cliente (rut_cliente, nombre, apellidos) VALUES
(215389693, 'Juan', 'Pérez'),
(175813608, 'María', 'González'),
(183832611, 'Pedro', 'Sánchez'),
(191392310, 'Ana', 'López'),
(231609288, 'David', 'Martínez');

INSERT INTO hitos (rut_cliente, masa, estatura, edad, objetivo) VALUES
(215389693, 135, 186, 18, 'Bajar de peso'),
(175813608, 58, 162, 63, 'Definir'),
(183832611, 85, 176, 28, 'Bajar de peso'),
(191392310, 74, 156, 21, 'Subir de peso'),
(231609288, 69, 179, 45, 'Definir');

INSERT INTO usuario (rut_usuario, nombre, apellidos, tipo, contraseña, estado) VALUES
(136076116, 'Luis', 'Martínez', 'admin', 'lumartinez', 'activo'),
(113634731, 'Laura', 'Díaz', 'trainer', 'ladiaz', 'activo'),
(181513160, 'Carlos', 'López', 'trainer', 'calopez', 'activo'),
(115263463, 'Elena', 'García', 'trainer', 'elgarcia', 'activo'),
(79004952, 'Javier', 'Rodríguez', 'trainer', 'jarodriguez', 'activo');

INSERT INTO rutina (timestamp_inicio, timestamp_final, rut_cliente, rut_usuario) VALUES
('2024-04-29 08:00:00', '2024-04-29 09:00:00', 215389693, 113634731), -- Rutina 1 de cliente Juan Perez con entrenador Laura Diaz
('2024-04-30 09:30:00', '2024-04-30 10:30:00', 183832611, 115263463), -- Rutina 1 de cliente Pedro Sanchez con entrenador Elena Garcia
('2024-04-30 10:00:00', '2024-04-30 11:00:00', 191392310, 79004952), -- Rutina 1 de cliente Ana Lopez con entrenador Javier Rodriguez
('2024-05-01 08:30:00', '2024-05-01 09:30:00', 175813608, 181513160), -- Rutina 1 de cliente Maria Gonzalez con entrenador Carlos Lopez
('2024-05-02 09:00:00', '2024-05-02 10:00:00', 215389693, 79004952), -- Rutina 2 de cliente Juan Perez con entrenador Javier Rodriguez
('2024-05-03 13:00:00', '2024-05-03 15:00:00', 215389693, 181513160), -- Rutina 3 de cliente Juan Perez con entrenador Carlos Lopez
('2024-05-05 11:00:00', '2024-05-05 12:00:00', 215389693, 113634731), -- Rutina 4 de cliente Juan Perez con entrenador Laura Diaz
('2024-05-06 19:00:00', '2024-05-06 22:00:00', 215389693, 113634731), -- Rutina 5 de cliente Juan Perez con entrenador Laura Diaz
('2024-05-07 15:00:00', '2024-05-07 16:00:00', 215389693, 115263463); -- Rutina 6 de cliente Juan Perez con entrenador Elena Garcias

INSERT INTO serie (id_rutina, cantidad) VALUES
(1, 2),
(2, 3),
(2, 4),
(3, 2),
(4, 1),
(5, 3),
(5, 3),
(6, 2),
(7, 4),
(8, 4),
(8, 3),
(8, 4),
(8, 4),
(9, 3);

INSERT INTO tiene (id_serie, id_ejercicio, cantidad) VALUES
(1, 1, 15),
(1, 2, 20),
(2, 3, 60),
(2, 5, 12),
(3, 4, 12),
(3, 2, 25),
(4, 1, 20),
(4, 3, 45),
(5, 2, 30),
(5, 4, 15),
(6, 4, 6),
(7, 2 ,22),
(7, 4, 15),
(7, 1, 10),
(7, 3, 5),
(7, 5, 10),
(8, 1, 2),
(9, 2, 10),
(9, 5, 25),
(10, 2, 30),
(10, 4, 21),
(11, 2, 25),
(11, 3, 10),
(11, 5, 7),
(12, 1, 6),
(12, 4, 12),
(13, 3, 15),
(14, 2, 12);