import pandas as pd
import numpy as np
from sklearn import linear_model
import matplotlib.pyplot as plt
import csv
import BDFirebase as bd
import time
from correo import enviarCorreo


class Prediccion(object):
	def __init__(self):
		self.leerCSV() 
		self.escribirCSV()  
		
	def leerCSV(self):
		#Leer csv
		with open('dummyData.csv','r') as File:  
			reader = csv.reader(File)
			cont=0
			self.ultimoValor=1
			for row in reader:
				cont+=1
				if(cont%2==0):
					try:
						self.ultimoValor=int(row[0])  #ultimoValor es por donde se quedo
					except ValueError:
						next
		File.close()


	def escribirCSV(self):
		#Escribir en csv dummyData.csv
		self.controlUltimoValor=self.ultimoValor
		self.ultimoDB=bd.getData('x','Contador')

		if not (int(self.ultimoValor)==int(self.ultimoDB)):
			if(int(self.ultimoValor)<int(self.ultimoDB)):
				with open('dummyData.csv','a') as csvfile:
					for i in range(int(self.ultimoValor),int(self.ultimoDB)+1):
						nivelAgua=bd.getData(str(i),'nivel_agua')
						fields=[]
						fields.append(i)
						fields.append(nivelAgua)
						writer = csv.writer(csvfile)
						writer.writerow(fields)
				csvfile.close()
				self.controlUltimoValor=self.ultimoDB




	def agregarCSV(self,hora,nivel):
		with open('dummyData.csv','a') as csvfile:
			fields=[]
			fields.append(hora)
			fields.append(nivel)
			writer = csv.writer(csvfile)
			writer.writerow(fields)
		csvfile.close()



	def predecirSig(self,tiempo):
		# Se declara el frame de los datos
		df = pd.read_csv("dummyData.csv")
		print(df)

		# Se obtienen objetos independientes
		hora = df[['Hora']]
		nivel = df.Nivel

		# Calculo de la regresion lineal
		reg = linear_model.LinearRegression()
		reg.fit(hora,nivel)

		# Declaración del dato a predecir
		hora=tiempo
		predict = reg.predict([[hora]])
		return round(float(predict))
 
	def quitarFila(self):
		df = pd.read_csv("dummyData.csv")
		df.drop(df.index[[len(df.index)-1]],inplace=True)
		df.to_csv('dummyData.csv', header=True, index=False)

	def getAllVecinos(self):
		contVecinos=bd.getVecino('x','Contador')
		self.vecinos=[]
		for i in range(1,contVecinos+1):
			self.vecinos.append(bd.getVecino(str(i),'correo'))

	def alerta(self):
		self.getAllVecinos()
		mensaje="El programa ha detectado un crecimiento acelerado del nivel del agua, por favor estar atento."
		for i in self.vecinos:
			enviarCorreo("Alerta Inundacion Automatica",mensaje,i)


#MAIN
time.sleep(60)
print("Listo...")
p=Prediccion()

rep=10
while True:
	varControl=True
	#Predice
	#Agrega a la base de datos
	for i in range(rep):
		p.controlUltimoValor+=1
		valorSiguiente=p.predecirSig(p.controlUltimoValor)
		bd.updateOrSet(str(p.controlUltimoValor),"nivel_agua_p",valorSiguiente)

		bd.updateOrSet("y","Contador",p.controlUltimoValor)

		if (valorSiguiente>3 and varControl):
			varControl=False
			p.alerta()
	
	print(p.ultimoDB,"ultimoDB")
	#espera
	#Elimina ultimos dos
	#Agrega ultimos 2 de BD
	while True:
		if(abs(p.ultimoDB-bd.getData('x','Contador'))>2):
			break
		else:
			next
	p.escribirCSV()		