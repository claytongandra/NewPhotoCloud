// jQuery File Tree Plugin
//
// Version 1.01
//
// Cory S.N. LaViska
// A Beautiful Site (http://abeautifulsite.net/)
// 24 March 2008
//
// Visit http://abeautifulsite.net/notebook.php?article=58 for more information
//
// Usage: $('.fileTreeDemo').fileTree( options, callback )
//
// Options:  root           - root folder to display; default = /
//           script         - location of the serverside AJAX file to use; default = jqueryFileTree.php
//           folderEvent    - event to trigger expand/collapse; default = click
//           expandSpeed    - default = 500 (ms); use -1 for no animation
//           collapseSpeed  - default = 500 (ms); use -1 for no animation
//           expandEasing   - easing function to use on expand (optional)
//           collapseEasing - easing function to use on collapse (optional)
//           multiFolder    - whether or not to limit the browser to one subfolder at a time
//           loadMessage    - Message to display while initial tree loads (can be HTML)
//
// History:
//
// 1.01 - updated to work with foreign characters in directory/file names (12 April 2008)
// 1.00 - released (24 March 2008)
//
// TERMS OF USE
// 
// This plugin is dual-licensed under the GNU General Public License and the MIT License and
// is copyright 2008 A Beautiful Site, LLC. 
//
if (jQuery) (function ($) {

    $.extend($.fn, {
        fileTree: function (o, h, i) {
            // i = 2º funçaõ de callback, j = 3º função de call back
            // Defaults
            if (!o) var o = {};
            if (o.root == undefined) o.root = '/';
            if (o.script == undefined) o.script = 'jqueryFileTree.php';
            if (o.folderEvent == undefined) o.folderEvent = 'click';
            if (o.expandSpeed == undefined) o.expandSpeed = 500;
            if (o.collapseSpeed == undefined) o.collapseSpeed = 500;
            if (o.expandEasing == undefined) o.expandEasing = null;
            if (o.collapseEasing == undefined) o.collapseEasing = null;
            if (o.multiFolder == undefined) o.multiFolder = true;
            if (o.loadMessage == undefined) o.loadMessage = 'Loading...';
            $(this).each(function () {

                function showTree(c, t) {
                    //  alert('o.root: ' + o.root);
                    //  alert('t: ' + t);
                    //   alert('o.script: ' + o.script);
                    // alert('c: '+$(c).html());
                  
                    $(c).addClass('wait');
                   // alert("erro: "+t);
                    $(".jqueryFileTree.start").remove();

                    $.post(o.script, { dir: t }, function (data) {
                        $(c).find('.start').html('');
                        $(c).removeClass('wait').append(data);
                        if (o.root == t) $(c).find('UL:hidden').show(); else $(c).find('UL:hidden').slideDown({ duration: o.expandSpeed, easing: o.expandEasing });
                        bindTree(c);

                        /*------------------------*/
                    }).fail(function (data, textStatus, jqXHR) {
                    //    alert('fail');
                        $(c).removeClass('wait')
                        $(c).html('<ul class="jqueryFileTree start"><li class="warning">Erro ao Carregar Arquivos:</li><li>' + decodeURI(t) + '</li><li>' + jqXHR + '</li><li>' + textStatus + ' - ' + jqXHR.statusText + '</li></ul>');
                        
                        //  alert(' - jqXHR: ' + jqXHR);
                    }).always(function (data, textStatus, jqXHR) {
                        //  alert("finished ---- " + "data: " + $(data).html() + ' - textStatus: ' + textStatus + ' - jqXHR: ' + jqXHR);
                        /*-----------------------*/
                    });



                }

                function bindTree(t) {
                    h($(this).attr('url'));
                    $(t).find('LI A').bind(o.folderEvent, function () {

                        if ($(this).parent().hasClass('directory')) {
                            if ($(this).parent().hasClass('collapsed')) {
                                // Expand
                                if (!o.multiFolder) {
                                    $(this).parent().parent().find('UL').slideUp({ duration: o.collapseSpeed, easing: o.collapseEasing });
                                    $(this).parent().parent().find('LI.directory').removeClass('expanded').addClass('collapsed');
                                }
                                $(this).parent().find('UL').remove(); // cleanup
                                showTree($(this).parent(), escape($(this).attr('url').match(/.*\//)));
                                $(this).parent().removeClass('collapsed').addClass('expanded');
                                //chama função secundaria
                                i($(this).attr('url'),'');
                            } else {
                                // Collapse
                                $(this).parent().find('UL').slideUp({ duration: o.collapseSpeed, easing: o.collapseEasing });
                                $(this).parent().removeClass('expanded').addClass('collapsed');



                                var dirExpanded = $(this).parent().closest('.jqueryFileTree').parent().prop('tagName');
                                var URLdirExpanded = "";

                                if (dirExpanded == "DIV") {
                                    URLdirExpanded = $(this).attr('url'); 
                                }
                                else {
                                    URLdirExpanded = $(this).parent().closest('.jqueryFileTree').parent().find('a').attr('url');
                                }
                                // alert(URLdirExpanded);

                                // j($(this).parent().closest('.jqueryFileTree').parent().find('a').attr('url'), $(this).attr('url'));
                                i(URLdirExpanded, $(this).attr('url'));

                                //   alert($(this).parent().closest('.jqueryFileTree').parent().find('.expanded').prop('tagName'));
                                //   alert($(this).parent().closest('.jqueryFileTree').parent().find('a').attr('url'));
                                //  alert($(this).attr('url'));



                            }
                        } else {
                            //	h($(this).attr('url'));
                        }
                        return false;
                    });
                    // Prevent A from triggering the # on non-click events
                    if (o.folderEvent.toLowerCase != 'click') $(t).find('LI A').bind('click', function () { return false; });
                }
                // Loading message
                $(this).html('<ul class="jqueryFileTree start"><li class="wait">' + o.loadMessage + '<li></ul>');
                // Get the initial file list
                showTree($(this), escape(o.root));
            });
        }
    });

})(jQuery);