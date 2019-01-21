class MultimediaElement{

    constructor(file, type = null, DOMElement = null){
        this.file = file;
        this.type = type;
        this.DOMElement = DOMElement;
    }

    set file(value){
        this._file = value;
    }

    get file(){
        return this._file;
    }

    set type(value){
        this._type = (value == null) ? this.file.type : value;
    }

    get type(){
        return this._type;
    }

    set DOMElement(value){
        let isHTMLElement = value instanceof HTMLElement;
        if(isHTMLElement){
            this._DOMElement = value;
        }else{
            this._DOMElement = this.checkTypeAndSetElement();
        }
    }

    get DOMElement(){
        return this._DOMElement;
    }
    /**
     * @returns {HTMLElement} element
     */
    checkTypeAndSetElement(){
        var element = null;

        if(this.type == "image/png" || this.type == "image/gif"
        || this.type == "image/jpeg" || this.type == "image/webp"
        || this.type == "image/tiff"){
            element = document.createElement("img");     
        }

        if(this.type == "audio/aac" || this.type == "audio/ogg"
        || this.type == "audio/mp3" || this.type == "audio/webm"
        || this.type == "audio/wav" || this.type == "audio/mp4"
        || this.type == "audio/x-m4a"){
            element = document.createElement("audio");
        }

        if(this.type == "video/mpeg" || this.type == "video/ogg"
        || this.type == "video/avi" || this.type == "video/webm"
        || this.type == "video/mp4" || this.type == "video/wmv"){
            element = document.createElement("video");
        }

        if(this.type == "text/plain" || this.type == "text/html"
        || this.type == "text/javascript" || this.type == "application/x-php"){
            element = document.createElement("text");
        }
        
        if(this.type == "application/pdf"){
            element = document.createElement("pdf");
        }

        percent()

        return element;
    }
//carga el contenido del archivo, renorda el objeto con esa instancia
    loadFileContent(){
        return new Promise((resolve, reject) => {
            this._readFileAsDataURL((result)=>{
                this.DOMElement.src = result;
                resolve();
            });
          });
    }
//calcular el peso del archivo en MB
    sizeToMB(){
        return Math.round( (this.file.size/(1024*1024)) * 100 ) / 100;
    }

    _readFileAsDataURL(callback){
        var freader = new FileReader();
    
        freader.onload = function (e) {
            callback(this.result);
        };

        freader.readAsDataURL(this.file);
    }

    save(resource = ""){
        //organizar los atributos, preparando para que sean parametros
        let data = {
            id: null,
            name: this.file.name,
            type: this.type,
            size: this.sizeToMB(),
            file: this.DOMElement.src
        };
        //declarar un objeto para indicar los parametros de la consulta
        var params = new FormData();
        for (const key in data) {
            params.append(key,data[key]);
        }
        //parametros de la peticion
        var options = { 
            method: 'POST',
            mode: 'cors',
            cache: 'default',
            headers: {
                //cambios de la base de datos que quiero consultar, asterizco
                'Access-Control-Allow-Origin':'*'
            },
            body: params
        };
        //llamar al servicio de la base de datos
        let url = `${URLServidor}${resource}?exec=insert`; console.log(url); 
        //ejecuta el llamado del servicio
        fetch(url,options)
        .then(function(response) {
            //console.log(response.text());
            return response.json();
        })
        .then(function(json) {
            if(json.status){
                alert(`Archivo guardado con éxito`);
            }else{
                alert(json.msg);
            }
        });
    }

    static select(resource,tag,elId,id=null){
        var tagname;

        if(resource == "Imagen.php"){
            tagname = "imgDel";
        }
        if(resource == "Audio.php"){
            tagname = "audDel";
        }
        if(resource == "Video.php"){
            tagname = "vidDel";
        }
        if(resource == "Pdf.php"){
            tagname = "pdfDel";
        }
        if(resource == "Texto.php"){
            tagname = "txtDel";
        }

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

        let url = `${URLServidor}${resource}?exec=select`;
        fetch(url,options)
        .then(function(response) {
            return response.json();
        })
        
        .then(function(json) {
            //pinta los resultados de la consulta
            json.forEach(el => {
                if(document.querySelector(`#selectArea #${elId}${el.id}`) == null){
                    document.querySelector("#selectArea").innerHTML +=`
                        <div class="file" id="${elId}${el.id}">
                            <span class="name">${el.name}</span> 
                            <div class="info">
                                <div>
                                    <span class="type">${el.type}</span> 
                                    <span class="size">${el.size}MB</span>
                                    <button onclick="select('${tagname}')">Borrar</button>
                                </div>
                            </div>
                        </div>
                    `; 
                    tag.src = el.file;
                    document.querySelector(`#selectArea #${elId}${el.id} .info`).prepend(tag);
                    document.querySelector("#selectArea").classList.add("multimedia");
                }
            });
        });
    }

    static delete(resource,tag,elId,id=null){
        
        var BreakException = {};

        var options = { 
            method: 'POST',
            mode: 'cors',
            cache: 'default',
            headers: {
                'Access-Control-Allow-Origin':'*'
            }
        };
        
        if(id != null){
            let data = new FormData();
            data.append("id",id);
            options.body = data;
        }

        let url = `${URLServidor}${resource}?exec=select`;
        fetch(url,options)
        .then(function(response) {
            return response.json();
        })
        .then(function(json) {
            try{
            json.forEach(el => {
                    document.querySelector("#selectArea").innerHTML += `
                    <div class="file" id="">                   
                        <button hidden="true" type="button" onclick=(${MultimediaElement.drop(resource, el.id)})>Eliminar el objeto en la Base de datos</button>
                    </div> `;
                    if(el.id!=null){ throw BreakException} 
            });
            }catch(e){
                if (e!==BreakException) throw e;
            } 
        });
    }
    //drop es llamado para cada ciclo desde el php para borrar los registros de la tabla en cuestion.
    static drop(resource,llave){
        let data = {
            id: llave
        };
        var params = new FormData();
        for (const key in data) {
            params.append(key,data[key]);
        }
        var options = { 
            method: 'POST',
            mode: 'cors',
            cache: 'default',
            headers: {
                'Access-Control-Allow-Origin': ""
            },
            body: params
        };

        let url = `${URLServidor}${resource}?exec=delete` ;

        fetch(url,options)
        .then(function(response) {
            return response.json();
        }) ;
        
    }

    _dataToURLParams(data){
       return Object.keys(data).map(function(k) {
            return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
        }).join('&');
    }

}