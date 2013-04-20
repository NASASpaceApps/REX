var Foo = (function() {
    // constructor
    function Foo(){
        this._bar = "some value";
    };

    // add the methods to the prototype so that all of the 
    // Foo instances can access the private static
    Foo.prototype.getStaticBar = function() {
        return this._bar;
    };
    Foo.prototype.setStaticBar = function(bar) {
        this._bar = bar;
    };

    return Foo;
})();

