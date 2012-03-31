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