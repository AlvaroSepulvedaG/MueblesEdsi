// lib/api.js
export async function getVentasReport() {
    // Datos de prueba
    return [
        { id: 1, producto: 'Silla Ergonomica', unidadesVendidas: 120, ingresosTotales: 18000 },
        { id: 2, producto: 'Escritorio de Madera', unidadesVendidas: 80, ingresosTotales: 24000 },
        { id: 3, producto: 'Sofá Modular', unidadesVendidas: 45, ingresosTotales: 40500 },
        { id: 4, producto: 'Mesa de Centro', unidadesVendidas: 150, ingresosTotales: 22500 },
        { id: 5, producto: 'Estantería Industrial', unidadesVendidas: 60, ingresosTotales: 15000 },
    ];
}
