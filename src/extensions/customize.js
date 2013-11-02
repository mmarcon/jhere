/*
Copyright (c) 2013 Massimiliano Marcon, http://marcon.me

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
;(function($){
    var _ns;

    //### Customize particular aspects of the map
    //`$('.selector').jHERE('customize', options)`
    //
    //Supported options are currently the following:
    //
    //<pre><code>{
    //  bubble: {
    //    backgroundColor: '#ffffff',
    //    color: '#111111',
    //    autoClose: false /*Should bubbles be autoclosed when a new one is open?*/
    //  }
    //}</code></pre>
    function customize(options){
        _ns = _ns || nokia.maps;
        var map = this.map;
        $.each(options, function(k, v){
            if(k === 'bubble') {
                var bubbles = map.getComponentById('InfoBubbles') ||
                    map.addComponent(new _ns.map.component.InfoBubbles());
                bubbles.options.set(v);
            } else {
                $.error(k + ' unsupported');
            }
        });
    }

    $.jHERE.extend('customize', customize);
}(jQuery));