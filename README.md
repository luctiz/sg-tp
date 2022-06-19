# Trabajo Práctico - Sistemas Gráficos

La escena 3D implementada consiste en una estación espacial más una capsula que vuela en forma independiente sobre la superficie de la tierra.

Fué construida utilizando WebGL y GLMatrix

## Cámaras

Al presionar `1`, `2` y `3` puede cambiarse de cámara, siendo:

Las camaras 1 y 2 camaras orbitales que pueden controlarse con el mouse

La cámara 3 una cámara que persigue a la cápsula, la cual puede controlarse usando las teclas `WASD`, `QE` y las `flechas direccionales`

## Modelado de la escena

La geometría de la estación se construye en forma paramétrica con los siguientes parámetros:

- Número de filas de paneles solares: 1 a 10
- Ángulo de paneles: Angulo de inclinación de 0 a 360 grados
- Velocidad de rotación del anillo: gira respecto del eje del núcleo
- Cantidad de módulos del anillo: 2 a 8

Se implementó un menú con la biblioteca dat.gui que permite ajustar los parámetros y regenerar el modelo.

### Algoritmos y Funciones usados para el modelado

- Curvas de Bézier: a partir de un arreglo de puntos de control, las funciones evaluan un punto de la curva en base al parámetro “u”.
- Constructor Objeto 3D: Capaz de crear instancias transformables (posición, traslación y escala) que pueden vincularse jerárquicamente (padre/hijo) para formar un árbol de la escena.
- Superficie de Barrido: Capaz de recibir como parámetros una forma y un recorrido, en base a los cuales devuelve los buffers correspondientes a una superficie

### Algoritmos usados para Iluminación

- Modelo de Iluminación de Phong con 3 tipos de luz: Omnidireccional, Direccional y Spot

- Mapas de reflexión: Simulan reflejo de la superficie de la tierra en las superficies metálicas o brillantes de la escena

- Mapas de normales: Simulan relieve en los módulos de la estación espacial y cápsula, en base a texturas que contienen información del mismo
