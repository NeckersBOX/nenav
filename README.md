# Nenav
**Nenav** is a plugin written with _jQuery_ and _Prettify_ to navigate inside a 
folder within sources of various type of programming languages, or better, 
within any text file, with syntax highlight to languages for which Prettify 
is configured.

The plugin _is safe_, i.e. prevent the navigation in unauthorized path. 
Is appropriate, however, put the folders, in which Nenav is active, in 
another folder whose position is specified in the plugin's PHP file. 
For more information see _"How to Use"_ section.

Nenav is released under GNU GPL 3 license and you can change the appearance 
using themes.

## How to Use
Using Nenav is easy, for first thing you need to **include jQuery and Prettify** 
libraries, after that you can add the Nenav JavaScript file. All this inside 
the _<head>_ tag:

```
<head>
  <script type="text/javascript" src="js/jquery-2.2.1.min.js"></script>
  <script type="text/javascript" src="js/prettify.js"></script>
 
  <!-- Nenav JS -->
  <script type="text/javascript" src="js/nenav.js"></script>
```

After you add the javascript files, you can optionally add the Prettify 
theme and the Nenav one. 
In this case was added the **default theme** _bootstrap-light_.

```
  <link rel='stylesheet' type='text/css' href='css/nenav-bootstrap-light.css'>
  <link rel='stylesheet' type='text/css' href='css/prettify.css'>
</head>
```

Initialization of a new view of Nenav happen with a container element and 
calling the _nenav_init ()_ function. Example:

```
<div id='nenavView'></div>
 
<script> nenav_init ('#nenavView', { init_path: 'nenav' }); </script>
```

function nenav_init () is defined by:
```
nenav_init (element, property)
```

Element can be specified with jQuery method, i.e. _#element_id_, 
_.element_class_ or more complex methods. Property is an object like this:

```
{
  init_path: 'root', /* Required. Identify the path where navigation start. */
  curr_pos: 'subpath/of/root', /* Optional. If at the begin you want to start navigation from another folder
                                  different from init_path. Default: null */
  sort: 'size-reverse', /* Optional. Identify the sort type  when nenav is initialized. Default: name. 
                           Values: name, size, time, name-reverse, size-reverse, time-reverse. */
  php_path: 'php', /* Optional. It's the folder where the nenav.php file was located. Default: php */
  ui_path: 'html' /* Optional. It's the folder where the file nenav-ui.html was located. Default: html */
}
```

You can see the **example file** to use Nenav in the sources.
To finish the configuration, you may need configure the PHP file at variable:

```
$nenav_prefix = '../nav_path';
```

For security reason, Nenav can't allow to use a path with relative links such 
as **.** or **..** in javascript code, because of this is needed set a path with 
this values inside a variable in the PHP file. This path, in the PHP file, must 
not have the / at the end, and in the same way, in the javascript file, it must 
be omitted.

**Note:** A demo can be found in the [projects webpages](http://www.neckersbox.eu/en/nenav)

## Themes

Inside the Nenav package there are four themes, two basic ( _light_ and _dark_ ) 
and two **Bootstrap-like**. This is important to clarify because these two themes 
( _bootstrap-dark_ and _bootstrap-light_ ) not using really bootstrap but use a 
style like that.

![theme light](http://www.neckersbox.eu/share/assets/nenav-light.png)
![theme dark](http://www.neckersbox.eu/share/assets/nenav-dark.png)
![theme bootstrap-light](http://www.neckersbox.eu/share/assets/nenav-bootstrap-light.png)
![theme bootstrap-dark](http://www.neckersbox.eu/share/assets/nenav-bootstrap-dark.png)
