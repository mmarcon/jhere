/*
Copyright (c) 2012 Massimiliano Marcon, http://marcon.me

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
;(function($, document){
    var _ns,
        _defaults = {},
        annotations = {},
        annotate, dom, css;

    dom = '<form class="jhere-anntt"><label>{LABEL}</label><input type="text" name="antt" data-uid={UID}></form>';

    $(doc).on('change', '.jhere-anntt input', function(e){});

    //### Add annotations
    annotate = function(position, options){
        var id = uid();
    };

    function isFunction(fn) {
        return typeof fn === 'function';
    }

    function uid(){
        var s4 = function(){
            return Math.floor(Math.random() * 0x10000).toString(16);
        };
        return [s4(), s4(), s4()].join('');
    }

    function injectCss(css){
        if ('\v'=='v') /* ie only */ {
            document.createStyleSheet().cssText = css;
        } else {
            var tag = document.createElement('style');
            tag.type = 'text/css';
            document.getElementsByTagName('head')[0].appendChild(tag);
            tag[ (typeof document.body.style.WebkitAppearance === 'string') /* webkit only */ ? 'innerText' : 'innerHTML'] = css;
        }
    }
}(jQuery, doc));