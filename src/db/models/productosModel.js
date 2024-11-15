export async function get(db) {
  const allRows = await db.getAllAsync("SELECT * FROM productos");
  for (const row of allRows) {
    console.log(row.id, row.comida, row.calorias);
  }
  return allRows;
}

export async function deleteAll(db) {
  let query = await db.runAsync("DELETE FROM productos;");
  return query;
}

export async function deleteById(db, id) {
  const statement = await db.prepareAsync(
    "DELETE FROM productos WHERE id = $id"
  );
  try {
    await statement.executeAsync({
      $id: id,
    });

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error al eliminar los datos",
    };
  } finally {
    await statement.finalizeAsync();
  }
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
    return {
      success: false,
      error: error.message || "Error al insertar los datos",
    };
  } finally {
    await statement.finalizeAsync();
  }
}
