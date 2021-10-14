# Trabajo Práctico Nº1 para la materia Sistemas Gráficos - 2c2021


## Objetivo

La escena 3D a implementar consiste en una estación espacial más una capsula que vuela en forma independiente sobre la superficie de la tierra

La geometría de la estación se construirá en forma paramétrica con los siguientes parámetros:

- Número de filas de paneles solares: 1 a 10
- Ángulo de paneles: Angulo de inclinación de 0 a 360 grados
- Velocidad de rotación del anillo: gira respecto del eje del núcleo
- Cantidad de módulos del anillo: 2 a 8

Se debe implementar un menú con la biblioteca dat.gui que permita ajustar los parámetros y regenerar el modelo.

## Algoritmos y Funciones requeridos para la implementación

- Curvas de Bézier: a partir de un arreglo de puntos de control, las funciones deben poder evaluar un punto de la curva en base al parámetro “u”.
- Discretizador de curvas: dada una curva Bézier y un “delta u” devuelve una secuencia de puntos correspondientes a la posición, tangente o normal de la curva.
- Constructor Objeto 3D: debe ser capaz de crear instancias transformables (posición, traslación y escala) que puedan vincularse jerárquicamente (padre/hijo). Estas pueden tener o no buffers asociados (por ejemplo, en el caso de contenedores)
- Superficie de Barrido: debe ser capaz de recibir como parámetros la forma y el recorrido y devolver los buffers correspondientes a la superficie.
