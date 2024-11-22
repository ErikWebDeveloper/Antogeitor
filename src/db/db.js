import { deleteAll } from "./models/productosModel";

export async function initDB(db) {
  await db.execAsync(`
PRAGMA journal_mode = WAL;
CREATE TABLE IF NOT EXISTS fechas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fecha TEXT UNIQUE NOT NULL
);
`);

  await db.execAsync(`
PRAGMA journal_mode = WAL;
CREATE TABLE IF NOT EXISTS comidas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fecha_id INTEGER,
    hora TEXT NOT NULL,
    etiqueta TEXT,
    duracion INTEGER,
    intensidad INTEGER,
    comida TEXT NOT NULL,
    antojo BOOLEAN NOT NULL,
    calorias INTEGER,
    FOREIGN KEY (fecha_id) REFERENCES fechas(id)
);
`);

  await db.execAsync(`
PRAGMA journal_mode = WAL;
CREATE TABLE IF NOT EXISTS productos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    comida TEXT NOT NULL,
    calorias INTEGER
);
`);

  //await clearAllTables(db);
  await getAllData(db);

  /*await db.execAsync(`
INSERT INTO fechas (fecha) VALUES ("2024-11-15");
INSERT INTO fechas (fecha) VALUES ("2024-11-16");
INSERT INTO comidas (fecha_id, hora, etiqueta, duracion, intensidad, comida, antojo, calorias) 
VALUES (1, "08:00", "Desayuno", 30, 3, "Manzana", 1, 0);
INSERT INTO comidas (fecha_id, hora, etiqueta, duracion, intensidad, comida, antojo, calorias) 
VALUES (1, "13:00", "Almuerzo", 60, 5, "Ensalada César", 0, 250);
INSERT INTO comidas (fecha_id, hora, etiqueta, duracion, intensidad, comida, antojo, calorias) 
VALUES (2, "08:30", "Desayuno", 20, 2, "Tostada con aguacate", 1, 0);
INSERT INTO comidas (fecha_id, hora, etiqueta, duracion, intensidad, comida, antojo, calorias) 
VALUES (2, "19:00", "Cena", 45, 4, "Sopa de verduras", 0, 180);

  `);*/
}

export async function getData(db) {
  const allRows = await db.getAllAsync("SELECT * FROM test");
  for (const row of allRows) {
    console.log(row.id, row.value, row.intValue);
  }
}

async function createData(db) {
  await db.execAsync(`
PRAGMA journal_mode = WAL;
CREATE TABLE IF NOT EXISTS productos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    comida TEXT NOT NULL,
    calorias INTEGER
);
`);
}

async function getAllData(db) {
  console.log("[+]FECHAS");
  let allRows = await db.getAllAsync("SELECT * FROM fechas");
  for (const row of allRows) {
    console.log(row);
  }

  console.log("[+]COMIDAS");
  allRows = await db.getAllAsync("SELECT * FROM comidas;");
  for (const row of allRows) {
    console.log(row);
  }

  console.log("[+]PRODUCTOS");
  allRows = await db.getAllAsync("SELECT * FROM productos");
  for (const row of allRows) {
    console.log(row);
  }
}

async function clearAllTables(db) {
  try {
    // Iniciar una transacción
    await db.execAsync("BEGIN TRANSACTION;");

    // Borrar datos de cada tabla
    await db.execAsync("DELETE FROM comidas;");
    await db.execAsync("DELETE FROM productos;");
    await db.execAsync("DELETE FROM fechas;");

    // Confirmar la transacción
    await db.execAsync("COMMIT;");

    return {
      success: true,
      message: "Todos los datos fueron eliminados exitosamente de las tablas.",
    };
  } catch (error) {
    // Revertir cambios si ocurre un error
    await db.execAsync("ROLLBACK;");
    return {
      success: false,
      error: error.message || "Error al eliminar los datos de las tablas.",
    };
  }
}
