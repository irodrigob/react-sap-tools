# Introducción

React SAP tools es un conjunto de herramientas para SAP, que como su nombre indica, creadas en React. Actualmente tanto las herramientas, solo hay una, como en su funcionalidad son muy básicas pero la idea es ir dandoles más funcionalidad e ir añadiendo nuevas herramientas.

La herramienta actualmente disponible es la siguiente:

* Transporte de ordenes

## Prerequistos

### Instalación de las herramientas en SAP

Para que la aplicación en React pueda utilizar las herramhay que instalar las siguientes aplicaciones en tu servidor de SAP:

* [https://github.com/irodrigob/abap-sap-tools-core](Core) de las herramientas de SAP es el primer paso para poder utilizar las herramientas
* [https://github.com/irodrigob/abap-sap-tools-trans-order](Herramienta de transporte de ordenes)

### Cuenta en Gmail

Los sistemas que se van configurando se guardan en una base de datos asociado a tu cuenta de correo de Google, por ello lo primero que va hacer la aplicación es pedirte que hagas login con tu cuenta de Gmail.

### Tunneling

**IMPORTANTE: Si nuestro servidor de SAP no es local, es decir, que es accesible desde el exterior este paso no es necesario**

Generalmente los servidor de SAP a los que nos conectamos con Eclipse o SAP GUI son servidores locales los cuales no son accesibles desde el exterior. Por ello para que desde la aplicación se pueda conectar al servidor de SAP es necesario generar un tunnel que conecte el servidor de SAP local con la aplicación. Aquellos que se esten familiarizados con desarrollo en el cloud de SAP sabrán de la existencia del `Cloud Connector`. El `Cloud Connector` es una aplicación que enlaza los servidores de SAP con el propio cloud de SAP.

Para hacer ese tunel yo uso [https://ngrok.com/](Ngrok). Ngrok es una herramienta gratuita que permite generar tuneles a tu servidor local. El registro es gratuito y puedes utilizar tu cuenta de Gmail o de Github. Lo que hace Ngrok es crear una URL dinámica que permite conectarnos a nuestro servidor local.

La instalación es muy sencilla y en la página web esta muy bien explicado pero hago un resumen rápido:

* Desde la [https://dashboard.ngrok.com/get-started/setup](página inicial) nos descargamos el programa para hacer un tunel. Es un fichero zip que solo tenemos que descomprimirlo en la ubicación que queramos.
* Lo siguiente es añadir el token tal como se indica en las instrucciones: 

```bash
ngrok config add-authtoken <token que se indica en la página>
```

Para hacer el tunel yo recomiendo usar el powershell de Windows, quien use Windows, porque permite copiar la URL que genera al hacer el tunel. Si nuestro servidor es `http://vhcalnplci.dummy.nodomain:8000` el tunel se crearía así:

```bash
 .\ngrok.exe http http://vhcalnplci.dummy.nodomain:8000    
```

Esto generará un tunel y tan solo tenemos que copiar la URL para luego configurarlo en nuestro sistema.

En la versión gratuita solo es posible generar un tunel y no se puede hacer tuneles con un dirección fija. Por ello cada vez que nos quedamos conectar a un sistema habrá que hacer un tunel.

# Inicio de la aplicación

La primera vez que entremos a la aplicación nos saldrá el botón para conectarnos con nuestra cuenta de google:

![alt login](https://github.com/irodrigob/react-sap-tools/blob/master/public/instrucciones/pantalla_login.png)

Una vez conectados no saldrá la pantalla inicial:

![alt pantalla inicial](https://github.com/irodrigob/react-sap-tools/blob/master/public/instrucciones/pantalla_inicial.png)

El siguiente paso es añadir un sistema.

## Añadir un nuevo sistema.

Para añadir un nuevo sistema tenemos que abrir el desplegable de sistemas y pulsar el botón de `Añadir sistema` donde introduciremos los datos del sistema donde nos queramos conectar.

![alt añadir sistema](https://github.com/irodrigob/react-sap-tools/blob/master/public/instrucciones/anyadir_sistema.png)

En el `Host Servidor` tendremos que introducir la URL de conexión a nuestro servidor. Si no la conocemos podemos utilizar el [https://github.com/irodrigob/abap-sap-tools-core/wiki#saber-la-url-del-servidor-de-sap](programa) de utilidades en el core de las herramientas de SAP para saberlo. En la imagen he puesto la url del tunel que he generado previamente. 

Una vez introducido todos los datos hay que pulsar sobre el botón de `Grabar`.

La contraseña se cifra, usando AES, en base de datos y solo se descrifra en el momento de hacer la conexión a SAP. Con lo cual cualquier que inspeccione las llamadas no verá nunca la contraseña legible.

## Modificando un sistema

Para modificar un sistema tenemos que volver abrir el desplegable y pulsar el botón `Ver sistema`, el cual nos abrira la siguiente ventana:

![alt añadir sistema](https://github.com/irodrigob/react-sap-tools/blob/master/public/instrucciones/listado_sistemas.png)

Para editarlo pulsaremos el lapiz que esta la fila del sistema que queremos modificar

![alt modificar sistema](https://github.com/irodrigob/react-sap-tools/blob/master/public/instrucciones/modificar_sistema.png)

Una vez modificado pulsaremos sobre el botón de confirmar, o rechazar si no queremos hacer cambios.

## Borrar un sistema

Los pasos para borrar un sistema son los mismos que para modificarlo, lo único que varia es que tendremos que pulsar sobre el icono de la papelera y confirmar el borrado.

## Conectado con un sistema

Para seleccionar un sistema hay que abrir el desplegable de sistema y seleccionar el sistema al que se quiera conectar. Una vez seleccionado se nos abrirá el selector de aplicaciones:

![alt seleccionar aplicación](https://github.com/irodrigob/react-sap-tools/blob/master/public/instrucciones/seleccionar_aplicacion.png)

Y pulsaremos aquella que queramos utilizar.