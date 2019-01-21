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

    static select(id = null){
        var options = { 
            method: 'POST',
            mode: 'cors',
            cache: 'default',
            headers: {
                'Access-Control-Allow-Origin':'*'
            }
        };
        //consultar un registro por su id 
        if(id != null){
            let data = new FormData();
            data.append("id",id);
            options.body = data;
        }
        let url = `${URLServidor}Texto.php?exec=select`;
        fetch(url,options)
        .then(function(response) {
            return response.json();
        })
        .then(function(json) {
            //pinta los resultados de la consulta
            json.forEach(el => {
                if(document.querySelector(`#selectArea #text${el.id}`) == null){
                    document.querySelector("#selectArea").innerHTML +=`
                    <div class="file" id="text${el.id}">
                    <span class="name">${el.name}</span>
                            <div class="info">
                                <div>
                                    <span class="type">${el.type}</span> 
                                    <span class="size">${el.size}MB</span>
                                    <button onclick="deleteEl('text')">Borrar</button>
                                </div>
                            </div>
                        </div>
                    `;
                    let tag = document.createElement("iframe");
                    tag.src = el.file;
                    document.querySelector(`#selectArea #text${el.id} .info`).prepend(tag);
                    document.querySelector("#selectArea").classList.add("multimedia");
                   console.log(tag.contentDocument.write("var a = 2"));
                   hljs.highlightAuto(document.querySelector("#PRUEBA").innerHTML);
                }
            });
        });
    }

    static delete(){
        var tag = document.createElement("iframe");
        super.delete("Texto.php",tag,"text");
    }
    
}