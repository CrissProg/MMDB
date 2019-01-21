class Imagen extends MultimediaElement{
    constructor(file,type = null){
        let tag = document.createElement("img");
        super(file,type,tag);

        this._pixels = null;
        this._histogram = null;
    }

    set pixels(value){
        this._pixels = value;
    }

    get pixels(){
        return this._pixels;
    }

    get histogram() {
        return this._histogram;
    }

    set histogram(value) {
        this._histogram = value;
    }

    loadFileContent(){
        return new Promise((resolve, reject) => {
            this._readFileAsDataURL((result)=>{
                this.DOMElement.src = result;
                this.DOMElement.onload = () => {
                    this.loadPixels();
                    this.getHistogram();
                }
                resolve();
            });
          });
    }

    /**
     * Image Processing
     */
    loadPixels(){
        var c = this.getCanvas();
        var ctx = c.getContext('2d');
        ctx.drawImage(this.DOMElement,0,0,this.DOMElement.naturalWidth, this.DOMElement.naturalHeight);
        this.pixels = ctx.getImageData(0,0,c.width,c.height);
    }

    getCanvas(){
        var c = document.createElement('canvas');
        c.width = this.DOMElement.naturalWidth;
        c.height = this.DOMElement.naturalHeight;
        return c;
    }

    getHistogram(){
        let d = this.pixels.data;
        let histogram = {
            r: {},
            g: {},
            b: {}
        };
        // Recorrer los pixeles para separar el RGB de cada pixel
        for (let i = 0; i < d.length; i+=4) {
            histogram.r[d[i]] = !(d[i] in histogram.r) ? 1 : histogram.r[d[i]] + 1;//R
            histogram.g[d[i+1]] = !(d[i+1] in histogram.g) ? 1 : histogram.g[d[i+1]] + 1;//G
            histogram.b[d[i+2]] = !(d[i+2] in histogram.b) ? 1 : histogram.b[d[i+2]] + 1;//B
        }
        this.histogram = histogram;
    }

    drawHistogram(selector){
        let ha = document.querySelector("#histogramArea");
        let ctx = document.querySelector(selector);
        console.log(ctx);
        
        ha.style.width = ctx.style.width = "55%";
        ha.style.height = ctx.style.height = "50%";

        let darkness = document.querySelector("#LaOscuridad");
        darkness.style.width = "100%";
        darkness.style.height = "100%";

        darkness.onclick = () => {
            ha.style.width = ctx.style.width = darkness.style.width = "0%";
            ha.style.height = ctx.style.height = darkness.style.height = "0%";
            //ha.innerHTML = ""; //este era el error
            let canvas = document.createElement("canvas");
            canvas.id = "histrogram";
            ha.append(canvas);
        }

        /**
         *          Creamos funcion para comparar el histograma con la BD   
         */

    /*compHistogram(){

    }*/
        /**
         * PLOT TWIST / Suprise MF
         */

        let audio = new Audio();
        audio.src = "./assets/darkness.mp3";
        audio.autoplay = true;

        let hLabels = [];
        let datasets = [
            {
                label: 'R',
                data: [],
                borderWidth: 1,
                backgroundColor: 'rgba(255,0,0,1)'
            },
            {
                label: 'G',
                data: [],
                borderWidth: 1,
                backgroundColor: 'rgba(0,255,0,1)'
            },
            {
                label: 'B',
                data: [],
                borderWidth: 1,
                backgroundColor: 'rgba(0,0,255,1)'
            }
        ]
        for (let i = 0; i < 256; i++) {
            hLabels.push(i);
            datasets[0]["data"][i] = !(i in this.histogram.r) ? 0 : this.histogram.r[i];//R
            datasets[1]["data"][i] = !(i in this.histogram.g) ? 0 : this.histogram.g[i];//G
            datasets[2]["data"][i] = !(i in this.histogram.b) ? 0 : this.histogram.b[i];//B
        };
        console.log(this.histogram);
        console.log(datasets);
        var histogramUp = JSON.stringify(this.histogram);
        console.log(histogramUp);
        //instancia del diagrama
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: hLabels,
                datasets: datasets,
            },
            options: {
                responsive: true,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }],
                    xAxes: [{
                        categoryPercentage: 2.0,
                        barPercentage: 2.0
                    }]
                }
            }
        });
    }

    /***
     * CRUD
     */
    save(){
        super.save("Imagen.php");
    }

    static select(){
        var tag = document.createElement("img");
        super.select("Imagen.php",tag,"imagen");
    }

    static delete(){
        var tag = document.createElement("img");
        super.delete("Imagen.php",tag,"imagen");
    }
}