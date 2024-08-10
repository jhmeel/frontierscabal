import EventEmitter from 'events'

class Emitter extends EventEmitter{
  
    constructor(){
   super()
    }
     static getInstance() {
      if (!Emitter.instance) {
        Emitter.instance = new Emitter();

      }
      return Emitter.instance
    }
  }
  


export {Emitter};