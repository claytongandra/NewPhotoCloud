/*
Função: Funções utilizadas para carregar o modal do Bootstrap
Criação:	Lucas Silva - 17/06/2015 - Prj. 6080 - Extrações Dinâmicas - Melhoria na visualização da descrição do campo
Alteração:	
Necessário: <meta http-equiv="x-ua-compatible" content="IE=9">, JQUERY e BOOTSTRAP
*****************************************************************************************************
Exemplos:
	fnModal_IFrame('modalIFrame', 'TÍTULO MODAL', 'url_pagina.asp', 'modal-extragrande', '100pc', 'S', fnAbrir, fnFechar);
	fnModal_DivHtml('modalDivHtml', 'TÍTULO MODAL', '<h3>Conteúdo Modal</p>', 'modal-medio', '250px', 'N', fnAbrir, fnFechar);
	fnModal_DivURL('modalDivUrl', 'TÍTULO MODAL', 'url_pagina.asp', 'modal-grande', '400px', '', fnAbrir, fnFechar, fnErro, fnFinal);
	fnModal_Confirm('modalConfirm', 'Deseja realizar essa ação?', fnConfirmar, fnCancelar, fnFechar);
	fnModal_Alert('modalAlert', 'exclamation', 'Favor preencher o campo "X"', fnFechar);
	fnModal_RetornarObjeto_Modal('modalId');
	fnModal_RetornarObjeto_Body('modalId');
	fnModal_RetornarObjeto_Div('modalId');
	fnModal_RetornarObjeto_IFrame('modalId');
	fnModal_Abrir(fnModal_RetornarObjeto_Modal('modalId'));
	fnModal_Fechar(fnModal_RetornarObjeto_Modal('modalId'));
	fnModal_Remover(fnModal_RetornarObjeto_Modal('modalId'));
*****************************************************************************************************
*/

function fnModal_IFrame(vjsIdModal, vjsTitulo, vjsUrl, vjsLargura, vjsAltura, vjsTravar, vjsFnAoAbrir, vjsFnAoFechar) {
	vjsTravar = ((vjsTravar == 'S') ? 'data-backdrop="static"' : '');

	// ESTILO PERSONALIZADO DO MODAL
	var vestilo = '';
	vestilo += '<style>';
	vestilo += fnModal_EstiloGeral(vjsIdModal, vjsLargura, vjsAltura);
	vestilo += '#' + vjsIdModal + '_iframe {width:100%;border:none;position:relative;}';
	vestilo += '</style>';

	// MONTA O CONTEÚDO DO MODAL
	var vhtml = vestilo;
	vhtml += '<div class="modal fade" ' + vjsTravar + ' id="' + vjsIdModal + '">';
	vhtml += '  <div class="modal-dialog ' + vjsLargura + '">';
	vhtml += '      <div class="modal-content" data-keyboard="true">';
	vhtml += '          <div class="modal-header">';
	vhtml += '              <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>';
	vhtml += ((vjsTitulo != '') ? '<p class="modal-title">' + vjsTitulo + '</p>' : '&nbsp;');
	vhtml += '          </div>';
	vhtml += '          <div class="modal-body" id="' + vjsIdModal + '_body">';
	vhtml += '              <iframe id="' + vjsIdModal + '_iframe"></div>';
	vhtml += '          </div>';
	vhtml += '      </div>';
	vhtml += '  </div>';
	vhtml += '</div>';

	// PREENCHE O CONTEÚDO COM O HTML GERADO
	$("body").append(vhtml);

	// REFERÊNCIA AOS OBJETOS
	var vObjModal = fnModal_RetornarObjeto_Modal(vjsIdModal);
	var vObjIFrame = fnModal_RetornarObjeto_IFrame(vjsIdModal);

	vObjModal.one('shown.bs.modal', function () { // CALLBACK AO CARREGAR MODAL
		if (vjsAltura == '100pc') {
			vObjIFrame.height($(window).height() / 100 * 78); // 78% DA ALTURA VISÍVEL
		} else if (vjsAltura != '') {
			vjsAltura = vjsAltura.replace('px', '');
			vObjIFrame.height(vjsAltura);
		}
		if (vjsFnAoAbrir) {
			vjsFnAoAbrir();
		}
	}).one('hidden.bs.modal', function () { // CALLBACK AO FECHAR
		if (vjsFnAoFechar) {
			vjsFnAoFechar();
		}
		fnModal_Remover(vObjModal); // REMOVER MODAL
	});

	vObjIFrame.load(function () { // CALLBACK AO CARREGAR IFRAME
	}).attr("src", vjsUrl);

	fnModal_Abrir(vObjModal); // ABRIR MODAL

	// REGISTRA O ESC PARA FECHAR
	$(document).keyup(function (e) {
		if (e.keyCode == 27) fnModal_Fechar(vObjModal);
	});
}

function fnModal_DivHtml(vjsIdModal, vjsTitulo, vjsHtml, vjsLargura, vjsAltura, vjsTravar, vjsFnAoAbrir, vjsFnAoFechar) {
	vjsTravar = ((vjsTravar == 'S') ? 'data-backdrop="static"' : '');

	// ESTILO PERSONALIZADO DO MODAL
	var vestilo = '';
	vestilo += '<style>';
	vestilo += fnModal_EstiloGeral(vjsIdModal, vjsLargura, vjsAltura);
	vestilo += '#' + vjsIdModal + '_div {overflow:auto;}';
	vestilo += '</style>';

	// MONTA O CONTEÚDO DO MODAL
	var vhtml = vestilo;
	vhtml += '<div class="modal fade" ' + vjsTravar + ' id="' + vjsIdModal + '">';
	vhtml += '  <div class="modal-dialog ' + vjsLargura + '">';
	vhtml += '      <div class="modal-content" data-keyboard="true">';
	vhtml += '          <div class="modal-header">';
	vhtml += '              <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>';
	vhtml += ((vjsTitulo != '') ? '<p class="modal-title">' + vjsTitulo + '</p>' : '&nbsp;');
	vhtml += '          </div>';
	vhtml += '          <div class="modal-body" id="' + vjsIdModal + '_body">';
	vhtml += '              <div id="' + vjsIdModal + '_div"></div>';
	vhtml += '          </div>';
	vhtml += '      </div>';
	vhtml += '  </div>';
	vhtml += '</div>';

	// PREENCHE O CONTEÚDO COM O HTML GERADO
	$("body").append(vhtml);

	// REFERÊNCIA AOS OBJETOS
	var vObjModal	=	fnModal_RetornarObjeto_Modal(vjsIdModal);
	var vObjDiv		=	fnModal_RetornarObjeto_Div(vjsIdModal);

	vObjModal.one('shown.bs.modal', function () { // CALLBACK AO CARREGAR MODAL
		if (vjsAltura == '100pc') {
			vObjDiv.height($(window).height() / 100 * 78); // 78% DA ALTURA VISÍVEL
		} else if (vjsAltura != '') {
			vjsAltura = vjsAltura.replace('px', '');
			vObjDiv.css({ 'height': vjsAltura });
		}
	}).one('hidden.bs.modal', function () { // CALLBACK AO FECHAR
		if (vjsFnAoFechar) {
			vjsFnAoFechar();
		}
		fnModal_Remover(vObjModal); // REMOVER MODAL
	});

	vObjDiv.html(vjsHtml); // ADICIONA CONTEÚDO HTML

	fnModal_Abrir(vObjModal); // ABRIR MODAL

	// REGISTRA O ESC PARA FECHAR
	$(document).keyup(function (e) {
		if (e.keyCode == 27) fnModal_Fechar(vObjModal);
	});
}

function fnModal_DivURL(vjsIdModal, vjsTitulo, vjsUrl, vjsLargura, vjsAltura, vjsTravar, vjsFnAoAbrir, vjsFnAoFechar, vjsFnErro, vjsFnFinal) {
	vjsTravar = ((vjsTravar == 'S') ? 'data-backdrop="static"' : '');

	// ESTILO PERSONALIZADO DO MODAL
	var vestilo = '';
	vestilo += '<style>';
	vestilo += fnModal_EstiloGeral(vjsIdModal, vjsLargura, vjsAltura);
	vestilo += '#' + vjsIdModal + '_div {overflow:auto;}';
	vestilo += '</style>';

	// MONTA O CONTEÚDO DO MODAL
	var vhtml = vestilo;
	vhtml += '<div class="modal fade" ' + vjsTravar + ' id="' + vjsIdModal + '">';
	vhtml += '  <div class="modal-dialog ' + vjsLargura + '">';
	vhtml += '      <div class="modal-content" data-keyboard="true">';
	vhtml += '          <div class="modal-header">';
	vhtml += '              <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>';
	vhtml += ((vjsTitulo != '') ? '<p class="modal-title">' + vjsTitulo + '</p>' : '&nbsp;');
	vhtml += '          </div>';
	vhtml += '          <div class="modal-body" id="' + vjsIdModal + '_body">';
	vhtml += '              <div id="' + vjsIdModal + '_div"></div>';
	vhtml += '          </div>';
	vhtml += '      </div>';
	vhtml += '  </div>';
	vhtml += '</div>';

	// PREENCHE O CONTEÚDO COM O HTML GERADO
	$("body").append(vhtml);

	// REFERÊNCIA AOS OBJETOS
	var vObjModal	=	fnModal_RetornarObjeto_Modal(vjsIdModal);
	var vObjDiv		=	fnModal_RetornarObjeto_Div(vjsIdModal);

	vObjModal.one('shown.bs.modal', function () { // CALLBACK AO CARREGAR MODAL
		if (vjsAltura == '100pc') {
			vObjDiv.height($(window).height() / 100 * 78); // 78% DA ALTURA VISÍVEL
		} else if (vjsAltura != '') {
			vjsAltura = vjsAltura.replace('px', '');
			vObjDiv.css({ 'height': vjsAltura });
		}
	}).one('hidden.bs.modal', function () { // CALLBACK AO FECHAR
		if (vjsFnAoFechar) {
			vjsFnAoFechar();
		}
		fnModal_Remover(vObjModal); // REMOVER MODAL
	});

	// CARREGA A URL E FAZ OS CALLBACKS
	var jqxhr = $.get(vjsUrl)
	.done(function (vjsRetorno) { // CALLBACK AO CARREGAR
		vObjDiv.html(vjsRetorno);
		if (vjsFnAoAbrir) {
			vjsFnAoAbrir(vjsRetorno);
		}
	})
	.fail(function (vjsRequest, vjsXhr, vjsSettings, vjsThrownError) { // CALLBACK ERRO
		vObjDiv.html(vjsRequest.responseText);
		if (vjsFnErro) {
			vjsFnErro(vjsRequest, vjsXhr, vjsSettings, vjsThrownError);
		}
	})
	.always(function (vjsRetorno) { // CALLBACK SEMPRE EXECUTAR
		if (vjsFnFinal) {
			vjsFnFinal(vjsRetorno);
		}
	});

	fnModal_Abrir(vObjModal); // ABRIR MODAL
	
	// REGISTRA O ESC PARA FECHAR
	$(document).keyup(function (e) {
		if (e.keyCode == 27) fnModal_Fechar(vObjModal);
	});
}

function fnModal_Confirm(vjsIdModal, vjsMensagem, vjsFnAoConfirmar, vjsFnAoCancelar, vjsFnAoFechar) {
	// ESTILO PERSONALIZADO DO MODAL
	var vestilo = '';
	vestilo += '<style>';
	vestilo += '#' + vjsIdModal + ' .modal-dialog{width:450px;margin: 30px auto;}';
	vestilo += '#' + vjsIdModal + ' .modal-body{padding:10px;}';
	vestilo += fnModal_EstiloIcone(vjsIdModal);
	vestilo += fnModal_EstiloRodape(vjsIdModal);
	vestilo += '</style>';

	// MONTA O CONTEÚDO DO MODAL
	var vhtml = vestilo;
	vhtml += '<div class="modal" data-backdrop="static" id="' + vjsIdModal + '">';
	vhtml += '  <div class="modal-dialog">';
	vhtml += '      <div class="modal-content" data-keyboard="true">';
	vhtml += '          <div class="modal-body" id="' + vjsIdModal + '_body">';
	vhtml += '              <div class="container-fluid">'
	vhtml += '              	<div class="row">'
	vhtml += '              		<div class="col-xs-1" id="' + vjsIdModal + '_icon"><span class="glyphicon glyphicon-question-sign"></span></div>'
	vhtml += '              		<div class="col-xs-11" id="' + vjsIdModal + '_div">' + vjsMensagem + '</div>'
	vhtml += '              	</div>'
	vhtml += '              </div>'
	vhtml += '          </div>';
	vhtml += '          <div class="modal-footer">';
	vhtml += '          	<button type="button" class="btn btn-sm btn-primary" data-dismiss="modal" id="sim">Sim</button>';
	vhtml += '          	<button type="button" class="btn btn-sm btn-default" data-dismiss="modal" id="nao">Não</button>';
	vhtml += '          </div>';
	vhtml += '      </div>';
	vhtml += '  </div>';
	vhtml += '</div>';

	// PREENCHE O CONTEÚDO COM O HTML GERADO
	$("body").append(vhtml);

	// REFERÊNCIA AO MODAL
	var vObjModal = fnModal_RetornarObjeto_Modal(vjsIdModal);

	// ADICIONA O CALLBACK AO EXIBIR
	vObjModal.one('shown.bs.modal', function () { // CALLBACK AO CARREGAR
		$(this).find('#sim').focus();
	}).one('hidden.bs.modal', function () { // CALLBACK AO FECHAR
		if (vjsFnAoFechar) {
			vjsFnAoFechar();
		}
		fnModal_Remover(vObjModal); // REMOVER MODAL
	}).find('.modal-footer button').one('click', function () { // CALLBACK AO CANCELAR
		var btnAcao = $(this).attr('id');

		if (btnAcao == 'sim') { // CALLBACK AO CONFIRMAR
			if (vjsFnAoConfirmar) {
				vjsFnAoConfirmar();
			}
		} else if (btnAcao == 'nao') { // CALLBACK AO CANCELAR
			if (vjsFnAoCancelar) {
				vjsFnAoCancelar();
			}
		}
	});

	fnModal_Abrir(vObjModal); // ABRIR MODAL

	// REGISTRA AÇÕES DO TECLADO
	$(document).keyup(function (e) {
		if (e.keyCode == 27 || e.keyCode == 78) { // ESC ou N
			fnModal_Fechar(vObjModal);
		} else if (e.keyCode == 83) { // S
			vObjModal.find('#sim').click();
		}
	});
}

function fnModal_Alert(vjsIdModal, vjsIcone, vjsMensagem, vjsFnAoFechar) {
	// ESTILO PERSONALIZADO DO MODAL
	var vestilo = '';
	vestilo += '<style type="text/css">';
	vestilo += '#'+vjsIdModal+' .modal-dialog{width:450px;margin: 30px auto;}';
	vestilo += fnModal_EstiloIcone(vjsIdModal);
	vestilo += fnModal_EstiloRodape(vjsIdModal);
	vestilo += '</style>';
	
	// MONTA O CONTEÚDO DO MODAL
	var vhtml = vestilo;
	vhtml += '<div class="modal" data-backdrop="static" id="' + vjsIdModal + '">';
	vhtml += '  <div class="modal-dialog">';
	vhtml += '      <div class="modal-content" data-keyboard="true">';
	vhtml += '          <div class="modal-body" id="' + vjsIdModal + '_body">';
	vhtml += '              <div class="container-fluid">';
	vhtml += '              	<div class="row">';
	if(vjsIcone != ''){
		vhtml += '              		<div class="col-xs-1" id="' + vjsIdModal + '_icon">';
		if(vjsIcone == 'info'){
			vhtml += '              		<span class="glyphicon glyphicon-info-sign"></span>';
		}else if(vjsIcone == 'error'){
			vhtml += '              		<span class="glyphicon glyphicon-remove"></span>';
		}else if(vjsIcone == 'exclamation'){
			vhtml += '              		<span class="glyphicon glyphicon-exclamation-sign"></span>';
		}
		vhtml += '              		</div><div class="col-xs-11" id="' + vjsIdModal + '_div"></div>';
	}else{
		vhtml += '              		<div id="' + vjsIdModal + '_div"></div>';
	}
	vhtml += '              	</div>';
	vhtml += '              </div>';
	vhtml += '          </div>';
	vhtml += '          <div class="modal-footer">';
	vhtml += '          	<button type="button" class="btn btn-sm btn-default" data-dismiss="modal" id="ok">OK</button>';
	vhtml += '          </div>';
	vhtml += '      </div>';
	vhtml += '  </div>';
	vhtml += '</div>';
	
	// PREENCHE O CONTEÚDO COM O HTML GERADO
	$("body").append(vhtml);

	// REFERÊNCIA AO MODAL
	var vObjModal	=	fnModal_RetornarObjeto_Modal(vjsIdModal);
	var vObjDiv		=	fnModal_RetornarObjeto_Div(vjsIdModal);
	
	// ADICIONA O CALLBACK AO EXIBIR
	vObjModal.one('shown.bs.modal', function () { // CALLBACK AO CARREGAR
		vObjDiv.html(vjsMensagem);
		vObjModal.find('#ok').focus();
	}).one('hidden.bs.modal', function () { // CALLBACK AO FECHAR
		if (vjsFnAoFechar) {
			vjsFnAoFechar();
		}
		fnModal_Remover(vObjModal); // REMOVER MODAL
	});

	fnModal_Abrir(vObjModal); // ABRIR MODAL
	
	// REGISTRA AÇÕES DO TECLADO
	$(document).keyup(function (e) {
		if (e.keyCode == 27){ // ESC
			fnModal_Fechar(vObjModal);
		}
	});
}

function fnModal_EstiloGeral(vjsIdModal, vjsLargura, vjsAltura) {
	var vArrLargura = vjsLargura.split('|');

	// ESTILO PERSONALIZADO DO MODAL
	var vestilo = '';
	vestilo += '#' + vjsIdModal + ' .modal-dialog{margin: 30px auto;}';
	vestilo += '#' + vjsIdModal + ' .modal-header{background-color:#E6E6E6;padding:8px;-webkit-border-top-left-radius: 5px;-webkit-border-top-right-radius: 5px;-moz-border-radius-topleft: 5px;-moz-border-radius-topright: 5px;border-top-left-radius: 5px;border-top-right-radius: 5px;}';
	vestilo += '#' + vjsIdModal + ' .modal-title{font-weight: bolder;text-align:center;}';
	vestilo += '#' + vjsIdModal + ' .modal-extrapequeno{width:240px;}';
	vestilo += '#' + vjsIdModal + ' .modal-pequeno{width:500px;}';
	vestilo += '#' + vjsIdModal + ' .modal-medio{width:590px;}';
	vestilo += '#' + vjsIdModal + ' .modal-grande{width:790px;}';
	vestilo += '#' + vjsIdModal + ' .modal-extragrande{width:940px;}';
	if (vArrLargura.length > 1) {
		vjsLargura = vArrLargura[0];
		vestilo += '#' + vjsIdModal + ' .modal-personalizado{width:' + (parseInt(vArrLargura[1]) + 40) + 'px;}';
	}
	if (vjsAltura == '100pc') {
		vestilo += '#' + vjsIdModal + ' .modal-content{height:90%;}';
	}

	return vestilo;
}
function fnModal_EstiloIcone(vjsIdModal) {
	// ESTILO PERSONALIZADO DOS ÍCONES
	var vestilo = '';
	vestilo += '#' + vjsIdModal + ' .modal-body #' + vjsIdModal + '_icon{font-size:25px;color:#337AB7;height:50px;line-height:25px;}';
	vestilo += '#' + vjsIdModal + ' .modal-body #' + vjsIdModal + '_icon .glyphicon-info-sign{color:#337AB7;}';
	vestilo += '#' + vjsIdModal + ' .modal-body #' + vjsIdModal + '_icon .glyphicon-exclamation-sign{color:#FA8000;}';
	vestilo += '#' + vjsIdModal + ' .modal-body #' + vjsIdModal + '_icon .glyphicon-remove{color:#FF0000;}';
	vestilo += '#' + vjsIdModal + ' .modal-body #' + vjsIdModal + '_div{min-height:50px;font-weight:550;font-size:14pt;color:gray;line-height:1.2;}';

	return vestilo;
}
function fnModal_EstiloRodape(vjsIdModal) {
	// ESTILO PERSONALIZADO DO RODAPÉ
	var vestilo = '';
	vestilo += '#' + vjsIdModal + ' .modal-footer{padding:5px;}';
	vestilo += '#' + vjsIdModal + ' .modal-footer button{width:80px;line-height:1;}';
	
	return vestilo;
}
function fnModal_RetornarObjeto_Modal(vjsIdModal) { return $('#' + vjsIdModal); }
function fnModal_RetornarObjeto_Body(vjsIdModal) { return $('#' + vjsIdModal + '_body'); }
function fnModal_RetornarObjeto_Div(vjsIdModal) { return $('#' + vjsIdModal + '_div'); }
function fnModal_RetornarObjeto_IFrame(vjsIdModal) { return $('#' + vjsIdModal + '_iframe'); }
function fnModal_Abrir(vObjModal) { vObjModal.modal('show'); }
function fnModal_Fechar(vObjModal) { vObjModal.modal('hide'); }
function fnModal_Remover(vObjModal) { vObjModal.prev("style").remove(); vObjModal.remove(); }