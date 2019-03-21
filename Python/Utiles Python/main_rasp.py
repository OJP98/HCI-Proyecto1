import time
import os
import datetime
import BDFirebase as bd

def leerTxt(filename):
	datos = []

	# Declaración de variables a utilizar
	archivo = open(filename)
	hoy = datetime.datetime.now()
	textito = archivo.read().splitlines()

	# Se obtiene última línea del .txt
	ultimaLinea = textito[len(textito)-1].split("\t")

	# Añadir los datos a una lista
	for n,item in enumerate(ultimaLinea):
		pos = item.index("sensor")
		datos.append(int(item[pos+9:]))
		if n == 0:
			hora = item[1:6]

	# Obtener contador de bd
	contador = bd.getData("x","Contador")

	# Obtener nivel de agua
	try:
		nivel_agua = datos.index(0)
	except:
		nivel_agua = 3

	# Publicar ultimo dato en bd
	bd.updateOrSet(str(contador),"nivelAgua",nivel_agua)

	# Actualizar contador en bd
	contador += 1
	bd.updateOrSet("x","Contador",contador)

	# Cerrar archivo .txt
	archivo.close()



# PROGRAMA PRINCIPAL
while True:
	leerTxt('./datos.txt')
	time.sleep(2)