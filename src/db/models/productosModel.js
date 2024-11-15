export async function get(db) {
  const allRows = await db.getAllAsync("SELECT * FROM productos");
  for (const row of allRows) {
    console.log(row.id, row.comida, row.calorias);
  }
  return allRows;
}

export async function insert(db, value = { comida: null, calorias: null }) {
  const statement = await db.prepareAsync(
    "INSERT INTO productos (comida, calorias) VALUES ($comida, $calorias)"
  );

  try {
    let result = await statement.executeAsync({
      $comida: value.comida,
      $calorias: value.calorias,
    });
    console.log("[OK] Insert", result.lastInsertRowId, result.changes);

    return {
      success: true,
      lastInsertRowId: result.lastInsertRowId,
      changes: result.changes,
    };
  } catch (error) {
    console.error("[ERROR] Insert", error);
    return {
      success: false,
      error: error.message || "Error al insertar los datos",
    };
  } finally {
    await statement.finalizeAsync();
  }
}

