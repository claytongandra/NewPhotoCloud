$(document).ready(function () {
  // #sidebar-content
    function fnInicioConteudo() {
        alert('fnInicioConteudo');
        var arrayJsFuncoes = [
            function () { fnCriaMenuHorizontal('/'); },
            function () { fnReinitializeCycle(); }
        ];


        fnAjaxListaArquivos('/', arrayJsFuncoes);
        //$.ajax({
        //    type: 'POST',
        //    //  url: 'Home/InicioConteudo',
        //    url: 'Home/ListaArquivos/',
        //    contentType: 'application/x-www-form-urlencoded;',
        //    data: { 'pasta': '/' },
        //    cache: false,
        //    global: true,
        //    dataType: 'html',
        //    beforeSend: function () {
        //        $('#container_contents').empty().append("<div class='alert alert-info' role='alert'><img src='Content/pho_images/phoimg_carregando/loading_circular.gif' /> <span class='text_carregando'>Carregando...</span></div>");

        //    },
        //    success: function (html) {
        //        $('#container_contents').empty().html(html);
        //        fnCriaMenuHorizontal('/');
        //        fnReinitializeCycle();
        //    },
        //    error: function (xhr, errorMessage, thrownError) {
        //        $('#container_contents').empty().append("<div class='alert alert-danger' role='alert'><ul id='erro_post'><li>Ocorreu um erro ao carregar as informações.</li><li>Erro: " + xhr.status + "</li><li>Descrição: " + xhr.statusText + "</li><li>Erro Response Text:" + xhr.responseText + "</li><li>Caso o problema persista, contate o administrador do sistema.</li></ul></div>");
        //    }
        //});
    };

    fnCriaMenuHorizontal('/');

    function fnAjaxListaArquivos(prmJsPasta,prmJsFuncoesSucesso) {
        alert(prmJsPasta);
        $.ajax({
            type: 'POST',
            //  url: 'Home/InicioConteudo',
            url: 'Home/ListaArquivos/',
            contentType: 'application/x-www-form-urlencoded;',
            data: { 'pasta': prmJsPasta },
            cache: false,
            global: true,
            dataType: 'html',
            beforeSend: function () {
                $('#container_contents').empty().append("<div class='alert alert-info' role='alert'><img src='Content/pho_images/phoimg_carregando/loading_circular.gif' /> <span class='text_carregando'>Carregando...</span></div>");

            },
            success: function (html) {
                $('#container_contents').empty().html(html);
                $.each(prmJsFuncoesSucesso, function (index, funcao) {
                    alert(index);
                    funcao();
                });
            },
            error: function (xhr, errorMessage, thrownError) {
                $('#container_contents').empty().append("<div class='alert alert-danger' role='alert'><ul id='erro_post'><li>Ocorreu um erro ao carregar as informações.</li><li>Erro: " + xhr.status + "</li><li>Descrição: " + xhr.statusText + "</li><li>Erro Response Text:" + xhr.responseText + "</li><li>Caso o problema persista, contate o administrador do sistema.</li></ul></div>");
            }
        });
    };
    function fnInitializeFileTree() {
      //  alert('fnInitializeFileTree');
        $('#sidebar-content').fileTree({
            root: '',
            script: '/MenuFileTree/Index/',
            expandSpeed: 1000,
            collapseSpeed: 1000,
            multiFolder: false,
            loadMessage: 'Carragando...'
        },
        function (file) { // function h()
          //  alert(file); 
            fnReinitializePrettyPhoto();
        },
       
        function (file, url) { // function i()
         //   alert(file); 
         //   alert(url); 
            if (file == url) {
                fnInicioConteudo();
            } else {
             //   alert("else - file == url");
                $.ajax({
                    type: 'POST',
                    url: 'Home/ListaArquivos',
                    contentType: 'application/x-www-form-urlencoded;',
                    data: { 'pasta': file },
                    cache: false,
                    global: true,
                    dataType: 'html',
                    beforeSend: function () {
                        $('#container_contents').empty().append("<div class='alert alert-info' role='alert'><img src='Content/pho_images/phoimg_carregando/loading_circular.gif' /> <span class='text_carregando'>Carregando...</span></div>");
                    },
                    success: function (html) {
                        $('#container_contents').empty().html(html);
                        fnInitializeBreadCrumb();
                        fnReinitializeCycle();
                        fnReinitializePrettyPhoto();
                        fnCriaMenuHorizontal(file);
                       // fnReinitializeSelectFolders();
                        
                    },
                    error: function (xhr, errorMessage, thrownError) {
                        $('#container_contents').empty().append("<div class='alert alert-danger' role='alert'><ul id='erro_post'><li>Ocorreu um erro ao carregar as informações.</li><li>Erro: " + xhr.status + "</li><li>Descrição: " + xhr.statusText + "</li><li>Erro Response Text:" + xhr.responseText + "</li><li>Caso o problema persista, contate o administrador do sistema.</li></ul></div>");
                    }
                });
            }
            $('html, body').animate({ scrollTop: 0 }, 'slow');
        });
    }

    fnInitializeFileTree();

    /*------------------breadcrumb--------------------------------*/
    function fnInitializeBreadCrumb() {
        $(".breadcrumb li a").on('click', function () {
           // alert($(this).attr('rel'));
            var vjsPastaUrl = $(this).attr('rel');
            $('.jqueryFileTree').find('.directory').find('a').each(function () {
                if ($(this).attr('url') == vjsPastaUrl) {
                    $(this).parent().find('.expanded').find('UL').slideUp({ duration: 1000, easing: null });
                    $(this).parent().find('.expanded').removeClass('expanded').addClass('collapsed');
                    return false;
                }

            });

            $.ajax({
                type: 'POST',
                url: 'Home/ListaArquivos',
                contentType: 'application/x-www-form-urlencoded;',
                data: { 'pasta': $(this).attr('rel') },
                cache: false,
                global: true,
                dataType: 'html',
                beforeSend: function () {
                    $('#container_contents').empty().append("<div class='alert alert-info' role='alert'><img src='Content/pho_images/phoimg_carregando/loading_circular.gif' /> <span class='text_carregando'>Carregando...</span></div>");
                },
                success: function (html) {
                    $('#container_contents').empty().html(html);
                    fnInitializeBreadCrumb();
                    fnReinitializeCycle();
                    fnReinitializePrettyPhoto();
                    fnCriaMenuHorizontal(vjsPastaUrl);
                    //fnReinitializeMenuSubFolders();
                    //fnReinitializeSelectFolders();

                },
                error: function (xhr, errorMessage, thrownError) {
                    $('#container_contents').empty().append("<div class='alert alert-danger' role='alert'><ul id='erro_post'><li>Ocorreu um erro ao carregar as informações.</li><li>Erro: " + xhr.status + "</li><li>Descrição: " + xhr.statusText + "</li><li>Erro Response Text:" + xhr.responseText + "</li><li>Caso o problema persista, contate o administrador do sistema.</li></ul></div>");
                }
            });

        });
    }
    /*--------------------------------------------------*/
    function fnReinitializeCycle() {
        alert('fnReinitializeCycle');
        $('.folders_slide').cycle({
            fx: 'uncover', //scrollUp,
            delay: -2000,
            width: '100%',
            before: function (curr, next, opts) {
                opts.animOut.opacity = 0;
                $('.folders_slide').css("width", "100%");
            },
            after: function (opts) {
                //    alert(opts.width)
            }
        })
    }
    /*--------------------------------------------------*/
    function fnReinitializePrettyPhoto() {
        //   alert('Reinitialize');
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
    /*--------------------------------------------------*/
    //------menu Horizontal --------------------------------------------------------
    function fnCriaMenuHorizontal(vprmCaminhoPasta) {
        alert('fnCriaMenuHorizontal');
        var stringFin = vprmCaminhoPasta.lastIndexOf('/');
        var subString = vprmCaminhoPasta.substring(0, stringFin)
        var stringIni = subString.lastIndexOf('/')+1;
        var nomePasta = vprmCaminhoPasta.substring(stringIni, stringFin)
             
        if (nomePasta === '')
        {
            nomePasta = "[photoCloud]:";
        }

           //alert(vprmCaminhoPasta);

          // alert(nomePasta);

        var vjsHtml = "";
        vjsHtml = vjsHtml + "<li>";
        vjsHtml = vjsHtml + "<a id='rootfolder' href='#' rel='/' title='Pasta Raiz'>";
        vjsHtml = vjsHtml + "<img src='Content/pho_images/phoimg_botoes/imgbtn_cloudfolder.png' />";
        vjsHtml = vjsHtml + "</a>";
        vjsHtml = vjsHtml + "</li>";

        vjsHtml = vjsHtml + "<li>";
        vjsHtml = vjsHtml + "<a id='criarpasta' href='#' rel='" + vprmCaminhoPasta + "' title='Criar Pasta' data-toggle='modal' data-target='#modalCriarPasta' data-whatever='"+nomePasta+"'>";
        vjsHtml = vjsHtml + "<img src='Content/pho_images/phoimg_botoes/imgbtn_criar_branco.png' />";
        vjsHtml = vjsHtml + "<span>Criar Pasta</span>";
        vjsHtml = vjsHtml + "</a>";
        vjsHtml = vjsHtml + "</li>";

        vjsHtml = vjsHtml + "<li>";
        vjsHtml = vjsHtml + "<a id='carregararquivos' href='#' rel='" + vprmCaminhoPasta + "' title='Carregar Arquivos'>";
        vjsHtml = vjsHtml + "<img src='Content/pho_images/phoimg_botoes/imgbtn_carregar_branco.png' />";
        vjsHtml = vjsHtml + "<span>Carregar Arquivos</span>";
        vjsHtml = vjsHtml + "</a>";
        vjsHtml = vjsHtml + "</li>";

        if (vprmCaminhoPasta != "/") {
            vjsHtml = vjsHtml + "<li class='dropdown' id='OpcaoAcoespasta'>";
            vjsHtml = vjsHtml + "<a id='acoespasta' href='#' rel='" + vprmCaminhoPasta + "' title='Ações de Pasta'>";
            vjsHtml = vjsHtml + "<i class='fa fa-caret-down'>&nbsp;&nbsp;</i><span>Ações de Pasta</span>";
            vjsHtml = vjsHtml + "</a>";
            vjsHtml = vjsHtml + "<ul class='dropdown-menu' aria-labelledby='dropdownPastaAtual'>";
            vjsHtml = vjsHtml + "<li><a href='#' data-toggle='modal' data-target='#modalRenomear' data-whatever='"+nomePasta+"'><i class='fa fa-pencil'>&nbsp;&nbsp;</i>Renomear</a></li>";
            vjsHtml = vjsHtml + "<li><a href='#'><i class='fa fa-arrows'>&nbsp;&nbsp;</i>Mover Para</a></li>";
            vjsHtml = vjsHtml + "<li><a href='#'><i class='fa fa-files-o'>&nbsp;&nbsp;</i>Copiar Para</a></li>";
            vjsHtml = vjsHtml + "<li role='separator' class='divider'></li>";
            vjsHtml = vjsHtml + "<li><a href='#'><i class='fa fa-trash'>&nbsp;&nbsp;</i>Excluir</a></li>";
            vjsHtml = vjsHtml + "</ul>";
            vjsHtml = vjsHtml + "</li>";
        }
        vjsHtml = vjsHtml + " <li><input type='hidden' name='hidQtdSelect' id='hidQtdSelect' value='0' /></li>";
        // vjsHtml = vjsHtml + vprmCaminhoPasta
        $("#menuhorizontal").empty().append(vjsHtml);
    }
    /*--------------------------------------------------*/
    /*----- BOTOES MENU HORIZONTAL-----------------------*/

    

    $('#menuhorizontal').on('click', '#rootfolder', function () {
         // alert($(this).attr('rel'));
        var folder = $(this).attr('rel')
        $.ajax({
            type: 'POST',
            url: 'Home/ListaArquivos',
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
                fnCriaMenuHorizontal(folder);
                fnInitializeFileTree();
                fnReinitializePrettyPhoto();
                fnReinitializeCycle();
  
               // fnReinitializeMenuSubFolders();
               // fnReinitializeSelectFolders();


            },
            error: function (xhr, errorMessage, thrownError) {
                $('#container_contents').empty().append("<div class='alert alert-danger' role='alert'><ul id='erro_post'><li>Ocorreu um erro ao carregar as informações.</li><li>Erro: " + xhr.status + "</li><li>Descrição: " + xhr.statusText + "</li><li>Erro Response Text:" + xhr.responseText + "</li><li>Caso o problema persista, contate o administrador do sistema.</li></ul></div>");
            }
        });
    });
    $("#menuhorizontal, #container_contents").on("click", "#criarpasta, #btn_criarPasta", function () {
        var vjsCaminhoCompleto = $(this).attr('rel');
        var vjsPastaAtual = $(this).data('whatever');
       // alert(vjsCaminhoCompleto + " - " + vjsPastaAtual);

        
        $(".modal-body #modalSubtitle").html("<ul class='nav nav-pills nav-stacked'><li role='presentation' ><a href='#' style='color: #333; font-size:16px;'>" + vjsPastaAtual + "</a></li></ul>");
        //$(".modal-body #modalSubtitle").text(vjsPastaAtual);
        $(".modal-body #hidCaminhoComp").val(vjsCaminhoCompleto);
    });

    $('#menuhorizontal').on('click', '#carregararquivos', function () {
        // alert($(this).attr('rel'));
        var folder = $(this).attr('rel')
        $.ajax({
            type: 'POST',
            url: 'Upload/FileUploadForm',
            contentType: 'application/x-www-form-urlencoded;',
            data: { 'pastapai': folder },
            cache: false,
            global: true,
            dataType: 'html',
            beforeSend: function () {
                $('#container_contents').empty().append("<div class='alert alert-info' role='alert'><img src='Content/pho_images/phoimg_carregando/loading_circular.gif' /> <span class='text_carregando'>Carregando...</span></div>");
            },
            success: function (html) {
                $('#container_contents').empty().html(html);
               // fnReinitializeUploadiFy();
            },
            error: function (xhr, errorMessage, thrownError) {
                $('#container_contents').empty().append("<div class='alert alert-danger' role='alert'><ul id='erro_post'><li>Ocorreu um erro ao carregar as informações.</li><li>Erro: " + xhr.status + "</li><li>Descrição: " + xhr.statusText + "</li><li>Erro Response Text:" + xhr.responseText + "</li><li>Caso o problema persista, contate o administrador do sistema.</li></ul></div>");
            }
        });
    });
    /*--------------------------------------------------*/
    /*----------------Formularios Ajax--------------------*/
    jQuery('#form_criarpasta').submit(function () {
        var vjscaminhoPai = jQuery(this).find("#hidCaminhoComp").val()
        var vjsDadosForm = jQuery(this).serialize();

        jQuery.ajax({
            type: "POST",
            url: "GerenciarPasta/CriarPasta",
            data: vjsDadosForm,
            cache: false,
            global: true,
            dataType: 'html',
            beforeSend: function () {
                $('#form_criarpasta').hide();
                $('#modal_container_resp').empty().append("<div class='alert alert-info' role='alert'><img src='Content/pho_images/phoimg_carregando/loading_circular.gif' /><span class='text_carregando'>Carregando...</span></div>");
               
            },
            success: function (html) {
                $('#modal_container_resp').empty().html(html);
               
                $.ajax({
                    type: 'POST',
                    url: 'Home/ListaArquivos',
                    contentType: 'application/x-www-form-urlencoded;',
                    data: { 'pasta': vjscaminhoPai },
                    cache: false,
                    global: true,
                    dataType: 'html',
                    beforeSend: function () {
                        $('#container_contents').empty().append("<div class='alert alert-info' role='alert'><img src='Content/pho_images/phoimg_carregando/loading_circular.gif' /> <span class='text_carregando'>Carregando...</span></div>");
                    },
                    success: function (html) {
                        $('#container_contents').empty().html(html);
                        fnInitializeBreadCrumb();
                        fnReinitializeCycle();
                        fnReinitializePrettyPhoto();
                        fnCriaMenuHorizontal(vjscaminhoPai);
                        //fnReinitializeMenuSubFolders();
                        //fnReinitializeSelectFolders();

                        $('.jqueryFileTree').find('.directory').find('a').each(function () {

                            if ($(this).attr('url') == vjscaminhoPai) {

                                showMyTree($(this).parent(), vjscaminhoPai);
                                return false;
                            }

                        });

                    },
                    error: function (xhr, errorMessage, thrownError) {
                        $('#modal_container_resp').empty().append("<div class='alert alert-danger' role='alert'><ul id='erro_post'><li>Ocorreu um erro ao carregar as informações.</li><li>Erro: " + xhr.status + "</li><li>Descrição: " + xhr.statusText + "</li><li>Erro Response Text:" + xhr.responseText + "</li><li>Caso o problema persista, contate o administrador do sistema.</li></ul></div>");
                    }
                });

            },
            error: function (xhr, errorMessage, thrownError) {
                $('#modal_container').empty().append("<div class='alert alert-danger' role='alert'><ul id='erro_post'><li>Ocorreu um erro ao carregar as informações.</li><li>Erro: " + xhr.status + "</li><li>Descrição: " + xhr.statusText + "</li><li>Erro Response Text:" + xhr.responseText + "</li><li>Caso o problema persista, contate o administrador do sistema.</li></ul></div>");
            }
        });

        return false;
    });
    /*--------------------------------------------------*/
    $('#modalCriarPasta').on('hidden.bs.modal', function () {
        $('#modal_container_resp').empty();
        $('#form_criarpasta').each(function () {
            this.reset();
        }).show();
    })
    /*--------------------------------------------------*/
    $('#modalCriarPasta').on('close.bs.alert', function () {
        $('#modal_container_resp').empty();
        $('#txtNovaPasta').val('');
        $('#form_criarpasta').show();
    })
    /*--------------------------------------------------*/
    

    
    $("#container_contents").on('click', ".folders a, .breadcrumb a", function () {
        //	alert($(this).attr('rel'));
        var vjsPastaUrl = $(this).attr('rel');
        //------------------- Carrega os Conteudos
        $('.jqueryFileTree').find('.directory').find('a').each(function () {

            if ($(this).attr('url') == vjsPastaUrl) {

                showMyTree($(this).parent(), vjsPastaUrl);
                return false;
            }

        });

        $.ajax({
            type: 'POST',
            url: 'Home/ListaArquivos',
            contentType: 'application/x-www-form-urlencoded;',
            data: { 'pasta': vjsPastaUrl },
            cache: false,
            global: true,
            dataType: 'html',
            beforeSend: function () {
                $('#container_contents').empty().append("<div class='alert alert-info' role='alert'><img src='Content/pho_images/phoimg_carregando/loading_circular.gif' /><span class='text_carregando'>Carregando...</span></div>");

            },
            success: function (html) {
                $('#container_contents').empty().html(html);
                fnCriaMenuHorizontal(vjsPastaUrl);
                fnReinitializePrettyPhoto();
                fnReinitializeCycle();
               // fnReinitializeMenuSubFolders();
               // fnReinitializeSelectFolders();

            },
            error: function (xhr, errorMessage, thrownError) {
                $('#container_contents').empty().append("<div class='alert alert-danger' role='alert'><ul id='erro_post'><li>Ocorreu um erro ao carregar as informações.</li><li>Erro: " + xhr.status + "</li><li>Descrição: " + xhr.statusText + "</li><li>Erro Response Text:" + xhr.responseText + "</li><li>Caso o problema persista, contate o administrador do sistema.</li></ul></div>");
            }
        });
        //-------------------  
    });

    //--------------------------------------------------------------

/*--------------------------------------------------*/
});