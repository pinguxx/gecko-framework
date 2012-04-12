# Gecko framework

### English at the bottom

Pequeño framework (25kb min, 8kb min y gzip)

Hice el framework usando piezas de diferentes lados, de jquery y otros frameworks, no recuerdo todos ellos, pero si vez algo que sea tuya dejamelo saber para darte crédito por ello, ademas de cosas mías

Maneja selector y cache para las selecciones ademas de algunas funciones útiles

Solo soporte para cliente por ahora

## Manual

Carga el script en tu header o despues de body

```
<script src="gecko.min.js"></script>
```

Puedes usar `gecko` o `gk` para las funciones
para user el document on ready como en jquery:

```
gk(function(){
	//funcionalidad aqui
}
```

para ver la version

```
gk().gecko
```

Gecko usa selectores css2 como:

```
gk('#h3') //for id
gk('div') //for tags
gk('.class') //by class
gk('.ho1', gk('#h1')) //with context
gk('#h1 > #h11 > div') //inside others, like context
gk('#h1 .ho1') //see more examples in test file
gk('#h5', false) //pasar false para borrar el cache y volver a buscar
```

Tomar atributos

```
gk('#h2').a('id') //atributo a
gk('#h2').a('class') //class
gk('#h2').a('class', null); //setear atributo
//setear objeto
var prop = {prop: 1, prop2: 2};
gk('#h4').a('hu', prop);
gk('#h4').a('hu').prop;
```

Ver el html

```
gk('#h2').h()
```

Borrar elementos

```
gk('#h5').r();
```

Tomar valores de los inputs

```
gk('#h6').v()
```

Actualizar estilos

```
gk('#h2').c('height'); //leer
gk('#h2').c('width', '150px'); //escribir
```

Soporta eventos

```
gk('.ho1').e('click', function(){ console.log('hola') }); //al dar click, muestra hola en consola
```

Revisar si tiene una clase el elemento o setear una clase

```
gk('#h1').C('ho1')
```

Leer cookies

```
gk.ce('bla')
```

Hacer elemento dragable (que se pueda mover con el mouse)

```
gk('#dragMe').dd();
/* Puedes pasar las siguientes opciones
 * options{
 *	box: gecko object,
 *	handler: gecko object,
 *	begin: function,
 *	dragging: function,
 *	end: function
 * }
 **/
```

También se pueden hacer resizables (cambiar de tamaño)

```
gk('#dragMe').rz();
/* Puedes pasar las siguientes opciones
 * options{
 *	box: gecko obj,
 *	minx: int or string
 *	miny: int or string
 *	begin: function,
 *	resizing: function,
 *	end: function
 * }
 *
 **/
```

Formatear fechas

```
gk.df.date(new Date(1324252305569),"dd/MM/yyyy"); //18/12/2011
gk.df.date(new Date(1324252305569),"dd/MMM/yyyy"); //18/Dec/2011
```

Mas funciones como:

```
merge
makeArray
isWindow
each
isF //is function
isArray
e //evento
eh //manejador del evento
w //en q parte del array esta
f //filtrar array
parallel //ejecutar funciones en paralelo
series //ejecutar funciones en serie
eachParallel //for each en parallel
eachSync //for each synchrony
keys //todas las llaves de un array
eachSeries //each serial
j //para llamadas json/jsonp t.j([url:String], [callback:String(Function name), Function], [timeout,Integer(ms, optional)]);
a //para llamadas ajax 
/*
t.a({
		    url:[url:String],
		    method:[method:String,(GET|POST), optional],
		    data:[postdata:String|Object, optional],
		    type:[response Object:String(Text, Xml, ...), optional],
		    async:[callback:Function, optional]
		});
*/
p //parametrizar objetos t.p([object:Object], [middle:String, optional], [connector:String, optional], [prefix:String, optional], [suffix:String, optional], [filter1:Function, optional], [filter2:Function, optional]);
show //mostrar un elemento
```

Puedes extender la funcionalidad de gecko con plugins como jquery de la siguiente forma

```
//plugin boilerplate
//You need an anonymous function to wrap around your function to avoid conflict
(function( gk ){
 
    //Attach this new method to gecko
    gk.fn.extend({ 
         
        //This is where you write your plugin's name
        pluginname: function() {
 
            //Iterate over the current set of matched elements
            return this.each(function() {
             
                //code to be inserted here
                console.log(this);
             
            });
        }
    });     
})( gecko );
```

Bugs supongo que muchos :)

Probado en chrome, opera, safari, ff

Si te sirve hazmelo saber para ponerlo en la lista de paginas que lo usan :)


## License

  See license
  
  <a href="http://www.ipseitycloud.com"><img src="http://ipseitycloud.com/cld/images/ipc_small.png" /></a>

## Test

Corre test/test.html para ver los resultados

Usado evidence para las pruebas

  
# English

Small framework (25kb min, 8kb min and gzip)

I did it by gathering some pieces from here and there some from jquery and other frameworks, i don't recall all of them :( but if you see one let me know to give you credit for it, also have some pieces by my own of course

It has a selector and cache for selection plus some utilities functions

Only supported on client for now

## Manual

Load the scripts at the header or after the body

```
<script src="gecko.min.js"></script>
```

You can use `gecko` or `gk`

To do a document ready like jquery do:

```
gk(function(){
	//functions here
}
```

To see the version

```
gk().gecko
```

Gecko use css2 selectors such as

```
gk('#h3') //for id
gk('div') //for tags
gk('.class') //by class
gk('.ho1', gk('#h1')) //with context
gk('#h1 > #h11 > div') //inside others, like context
gk('#h1 .ho1') //see more examples in test file
gk('#h5', false) //pass false to erase cache
```

Set/get attributes

```
gk('#h2').a('id') //attribute a
gk('#h2').a('class') //class
gk('#h2').a('class', null); //set attribute
//set objetc
var prop = {prop: 1, prop2: 2};
gk('#h4').a('hu', prop);
gk('#h4').a('hu').prop;
```

Get the html

```
gk('#h2').h()
```

Erase elements

```
gk('#h5').r();
```

Take values from input

```
gk('#h6').v()
```

Update styles

```
gk('#h2').c('height'); //read
gk('#h2').c('width', '150px'); //write
```

Support events

```
gk('.ho1').e('click', function(){ console.log('hello') }); //on click show hello on console
```

Check if we have a class in an element or you can set it

```
gk('#h1').C('ho1')
```

Read cookies

```
gk.ce('bla')
```

Make element draggable

```
gk('#dragMe').dd();
/* You can pass this options
 * options{
 *	box: gecko object,
 *	handler: gecko object,
 *	begin: function,
 *	dragging: function,
 *	end: function
 * }
 **/
```

Can make them resizable also

```
gk('#dragMe').rz();
/* You can pass this options
 * options{
 *	box: gecko obj,
 *	minx: int or string
 *	miny: int or string
 *	begin: function,
 *	resizing: function,
 *	end: function
 * }
 *
 **/
```

format dates

```
gk.df.date(new Date(1324252305569),"dd/MM/yyyy"); //18/12/2011
gk.df.date(new Date(1324252305569),"dd/MMM/yyyy"); //18/Dec/2011
```

More functions like:

```
merge
makeArray
isWindow
each
isF //is function
isArray
e //events
eh //event handler
w //which part on the array is it
f //filter array
parallel //execute functions in parallel
series //execute functions in serial
eachParallel //for each in parallel
eachSync //for each synchrony
keys //all keys
eachSeries //each serial
j //to make calls json/jsonp t.j([url:String], [callback:String(Function name), Function], [timeout,Integer(ms, optional)]);
a //to make ajax calls
/*
t.a({
		    url:[url:String],
		    method:[method:String,(GET|POST), optional],
		    data:[postdata:String|Object, optional],
		    type:[response Object:String(Text, Xml, ...), optional],
		    async:[callback:Function, optional]
		});
*/
p //parametrize objects t.p([object:Object], [middle:String, optional], [connector:String, optional], [prefix:String, optional], [suffix:String, optional], [filter1:Function, optional], [filter2:Function, optional]);
show //show an element
```

Functions can be chained


You can extend the functionality with plugins

```
//plugin boilerplate
//You need an anonymous function to wrap around your function to avoid conflict
(function( gk ){
 
    //Attach this new method to gecko
    gk.fn.extend({ 
         
        //This is where you write your plugin's name
        pluginname: function() {
 
            //Iterate over the current set of matched elements
            return this.each(function() {
             
                //code to be inserted here
                console.log(this);
             
            });
        }
    });     
})( gecko );
```

Maybe a lot of bugs, but you can help

Tested on chrome, opera, safari, ff




## License

  See license
  
  <a href="http://www.ipseitycloud.com"><img src="http://ipseitycloud.com/cld/images/ipc_small.png" /></a>


## Test

Run test/test.hml to see the results

Evidence used to do the testing

  