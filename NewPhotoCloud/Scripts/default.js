$(document).ready(function () {
    //$(document).ajaxStart(function () {
    //    alert('ajaxStart');
    //}).ajaxStop(function () {
    //    alert('ajaxStop');
    //});
    /*------------------Função fnAjaxListaArquivos*--------------------------------*/
    function fnAjaxListaArquivos(prmJsPasta,prmJsFuncoesSucesso) {
         $.ajax({
            type: 'POST',
            url: 'Home/ListaArquivos/',
            contentType: 'application/x-www-form-urlencoded;',
            data: { 'pasta': prmJsPasta },
            cache: false,
            global: true,
            dataType: 'html',
            beforeSend: function () {
                $('#container_contents').empty().append("<div class='alert alert-info' role='alert'><img src='Content/pho_images/phoimg_carregando/loading_circular.gif' /> <span class='text_carregando'>Carregando...</span></div>");
                $(".open").removeClass("open").find('a').attr('aria-expanded', 'false');
                $('#contextMenu').hide();
            },
            success: function (html) {
                $('#container_contents').empty().html(html);
                $.each(prmJsFuncoesSucesso, function (index, funcao) {
                    funcao();
                });
                fnVerificaItensDesfazerMoverPara();
            },
            error: function (xhr, errorMessage, thrownError) {
                $('#container_contents').empty().append("<div class='alert alert-danger' role='alert'><ul id='erro_post'><li>Ocorreu um erro ao carregar as informações.</li><li>Erro: " + xhr.status + "</li><li>Descrição: " + xhr.statusText + "</li><li>Erro Response Text:" + xhr.responseText + "</li><li>Caso o problema persista, contate o administrador do sistema.</li></ul></div>");
            }
        });
    };
    /*----------------------------------------------------------------------------*/
    /*------------------Função fnInitializeFileTree*--------------------------------*/
    function fnInitializeFileTree() {
        $('#sidebar-content-cloud').fileTree({
            root: '',
            script: '/MenuLateral/MenuFileTreePrincipal/',
            expandSpeed: 1000,
            collapseSpeed: 1000,
            multiFolder: false,
            loadMessage: 'Carragando...'
        },
        function (file) { // function h()
            fnReinitializePrettyPhoto();
            fnMenuContextPastas();
            fnMenuContextArquivos();
        },
        function (file, url) { // function i()
            if (file == url) {
                fnInicioConteudo();
            } else {
                var arrayJsFuncoesContextMenu = [
                    function () { fnMenuContextPastas(); },
                    function () { fnMenuContextPastaPaiAberta(); },
                    function () { fnMenuContextArquivos(); }
                ];
                var arrayJsFuncoes = [
                    function () { fnReinitializeCycle(); },
                    function () { fnReinitializePrettyPhoto(); },
                    function () { fnCriaMenuHorizontal(file); },
                    function () { fnInitializeBreadCrumb(); },
                    function () { fnCriarContextMenu(arrayJsFuncoesContextMenu); }
                ];
                fnAjaxListaArquivos(file, arrayJsFuncoes);
            }
            $('html, body').animate({ scrollTop: 0 }, 'slow');
        });
    }
    /*----------------------------------------------------------------------------*/
    /*------------------Inicia Menus fnInitializeFileTree, fnMenuLixeira----------*/
    fnInitializeFileTree();
    fnMenuLixeira();
    /*----------------------------------------------------------------------------*/
    //------Meu File Tree --------------------------------------------------------
    function showMyTree(c, t) {
        $(c).addClass('wait');
        $(".jqueryFileTree.start").remove();
        // $(c).parent().find('UL').remove(); 
        $(c).find('UL').remove();
        $(c).closest('.collapsed').removeClass('collapsed').addClass('expanded');
        $.post('MenuLateral/MenuFileTreePrincipal/', { dir: t }, function (data) {
            $(c).find('.start').html('');
            $(c).removeClass('wait').append(data);
            $(c).find('UL:hidden').slideDown({ duration: 1000, easing: null });
            bindMyTree(c);
        }).fail(function (data, textStatus, jqXHR) {
            $(c).html('<ul class="jqueryFileTree start"><li class="warning">Erro ao Carregar Arquivos:</li><li class="file">' + t + '</li><li class="file">' + jqXHR + '</li><li class="file">' + statusText + '</li></ul>');
        }).always(function (data, textStatus, jqXHR) {
            fnMenuContextPastas();
            fnMenuContextArquivos();
        });
    }
    function bindMyTree(t) {
        fnReinitializePrettyPhoto();
        $(t).find('LI A').on('click', function () {
            if ($(this).parent().hasClass('directory')) {
                if ($(this).parent().hasClass('collapsed')) {
                    //  if (!false) {
                        $(this).parent().parent().find('UL').slideUp({ duration: 1000, easing: null });
                        $(this).parent().parent().find('LI.directory').removeClass('expanded').addClass('collapsed');
                    //  }
                 //   $(this).parent().find('UL').remove(); // cleanup
                    showMyTree($(this).parent(), escape($(this).attr('url').match(/.*\//)));
                    $(this).parent().removeClass('collapsed').addClass('expanded');
                    var file = $(this).attr('url');
                    var arrayJsFuncoesContextMenu = [
                       function () { fnMenuContextPastas(); },
                       function () { fnMenuContextPastaPaiAberta(); },
                       function () { fnMenuContextArquivos(); }
                    ];
                    var arrayJsFuncoes = [
                        function () { fnReinitializeCycle(); },
                        function () { fnReinitializePrettyPhoto(); },
                        function () { fnCriaMenuHorizontal(file); },
                        function () { fnInitializeBreadCrumb(); },
                        function () { fnCriarContextMenu(arrayJsFuncoesContextMenu); }
                    ];
                    fnAjaxListaArquivos($(this).attr('url'), arrayJsFuncoes);
                } else {
                    $(this).parent().find('UL').slideUp({ duration: 1000, easing: null });
                    $(this).parent().removeClass('expanded').addClass('collapsed');
                    var file = $(this).parent().closest('.jqueryFileTree').parent().find('a').attr('url');
                    var url = $(this).attr('url');
                    if (file == url) {
                        fnInicioConteudo();
                        fnCriaMenuHorizontal(file);
                    } else {
                        var arrayJsFuncoesContextMenu = [
                            function () { fnMenuContextPastas(); },
                            function () { fnMenuContextPastaPaiAberta(); },
                            function () { fnMenuContextArquivos(); }
                        ];
                        var arrayJsFuncoes = [
                            function () { fnReinitializeCycle(); },
                            function () { fnReinitializePrettyPhoto(); },
                            function () { fnCriaMenuHorizontal(file); },
                            function () { fnInitializeBreadCrumb(); },
                            function () { fnCriarContextMenu(arrayJsFuncoesContextMenu); }
                        ];
                        fnAjaxListaArquivos(file, arrayJsFuncoes);
                    }
                }
            }
            return false;
        });
    }
    /*------------------------------------------------------------------------------*/
    /*------------------Função fnShowMenuTreeChoose*------------------------------------*/
    function fnShowMenuTreeChoose(prmObjItemMenu, prmCaminho, prmJsFuncoesSucessoTreeChoose) {
        $.ajax({
            type: 'POST',
            url: 'MenuLateral/MenuFileTreeMoverCopiar/',
            contentType: 'application/x-www-form-urlencoded;',
            data: { 'dir': prmCaminho },
            cache: false,
            global: true,
            dataType: 'html',
            beforeSend: function () {
                $(prmObjItemMenu).addClass('wait');
                $(".jqueryFileTree.start").remove();
                $(prmObjItemMenu).parent().find('UL').remove();
                $(prmObjItemMenu).closest('.collapsed').removeClass('collapsed').addClass('expanded');
            },
            success: function (html) {
                $(prmObjItemMenu).find('.start').html('');
                $(prmObjItemMenu).removeClass('wait').append(html);
                $(prmObjItemMenu).find('UL:hidden').slideDown(1000, function(){
                    if (prmJsFuncoesSucessoTreeChoose != null) {
                        $.each(prmJsFuncoesSucessoTreeChoose, function (index, funcao) {
                            funcao();
                        });
                    }
                });
                fnBindMenuTreeChoose(prmObjItemMenu);
            },
            error: function (xhr, errorMessage, thrownError) {
                $(prmObjItemMenu).html('<ul class="jqueryFileTree start"><li class="error">Erro ao Carregar Arquivos:</li><li class="file">' + prmObjItemMenu + '</li><li class="file">' + jqXHR + '</li><li class="file">' + statusText + '</li></ul>');
            }
        });
    }
    /*------------------Função fnBindMenuTreeChoose*------------------------------------*/
    function fnBindMenuTreeChoose(prmObjItemMenu) {
        $(prmObjItemMenu).find('LI A').on('click', function () {
            var vjsTipoPastaArquivo = "";
            var vjsQtdTipoPasta = 0;
            var vjsQtdTipoArquivo = 0;
            var vjsQtdTotalSelecionada = JsonMoverCopiarPara.listaMoverPastasArquivos.length;
            var vjsQtdTipoPastaConflito = 0;
            var vjsQtdTipoArquivoConflito = 0;
            var vjsQtdotalConflito = 0;
            var vjsWarningDestine = false;
            var vjsWarningDestineOpen = false;
            var vjsPastaClicada = $(this);
            var vjsMensagemAlertaConflito = "";
            var vjsAlternarRetornoPastaPai = "";
            var vjscomplementaMensagemAlertaConflito = "";
            if ($("#filetree_conteiner_camponovapasta").length > 0) {
                $("#filetree_conteiner_camponovapasta").empty().remove();
            }
            if ($(this).parent().hasClass('directory')) {
                vjsHtml = "";
                vjsHtml = vjsHtml + "<div class='row' style='border:1px none #ff0000; margin:1px 5px;>";
                $.each(JsonMoverCopiarPara.listaMoverPastasArquivos, function (i, item) {
                    if (item.tipoArquivoPasta == 'D'){
                        vjsQtdTipoPasta++;
                    }
                    else if (item.tipoArquivoPasta == 'A') {
                        vjsQtdTipoArquivo++;
                    }
      //              alert(JsonMoverCopiarPara.estadoPasta);
                    if(JsonMoverCopiarPara.estadoPasta == 'aberta'){
                        vjsAlternarRetornoPastaPai = JsonMoverCopiarPara.caminhoPastaPai;
                    }
                    else{
                        vjsAlternarRetornoPastaPai = JsonMoverCopiarPara.caminhoRetorno;
                    }
        //            alert(JsonMoverCopiarPara.origemAcessoArquivoPasta);
       //             alert(item.caminhoOriginal);
                    if (JsonMoverCopiarPara.origemAcessoArquivoPasta == '1') {
                        vjsAlternarRetornoPastaPai = item.caminhoOriginal.replace(item.nomePastaArquivo, "");
                        vjsAlternarRetornoPastaPai = vjsAlternarRetornoPastaPai.replace("//", "/");
                    }
        //            alert(vjsAlternarRetornoPastaPai);
                    if (vjsPastaClicada.attr('url') == item.caminhoOriginal || vjsPastaClicada.attr('url') == vjsAlternarRetornoPastaPai) {
                        vjsWarningDestine = true;
                        if (vjsPastaClicada.attr('url') == vjsAlternarRetornoPastaPai) {
                            vjsWarningDestineOpen = true;
                            if (item.tipoArquivoPasta == 'D') {
                                vjsQtdTipoPastaConflito++;
                            }
                            else if (item.tipoArquivoPasta == 'A') {
                                vjsQtdTipoArquivoConflito++;
                            }
                        }
                        else {
                            vjsHtml = vjsHtml + "<div class='item col-md-12 container_folders_lista lista' id='containeritemconflito_" + i + "' data-caminho= '" + vjsPastaClicada.data('caminho') + "' style='border:1px none #ffd800; padding:1px 1px'>";
                            vjsHtml = vjsHtml + "   <div class='folders_lista'>";
                            vjsHtml = vjsHtml + "       <div class='body_lista lista'>";
                            vjsHtml = vjsHtml + "           <div class='body_lista_icon col-md-2'>";
                            vjsHtml = vjsHtml + "               <div class='item col-xs-4 col-md-4 itemcheckbox checkboxFoldersConflit'  data-getidcheckconflito='#" + item.idCheckbox + "' data-indexjson='" + i + "' style='padding-left:0px; margin:0px; height:45px; width:20px; border:1px none #b6ff00; margin-top:-12px;cursor: pointer;'>";
                            vjsHtml = vjsHtml + "                   <div class='checkbox checkbox-info checkbox-circle' style='margin-top:12px; cursor: pointer;'>";
                            vjsHtml = vjsHtml + "                       <input type='checkbox' checked name='checkboxFoldersConflit' id='checkbox_folderlistaconflito_" + i + "' class='circlecheckbox checkbox_folderlista notContext' value='' style='cursor: pointer;'>";
                            vjsHtml = vjsHtml + "                       <label for='checkbox' style='cursor: pointer;'></label>";
                            vjsHtml = vjsHtml + "                   </div>";
                            vjsHtml = vjsHtml + "               </div>";
                            vjsHtml = vjsHtml + "               <div class='item col-xs-8 col-md-8' style='border:1px none #ff0000; position:relative;'>";
                            if (item.tipoArquivoPasta == 'D') {
                                vjsHtml = vjsHtml + "               <i class='fa fa-folder' style='display:block; font-size:30px;  margin-top:-4px; height:30px; border:1px none #ff0000;'></i>";
                                vjsQtdTipoPastaConflito++;
                            }
                            else if (item.tipoArquivoPasta == 'A') {
                                vjsHtml = vjsHtml + "               <i class='fa fa-file-image-o' style='display:block; font-size:30px;  margin-top:-4px; height:30px; border:1px none #ff0000;'></i>";
                                vjsQtdTipoArquivoConflito++;
                            }
                            vjsHtml = vjsHtml + "               </div>";
                            vjsHtml = vjsHtml + "           </div>";
                            vjsHtml = vjsHtml + "           <div class='body_lista_titulo col-md-10'>" + item.nomePastaArquivo + "</div>";
                            vjsHtml = vjsHtml + "       </div>";
                            vjsHtml = vjsHtml + "   </div>";
                            vjsHtml = vjsHtml + "</div>";
                        }
                        vjsQtdotalConflito++;
                    }
                });
                vjsHtml = vjsHtml + "</div>";
                if ($(this).parent().hasClass('collapsed')) {
                    if (!false) {
                        $(this).parent().parent().find('UL').slideUp({ duration: 1000, easing: null });
                        $(this).parent().parent().find('LI.directory').removeClass('expanded').addClass('collapsed');
                    }
                    $(this).parent().find('UL').remove(); 
                    $('LI.directory').removeClass('itemfiletree_selected').removeClass('warning');
                    $(this).parent().addClass('itemfiletree_selected');
                    $('#container_alertmover').hide().removeClass();
                    $('#alertmover_content').empty();
                    $('#lbl_nomepasta_mover').empty().text($(this).text());
                    $('#container_nomepastadestino').show();
                    $('#hidCaminhoDestino').val($(this).attr('url'));
                    $('#btn_moverpastaarquivo').removeClass('disabled');
                    $('#btn_criarPasta_mover').removeClass('disabled');
                    if (vjsWarningDestine) {
                        $("#content_conflitosmover").empty().html(vjsHtml);
                        $(this).parent().addClass('warning');
                        $('#btn_moverpastaarquivo').addClass('disabled');
                        $('#lbl_nomepasta_mover').empty();
                        $('#container_nomepastadestino').hide();
                        $('#container_alertmover').addClass('alert alert-warning').fadeTo(500, 1);
                        if (vjsQtdTipoPastaConflito > 0) {
                            if (vjsQtdTipoPastaConflito == 1) {
                                vjsMensagemAlertaConflito = "A pasta "
                                vjscomplementaMensagemAlertaConflito = "pode";
                            }
                            else {
                                vjsMensagemAlertaConflito = "As " + vjsQtdTipoPastaConflito + " pastas "
                                vjscomplementaMensagemAlertaConflito = "podem";
                            }
                            if (vjsQtdTipoArquivoConflito > 0){
                                if (vjsQtdTipoArquivoConflito == 1) {
                                    vjsMensagemAlertaConflito = vjsMensagemAlertaConflito + "e o arquivo "
                                }
                                else {
                                    vjsMensagemAlertaConflito = vjsMensagemAlertaConflito + "e os " + vjsQtdTipoArquivoConflito + " arquivos "
                                }
                                vjscomplementaMensagemAlertaConflito = "podem";
                            }
                        }
                        else if (vjsQtdTipoArquivoConflito > 0) {
                            if (vjsQtdTipoArquivoConflito == 1) {
                                vjsMensagemAlertaConflito = vjsMensagemAlertaConflito + "O arquivo "
                                vjscomplementaMensagemAlertaConflito = "pode";
                            }
                            else {
                                vjsMensagemAlertaConflito = "Os " + vjsQtdTipoArquivoConflito + " arquivos "
                                vjscomplementaMensagemAlertaConflito = "podem";
                            }
                        }
                        vjsMensagemAlertaConflito = vjsMensagemAlertaConflito + "que você está tentando mover, não " + vjscomplementaMensagemAlertaConflito + " ter como destino a mesma pasta ";
                        if (vjsWarningDestineOpen) {
                            vjsMensagemAlertaConflito = vjsMensagemAlertaConflito + "de origem.";
                            $('#btn_criarPasta_mover').removeClass('disabled');
                            fnShowMenuTreeChoose($(this).parent(), $(this).attr('url'), null);
                        }
                        else {
                            vjsMensagemAlertaConflito = vjsMensagemAlertaConflito + "selecionada.";
                            $('#btn_criarPasta_mover').addClass('disabled');
                            $('#hidCaminhoDestino').val('');
                        }
                        if (vjsQtdTotalSelecionada > 1 && vjsQtdotalConflito < vjsQtdTotalSelecionada) {
                            $('#alertmover_content').empty().html("<div class='col-md-8'>" + vjsMensagemAlertaConflito + "</div><div class='col-md-4'><button type='button' id='btn_listaconflitos_mover' class='btn btn-photocloud'><i class='fa fa-wrench'>&nbsp;&nbsp;</i>Remover conflitos</button></div>");
                        } else {
                            $('#alertmover_content').empty().html(vjsMensagemAlertaConflito);
                        }
                    }
                    else {
                        fnShowMenuTreeChoose($(this).parent(), $(this).attr('url'),null);
                    }
                    $(this).parent().removeClass('collapsed').addClass('expanded');
                } else {
                    var vjsWarningDefinido = $(this).parent().hasClass('warning');
                    $('LI.directory').removeClass('itemfiletree_selected').removeClass('warning');
                    $('#btn_moverpastaarquivo').removeClass('disabled');
                    $('#btn_criarPasta_mover').removeClass('disabled');
                    $('#container_alertmover').hide().removeClass();
                    $('#alertmover_content').empty();
                    $('#lbl_nomepasta_mover').empty().text($(this).text());
                    $('#container_nomepastadestino').show();
                    if ($(this).attr('url') != $('#hidCaminhoDestino').val()) {
                        $('#hidCaminhoDestino').val($(this).attr('url'));
                        $(this).parent().addClass('itemfiletree_selected');
                        if (vjsWarningDestine) {
                            $('#btn_moverpastaarquivo').addClass('disabled');
                            $('#btn_criarPasta_mover').addClass('disabled');
                            $('#lbl_nomepasta_mover').empty();
                            $('#container_nomepastadestino').hide();
                            if (vjsWarningDefinido) {
                                $('#container_alertmover').addClass('alert alert-info').fadeTo(500, 1);
                                $('#alertmover_content').empty().html("Selecione a pasta de destino acima.");
                                $(this).parent().removeClass('expanded').addClass('collapsed');
                                $(this).parent().removeClass('itemfiletree_selected');
                                if (vjsWarningDestineOpen) {
                                    $(this).parent().find('UL').slideUp({ duration: 1000, easing: null });
                                }
                            }
                            else {
                                $("#content_conflitosmover").empty().html(vjsHtml);
                                $(this).parent().addClass('warning');
                                $('#container_alertmover').addClass('alert alert-warning').fadeTo(500, 1);
                                if (vjsQtdTipoPastaConflito > 0) {
                                    if (vjsQtdTipoPastaConflito == 1) {
                                        vjsMensagemAlertaConflito = "A pasta "
                                        vjscomplementaMensagemAlertaConflito = "pode";
                                    }
                                    else {
                                        vjsMensagemAlertaConflito = "As " + vjsQtdTipoPastaConflito + " pastas "
                                        vjscomplementaMensagemAlertaConflito = "podem";
                                    }
                                    if (vjsQtdTipoArquivoConflito > 0) {
                                        if (vjsQtdTipoArquivoConflito == 1) {
                                            vjsMensagemAlertaConflito = vjsMensagemAlertaConflito + "e o arquivo "
                                        }
                                        else {
                                            vjsMensagemAlertaConflito = vjsMensagemAlertaConflito + "e os " + vjsQtdTipoArquivoConflito + " arquivos "
                                        }
                                        vjscomplementaMensagemAlertaConflito = "podem";
                                    }
                                }
                                else if (vjsQtdTipoArquivoConflito > 0) {
                                    if (vjsQtdTipoArquivoConflito == 1) {
                                        vjsMensagemAlertaConflito = vjsMensagemAlertaConflito + "O arquivo "
                                        vjscomplementaMensagemAlertaConflito = "pode";
                                    }
                                    else {
                                        vjsMensagemAlertaConflito = "Os " + vjsQtdTipoArquivoConflito + " arquivos "
                                        vjscomplementaMensagemAlertaConflito = "podem";
                                    }
                                }
                                vjsMensagemAlertaConflito = vjsMensagemAlertaConflito + "que você está tentando mover, não " + vjscomplementaMensagemAlertaConflito + " ter como destino a mesma pasta ";
                                if (vjsWarningDestineOpen) {
                                    vjsMensagemAlertaConflito = vjsMensagemAlertaConflito + "de origem.";
                                    $('#btn_criarPasta_mover').removeClass('disabled');
                                }
                                else {
                                    vjsMensagemAlertaConflito = vjsMensagemAlertaConflito + "selecionada.";
                                    $('#btn_criarPasta_mover').addClass('disabled');
                                    $('#hidCaminhoDestino').val('');
                                }
                                if (vjsQtdTotalSelecionada > 1 && vjsQtdotalConflito < vjsQtdTotalSelecionada) {
                                    $('#alertmover_content').empty().html("<div class='col-md-8'>" + vjsMensagemAlertaConflito + "</div><div class='col-md-4'><button type='button' id='btn_listaconflitos_mover' class='btn btn-photocloud'><i class='fa fa-wrench'>&nbsp;&nbsp;</i>Remover conflitos</button></div>");
                                } else {
                                    $('#alertmover_content').empty().html(vjsMensagemAlertaConflito);
                                }
                            }
                        }
                    }
                    else {
                        $('#btn_moverpastaarquivo').addClass('disabled');
                        $('#btn_criarPasta_mover').addClass('disabled');
                        $(this).parent().find('UL').slideUp({ duration: 1000, easing: null });
                        $(this).parent().removeClass('expanded').addClass('collapsed');
                        $('LI.directory').removeClass('itemfiletree_selected').removeClass('warning');
                        $('#lbl_nomepasta_mover').empty();
                        $('#container_nomepastadestino').hide();
                        $('#container_alertmover').addClass('alert alert-info').fadeTo(500, 1);
                        $('#alertmover_content').empty().html("Selecione a pasta de destino acima.");
                        $('#hidCaminhoDestino').val('');
                    }
                }
            }
            return false;
        });
    }
    /*------------------------------------------------------------------------------*/
    /*------------------ Criar campo cadastrar pasta inFileTree------------------------------------*/
    $("#section_modal").on("click", "#btn_criarPasta_mover", function () {
        var vJsAlturaJanela = 0;
        var vJspositionElement = null;
        var vJspositionElementTop = 0;
        var vJsValorRolagem = 0;
        var vJsCaminhoDestino = $('#hidCaminhoDestino').val();
        if ($("#filetree_conteiner_camponovapasta").length <= 0) {
            var vJsObjSelecionado = $(".itemfiletree_selected");
            $.ajax({
                type: 'POST',
                url: 'CriarElementoHtml/CriarFormularioCriarPastaInFileTree/',
                contentType: 'application/x-www-form-urlencoded;',
                data: { 'caminhoCriarNovaPasta': vJsCaminhoDestino},
                cache: false,
                global: true,
                dataType: 'html',
                beforeSend: function () {
                    $('#form_criarpastainfiletree').remove();
                    $('#btn_moverpastaarquivo').addClass('disabled');
                    $('#btn_criarPasta_mover').addClass('disabled');
                    $('#container_nomepastadestino').hide();
                    $('#container_alertmover').removeClass().addClass('alert alert-info').fadeTo(500, 1);
                    $('#alertmover_content').empty().html("<img src='Content/pho_images/phoimg_carregando/loading_circular.gif' /> <span class='text_carregando'>Carregando...</span>");
                },
                success: function (html) {
                    $(vJsObjSelecionado).removeClass('itemfiletree_selected').removeClass('warning').find("ul.jqueryFileTree:first").prepend(html);
                    $('#filetree_conteiner_camponovapasta').css('background-position', 'left 10px');
                    $('#hidCaminhoDestino').val('');
                    vJsAlturaJanela = $("#content-menutree_mover").scrollTop();
                    vJspositionElement = $("#filetree_conteiner_camponovapasta").position();
                    vJspositionElementTop = vJspositionElement.top;
                    vJsValorRolagem = vJsAlturaJanela + vJspositionElementTop - 20;
                    $("#content-menutree_mover").animate({ scrollTop: vJsValorRolagem }, 300, function () {
                        $("#NomePasta").focus();
                    });
                    $('#btn_criarPasta_mover').removeClass('disabled');
                    $('#container_alertmover').removeClass().addClass('alert alert-info').fadeTo(500, 1);
                    $('#alertmover_content').empty().html("Informe o nome da nova pasta e clique no botão criar.");
                    fnReiniciarControleFormCriarPastaInFileTree();
                },
                error: function (xhr, errorMessage, thrownError) {
                    $('#btn_moverpastaarquivo').removeClass('disabled');
                    $('#btn_criarPasta_mover').removeClass('disabled');
                    $('#container_alertmover').removeClass().addClass('alert alert-danger').fadeTo(500, 1);
                    $('#alertmover_content').empty().html("Erro ao Carregar formulário.");
                }
            });
        }
        else {
            vJsAlturaJanela = $("#content-menutree_mover").scrollTop();
            vJspositionElement = $("#filetree_conteiner_camponovapasta").position();
            vJspositionElementTop = vJspositionElement.top;
            vJsValorRolagem = vJsAlturaJanela + vJspositionElementTop - 20;
            $("#content-menutree_mover").animate({ scrollTop: vJsValorRolagem }, 300, function () {
                $("#NomePasta").focus();
                for (i = 0; i < 2; i++) {
                    $("#btnCriarPastaInFileTree").fadeTo(200, 0.5).fadeTo(200, 1.0);
                }
            });
        }
    });
    /*------------------------------------------------------------------------------*/
    /*------------------ Cancelar Criar Pasta FileTree*------------------------------------*/
    $("#section_modal").on("click", "#btnCancelarCriarPastaInFileTree", function () {
        var vJsPaiObjSelecionado = $(this).closest(".jqueryFileTree").closest(".directory.expanded");
        var vjsCaminhoPaiObjSelecionado = $("#NomePasta").data("caminho");
        var vJsAlturaJanela = 0;
        var vJspositionElement = null;
        var vJspositionElementTop = 0;
        var vJsValorRolagem = 0;
        var vjsQtdTipoPastaConflito = 0;
        var vjsQtdTipoArquivoConflito = 0;
        var vjsQtdotalConflito = 0;
        var vjsQtdTotalSelecionada = JsonMoverCopiarPara.listaMoverPastasArquivos.length;
        var vjsWarningDestine = false;
        var vjsMensagemAlertaConflito = "";
        var vjscomplementaMensagemAlertaConflito = "";
        $.each(JsonMoverCopiarPara.listaMoverPastasArquivos, function (i, item) {
            if (vjsCaminhoPaiObjSelecionado == JsonMoverCopiarPara.caminhoRetorno) {
                if (item.tipoArquivoPasta == 'D') {
                    vjsQtdTipoPastaConflito++;
                }
                else if (item.tipoArquivoPasta == 'A') {
                    vjsQtdTipoArquivoConflito++;
                }
                vjsWarningDestine = true;
            }
            vjsQtdotalConflito++;
        });
        $("#filetree_conteiner_camponovapasta").empty().remove();
        vJsPaiObjSelecionado.addClass('itemfiletree_selected');
        $('#hidCaminhoDestino').val(vjsCaminhoPaiObjSelecionado);
        $('#container_alertmover').hide().removeClass();
        $('#alertmover_content').empty();
        $('#lbl_nomepasta_mover').empty().text(vJsPaiObjSelecionado.find('a:first').text());
        $('#container_nomepastadestino').show();
        $('#btn_moverpastaarquivo').removeClass('disabled');
        $('#btn_criarPasta_mover').removeClass('disabled');
        if (vjsWarningDestine) {
            vJsPaiObjSelecionado.addClass('warning');
            $('#btn_moverpastaarquivo').addClass('disabled');
            $('#lbl_nomepasta_mover').empty();
            $('#container_nomepastadestino').hide();
            $('#container_alertmover').addClass('alert alert-warning').fadeTo(500, 1);
            if (vjsQtdTipoPastaConflito > 0) {
                if (vjsQtdTipoPastaConflito == 1) {
                    vjsMensagemAlertaConflito = "A pasta "
                    vjscomplementaMensagemAlertaConflito = "pode";
                }
                else {
                    vjsMensagemAlertaConflito = "As " + vjsQtdTipoPastaConflito + " pastas "
                    vjscomplementaMensagemAlertaConflito = "podem";
                }
                if (vjsQtdTipoArquivoConflito > 0) {
                    if (vjsQtdTipoArquivoConflito == 1) {
                        vjsMensagemAlertaConflito = vjsMensagemAlertaConflito + "e o arquivo "
                    }
                    else {
                        vjsMensagemAlertaConflito = vjsMensagemAlertaConflito + "e os " + vjsQtdTipoArquivoConflito + " arquivos "
                    }
                    vjscomplementaMensagemAlertaConflito = "podem";
                }
            }
            else if (vjsQtdTipoArquivoConflito > 0) {
                if (vjsQtdTipoArquivoConflito == 1) {
                    vjsMensagemAlertaConflito = vjsMensagemAlertaConflito + "O arquivo "
                    vjscomplementaMensagemAlertaConflito = "pode";
                }
                else {
                    vjsMensagemAlertaConflito = "Os " + vjsQtdTipoArquivoConflito + " arquivos "
                    vjscomplementaMensagemAlertaConflito = "podem";
                }
            }
            vjsMensagemAlertaConflito = vjsMensagemAlertaConflito + "que você está tentando mover, não " + vjscomplementaMensagemAlertaConflito + " ter como destino a mesma pasta ";
            if (vjsQtdTotalSelecionada > 1 && vjsQtdotalConflito < vjsQtdTotalSelecionada) {
                $('#alertmover_content').empty().html("<div class='col-md-8'>" + vjsMensagemAlertaConflito + "</div><div class='col-md-4'><button type='button' id='btn_listaconflitos_mover' class='btn btn-photocloud'><i class='fa fa-wrench'>&nbsp;&nbsp;</i>Remover conflitos</button></div>");
            } else {
                $('#alertmover_content').empty().html(vjsMensagemAlertaConflito);
            }
        }
        vJsAlturaJanela = $("#content-menutree_mover").scrollTop();
        vJspositionElement = vJsPaiObjSelecionado.position();
        vJspositionElementTop = vJspositionElement.top;
        vJsValorRolagem = vJsAlturaJanela + vJspositionElementTop;
        $("#content-menutree_mover").animate({ scrollTop: vJsValorRolagem }, 300);
    });
    /*------------------------------------------------------------------------------*/
    /*------------------ Exibe lista de conflitos Mover Para------------------------------------*/
    $("#section_modal").on("click", "#btn_listaconflitos_mover", function () {
        $("#conteinerconflitos").show();
    }); 
    /*------------------------------------------------------------------------------*/
    /*------------------ Cancela remover conflitos Mover Para------------------------------------*/
    $("#section_modal").on("click", "#btn_cancelar_removerconflitos_mover", function () {
        $("#conteinerconflitos").hide();
    });
    /*------------------------------------------------------------------------------*/
    /*------------------ Remove conflitos Mover Para------------------------------------*/
    $("#section_modal").on("click", ".checkboxFoldersConflit", function () {
         var vjsDesmarcarCheckboxLista = $(this).data("getidcheckconflito").replace("grid", "lista");
         var vjsDesmarcarCheckboxGrid = $(this).data("getidcheckconflito").replace("lista", "grid");
         var vjsIndexJson = $(this).data("indexjson");
         var vjsQtdPastasSelecionadas = $("#hidQtdFolderSelected").val(); 
         var vjsQtdArquivosSelecionados = $("#hidQtdFileSelected").val();
         var vjsNomePasta = "";
         var vjsNomeArquivo = "";
         var vjsDescricaoModal = "";
         $.each(JsonMoverCopiarPara.listaMoverPastasArquivos, function (i, item) {
             if (item.tipoArquivoPasta == 'D'){
                 vjsNomePasta = item.nomePastaArquivo;
             }
             else if (item.tipoArquivoPasta == 'A') {
                 vjsNomeArquivo = item.nomePastaArquivo;
             }
         });
         vjsQtdPastasSelecionadas = --vjsQtdPastasSelecionadas;
         $("#btn_cancelar_removerconflitos_mover").addClass('disabled');
         $($(this).data("getidcheckconflito")).prop('checked', false);
         $(vjsDesmarcarCheckboxGrid).closest('.conteiner_checkbox_grid').hide();
         fnCheckBoxDiretorioArquivo($($(this).data("getidcheckconflito")));
         $(this).find('.circlecheckbox').attr('disabled',true);
         var arrayJsRetornoDescricaoModalMoverPara = fnDescricaoModalMoverPara(vjsQtdPastasSelecionadas, vjsQtdArquivosSelecionados, vjsNomePasta, vjsNomeArquivo);
         vjsDescricaoModal = arrayJsRetornoDescricaoModalMoverPara[1];
         $(".modal-body #modalSubtitle").empty().html("<ul class='nav nav-pills nav-stacked'><li role='presentation' ><a href='#' style='color: #333; font-size:16px;'>" + vjsDescricaoModal + "</a></li></ul>");
         $("#containeritemconflito_" + vjsIndexJson).fadeOut(1000, function () {
             var vjsElementoFileTree = $('.filetreemovercopiar').find('a[data-caminho = "' + $(this).data("caminho") + '"]');
             delete JsonMoverCopiarPara.listaMoverPastasArquivos[vjsIndexJson];
             JsonMoverCopiarPara.listaMoverPastasArquivos.splice(vjsIndexJson, 1);
             $(vjsElementoFileTree).parent().removeClass('warning');
             $('#container_alertmover').hide().removeClass();
             $('#alertmover_content').empty();
             $('#lbl_nomepasta_mover').empty().text($(this).text());
             $('#container_nomepastadestino').show();
             $('#hidCaminhoDestino').val($(vjsElementoFileTree).attr('url'));
             $('#btn_moverpastaarquivo').removeClass('disabled');
             $('#btn_criarPasta_mover').removeClass('disabled');
             fnShowMenuTreeChoose($(vjsElementoFileTree).parent(), $(vjsElementoFileTree).attr('url'), null);
             $(this).remove();
             if ($("#conteinerconflitos").find('.circlecheckbox').length < 1) {
                 $("#conteinerconflitos").hide();
                 $("#btn_cancelar_removerconflitos_mover").removeClass('disabled');
             }
             else {
                 $("#btn_cancelar_removerconflitos_mover").removeClass('disabled');
             }
         });
    });
    /*------------------------------------------------------------------------------*/
    /*------------------Função fnInicioConteudo*------------------------------------*/
    function fnInicioConteudo() {
        var arrayJsFuncoesContextMenu = [
            function () { fnMenuContextPastas(); },
            function () { fnMenuContextPastaPaiAberta(); },
            function () { fnMenuContextArquivos(); }
        ];
        var arrayJsFuncoes = [
            function () { fnCriaMenuHorizontal('/'); },
            function () { fnReinitializeCycle(); },
            function () { fnReinitializePrettyPhoto(); },
            function () { fnCriarContextMenu(arrayJsFuncoesContextMenu); }
        ];
        fnAjaxListaArquivos('/', arrayJsFuncoes);
    };
    /*----------------------------------------------------------------------------*/
    /*------------------Função fnLixeiraConteudo*------------------------------------*/
    function fnLixeiraConteudo()
    {
        $.ajax({
            type: 'POST',
            url: 'Lixeira/ListaLixeira/',
            contentType: 'application/x-www-form-urlencoded;',
            data: { 'pasta': "Lixeira" },
            cache: false,
            global: true,
            dataType: 'html',
            beforeSend: function () {
                $('#container_contents').empty().append("<div class='alert alert-info' role='alert'><img src='Content/pho_images/phoimg_carregando/loading_circular.gif' /> <span class='text_carregando'>Carregando...</span></div>");
            },
            success: function (html) {
                $('#container_contents').empty().html(html);
                fnCriaMenuHorizontal('/Lixeira/', 'L');
            },
            error: function (xhr, errorMessage, thrownError) {
                $('#container_contents').empty().append("<div class='alert alert-danger' role='alert'><ul id='erro_post'><li>Ocorreu um erro ao carregar as informações.</li><li>Erro: " + xhr.status + "</li><li>Descrição: " + xhr.statusText + "</li><li>Erro Response Text:" + xhr.responseText + "</li><li>Caso o problema persista, contate o administrador do sistema.</li></ul></div>");
            }
        });

    };
    /*----------------------------------------------------------------------------*/
    /*------------------Função fnMenuLixeira*------------------------------------*/
    function fnMenuLixeira()
    {
        var vjsQtdItensLixeira = 0;
        $.ajax({
            type: 'POST',
            url: 'MenuLateral/MenuLixeira/',
            contentType: 'application/x-www-form-urlencoded;',
            data: { 'pasta': "Lixeira" },
            cache: false,
            global: true,
            dataType: 'html',
            beforeSend: function () {
                $('#sidebar-content-trash').empty().append("<ul><li><img src='Content/pho_images/phoimg_carregando/loading_circular.gif' /> <span class='text_carregando'>Carregando...</span></li></ul>");
            },
            success: function (html) {
                $('#sidebar-content-trash').empty().html(html);
                vjsQtdItensLixeira = $('#sidebar-content-trash').find("#hidQtdItemLixeira").val();
                if (parseInt(vjsQtdItensLixeira) <= 0) {
                    $("#tabLixeira").addClass("disabled");
                    $("#tabtrash").attr("data-toggle", "");
                    $("#label_avisolixeira").text("0");
                    $("#container_avisolixeira").hide();
                    $("#tabcloud").tab('show');
                }
                else {
                    $("#tabLixeira").removeClass("disabled");
                    $("#tabtrash").attr("data-toggle", "tab");
                    $("#label_avisolixeira").text(vjsQtdItensLixeira);
                    $("#container_avisolixeira").show();
                }
            },
            error: function (xhr, errorMessage, thrownError) {
                $('#sidebar-content-trash').empty().append("<div class='alert alert-danger' role='alert'><ul id='erro_post'><li>Ocorreu um erro ao carregar as informações.</li><li>Erro: " + xhr.status + "</li><li>Descrição: " + xhr.statusText + "</li><li>Erro Response Text:" + xhr.responseText + "</li><li>Caso o problema persista, contate o administrador do sistema.</li></ul></div>");
            }
        });
    }
    /*----------------------------------------------------------------------------*/
    $('[data-tooltip="true"]').tooltip();
    /*----------------------------------------------------------------------------*/
    /*-----------------Função fnInitializeBreadCrumb*-----------------------------*/
    function fnInitializeBreadCrumb() {
        var vjsMargensPaddings = 45;
        var vjsLargConteinerBcrumb = $("#container_breadcrumb").width();
        var vjsLargBtnPastaAtualBcrumb = $("#dropdownPastaAtual").width();
        var vjsLargMenuHorizontal = $("#menuhorizontal").width();
        var vjsLarguraBreadcrumb = $("#breadcrumb_list").width();
        var vjsLarguraMenuListGridView = $("#menuListGridView").width();
        var vjsSomaBtnBreadcrumb = vjsLargBtnPastaAtualBcrumb + vjsLargMenuHorizontal + vjsLarguraBreadcrumb + vjsLarguraMenuListGridView + vjsMargensPaddings;
        if (vjsSomaBtnBreadcrumb < vjsLargConteinerBcrumb) {
            $("#menuhorizontal").find("button").find("span.short").show();
            $("#menuhorizontal").find("button").attr("data-tooltip", "");
            $("#menuListGridView").find("button").find("span.short").show();
            $("#menuListGridView").find("button").attr("data-tooltip", "");
        }
        else 
        {
            $("#menuhorizontal").find("button").find("span.short").hide();
            $("#menuhorizontal").find("button").attr("data-tooltip", "true");
            $("#menuListGridView").find("button").find("span.short").hide();
            $("#menuListGridView").find("button").attr("data-tooltip", "true");
            vjsLargConteinerBcrumb = $("#container_breadcrumb").width();
            vjsLargBtnPastaAtualBcrumb = $("#dropdownPastaAtual").width();
            vjsLargMenuHorizontal = $("#menuhorizontal").width();
            vjsLarguraBreadcrumb = $("#breadcrumb_list").width();
            vjsLarguraMenuListGridView = $("#menuListGridView").width();
            vjsSomaBtnBreadcrumb = vjsLargBtnPastaAtualBcrumb + vjsLargMenuHorizontal + vjsLarguraBreadcrumb + vjsLarguraMenuListGridView + vjsMargensPaddings;
        }
        if (vjsSomaBtnBreadcrumb < vjsLargConteinerBcrumb) {
            $("#breadcrumb_list").find("li.ellipsis").removeClass("ellipsis").attr("data-tooltip", "");
        }
        else
        {
            while (vjsSomaBtnBreadcrumb > vjsLargConteinerBcrumb) {
                $("#breadcrumb_list").find("li[class!='ellipsis']:first").addClass("ellipsis").attr("data-tooltip", "true");
                vjsLargBtnPastaAtualBcrumb = $("#dropdownPastaAtual").width();
                vjsLargMenuHorizontal = $("#menuhorizontal").width();
                vjsLarguraBreadcrumb = $("#breadcrumb_list").width();
                vjsSomaBtnBreadcrumb = vjsLargBtnPastaAtualBcrumb + vjsLargMenuHorizontal + vjsLarguraBreadcrumb + vjsLarguraMenuListGridView + vjsMargensPaddings;
            }
        }
        vjsLargConteinerBcrumb = $("#container_breadcrumb").width();
        vjsLargBtnPastaAtualBcrumb = $("#dropdownPastaAtual").width();
        vjsLargMenuHorizontal = $("#menuhorizontal").width();
        vjsLarguraBreadcrumb = $("#breadcrumb_list").width();
        vjsLarguraMenuListGridView = $("#menuListGridView").width();
        vjsSomaBtnBreadcrumb = vjsLargBtnPastaAtualBcrumb + vjsLargMenuHorizontal + vjsLarguraBreadcrumb + vjsLarguraMenuListGridView + vjsMargensPaddings;
        if (vjsSomaBtnBreadcrumb > vjsLargConteinerBcrumb) {
            fnInitializeBreadCrumb();
        }
        $('[data-tooltip="true"]').tooltip();
        $(".breadcrumb li a").on('click', function () {
            var vjsPastaUrl = $(this).attr('rel');
            $('.jqueryFileTree').find('.directory').find('a').each(function () {
                if ($(this).attr('url') == vjsPastaUrl) {
                    $(this).parent().find('.expanded').find('UL').slideUp({ duration: 1000, easing: null });
                    $(this).parent().find('.expanded').removeClass('expanded').addClass('collapsed');
                    return false;
                }
            });
            var arrayJsFuncoesContextMenu = [
                   function () { fnMenuContextPastas(); },
                   function () { fnMenuContextPastaPaiAberta(); },
                   function () { fnMenuContextArquivos(); }
            ];
            var arrayJsFuncoes = [
                    function () { fnReinitializeCycle(); },
                    function () { fnReinitializePrettyPhoto(); },
                    function () { fnCriaMenuHorizontal(vjsPastaUrl); },
                    function () { fnInitializeBreadCrumb(); },
                    function () { fnCriarContextMenu(arrayJsFuncoesContextMenu); }
            ];
            fnAjaxListaArquivos(vjsPastaUrl, arrayJsFuncoes);
        });
    }
    /*----------------------------------------------------------------------------*/
    /*----------------------------------------------------------------------------*/
    $('#container_contents').on('click', '#lista', function (event) {
        event.preventDefault();
        var vjsHash = $(this).data('hash');
        $(this).addClass("active");
        $('#grid').removeClass("active");
        $('.container_folders_grid, .container_folders_lista, .container_files_grid, .container_files_lista, .body_lista, .container_header_lista').removeClass('grid').addClass('lista');
        $('#dropdowngerselec_excluir').data('view', 'lista');
        $('#dropdowngerselec_limpar').data('view', 'lista');
        $('#dropdowngerselec_movertudopara').data('view', 'lista');
        $('#container_principallista').data('view', 'lista');
        jQuery.cookie(vjsHash, 'lista', { expires: 15 });
    });
    $('#container_contents').on('click', '#grid', function (event) {
        event.preventDefault();
        var vjsHash = $(this).data('hash');
        $(this).addClass("active");
        $('#lista').removeClass("active");
        $('.container_folders_grid, .container_folders_lista, .container_files_grid, .container_files_lista, .body_lista, .container_header_lista').removeClass('lista').addClass('grid');
        $('#dropdowngerselec_excluir').data('view', 'grid');
        $('#dropdowngerselec_limpar').data('view', 'grid');
        $('#dropdowngerselec_movertudopara').data('view', 'grid');
        $('#container_principallista').data('view', 'grid');
        jQuery.cookie(vjsHash, 'grid', { expires: 15 });
        fnReinitializeCycle();
    });
    /*----------------------------------------------------------------------------*/
    /*------------------Função fnReinitializeCycle*-------------------------------*/
    function fnReinitializeCycle() {
        var vjsHash = $('#lista').data('hash');
        if ($.cookie(vjsHash) != 'lista') {
            $('.folders_slide').cycle({
                fx: 'uncover', //scrollUp,
                delay: -2000,
                width: '100%',
                log: false,
                before: function (curr, next, opts) {
                    opts.animOut.opacity = 0;
                    $('.folders_slide').css("width", "100%");
                },
                after: function (opts) {
                    //    alert(opts.width)
                }
            })
        }
    }
    /*----------------------------------------------------------------------------*/
    /*------------------Função fnReinitializePrettyPhoto*-------------------------*/
    function fnReinitializePrettyPhoto() {
        $("a[rel^='prettyPhoto']").prettyPhoto({
            animation_speed: 'fast', /* fast/slow/normal */
            slideshow: 5000, /* false OR interval time in ms */
            autoplay_slideshow: false, /* true/false */
            opacity: 0.80, /* Value between 0 and 1 */
            show_title: true, /* true/false */
            allow_resize: true, /* Resize the photos bigger than viewport. true/false */
            default_width: 500,
            default_height: 344,
            counter_separator_label: '/', /* The separator for the gallery counter 1 "of" 2 */
            theme: 'white_shadow', /*pp_default / light_rounded / dark_rounded / light_square / dark_square / facebook / white_shadow*/
            horizontal_padding: 20, /* The padding on each side of the picture */
            hideflash: false, /* Hides all the flash object on a page, set to TRUE if flash appears over prettyPhoto */
            wmode: 'opaque', /* Set the flash wmode attribute */
            autoplay: true, /* Automatically start videos: True/False */
            modal: false, /* If set to true, only the close button will close the window */
            deeplinking: false, /* Allow prettyPhoto to update the url to enable deeplinking. */
            overlay_gallery: true, /* If set to true, a gallery will overlay the fullscreen image on mouse over */
            keyboard_shortcuts: true, /* Set to false if you open forms inside prettyPhoto */
            changepicturecallback: function () { }, /* Called everytime an item is shown/changed */
            callback: function () { }, /* Called when prettyPhoto is closed */
            ie6_fallback: true,
            social_tools: false/* html or false to disable */
        });
    }
    /*------------------Função fnReinitializeUploadiFy*------------------------------*/
    function fnReinitializeUploadiFy() {
        var vjsReabilita_dropPastaAtual = false;
        $('#file_upload').uploadify({
            debug: false,
            'fileObjName': 'file_upload',
            'method': 'POST',
            'swf': '/Content/uploadify.swf',
            'uploader': '/GerenciarArquivo/UploadArquivos',
            'cancelImg': '/Content/pho_images/phoimg_botoes/uploadify-cancel.png',
            'buttonText': "<i class='fa fa-file-image-o change' data-icon='fa fa-cloud'>&nbsp;&nbsp;</i>Selecione os arquivos",
            'buttonClass': 'btn btn-default btn-block btn-carregar',
            'fileDesc': 'Arquivos de Imagem',
            'width': 345,
            'height': 40,
            'lineHeight':30,
            'fileExt': '*.jpg;*.gif;*.png',
            'sizeLimit': '209715200', //200 Mb
            'removeCompleted': false,
            'formData': { 'hidcaminho': $("#hidcaminho").val() },
            'scriptData': { 'hidcaminho': $("#hidcaminho").val() },
            'onUploadSuccess': function (file, data, response) {
                $('#' + file.id).find('.data').html(' - Completo.');
                $('#' + file.id).find('.cancel').remove();
                setTimeout(function () {
                    $('#' + file.id).fadeOut(500, function () {
                        $(this).remove();
                    });
                }, 3 * 1000);
            },
            'onSelect': function (file) {
                $('.uploadify-button-text').html('Aguarde...')
                $('#file_upload').uploadify('disable', true);
                $(".aguarde_overlay").show().fadeTo('fast', 0.50);
                $("#linkHome").attr({ 'href': '#', 'title': 'Aguarde.' });
                $('#userLink').addClass('btn disabled');
                $('#settingsLink').addClass('btn disabled');
                $('#breadcrumb_list').hide();
                $("#content_loading_cloud").show();
                if (!$('#dropdownPastaAtual').hasClass('disabled')) {
                    $('#dropdownPastaAtual').addClass('disabled');
                    vjsReabilita_dropPastaAtual = true;
                }
                $(window).on('beforeunload', function (e) {
                    return 'Os arquivos estão sendo carregados.';
                });
            },
            'onCancel': function () {
                alert('O Arquivo ' + file.name + ' foi cancelado!');
            },
            'onSelectError': function (file, errorCode, errorMsg) {
                alert('O Arquivo ' + file.name + ' returnou um erro: ' + errorMsg);
            },
            'onUploadError': function (file, errorCode, errorMsg, errorString) {
                var MyErrorString = "";
                $('#' + file.id).find('.cancel').remove();
                switch (errorMsg) {
                    case '500':
                        MyErrorString = "Erro interno de servidor.";
                        break;
                    case '798':
                        MyErrorString = "Falha ao carregar arquivo: <strong>" + file.name + "</strong> Caminho muito extenso.";
                        break;
                    case '799':
                        MyErrorString = "Falha ao carregar arquivo: <strong>" + file.name + "</strong> Caminho muito extenso.";
                        break;
                    case '800':
                        MyErrorString = "Falha ao registrar a arquivo: <strong>" + file.name + "</strong>.";
                        break;
                    case '801':
                        MyErrorString = "O arquivo \"" + file.name + "\" já existe na pasta selecionada.";
                        break;
                    case '802':
                        MyErrorString = "O Conteudo do Arquivo \"" + file.name + "\" está vazio.";
                        break;
                    case '803':
                        MyErrorString = "O arquivo \"" + file.name + "\" é nullo.";
                        break;
                    case '804':
                        MyErrorString = "Tipo de arquivo não permitido.";
                        break;
                    case '805':
                        MyErrorString = "Tamanho do arquivo não permitido.";
                        break;
                    default:
                        MyErrorString = errorMsg + " Erro não identificado.";
                        break;
                }
                $('#' + file.id).find('.data').html(' - ' + MyErrorString);
            },
            'onDialogOpen': function () {
                $("#sidebar-content").append("<div class='aguarde_overlay'><span></span></div>");
                $(".aguarde_overlay").height($("#sidebar-content").height() + 10).css({ opacity: 0.5 });
                $("#menuhorizontal").append("<div id='content_loading_cloud'><span class='fa-stack'><span class='fa fa-cloud fa-stack-2x' style='color:#333;'></span><span class='fa fa-refresh fa-spin fa-stack-1x' style='color:#fff;'></span></span></div>");
                $('.dropdown').removeClass('open');
                $('.uploadify-queue-item').each(function () {
                    $(this).fadeOut(500, function () {
                        $(this).remove();
                    });
                });
            },
            'onDialogClose': function (queueData) {
                //  alert(queueData.filesQueued + ' files were queued of ' + queueData.filesSelected + ' selected files. There are ' + queueData.queueLength + ' total files in the queue.');
            },
            'onQueueComplete': function (queueData) {
                var vjsPastaUrl = $("#hidcaminho").val();
                var vjsQtdBusca = 0;
                if (queueData.uploadsSuccessful > 0) {
                    $('.jqueryFileTree').find('.expanded').find('a').each(function () {
                        if ($(this).attr('url') == vjsPastaUrl) {
                            showMyTree($(this).parent(), vjsPastaUrl);
                            vjsQtdBusca = 1;
                            return false;
                        }
                    });
                    if (queueData.uploadsErrored <= 0) {
                        if (vjsQtdBusca <= 0) {
                            fnInitializeFileTree();
                            fnInicioConteudo();
                        }
                        else {
                           var arrayJsFuncoesContextMenu = [
                           function () { fnMenuContextPastas(); },
                           function () { fnMenuContextPastaPaiAberta(); },
                           function () { fnMenuContextArquivos(); }
                            ];
                            var arrayJsFuncoes = [
                               function () { fnReinitializeCycle(); },
                               function () { fnReinitializePrettyPhoto(); },
                               function () { fnCriaMenuHorizontal(vjsPastaUrl); },
                               function () { fnInitializeBreadCrumb(); },
                               function () { fnCriarContextMenu(arrayJsFuncoesContextMenu); }
                            ];
                            fnAjaxListaArquivos(vjsPastaUrl, arrayJsFuncoes); 
                        }
                    } //queueData.uploadsErrored > 0
                }
                $('#file_upload').uploadify('disable', false);
                $('.uploadify-button-text').html('Selecione os Arquivos');
                $(".aguarde_overlay").remove();
                $("#linkHome").attr({ 'href': 'Home', 'title': 'Início.' });
                $('#userLink').removeClass('btn disabled');
                $('#settingsLink').removeClass('btn disabled');
                $("#menuhorizontal").empty();
                $('#breadcrumb_list').show();
                if (vjsReabilita_dropPastaAtual) {
                    $('#dropdownPastaAtual').removeClass('disabled');
                }
                $(window).unbind('beforeunload');
                fnReinitializeUploadiFy();
            },
            'onError': function (a, b, c, d) {
                $('#file_upload').uploadify('disable', false);
                $('.uploadify-button-text').html('Selecione os Arquivos');
                $(".aguarde_overlay").remove();
                $("#linkHome").attr({ 'href': 'Home', 'title': 'Início.' });
                $('#userLink').removeClass('btn disabled');
                $('#settingsLink').removeClass('btn disabled');
                $("#menuhorizontal").empty();
                $('#breadcrumb_list').show();
                if (vjsReabilita_dropPastaAtual) {
                    $('#dropdownPastaAtual').removeClass('disabled');
                }
                $(window).unbind('beforeunload');
                fnReinitializeUploadiFy();
                if (d.status == 404)
                    alert("Could not find upload script. Use a path relative to: " + "<?= getcwd() ?>");
                else if (d.type === "HTTP")
                    alert("error " + d.type + ": " + d.status);
                else if (d.type === "File Size")
                    alert(c.name + " " + d.type + " Limit: " + Math.round(d.info / (1024 * 1024)) + "MB");
                else
                    alert("error " + d.type + ": " + d.text);
            },
            auto: true
        })
    }
    /*----------------------------------------------------------------------------*/
    /*------------------Função fnCriaMenuHorizontal*------------------------------*/
    function fnCriaMenuHorizontal(vprmCaminhoPasta,vprmTipo) {
        var stringFin = vprmCaminhoPasta.lastIndexOf('/');
        var subString = vprmCaminhoPasta.substring(0, stringFin)
        var stringIni = subString.lastIndexOf('/')+1;
        var nomePasta = vprmCaminhoPasta.substring(stringIni, stringFin)
        var vjsHtml = "";
        switch (vprmTipo) {
            case 'L':
                vjsHtml = vjsHtml + "<li>";
                vjsHtml = vjsHtml + "   <button class='btn btn-default disabled' type='button' id='restauraritenslixeira' href='#' rel='" + vprmCaminhoPasta + "' title='Restaurar todos os itens'>";
                vjsHtml = vjsHtml + "       <i class='fa fa-trash-o' style='font-size:15px;'></i>";
                vjsHtml = vjsHtml + "       <span>Restaurar todos os itens</span>";
                vjsHtml = vjsHtml + "   </button>";
                vjsHtml = vjsHtml + "</li>";
                break;
            default:
                if (nomePasta == '') {
                    nomePasta = "[photoCloud:]";
                }
                vjsHtml = vjsHtml + "<li>";
                vjsHtml = vjsHtml + "<button class='btn btn-default' type='button' id='criarpasta' rel='" + vprmCaminhoPasta + "' data-tooltip='' data-placement='top' title='Criar Pasta' data-toggle='modal' data-target='#modalBootstrap' data-whatever='" + nomePasta + "'>";
                vjsHtml = vjsHtml + "   <i class='fa fa-folder-open-o' style='font-size:15px;'></i>";
                vjsHtml = vjsHtml + "   <span class='short' style='display:visible'>Criar Pasta</span>";
                vjsHtml = vjsHtml + "</button>";
                vjsHtml = vjsHtml + "</li>";
                vjsHtml = vjsHtml + "<li>";
                vjsHtml = vjsHtml + "<button class='btn btn-default' type='button' id='carregararquivos' rel='" + vprmCaminhoPasta + "' data-tooltip='' data-placement='top' title='Carregar Arquivos'>";
                vjsHtml = vjsHtml + "   <i class='fa fa-upload' style='font-size:15px;'></i>";
                vjsHtml = vjsHtml + "   <span class='short' style='display:visible'>Carregar Arquivos</span>";
                vjsHtml = vjsHtml + "</button>";
                vjsHtml = vjsHtml + "</li>";
                vjsHtml = vjsHtml + " <li><input type='hidden' name='hidQtdFolderSelected' id='hidQtdFolderSelected' value='0' /></li>";
                vjsHtml = vjsHtml + " <li><input type='hidden' name='hidQtdFileSelected' id='hidQtdFileSelected' value='0' /></li>";
        }//switch 
        $("#menuhorizontal").empty().append(vjsHtml);
    }
    /*----------------------------------------------------------------------------*/
    /*------------------Inicia fnCriaMenuHorizontal--------------------------------*/
    fnCriaMenuHorizontal('/');
    /*----------------------------------------------------------------------------*/
    $('#container_contents').on('click', ".files a, .files_lista a", function (e) {
        if (!$(e.target).hasClass('circlecheckbox') && !$(this).hasClass('checkbox_checked')) {
            if (vjsTeclaControl) {
                e.preventDefault();
                e.stopImmediatePropagation();
                $("#contextMenu").hide();
                $(".open").removeClass("open").find('a').attr('aria-expanded', 'false');
                var vjsCheckbox = $(this).find('.circlecheckbox')
                if (vjsCheckbox[0].checked) {
                    vjsCheckbox[0].checked = false;
                }
                else {
                    vjsCheckbox[0].checked = true;
                }
                fnCheckBoxDiretorioArquivo(vjsCheckbox);
            }
            else
            {
                e.preventDefault;
                var vJsPositionGallery = $(this).data('positiongallery');
                var api_images = new Array();
                api_images = $("#hidgalleryPrettyPhotoList").val().split(",");
                $.prettyPhoto.open(api_images);
                $.prettyPhoto.changePage(vJsPositionGallery);
                return false;
            }
        }
    });
    /*----------------------------------------------------------------------------*/
    /*----------------------------circlecheckbox---------------------------------*/
    $('#container_contents').on({
        mouseenter: function () {
            //   alert('mouseenter');
        },
        mouseleave: function () {
            //   alert('mouseleave');
        },
        click: function () {
            var vjsCaminho = $(this).val();
            var vjsTipo = $(this).data('tipo');
            var vjsChecked = $(this)[0].checked;
            fnCheckBoxDiretorioArquivo($(this));
        }
    }, ".circlecheckbox");
    /*----------------------------------------------------------------------------*/
    $('#container_contents').on({
        mouseenter: function () {
            var vjsContainerCheckbox = $(this).find('.conteiner_checkbox_grid');
            var vjsCheckbox = vjsContainerCheckbox.find('.circlecheckbox');
            vjsContainerCheckbox.show();
        },
        mouseleave: function () {
            var vjsContainerCheckbox = $(this).find('.conteiner_checkbox_grid');
            var vjsCheckbox = vjsContainerCheckbox.find('.circlecheckbox');
            if (!vjsCheckbox[0].checked) {
                vjsContainerCheckbox.hide();
            }
        }
    }, ".folders, .files");
    /*----------------------------------------------------------------------------*/
    /*------------------Função fnCheckBoxDiretorioArquivo*------------------------------*/
    function fnCheckBoxDiretorioArquivo(vprmCheckBox) {
        var vjsQtdFolderSelected = parseInt($("#hidQtdFolderSelected").val());
        var vjsQtdFileSelected = parseInt($("#hidQtdFileSelected").val());
        var vjsQtdSomaQtds = 0;
        var vjsView = vprmCheckBox.data('view');
        if (vprmCheckBox[0].checked) {
            (vprmCheckBox.data('tipo') == 'D') ? vjsQtdFolderSelected++ : vjsQtdFileSelected++;
            $("#hidQtdFolderSelected").val(vjsQtdFolderSelected);
            $("#hidQtdFileSelected").val(vjsQtdFileSelected);
            if (vjsView == "lista") {
                $(vprmCheckBox.data('setviewchange')).closest('.conteiner_checkbox_grid').show();
            }
        }
        else {
            (vprmCheckBox.data('tipo') == 'D') ? vjsQtdFolderSelected-- : vjsQtdFileSelected--;
            $("#hidQtdFolderSelected").val(vjsQtdFolderSelected);
            $("#hidQtdFileSelected").val(vjsQtdFileSelected);
            if (vjsView == "lista") {
                $("#checkboxAll")[0].checked = false;
                $(vprmCheckBox.data('setviewchange')).closest('.conteiner_checkbox_grid').hide();
            }
        }
        vjsQtdSomaQtds = parseInt(vjsQtdFolderSelected) + parseInt(vjsQtdFileSelected);
        $(vprmCheckBox.data('setviewchange'))[0].checked = vprmCheckBox[0].checked;
        if ($("#checkboxAll").data('qtdcheckitem') == vjsQtdSomaQtds)
        {
            $("#checkboxAll")[0].checked = true;
        }
        else {
            $("#checkboxAll")[0].checked = false;
        }
        fnComplementaMenuHorizontal(vprmCheckBox, vjsQtdFolderSelected, vjsQtdFileSelected);
        fnMenuContextPastaPaiAberta();
    }
    /*----------------------------------------------------------------------------*/
    /*------------------Função fnCheckBoxSelectTodosDiretoriosArquivos*------------------------------*/
    function fnSelectTodosDiretoriosArquivos(prmjsCheckBoxAll, prmJsAcao, prmjsView) {
        var vjsQtdFolderSelected = 0; 
        var vjsQtdFileSelected = 0; 
        var vjsQtdSomaQtds = 0;
        var vjsCheckBoxFolder = "";
        var vjsCheckBoxFile = "";
        if (prmJsAcao == "marcar") {
            $('.checkbox_folder' + prmjsView).each(function () {
                vjsCheckBoxFolder = $(this);
                vjsCheckBoxFolder[0].checked = true;
                $(vjsCheckBoxFolder.data('setviewchange'))[0].checked = true;
                if (prmjsView == "lista") { $(vjsCheckBoxFolder.data('setviewchange')).closest('.conteiner_checkbox_grid').show(); }
                else { $(vjsCheckBoxFolder).closest('.conteiner_checkbox_grid').show(); }
                vjsQtdFolderSelected++
            });
            $('.checkbox_file' + prmjsView).each(function () {
                vjsCheckBoxFile = $(this);
                vjsCheckBoxFile[0].checked = true;
                $(vjsCheckBoxFile.data('setviewchange'))[0].checked = true;
                if (prmjsView == "lista") { $(vjsCheckBoxFile.data('setviewchange')).closest('.conteiner_checkbox_grid').show(); }
                else { $(this).closest('.conteiner_checkbox_grid').show(); }
                vjsQtdFileSelected++;
            });
        }
        else if (prmJsAcao = "desmarcar") {
            vjsQtdFolderSelected = 0;
            vjsQtdFileSelected = 0;
            $('.checkbox_folder' + prmjsView).each(function () {
                vjsCheckBoxFolder = $(this);
                vjsCheckBoxFolder[0].checked = false;
                $(vjsCheckBoxFolder.data('setviewchange'))[0].checked = false;
                if (prmjsView == "lista") { $(vjsCheckBoxFolder.data('setviewchange')).closest('.conteiner_checkbox_grid').hide();  }
                else { $(vjsCheckBoxFolder).closest('.conteiner_checkbox_grid').show(); }
            });
            $('.checkbox_file' + prmjsView).each(function () {
                vjsCheckBoxFile = $(this);
                vjsCheckBoxFile[0].checked = false;
                $(vjsCheckBoxFile.data('setviewchange'))[0].checked = false;
                if (prmjsView == "lista") { $(vjsCheckBoxFile.data('setviewchange')).closest('.conteiner_checkbox_grid').hide();  }
                else { $(this).closest('.conteiner_checkbox_grid').hide(); }
            });
        }
        $("#hidQtdFolderSelected").val(vjsQtdFolderSelected);
        $("#hidQtdFileSelected").val(vjsQtdFileSelected);
        fnComplementaMenuHorizontal(prmjsCheckBoxAll, vjsQtdFolderSelected, vjsQtdFileSelected);
        fnMenuContextPastaPaiAberta();
    }
    /*----------------------------------------------------------------------------*/
    /*----------------------------------------------------------------------------*/
    $("#container_contents").on("click", '#checkboxAll', function () {
        var vjsCheckBoxAll = $(this);
        var vjsView = vjsCheckBoxAll.data('view');
        if (vjsCheckBoxAll[0].checked) {
            fnSelectTodosDiretoriosArquivos(vjsCheckBoxAll, "marcar", vjsView);
        }
        else {
            fnSelectTodosDiretoriosArquivos(vjsCheckBoxAll, "desmarcar", vjsView);
        }
    });
    /*----------------------------------------------------------------------------*/
    /*----------------------------------------------------------------------------*/
    $("#container_contents, #contextMenu_dropdown").on("click", '#dropdowngerselec_selecionartudo, #menuContextPastaPai_selecionartudo', function () {
        var vjsCheckBoxAll = $("#checkboxAll");
        var vjsView = $(this).data('view');
        vjsCheckBoxAll[0].checked = true;
        fnSelectTodosDiretoriosArquivos(vjsCheckBoxAll, "marcar", vjsView);
    });
    /*----------------------------------------------------------------------------*/
    /*------------------Função fnComplementaMenuHorizontal*------------------------------*/
    function fnComplementaMenuHorizontal(vprmCheckBox, vprmQtdFolderSelected, vprmQtdFileSelected) {
        var vjsQtdFolderSelected = parseInt(vprmQtdFolderSelected);
        var vjsQtdFileSelected = parseInt(vprmQtdFileSelected);
        var vjsQtdSomaQtds = 0;
        var vjsView = vprmCheckBox.data('view');
        var vjsNomePasta = "";
        var vjsNomeArquivo = "";
        var vjsCaminhoArquivo = "";
        var vjsCaminhoCompletoArquivo = "";
        var vjsTituloLabel = "";
        var vjsBtnJaInserido = "N";
        var vjsHtml = "";
        vjsQtdSomaQtds = parseInt(vjsQtdFolderSelected) + parseInt(vjsQtdFileSelected);
        if (vjsQtdFolderSelected > 0) {
            if (vjsQtdFolderSelected == 1) {
                vjsTituloLabel = vjsQtdFolderSelected + " Pasta";
            }
            else {
                vjsTituloLabel = vjsQtdFolderSelected + " Pastas";
            }
        }
        if (vjsQtdFolderSelected > 0 && vjsQtdFileSelected > 0) {
            vjsTituloLabel = vjsTituloLabel + " e ";
        }
        if (vjsQtdFileSelected > 0) {
            if (vjsQtdFileSelected == 1) {
                vjsTituloLabel = vjsTituloLabel + vjsQtdFileSelected + " Arquivo";
            }
            else {
                vjsTituloLabel = vjsTituloLabel + vjsQtdFileSelected + " Arquivos";
            }
        }
        if (vjsQtdSomaQtds > 1) {
            if (vjsQtdFileSelected <= 0) {
                vjsTituloLabel = vjsTituloLabel + " selecionadas.";
            }
            else {
                vjsTituloLabel = vjsTituloLabel + " selecionados.";
            }
        }
        else {
            if (vjsQtdFileSelected <= 0) {
                vjsTituloLabel = vjsTituloLabel + " selecionada.";
            }
            else {
                vjsTituloLabel = vjsTituloLabel + " selecionado.";
            }
        }
        if ($("#OpcaoGerenciarSelecao").length) {
            vjsBtnJaInserido = "S";
        }
        if (vjsQtdSomaQtds == 1) {
            if (vprmCheckBox[0].checked) {
                vjsCaminhoArquivo = vprmCheckBox.val();
                vjsNomePasta = vprmCheckBox.data('nome');
                vjsNomeArquivo = vprmCheckBox.data('nome');
                vjsCaminhoCompletoArquivo = vprmCheckBox.data('caminho');
            }
            else {
                vjsCaminhoArquivo = $(".checkbox_folder" + vjsView + ":checked").val();
                if (vjsCaminhoArquivo == "undefined" || vjsCaminhoArquivo == null || vjsCaminhoArquivo == ""){
                    vjsCaminhoArquivo = $(".checkbox_file" + vjsView + ":checked").val();
                }
                vjsCaminhoCompletoArquivo = $(".checkbox_file" + vjsView + ":checked").data('caminho');
                vjsNomePasta = $(".checkbox_folder" + vjsView + ":checked").data('nome');
                vjsNomeArquivo = $(".checkbox_file" + vjsView + ":checked").data('nome');
            }
        }
        if (vjsQtdSomaQtds > 0) {
            $(".folders a").addClass('checkbox_checked');
            $(".folders_lista a").addClass('checkbox_checked');
            $(".files a").addClass('checkbox_checked');
            $(".files_lista a").addClass('checkbox_checked');
            $("#OpcaoGerenciarSelecao").remove();
            vjsHtml = vjsHtml + "<li id='OpcaoGerenciarSelecao'>";
            vjsHtml = vjsHtml + "   <div class='dropdown' style='float:left;'>";
            vjsHtml = vjsHtml + "       <button class='btn btn-info dropdown-toggle' type='button' id='dropdownGerenciarSelecao' data-toggle='dropdown' aria-haspopup='true' aria-expanded='true'>";
            vjsHtml = vjsHtml + "           <i class='fa fa-check-square-o'></i>";
            vjsHtml = vjsHtml + "           <span style='display:visible'>Gerenciar Selação</span>";
            vjsHtml = vjsHtml + "           <div class='caret'></div>";
            vjsHtml = vjsHtml + "       </button>";
            vjsHtml = vjsHtml + "       <ul class='dropdown-menu' aria-labelledby='dropdownPastaAtual'>";
            vjsHtml = vjsHtml + "           <li>";
            vjsHtml = vjsHtml + "               <div style='margin: 3px;border:1px none #4cff00;'>";
            vjsHtml = vjsHtml + "                   <span style='display:block; font-size: 11px; margin:0 0 0 20px; min-width:200px; width:200px; color: #bbb;'>Ações para:</span>";
            vjsHtml = vjsHtml + "                   <span id='' style='display:block; margin: 0 20px; font-size: 15px; max-width:200px;font-size: 13px; overflow:hidden; white-space: nowrap; text-overflow: ellipsis;' title=''>" + vjsTituloLabel + "</span>";
            vjsHtml = vjsHtml + "               </div>";
            vjsHtml = vjsHtml + "           </li>";
            vjsHtml = vjsHtml + "       <li role='separator' class='divider'></li>";
            vjsHtml = vjsHtml + "       <li><a tabindex='-1' href='#' id='dropdowngerselec_limpar' data-view='" + vjsView + "'><i class='fa fa-circle-thin'>&nbsp;&nbsp;</i>Limpar Seleção</a></li>";
            if ($("#checkboxAll").data('qtdcheckitem') > vjsQtdSomaQtds)
                {
                vjsHtml = vjsHtml + "       <li><a tabindex='-1' href='#' id='dropdowngerselec_selecionartudo' data-view='" + vjsView + "'><i class='fa fa-check-circle-o'>&nbsp;&nbsp;</i>Selecionar Tudo</a></li>";
            }
            if (vjsQtdSomaQtds == 1) {
                if (vjsQtdFolderSelected == 1) {
                    vjsHtml = vjsHtml + "   <li role='separator' class='divider'></li>";
                    vjsHtml = vjsHtml + "   <li><a tabindex='-1' href='#' id='dropdowngerselec_abrir' data-caminho='" + vjsCaminhoArquivo + "'><i class='fa fa-folder-open-o'>&nbsp;&nbsp;</i>Abrir</a></li>";
                    vjsHtml = vjsHtml + "   <li><a tabindex='-1' href='#' id='dropdowngerselec_renomear' data-toggle='modal' data-target='#modalBootstrap' data-whatever='" + vjsNomePasta + "' data-estadopasta='fechada' data-tipo='D' data-caminho='" + vjsCaminhoArquivo + "'><i class='fa fa-pencil'>&nbsp;&nbsp;</i>Renomear</a></li>";
                    vjsHtml = vjsHtml + "   <li><a tabindex='-1' href='#' id='dropdowngerselec_moverpara' data-toggle='modal' data-target='#modalBootstrap' data-nome='" + vjsNomePasta + "' data-estadopasta='fechada' data-tipo='D' data-caminho='" + vjsCaminhoArquivo + "' data-origemacesso=''><i class='fa fa-arrows'>&nbsp;&nbsp;</i>Mover Para</a></li>";
                }
                else if (vjsQtdFileSelected == 1) {
                    vjsHtml = vjsHtml + "   <li role='separator' class='divider'></li>";
                    vjsHtml = vjsHtml + "   <li><a tabindex='-1' href='" + vjsCaminhoCompletoArquivo + "' url='" + vjsCaminhoCompletoArquivo + "' id='dropdowngerselec_abrirarquivo' rel='prettyPhoto'><i class='fa fa-file-o'>&nbsp;&nbsp;</i>Abrir</a></li>";
                    vjsHtml = vjsHtml + "   <li><a tabindex='-1' href='#' id='dropdowngerselec_renomeararquivo' data-toggle='modal' data-target='#modalBootstrap' data-nomearquivo='" + vjsNomeArquivo + "' data-estadopasta='fechada' data-tipo='A' data-caminho='" + vjsCaminhoArquivo + "'><i class='fa fa-pencil'>&nbsp;&nbsp;</i>Renomear</a></li>";
                    vjsHtml = vjsHtml + "   <li><a tabindex='-1' href='#' id='dropdowngerselec_moverpara' data-toggle='modal' data-target='#modalBootstrap' data-nome='" + vjsNomeArquivo + "' data-estadopasta='fechada' data-tipo='A' data-caminho='" + vjsCaminhoArquivo + "' data-origemacesso=''><i class='fa fa-arrows'>&nbsp;&nbsp;</i>Mover Para</a></li>";
                }
                vjsHtml = vjsHtml + "       <li><a tabindex='-1' href='#' class='btn disabled' style='text-align: left;'><i class='fa fa-files-o'>&nbsp;&nbsp;</i>Copiar Para</a></li>";
                vjsHtml = vjsHtml + "       <li role='separator' class='divider'></li>";
                vjsHtml = vjsHtml + "       <li><a tabindex='-1' href='#' id='dropdowngerselec_excluir' data-caminhopastapai='' data-view='"+ vjsView + "' style='text-align: left;'><i class='fa fa-trash'>&nbsp;&nbsp;</i>Excluir</a></li>";
            }
            else {
                vjsHtml = vjsHtml + "       <li role='separator' class='divider'></li>";
                vjsHtml = vjsHtml + "        <li><a tabindex='-1' href='#' id='dropdowngerselec_movertudopara' data-toggle='modal' data-target='#modalBootstrap' data-caminhopastapai='' data-view='" + vjsView + "'><i class='fa fa-arrows'>&nbsp;&nbsp;</i>Mover Tudo Para</a></li>";
                vjsHtml = vjsHtml + "        <li><a tabindex='-1' href='#' class='btn disabled' style='text-align: left;'><i class='fa fa-files-o'>&nbsp;&nbsp;</i>Copiar Tudo Para</a></li>";
                vjsHtml = vjsHtml + "        <li role='separator' class='divider'></li>";
                vjsHtml = vjsHtml + "        <li><a tabindex='-1' href='#' id='dropdowngerselec_excluir' data-caminhopastapai='' data-view='"+ vjsView + "'><i class='fa fa-trash'>&nbsp;&nbsp;</i>Excluir Tudo</a></li>";
            }
            vjsHtml = vjsHtml + "       </ul>";
            vjsHtml = vjsHtml + "   </div>";
            vjsHtml = vjsHtml + "</li>";
            $("#menuhorizontal").append(vjsHtml);
            $("#dropdowngerselec_excluir").data('caminhopastapai', vprmCheckBox.closest('#container_principallista').data('caminhopasta'));
            $("#dropdowngerselec_movertudopara").data('caminhopastapai', vprmCheckBox.closest('#container_principallista').data('caminhopasta'));
            if (vjsBtnJaInserido == "N") {
                fnInitializeBreadCrumb();
           }
        }
        else {
            $("#OpcaoGerenciarSelecao").remove();
            $(".folders a").removeClass('checkbox_checked');
            $(".folders_lista a").removeClass('checkbox_checked');
            $(".files a").removeClass('checkbox_checked');
            $(".files_lista a").removeClass('checkbox_checked');
            fnInitializeBreadCrumb();
        }
        fnReinitializePrettyPhoto();
    }
    /*----------------------------------------------------------------------------*/
    $("#container_contents, #contextMenu_dropdown").on('click', "#dropdowngerselec_limpar, #menuContextPastaPai_limpartudo", function () {
        $("#checkboxAll").attr("checked", false);
        $(".checkbox_folder" + $(this).data("view") + ":checked").each(function (index) {
            $(this).attr("checked", false);
        });
        $(".checkbox_file" + $(this).data("view") + ":checked").each(function (index) {
            $(this).attr("checked", false);
        });
        if ($(this).data("view") == "grid") {
            $(".checkbox_folderlista:checked").each(function (index) {
                $(this).attr("checked", false);
            });
            $(".checkbox_filelista:checked").each(function (index) {
                $(this).attr("checked", false);
            });
            $('.conteiner_checkbox_grid').hide();
        } else {
            $("#checkboxAll")[0].checked = false;
            $(".checkbox_foldergrid:checked").each(function (index) {
                $(this).attr("checked", false);
            });
            $(".checkbox_filegrid:checked").each(function (index) {
                $(this).attr("checked", false);
            });
            $('.conteiner_checkbox_grid').hide();
        }
        $("#OpcaoGerenciarSelecao").remove();
        $("#hidQtdFolderSelected").val(0);
        $("#hidQtdFileSelected").val(0);
        $(".folders a").removeClass('checkbox_checked');
        $(".folders_lista a").removeClass('checkbox_checked');
        $(".files a").removeClass('checkbox_checked');
        $(".files_lista a").removeClass('checkbox_checked');
        fnInitializeBreadCrumb();
        fnMenuContextPastaPaiAberta();
    });
    /*----------------------------------------------------------------------------*/
    /*--------------------userAvatarMenu---------------------------------------*/
    $('#userAvatarMenu').on('click', function () {
        fnCriarModalHtml('S', 'custom-size-modal_500x600');
        $('#modalBootstrap').one('show.bs.modal', function () {
            $(".modal-content #modalBootstrapLabel").text("Selecionar foto do perfil");
            $(".modal-body #modal-container-title").text("A nova foto irá substituir a foto atual!");
            $(".modal-body #modalSubtitle").html("");
            $.ajax({
                type: 'POST',
                url: 'Modal/CriarFotoPerfilModal',
                contentType: 'application/x-www-form-urlencoded;',
                cache: false,
                global: true,
                dataType: 'html',
                beforeSend: function () {
                    $("#modal_container_resp").html("<div class='alert alert-info' role='alert'><img src='Content/pho_images/phoimg_carregando/loading_circular.gif' /> <span class='text_carregando'>Carregando...</span></div>");
                },
                success: function (html) {
                    $('#modal_container_resp').empty();
                    $('#modal_container_contents').empty().html(html);
                    $('#file_fotoPerfil').uploadify({
                        debug: false,
                        'multi': false,
                        'fileObjName': 'file_fotoPerfil',
                        'method': 'POST',
                         'swf': '/Content/uploadify.swf',
                         'uploader': '/FotoPerfil/CriarFotoPerfil',
                        'cancelImg': '/Content/pho_images/phoimg_botoes/uploadify-cancel.png',
                        'buttonText': "<i class='fa fa-file-image-o change' data-icon='fa fa-cloud'>&nbsp;&nbsp;</i>Selecionar nova foto para o perfil",
                        'buttonClass': 'btn btn-default btn-block',
                        'fileDesc': 'Arquivos de Imagem',
                        'width': 345,
                        'height': 40,
                        'lineHeight':30,
                        'fileExt': '*.jpg;*.gif;*.png',
                        'sizeLimit': '209715200', //200 Mb
                        'removeCompleted': false,
                        'onUploadSuccess': function (file, data, response) {
                            $('#modal_container_contents').css("visibility", "hidden");
                            $('#modal_container_resp').empty().html(data);;
                            var vjsStatus = $('#hidstatus').val();
                            if (vjsStatus < 0) {
                                $('#' + file.id).remove();
                            }
                            else if (vjsStatus > 0) {
                                $('#' + file.id).remove();
                            }
                            else {
                                $('#imagemAvatar').attr('src', $('#hidcaminho').val());
                                $('#img_fotoperfil').attr('src', $('#hidcaminho').val());
                                $('#' + file.id).find('.data').html(' - Completo.');
                                $('#' + file.id).find('.cancel').remove();
                                setTimeout(function () {
                                    $('#' + file.id).fadeOut(500, function () {
                                        $(this).remove();
                                    });
                                }, 3 * 1000);
                            }
                        },
                        'onUploadError': function (file, errorCode, errorMsg, errorString) {
                            var MyErrorString = "";
                            $('#' + file.id).find('.cancel').remove();
                            switch (errorMsg) {
                                case '801':
                                    MyErrorString = "O arquivo \"" + file.name + "\" já existe na pasta selecionada.";
                                    break;
                                case '802':
                                    MyErrorString = "O Conteudo do Arquivo \"" + file.name + "\" está vazio.";
                                    break;
                                case '803':
                                    MyErrorString = "O arquivo \"" + file.name + "\" é nullo.";
                                    break;
                                case '804':
                                    MyErrorString = "Tipo de arquivo não permitido. <br />Selecione apenas arquivos de imagem (.jpg,.png ou .gif). ";
                                    break;
                                case '805':
                                    MyErrorString = "Tamanho do arquivo não permitido.";
                                    break;
                                default:
                                    MyErrorString = errorMsg + " Erro não identificado.";
                                    break;
                            }
                            $('#' + file.id).find('.data').html(' - ' + MyErrorString);
                        },
                        'onDialogOpen': function () {
                            $('.uploadify-queue-item').each(function () {
                                $(this).fadeOut(500, function () {
                                    $(this).remove();
                                });
                            });
                        },
                        'onError': function (a, b, c, d) {
                            if (d.status == 404)
                                alert("Could not find upload script. Use a path relative to: " + "<?= getcwd() ?>");
                            else if (d.type === "HTTP")
                                alert("error " + d.type + ": " + d.status);
                            else if (d.type === "File Size")
                                alert(c.name + " " + d.type + " Limit: " + Math.round(d.info / (1024 * 1024)) + "MB");
                            else
                                alert("error " + d.type + ": " + d.text);
                        },
                        auto: true
                    });
                },
                error: function (xhr, errorMessage, thrownError) {
                    $('#modal_container_resp').empty().append("<div class='alert alert-danger' role='alert'><ul id='erro_post'><li>Ocorreu um erro ao carregar as informações.</li><li>Erro: " + xhr.status + "</li><li>Descrição: " + xhr.statusText + "</li><li>Erro Response Text:" + xhr.responseText + "</li><li>Caso o problema persista, contate o administrador do sistema.</li></ul></div>");
                }
            });
        });
    });
    /*----------------------------------------------------------------------------*/
    /*--------------------alterar Senha*---------------------------------------*/
    $('#alterarSenha').on('click', function () {
        fnCriarModalHtml('N', 'custom-size-modal_500x700');
        fnReiniciarControleFormAlterarSenha();
        $('#modalBootstrap').one('show.bs.modal', function () {
            $(".modal-content #modalBootstrapLabel").text("Alterar Senha");
            $(".modal-body #modal-container-title").text("Informe as senhas");
            $(".modal-body #modalSubtitle").html("");
            $.ajax({
                type: 'POST',
                url: 'Modal/AlterarSenhaModal',
                contentType: 'application/x-www-form-urlencoded;',
                cache: false,
                global: true,
                dataType: 'html',
                beforeSend: function () {
                    $("#modal_container_resp").html("<div class='alert alert-info' role='alert'><img src='Content/pho_images/phoimg_carregando/loading_circular.gif' /> <span class='text_carregando'>Carregando...</span></div>");
                },
                success: function (html) {
                    $('#modal_container_resp').empty();
                    $('#modal_container_contents').empty().html(html);
                  },
                error: function (xhr, errorMessage, thrownError) {
                    $('#modal_container_resp').empty().append("<div class='alert alert-danger' role='alert'><ul id='erro_post'><li>Ocorreu um erro ao carregar as informações.</li><li>Erro: " + xhr.status + "</li><li>Descrição: " + xhr.statusText + "</li><li>Erro Response Text:" + xhr.responseText + "</li><li>Caso o problema persista, contate o administrador do sistema.</li></ul></div>");
                }
            });
        });
    });
    /*----------------------------------------------------------------------------*/
    /*--------------------TABS MENU LATERAL---------------------------------------*/
    $('#abas_menu_lateral').on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
        e.preventDefault();
        var vjsAbas = $('#abas_menu_lateral li');
        switch ($(this).attr('id')) {
            case 'tabcloud':
                fnInicioConteudo();
                fnInitializeFileTree();
                break;
            case 'tabtrash':
                fnLixeiraConteudo();
                fnMenuLixeira();
                break;
        }
    });
    $('#abas_menu_lateral').on({
        mouseenter: function () {
            var vjsClasseIconeAtivo = $(this).find('i.change').attr("data-icon");
            $(this).find('i.change').removeClass(vjsClasseIconeAtivo).addClass("fa fa-refresh");
        },
        mouseleave: function () {
            var vjsClasseIconeAtivo = $(this).find('i.change').attr("data-icon");
            $(this).find('i.change').removeClass("fa fa-refresh").addClass(vjsClasseIconeAtivo);
        },
        click: function () {
            switch ($(this).attr('id')) {
                case 'tabcloud':
                    fnInicioConteudo();
                    fnInitializeFileTree();
                    break;
                case 'tabtrash':
                    fnLixeiraConteudo();
                    fnMenuLixeira();
                    break;
            }
        }
    }, 'li.active a[data-toggle="tab"]');
    /*----------------------------------------------------------------------------*/
    /*------------------SEÇÂO BOTOES MENU HORIZONTAL------------------------------*/
    /*------------------Botão Pasta Raiz------------------------*/
    $('#menuhorizontal').on('click', '#rootfolder', function () {
        var vjsPastaUrl = $(this).attr('rel')
        var arrayJsFuncoesContextMenu = [
                   function () { fnMenuContextPastas(); },
                   function () { fnMenuContextPastaPaiAberta(); },
                   function () { fnMenuContextArquivos(); }
        ];
        var arrayJsFuncoes = [
                   function () { fnReinitializeCycle(); },
                   function () { fnReinitializePrettyPhoto(); },
                   function () { fnInitializeFileTree(); },
                   function () { fnCriaMenuHorizontal(vjsPastaUrl); },
                   function () { fnCriarContextMenu(arrayJsFuncoesContextMenu); }
        ];
        fnAjaxListaArquivos(vjsPastaUrl, arrayJsFuncoes); 
    });
    /*-----------------------------------------------------------*/
    /*------------------Botão Criar Pasta------------------------*/
    $("#container_contents, #contextMenu_dropdown").on("click", "#criarpasta, #btn_criarPasta, #menuContextPastaPai_criarpasta", function () {
        var vjsCaminhoCompleto = $(this).attr('rel');
        var vjsPastaAtual = $(this).data('whatever');
        fnCriarModalHtml();
        fnReiniciarControleFormCriarPasta();
        $('#modalBootstrap').one('show.bs.modal', function () {
            $(".modal-content #modalBootstrapLabel").text("Criar nova pasta");
            $(".modal-body #modal-container-title").text("A nova pasta será criada em:");
            $(".modal-body #modalSubtitle").html("<ul class='nav nav-pills nav-stacked'><li role='presentation' ><a href='#' style='color: #333; font-size:16px;'>" + vjsPastaAtual + "</a></li></ul>");
            $.ajax({
                type: 'POST',
                url: 'Modal/CriarPastaModal',
                contentType: 'application/x-www-form-urlencoded;',
                data: { 'pastaAtual': vjsPastaAtual, 'caminhoCompleto': vjsCaminhoCompleto },
                cache: false,
                global: true,
                dataType: 'html',
                beforeSend: function () {
                    $("#modal_container_resp").html("<div class='alert alert-info' role='alert'><img src='Content/pho_images/phoimg_carregando/loading_circular.gif' /> <span class='text_carregando'>Carregando...</span></div>");
                },
                success: function (html) {
                    $('#modal_container_resp').empty();
                    $('#modal_container_contents').empty().html(html);
                },
                error: function (xhr, errorMessage, thrownError) {
                    $('#modal_container_resp').empty().append("<div class='alert alert-danger' role='alert'><ul id='erro_post'><li>Ocorreu um erro ao carregar as informações.</li><li>Erro: " + xhr.status + "</li><li>Descrição: " + xhr.statusText + "</li><li>Erro Response Text:" + xhr.responseText + "</li><li>Caso o problema persista, contate o administrador do sistema.</li></ul></div>");
                }
            });
        });
    });
    /*------------------Botão Renomear Pasta------------------------*/
    $("#menuhorizontal, #container_contents, #contextMenu_dropdown").on("click", "#acoespasta_renomear, #breadcrumb_renomear, #menuContextPastas_renomear, #dropdowngerselec_renomear", function () {
        var vjsCaminhoCompleto = $(this).data('caminho');
        var vjsPastaAtual = $(this).data('whatever');
        var vjsEstadoPasta = $(this).data('estadopasta');
        var vjsAcaoPagina = $(this).data('acaopagina'); 
        var vjsTipo = $(this).data('tipo'); 
        fnCriarModalHtml();
        fnReiniciarControleFormRenomearPasta();
        $('#modalBootstrap').one('show.bs.modal', function () {
            $(".modal-content #modalBootstrapLabel").text("Renomear pasta");
            $(".modal-body #modalSubtitle").html("<ul class='nav nav-pills nav-stacked'><li role='presentation' ><a href='#' style='color: #333; font-size:16px;'>" + vjsPastaAtual + "</a></li></ul>");
            $.ajax({
                type: 'POST',
                url: 'Modal/RenomearPastaModal',
                contentType: 'application/x-www-form-urlencoded;',
                data: { 'pastaAtual': vjsPastaAtual, 'caminhoCompleto': vjsCaminhoCompleto },
                cache: false,
                global: true,
                dataType: 'html',
                beforeSend: function () {
                    $("#modal_container_resp").html("<div class='alert alert-info' role='alert'><img src='Content/pho_images/phoimg_carregando/loading_circular.gif' /> <span class='text_carregando'>Carregando...</span></div>");
                },
                success: function (html) {
                    $('#modal_container_resp').empty();
                    $('#modal_container_contents').empty().html(html);
                    $('#hidEstadoPasta').val(vjsEstadoPasta);
                    $('#hidAcaoPagina').val(vjsAcaoPagina);
                },
                error: function (xhr, errorMessage, thrownError) {
                    $('#modal_container_resp').empty().append("<div class='alert alert-danger' role='alert'><ul id='erro_post'><li>Ocorreu um erro ao carregar as informações.</li><li>Erro: " + xhr.status + "</li><li>Descrição: " + xhr.statusText + "</li><li>Erro Response Text:" + xhr.responseText + "</li><li>Caso o problema persista, contate o administrador do sistema.</li></ul></div>");
                }
            });
        });
    });
    /*------------------Botão Renomear Arquivo------------------------*/
    $("#container_contents, #contextMenu_dropdown").on("click", "#dropdowngerselec_renomeararquivo, #menuContextArquivos_renomear", function () {
        var vjsCaminhoCompleto = $(this).data('caminho');
        var vjsNomeArquivo = $(this).data('nomearquivo');
        fnCriarModalHtml();
        fnReiniciarControleFormRenomearArquivo();
        $('#modalBootstrap').one('show.bs.modal', function () {
            $(".modal-content #modalBootstrapLabel").text("Renomear arquivo");
            $(".modal-body #modalSubtitle").html("<ul class='nav nav-pills nav-stacked'><li role='presentation' ><a href='#' style='color: #333; font-size:16px;'>" + vjsNomeArquivo + "</a></li></ul>");
            $.ajax({
                type: 'POST',
                url: 'Modal/RenomearArquivoModal',
                contentType: 'application/x-www-form-urlencoded;',
                data: { 'nomeArquivoAtual': vjsNomeArquivo, 'caminhoCompleto': vjsCaminhoCompleto },
                cache: false,
                global: true,
                dataType: 'html',
                beforeSend: function () {
                    $("#modal_container_resp").html("<div class='alert alert-info' role='alert'><img src='Content/pho_images/phoimg_carregando/loading_circular.gif' /> <span class='text_carregando'>Carregando...</span></div>");
                },
                success: function (html) {
                    $('#modal_container_resp').empty();
                    $('#modal_container_contents').empty().html(html);
                },
                error: function (xhr, errorMessage, thrownError) {
                    $('#modal_container_resp').empty().append("<div class='alert alert-danger' role='alert'><ul id='erro_post'><li>Ocorreu um erro ao carregar as informações.</li><li>Erro: " + xhr.status + "</li><li>Descrição: " + xhr.statusText + "</li><li>Erro Response Text:" + xhr.responseText + "</li><li>Caso o problema persista, contate o administrador do sistema.</li></ul></div>");
                }
            });
        });
    });
    /*-----------------------------------------------------------*/
    /*-----------------------------------------------------------*/
    /*------------------ Funçao Descricao Modal mover para------------------------------------*/
    function fnDescricaoModalMoverPara(prmJsQtdPastas, prmJsQtdArquivos, prmJsNomePasta, prmJsNomeArquivo) {
        var vfnJsDescricaoModal = "";
        var vfnJsDescricaoTipo = "";
        var vfnJsArrayDescricaoModalTipoModal = new Array(2);
        vfnJsDescricaoModal = "Para mover "
        if (prmJsQtdPastas > 0) {
            if (prmJsQtdPastas == 1) {
                vfnJsDescricaoTipo = "Pasta ";
                vfnJsDescricaoModal = vfnJsDescricaoModal + "a pasta " + " <strong>" + prmJsNomePasta + "</strong> e todo o seu conteúdo, "
            }
            else {
                vfnJsDescricaoTipo = "Pastas ";
                vfnJsDescricaoModal = vfnJsDescricaoModal + "as " + prmJsQtdPastas + " pastas e todos os seus conteúdos, "
            }
            if (prmJsQtdArquivos > 0) {
                if (prmJsQtdArquivos == 1) {
                    vfnJsDescricaoTipo = vfnJsDescricaoTipo + "e Arquivo";
                    vfnJsDescricaoModal = vfnJsDescricaoModal + "e o arquivo " + " <strong>" + prmJsNomeArquivo + "</strong>, "
                }
                else {
                    vfnJsDescricaoTipo = vfnJsDescricaoTipo + "e Arquivos";
                    vfnJsDescricaoModal = vfnJsDescricaoModal + "e os " + prmJsQtdArquivos + " arquivos, "
                }
            }
        }
        else if (prmJsQtdArquivos > 0) {
            if (prmJsQtdArquivos == 1) {
                vfnJsDescricaoTipo = "Arquivo";
                vfnJsDescricaoModal = vfnJsDescricaoModal + "o arquivo " + " <strong>" + prmJsNomeArquivo + "</strong>, "
            }
            else {
                vfnJsDescricaoTipo = "Arquivos";
                vfnJsDescricaoModal = vfnJsDescricaoModal + "os " + prmJsQtdArquivos + " arquivos, "
            }
        }
        vfnJsDescricaoModal = vfnJsDescricaoModal + "selecione a pasta de destino."
        vfnJsArrayDescricaoModalTipoModal[0] = vfnJsDescricaoTipo;
        vfnJsArrayDescricaoModalTipoModal[1] = vfnJsDescricaoModal;
        return vfnJsArrayDescricaoModalTipoModal;
    }
    /*------------------------------------------------------------------------------*/
    /*------------------Opção Mover Para------------------------*/
    $("#contextMenu_dropdown, #container_contents").on("click", "#menuContextPastas_moverpara, #menuContextArquivos_moverpara, #dropdowngerselec_moverpara, #breadcrumb_moverpara", function () {
        var vjsCaminhoCompleto = $(this).data('caminho');
        var vjsNomeArquivo = $(this).data('nome');
        var vjsTipo = $(this).data('tipo');
        var vjsEstadoPasta = $(this).data('estadopasta');
        var vjsOrigemAcesso = $(this).data('origemacesso');
        //alert("estadopasta: " + vjsEstadoPasta);
      //  alert("origemacesso Mover Para: " + vjsOrigemAcesso);
      //  var vjsCaminhoPastaAberta = $('#dropdownPastaAtual').data('caminho');
        var vjsCaminhoPastaPai = $('#hidDiretorioPai').val();
     //   alert(vjsCaminhoPastaPai);
        var vjsCaminhoPastaAtual = $('#hidDiretorioAtual').val();
        var vjsDescricaoTipo = ""
        var vjsDescricaoModal = "";
        var arrJsJsonMoverPara = {
            "caminhoPastaPai": vjsCaminhoPastaPai,
            "caminhoRetorno": vjsCaminhoPastaAtual,
            "estadoPasta": vjsEstadoPasta,
            "origemAcessoArquivoPasta": vjsOrigemAcesso,
                "caminhoAtualDestino": null,
                "listaMoverPastasArquivos": [
                                { "nomePastaArquivo": vjsNomeArquivo, "caminhoOriginal": vjsCaminhoCompleto, "tipoArquivoPasta": vjsTipo }
                    ]
        }
        vjsDescricaoModal = "Para mover "
        if (vjsTipo == "D") {
            vjsDescricaoTipo = "Pasta";
            vjsDescricaoModal = vjsDescricaoModal + "a pasta " + " <strong>" + vjsNomeArquivo + "</strong> e todo o seu conteúdo, selecione a pasta de destino."
        } else if (vjsTipo == "A") {
            vjsDescricaoTipo = "Arquivo";
            vjsDescricaoModal = vjsDescricaoModal + "o arquivo " + " <strong>" + vjsNomeArquivo + "</strong>, selecione a pasta de destino."
        }
        fnCriarModalMoverPastaArquivo(arrJsJsonMoverPara, vjsDescricaoTipo, vjsDescricaoModal)
    });
    /*------------------Opção Mover Tudo------------------*/
    $("#container_contents").on("click", "#dropdowngerselec_movertudopara", function () {
        //    var vjsCaminhoPastaAberta = $(this).data('caminhopastapai');
        var vjsCaminhoPastaPai = $('#hidDiretorioPai').val();
       
     //   alert("dropdowngerselec_movertudopara: ");
        var vjsCaminhoPastaAtual = $('#hidDiretorioAtual').val();
        var vjsView = $(this).data("view");
        var arrJsJsonlistaMoverPastasArquivos = [];
        var vjsQtdTipoPasta = 0;
        var vjsQtdTipoArquivo = 0;
        var vjsDescricaoTipo = ""
        var vjsDescricaoModal = "";
        var vjsNomePasta = "";
        var vjsNomeArquivo = "";
        $(".checkbox_folder" + vjsView + ":checked").each(function (index) {
            vjsNomePasta = $(this).data('nome');
            item = {}
            item["nomePastaArquivo"] = $(this).data('nome');
            item["caminhoOriginal"] = $(this).val();
            item["tipoArquivoPasta"] = $(this).data('tipo');
            item["idCheckbox"] = $(this).attr('id');
            arrJsJsonlistaMoverPastasArquivos.push(item);
            vjsQtdTipoPasta++;
        });
        $(".checkbox_file" + vjsView + ":checked").each(function (index) {
            vjsNomeArquivo = $(this).data('nome');
            item = {}
            item["nomePastaArquivo"] = $(this).data('nome');
            item["caminhoOriginal"] = $(this).val();
            item["tipoArquivoPasta"] = $(this).data('tipo');
            item["idCheckbox"] = $(this).attr('id');
            arrJsJsonlistaMoverPastasArquivos.push(item);
            vjsQtdTipoArquivo++;
        });
        var arrJsJsonMoverPara = {
            "caminhoPastaPai": vjsCaminhoPastaPai,
            "caminhoRetorno": vjsCaminhoPastaAtual,
            "estadoPasta": "fechada",
            "origemAcessoArquivoPasta":"0",
            "caminhoAtualDestino": null,
            "listaMoverPastasArquivos": 
                arrJsJsonlistaMoverPastasArquivos
        }
        var arrayJsRetornoDescricaoModalMoverPara = fnDescricaoModalMoverPara(vjsQtdTipoPasta, vjsQtdTipoArquivo, vjsNomePasta, vjsNomeArquivo);
        vjsDescricaoTipo = arrayJsRetornoDescricaoModalMoverPara[0];
        vjsDescricaoModal = arrayJsRetornoDescricaoModalMoverPara[1];
        fnCriarModalMoverPastaArquivo(arrJsJsonMoverPara, vjsDescricaoTipo, vjsDescricaoModal)
    });
    function fnCriarModalMoverPastaArquivo(prmJsJsonPastasArquivos, prmDescricaoTipo, prmModalSubtitle) {
        fnCriarModalHtml('S', 'custom-size-modal_600x600');
        fnReiniciarControleFormMoverPara();
        $('#modalBootstrap').one('show.bs.modal', function () {
            $(".modal-content #modalBootstrapLabel").text("Mover " + prmDescricaoTipo);
            var vHtmlConflito = ""
            vHtmlConflito = vHtmlConflito + "<div id='conteinerconflitos' class=''>";
            vHtmlConflito = vHtmlConflito + "   <div class='row'>";
            vHtmlConflito = vHtmlConflito + "	    <div class='col-md-10 col-md-offset-1'>";
            vHtmlConflito = vHtmlConflito + "           <h4 id='modal-container-title'></h4>";
            vHtmlConflito = vHtmlConflito + "		    <div class='modal-subtitle'>";
            vHtmlConflito = vHtmlConflito + "		        <ul class='nav nav-pills nav-stacked'>";
            vHtmlConflito = vHtmlConflito + "		    	    <li role='presentation'><a href='#' style='color: #333; font-size:16px;'>Para mover para a pasta selecionada, remova as pastas que estão com destinos em conflito.</a></li>";
            vHtmlConflito = vHtmlConflito + "		        </ul>";
	        vHtmlConflito = vHtmlConflito + "		    </div>";
	        vHtmlConflito = vHtmlConflito + "	    	<hr>";
	        vHtmlConflito = vHtmlConflito + "	    	<div>";
	        vHtmlConflito = vHtmlConflito + "		    	<div style='border:1px none #ff0000;float:left;width:100%;'>";
	        vHtmlConflito = vHtmlConflito + "		    	    <div id='content_conflitosmover' style='height:250px; width:100%; overflow-y:auto; border:1px solid #ccc; padding:10px; background-color: #f6f6f6;'>";
	        vHtmlConflito = vHtmlConflito + "		    		</div>";
	        vHtmlConflito = vHtmlConflito + "	    		</div>";
	        vHtmlConflito = vHtmlConflito + "	    	</div>";
	        vHtmlConflito = vHtmlConflito + "	    </div>";
	        vHtmlConflito = vHtmlConflito + "   </div>";
	        vHtmlConflito = vHtmlConflito + "   <div class='row'>";
	        vHtmlConflito = vHtmlConflito + "	    <div class='col-md-10 col-md-offset-1'>";
	        vHtmlConflito = vHtmlConflito + "	        <hr>";
	        vHtmlConflito = vHtmlConflito + "           <div class='form-group'>";
	        vHtmlConflito = vHtmlConflito + "               <div class='col-md-4 col-md-offset-8'>";
            vHtmlConflito = vHtmlConflito + "                   <button type='button' id='btn_cancelar_removerconflitos_mover' data-loading-text='Aguarde...' class='btn btn-default btn-block' autocomplete='off' title='Cancelar'>";
            vHtmlConflito = vHtmlConflito + "                       <span class='fa fa-times' style='font-size:15px;'>&nbsp;</span>";
            vHtmlConflito = vHtmlConflito + "                       Cancelar";
            vHtmlConflito = vHtmlConflito + "                   </button>";
            vHtmlConflito = vHtmlConflito + "               </div>";
            vHtmlConflito = vHtmlConflito + "           </div>";
	        vHtmlConflito = vHtmlConflito + "       </div>";
	        vHtmlConflito = vHtmlConflito + "   </div>";
            vHtmlConflito = vHtmlConflito + "</div>";
            $(".modal-body").append(vHtmlConflito)
            $(".modal-body #modalSubtitle").html("<ul class='nav nav-pills nav-stacked'><li role='presentation' ><a href='#' style='color: #333; font-size:16px;'>"+prmModalSubtitle+"</a></li></ul>");
            $.ajax({
                type: 'POST',
                url: 'Modal/MoverPastaArquivoModal',
                contentType: 'application/x-www-form-urlencoded;',
                cache: false,
                global: true,
                dataType: 'html',
                beforeSend: function () {
                    $("#modal_container_resp").html("<div class='alert alert-info' role='alert'><img src='Content/pho_images/phoimg_carregando/loading_circular.gif' /> <span class='text_carregando'>Carregando...</span></div>");
                },
                success: function (html) {
                    $('#modal_container_resp').empty();
                    $('#modal_container_contents').empty().html(html);
                    fnBindMenuTreeChoose($("#content-menutree_mover").find('.jqueryFileTree'));
                    fnCriarJsonMoverCopiarPara(prmJsJsonPastasArquivos);
                },
                error: function (xhr, errorMessage, thrownError) {
                    $('#modal_container_resp').empty().append("<div class='alert alert-danger' role='alert'><ul id='erro_post'><li>Ocorreu um erro ao carregar as informações.</li><li>Erro: " + xhr.status + "</li><li>Descrição: " + xhr.statusText + "</li><li>Erro Response Text:" + xhr.responseText + "</li><li>Caso o problema persista, contate o administrador do sistema.</li></ul></div>");
                }
            });
        });
    }
    /*-----------------------------------------------------------*/
    /*------------------Controles Botões Conflitos após Mover -----------------*/
    function fnReiniciarControleRetornoConflitosMover() {
       // alert("fnReiniciarControleRetornoConflitosMover");
   
        /*-----------------------------------------------------------*/
        /*------------------Botão Mover e Substituir-----------------*/
        $('.btn_moversubistituir').on('click', function () {
            alert('Botão Mover e Substitui.');
        });
        /*-----------------------------------------------------------*/
        /*------------------Botão Não Mover--------------------------*/
        $('.btn_naomover').on('click', function(){
            $(this).closest('.alert-warning').fadeOut(400, function () {
                $(this).remove();
                if ($(".warning_movereturn").length <= 0) {
                    alert('acabou');
                }
            });
           
        });
        /*-----------------------------------------------------------*/
        /*----------Botão Mover, mas manter as duas pastas/arquivos-----------*/
        $('.btn_movermanter').on('click', function () {
            alert('Botão Mover, mas manter.');
        });
        /*-----------------------------------------------------------*/
    }
    /*********************************************************/
    var JsonMoverCopiarPara = {};
    function fnCriarJsonMoverCopiarPara(prmJsJsonData) {
        JsonMoverCopiarPara = prmJsJsonData;
     //  console.log(JsonMoverCopiarPara);
    };
    /***********************************************************/
    /*-----------------------------------------------------------*/
    /*------------------Botão Carregar Arquivos------------------*/
    $('#menuhorizontal, #container_contents, #contextMenu_dropdown').on('click', '#carregararquivos, #btn_carregarArquivos, #menuContextPastaPai_carregararquivos', function () {
        var folder = $(this).attr('rel')
        $.ajax({
            type: 'POST',
            url: 'GerenciarArquivo/UploadSelecionarArquivos',
            contentType: 'application/x-www-form-urlencoded;',
            data: { 'pasta': folder },
            cache: false,
            global: true,
            dataType: 'html',
            beforeSend: function () {
                $('#container_contents').empty().append("<div class='alert alert-info' role='alert'><img src='Content/pho_images/phoimg_carregando/loading_circular.gif' /> <span class='text_carregando'>Carregando...</span></div>");
            },
            success: function (html) {
                $('#container_contents').empty().html(html);
                fnReinitializeUploadiFy();
            },
            error: function (xhr, errorMessage, thrownError) {
                $('#container_contents').empty().append("<div class='alert alert-danger' role='alert'><ul id='erro_post'><li>Ocorreu um erro ao carregar as informações.</li><li>Erro: " + xhr.status + "</li><li>Descrição: " + xhr.statusText + "</li><li>Erro Response Text:" + xhr.responseText + "</li><li>Caso o problema persista, contate o administrador do sistema.</li></ul></div>");
            }
        });
    });
    /*------------------FINAL SEÇÂO BOTOES MENU HORIZONTAL-------------------------*/
    /*-----------------------------------------------------------*/
    /*------------------Opção excluir------------------*/
    $('#contextMenu_dropdown, #container_contents').on('click', '#menuContextPastas_excluir, #breadcrumb_excluir, #menuContextArquivos_excluir', function () {
        var vjsCaminhoPastaArquivo = $(this).data('caminho');
        var vjsCaminhoDiretorioPai = $(this).data('caminhopastapai');
        var vjsNomePasta = $(this).data('whatever');
        var vjsTipoPasta = $(this).data('tipo');
        var vjsMensagem = ""
        if (vjsTipoPasta == 'D') {
            var vjsMensagem = "Tem certeza que deseja excluir a pasta <strong>" + vjsNomePasta + "</strong> e todo seu conteúdo?";
        }
        else if (vjsTipoPasta == 'A') {
            var vjsMensagem = "Tem certeza que deseja excluir o arquivo <strong>" + vjsNomePasta + "</strong>?";
            vjsCaminhoPastaArquivo = vjsCaminhoPastaArquivo + "/";
        }
        var vjsClasseCSS = "";
        var arrayJsFuncoesAoConfirmar = [
           function () { fnMoverParaLixeira(vjsCaminhoPastaArquivo, vjsCaminhoDiretorioPai, vjsNomePasta, vjsTipoPasta); }
        ];
        fnCriarDialogHtml_Confirm(vjsMensagem, arrayJsFuncoesAoConfirmar, null, null, vjsClasseCSS)
        
    });
    /*-----------------------------------------------------------*/
    /*------------------Opção Excluir Tudo------------------*/
    $('#container_contents').on('click', '#dropdowngerselec_excluir', function () {
        var vjsTituloLabel = ""
        var vjsCaminhoDiretorioPai = $(this).data('caminhopastapai');
        var vjsNomePasta = "";
        var vjsTipoNomePasta = "";
        var arrayJsCaminhos = new Array();
        var arrayJsNomes = new Array();
        var arrayJsTipo = new Array();
        var vjsCaminhoPastasArquivos = "";
        var vjsView = $(this).data("view");
        var vjsQtdPasta = parseInt($("#hidQtdFolderSelected").val());
        var vjsQtdArquivo = parseInt($("#hidQtdFileSelected").val());
        var vjsQtdSomaQtds = 0;
        $(".checkbox_folder" + vjsView + ":checked").each(function (index) {
            arrayJsCaminhos.push($(this).val());
            arrayJsNomes.push($(this).data('nome'));
            arrayJsTipo.push($(this).data('tipo'));
        });
        $(".checkbox_file" + vjsView + ":checked").each(function (index) {
            arrayJsCaminhos.push($(this).val()+"/");
            arrayJsNomes.push($(this).data('nome'));
            arrayJsTipo.push($(this).data('tipo'));
        });
        vjsCaminhoPastasArquivos = arrayJsCaminhos.toString();
        vjsNomePasta = arrayJsNomes.toString();
        vjsTipoNomePasta = arrayJsTipo.toString();
        vjsQtdSomaQtds = (vjsQtdPasta + vjsQtdArquivo);
        if (vjsQtdPasta > 0) {
            if (vjsQtdPasta == 1) {
                vjsTituloLabel = vjsQtdPasta + " Pasta";
            }
            else {
                vjsTituloLabel = vjsQtdPasta + " Pastas";
            }
        }
        if (vjsQtdPasta > 0 && vjsQtdArquivo > 0) {
            vjsTituloLabel = vjsTituloLabel + " e ";
        }
        if (vjsQtdArquivo > 0) {
            if (vjsQtdArquivo == 1) {
                vjsTituloLabel = vjsTituloLabel + vjsQtdArquivo + " Arquivo";
            }
            else {
                vjsTituloLabel = vjsTituloLabel + vjsQtdArquivo + " Arquivos";
            }
        }
        if (vjsQtdSomaQtds > 1) {
            if (vjsQtdArquivo <= 0) {
                vjsTituloLabel = vjsTituloLabel + " selecionadas e todo seus conteúdos";
            }
            else {
                vjsTituloLabel = vjsTituloLabel + " selecionados";
            }
        }
        else {
            if (vjsQtdArquivo <= 0) {
                vjsTituloLabel = vjsTituloLabel + " selecionada e todo seu conteúdo";
            }
            else {
                vjsTituloLabel = vjsTituloLabel + " selecionado";
            }
        }
        var vjsMensagem = "Tem certeza que deseja excluir <strong>" + vjsTituloLabel + "</strong>?";
        var vjsClasseCSS = "";
        var arrayJsFuncoesAoConfirmar = [
           function () { fnMoverParaLixeira(vjsCaminhoPastasArquivos, vjsCaminhoDiretorioPai, vjsNomePasta, vjsTipoNomePasta); }
        ];
        fnCriarDialogHtml_Confirm(vjsMensagem, arrayJsFuncoesAoConfirmar, null, null, vjsClasseCSS)
    });
    /*-----------------------------------------------------------*/
    /*----------------------fnMoverParaLixeira*-------------------------------------*/
    function fnIncluiRemoveTimeoutMensagem(html) {
        $('#container_principallista').prepend(html);
        setTimeout(function () {
            $('.alert').fadeOut(500, function () {
               $(this).remove();
            });
        }, 3 * 1000);
    }
    function fnMoverParaLixeira(vprmPastaArquivo, vprmDiretorioPai, vprmNomePastaArquivo, vprmTipoPastaArquivo) {
        jQuery.ajax({
            type: "POST",
            url: "Lixeira/MoverParaLixeira",
            data: { 'caminhoPastaArquivo': vprmPastaArquivo, 'caminhoDiretorioPai': vprmDiretorioPai, 'nomePastaArquivo': vprmNomePastaArquivo, 'tipoPastaArquivo': vprmTipoPastaArquivo },
            cache: false,
            global: true,
            dataType: 'html',
            beforeSend: function () {
                $('.alert').remove();
                $('#container_principallista').prepend("<div class='alert alert-warning' role='alert' style='margin:10px 0 5px 0'><img src='Content/pho_images/phoimg_carregando/loading_circular.gif' /> <span class='text_carregando'>Excluindo...</span></div>");
            },
            success: function (html) {
                $('.alert').remove();
                if (vprmDiretorioPai == '/') {
                    var vjsBuscaDiretorioFileTree = fnInitializeFileTree();
                }
                else {
                    var vjsBuscaDiretorioFileTree = $('.jqueryFileTree').find('.directory').find('a').each(function () {
                        if ($(this).attr('url') == vprmDiretorioPai) {
                            showMyTree($(this).parent(), vprmDiretorioPai);
                            return false;
                        }
                    });
                }
                var arrayJsFuncoesContextMenu = [
                           function () { fnMenuContextPastas(); },
                           function () { fnMenuContextPastaPaiAberta(); },
                           function () { fnMenuContextArquivos(); }
                ];
                var arrayJsFuncoes = [
                   function () { fnReinitializeCycle(); },
                   function () { fnReinitializePrettyPhoto(); },
                   function () { fnCriaMenuHorizontal(vprmDiretorioPai); },
                   function () { fnInitializeBreadCrumb(); },
                   function () { vjsBuscaDiretorioFileTree; },
                   function () { fnMenuLixeira(); },
                   function () { fnCriarContextMenu(arrayJsFuncoesContextMenu); },
                   function () { fnIncluiRemoveTimeoutMensagem(html); }
                ];
                fnAjaxListaArquivos(vprmDiretorioPai, arrayJsFuncoes);
            },
            error: function (xhr, errorMessage, thrownError) {
                $('.alert').remove();
                $('#container_principallista').prepend("<div class='alert alert-danger' role='alert' style='margin:10px 0 5px 0'><ul id='erro_post'><li>Ocorreu um erro ao tentar excluir.</li><li>Erro: " + xhr.status + "</li><li>Descrição: " + xhr.statusText + "</li><li>Caso o problema persista, contate o administrador do sistema.</li></ul> <button type='button' class='close' data-dismiss='alert' aria-label='Fechar'><span aria-hidden='true'>×</span></button></div>");
            }
        });
    }
    /*-----------------------------------------------------------*/
    /*----------------Formularios Ajax--------------------*/
    /*----------------Formulario Criar Pasta--------------*/
    function fnReiniciarControleFormCriarPasta(){
        $('#modalBootstrap').on("submit", '#form_criarpasta', function (e) {
            var vjscaminhoPai = jQuery(this).find("#hidCaminhoComp").val();
            var vjsDadosForm = jQuery(this).serialize();
            e.preventDefault();
            jQuery(this).validate({
               rules: {
                    NomePasta: {
                        required: true,
                        minlength: 2,
                        regex: /^[^\\/|:;*?&\"\'<>«»]+$/
                    }
                },
                messages: {
                    NomePasta: {
                        required: "O nome da pasta é obrigatório.",
                        minlength: $.validator.format("A nome da pasta deve conter pelo menos {0} caracteres."),
                        regex: "Os caractere \\ / | : ; * ? & \" \' < > « » não são permitidos."
                      }
                },
                highlight: function (element) {
                    $(element).closest('.form-group').addClass('has-error');
                },
                unhighlight: function (element) {
                    $(element).closest('.form-group').removeClass('has-error');
                },
                errorElement: 'span',
                errorClass: 'help-block',
                errorPlacement: function (error, element) {
                    if (element.parent('.input-group').length) {
                        error.insertAfter(element.parent());
                    } else {
                        error.insertAfter(element);
                    }
                }
            });
            if (!jQuery(this).valid()) return false;
            jQuery.ajax({
                type: "POST",
                url: "GerenciarPasta/CriarPasta",
                data: vjsDadosForm,
                cache: false,
                global: true,
                dataType: 'html',
                beforeSend: function () {
                    $('#modal_container_contents').css("visibility", "hidden");
                    $('#modal_container_resp').empty().append("<div class='alert alert-info' role='alert'><img src='Content/pho_images/phoimg_carregando/loading_circular.gif' /><span class='text_carregando'>Carregando...</span></div>");
                },
                success: function (html) {
                    $('#modal_container_resp').empty().html(html);
                    if(vjscaminhoPai == '/'){
                        var vjsBuscaDiretorioFileTree = fnInitializeFileTree();
                    }
                    else{
                        var vjsBuscaDiretorioFileTree = $('.jqueryFileTree').find('.directory').find('a').each(function () {
                            if ($(this).attr('url') == vjscaminhoPai) {
                                showMyTree($(this).parent(), vjscaminhoPai);
                                return false;
                            }
                        });
                    }
                    var arrayJsFuncoesContextMenu = [
                        function () { fnMenuContextPastas(); },
                        function () { fnMenuContextPastaPaiAberta(); },
                        function () { fnMenuContextArquivos(); }
                    ];
                    var arrayJsFuncoes = [
                        function () { fnReinitializeCycle(); },
                        function () { fnReinitializePrettyPhoto(); },
                        function () { fnCriaMenuHorizontal(vjscaminhoPai); },
                        function () { fnInitializeBreadCrumb(); },
                        function () { vjsBuscaDiretorioFileTree; },
                        function () { fnCriarContextMenu(arrayJsFuncoesContextMenu); }
                    ];
                    fnAjaxListaArquivos(vjscaminhoPai, arrayJsFuncoes);
                },
                error: function (xhr, errorMessage, thrownError) {
                    $('#modal_container_resp').empty().append("<div class='alert alert-danger' role='alert'><ul id='erro_post'><li>Ocorreu um erro ao carregar as informações.</li><li>Erro: " + xhr.status + "</li><li>Descrição: " + xhr.statusText + "</li><li>Erro Response Text:" + xhr.responseText + "</li><li>Caso o problema persista, contate o administrador do sistema.</li></ul></div>");
                }
            });
            return false;
        });
    }
    /*----------------------------------------------------*/
    /*----------------Formulario Criar Pasta InFileTree--------------*/
    function fnReiniciarControleFormCriarPastaInFileTree() {
        $('#form_criarpastainfiletree').on("submit", function (e) {
            var vjsnomePasta = jQuery(this).find("#NomePasta").val();
            var vjscaminhoPai = jQuery(this).find("#hidCaminhoCriarNovaPasta").val();
            var vjscaminhoDestino = vjscaminhoPai + vjsnomePasta + "/";
            //  var vjscaminhoRetorno = $('#hidCaminhoRetorno').val();
            //var vjscaminhoRetorno = $('#dropdownPastaAtual').data('caminho');
            var vjsCaminhoPastaAtual = $('#hidDiretorioAtual').val();
            var vjsDadosForm = jQuery(this).serialize();
            e.preventDefault();
            jQuery(this).validate({
                rules: {
                    NomePasta: {
                        required: true,
                        minlength: 2,
                        regex: /^[^\\/|:;*?&\"\'<>«»]+$/
                    }
                },
                messages: {
                    NomePasta: {
                        required: "O nome da pasta é obrigatório.",
                        minlength: $.validator.format("A nome da pasta deve conter pelo menos {0} caracteres."),
                        regex: "Os caractere \\ / | : ; * ? & \" \' < > « » não são permitidos."
                    }
                },
                highlight: function (element) {
                  //  $(element).closest('.input-group-btn').addClass('has-error');
                },
                unhighlight: function (element) {
                    $('#container_alertmover').removeClass().addClass('alert alert-info').fadeTo(500, 1);
                    $('#alertmover_content').empty().html("Informe o nome da nova pasta e clique no botão criar.");
                },
                errorElement: 'span',
                errorPlacement: function (error, element) {
                    $('#container_alertmover').removeClass().addClass('alert alert-danger').fadeTo(500, 1);
                    $('#alertmover_content').empty().html(error);
                }
            });
            if (!jQuery(this).valid()) return false;
            jQuery.ajax({
                type: "POST",
                url: "GerenciarPasta/CriarPastaInFileTree",
                data: vjsDadosForm,
                cache: false,
                global: true,
                dataType: 'html',
                beforeSend: function () {
                    $('#btnCriarPastaInFileTree').addClass('disabled');
                    $('#filetree_conteiner_camponovapasta').addClass('wait');
                    $('#btnCancelarCriarPastaInFileTree').addClass('disabled');
                    $('#container_alertmover').removeClass().addClass('alert alert-info').fadeTo(500, 1);
                    $('#alertmover_content').empty().html("<img src='Content/pho_images/phoimg_carregando/loading_circular.gif' /> <span class='text_carregando'>Carregando...</span>");
                },
                success: function (html) {
                    if (vjsCaminhoPastaAtual == '/') {
                        var vjsBuscaDiretorioFileTree = fnInitializeFileTree();
                    }
                    else { //sidebar-content-cloud
                        var vjsBuscaDiretorioFileTree = $('.jqueryFileTree').find('.directory').find("a[url='" + vjsCaminhoPastaAtual + "']").each(function () {
                            if ($(this).attr('url') == vjsCaminhoPastaAtual) {
                                showMyTree($(this).parent(), vjsCaminhoPastaAtual);
                                return false;
                            }
                        });
                    }
                    var arrayJsFuncoesContextMenu = [
                       function () { fnMenuContextPastas(); },
                       function () { fnMenuContextPastaPaiAberta(); },
                       function () { fnMenuContextArquivos(); }
                    ];
                    var arrayJsFuncoes = [
                       function () { fnReinitializeCycle(); },
                       function () { fnReinitializePrettyPhoto(); },
                       function () { fnCriaMenuHorizontal(vjsCaminhoPastaAtual); },
                       function () { fnInitializeBreadCrumb(); },
                       function () { vjsBuscaDiretorioFileTree; },
                       function () { fnCriarContextMenu(arrayJsFuncoesContextMenu); }
                    ];
                    fnAjaxListaArquivos(vjsCaminhoPastaAtual, arrayJsFuncoes);
                    $('#hidCaminhoDestino').val(vjscaminhoDestino);
                    $('#btnCriarPastaInFileTree').removeClass('disabled');
                    var vjsObjPai = $("a[url^='" + vjscaminhoPai + "']").closest('li.filetreemovercopiar.directory');
                    $('#form_criarpastainfiletree').remove();
                    function fnSelecionaPastaCriada() {
                        var vjsPastaAdicionada = $("a[url='" + vjscaminhoPai + vjsnomePasta + "/']").closest('li.filetreemovercopiar.directory');
                        vjsPastaAdicionada.addClass('itemfiletree_selected').removeClass('collapsed').addClass('expanded').append('<ul class="jqueryFileTree"></ul>');
                        vJsAlturaJanela = $("#content-menutree_mover").scrollTop();
                        vJspositionElement = vjsPastaAdicionada.position();
                        vJspositionElementTop = vJspositionElement.top;
                        vJsValorRolagem = vJsAlturaJanela + vJspositionElementTop - 20;
                        $("#content-menutree_mover").animate({ scrollTop: vJsValorRolagem }, 300);
                        $('#filetree_conteiner_camponovapasta').removeClass('wait');
                        $('#btn_moverpastaarquivo').removeClass('disabled');
                        $('#btn_criarPasta_mover').removeClass('disabled');
                    }
                    var arrayJsFuncoes = [
                      function () { fnSelecionaPastaCriada(); }
                    ];
                    fnShowMenuTreeChoose(vjsObjPai, vjscaminhoPai, arrayJsFuncoes);
                    $('#wrapper_alertmover').empty().html(html);
                    setTimeout(function () {
                        $('#container_alertmover').fadeOut(500, function () {
                            $('#lbl_nomepasta_mover').empty().text(vjsnomePasta);
                            $('#container_nomepastadestino').show();
                        });
                    }, 3000);
                },
                error: function (xhr, errorMessage, thrownError) {
                    $('#container_alertmover').removeClass().addClass('alert alert-danger').fadeTo(500, 1);
                    $('#alertmover_content').empty().html(error);
                    $('#btnCriarPastaInFileTree').removeClass('disabled');
                    $('#btnCancelarCriarPastaInFileTree').removeClass('disabled');
                }
            });
            return false;
        });
    }
    /*----------------------------------------------------*/
    /*----------------Formulario Renomear Pasta-------------*/
    function fnReiniciarControleFormRenomearPasta(){
        $('#modalBootstrap').on("submit", '#form_renomearpasta', function (e) {
            var vjscaminhoCompleto = jQuery(this).find("#hidCaminhoComp").val();
            var vjsnomepastaOriginal = jQuery(this).find("#hidPastaOriginal").val();
            var vjsEstadoPasta = jQuery(this).find("#hidEstadoPasta").val();
            var vjsAcaoPagina = jQuery(this).find("#hidAcaoPagina").val();
            var vjsDadosForm = jQuery(this).serialize();
            var vjsCaminhoRetorno = "";
            var vjsPastaRetorno = "";
            e.preventDefault();
            jQuery.validator.addMethod("diferentTo", function (value, element, param) {
                return this.optional(element) || value != $(param).val();
            }, "O nome informado está igual ao nome atual.");
            jQuery(this).validate({
                rules: {
                    NomePasta: {
                        required: true,
                        minlength: 2,
                        diferentTo: "#hidPastaOriginal",
                        regex: /^[^\\/|:;*?&\"\'<>«»]+$/,
                    }
                },
                messages: {
                    NomePasta: {
                        required: "O nome da pasta é obrigatório.",
                        minlength: $.validator.format("A nome da pasta deve conter pelo menos {0} caracteres."),
                        regex: "Os caractere \\ / | : ; * ? & \" \' < > « » não são permitidos.",
                    }
                },
                highlight: function (element) {
                        $(element).closest('.form-group').addClass('has-error');
                },
                unhighlight: function (element) {
                    $(element).closest('.form-group').removeClass('has-error');
                },
                errorElement: 'span',
                errorClass: 'help-block',
                errorPlacement: function (error, element) {
                    if (element.parent('.input-group').length) {
                        error.insertAfter(element.parent());
                    } else {
                        error.insertAfter(element);
                    }
                }
            });
            if (!jQuery(this).valid()) return false;
            jQuery.ajax({
                type: "POST",
                url: "GerenciarPasta/RenomearPasta",
                data: vjsDadosForm,
                cache: false,
                global: true,
                dataType: 'html',
                beforeSend: function () {
                    $('#modal_container_contents').css("visibility", "hidden");
                    $('#modal_container_resp').empty().append("<div class='alert alert-info' role='alert'><img src='Content/pho_images/phoimg_carregando/loading_circular.gif' /><span class='text_carregando'>Carregando...</span></div>");
                },
                success: function (html) {
                    $('#modal_container_resp').empty().html(html);
                    vjsCaminhoRetorno = $('#hidCaminhoRetorno').val();
                    vjsPastaRetorno = $('#hidPastaRetorno').val();
                    if (vjsCaminhoRetorno == '/') {
                        var vjsBuscaDiretorioFileTree = fnInitializeFileTree();
                    }
                    else {
                        function fnBuscaDiretorioFileTree()
                        {
                            $('.jqueryFileTree').find('.directory').find('a').each(function () {
                                if ($(this).attr('url')  == vjsCaminhoRetorno + "/" + vjsnomepastaOriginal + "/") {
                                    if (vjsEstadoPasta == "fechada") {
                                        $(this).text(vjsPastaRetorno);
                                        $(this).attr('url', vjsCaminhoRetorno + "/" + vjsPastaRetorno + "/");
                                        return false;
                                    }
                                    else{
                                        $(this).text(vjsPastaRetorno);
                                        $(this).attr('url', vjsCaminhoRetorno + "/" + vjsPastaRetorno + "/");
                                        showMyTree($(this).parent(), vjsCaminhoRetorno + "/" + vjsPastaRetorno + "/");
                                        return false;
                                    }
                                }
                            });
                        }
                    }
                    var vjsCaminhoCriarMenuHor = "/";
                    if (vjsEstadoPasta == "fechada") {
                        vjsCaminhoCriarMenuHor = vjsCaminhoRetorno + "/";
                    }
                    else {
                        vjsCaminhoCriarMenuHor = vjsCaminhoRetorno + "/" + vjsPastaRetorno + "/";
                    }
                    switch (vjsAcaoPagina) {
                        case 'uploadarquivo':
                            var folder = vjsCaminhoRetorno + "/" + vjsPastaRetorno + "/"
                            $.ajax({
                                type: 'POST',
                                url: 'GerenciarArquivo/UploadSelecionarArquivos',
                                contentType: 'application/x-www-form-urlencoded;',
                                data: { 'pasta': folder },
                                cache: false,
                                global: true,
                                dataType: 'html',
                                beforeSend: function () {
                                    $('#container_contents').empty().append("<div class='alert alert-info' role='alert'><img src='Content/pho_images/phoimg_carregando/loading_circular.gif' /> <span class='text_carregando'>Carregando...</span></div>");
                                },
                                success: function (html) {
                                    $('#container_contents').empty().html(html);
                                    fnInitializeBreadCrumb();
                                    fnBuscaDiretorioFileTree();
                                    fnReinitializeUploadiFy();
                                },
                                error: function (xhr, errorMessage, thrownError) {
                                    $('#container_contents').empty().append("<div class='alert alert-danger' role='alert'><ul id='erro_post'><li>Ocorreu um erro ao carregar as informações.</li><li>Erro: " + xhr.status + "</li><li>Descrição: " + xhr.statusText + "</li><li>Erro Response Text:" + xhr.responseText + "</li><li>Caso o problema persista, contate o administrador do sistema.</li></ul></div>");
                                }
                            });
                            break;
                        default:
                            var arrayJsFuncoesContextMenu = [
                                function () { fnMenuContextPastas(); },
                                function () { fnMenuContextPastaPaiAberta(); },
                                function () { fnMenuContextArquivos(); }
                            ];
                            var arrayJsFuncoes = [
                               function () { fnReinitializeCycle(); },
                               function () { fnReinitializePrettyPhoto(); },
                               function () { fnCriaMenuHorizontal(vjsCaminhoCriarMenuHor); },
                               function () { fnInitializeBreadCrumb(); },
                               function () { fnBuscaDiretorioFileTree(); },
                               function () { fnCriarContextMenu(arrayJsFuncoesContextMenu); }
                            ];
                            if (vjsEstadoPasta == "fechada") {
                               fnAjaxListaArquivos(vjsCaminhoRetorno + "/", arrayJsFuncoes);
                            }
                            else {
                               fnAjaxListaArquivos(vjsCaminhoRetorno + "/" + vjsPastaRetorno + "/", arrayJsFuncoes);
                            }
                    }
                    $(".modal-body #modalSubtitle").html("<ul class='nav nav-pills nav-stacked'><li role='presentation' ><a href='#' style='color: #333; font-size:16px;'>" + vjsPastaRetorno + "</a></li></ul>");
                    $(".modal-body #hidCaminhoComp").val(vjsCaminhoRetorno + "/" + vjsPastaRetorno + "/");
                    $(".modal-body #hidPastaOriginal").val(vjsPastaRetorno);
                    $(".modal-body #NomePasta").val(vjsPastaRetorno);
                },
                error: function (xhr, errorMessage, thrownError) {
                    $('#modal_container_resp').empty().append("<div class='alert alert-danger' role='alert'><ul id='erro_post'><li>Ocorreu um erro ao carregar as informações.</li><li>Erro: " + xhr.status + "</li><li>Descrição: " + xhr.statusText + "</li><li>Erro Response Text:" + xhr.responseText + "</li><li>Caso o problema persista, contate o administrador do sistema.</li></ul></div>");
                }
            });
            return false;
        });
    }
    /*----------------------------------------------------*/
    /*----------------Formulario Renomear Arquivo-------------*/
    function fnReiniciarControleFormRenomearArquivo(){
        $('#modalBootstrap').on("submit", '#form_renomeararquivo', function (e) {
            var vjscaminhoCompleto = jQuery(this).find("#hidCaminhoComp").val();
            var vjsnomeArquivoOriginal = jQuery(this).find("#hidArquivoOriginal").val();
            var vjsDadosForm = jQuery(this).serialize();
            var vjsCaminhoRetorno = "";
            var vjsArquivoRetorno = "";
            var vjsArquivoExtencao = "";
            e.preventDefault();
            jQuery.validator.addMethod("diferentTo", function (value, element, param) {
                return this.optional(element) || value != $(param).val();
            }, "O nome informado está igual ao nome atual.");
            jQuery(this).validate({
                rules: {
                    NomeArquivo: {
                        required: true,
                        minlength: 2,
                        diferentTo: "#hidArquivoOriginal",
                        regex: /^[^\\/:;,.*?&\"\'<>«»]+$/,
                    }
                },
                messages: {
                    NomeArquivo: {
                        required: "O nome do arquivo é obrigatório.",
                        minlength: $.validator.format("A nome do arquivo deve conter pelo menos {0} caracteres."),
                        regex: "Os caractere \\ / : ; , . * ? & \" \' < > « » não são permitidos.",
                    }
                },
                highlight: function (element) {
                    $(element).closest('.form-group').addClass('has-error');
                },
                unhighlight: function (element) {
                    $(element).closest('.form-group').removeClass('has-error');
                },
                errorElement: 'span',
                errorClass: 'help-block',
                errorPlacement: function (error, element) {
                    if (element.parent('.input-group').length) {
                        error.insertAfter(element.parent());
                    } else {
                        error.insertAfter(element);
                    }
                }
            });
            if (!jQuery(this).valid()) return false;
            jQuery.ajax({
                type: "POST",
                url: "GerenciarArquivo/RenomearArquivo",
                data: vjsDadosForm,
                cache: false,
                global: true,
                dataType: 'html',
                beforeSend: function () {
                    $('#modal_container_contents').css("visibility", "hidden");
                    $('#modal_container_resp').empty().append("<div class='alert alert-info' role='alert'><img src='Content/pho_images/phoimg_carregando/loading_circular.gif' /><span class='text_carregando'>Carregando...</span></div>");
                },
                success: function (html) {
                    $('#modal_container_resp').empty().html(html);
                    vjsCaminhoRetorno = $('#hidCaminhoRetorno').val();
                    vjsArquivoRetorno = $('#hidArquivoRetorno').val();
                    vjsExtencaoRetorno = $('#hidExtencaoRetorno').val();
                    if (vjsCaminhoRetorno == '/') {
                        var vjsBuscaDiretorioFileTree = fnInitializeFileTree();
                    }
                    else {
                        function fnBuscaDiretorioFileTree() {
                            $('.jqueryFileTree').find('.directory').find('a').each(function () {
                                if ($(this).attr('url') == vjsCaminhoRetorno) {
                                  showMyTree($(this).parent(), vjsCaminhoRetorno);
                                  return false;
                                }
                            });
                        }
                    }
                    var arrayJsFuncoesContextMenu = [
                        function () { fnMenuContextPastas(); },
                        function () { fnMenuContextPastaPaiAberta(); },
                        function () { fnMenuContextArquivos(); }
                    ];
                    var arrayJsFuncoes = [
                       function () { fnReinitializeCycle(); },
                       function () { fnReinitializePrettyPhoto(); },
                       function () { fnCriaMenuHorizontal(vjsCaminhoRetorno); },
                       function () { fnInitializeBreadCrumb(); },
                       function () { fnBuscaDiretorioFileTree(); },
                       function () { fnCriarContextMenu(arrayJsFuncoesContextMenu); }
                    ];
                    fnAjaxListaArquivos(vjsCaminhoRetorno, arrayJsFuncoes);
                    $(".modal-body #modalSubtitle").html("<ul class='nav nav-pills nav-stacked'><li role='presentation' ><a href='#' style='color: #333; font-size:16px;'>" + vjsArquivoRetorno + vjsExtencaoRetorno + "</a></li></ul>");
                    $(".modal-body #hidCaminhoComp").val(vjsCaminhoRetorno + vjsArquivoRetorno + vjsExtencaoRetorno);
                    $(".modal-body #hidArquivoOriginal").val(vjsArquivoRetorno);
                    $(".modal-body #hidArquivoExtencao").val(vjsExtencaoRetorno);
                    $(".modal-body #NomeArquivo").val(vjsArquivoRetorno);
                },
                error: function (xhr, errorMessage, thrownError) {
                    $('#modal_container_resp').empty().append("<div class='alert alert-danger' role='alert'><ul id='erro_post'><li>Ocorreu um erro ao carregar as informações.</li><li>Erro: " + xhr.status + "</li><li>Descrição: " + xhr.statusText + "</li><li>Erro Response Text:" + xhr.responseText + "</li><li>Caso o problema persista, contate o administrador do sistema.</li></ul></div>");
                }
            });
            return false;
        });
    }

    /*----------------------------------------------------*/
    /*----------------Botão (undo) desfazer Mover Para--------------*/
    $(".navbar-fixed-top").on("click", "#menutop_desfazerMoverpara_btn", function () {

        var JsonListaPastaArquivoMovidos = {};
        var vjsFormataJson = "";
        if($.cookie('6DCF4293C1633A918B283205FB5A67E5') === null || $.cookie('6DCF4293C1633A918B283205FB5A67E5') === "" || $.cookie('6DCF4293C1633A918B283205FB5A67E5') === undefined)
        {
            $('#menutop_desfazerMoverpara_btn').addClass('disabled');
            $('#menutop_desfazerMoverpara_cont').empty().removeClass("label-info").addClass("label-default").text(0);
            $('#menutop_desfazerMoverpara').fadeOut(500, function () {
                $(this).hide();
            });
            fnCriarDialogHtml_Alert("O tempo para desfazer a ação de mover expirou.","Entendi", null, "");
        } else
        {

            vjsFormataJson = $.cookie("6DCF4293C1633A918B283205FB5A67E5").replace("PasArqMov=", "");
            JsonListaPastaArquivoMovidos = JSON.parse(vjsFormataJson);

            fnCriarModalHtml('N', 'custom-size-modal_600x600');
            $('#modalBootstrap').one('show.bs.modal', function () {
                $(".modal-content #modalBootstrapLabel").text("Desfazer Mover");
                $(".modal-body #modalSubtitle").html("");
                $.ajax({
                    type: 'POST',
                    url: 'Modal/DesfazerMoverPastaArquivoModal',
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify(JsonListaPastaArquivoMovidos),
                    cache: false,
                    global: true,
                    dataType: 'html',
                    beforeSend: function () {
                        $("#modal_container_resp").html("<div class='alert alert-info' role='alert'><img src='Content/pho_images/phoimg_carregando/loading_circular.gif' /> <span class='text_carregando'>Carregando...</span></div>");
                    },
                    success: function (html) {
                        $('#modal_container_resp').empty();
                        $('#modal_container_contents').empty().html(html);
                    },
                    error: function (xhr, errorMessage, thrownError) {
                        $('#modal_container_resp').empty().append("<div class='alert alert-danger' role='alert'><ul id='erro_post'><li>Ocorreu um erro ao carregar as informações.</li><li>Erro: " + xhr.status + "</li><li>Descrição: " + xhr.statusText + "</li><li>Erro Response Text:" + xhr.responseText + "</li><li>Caso o problema persista, contate o administrador do sistema.</li></ul></div>");
                    }
                });
            });
        }
    });
    /*----------------------------------------------------*/
    function fnVerificaItensDesfazerMoverPara() {
        var vjsContTotalSucesso = 0; //parseInt($('#menutop_desfazerMoverpara_cont').text());
        var JsonListaPastaArquivoMovidos = {};
        var vjsFormataJson = "";
        var vjsDataItemMovido = "";

        var vjsDateItemMovido = "";
        var vjsDateAtual = "";
        var vjsDiferencaMilSec = "";

    //    console.log($.cookie("6DCF4293C1633A918B283205FB5A67E5"));
    //    alert("Verificando!")
        //6DCF4293C1633A918B283205FB5A67E5
        if ($.cookie("6DCF4293C1633A918B283205FB5A67E5")) {
            
        //    vjsFormataJson = "{"+$.cookie("6DCF4293C1633A918B283205FB5A67E5").replace("listaPastaArquivoMovidos=", "\"listaPastaArquivoMovidos\":")+"}";
            vjsFormataJson = $.cookie("6DCF4293C1633A918B283205FB5A67E5").replace("PasArqMov=", "");
            JsonListaPastaArquivoMovidos = JSON.parse(vjsFormataJson);

            vjsDataItemMovido = JsonListaPastaArquivoMovidos.DtMovArqPas;
            $.each(JsonListaPastaArquivoMovidos.ListPasArqMov, function (i, itemMovido) {
                vjsContTotalSucesso++;
            });
        }
      //  console.log(vjsContTotalSucesso);
        if (vjsContTotalSucesso > 0) {
            $('#menutop_desfazerMoverpara_btn').removeClass('disabled');
            $('#menutop_desfazerMoverpara_cont').empty().removeClass("label-default").addClass("label-info").text(vjsContTotalSucesso);
            $('#menutop_desfazerMoverpara').show();

            vjsDateItemMovido = new Date(vjsDataItemMovido); 
            vjsDateAtual = new Date();
            vjsDiferencaMilSec = vjsDateAtual.getTime() - vjsDateItemMovido.getTime();

    //        console.log("dateMovida: " + vjsDateItemMovido);
   //         console.log("dateAtual: " + vjsDateAtual);


            vjsDiferencaMilSec = 306000 - vjsDiferencaMilSec // sobra +- 0,1012 (6072) +-  0,1022 (6132)

            console.log("Vai verificar em :" + vjsDiferencaMilSec);

            clearTimeout(vjsVerificaItensDesfazerMoverSetTimeout);

            var vjsVerificaItensDesfazerMoverSetTimeout = setTimeout(function () {
                fnVerificaItensDesfazerMoverPara();
            }, vjsDiferencaMilSec); //
            


        }
        else {
            $('#menutop_desfazerMoverpara_btn').addClass('disabled');
            $('#menutop_desfazerMoverpara_cont').empty().removeClass("label-info").addClass("label-default").text(vjsContTotalSucesso);
            $('#menutop_desfazerMoverpara').fadeOut(500, function () {
                $(this).hide();
            });
                
        }


    }
    /*----------------------------------------------------*/
    fnVerificaItensDesfazerMoverPara();
    /*----------------------------------------------------*/

   

    /*----------------------------------------------------*/
    /*----------------Formulario Mover Para--------------*/
    var xhr;
    function fnReiniciarControleFormMoverPara() {
        $('#modalBootstrap').on("submit", '#form_moverarquivopasta', function (e) {
            var vjscaminhoDestino = jQuery(this).find("#hidCaminhoDestino").val();
            var vjsCaminhoRetorno = "/";
            var vjsCaminhoPastaPai = "/";
            var vjsExtensao = "";
            
            e.preventDefault();
          //  alert(JsonMoverCopiarPara["estadoPasta"]);
            JsonMoverCopiarPara["caminhoAtualDestino"] = vjscaminhoDestino;
            if (!jQuery(this).valid()) return false;
             xhr = jQuery.ajax({
                type: "POST",
                url: "GerenciarPastaArquivo/MoverPastaArquivo",
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(JsonMoverCopiarPara),
                dataType: 'html',
                cache: false,
                global: true,
                beforeSend: function () {
                   
                    var vJsTextoAguarde = $(".modal-content #modalBootstrapLabel").text().replace("Mover", "movendo")
                    $('#modalSubtitle').closest('.col-md-12').find('hr').hide();
                    $('#modalSubtitle').hide();
                    $('#modal_container_contents').hide();
                    $('#modal_container_resp').empty().append("<div class='alert alert-info' role='alert'><img src='Content/pho_images/phoimg_carregando/loading_circular.gif' /><span class='text_carregando'>&nbsp;Aguarde, " + vJsTextoAguarde + "...</span></div>");
                    $('#modalBootstrap').on('hide.bs.modal.prevent', function (e) {
                        e.preventDefault()
                    }); 
                    $('#btn_closeModalBootstrap').addClass('cancelarAjax');
                    fnReinicializaControlesModalCancelaAjax();
                },
                success: function (html) {
                    $('#modal_container_resp').empty().html(html);
                    $('#btn_closeModalBootstrap').removeClass('cancelarAjax');
                    $('#modalBootstrap').off('hide.bs.modal.prevent');
                    vjsCaminhoPastaPai = $('#hidCaminhoPastaPai').val();
                    vjsCaminhoRetorno = $('#hidCaminhoRetorno').val();
                    vjsDirBase = $('#hidDirBase').val();

                    fnReiniciarControleRetornoConflitosMover();
                    if (vjsCaminhoRetorno == '/') {
                        var vjsBuscaDiretorioFileTree = fnInitializeFileTree();
                    }
                    else {
                        function fnBuscaDiretorioFileTree() {
                            var vjsDiretorioEncontrado = "";

                            var JsonListaPastaArquivoMovidos = JSON.parse($('#hidJsonMovidos').val());
                           

                          //  console.log(JsonMoverCopiarPara);
                            $('#sidebar-content-cloud').find('.jqueryFileTree').find('li').find('a').each(function () {
                                var vjsDiretorioAtualVerificacao = $(this);
                                //Recarrega o retorno
                                if ($(this).attr('url') == vjsCaminhoRetorno) {
                                    showMyTree($(this).parent(), vjsCaminhoRetorno);
                                }
                             //   alert("pasta pai: " + vjsCaminhoPastaPai + "\n"+ "destino  : "+vjscaminhoDestino+"\n"+ "this url : " + $(this).attr('url')+"\n");
                                if (vjsCaminhoPastaPai.indexOf(vjscaminhoDestino) >= 0 && $(this).attr('url') == vjscaminhoDestino) {
                                    //Se o destino estiver acima inclui as pastas movidas
                                    vjsDiretorioEncontrado = $(this);
                            
                                    $.each(JsonListaPastaArquivoMovidos.ListPasArqMov, function (i, item) {
                                        vjsExtensao = "";
                                        if (item.TipoArquivoPasta == 'D') {
                                            //            alert(vjsDiretorioEncontrado.attr('url'));
                                          //  alert(item.st);
                                            //////if (vjsDiretorioEncontrado.attr('url') == "/") {
                                            //////    $('#sidebar-content-cloud').find('.jqueryFileTree:first').append("<li class='directory collapsed'><a href='#' url='" + vjscaminhoDestino + item.nomePastaArquivo + "/' data-caminho='" + vjscaminhoDestino + item.nomePastaArquivo + "/'>" + item.nomePastaArquivo + "</a></li>");
                                            //////}
                                            //////else {
                                            vjsDiretorioEncontrado.closest('li').find('.jqueryFileTree:first').append("<li class='directory collapsed' data-origemacesso='1'><a href='#' url='" + vjscaminhoDestino + item.NomePastaArquivo + "/' data-caminho='" + vjscaminhoDestino + item.NomePastaArquivo + "/'>" + item.NomePastaArquivo + "</a></li>");
                                            //////}
                                        }
                                        else if (item.TipoArquivoPasta == 'A') {
                                            vjsExtensao = item.NomePastaArquivo.substring(item.NomePastaArquivo.lastIndexOf('.') + 1);
                                            vjsDiretorioEncontrado.closest('li').find('.jqueryFileTree:first').append("<li class='file ext_" + vjsExtensao + "' data-origemacesso='1'><a href='pho_fotos/" + vjsDirBase + vjscaminhoDestino + item.NomePastaArquivo + "' url='pho_fotos/" + vjsDirBase + vjscaminhoDestino + item.NomePastaArquivo + "' data-caminho='" + vjscaminhoDestino + item.NomePastaArquivo + "' rel='prettyPhoto[gallerytree_" + item.NomePastaArquivo + "]'>" + item.NomePastaArquivo + "</a></li>");
                                        }
                                    });
                                 //   alert('vjsDiretorioEncontrado: ' + vjsDiretorioEncontrado.prop('tagName'));
                    
                                    vjsDiretorioEncontrado.closest('li').find('.jqueryFileTree li a').off('click');

                                    bindMyTree(vjsDiretorioEncontrado.closest('li').find('.jqueryFileTree'));
                                    
                                }
                             //   alert(vjsDiretorioAtualVerificacao.data('caminho'));
                                $.each(JsonListaPastaArquivoMovidos.ListPasArqMov, function (i, item) {
                                //    alert(vjsDiretorioAtualVerificacao.data('caminho') + "\n" + item.caminhoOriginal);
                                    if (vjsDiretorioAtualVerificacao.data('caminho') == item.CaminhoOriginal) {
                                        vjsDiretorioAtualVerificacao.parent('li').remove();
                                    }
                                });
                            });
                            if (vjscaminhoDestino == "/") {

                                $.each(JsonListaPastaArquivoMovidos.ListPasArqMov, function (i, item) {
                                    vjsExtensao = "";
                                    if (item.TipoArquivoPasta == 'D') {
                                        $('#sidebar-content-cloud').find('.jqueryFileTree:first').append("<li class='directory collapsed' data-origemacesso='1'><a href='#' url='" + vjscaminhoDestino + item.NomePastaArquivo + "/' data-caminho='" + vjscaminhoDestino + item.NomePastaArquivo + "/'>" + item.NomePastaArquivo + "</a></li>");
                                    }
                                    else if (item.TipoArquivoPasta == 'A') {
                                        vjsExtensao = item.NomePastaArquivo.substring(item.NomePastaArquivo.lastIndexOf('.') + 1);
                                        $('#sidebar-content-cloud').find('.jqueryFileTree:first').append("<li class='file ext_" + vjsExtensao + "' data-origemacesso='1'><a href='pho_fotos/" + vjsDirBase + vjscaminhoDestino + item.NomePastaArquivo + "' url='pho_fotos/" + vjsDirBase + vjscaminhoDestino + item.NomePastaArquivo + "' data-caminho='" + vjscaminhoDestino + item.NomePastaArquivo + "' rel='prettyPhoto[gallerytree_" + item.NomePastaArquivo + "]'>" + item.NomePastaArquivo + "</a></li>");
                                    }
                                });

                                $('#sidebar-content-cloud').find('.jqueryFileTree:first li a').off('click');
                                bindMyTree($('#sidebar-content-cloud').find('.jqueryFileTree:first'));
                            }
                        }// final fnBuscaDiretorioFileTree()
                       
                    }
                    var arrayJsFuncoesContextMenu = [
                        function () { fnMenuContextPastas(); },
                        function () { fnMenuContextPastaPaiAberta(); },
                        function () { fnMenuContextArquivos(); }
                    ];
                    var arrayJsFuncoes = [
                       function () { fnReinitializeCycle(); },
                       function () { fnReinitializePrettyPhoto(); },
                       function () { fnCriaMenuHorizontal(vjsCaminhoRetorno); },
                       function () { fnInitializeBreadCrumb(); },
                       function () { fnBuscaDiretorioFileTree(); },
                       function () { fnCriarContextMenu(arrayJsFuncoesContextMenu); },
                       function () { fnVerificaItensDesfazerMoverPara(); },
                       function () {fnCriarJsonMoverCopiarPara(null); }
                    ];
                    fnAjaxListaArquivos(vjsCaminhoRetorno, arrayJsFuncoes);
                  //  fnCriarJsonMoverCopiarPara(null);
                },
                error: function (xhr, errorMessage, thrownError) {
                    $('#modal_container_resp').empty().append("<div class='alert alert-danger' role='alert'><ul id='erro_post'><li>Ocorreu um erro ao carregar as informações.</li><li>Erro: " + xhr.status + "</li><li>Descrição: " + xhr.statusText + "</li><li>Erro Response Text:" + xhr.responseText + "</li><li>Caso o problema persista, contate o administrador do sistema.</li></ul></div>");
                    $('#btn_closeModalBootstrap').removeClass('cancelarAjax');
                    $('#modalBootstrap').off('hide.bs.modal.prevent');
                }
            });
            return false;
        });
    }
    /*----------------------------------------------------*/
    /*--------------------Formulario  form_alterarsenhamodal-----*/
    function fnReiniciarControleFormAlterarSenha() {
        $('#modalBootstrap').on("submit", '#form_alterarsenhamodal', function (e) {
            var vjsDadosForm = jQuery(this).serialize();
            var vjsCaminhoRetorno = "";
            var vjsPastaRetorno = "";
            e.preventDefault();
            jQuery.validator.addMethod("equalTo", function (value, element, param) {
                return this.optional(element) || value == $(param).val();
            }, "A confirmação da senha não pode ser diferente.");
            jQuery(this).validate({
                rules: {
                    OldPassword: {
                        required: true
                    },
                    NewPassword: {
                        required: true,
                        minlength: 6
                    },
                    ConfirmPassword: {
                        required: true,
                        equalTo: "#NewPassword"
                    }
                },
                messages: {
                    OldPassword: {
                        required: "A senha atual é obrigatória.",
                    },
                    NewPassword: {
                        required: "A nova senha é obrigatório.",
                        minlength: $.validator.format("A  nova senha deve conter pelo menos {0} caracteres.")
                    },
                    ConfirmPassword: {
                        required: "A confirmação da senha é obrigatória.",
                    }
                },
                highlight: function (element) {
                    $(element).closest('.form-group').addClass('has-error');
                },
                unhighlight: function (element) {
                    $(element).closest('.form-group').removeClass('has-error');
                },
                errorElement: 'span',
                errorClass: 'help-block',
                errorPlacement: function (error, element) {
                    if (element.parent('.input-group').length) {
                        error.insertAfter(element.parent());
                    } else {
                        error.insertAfter(element);
                    }
                }
            });
            if (!jQuery(this).valid()) return false;
            jQuery.ajax({
                type: "POST",
                url: "Manage/ChangePasswordModal",
                data: vjsDadosForm,
                cache: false,
                global: true,
                dataType: 'html',
                beforeSend: function () {
                    $('#modal_container_contents').css("visibility", "hidden");
                    $('#modal_container_resp').empty().append("<div class='alert alert-info' role='alert'><img src='Content/pho_images/phoimg_carregando/loading_circular.gif' /><span class='text_carregando'>Carregando...</span></div>");
                },
                success: function (html) {
                    $('#modal_container_resp').empty().html(html);
                    $('#form_alterarsenhamodal').each(function () {
                        this.reset();
                    });
                },
                error: function (xhr, errorMessage, thrownError) {
                    $('#modal_container_resp').empty().append("<div class='alert alert-danger' role='alert'><ul id='erro_post'><li>Ocorreu um erro ao carregar as informações.</li><li>Erro: " + xhr.status + "</li><li>Descrição: " + xhr.statusText + "</li><li>Erro Response Text:" + xhr.responseText + "</li><li>Caso o problema persista, contate o administrador do sistema.</li></ul></div>");
                }
            });
            return false;
        });
    }
    /*----------------------------------------------------*/
    /*--------------------Formulario  form_fotoperfil-----*/
    function fnReinicializaControlesModal() {
        $('#modalBootstrap').on('hidden.bs.modal', function () {
            $('.validation-summary-errors ul li').hide();
            $('#modal_container_resp').empty();
            $('#modal_container_contents').empty().css("visibility", "visible");
            $("#modalBootstrapLabel").text("");
            $("#modal-container-title").text("");
            $("#modalSubtitle").empty();
            $("#section_modal").empty();
        }).on('close.bs.alert', function () {
            $('#modal_container_resp').empty();
            $('.validation-summary-errors ul li').hide();
            $('#NomePasta').val($('#hidPastaOriginal').val());
            $('#modal_container_contents').css("visibility", "visible");
        })
    }
    /*--------------------------------------------------*/
    function fnReinicializaControlesModalCancelaAjax() {
     //   alert('fnFecharModalCancelaAjax');
        $('#modalBootstrap').on('click', '.cancelarAjax', function (e) {
    //        alert('clicou');
            

            var confirme = confirm("A página ainda está executando a solicitação. Deseja fechar?");
            if (confirme == true) {
                alert('true');
         //           alert('aborta Ajax');
                    xhr.abort();
                    $('#modalBootstrap').modal('hide');

            } 

        });
    }
    /*-------------------------------------------------*/
    /*------------------FINAL CONTROLES MODAL-------------------------*/
    $("#container_contents").on('click', ".checkbox_checked", function (e) {
        if (!$(e.target).hasClass('circlecheckbox') && !$(e.target).hasClass('itemcheckbox')) {
            e.preventDefault();
            e.stopImmediatePropagation();
            $("#contextMenu").hide();
            $(".open").removeClass("open").find('a').attr('aria-expanded', 'false');
            var vjsCheckbox = $(this).find('.circlecheckbox')
            if (vjsCheckbox[0].checked) {
                vjsCheckbox[0].checked = false;
            }
            else {
                vjsCheckbox[0].checked = true;
            }
            fnCheckBoxDiretorioArquivo(vjsCheckbox);
        }
    });
    var vjsTeclaControl = null;
    $(document).on('keyup keydown', function (e) {
        vjsTeclaControl = e.ctrlKey;
    });
    $("#container_contents, #contextMenu_dropdown").on('click', ".folders a,.folders_lista a, .breadcrumb a, #menuContextPastas_abrir, #menuContextPastaPai_recarregar, #breadcrumb_exibirconteudo, #breadcrumb_recarregar, #dropdowngerselec_abrir", function (e) {
         if (!$(e.target).hasClass('circlecheckbox') && !$(e.target).hasClass('itemcheckbox') && !$(this).hasClass('checkbox_checked')) {
             $("#contextMenu").hide();
             $(".open").removeClass("open").find('a').attr('aria-expanded', 'false');
             if (vjsTeclaControl) {
                 e.preventDefault();
                 e.stopImmediatePropagation();
                 var vjsCheckbox = $(this).find('.circlecheckbox')
                 if (vjsCheckbox[0].checked) {
                     vjsCheckbox[0].checked = false;

                 }
                 else {
                     vjsCheckbox[0].checked = true;
                 }
                 fnCheckBoxDiretorioArquivo(vjsCheckbox);
             }
             else
             {
                 var vjsPastaUrl = $(this).data('caminho');
                 if (vjsPastaUrl == '/') {
                     var vjsBuscaDiretorioFileTree = fnInitializeFileTree();
                 }
                 else {
                     var vjsBuscaDiretorioFileTree = $('.jqueryFileTree').find('.directory').find('a').each(function () {

                         if ($(this).attr('url') == vjsPastaUrl) {
                             showMyTree($(this).parent(), vjsPastaUrl);
                             return false;
                         }

                     });
                 }
                 var arrayJsFuncoesContextMenu = [
                            function () { fnMenuContextPastas(); },
                            function () { fnMenuContextPastaPaiAberta(); },
                            function () { fnMenuContextArquivos(); }
                 ];
                 var arrayJsFuncoes = [
                            function () { fnReinitializeCycle(); },
                            function () { fnReinitializePrettyPhoto(); },
                            function () { fnCriaMenuHorizontal(vjsPastaUrl); },
                            function () { fnInitializeBreadCrumb(); },
                            function () { vjsBuscaDiretorioFileTree; },
                            function () { fnCriarContextMenu(arrayJsFuncoesContextMenu); }
                 ];
                 fnAjaxListaArquivos(vjsPastaUrl, arrayJsFuncoes);
             } 
         }
    });
    //--------------------------------------------------------------
    //-------------------CONTEXT MENU------------------------------------------- 
        $.fn.contextMenu = function (settings) {
            $('body').on("contextmenu", function (e) {
                $(settings.menuSelector).hide();
                $(".open").removeClass("open").find('a').attr('aria-expanded', 'false');
            });
            $(this).on("contextmenu", function (e) {
                if (!$(e.target).hasClass('notContext')) {
                    $(".open").removeClass("open").find('a').attr('aria-expanded', 'false');
                    var $menu = $(settings.menuSelector)
                        .data("invokedOn", $(e.target))
                        .before(settings.beforeShow.call("invokedOn", $(this)))
                        .show()
                        .css({
                            position: "absolute",
                            left: getMenuPosition(e.clientX, 'width', 'scrollLeft'),
                            top: getMenuPosition(e.clientY, 'height', 'scrollTop')
                        })
                        .off('click')
                        .on('click', 'a', function (e) {
                            $menu.hide();
                            var $invokedOn = $menu.data("invokedOn");
                            var $selectedMenu = $(e.target);
                            settings.menuSelected.call(this, $invokedOn, $selectedMenu);
                        });
                }
                else {
                    $(settings.menuSelector).hide();
                }
                    return false;
            });
            $('body').click(function () {
                $(settings.menuSelector).hide();
            });
            function getMenuPosition(mouse, direction, scrollDir) {
                var win = $(window)[direction](),
                    scroll = $(window)[scrollDir](),
                    menu = $(settings.menuSelector)[direction](),
                    position = mouse + scroll;
                if (mouse + menu > win && menu < mouse)
                    position -= menu;
                return position;
            }
        };
    //-----------------------Criar ContextMenu--------------------------------------- 
    function fnCriarContextMenu(prmJsFuncoes) {
        $.each(prmJsFuncoes, function (index, execFuncao) {
            execFuncao();
        });
    }
    //-------------------------------------------------------------- 
    //------------------------Preenche Menu de contexto------------- 
    function fnMenuContextPastas() {
        var vjsHtml = "";
        vjsHtml = vjsHtml + "<li>";
        vjsHtml = vjsHtml + "   <div style='margin: 3px;border:1px none #4cff00;'>";
        vjsHtml = vjsHtml + "       <span style='display:block; font-size: 11px; margin:0 0 0 20px; min-width:200px; width:200px; color: #bbb;'>Ações para a pasta:</span>";
        vjsHtml = vjsHtml + "       <span id='menuContextPastas_pasta' style='display:block; margin: 0 20px; font-size: 15px; max-width:200px;font-size: 13px; overflow:hidden; white-space: nowrap; text-overflow: ellipsis;' title=''></span>";
        vjsHtml = vjsHtml + "   </div>";
        vjsHtml = vjsHtml + "</li>";
        vjsHtml = vjsHtml + "<li class='divider'></li>";
        vjsHtml = vjsHtml + "<li><a tabindex='-1' href='#' id='menuContextPastas_abrir' data-caminho=''><i class='fa fa-folder-open-o'>&nbsp;&nbsp;</i>Abrir</a></li>";
        vjsHtml = vjsHtml + "<li><a tabindex='-1' href='#' id='menuContextPastas_renomear' data-toggle='modal' data-target='#modalBootstrap' data-whatever='' data-estadopasta='fechada' data-tipo='D' data-caminho=''><i class='fa fa-pencil'>&nbsp;&nbsp;</i>Renomear</a></li>";
        vjsHtml = vjsHtml + "<li><a tabindex='-1' href='#' id='menuContextPastas_moverpara' data-toggle='modal' data-target='#modalBootstrap' data-nome='' data-estadopasta='fechada' data-tipo='D' data-caminho=''><i class='fa fa-arrows'>&nbsp;&nbsp;</i>Mover Para</a></li>";
        vjsHtml = vjsHtml + "<li><a tabindex='-1' href='#' class='btn disabled' style='text-align: left;'><i class='fa fa-files-o'>&nbsp;&nbsp;</i>Copiar Para</a></li>";
        vjsHtml = vjsHtml + "<li role='separator' class='divider'></li>";
        vjsHtml = vjsHtml + "<li><a tabindex='-1' href='#'  id='menuContextPastas_excluir' data-caminho='' data-caminhopastapai= '' data-whatever='' data-tipo='D' data-estadopasta='fechada' class='btn' style='text-align: left;'><i class='fa fa-trash'>&nbsp;&nbsp;</i>Excluir</a></li>";
        $(".folders, .folders_lista, .directory").contextMenu({
            menuSelector: "#contextMenu",
            menuSelected: function (invokedOn, selectedMenu) {
            },
            beforeShow: function (invokedOn) {
                $("#contextMenu ul").empty().append(vjsHtml);
                if (invokedOn.closest('#container_principallista').length) {
                    $("#menuContextPastas_pasta").attr('title', $.trim(invokedOn.closest('.folders, .folders_lista').find('#tituloPasta, .body_lista_titulo').text()));
                    $("#menuContextPastas_pasta").text($.trim(invokedOn.closest('.folders, .folders_lista').find('#tituloPasta, .body_lista_titulo').text()));
                    $("#menuContextPastas_abrir").data('caminho', invokedOn.find('a').data('caminho'));
                    $("#menuContextPastas_renomear").data('whatever', $.trim(invokedOn.closest('.folders, .folders_lista').find('#tituloPasta, .body_lista_titulo').text()));
                    $("#menuContextPastas_renomear").data('caminho', invokedOn.find('a').data('caminho'));
                    $("#menuContextPastas_moverpara").data('nome', $.trim(invokedOn.closest('.folders, .folders_lista').find('#tituloPasta, .body_lista_titulo').text()));
                    $("#menuContextPastas_moverpara").data('caminho', invokedOn.find('a').data('caminho'));
                    $("#menuContextPastas_excluir").data('caminho', invokedOn.find('a').data('caminho'));
                    $("#menuContextPastas_excluir").data('whatever', $.trim(invokedOn.closest('.folders, .folders_lista').find('#tituloPasta, .body_lista_titulo').text()));
                    $("#menuContextPastas_excluir").data('caminhopastapai', $.trim(invokedOn.closest('#container_principallista').data('caminhopasta')));
                }
                else if (invokedOn.closest('.jqueryFileTree').length) {
                    $("#menuContextPastas_pasta").attr('title', $.trim(invokedOn.closest('.directory').find('a:first').text()));
                    $("#menuContextPastas_pasta").text($.trim(invokedOn.closest('.directory').find('a:first').text()));
                    if (invokedOn.closest('.directory').hasClass('collapsed')) {
                        $("#menuContextPastas_abrir").text("Abrir").prepend("<i class='fa fa-folder-open-o'>&nbsp;&nbsp;</i>");
                        $("#menuContextPastas_renomear").data("estadopasta", "fechada");
                        $("#menuContextPastas_excluir").data("estadopasta", "fechada");
                        $("#menuContextPastas_moverpara").data("estadopasta", "fechada");
                    }
                    else if (invokedOn.closest('.directory').hasClass('expanded')) {
                        $("#menuContextPastas_abrir").text("Recarregar").prepend("<i class='fa fa-refresh'>&nbsp;&nbsp;</i>");
                        $("#menuContextPastas_renomear").data("estadopasta", "aberta");
                        $("#menuContextPastas_excluir").data("estadopasta", "aberta");
                        $("#menuContextPastas_moverpara").data("estadopasta", "aberta");
                    }
                    $("#menuContextPastas_abrir").data('caminho', invokedOn.find('a:first').data('caminho'));
                    $("#menuContextPastas_renomear").data('whatever', $.trim(invokedOn.closest('.directory').find('a:first').text()));
                    $("#menuContextPastas_renomear").data('caminho', invokedOn.find('a:first').data('caminho'));
                    $("#menuContextPastas_moverpara").data('nome', $.trim(invokedOn.closest('.directory').find('a:first').text()));
                    $("#menuContextPastas_moverpara").data('caminho', invokedOn.find('a:first').data('caminho'));
                    $("#menuContextPastas_excluir").data('caminho', invokedOn.find('a:first').data('caminho'));
                    $("#menuContextPastas_excluir").data('whatever', $.trim(invokedOn.closest('.directory').find('a:first').text()));
                    if (invokedOn.closest('.jqueryFileTree').closest('.expanded').length) {
                        $("#menuContextPastas_excluir").data('caminhopastapai', invokedOn.closest('.jqueryFileTree').closest('.expanded').find('a:first').data('caminho'));
                    }
                    else{
                       $("#menuContextPastas_excluir").data('caminhopastapai', '/');
                    }
                    if (invokedOn.data('origemacesso') == '1') {
                        $("#menuContextPastas_moverpara").data('origemacesso', invokedOn.data('origemacesso'));
                    }
                }
            }
        });
    }
/*--------------------------------------------------*/
    function fnMenuContextPastaPaiAberta() {
        var vjsQtdFolderSelected = parseInt($("#hidQtdFolderSelected").val());
        var vjsQtdFileSelected = parseInt($("#hidQtdFileSelected").val());
        var vjsQtdSomaQtds = 0;
        vjsQtdSomaQtds = parseInt(vjsQtdFolderSelected) + parseInt(vjsQtdFileSelected);
        var vjsHtml = "";
        vjsHtml = vjsHtml + "<li>";
        vjsHtml = vjsHtml + "   <div style='margin: 3px;border:1px none #4cff00;'>";
        vjsHtml = vjsHtml + "       <span style='display:block; font-size: 11px; margin:0 0 0 20px; min-width:200px; width:200px; color: #bbb;'>Ações para a pasta:</span>";
        vjsHtml = vjsHtml + "       <span id='menuContextPastaPai_pasta' style='display:block; margin: 0 20px; font-size: 15px; max-width:200px;font-size: 13px; overflow:hidden; white-space: nowrap; text-overflow: ellipsis;' title=''></span>";
        vjsHtml = vjsHtml + "   </div>";
        vjsHtml = vjsHtml + "</li>";
        vjsHtml = vjsHtml + "<li class='divider'></li>";
        vjsHtml = vjsHtml + "<li><a tabindex='-1' id='menuContextPastaPai_criarpasta' href='#' rel='' title='Criar Pasta' data-toggle='modal' data-target='#modalBootstrap' data-whatever=''><i class='fa fa-folder-open-o'>&nbsp;&nbsp;</i>Criar Pasta</a></li>";
        vjsHtml = vjsHtml + "<li><a tabindex='-1' id='menuContextPastaPai_carregararquivos' href='#' rel='' style='text-align: left;'><i class='fa fa-upload'>&nbsp;&nbsp;</i>Carregar Arquivos</a></li>";
        vjsHtml = vjsHtml + "<li role='separator' class='divider'></li>";
        if ($("#checkboxAll").data('qtdcheckitem') > vjsQtdSomaQtds) {
            vjsHtml = vjsHtml + "<li><a tabindex='-1' href='#' id='menuContextPastaPai_selecionartudo' data-view=''><i class='fa fa-check-circle-o'>&nbsp;&nbsp;</i>Selecionar Tudo</a></li>";
        }
        if (vjsQtdSomaQtds > 0) {
            vjsHtml = vjsHtml + "<li><a tabindex='-1' href='#' id='menuContextPastaPai_limpartudo' data-view=''><i class='fa fa-circle-thin'>&nbsp;&nbsp;</i>Limpar Seleção</a></li>";
        }
        if ($("#checkboxAll").data('qtdcheckitem') > vjsQtdSomaQtds || vjsQtdSomaQtds > 0) {
            vjsHtml = vjsHtml + "<li class='divider'></li>";
        }
        vjsHtml = vjsHtml + "<li><a tabindex='-1' href='#' id='menuContextPastaPai_recarregar' data-caminho=''><i class='fa fa-refresh'>&nbsp;&nbsp;</i>Recarregar</a></li>";
        $("#container_principallista").contextMenu({
            menuSelector: "#contextMenu",
            menuSelected: function (invokedOn, selectedMenu) {
            },
            beforeShow: function (invokedOn) {
                    $("#contextMenu ul").empty().append(vjsHtml);
                    $("#menuContextPastaPai_pasta").attr('title', $.trim(invokedOn.data('titulopasta')));
                    $("#menuContextPastaPai_pasta").text($.trim(invokedOn.data('titulopasta')));
                    $("#menuContextPastaPai_selecionartudo").data('view', $.trim(invokedOn.data('view')));
                    $("#menuContextPastaPai_limpartudo").data('view', $.trim(invokedOn.data('view')));
                    $("#menuContextPastaPai_criarpasta").data('whatever', $.trim(invokedOn.data('titulopasta')));
                    $("#menuContextPastaPai_criarpasta").attr('rel', invokedOn.data('caminhopasta'));
                    $("#menuContextPastaPai_carregararquivos").attr('rel', invokedOn.data('caminhopasta'));
                    $("#menuContextPastaPai_recarregar").data('caminho', invokedOn.data('caminhopasta'));
            }
        });
    }
    /*--------------------------------------------------*/
    function fnMenuContextArquivos() {
        var vjsHtml = "";
        vjsHtml = vjsHtml + "<li>";
        vjsHtml = vjsHtml + "   <div style='margin: 3px;border:1px none #4cff00;'>";
        vjsHtml = vjsHtml + "       <span style='display:block; font-size: 11px; margin:0 0 0 20px; min-width:200px; width:200px; color: #bbb;'>Ações para o arquivo:</span>";
        vjsHtml = vjsHtml + "       <span id='menuContextArquivos_arquivo' style='display:block; margin: 0 20px; font-size: 15px; max-width:200px;font-size: 13px; overflow:hidden; white-space: nowrap; text-overflow: ellipsis;' title=''></span>";
        vjsHtml = vjsHtml + "   </div>";
        vjsHtml = vjsHtml + "</li>";
        vjsHtml = vjsHtml + "<li class='divider'></li>";
        vjsHtml = vjsHtml + "<li><a tabindex='-1' href='#' url='' id='menuContextArquivos_abrir'rel='prettyPhoto'><i class='fa fa-folder-open-o'>&nbsp;&nbsp;</i>Abrir</a></li>";
        vjsHtml = vjsHtml + "<li><a tabindex='-1' href='#' id='menuContextArquivos_renomear' data-toggle='modal' data-target='#modalBootstrap' data-nomearquivo='' data-tipo='A' data-caminho=''><i class='fa fa-pencil'>&nbsp;&nbsp;</i>Renomear</a></li>";
        vjsHtml = vjsHtml + "<li><a tabindex='-1' href='#' id='menuContextArquivos_moverpara' data-toggle='modal' data-target='#modalBootstrap' data-nome='' data-tipo='A' data-caminho=''><i class='fa fa-arrows'>&nbsp;&nbsp;</i>Mover Para</a></li>";
        vjsHtml = vjsHtml + "<li><a tabindex='-1' href='#' class='btn disabled' style='text-align: left;'><i class='fa fa-files-o'>&nbsp;&nbsp;</i>Copiar Para</a></li>";
        vjsHtml = vjsHtml + "<li role='separator' class='divider'></li>";
        vjsHtml = vjsHtml + "<li><a tabindex='-1' href='#'  id='menuContextArquivos_excluir' data-caminho='' data-caminhopastapai='' data-whatever='' data-tipo='A'><i class='fa fa-trash'>&nbsp;&nbsp;</i>Excluir</a></li>";
        $(".files, .files_lista, li.file").contextMenu({
            menuSelector: "#contextMenu",
            menuSelected: function (invokedOn, selectedMenu) {
            },
            beforeShow: function (invokedOn) {
                $("#contextMenu ul").empty().append(vjsHtml);
                if (invokedOn.closest('#container_principallista').length)
                {
                    $("#menuContextArquivos_arquivo").attr('title', $.trim(invokedOn.closest('.files, .files_lista').find('#tituloPasta, .body_lista_titulo').text()));
                    $("#menuContextArquivos_arquivo").text($.trim(invokedOn.closest('.files, .files_lista').find('#tituloPasta, .body_lista_titulo').text()));
                    $("#menuContextArquivos_abrir").attr('url', invokedOn.find('a').data('caminho')).attr('href', invokedOn.find('a').attr('href'));
                    $("#menuContextArquivos_renomear").data('nomearquivo', $.trim(invokedOn.closest('.files, .files_lista').find('#tituloPasta, .body_lista_titulo').text()));
                    $("#menuContextArquivos_renomear").data('caminho', invokedOn.find('a').data('caminho'));
                    $("#menuContextArquivos_moverpara").data('nome', $.trim(invokedOn.closest('.files, .files_lista').find('#tituloPasta, .body_lista_titulo').text()));
                    $("#menuContextArquivos_moverpara").data('caminho', invokedOn.find('a').data('caminho'));
                    $("#menuContextArquivos_excluir").data('caminho', invokedOn.find('a').data('caminho'));
                    $("#menuContextArquivos_excluir").data('whatever', $.trim(invokedOn.closest('.files, .files_lista').find('#tituloPasta, .body_lista_titulo').text()));
                    $("#menuContextArquivos_excluir").data('caminhopastapai', $.trim(invokedOn.closest('#container_principallista').attr('data-caminhopasta')));
                }
                else if (invokedOn.closest('.jqueryFileTree').length)
                {
                    $("#menuContextArquivos_arquivo").attr('title', $.trim(invokedOn.find('a:first').text()));
                    $("#menuContextArquivos_arquivo").text($.trim(invokedOn.find('a:first').text()));
                    $("#menuContextArquivos_abrir").attr('url', invokedOn.find('a:first').data('caminho')).attr('href', invokedOn.find('a:first').attr('href'));
                    $("#menuContextArquivos_renomear").data('nomearquivo', $.trim(invokedOn.closest('li.file').find('a:first').text()));
                    $("#menuContextArquivos_renomear").data('caminho', invokedOn.find('a').data('caminho'));
                    $("#menuContextArquivos_moverpara").data('nome', $.trim(invokedOn.closest('li.file').find('a:first').text()));
                    $("#menuContextArquivos_moverpara").data('caminho', invokedOn.find('a').data('caminho'));
                    $("#menuContextArquivos_excluir").data('caminho', invokedOn.find('a').data('caminho'));
                    $("#menuContextArquivos_excluir").data('whatever', $.trim(invokedOn.closest('li.file').find('a:first').text()));
                    $("#menuContextArquivos_excluir").data('caminhopastapai', invokedOn.closest('.jqueryFileTree').closest('.expanded').find('a:first').data('caminho'));
                }
                if (invokedOn.data('origemacesso') == '1') {
                    $("#menuContextArquivos_moverpara").data('origemacesso', invokedOn.data('origemacesso'));
                }
                fnReinitializePrettyPhoto();
            }
        });
    }
    /*--------------------------------------------------*/
    /*--------------------fn Criar Modal Html------------------------------*/
    function fnCriarModalHtml(prmjsStatic,prmClasseTamanho) {
        prmjsStatic = ((prmjsStatic == 'S') ? 'data-backdrop="static"' : '');
        prmClasseTamanho = ((prmClasseTamanho == '' || prmClasseTamanho == null) ? 'custom-size-modal_400x600' : prmClasseTamanho);
        var vhtml = "";
        vhtml += '<div class="modal fade" ' + prmjsStatic + ' id="modalBootstrap" tabindex="-1" role="dialog" aria-labelledby="modalBootstrapLabel">';
        vhtml += '    <div class="modal-dialog modal-sm">';
        vhtml += '        <div class="modal-content ' + prmClasseTamanho + '">';
        vhtml += '            <div class="modal-header">';
        vhtml += '                <button type="button" id="btn_closeModalBootstrap" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
        vhtml += '                <h4 class="modal-title" id="modalBootstrapLabel"></h4>';
        vhtml += '            </div>';
        vhtml += '            <div class="modal-body">';
        vhtml += '                <div class="container-fluid" >';
        vhtml += '                    <div class="row">';
        vhtml += '                        <div class="col-md-12">';
        vhtml += '                            <h4 id="modal-container-title"></h4>';
        vhtml += '                            <div id="modalSubtitle" class="modal-subtitle"></div>';
        vhtml += '                            <hr />';
        vhtml += '                            <div id="modal_container">';
        vhtml += '                                <div id="modal_container_resp"></div>';
        vhtml += '                                <div id="modal_container_contents" style="border:1px none #ff0000;">';
        vhtml += '                                </div>';//<!-- /.modal_container_contents -->
        vhtml += '                            </div>';
        vhtml += '                        </div>';
        vhtml += '                    </div>';
        vhtml += '                </div>';
        vhtml += '            </div>';
        vhtml += '            <div class="modal-footer">';
        vhtml += '            </div>';
        vhtml += '        </div>';//<!-- /.modal-content -->
        vhtml += '    </div>';//<!-- /.modal-dialog -->
        vhtml += '</div>';//<!-- /.modal -->
        $("#section_modal").append(vhtml);
        fnReinicializaControlesModal();
    }
    /*--------------------------------------------------*/
    /*---------fn Criar Dialog Alert Confirm-------------*/
    function fnCriarDialogHtml_Confirm(prmJsMensagem, prmJsFuncoesAoConfirmar, prmJsFuncoesAoCancelar, prmJsFuncoesAoFechar, prmJsClasseCSS) {
        var vhtml = "";
        vhtml += '<div class="modal" data-backdrop="static" id="dialogConfirm">';
        vhtml += '  <div class="modal-dialog-confirm">';
        vhtml += '      <div class="modal-content" data-keyboard="true">';
        vhtml += '          <div class="modal-dialog-header">';
        vhtml += '              <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
        vhtml += '          </div>';
        vhtml += '          <div class="modal-dialog-body" id="dialogConfirm_body">';
        vhtml += '              <div class="container-fluid">'
        vhtml += '              	<div class="row">'
        vhtml += '              		<div class="col-xs-2" id="dialogConfirm_icon"><span class="fa fa-question-circle"></span></div>'
        vhtml += '              		<div class="col-xs-10" id="dialogConfirm_div">' + prmJsMensagem + '</div>'
        vhtml += '              	</div>'
        vhtml += '              </div>'
        vhtml += '          </div>';
        vhtml += '          <div class="modal-footer modal-dialog-footer">';
        vhtml += '          	<button type="button" class="btn btn-sm btn-default btn-photocloud" data-dismiss="modal" id="sim">Sim</button>';
        vhtml += '          	<button type="button" class="btn btn-sm btn-default" data-dismiss="modal" id="nao">Não</button>';
        vhtml += '          </div>';
        vhtml += '      </div>';
        vhtml += '  </div>';
        vhtml += '</div>';
        $("#section_dialog").append(vhtml);
       $('#dialogConfirm').one('shown.bs.modal', function () {
           $(this).find('#sim').focus();
        }).one('hidden.bs.modal', function () {
            if (prmJsFuncoesAoFechar) {
                $.each(prmJsFuncoesAoFechar, function (index, funcao) {
                    funcao();
                });
            }
            $("#section_dialog").empty();
        }).find('.modal-footer button').one('click', function () { 
            var btnAcao = $(this).attr('id');
            if (btnAcao == 'sim') { // CALLBACK AO CONFIRMAR
                if (prmJsFuncoesAoConfirmar) {
                    $.each(prmJsFuncoesAoConfirmar, function (index, funcao) {
                        funcao();
                    });
                }
            } else if (btnAcao == 'nao') { // CALLBACK AO CANCELAR
                if (prmJsFuncoesAoCancelar) {
                    $.each(prmJsFuncoesAoCancelar, function (index, funcao) {
                        funcao();
                    });
                }
            }
            $('#dialogConfirm').modal('hide');
            $("#section_dialog").empty();
        });
        $('#dialogConfirm').modal('show');
    }
    /*--------------------------------------------------*/
    /*---------fn Criar Dialog Alert -------------*/
    function fnCriarDialogHtml_Alert(prmJsMensagem, prmJsTextoBtn, prmJsFuncoesAoFechar, prmJsClasseCSS) {
        if (prmJsTextoBtn == "" || prmJsTextoBtn == null) {
            prmJsTextoBtn = "Ok"
        }
        var vhtml = "";
        vhtml += '<div class="modal" data-backdrop="static" id="dialogAlert">';
        vhtml += '  <div class="modal-dialog-confirm">';
        vhtml += '      <div class="modal-content" data-keyboard="true">';
        vhtml += '          <div class="modal-dialog-header">';
        vhtml += '              <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
        vhtml += '          </div>';
        vhtml += '          <div class="modal-dialog-body" id="dialogAlert_body">';
        vhtml += '              <div class="container-fluid">'
        vhtml += '              	<div class="row">'
        vhtml += '              		<div class="col-xs-2" id="dialogAlert_icon"><span class="fa fa-exclamation-circle"></span></div>'
        vhtml += '              		<div class="col-xs-10" id="dialogAlert_div">' + prmJsMensagem + '</div>'
        vhtml += '              	</div>'
        vhtml += '              </div>'
        vhtml += '          </div>';
        vhtml += '          <div class="modal-footer modal-dialog-footer">';
        vhtml += '          	<button type="button" class="btn btn-sm btn-default btn-photocloud" data-dismiss="modal" id="ok">' + prmJsTextoBtn + '</button>';
        vhtml += '          </div>';
        vhtml += '      </div>';
        vhtml += '  </div>';
        vhtml += '</div>';
        $("#section_dialog").append(vhtml);
        $('#dialogAlert').one('shown.bs.modal', function () {
            $(this).find('#ok').focus();
        }).one('hidden.bs.modal', function () {
            if (prmJsFuncoesAoFechar) {
                $.each(prmJsFuncoesAoFechar, function (index, funcao) {
                    funcao();
                });
            }
            $("#section_dialog").empty();
        });
        $('#dialogAlert').modal('show');
    }
    /*--------------------------------------------------*/
    /*------------------FINAL CONTROLES MODAL-------------------------*/
    /*--------------------------------------------------*/
    /*--------------------------------------------------*/
});