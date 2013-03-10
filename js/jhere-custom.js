(function(e,t,n){function w(t,n){this.element=t,this.options=e.extend({},i,n),this._defaults=i,this._plugin=r,this.init()}function E(){var e=this.map||{};return{center:e.center,zoom:e.zoomLevel,bbox:e.getViewBounds&&e.getViewBounds(),type:this.mtype}}function S(e,t){var n=new o.kml.Manager;n.addObserver("state",l(function(e){e.state==="finished"&&t.call(this,e)},this)),n.parseKML(e)}function x(t){var n=t.target,r=this.map.pixelToGeo(t.displayX,t.displayY);if(n!==this.map)return;t.type="map"+t.type,e(this.element).trigger(N(t,r))}function T(e){var t=e.target,n=t[e.type];C(n)&&n.call(this.element,N(e,t.coordinate))}function N(t,n){return e.Event(t.type,{originalEvent:t,geo:{latitude:n.latitude,longitude:n.longitude},target:t.target})}function C(e){return typeof e=="function"}function k(){return!!e().on}var r="jHERE",i,s,o,u,a,f,l=e.proxy,c,h="mouse",p="click",d="drag",v="touch",m="start",g="end",y="move",b=[p,"dbl"+p,h+"up",h+"down",h+y,h+"over",h+"out",h+"enter",h+"leave","longpress",d+m,d,d+g,"resize",v+m,v+g,v+y];i={appId:"69Dgg78qt4obQKxVbRA8",authToken:"Nz7ilIB_v1CRwPXxgPdvuA",zoom:12,center:[52.49,13.37],enable:["behavior","zoombar","scalebar","typeselector"],type:"map",marker:{text:"",textColor:"#333333",fill:"#ff6347",stroke:"#333333",shape:"balloon",icon:undefined},bubble:{content:"",closable:!0,onclose:e.noop},heatmap:{max:20,opacity:.8,coarseness:2}},e[r]=c={},s=w.prototype,c.defaultCredentials=function(e,t){f={appId:e,authenticationToken:t},a.load().is.done(function(){o.util.ApplicationContext.set(f)})},s.init=function(){a.load().is.done(l(this.makemap,this))},s.makemap=function(){var t=this,n=t.options,i=u.component,s=[],a=l(x,t),c={};i.Positioning=o.positioning.component.Positioning,f=f||{appId:n.appId,authenticationToken:n.authToken},o.util.ApplicationContext.set(f),e.data(t.element,r,!0),e.each(i,l(function(n,r){n=n.toLowerCase();if(~e.inArray(n,t.options.enable))return C(r)&&s.push(new r)||e.error("invalid: "+n)},t)),t.map=new u.Display(t.element,{zoomLevel:n.zoom,center:n.center,components:s}),t.type(n.type),t._mc=new u.Container,t.map.objects.add(t._mc),e.each(b,function(e,t){c[t]=[a,!1,null]}),t.map.addListeners(c)},s.center=function(e){this.map.setCenter(e)},s.zoom=function(e){this.map.set("zoomLevel",e)},s.type=function(e){var t=this.map,n={map:t.NORMAL,satellite:t.SATELLITE,smart:t.SMARTMAP,terrain:t.TERRAIN,pt:t.SMART_PT,community:t.NORMAL_COMMUNITY,satcommunity:t.SATELLITE_COMMUNITY,traffic:t.TRAFFIC};e in n?(this.mtype=e,e=n[e]):(this.mtype="map",e=n.map),t.set("baseMapType",e)},s.marker=function(t,n){var r={},s=l(T,this),o=this._mc,a="Marker";e.each(b,function(e,t){r[t]=[s,!1,null]}),n=e.extend({},i.marker,n),n.textPen=n.textPen||{strokeColor:n.textColor},n.pen=n.pen||{strokeColor:n.stroke},n.brush=n.brush||{color:n.fill},n.eventListener=r,n.icon||(a="Standard"+a),o.objects.add(new u[a](t,n))},s.nomarkers=function(){this._mc.objects.clear()},s.bubble=function(t,n){var r,s=this.map;n=e.extend({},i.bubble,n),n.content.jquery&&(n.content.css("white-space","normal"),n.content=e("<div/>").append(n.content.clone()).html()),r=s.getComponentById("InfoBubbles")||s.addComponent(new u.component.InfoBubbles),r.openBubble(n.content,{latitude:t.latitude||t[0],longitude:t.longitude||t[1]},n.onclose,!n.closable)},s.nobubbles=function(){var e;return(e=this.map.getComponentById("InfoBubbles"))&&e.closeAll()},s.kml=function(e,t,n){C(t)&&(n=t,t=!1),S.call(this,e,l(function(e){var r=this.map,i=new o.kml.component.KMLResultSet(e.kmlDocument,r);i.addObserver("state",l(function(e){var i,s;e.state==="finished"&&(t&&(i=e.container.objects.get(0),s=i.getBoundingBox(),s&&r.zoomTo(s)),C(n)&&n.call(this,e))},this)),r.objects.add(i.create())},this))},s.heatmap=function(t,n,r){var s;n=n||"value",n.match(/^density|value$/)||(n="value"),r=r||{},r.type=n,r=e.extend({},i.heatmap,r),s=new o.heatmap.Overlay(r),s.addData(t),this.map.overlays.add(s)},s.originalMap=function(e){e.call(this.element,this.map,o)},s.destroy=function(){this.map.destroy(),e.removeData(this.element),e(this.element).empty()},a={},a.is=!1,a.load=function(){var t,r,i;return a.is&&a.is.state().match(/pending|resolved/)?this:(a.is=e.Deferred(),i=function(){o=nokia.maps,o.Features.load({map:"auto",ui:"auto",search:"auto",routing:"auto",positioning:"auto",behavior:"auto",kml:"auto",heatmap:"auto"},function(){u=o.map,a.is.resolve()})},t=n.getElementsByTagName("head")[0],r=n.createElement("script"),r.src="http://api.maps.nokia.com/2.2.3/jsl.js",r.type="text/javascript",r.charset="utf-8",r.onreadystatechange=function(){r.readyState.match(/loaded|complete/)&&i()},r.onload=i,t.appendChild(r),this)},c._JSLALoader=a,c.extend=function(e,t){typeof e=="string"&&C(t)&&(s[e]=t)},e.fn[r]=function(t){var n=arguments,i="plg_"+r,s;return k()||e.error(r+" requires Zepto or jQuery >= 1.7"),!t&&(s=e.data(this[0],i))?E.call(s):this.each(function(){var o;s=e.data(this,i),s?(typeof t!="string"&&e.error(r+" already initialized, expected method."),o=t,n=Array.prototype.slice.call(n,1),C(s[o])||e.error(r+": "+o+" does not exist"),a.load().is.done(function(){s[o].apply(s,n)})):(s=new w(this,t),e.data(this,i,s))})}})(jQuery,window,document);(function(e){function n(e){return typeof e=="function"}function r(r,i,s,o){var u=e.Deferred();return i=n(i)?i:e.noop,s=n(s)?s:e.noop,t._JSLALoader.load().is.done(function(){function t(e,t){var n=e.location;n=o?e.location.address:e.location.position,t==="OK"?(u.resolve(n),i(n)):(u.reject(),s())}var e=nokia.places.search.manager;o?e.reverseGeoCode({latitude:r.latitude||r[0],longitude:r.longitude||r[1],onComplete:t}):e.geoCode({searchTerm:r,onComplete:t})}),u}var t=e.jHERE;t.geocode=function(e,t,n){return r(e,t,n)},t.reverseGeocode=function(e,t,n){return r(e,t,n,!0)}})(jQuery);(function(e){function i(e){return e instanceof Array?{latitude:e[0],longitude:e[1]}:e}var t,n,r={type:"shortest",transportMode:"car",options:"",trafficMode:"default",width:4,color:"#ff6347",marker:{text:"#",textColor:"#fff"}};n=function(n,s,o){var u,a,f;t=t||nokia.maps,n=i(n),s=i(s),o=e.extend({},r,o),f=function(n,r,i){var s,u,a,f,l,c={},h;i==="finished"?(s=n.getRoutes(),f=s[0],a=new t.map.Polyline(f&&f.shape,{pen:new t.util.Pen({lineWidth:o.width,strokeColor:o.color})}),u=new t.map.Container,u.objects.add(a),e.each(f.waypoints,e.proxy(function(t,n){var r=e.extend({},o.marker);o.marker.text==="#"&&(r.text=t+1),this.marker(n.originalPosition,r)},this)),this.map.objects.add(u),l=f.legs&&f.legs.length&&f.legs[0],c.time=l.travelTime,c.length=l.length,c.maneuvers=e.map(l.maneuvers,function(e){return{street:e.streetName,length:e.length,route:e.routeName}}),typeof o.onroute=="function"&&o.onroute.call(this.element,c),h=e.Event("jhere.route",{route:c,target:this.element}),e(this.element).trigger(h)):i==="failed"&&e.error("Failed to calcolate route")},u=new t.routing.Manager,u.addObserver("state",e.proxy(f,this)),a=new t.routing.WaypointParameterList,a.addCoordinate(n),a.addCoordinate(s),o.transportModes=[o.transportMode],u.calculateRoute(a,[o])},e.jHERE.extend("route",n)})(jQuery);(function(e){function a(e){return e instanceof Array?{latitude:e[0],longitude:e[1]}:e}function f(e){return e?(e.pen=e.pen||{},e.brush=e.brush||{},e.pen.strokeColor=e.pen.strokeColor||e.stroke||"#111",e.stroke="solid",e.pen.lineWidth=e.pen.lineWidth||e.thickness||1,e.brush.color=e.brush.color||e.fill,e):e}function l(e,n){e.objects.add(new t.map.Circle(a(n.center),n.radius||1e3,n.style))}function c(e,n){var r=new t.geo.BoundingBox(a(n.topLeft),a(n.bottomRight),!1);e.objects.add(new t.map.Rectangle(r,n.style))}function h(n,r){r.points=e.map(r.points,function(e){return a(e)}),n.objects.add(new t.map.Polyline(r.points,r.style))}function p(n,r){r.points=e.map(r.points,function(e){return a(e)}),n.objects.add(new t.map.Polygon(r.points,r.style))}var t,n,r,i,s,o,u;n=function(n,r){t=t||nokia.maps,u||(u=new t.map.Container,this.map.objects.add(u)),r.style=f(r.style);switch(n){case"circle":l(u,r);break;case"rectangle":c(u,r);break;case"polyline":h(u,r);break;case"polygon":p(u,r);break;default:e.error(n+" not supported")}},r=function(e){n.call(this,"circle",e)},i=function(e){n.call(this,"rectangle",e)},s=function(e){n.call(this,"polyline",e)},o=function(e){n.call(this,"polygon",e)},e.jHERE.extend("shape",n),e.jHERE.extend("circle",r),e.jHERE.extend("rectangle",i),e.jHERE.extend("polyline",s),e.jHERE.extend("polygon",o)})(jQuery);