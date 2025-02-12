class Controlls{
    constructor(controlType){
        this.right = false;
        this.left = false;
        this.forward = false;
        this.reverse = false;
        switch(controlType){
            case "KEYS":
                this.#addKeyboardListeners();
                break;
            case "DUMMY":
                this.forward = true;
                break;
    }
}
    #addKeyboardListeners(){
        document.onkeydown=(event)=>{
            switch(event.key){
                case 'ArrowUp':
                    this.forward = true;
                    break;
                case 'ArrowDown':
                    this.reverse = true;
                    break;
                case 'ArrowLeft':
                    this.left = true;
                    break;
                case 'ArrowRight':
                    this.right = true;
                    break;
    
            }
        }

        document.onkeyup=(event)=>{
            switch(event.key){
                case 'ArrowUp':
                    this.forward = false;
                    break;
                case 'ArrowDown':
                    this.reverse = false;
                    break;
                case 'ArrowLeft':
                    this.left = false;
                    break;
                case 'ArrowRight':
                    this.right = false;
                    break;
        }
        console.table(this);
    }
}
}