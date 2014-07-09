/**
 * Created by necros on 12/05/14.
 */
function countdown(){
    var fecha=new Date('2014','09','1','00','00','00');
    var hoy=new Date();
    var dias=0;
    var horas=0;
    var minutos=0;
    var segundos=0;

    if (fecha>hoy){
        var diferencia=(fecha.getTime()-hoy.getTime())/1000;
        dias=Math.floor(diferencia/86400);
        diferencia=diferencia-(86400*dias);
        horas=Math.floor(diferencia/3600);
        diferencia=diferencia-(3600*horas);
        minutos=Math.floor(diferencia/60);
        diferencia=diferencia-(60*minutos);
        segundos=Math.floor(diferencia);

        //document.getElementById(id).innerHTML='Quedan ' + dias + ' D&iacute;as, ' + horas + ' Horas, ' + minutos + ' Minutos, ' + segundos + ' Segundos'
        $("#id_d").html(dias);
        $("#id_h").html(horas);
        $("#id_m").html(minutos);
       if (dias>0 || horas>0 || minutos>0 || segundos>0){
            setTimeout("countdown(\"" + id_d +","+id_h+","+ id_m + "\")",1000)
        }
    }
    else{
      //  document.getElementById('restante').innerHTML='Quedan ' + dias + ' D&iacute;as, ' + horas + ' Horas, ' + minutos + ' Minutos, ' + segundos + ' Segundos'
    }
}