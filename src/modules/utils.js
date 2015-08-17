export function extend(target, ...source){
    target = target || {};
    source.forEach(function(s){
        Object.keys(s).forEach(function(k){
            target[k] = s[k];
        });
    });
    return target;
}