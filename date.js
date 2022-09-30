
exports.getDate = function (){
    const d = new Date();
    const object = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    };

    return d.toLocaleDateString('en-IN', object);
}

exports.getDay = function (){
    const d = new Date();
    const object = {
        weekday: 'long'
    };
    
    return d.toLocaleDateString('en-IN', object);
}