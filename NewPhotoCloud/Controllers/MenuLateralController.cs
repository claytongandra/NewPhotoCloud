using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;
using NewPhotoCloud.Repositories;
using System.Text;
using NewPhotoCloud.Models;
using System.IO;

namespace NewPhotoCloud.Controllers
{
    public class MenuLateralController : Controller
    {
        [HttpPost]
        public ActionResult MenuFileTreePrincipal(FormCollection Postpath)
        {
            int _qtdDiretorios = 0;
            int _qtdArquivos = 0;
            string _caminhoSolicitado = Postpath["dir"];
            string _caminhoCompleto = "";
            string _diretorioBaseUsuario = "";


            UsuarioContext usuarioAcesso = new UsuarioContext();

            var _retornoQueryUser = (from usuarioInfoAcesso in usuarioAcesso.CloudUsuariosAcesso
                                     where usuarioInfoAcesso.Uac_UserName == User.Identity.Name
                                     select usuarioInfoAcesso).SingleOrDefault();

            _diretorioBaseUsuario = _retornoQueryUser.Uac_Fk.Usu_DiretorioBase;

            Encoding iso = Encoding.GetEncoding("ISO-8859-1");

            _caminhoSolicitado = HttpUtility.UrlDecode(_caminhoSolicitado, iso);

            _caminhoCompleto = Server.MapPath("~/pho_fotos/" + _diretorioBaseUsuario + "/" + _caminhoSolicitado);


            if (System.IO.File.Exists(_caminhoCompleto))
            {
                return base.File(_caminhoCompleto, "application/octet-stream");
            }
            else if (System.IO.Directory.Exists(_caminhoCompleto))
            {
                try
                {

                    //cria objeto dirListModel do tipo lista do model DirModel (FileTreeModel)
                    List<ListaDiretorios> listaDiretorios = new List<ListaDiretorios>();

                    IEnumerable<string> diretorioLista = Directory.EnumerateDirectories(_caminhoCompleto);

                    foreach (string dir in diretorioLista)
                    {
                        // if (Path.GetFileName(dir) != _diretorioBaseUsuario + "_RECICLE")
                        //{ 
                        DirectoryInfo objdiretorio = new DirectoryInfo(dir);

                        ListaDiretorios diretorio = new ListaDiretorios();

                        diretorio.DiretorioBase = _diretorioBaseUsuario;
                        diretorio.Diretorio = "/" + _caminhoSolicitado + Path.GetFileName(dir) + "/";
                        diretorio.DiretorioNome = Path.GetFileName(dir);
                        diretorio.DiretorioDataAcesso = objdiretorio.LastAccessTime;

                        listaDiretorios.Add(diretorio);
                        _qtdDiretorios++;
                        //}
                    }

                    List<ListaArquivos> listaArquivos = new List<ListaArquivos>();

                    IEnumerable<string> arquivoLista = Directory.EnumerateFiles(_caminhoCompleto);
                    foreach (string arq in arquivoLista)
                    {
                        FileInfo objarquivo = new FileInfo(arq);

                        ListaArquivos arquivo = new ListaArquivos();

                        if (objarquivo.Extension.ToLower() != "php" && objarquivo.Extension.ToLower() != "aspx" && objarquivo.Extension.ToLower() != "asp")
                        {
                            if (_caminhoSolicitado == "" || _caminhoSolicitado == "/")
                            {
                                _caminhoSolicitado = "/";
                                arquivo.ArquivoCaminho = "/";
                            }
                            else
                            {
                                string _pastaPai = _caminhoSolicitado.Substring(1, _caminhoSolicitado.LastIndexOf("/") - 1);

                                arquivo.ArquivoCaminho = _pastaPai.Substring(_pastaPai.LastIndexOf("/") + 1);
                            }

                            arquivo.ArquivoNome = Path.GetFileName(arq);


                            arquivo.ArquivoDiretorio = "pho_fotos/" + _diretorioBaseUsuario + _caminhoSolicitado + Path.GetFileName(arq);
                            arquivo.ArquivoCaminho = _caminhoSolicitado + Path.GetFileName(arq);
                            arquivo.ArquivoDataAcesso = objarquivo.LastAccessTime;
                            arquivo.ArquivoTamanho = (objarquivo.Length < 1024) ? objarquivo.Length.ToString() + " B" : objarquivo.Length / 1024 + " KB";
                            arquivo.ArquivoExtensao = objarquivo.Extension.Replace(@".", @"").ToLower();

                            listaArquivos.Add(arquivo);

                            _qtdArquivos++;
                        }
                    }
                    if (_qtdDiretorios == 0 && _qtdArquivos == 0)
                    {
                        if (_caminhoSolicitado == "")
                        {
                            ViewBag.MessageError = "<li class='info'>Para iniciar crie suas pastas e faça upload de </br>suas imagens e vídeos.</li>";
                        }
                        else
                        {
                            if (_qtdArquivos == 0)
                            {
                                ViewBag.MessageError = "<li>Pasta vazia.</li>";
                            }
                        }

                        return PartialView();
                    }

                    ListaDiretoriosArquivos listaDiretoriosArquivos = new ListaDiretoriosArquivos(listaDiretorios, listaArquivos);

                    return PartialView(listaDiretoriosArquivos);
                }
                catch (Exception ex)
                {
                    ViewBag.MessageError = _caminhoCompleto;
                    return PartialView();
                }
            }
            else
            {
                //  ViewBag.MessageError = "O parâmetro de entrada " + path + " não é um arquivo ou diretório válido.";
                // ViewBag.MessageError = realPath + ": não é um arquivo ou diretório válido.";
                ViewBag.MessageError = "<li class='warning'>Diretório inválido.</li>";
                return PartialView();
                //  return Content(path + " não é um arquivo ou diretório válido.");
            }
        }
        [HttpPost]
        public ActionResult MenuFileTreeMoverCopiar(FormCollection Postpath)
        {
            string _pastaSolicitada = Postpath["dir"];
            
            UsuarioLogado infoUsuarioLogado = new UsuarioLogado();

            var _infoUsuarioLogado = infoUsuarioLogado.GetUsuarioLogado(User.Identity.Name);
            //int prmIdUsuario, string prmDiretorio, string prmTipo, string prmStatus)
            ListaDiretoriosArquivos list_diretoriosArquivos = ListaDiretoriosArquivosBaseDados.RetornaDiretoriosArquivosBaseDados(_infoUsuarioLogado.Usu_Id, _pastaSolicitada, "D", "A");

            return PartialView(list_diretoriosArquivos);

        }
        [HttpPost]
        public ActionResult MenuLixeira(FormCollection Postpath)
        {
            string _pastaSolicitada = Postpath["pasta"];
            // string _pastaAtual = "";
            string _caminhoCompleto = "";
            string _diretorioBaseUsuario = "";

            if (_pastaSolicitada == "" || _pastaSolicitada == null)
            {
                _pastaSolicitada = "Lixeira";
            }

            ViewData["pastaAtual"] = _pastaSolicitada;

            UsuarioContext usuarioAcesso = new UsuarioContext();

            var _retornoQueryUser = (from usuarioInfoAcesso in usuarioAcesso.CloudUsuariosAcesso
                                     where usuarioInfoAcesso.Uac_UserName == User.Identity.Name
                                     select usuarioInfoAcesso).SingleOrDefault();

            _diretorioBaseUsuario = _retornoQueryUser.Uac_Fk.Usu_DiretorioBase;


            _caminhoCompleto = Server.MapPath("~/pho_lixeira/" + _diretorioBaseUsuario + "/");

            if (System.IO.Directory.Exists(_caminhoCompleto))
            {

                List<ListaDiretorios> list_listaDiretorios = new List<ListaDiretorios>();

                IEnumerable<string> diretorioLista = Directory.EnumerateDirectories(_caminhoCompleto);
                foreach (string dir in diretorioLista)
                {
                    DirectoryInfo d = new DirectoryInfo(dir);

                    ListaDiretorios dirModel = new ListaDiretorios();

                    dirModel.DiretorioBase = _diretorioBaseUsuario;
                    dirModel.Diretorio = "/" + Path.GetFileName(dir) + "/";
                    dirModel.DiretorioNome = Path.GetFileName(dir);
                    dirModel.DiretorioDataAcesso = d.LastAccessTime;

                    list_listaDiretorios.Add(dirModel);
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
                        fileModel.ArquivoDiretorio = "pho_lixeira/" + _diretorioBaseUsuario + Path.GetFileName(fil);
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
                return Content("<div class='alert alert-danger' role='alert'>Problemas ao acessar a lixeira. Diretório inválido.</div>");
            }
        }
    }
}