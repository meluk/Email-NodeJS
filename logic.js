var express = require("express");
var app = express();
var path = require('path');
var fs = require('fs');

//Variables globales para la app
var archivoHTML;

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded());
var nodemailer = require('nodemailer');
 
// SMTP transport 
var transporter = nodemailer.createTransport('smtps://ladoservidor2016%40gmail.com:ladosrv2016@smtp.gmail.com');
 
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

//Se encarga de leer el archivo html de forma sincrónica
function leerHTML(archivo)
{
	return fs.readFileSync(__dirname + archivo,'utf8');
}

function enviarCorreo(respuestas)
{
	//console.log(respuestas) 
	var mailOptions = {
	    from: '"Laboratorio Melissa 📝" <ladoservidor2016@gmail.com>', 
	    to: 'gchavarria@ucenfotec.ac.cr', 
	    subject: 'Respuestas Encuesta ✏', 
	    text: respuestas, 
	    html: respuestas 
	};

	transporter.sendMail(mailOptions, function(error, info){
	    if(error){
	        return console.log(error);
	    }
	    console.log('Message sent: ' + info.response);
	});
}


//Primera ejecución del servidor en GET
app.get("/", function(req, res)
{
	archivoHTML = leerHTML('/public/index.html');
	res.send(archivoHTML);
	res.end();
});

//Ejecución de los post de la página
app.post("/", function(req, res)
{
	var respuestas;

	archivoHTML = leerHTML('/public/gracias.html');
	//obtengo la información
	//console.log(req.body);
	respuestas = '<h3>Respuestas</h3><br>' + '<ol>' +
	              '<li>' + req.body.pregunta1 + '</li>' +
	              '<li>' + req.body.pregunta2 + '</li>' +
	              '<li>' + req.body.pregunta3 + '</li>' +
	              '<li>' + req.body.pregunta4 + '</li>' +
	              '<li>' + req.body.opinion + '</li><ol>';

	enviarCorreo(respuestas);

	res.send(archivoHTML);
	res.end();
});

app.listen(8080);