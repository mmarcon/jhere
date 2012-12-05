#jHERE

Maps are cool, but map APIs are complicated. jHERE solves this problem by offering a simple but powerful map API in the form of a jQuery (or Zepto.JS) plugin.

With jHERE, you can easily add interactive maps to your website. In only 4KB, you get a powerful map API, highly customizable markers, event handling and info bubbles. Bonus features are KML support and data visualization via heatmaps.

![Screenshot](https://raw.github.com/mmarcon/jhere/master/docs/shot.png)

## Add jHERE to your pages

Adding jHERE to a web page or web application is very easy. jHERE supports both jQuery as well as Zepto.JS, so first of all include one of these libraries.

	<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>
	
or

	<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/zepto/1.0rc1/zepto.min.js"></script>
	
In case you are using Zepto, you will need to include the Zepto adapter, that includes a couple of little things that are not implemented in Zepto and I used in my plugin (`$.Deferred` and `$.data`).

	<script type="text/javascript" src="js/zepto.adapter.js">
	<!--Only when using Zepto-->
	</script>
	
Finally include the plugin.

	<script type="text/javascript" src="js/jhere.js"></script>
	
And done. Execute your code on window load.

	<script>
		$(window).on('load', function(){
			$('#map').jHERE({
				enable: ['behavior'],
        		center: [40.664167, -73.838611],
		        zoom: 8
			})
		});
	</script>

That's it. All the documentation is available at [jhere.net/docs.html](http://jhere.net/docs.html).

## Extensions

Please refer to [EXTENSIONS.md](https://github.com/mmarcon/jhere/blob/master/EXTENSIONS.md) for information about the extensions for jHERE.

### Playground
Because [@thingsinjars](http://twitter.com/thingsinjars) is awesome **jHERE** has [a playground](http://bin.jhere.net), where you can go and experiment with the API, make cool maps, save the result as a Gist and share it with the world.

## Contribute

Feel free to submit pull requests and report the issues you may find when using the plugin.

### Code Style

I am not a code style super-geek, but here are the things I like and I don't like:

 1. **☼ Like:** semicolons at the end of the line.
 2. **☁ Don't like:** tabs, use **4** spaces instead. Not 1, not 2, **4**.
 3. **☼ Like:** single quotes for strings.
 4. **☁ Don't like:** trailing whitespaces, messed up indentation.
 5. **☼ Like:** meaningful variable names. Don't steal the job to the minificator. Also I want to keep the size of the plugin small, so do facilitate the minificator's job by caching long namespaces and functions that are invoked often.
 6. **☁ Don't like:** globals.
 7. **☼ Like:** well documented API. If you add functionalities, take the time to write the documentation using `//` comments directly in the source code. Docco will do the rest.
 
#### Comments

I normally like single line comments, i.e.

	//My comment goes here
	
However I am using [Docco](http://jashkenas.github.com/docco/) to automatically generate documentation for the API, so `//` is reserved for documentation, as single line comments are parsed by the tool. Anything that developers using the plugin should not see in the API docs will have to be commented with `/* */`.