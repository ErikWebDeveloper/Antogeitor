export async function insert(db, value) {
  if (!value) {
    return {
      success: false,
      error: "El valor de la fecha no puede ser vacío o nulo.",
    };
  }

  try {
    // Intenta insertar la fecha solo si no existe
    await db.runAsync(
      `
      INSERT INTO fechas (fecha)
      SELECT $value
      WHERE NOT EXISTS (SELECT 1 FROM fechas WHERE fecha = $value);
    `,
      { $value: value }
    );

    // Selecciona el ID de la fecha
    const result = await db.getFirstAsync(
      `
      SELECT id FROM fechas WHERE fecha = $value;
    `,
      { $value: value }
    );

    // Si no se encuentra un resultado, maneja el caso en que no existe la fecha
    if (!result) {
      return { success: false, error: "Fecha no encontrada" };
    }

    // Devuelve el ID de la fecha
    return { success: true, id: result.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function get(db, fecha) {
  const statement = await db.prepareAsync(
    `SELECT id FROM fechas WHERE fecha = $fecha;`
  );
  try {
    let result = await statement.executeAsync({
      $fecha: fecha,
    });

    let row = await result.getFirstAsync();

    return {
      success: true,
      row: row,
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

export async function getAll(db) {
  const statement = await db.prepareAsync(`SELECT * FROM fechas;`);

  try {
    const result = await statement.executeAsync();
    const rows = await result.getAllAsync();

    return {
      success: true,
      rows: rows,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error al obtener los datos",
    };
  } finally {
    await statement.finalizeAsync();
  }
}


export async function removeById(db, id) {
  const statement = await db.prepareAsync(`DELETE FROM fechas WHERE id = $id;`);

  try {
    await statement.executeAsync({
      $id: id,
    });

    return {
      success: true,
      message: "Registro eliminado con éxito",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error al eliminar el registro",
    };
  } finally {
    await statement.finalizeAsync();
  }
}
