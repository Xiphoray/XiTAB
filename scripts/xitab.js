function getBase64(url, callback){
    var Img = new Image();
    var dataURL = '';
    Img.setAttribute('crossorigin', 'anonymous');
    Img.src = url;

    Img.onload = () => {
        var canvas = document.createElement("canvas");
        var width = Img.width;
        var height = Img.height;
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(Img,0,0,width,height);
        dataURL = canvas.toDataURL("image/jpeg",1);
        callback ? callback(dataURL) : null;
    }
}


$(document).ready(function() {

    if(localStorage.getItem("backimg") == null){
        document.getElementById("xibackground").style.backgroundImage = "url('image/mountain.jpg')";
    }
    else{

        document.getElementById("xibackground").style.backgroundImage = "url('" + localStorage.getItem("backimg") + "')";
    }

    if(navigator.onLine){
        chrome.downloads.setShelfEnabled(true);
        jQuery.support.cors = true;
        $.ajax({url:'https://bing.ioliu.cn/v1/rand?w=1920&h=1080',
            dataType:"jsonp",
            jsonp:"callback",
            jsonpCallback:"jsonCallback",
            success:function(imagess){
                var reg = /(.*).jpg/;
                console.log(imagess);
                var jj = imagess;
                var obj = jj.data;
                var storurl = "";
                getBase64(reg.exec(obj.url)[1].trim()+".jpg", (storurl) => {
                    localStorage.setItem("backimg",storurl);
                })


            }

        })
        

        
    }
    

});


