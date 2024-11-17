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
    fechas.fecha = $fecha;`);

  try {
    let result = await statement.executeAsync({
      $fecha: fecha,
    });

    let allRows = await result.getAllAsync();

    return {
      success: true,
      result: result,
      rows: allRows
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
