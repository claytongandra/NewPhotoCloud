using NewPhotoCloud.Models;
using NewPhotoCloud.Repositories;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace NewPhotoCloud.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult InicioConteudo()
        {

            return PartialView();
        }

        public ActionResult ListaArquivos()
        {
            return RedirectToAction("Index");
        }

        [HttpPost]
        public ActionResult ListaArquivos(FormCollection Postpath)
        {
            string _caminhoSolicitado = Postpath["pasta"];
            string _pastaAtual = "";
            string _diretorioPai = "";
            string _caminhoCompleto = "";
            string _diretorioBaseUsuario = "";
            int? _idUsuario = null;
            string _cookieViewGridListHash = "";

            ConvertMD5 ConverterMD5 = new ConvertMD5();

             UsuarioContext usuarioAcesso = new UsuarioContext();

            var _retornoQueryUser = (from usuarioInfoAcesso in usuarioAcesso.CloudUsuariosAcesso
                                     where usuarioInfoAcesso.Uac_UserName == User.Identity.Name
                                     select usuarioInfoAcesso).SingleOrDefault();

            _diretorioBaseUsuario = _retornoQueryUser.Uac_Fk.Usu_DiretorioBase;
            _idUsuario = _retornoQueryUser.Uac_Fk.Usu_Id;

            _cookieViewGridListHash = "0000000000" + _idUsuario.ToString();
            _cookieViewGridListHash = _cookieViewGridListHash.Substring(_cookieViewGridListHash.Length - 10);

            _cookieViewGridListHash = ConverterMD5.getMD5Hash(CryptographyRepository.Criptografar("viewgridlist" + _cookieViewGridListHash));

            ViewData["cookieViewGridListHash"] = _cookieViewGridListHash;

            var _viewgridlist = HttpContext.Request.Cookies[_cookieViewGridListHash];

            if (_viewgridlist == null)
            {
                ViewData["viewgridlist"] = "grid";
            }
            else
            {
                ViewData["viewgridlist"] = _viewgridlist.Value.ToString();
            }


            if ((_caminhoSolicitado.LastIndexOf("/") - 1) > 1)
            {
                string _formataBreadcrumb = _caminhoSolicitado.Substring(1, _caminhoSolicitado.LastIndexOf("/") - 1);
                string[] _breadcrumb = _formataBreadcrumb.Split('/');
                ViewData["breadcrumb"] = _breadcrumb;
                ViewData["formataBreadcrumb"] = _formataBreadcrumb;
                ViewData["tamanhoBreadcrumb"] = _formataBreadcrumb.Length;

            }

            _pastaAtual = _caminhoSolicitado.Substring(0, _caminhoSolicitado.LastIndexOf("/"));

            if (_caminhoSolicitado == "/")
            {
                _diretorioPai = "/";
            }
            else{
                _diretorioPai = _pastaAtual.Substring(0, _pastaAtual.LastIndexOf("/"))+"/";
            }
            

            _pastaAtual = _pastaAtual.Substring(_pastaAtual.LastIndexOf("/") + 1);

            if (_diretorioPai == "" || _diretorioPai == null)
            {
                _diretorioPai = "/";
            }            
            
            if (_pastaAtual == "" || _pastaAtual == null)
            {
                _pastaAtual = "[photoCloud:]";
            }

            ViewData["diretorioPai"] = _diretorioPai;
            ViewData["pastaAtual"] = _pastaAtual;
            ViewData["diretorioAtual"] = _caminhoSolicitado;
           
            
           


            _caminhoCompleto = Server.MapPath("~/pho_fotos/" + _diretorioBaseUsuario + "/" + _caminhoSolicitado);

            if (System.IO.File.Exists(_caminhoCompleto))
            {

                //http://stackoverflow.com/questions/1176022/unknown-file-type-mime
                return base.File(_caminhoCompleto, "application/octet-stream");
            }
            else if (System.IO.Directory.Exists(_caminhoCompleto))
            {

                
                List<ListaDiretorios> list_listaDiretorios = new List<ListaDiretorios>();

                IEnumerable<string> diretorioLista = Directory.EnumerateDirectories(_caminhoCompleto);
                foreach (string dir in diretorioLista)
                {
                    //if (Path.GetFileName(dir) != _diretorioBaseUsuario + "_RECICLE")
                    //{
                        DirectoryInfo d = new DirectoryInfo(dir);

                        ListaDiretorios dirModel = new ListaDiretorios();

                        dirModel.DiretorioBase = _diretorioBaseUsuario;
                        dirModel.Diretorio = "/" + _caminhoSolicitado + Path.GetFileName(dir) + "/";
                        dirModel.DiretorioNome = Path.GetFileName(dir);
                        dirModel.DiretorioDataAcesso = d.LastAccessTime;

                        list_listaDiretorios.Add(dirModel);
                    //}
                }

                     int quant = list_listaDiretorios.Count;

                List<ListaArquivos> list_listaArquivos = new List<ListaArquivos>();

                IEnumerable<string> arquivoLista = Directory.EnumerateFiles(_caminhoCompleto);
                foreach (string fil in arquivoLista)
                {
                    FileInfo f = new FileInfo(fil);

                    ListaArquivos fileModel = new ListaArquivos();

                    if (f.Extension.ToLower() != "php" && f.Extension.ToLower() != "aspx" && f.Extension.ToLower() != "asp")
                    {

                        fileModel.ArquivoNome = Path.GetFileName(fil);
                        fileModel.ArquivoDiretorio = "pho_fotos/" + _diretorioBaseUsuario + _caminhoSolicitado + Path.GetFileName(fil);
                        fileModel.ArquivoCaminho = _caminhoSolicitado + Path.GetFileName(fil);
                        fileModel.ArquivoDataAcesso = f.LastAccessTime;
                        fileModel.ArquivoTamanho = (f.Length < 1024) ? f.Length.ToString() + " B" : f.Length / 1024 + " KB";
                        fileModel.ArquivoExtensao = f.Extension.Replace(@".", @"").ToLower();

                        list_listaArquivos.Add(fileModel);
                    }
                }

                ListaDiretoriosArquivos explorerModel = new ListaDiretoriosArquivos(list_listaDiretorios, list_listaArquivos);

                return PartialView(explorerModel);

            }
            else
            {
                return Content("<div class='alert alert-danger' role='alert'>" + _caminhoSolicitado + " não é um arquivo ou diretório válido.</div>");
            }
            

        }
    }
}