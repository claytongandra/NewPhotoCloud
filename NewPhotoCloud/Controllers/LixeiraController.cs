using NewPhotoCloud.Models;
using NewPhotoCloud.Repositories;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace NewPhotoCloud.Controllers
{
    public class LixeiraController : Controller
    {
        private DiretoriosArquivosContext diretoriosArquivosContex = new DiretoriosArquivosContext();

        // POST: Lixeira/ListaLixeira
        [HttpPost]
        public ActionResult ListaLixeira(FormCollection Postpath)
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
        // POST: Lixeira/MoverParaLixeira
        [HttpPost]
        public ActionResult MoverParaLixeira(FormCollection PostFolder) 
        { 
            string _caminhoOriginal = PostFolder["caminhoPastaArquivo"];
            string _caminhoOriginalFormat = null;
            string _caminhoOriginalCompleto = null;

            string _caminhoLixeiraCompleto = null;
            string _caminhoOriginalMiniCompleto = null;
            string _preservCaminhoOriginalCompleto = null;
            string _preservCaminhoOriginalMiniCompleto = null;
            string _caminhoLixeiraMiniCompleto = null;
            string _caminhoRenomeadoLixeiraMini = null;
            string _caminhoRenomeadoLixeira = null;
            string _caminhoRenomeado = null;
            string _caminhoRenomeadoMini = null;
            string _caminhoDiretorioPai = PostFolder["caminhoDiretorioPai"];
            string _caminhoSemPasta = null;
            string _nomePastaArquivo = PostFolder["nomePastaArquivo"];
            string _tipoPastaArquivo = PostFolder["tipoPastaArquivo"];
            string _diretorioBaseUsuario = null;

            string _strRetornoNomePastaArquivo = null;
            string _retornoMensagem = null;

            bool _pastaArquivoExiste = false;
            bool _pastaArquivoExisteLixeira = false;
            bool _renomeouPastaArquivoLixeira = false;

            int _qtdTotalPastas = 0; 
            int _qtdTotalArquivos = 0;
            
            var arrayCaminhoOriginal = _caminhoOriginal.Split(',');
            var arraynomePastaArquivo = _nomePastaArquivo.Split(',');
            var arraytipoPastaArquivo = _tipoPastaArquivo.Split(',');
            

            UsuarioContext usuarioAcesso = new UsuarioContext();

            var _retornoQueryUser = (from usuarioInfoAcesso in usuarioAcesso.CloudUsuariosAcesso
                                     where usuarioInfoAcesso.Uac_UserName == User.Identity.Name
                                     select usuarioInfoAcesso).SingleOrDefault();

            _diretorioBaseUsuario = _retornoQueryUser.Uac_Fk.Usu_DiretorioBase;

            Encoding iso = Encoding.GetEncoding("ISO-8859-1");



            diretoriosArquivosContex.Configuration.AutoDetectChangesEnabled = false;
            
            for (int i = 0; i < arrayCaminhoOriginal.Length; i++)
            {
                 _caminhoOriginal = arrayCaminhoOriginal[i].Trim();
                 _nomePastaArquivo = arraynomePastaArquivo[i].Trim();
                 _tipoPastaArquivo = arraytipoPastaArquivo[i].Trim().ToUpper();

                 _caminhoOriginal = HttpUtility.UrlDecode(_caminhoOriginal, iso);

                 _caminhoSemPasta = _caminhoOriginal.Substring(0, _caminhoOriginal.LastIndexOf("/"));


                 _caminhoSemPasta = _caminhoSemPasta.Substring(0, _caminhoSemPasta.LastIndexOf("/"));

                 _caminhoOriginalFormat = _caminhoOriginal.Substring(0, _caminhoOriginal.LastIndexOf("/"));
           
                using (var trans = diretoriosArquivosContex.Database.BeginTransaction(IsolationLevel.ReadCommitted))
                {

                    try
                    {
                            _caminhoOriginalCompleto = Server.MapPath("~/pho_fotos/" + _diretorioBaseUsuario + _caminhoOriginalFormat);
                            _caminhoOriginalMiniCompleto = Server.MapPath("~/pho_fotos_miniatura/" + _diretorioBaseUsuario + _caminhoOriginalFormat);

                    }
                    catch (Exception e)
                    {
                        trans.Rollback();
                        ViewBag.Message = "Falha ao configurar caminhos originais do arquivo: <strong>" + _nomePastaArquivo + "</strong>. Item não excluido.";
                        ViewBag.Status = -1;
                        ViewBag.CaminhoRetorno = _caminhoDiretorioPai;
                        ViewBag.NomePastaArquivo = _nomePastaArquivo;
                        return PartialView();
                    }

                    try
                    {
                        _caminhoLixeiraCompleto = Server.MapPath("~/pho_lixeira/" + _diretorioBaseUsuario + "/" + _nomePastaArquivo);
                        _caminhoLixeiraMiniCompleto = Server.MapPath("~/pho_lixeira_miniatura/" + _diretorioBaseUsuario + "/" + _nomePastaArquivo);
                  
                    }
                    catch (Exception e)
                    {
                        trans.Rollback();
                        ViewBag.Message = "Falha ao configurar caminhos de destino do arquivo: <strong>" + _nomePastaArquivo + "</strong>. Item não excluido.";
                        ViewBag.Status = -1;
                        ViewBag.CaminhoRetorno = _caminhoDiretorioPai;
                        ViewBag.NomePastaArquivo = _nomePastaArquivo;
                        return PartialView();
                    }
                    if (_tipoPastaArquivo.Trim().ToUpper() == "D")
                    {
                        _pastaArquivoExiste = Directory.Exists(_caminhoOriginalCompleto);
                        _pastaArquivoExisteLixeira = Directory.Exists(_caminhoLixeiraCompleto);
                        _qtdTotalPastas++;
                    }
                    else if (_tipoPastaArquivo.Trim().ToUpper() == "A")
                    {
                        _pastaArquivoExiste = System.IO.File.Exists(_caminhoOriginalCompleto);
                        _pastaArquivoExisteLixeira = System.IO.File.Exists(_caminhoLixeiraCompleto);
                        _qtdTotalArquivos++;
                    }
                    else 
                    {
                        trans.Rollback();
                        ViewBag.Message = "Falha ao identificar o tipo do item: <strong>" + _nomePastaArquivo + "</strong>.";
                        ViewBag.Status = -1;
                        ViewBag.CaminhoRetorno = _caminhoDiretorioPai;
                        ViewBag.NomePastaArquivo = _nomePastaArquivo;
                        return PartialView();
                    }

                    if (_pastaArquivoExiste)
                    {
                        if (_pastaArquivoExisteLixeira)
                        {
                            int loop = 2;

                            try
                            {
                                _preservCaminhoOriginalCompleto  = _caminhoOriginalCompleto;
                                _preservCaminhoOriginalMiniCompleto = _caminhoOriginalMiniCompleto;

                                if (_tipoPastaArquivo == "D")
                                {
                                    _caminhoRenomeado = _caminhoOriginalCompleto + " (" + loop + ")";
                                    _caminhoRenomeadoMini = _caminhoOriginalMiniCompleto + " (" + loop + ")";

                                    _caminhoRenomeadoLixeiraMini = _caminhoLixeiraMiniCompleto + " (" + loop + ")";
                                    _caminhoRenomeadoLixeira = _caminhoLixeiraCompleto + " (" + loop + ")";

                                    while (Directory.Exists(_caminhoRenomeadoLixeira))
                                    {
                                        loop++;
                                        _caminhoRenomeado = _caminhoOriginalCompleto + " (" + loop + ")";
                                        _caminhoRenomeadoMini = _caminhoOriginalMiniCompleto + " (" + loop + ")";

                                        _caminhoRenomeadoLixeira = _caminhoLixeiraCompleto + " (" + loop + ")";
                                        _caminhoRenomeadoLixeiraMini = _caminhoLixeiraMiniCompleto + " (" + loop + ")";

                                    }
                                }
                                else if (_tipoPastaArquivo == "A")
                                {

                                    FileInfo f = new FileInfo(_caminhoOriginalCompleto);
                                    _caminhoRenomeado = _caminhoOriginalCompleto.Substring(0, _caminhoOriginalCompleto.LastIndexOf(f.Extension)) + "_(" + loop + ")" + f.Extension;
                                    _caminhoRenomeadoMini = _caminhoOriginalMiniCompleto.Substring(0, _caminhoOriginalMiniCompleto.LastIndexOf(f.Extension)) + "_(" + loop + ")" + f.Extension;

                                    _caminhoRenomeadoLixeiraMini = _caminhoLixeiraMiniCompleto.Substring(0, _caminhoLixeiraMiniCompleto.LastIndexOf(f.Extension)) + "_(" + loop + ")" + f.Extension;
                                    _caminhoRenomeadoLixeira = _caminhoLixeiraCompleto.Substring(0, _caminhoLixeiraCompleto.LastIndexOf(f.Extension)) + "_(" + loop + ")" + f.Extension;

                                    while ( System.IO.File.Exists(_caminhoRenomeadoLixeira))
                                    {
                                        loop++;
                                        _caminhoRenomeado = _caminhoOriginalCompleto.Substring(0, _caminhoOriginalCompleto.LastIndexOf(f.Extension)) + "_(" + loop + ")" + f.Extension;
                                        _caminhoRenomeadoMini = _caminhoOriginalMiniCompleto.Substring(0, _caminhoOriginalMiniCompleto.LastIndexOf(f.Extension)) + "_(" + loop + ")" + f.Extension;

                                        _caminhoRenomeadoLixeira = _caminhoLixeiraCompleto.Substring(0, _caminhoLixeiraCompleto.LastIndexOf(f.Extension)) + "_(" + loop + ")" + f.Extension;
                                        _caminhoRenomeadoLixeiraMini = _caminhoLixeiraMiniCompleto.Substring(0, _caminhoLixeiraMiniCompleto.LastIndexOf(f.Extension)) + "_(" + loop + ")" + f.Extension;

                                    }
                                }
                                System.IO.Directory.Move(@_caminhoOriginalCompleto, @_caminhoRenomeado);
                                System.IO.Directory.Move(@_caminhoOriginalMiniCompleto, @_caminhoRenomeadoMini);

                                _caminhoOriginalCompleto = _caminhoRenomeado;
                                _caminhoOriginalMiniCompleto = _caminhoRenomeadoMini;
                                _caminhoLixeiraCompleto = _caminhoRenomeadoLixeira;
                                _caminhoLixeiraMiniCompleto = _caminhoRenomeadoLixeiraMini;

                                _renomeouPastaArquivoLixeira = true;
                            }
                            catch (Exception e)
                            {
                                trans.Rollback();
                                ViewBag.Message = "Falha ao tentar renomear <strong>" + _nomePastaArquivo + "</strong>";
                                ViewBag.Status = -1;
                                ViewBag.CaminhoRetorno = _caminhoDiretorioPai;
                                ViewBag.NomePastaArquivo = _nomePastaArquivo;
                                return PartialView();
                            }
                        }

                        string _nomeLixeira = Path.GetFileName(_caminhoOriginalCompleto); 
                        try
                        {
                            var _retornoQueryDiretorioArquivo = (from dirArquiInfo in diretoriosArquivosContex.CloudDiretoriosArquivos
                                                                where dirArquiInfo.Dia_Nome == _nomePastaArquivo
                                                                && dirArquiInfo.Dia_CaminhoAtual == _caminhoSemPasta + "/"
                                                                && dirArquiInfo.Dia_Fk_Usu_id == _retornoQueryUser.Uac_Fk.Usu_Id
                                                                select dirArquiInfo).AsNoTracking().SingleOrDefault();

                            var diretoriosArquivos = new NewPhotoCloudDiretoriosArquivos
                            {

                                Dia_Id = _retornoQueryDiretorioArquivo.Dia_Id,
                                Dia_Fk_Usu_id = _retornoQueryUser.Uac_Fk.Usu_Id,
                                Dia_Nome = _nomePastaArquivo,
                                Dia_NomeLixeira = _nomeLixeira,
                                Dia_CaminhoOriginal = _retornoQueryDiretorioArquivo.Dia_CaminhoAtual,
                                Dia_CaminhoAtual = "/Lixeira/",
                                Dia_Tipo = _retornoQueryDiretorioArquivo.Dia_Tipo,
                                Dia_DataCriacao = _retornoQueryDiretorioArquivo.Dia_DataCriacao,
                                Dia_DataExclusao = DateTime.Now.ToUniversalTime(),
                                Dia_Status = "E"
                            };

                            diretoriosArquivosContex.Entry(diretoriosArquivos).State = EntityState.Modified;
                            diretoriosArquivosContex.SaveChanges();


                            try
                            {
                                //      DiretoriosArquivosContext diretoriosArquivosFilhosContext = new DiretoriosArquivosContext();

                                var _retornoQueryDiretorioArquivoFilhos = (from dirArquiFilhoInfo in diretoriosArquivosContex.CloudDiretoriosArquivos
                                                                            where dirArquiFilhoInfo.Dia_CaminhoAtual.StartsWith(_caminhoOriginal)
                                                                        && dirArquiFilhoInfo.Dia_Fk_Usu_id == _retornoQueryUser.Uac_Fk.Usu_Id
                                                                            select dirArquiFilhoInfo).AsNoTracking();

                                //     List<NewPhotoCloudDiretoriosArquivos> _listArqDirUpdate = new List<NewPhotoCloudDiretoriosArquivos>();

                                foreach (var item in _retornoQueryDiretorioArquivoFilhos)
                                {
                                    var diretoriosArquivosFilhos = new NewPhotoCloudDiretoriosArquivos
                                    {

                                        Dia_Id = item.Dia_Id,
                                        Dia_Fk_Usu_id = _retornoQueryUser.Uac_Fk.Usu_Id,
                                        Dia_Nome = item.Dia_Nome,
                                        Dia_CaminhoOriginal = item.Dia_CaminhoAtual,
                                        Dia_CaminhoAtual = "/Lixeira/",
                                        //    Dia_CaminhoAtual = _caminhoSemPasta + "/" + _novoNomePasta + "/",
                                        Dia_Tipo = item.Dia_Tipo,
                                        Dia_DataCriacao = item.Dia_DataCriacao,
                                        Dia_DataExclusao = DateTime.Now.ToUniversalTime(),
                                        Dia_Status = "E"
                                    };

                                    diretoriosArquivosContex.Entry(diretoriosArquivosFilhos).State = EntityState.Modified;


                                }
                                diretoriosArquivosContex.ChangeTracker.DetectChanges();
                                diretoriosArquivosContex.SaveChanges();
                            }
                            catch (Exception e)
                            {
                                if (_renomeouPastaArquivoLixeira)
                                {
                                    System.IO.Directory.Move(@_caminhoRenomeado, @_preservCaminhoOriginalCompleto);
                                    System.IO.Directory.Move(@_caminhoRenomeadoMini, @_preservCaminhoOriginalMiniCompleto);
                                }

                                trans.Rollback();
                                ViewBag.Message = "Falha ao registrar a alteração dos conteúdos da pasta: <strong>" + _nomePastaArquivo + "</strong>";
                                ViewBag.Status = -1;
                                ViewBag.CaminhoRetorno = _caminhoSemPasta;
                                ViewBag.PastaRetorno = _nomePastaArquivo;
                                return PartialView();
                            }

                        }
                        catch (Exception e)
                        {
                            if (_renomeouPastaArquivoLixeira)
                            {
                                System.IO.Directory.Move(@_caminhoRenomeado, @_preservCaminhoOriginalCompleto);
                                System.IO.Directory.Move(@_caminhoRenomeadoMini, @_preservCaminhoOriginalMiniCompleto);
                            }
                            trans.Rollback();
                            ViewBag.Message = "Falha ao registrar a alteração da pasta: <strong>" + _nomePastaArquivo + "</strong>";
                            ViewBag.Status = -1;
                            ViewBag.CaminhoRetorno = _caminhoSemPasta;
                            ViewBag.PastaRetorno = _nomePastaArquivo;
                            return PartialView();
                        }

               
               
                        try
                        {

                            System.IO.Directory.Move(_caminhoOriginalMiniCompleto, _caminhoLixeiraMiniCompleto);

                        }
                        catch (Exception e)
                        {
                            trans.Rollback();
                            ViewBag.Message = "Falha ao tentar excluir a configuração de miniaturas para: <strong>" + _nomePastaArquivo + "</strong>";
                            ViewBag.Status = -1;
                            ViewBag.CaminhoRetorno = _caminhoDiretorioPai;
                            ViewBag.NomePastaArquivo = _nomePastaArquivo;
                            return PartialView();
                        }
                        try
                        {
                            System.IO.Directory.Move(_caminhoOriginalCompleto, _caminhoLixeiraCompleto);
                        }
                        catch (Exception e)
                        {
                            System.IO.Directory.Move(@_caminhoLixeiraMiniCompleto, @_preservCaminhoOriginalMiniCompleto);
                            trans.Rollback();
                            ViewBag.Message = "Falha ao tentar excluir: <strong>" + _nomePastaArquivo + "</strong>";
                            ViewBag.Status = -1;
                            ViewBag.CaminhoRetorno = _caminhoDiretorioPai;
                            ViewBag.NomePastaArquivo = _nomePastaArquivo;
                            return PartialView();
                        }
                    }
                    else
                    {
                        trans.Rollback();
                        ViewBag.Message = "<strong>" + _nomePastaArquivo + "</strong> não foi localizada nesse diretório.";
                        ViewBag.Status = 1;
                        ViewBag.CaminhoRetorno = _caminhoDiretorioPai;
                        ViewBag.NomePastaArquivo = _nomePastaArquivo;
                        return PartialView();
                    }
                    trans.Commit();
                }
            } //for

            if ((_qtdTotalPastas + _qtdTotalArquivos) == 1)
            {
                if (_qtdTotalPastas == 1)
                {
                    _strRetornoNomePastaArquivo = "Pasta <strong>" + _nomePastaArquivo + "</strong>";
                    _retornoMensagem = " excluida";

                }
                else if (_qtdTotalArquivos == 1)
                {
                    _strRetornoNomePastaArquivo = "Arquivo <strong>" + _nomePastaArquivo + "</strong>";
                    _retornoMensagem = " excluido";

                }
                
            }
            else
            {
                if (_qtdTotalPastas >= 1)
                {
                    if (_qtdTotalPastas == 1)
                    {
                        _strRetornoNomePastaArquivo = "<strong>" + _qtdTotalPastas + " Pasta </strong>";
                    }
                    else
                    {
                        _strRetornoNomePastaArquivo = "<strong>" + _qtdTotalPastas + " Pastas </strong>";
                    }
                    _retornoMensagem = " excluidas";
                }
                if (_qtdTotalPastas >= 1 && _qtdTotalArquivos >= 1)
                {
                    _strRetornoNomePastaArquivo = _strRetornoNomePastaArquivo + " e ";
                }
                if ((_qtdTotalArquivos) >= 1)
                {
                    if (_qtdTotalArquivos == 1)
                    {
                        _strRetornoNomePastaArquivo = _strRetornoNomePastaArquivo + "<strong>" + _qtdTotalArquivos + " Arquivo </strong>";
                    }
                    else
                    {
                        _strRetornoNomePastaArquivo = _strRetornoNomePastaArquivo + "<strong>" + _qtdTotalArquivos + " Arquivos </strong>";
                    }
                    _retornoMensagem = " excluidos";
                }
                
            }

            ViewBag.Message = _strRetornoNomePastaArquivo + _retornoMensagem + " com sucesso.";
            ViewBag.Status = 0;
            ViewBag.CaminhoRetorno = _caminhoDiretorioPai;
            ViewBag.NomePastaArquivo = _nomePastaArquivo;
            return PartialView();
        }
    }
}