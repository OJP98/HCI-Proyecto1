def getData(root,child=None):
	from firebase import firebase
	var='/'
	var+=root
	firebase = firebase.FirebaseApplication('https://hci-uvg.firebaseio.com')
	result = firebase.get(var, child)
	return result

def updateOrSet(root,child,value):
	from firebase import firebase
	firebase = firebase.FirebaseApplication('https://hci-uvg.firebaseio.com')
	result = firebase.put(root, child,value)

def delete(root,child=None):
	from firebase import firebase
	var='/'
	var+=root
	firebase = firebase.FirebaseApplication('https://hci-uvg.firebaseio.com')
	result = firebase.delete(var, child)

##MAIN
#print (getData('user','two'))
updateOrSet('user','jose',11)
#delete('user/jose')
