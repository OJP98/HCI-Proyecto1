def getData(root,child=None):
	from firebase import firebase
	firebase = firebase.FirebaseApplication('https://hci-uvg.firebaseio.com/Datos/')
	result = firebase.get(root, child)
	return result

def updateOrSet(root,child,value):
	from firebase import firebase
	firebase = firebase.FirebaseApplication('https://hci-uvg.firebaseio.com/Datos/')
	result = firebase.put(root, child,value)

def delete(root,child=None):
	from firebase import firebase
	var='/'
	var+=root
	firebase = firebase.FirebaseApplication('https://hci-uvg.firebaseio.com')
	result = firebase.delete(var, child)

def getVecino(root,child=None):
	from firebase import firebase
	firebase = firebase.FirebaseApplication('https://hci-uvg.firebaseio.com/Vecinos/')
	result = firebase.get(root, child)
	return result