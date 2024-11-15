export async function insert(db, value) {
  const statement = await db.prepareAsync(
    "INSERT INTO fechas (fecha) VALUES ($value)"
  );
  try {
    let result = await statement.executeAsync({
      $value: value,
    });
    console.log("[OK]Insert", result.lastInsertRowId, result.changes);
  } finally {
    await statement.finalizeAsync();
  }
}
