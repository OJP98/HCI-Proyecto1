import time
import os
import datetime
import BDFirebase as bd

def leerTxt(filename):
	datos = []

	# Declaración de variables a utilizar
	archivo = open(filename)
	hoy = datetime.datetime.now()
	
	try:
		textito = archivo.read().splitlines()
	except:
		textito = "sensor1 = 0\tsensor2 = 0\tsensor3 = 0"

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
	
	# Actualizar contador en bd
	contador += 1
	bd.updateOrSet("x","Contador",contador)
	
	for i in range(3):
		if datos[i] < 100:
			datos[i] = 0
		
	
	print(datos)

	# Obtener nivel de agua
	try:
		nivel_agua = datos.index(0)
	except:
		nivel_agua = 3	

	# Publicar ultimo dato en bd
	bd.updateOrSet(str(contador),"dia", hoy.day)
	bd.updateOrSet(str(contador),"mes", hoy.month)
	bd.updateOrSet(str(contador),"hora", int(hora[:2]))
	bd.updateOrSet(str(contador),"minuto", int(hora[3:]))
	bd.updateOrSet(str(contador),"nivel_agua", nivel_agua)	

	# Cerrar archivo .txt
	archivo.close()


# PROGRAMA PRINCIPAL
while True:
	leerTxt('./datos.txt')
	time.sleep(15)