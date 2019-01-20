class Texto extends MultimediaElement{
    constructor(file,type = null){
        let element = document.createElement("iframe");
        super(file,type,element);
    }

    save(){
        super.save("Texto.php");
    }

    loadFileContent(){
        return new Promise((resolve, reject) => {
            this._readFileAsDataURL((result)=>{
                this.DOMElement.src = `${result}`;
                resolve();
            });
          });
    }

    static select(){
        let tag = document.createElement("iframe");
        super.select("Texto.php",tag,"text");
    }
    
}