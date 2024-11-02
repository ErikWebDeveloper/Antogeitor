export const formatearFecha = (fecha) => {
  // Crear un objeto Date a partir de la cadena de fecha
  const dateObj = new Date(fecha);

  // Obtener el día, mes y año
  const dia = String(dateObj.getDate()).padStart(2, "0"); // Día con dos dígitos
  const mes = String(dateObj.getMonth() + 1).padStart(2, "0"); // Mes con dos dígitos
  const anio = dateObj.getFullYear(); // Año

  // Retornar la fecha formateada
  return `${dia}/${mes}/${anio}`;
};
