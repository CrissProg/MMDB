let dropArea = new DropArea("#dropArea");
let fileCounter = 0;
const URLServidor = "http://localhost/veraneo/MMDBServer/";

function defaultBehavior(el){
    let da = dropArea.DOMElement;
    let centeredTitle = da.querySelector(".centeredTitle");
    centeredTitle.innerHTML = "Current files:";
    centeredTitle.style.borderBottom = "1px dashed gray";
    centeredTitle.style.justifyContent = "flex-start";
    da.classList.add("multimedia");

    fileCounter++;
    da.innerHTML +=`
    <div class="file" id="file${fileCounter}">
        <span class="name">${el.file.name}</span> 
        <div class="info">
            <div>
                <span class="type">${el.type}</span> 
                <span class="size">${el.sizeToMB()}MB</span>
            </div>
        </div>
    </div>
    `;
}

let imageBehavior = (file) => {
    var img = new Imagen(file);
    img.loadFileContent().then(()=>{
        defaultBehavior(img);

        let saveBtn = document.createElement("button");
        saveBtn.innerHTML = "Guardar en la DBMM";
        saveBtn.onclick = () => { img.save(); };

        let histogramBtn = document.createElement("button");
        histogramBtn.innerHTML = "Ver histograma";
        histogramBtn.onclick = () => { img.drawHistogram("#histogram"); };

        dropArea.DOMElement.querySelector(`#file${fileCounter} .info`).prepend(img.DOMElement);
        dropArea.DOMElement.querySelector(`#file${fileCounter} .info`).append(saveBtn);
        dropArea.DOMElement.querySelector(`#file${fileCounter} .info`).append(histogramBtn);    });
};

let audioBehavior = (file) => {
    var audio = new Sonido(file);
    audio.loadFileContent().then(()=>{
        defaultBehavior(audio);

        let saveBtn = document.createElement("button");
        saveBtn.innerHTML = "Guardar en la DBMM";
        saveBtn.onclick = () => { audio.save(); };

        dropArea.DOMElement.querySelector(`#file${fileCounter} .info`).prepend(audio.DOMElement);
        dropArea.DOMElement.querySelector(`#file${fileCounter} .info`).append(saveBtn);
    });
};

let videoBehavior = (file) => {
    var video = new Vid(file);
    video.loadFileContent().then(()=>{
        defaultBehavior(video);

        let saveBtn = document.createElement("button");
        saveBtn.innerHTML = "Guardar en la DBMM";
        saveBtn.onclick = () => { video.save(); };

        dropArea.DOMElement.querySelector(`#file${fileCounter} .info`).prepend(video.DOMElement);
        dropArea.DOMElement.querySelector(`#file${fileCounter} .info`).append(saveBtn);
    });
};

let pdfBehavior = (file) => {
    var pdf = new Pdf(file);   
    pdf.loadFileContent().then(()=>{
        defaultBehavior(pdf);

        let saveBtn = document.createElement("button");
        saveBtn.innerHTML = "Guardar en la DBMM";
        saveBtn.onclick = () => { pdf.save(); };

        dropArea.DOMElement.querySelector(`#file${fileCounter} .info`).prepend(pdf.DOMElement);
        dropArea.DOMElement.querySelector(`#file${fileCounter} .info`).append(saveBtn);
    });
};

let textoBehavior = (file) => {
    var texto = new Texto(file);
    texto.loadFileContent().then(()=>{
        defaultBehavior(texto);

        let saveBtn = document.createElement("button");
        saveBtn.innerHTML = "Guardar en la DBMM";
        saveBtn.onclick = () => { texto.save(); };

        
        dropArea.DOMElement.querySelector(`#file${fileCounter} .info`).prepend(texto.DOMElement);
        dropArea.DOMElement.querySelector(`#file${fileCounter} .info`).append(saveBtn);
    }); 
};

let jsBehavior = (file) => {
    var js = new Js(file);
    js.loadFileContent().then(()=>{
        defaultBehavior(js);

        let saveBtn = document.createElement("button");
        aveBtn.innerHTML = "Guardar en la DBMM";
        saveBtn.onclick = () => { js.save(); };

        
        dropArea.DOMElement.querySelector(`#file${fileCounter} .info`).prepend(texto.DOMElement);
        dropArea.DOMElement.querySelector(`#file${fileCounter} .info`).append(saveBtn);
    });
};

dropArea.subscribe("image", imageBehavior);
dropArea.subscribe("audio", audioBehavior);
dropArea.subscribe("video", videoBehavior);
dropArea.subscribe("pdf", pdfBehavior);
dropArea.subscribe("text", textoBehavior);

/**
    SELECT AREA
*/
function select(sayWhat) {
    switch (sayWhat) {
        case "img":
            Imagen.select();
            break;
        case "audio":
            Sonido.select();
            break;
        case "video":
            Vid.select();
            break;
        case "pdf":
            Pdf.select();
            break;
        case "text":
            Texto.select();
            break;
    }
}


