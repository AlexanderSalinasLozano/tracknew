<html>
    <head>
        <title>Intalaciones</title>
            <script type="text/javascript" src="js/jquery-3.3.1.min.js"></script>
            <script>
                function realizaProceso(valorCaja1){
                        var parametros = {
                                "valorCaja1" : valorCaja1
                               // "valorCaja2" : valorCaja2
                        };
                        $.ajax({
                                data:  parametros,
                                url:   'ajax_proceso.php',
                                type:  'post',
                                beforeSend: function () {
                                        $("#resultado").html("Procesando, espere por favor...");
                                },
                                success:  function (response) {
                                        $("#resultado").html(response);
                                }
                        });
                }
            </script>
 
    </head>

    <body>
        <center>
            <img src="logo.png" border="0" width="750" height="168">
            <br/><br/><br/><br/>
                 <table style="width:50%">
                    <tr>
                        <td><font size="44">ID</font></td>
                        <td><input style=font-size:40px; type="text" name="caja_texto" id="valor1" value=""/> </td>
                    </tr>
                     <tr></tr>
                   
                <br/>
                </table>
                <br/><br/><br/>
                <input type="button" style='width:150px; height:70px; font-size:40px;' href="javascript:;" onclick="realizaProceso($('#valor1').val());return false;" value="Validar"/>
                <br/>
            
        </center>
        <br/><br/>
        <font size="54">
        Resultado: <span id="resultado"></span>
        </font>            
     </body>
    
</html>
