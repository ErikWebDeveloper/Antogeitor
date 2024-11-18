import { getAll as getFechas, insert as insertFecha } from "./fechasModel";

export async function getAllByFecha(db, fecha) {
  const statement = await db.prepareAsync(`SELECT 
    comidas.id,
    fechas.fecha,
    comidas.hora,
    comidas.etiqueta,
    comidas.duracion,
    comidas.intensidad,
    comidas.comida,
    comidas.antojo,
    comidas.calorias
FROM 
    comidas
JOIN 
    fechas 
ON 
    comidas.fecha_id = fechas.id
WHERE 
    fechas.fecha = $fecha;
ORDER BY 
    comidas.hora ASC;
    `);

  try {
    let result = await statement.executeAsync({
      $fecha: fecha,
    });

    let allRows = await result.getAllAsync();

    // Convertir todos los valores a string excepto "antojo", que será booleano
    const transformedRows = allRows.map((row) => {
      const transformedRow = {};
      for (const key in row) {
        if (key === "antojo") {
          transformedRow[key] = row[key] === 1 ? 1 : 0; // 1 se convierte en true, cualquier otro valor en false
        } else {
          transformedRow[key] = row[key] !== null ? String(row[key]) : null;
        }
      }
      return transformedRow;
    });

    return {
      success: true,
      result: result,
      rows: transformedRows,
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

export async function insert(db, date, values) {
  console.log(date);
  let result = await insertFecha(db, date);

  if (!result.id) return console.log("Error al obtener fecha id");

  let fechaId = result.id;

  const statement = await db.prepareAsync(`
    INSERT INTO comidas (fecha_id, hora, etiqueta, duracion, intensidad, comida, antojo, calorias) 
    VALUES ($fecha_id, $hora, $etiqueta, $duracion, $intensidad, $comida, $antojo, $calorias);
    `);

  try {
    let result = await statement.executeAsync({
      $fecha_id: fechaId,
      $hora: values.hora,
      $etiqueta: values.etiqueta,
      $duracion: parseInt(values.duracion),
      $intensidad: parseInt(values.intensidad),
      $comida: values.comida,
      $antojo: values.antojo,
      $calorias: parseInt(values.calorias),
    });

    return {
      success: true,
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

export async function updateById(db, id, values) {
  const statement = await db.prepareAsync(`
    UPDATE comidas
    SET 
      hora = $hora,
      etiqueta = $etiqueta,
      duracion = $duracion,
      intensidad = $intensidad,
      comida = $comida,
      antojo = $antojo,
      calorias = $calorias
    WHERE id = $id;
  `);

  try {
    const result = await statement.executeAsync({
      $id: id,
      $hora: values.hora,
      $etiqueta: values.etiqueta,
      $duracion: parseInt(values.duracion),
      $intensidad: parseInt(values.intensidad),
      $comida: values.comida,
      $antojo: values.antojo,
      $calorias: parseInt(values.calorias),
    });

    if (result.changes === 0) {
      return {
        success: false,
        message: `No record found with id ${id}`,
      };
    }

    return {
      success: true,
      changes: result.changes,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error al actualizar los datos",
    };
  } finally {
    await statement.finalizeAsync();
  }
}

export async function deleteById(db, id) {
  const statement = await db.prepareAsync(`
    DELETE FROM comidas
    WHERE id = $id;
  `);

  try {
    const result = await statement.executeAsync({
      $id: id,
    });

    if (result.changes === 0) {
      return {
        success: false,
        error: `No record found with id ${id}`,
      };
    }

    return {
      success: true,
      changes: result.changes,
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
