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
}

export async function getData(db){
    const allRows = await db.getAllAsync("SELECT * FROM test");
    for (const row of allRows) {
      console.log(row.id, row.value, row.intValue);
    }
}