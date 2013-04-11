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
;(function($, doc){
    var _ns,
        _defaults = {},
        annotations = {},
        annotate, exportAnnotations, importAnnotations,
        dom, css;

    dom = '<div class="jh-ant"><label>{LABEL}</label><input type="text" name="antt" data-uid={UID} data-loc="{LOC}" value="{VAL}"></div>';
    css = '.jh-ant label,.jh-ant input{display:block;width:200px;margin:5px auto;}.jh-ant label{font-size:16px;}.jh-ant input{border:none;padding:3px;font-size:14px}';

    $(doc).on('change', '.jh-ant input', function(){
        var input = $(this),
            annotation = input.val(),
            uid = input.attr('data-uid'),
            location = input.attr('data-loc').split(',');
        annotations[uid] = {position: {
            latitude: location[0],
            longitude: location[1]
        }, annotation: annotation};
    });

    function normalize(position){
        return position instanceof Array ? {latitude: position[0], longitude: position[1]} : position;
    }

    // function isFunction(fn) {
    //     return typeof fn === 'function';
    // }

    function randomUid(){
        var s4 = function(){
            return Math.floor(Math.random() * 0x10000).toString(16);
        };
        return [s4(), s4(), s4()].join('');
    }

    function injectCss(css){
        var tag;
        if($('.jhere-anntt-css').length > 0){
            return;
        }
        if ('\v'=='v') /* ie only */ {
            document.createStyleSheet().cssText = css;
        } else {
            tag = document.createElement('style');
            tag.type = 'text/css';
            tag.className = 'jhere-anntt-css';
            document.getElementsByTagName('head')[0].appendChild(tag);
            tag[ (typeof document.body.style.WebkitAppearance === 'string') /* webkit only */ ? 'innerText' : 'innerHTML'] = css;
        }
    }

    function isFunction(fn) {
        return typeof fn === 'function';
    }

    //### Add annotations
    annotate = function(position, options){
        var uid = randomUid(), self = this;
        injectCss(css);
        position = normalize(position);
        options = options || {};
        _ns = _ns || nokia.maps;
        options.click = function(){
            showAnnotation.call(self, position, uid);
        };
        self.marker(position, options);
        self.bubble(position, {
            content: $(dom.replace('{LABEL}', 'Note')
                          .replace('{UID}', uid)
                          .replace('{LOC}', position.latitude + ',' + position.longitude)
                          .replace('{VAL}', '')),
            uid: uid
        });
    };

    exportAnnotations = function(callback /*, options*/){
        var returnableAnnotations = [];
        $.each(annotations, function(k, a){
            returnableAnnotations.push(a);
        });
        if(isFunction(callback)) {
            callback.call(this, returnableAnnotations);
        }
    };

    importAnnotations = function(annotations /, *options*/){
        // $.each(annotations, function(i, a){
        //     if(a.annotation && a.position) {
        //         this.annotate(a.annotation, a.)
        //     }
        // });
    };


    function showAnnotation(position, uid){
        var annotation = annotations[uid];
        if(!annotation) {
            return;
        }
        this.bubble(position, {
            content: $(dom.replace('{LABEL}', 'Note')
                          .replace('{UID}', uid)
                          .replace('{LOC}', annotation.position.latitude + ',' + annotation.position.longitude)
                          .replace('{VAL}', annotation.annotation))
        });
    }

    //TODO: remove before release
    window.annotations = annotations;

    $.jHERE.extend('annotate', annotate);
    $.jHERE.extend('exportannotations', exportAnnotations);
}(jQuery, document));