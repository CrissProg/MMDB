class Pdf extends MultimediaElement{
    constructor(file,type = null){
        let element = document.createElement("iframe");
        super(file,type,element);
    }

    save(){
        super.save("Pdf.php");
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
        super.select("Pdf.php",tag,"pdf");
    }
    
}