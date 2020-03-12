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

function getWeather(){
    if(Date.parse(new Date()) - localStorage.getItem("saveWtime") > 10*60*1000){
        var loca = localStorage.getItem("location");
        var weatherurl = "";
        if(loca == "auto" || loca == null){
            weatherurl = 'https://free-api.heweather.net/s6/weather/now?location=auto_ip&key=606383f7a03b43939e5bff187c8999ca';

        }else{
            weatherurl = 'https://free-api.heweather.net/s6/weather/now?location=' + loca + '&key=606383f7a03b43939e5bff187c8999ca';
        }
        try{
            $.ajax({url:weatherurl,
                    dataType:"json",
                    type:"GET",
                    success:function(weatherss){
                        if(weatherss.HeWeather6[0].status != "ok"){
                            localStorage.setItem("location","auto");
                            return;
                        }
                        localStorage.setItem("weatvalue",weatherss.HeWeather6[0].now.cond_txt);
                        localStorage.setItem("tempvalue",weatherss.HeWeather6[0].now.tmp);
                        localStorage.setItem("saveWtime",Date.parse(new Date()));
                        
                    }
                }) 
            }catch(err){
                console.log(err);
                localStorage.setItem("location","auto");
            }
    }
}

function getPic(){
    if(Date.parse(new Date()) - localStorage.getItem("savePtime") > 60*60*1000){
        $.ajax({url:'https://bing.ioliu.cn/v1/rand?w=1920&h=1080',
            dataType:"jsonp",
            jsonp:"callback",
            jsonpCallback:"jsonCallback",
            success:function(imagess){
                var reg = /(.*).jpg/;
                getBase64(reg.exec(imagess.data.url)[1].trim()+".jpg", (storurl) => {
                    localStorage.setItem("backimg",storurl);
                    localStorage.setItem("imgcr",imagess.data.copyright);
                    localStorage.setItem("savePtime",Date.parse(new Date()));
                })
            }
        }) 
    }
}


$(document).ready(function() {
    
    if(localStorage.getItem("backimg") == null){
        document.getElementById("xibackground").style.backgroundImage = "url('image/mountain.jpg')";
        localStorage.setItem("savePtime",0);
        localStorage.setItem("saveWtime",0);
        localStorage.setItem("location","auto");
    }
    else{
        document.getElementById("xibackground").style.backgroundImage = "url('" + localStorage.getItem("backimg") + "')";
        document.getElementById("photoli").innerHTML = localStorage.getItem("imgcr");
        document.getElementById("weatvalue").innerHTML = localStorage.getItem("weatvalue");
        document.getElementById("tempvalue").innerHTML = localStorage.getItem("tempvalue") + '&#176';
    }
    if(navigator.onLine){
        jQuery.support.cors = true;
        getWeather();
        getPic();
        if(localStorage.getItem("backimg").length < 1.5*1024*1024){
            localStorage.setItem("savePtime",0);
            getPic();
        }
    }
    document.getElementById("mask").onclick = function(){
        document.getElementById("locacvalue").value = localStorage.getItem("location");
        document.getElementById("locac").style.display = "block";
    }
    document.getElementById("maskbuttom").onclick = function(){
        var locavalue = document.getElementById("locacvalue").value;
        localStorage.setItem("location",locavalue);
        localStorage.setItem("saveWtime",0);
        getWeather();
        document.getElementById("locac").style.display = "none";
        setTimeout(function(){
            document.getElementById("weatvalue").innerHTML = localStorage.getItem("weatvalue");
            document.getElementById("tempvalue").innerHTML = localStorage.getItem("tempvalue") + '&#176';
        }, 4000);
    }
});

