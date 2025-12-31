 class ExpressError extends Error{
    constructor(statusCode, message){
      //   superclass();
      super(message);
     this.statusCode=statusCode;
    }
 }
 module.exports=ExpressError;