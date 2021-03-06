import smtplib, ssl




def enviarCorreo(asunto,mensaje,destino):
	# _______NOTA_______
	# Ambos correos, origen y destino, necesitan ser propios de gmail
	# Se intentó correos derivados (como @uvg.edu.gt) pero no funcionó

	# Se establece un puerto que abarque lo correos regionalmente
	port = 587
	# Se establece conección segura con SSL
	context = ssl.create_default_context()

	# Correo de origen
	sender_email = "proyectouvghci@gmail.com"
	# Contraseña del correo que envía
	sender_password = "perroUVG"
	# Correo destino
	#receiver_email = "josepablocif16@gmail.com"


	# Mensaje de envío.
	# NOTA: Lo que sigue despues de Subject: es el asunto del correo
	# Dos enters despues, se define el mensaje como tal.
	
	
	message = f"""\
	Subject: {asunto}

	{mensaje}"""


	# Una vez establecida la conexión con el server, se hace login 
	# del correo con el cual se envía el mensaje, seguido de la función
	# que envía el mensaje
	with smtplib.SMTP("smtp.gmail.com", port) as server:
		server.starttls(context=context)
		server.login(sender_email, sender_password)
		server.sendmail(sender_email, destino, message)
		server.quit()