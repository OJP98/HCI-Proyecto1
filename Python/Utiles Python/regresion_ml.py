import pandas as pd
import numpy as np
from sklearn import linear_model
import matplotlib.pyplot as plt

# Se declara el frame de los datos
df = pd.read_csv("dummyData.csv")
print(df)

# Se obtienen objetos independientes
hora = df[['Hora']]
nivel = df.Nivel

# Calculo de la regresion lineal
reg = linear_model.LinearRegression()
reg.fit(hora,nivel)

# Creacion de la gráfica y línea de tendencia
plt.xlabel('hora')
plt.ylabel('nivel')
plt.scatter(df.Hora,df.Nivel,color='red',marker='+')
plt.plot(df.Hora,reg.predict(hora),color='blue')
plt.show()

# Declaración del dato a predecir
predict = reg.predict([[100]])

print(predict)