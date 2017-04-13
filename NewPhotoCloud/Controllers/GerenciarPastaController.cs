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
using NewPhotoCloud.Repositories;

namespace NewPhotoCloud.Controllers
{
    public class GerenciarPastaController : Controller
    {
        private DiretoriosArquivosContext diretoriosArquivosContex = new DiretoriosArquivosContext();
        // GET: GerenciarPasta
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult CriarPasta(FormCollection PostFolder)
        {
            string _caminhoNovaPasta = PostFolder["hidCaminhoComp"];
            string _novaPasta = PostFolder["NomePasta"]; 
            string _diretorioBaseUsuario = null;
            string _caminhoCompleto = null;
            string _caminhoCompletoMini = null;
            string _caminhoPaiCompleto = null;
            int? _usu_id;

            UsuarioContext usuarioAcesso = new UsuarioContext();

            var _retornoQueryUser = (from usuarioInfoAcesso in usuarioAcesso.CloudUsuariosAcesso
                                     where usuarioInfoAcesso.Uac_UserName == User.Identity.Name
                                     select usuarioInfoAcesso).SingleOrDefault();

            _diretorioBaseUsuario = _retornoQueryUser.Uac_Fk.Usu_DiretorioBase;

            _usu_id = _retornoQueryUser.Uac_Fk.Usu_Id;

            Encoding iso = Encoding.GetEncoding("ISO-8859-1");

            _caminhoNovaPasta = HttpUtility.UrlDecode(_caminhoNovaPasta, iso);


            using (var trans = diretoriosArquivosContex.Database.BeginTransaction(IsolationLevel.ReadCommitted))
            {

                try
                {
                    var diretoriosArquivos = new NewPhotoCloudDiretoriosArquivos
                    {

                        Dia_Nome = _novaPasta,
                        Dia_CaminhoAtual = _caminhoNovaPasta,
                        Dia_DataCriacao = DateTime.Now.ToUniversalTime(),
                        Dia_Tipo = "D",
                        Dia_Status = "A",
                        Dia_Fk_Usu_id = _usu_id

                    };

                    diretoriosArquivosContex.CloudDiretoriosArquivos.Add(diretoriosArquivos);

                    //   s.Entry(diretoriosArquivos).State = EntityState.Modified;
                    diretoriosArquivosContex.SaveChanges();
                }
                catch (Exception e)
                {
                    trans.Rollback();
                    ViewBag.Message = "Falha ao registrar a pasta: <strong>" + _novaPasta + "</strong>";
                    ViewBag.Status = -1;
                    return PartialView();
                }

                
                try
                {

                    _caminhoCompletoMini = Server.MapPath("~/pho_fotos_miniatura/" + _diretorioBaseUsuario + _caminhoNovaPasta + _novaPasta);
                    _caminhoCompleto = Server.MapPath("~/pho_fotos/" + _diretorioBaseUsuario + _caminhoNovaPasta + _novaPasta);

                }
                catch (Exception e)
                {
                    trans.Rollback();
                    ViewBag.Message = "Falha ao criar a pasta: <strong>" + _novaPasta + "</strong> <br /> Não é possível criar mais pastas dento do diretório atual. <br /> Caminho muito extenso.";
                    ViewBag.Status = -1;
                    return PartialView();
                }
 
                if (_caminhoCompletoMini.Length >= 248)
                {
                    _caminhoPaiCompleto = Server.MapPath("~/pho_fotos/" + _diretorioBaseUsuario + _caminhoNovaPasta);
                    _caminhoPaiCompleto = _caminhoPaiCompleto.Substring(1, _caminhoPaiCompleto.LastIndexOf("\\") - 1);

                    trans.Rollback();
                    ViewBag.Message = "Não é possível criar a pasta <strong>" + _novaPasta + "</strong> dento do diretório <strong>" + Path.GetFileName(_caminhoPaiCompleto) + "</strong>. <br /> Caminho muito extenso.";
                    ViewBag.Status = 1;
                    return PartialView();
                }

                // Determine whether the directory exists. 
                if (Directory.Exists(_caminhoCompleto))
                {
                    trans.Rollback();
                    ViewBag.Message = "A pasta <strong>" + _novaPasta + "</strong> já existe.";
                    ViewBag.Status = 1;
                    return PartialView();
                }

                try
                {
                    // Try to create the directory.
                    DirectoryInfo dimini = Directory.CreateDirectory(_caminhoCompletoMini);
                }
                catch (Exception e)
                {
                    trans.Rollback();
                    ViewBag.Message = "Falha ao criar a diretório de miniaturas para a pasta: <strong>" + _novaPasta + "</strong>";
                    ViewBag.Status = -1;
                    return PartialView();
                }
                try
                {
                    // Try to create the directory.
                    DirectoryInfo di = Directory.CreateDirectory(_caminhoCompleto);
                }
                catch (Exception e)
                {
                    // Delete the directory.
                    Directory.Delete(_caminhoCompletoMini, true);

                    trans.Rollback();
                    ViewBag.Message = "Falha ao criar a pasta: <strong>" + _novaPasta + "</strong>";
                    ViewBag.Status = -1;
                    return PartialView();
                }

                trans.Commit();
            }
            ViewBag.Message = "A pasta: <strong>" + _novaPasta + "</strong> foi criada com sucesso.";
            ViewBag.Status = 0;
            return PartialView();

        }        
        
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult CriarPastaInFileTree(FormCollection PostFolder)
        {
            string _caminhoNovaPasta = PostFolder["hidCaminhoCriarNovaPasta"];
            string _novaPasta = PostFolder["NomePasta"];
            string _diretorioBaseUsuario = null;
            string _caminhoCompleto = null;
            string _caminhoCompletoMini = null;
            string _caminhoPaiCompleto = null;
            int? _usu_id;

            UsuarioContext usuarioAcesso = new UsuarioContext();

            var _retornoQueryUser = (from usuarioInfoAcesso in usuarioAcesso.CloudUsuariosAcesso
                                     where usuarioInfoAcesso.Uac_UserName == User.Identity.Name
                                     select usuarioInfoAcesso).SingleOrDefault();

            _diretorioBaseUsuario = _retornoQueryUser.Uac_Fk.Usu_DiretorioBase;

            _usu_id = _retornoQueryUser.Uac_Fk.Usu_Id;

            Encoding iso = Encoding.GetEncoding("ISO-8859-1");

            _caminhoNovaPasta = HttpUtility.UrlDecode(_caminhoNovaPasta, iso);


            using (var trans = diretoriosArquivosContex.Database.BeginTransaction(IsolationLevel.ReadCommitted))
            {

                try
                {
                    var diretoriosArquivos = new NewPhotoCloudDiretoriosArquivos
                    {

                        Dia_Nome = _novaPasta,
                        Dia_CaminhoAtual = _caminhoNovaPasta,
                        Dia_DataCriacao = DateTime.Now.ToUniversalTime(),
                        Dia_Tipo = "D",
                        Dia_Status = "A",
                        Dia_Fk_Usu_id = _usu_id

                    };

                    diretoriosArquivosContex.CloudDiretoriosArquivos.Add(diretoriosArquivos);

                    //   s.Entry(diretoriosArquivos).State = EntityState.Modified;
                    diretoriosArquivosContex.SaveChanges();
                }
                catch (Exception e)
                {
                    trans.Rollback();
                    ViewBag.Message = "Falha ao registrar a pasta: <strong>" + _novaPasta + "</strong>";
                    ViewBag.Status = -1;
                    return PartialView();
                }


                try
                {

                    _caminhoCompletoMini = Server.MapPath("~/pho_fotos_miniatura/" + _diretorioBaseUsuario + _caminhoNovaPasta + _novaPasta);
                    _caminhoCompleto = Server.MapPath("~/pho_fotos/" + _diretorioBaseUsuario + _caminhoNovaPasta + _novaPasta);

                }
                catch (Exception e)
                {
                    trans.Rollback();
                    ViewBag.Message = "Falha ao criar a pasta: <strong>" + _novaPasta + "</strong> <br /> Não é possível criar mais pastas dento do diretório atual. <br /> Caminho muito extenso.";
                    ViewBag.Status = -1;
                    return PartialView();
                }

                if (_caminhoCompletoMini.Length >= 248)
                {
                    _caminhoPaiCompleto = Server.MapPath("~/pho_fotos/" + _diretorioBaseUsuario + _caminhoNovaPasta);
                    _caminhoPaiCompleto = _caminhoPaiCompleto.Substring(1, _caminhoPaiCompleto.LastIndexOf("\\") - 1);

                    trans.Rollback();
                    ViewBag.Message = "Não é possível criar a pasta <strong>" + _novaPasta + "</strong> dento do diretório <strong>" + Path.GetFileName(_caminhoPaiCompleto) + "</strong>. <br /> Caminho muito extenso.";
                    ViewBag.Status = 1;
                    return PartialView();
                }

                // Determine whether the directory exists. 
                if (Directory.Exists(_caminhoCompleto))
                {
                    trans.Rollback();
                    ViewBag.Message = "A pasta <strong>" + _novaPasta + "</strong> já existe.";
                    ViewBag.Status = 1;
                    return PartialView();
                }

                try
                {
                    // Try to create the directory.
                    DirectoryInfo dimini = Directory.CreateDirectory(_caminhoCompletoMini);
                }
                catch (Exception e)
                {
                    trans.Rollback();
                    ViewBag.Message = "Falha ao criar a diretório de miniaturas para a pasta: <strong>" + _novaPasta + "</strong>";
                    ViewBag.Status = -1;
                    return PartialView();
                }
                try
                {
                    // Try to create the directory.
                    DirectoryInfo di = Directory.CreateDirectory(_caminhoCompleto);
                }
                catch (Exception e)
                {
                    // Delete the directory.
                    Directory.Delete(_caminhoCompletoMini, true);

                    trans.Rollback();
                    ViewBag.Message = "Falha ao criar a pasta: <strong>" + _novaPasta + "</strong>";
                    ViewBag.Status = -1;
                    return PartialView();
                }

                trans.Commit();
            }
            ViewBag.Message = "A pasta: <strong>" + _novaPasta + "</strong> foi criada com sucesso.";
            ViewBag.Status = 0;
            return PartialView();

        }  
    
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult RenomearPasta(FormCollection PostFolder)
        {
           string _caminhoSolicitadoPasta = PostFolder["hidCaminhoComp"];
           string _novoNomePasta = PostFolder["NomePasta"];
           string _diretorioBaseUsuario = null;

           string _caminhoSemPasta = null;
           string _antigoNomePasta = null;
           string _nomePastaTemporaria = null;

           string _caminhoPastaOriginal = null;
           string _caminhoMiniPastaOriginal = null;
       

           string _caminhoPastaAlterada = null;
           string _caminhoPastaAlteradaTemp = null;
           string _caminhoMiniPastaAlterada = null;
           string _caminhoMiniPastaAlteradaTemp = null;

           string _caminhoPaiCompleto = null;

          
           UsuarioContext usuarioAcesso = new UsuarioContext();

           var _retornoQueryUser = (from usuarioInfoAcesso in usuarioAcesso.CloudUsuariosAcesso
                                    where usuarioInfoAcesso.Uac_UserName == User.Identity.Name
                                    select usuarioInfoAcesso).SingleOrDefault();

           _diretorioBaseUsuario = _retornoQueryUser.Uac_Fk.Usu_DiretorioBase;

           Encoding iso = Encoding.GetEncoding("ISO-8859-1");

           _caminhoSolicitadoPasta = HttpUtility.UrlDecode(_caminhoSolicitadoPasta, iso);

           _caminhoSemPasta = _caminhoSolicitadoPasta.Substring(0, _caminhoSolicitadoPasta.LastIndexOf("/"));

           _antigoNomePasta = Path.GetFileName(_caminhoSemPasta);

           _caminhoSemPasta = _caminhoSemPasta.Substring(0, _caminhoSemPasta.LastIndexOf("/"));

        //   DiretoriosArquivosContext diretoriosArquivosContext = new DiretoriosArquivosContext();

           diretoriosArquivosContex.Configuration.AutoDetectChangesEnabled = false;

           using (var trans = diretoriosArquivosContex.Database.BeginTransaction(IsolationLevel.ReadCommitted))
           {
               try
               {
                   var _retornoQueryDiretorioArquivo = (from dirArquiInfo in diretoriosArquivosContex.CloudDiretoriosArquivos
                                                        where dirArquiInfo.Dia_Nome == _antigoNomePasta
                                                        && dirArquiInfo.Dia_CaminhoAtual == _caminhoSemPasta + "/"
                                                        && dirArquiInfo.Dia_Fk_Usu_id == _retornoQueryUser.Uac_Fk.Usu_Id
                                                        select dirArquiInfo).AsNoTracking().SingleOrDefault();

                   var diretoriosArquivos = new NewPhotoCloudDiretoriosArquivos
                   {

                       Dia_Id = _retornoQueryDiretorioArquivo.Dia_Id,
                       Dia_Fk_Usu_id = _retornoQueryUser.Uac_Fk.Usu_Id,
                       Dia_Nome = _novoNomePasta,
                       Dia_CaminhoOriginal = _retornoQueryDiretorioArquivo.Dia_CaminhoOriginal,
                       Dia_CaminhoAtual = _retornoQueryDiretorioArquivo.Dia_CaminhoAtual,
                       Dia_Tipo = _retornoQueryDiretorioArquivo.Dia_Tipo,
                       Dia_DataCriacao = _retornoQueryDiretorioArquivo.Dia_DataCriacao,
                       Dia_DataExclusao = _retornoQueryDiretorioArquivo.Dia_DataExclusao,
                       Dia_Status = _retornoQueryDiretorioArquivo.Dia_Status
                   };

                   diretoriosArquivosContex.Entry(diretoriosArquivos).State = EntityState.Modified;
                   diretoriosArquivosContex.SaveChanges();


                   try
                   {
                 //      DiretoriosArquivosContext diretoriosArquivosFilhosContext = new DiretoriosArquivosContext();

                       var _retornoQueryDiretorioArquivoFilhos = (from dirArquiFilhoInfo in diretoriosArquivosContex.CloudDiretoriosArquivos
                                                                  where dirArquiFilhoInfo.Dia_CaminhoAtual.StartsWith(_caminhoSolicitadoPasta)
                                                                && dirArquiFilhoInfo.Dia_Fk_Usu_id == _retornoQueryUser.Uac_Fk.Usu_Id
                                                                  select dirArquiFilhoInfo).AsNoTracking();

                       //     List<NewPhotoCloudDiretoriosArquivos> _listArqDirUpdate = new List<NewPhotoCloudDiretoriosArquivos>();

                       foreach (var item in _retornoQueryDiretorioArquivoFilhos)
                       {
                           string _caminhoAlterado = item.Dia_CaminhoAtual.Replace("/"+_antigoNomePasta+"/","/"+_novoNomePasta+"/");
                           var diretoriosArquivosFilhos = new NewPhotoCloudDiretoriosArquivos
                           {

                               Dia_Id = item.Dia_Id,
                               Dia_Fk_Usu_id = _retornoQueryUser.Uac_Fk.Usu_Id,
                               Dia_Nome = item.Dia_Nome,
                               Dia_CaminhoOriginal = item.Dia_CaminhoOriginal,
                               Dia_CaminhoAtual = _caminhoAlterado,
                           //    Dia_CaminhoAtual = _caminhoSemPasta + "/" + _novoNomePasta + "/",
                               Dia_Tipo = item.Dia_Tipo,
                               Dia_DataCriacao = item.Dia_DataCriacao,
                               Dia_DataExclusao = item.Dia_DataExclusao,
                               Dia_Status = item.Dia_Status
                           };

                           diretoriosArquivosContex.Entry(diretoriosArquivosFilhos).State = EntityState.Modified;
                          

                       }
                       diretoriosArquivosContex.ChangeTracker.DetectChanges();
                       diretoriosArquivosContex.SaveChanges();
                   }
                   catch (Exception e)
                   {
                       trans.Rollback();
                       ViewBag.Message = "Falha ao registrar a alteração dos conteúdos da pasta: <strong>" + _novoNomePasta + "</strong>";
                       ViewBag.Status = -1;
                       ViewBag.CaminhoRetorno = _caminhoSemPasta;
                       ViewBag.PastaRetorno = _antigoNomePasta;
                       return PartialView();
                   }

               }
               catch (Exception e)
               {
                   trans.Rollback();
                   ViewBag.Message = "Falha ao registrar a alteração da pasta: <strong>" + _novoNomePasta + "</strong>";
                   ViewBag.Status = -1;
                   ViewBag.CaminhoRetorno = _caminhoSemPasta;
                   ViewBag.PastaRetorno = _antigoNomePasta;
                   return PartialView();
               }

               try
               {

                   _caminhoMiniPastaOriginal = Server.MapPath("~/pho_fotos_miniatura/" + _diretorioBaseUsuario + _caminhoSemPasta + "/" + _antigoNomePasta);
                   _caminhoPastaOriginal = Server.MapPath("~/pho_fotos/" + _diretorioBaseUsuario + _caminhoSemPasta + "/" + _antigoNomePasta);

                   _caminhoMiniPastaAlterada = Server.MapPath("~/pho_fotos_miniatura/" + _diretorioBaseUsuario + _caminhoSemPasta + "/" + _novoNomePasta);
                   _caminhoPastaAlterada = Server.MapPath("~/pho_fotos/" + _diretorioBaseUsuario + _caminhoSemPasta + "/" + _novoNomePasta);

               }
               catch (Exception e)
               {
                   trans.Rollback();
                   ViewBag.Message = "Falha ao renomear a pasta de  <strong>" + _antigoNomePasta + "</strong> para <strong>" + _novoNomePasta + "</strong>. <br /> Caminho muito extenso.";
                   ViewBag.Status = -1;
                   ViewBag.CaminhoRetorno = _caminhoSemPasta;
                   ViewBag.PastaRetorno = _antigoNomePasta;
                   return PartialView();
               }

               if (_caminhoMiniPastaAlterada.Length >= 248)
               {
                   _caminhoPaiCompleto = Server.MapPath("~/pho_fotos_miniatura/" + _diretorioBaseUsuario + _caminhoSemPasta);
                   _caminhoPaiCompleto = _caminhoPaiCompleto.Substring(1, _caminhoPaiCompleto.LastIndexOf("\\") - 1);

                   trans.Rollback();
                   ViewBag.Message = "Não é possível renomear a pasta <strong>" + _antigoNomePasta + "</strong>  para <strong>" + _novoNomePasta + "</strong>. <br /> Caminho muito extenso.";
                   ViewBag.Status = 1;
                   ViewBag.CaminhoRetorno = _caminhoSemPasta;
                   ViewBag.PastaRetorno = _antigoNomePasta;
                   return PartialView();
               }

               if (_caminhoMiniPastaOriginal.Equals(_caminhoMiniPastaAlterada, StringComparison.InvariantCultureIgnoreCase))
               {
                    ConvertMD5 ConverteMd5 = new ConvertMD5();
                    _nomePastaTemporaria = Path.GetFileName(_caminhoMiniPastaAlterada);
                    _caminhoMiniPastaAlteradaTemp = _caminhoSemPasta + "/"+ ConverteMd5.getMD5Hash(CryptographyRepository.Criptografar(_nomePastaTemporaria));

                      
                    try
                    {
                        //System.IO.Directory.Move(Server.MapPath(@"\pasta"), Server.MapPath(@"\pasta renomeada"));
                        _caminhoMiniPastaAlteradaTemp = Server.MapPath("~/pho_fotos_miniatura/" + _diretorioBaseUsuario + _caminhoMiniPastaAlteradaTemp);

                        System.IO.Directory.Move(@_caminhoMiniPastaOriginal, @_caminhoMiniPastaAlteradaTemp);
             
                    }
                    catch (Exception e)
                    {
                        trans.Rollback();
                        ViewBag.Message = "Falha ao criar pasta temporária de miniaturas para configuração de diretórios.";
                        ViewBag.Status = -1;
                        ViewBag.CaminhoRetorno = _caminhoSemPasta;
                        ViewBag.PastaRetorno = _antigoNomePasta;
                        return PartialView();
                    }
               }

               // Determine whether the directory exists. 
                if (Directory.Exists(_caminhoMiniPastaAlterada))
                {
                    if (_caminhoMiniPastaAlteradaTemp != null)
                    {
                        System.IO.Directory.Move(@_caminhoMiniPastaAlteradaTemp, @_caminhoMiniPastaOriginal);
                    }

                    trans.Rollback();
                    ViewBag.Message = "A pasta <strong>" + _novoNomePasta + "</strong> já existe.";
                    ViewBag.Status = 1;
                    ViewBag.CaminhoRetorno = _caminhoSemPasta;
                    ViewBag.PastaRetorno = _antigoNomePasta;
                    return PartialView();
                }

               if (_caminhoMiniPastaAlteradaTemp != null)
               {
                   _caminhoMiniPastaOriginal = _caminhoMiniPastaAlteradaTemp;
                  
               }

               try
               {
                   //System.IO.Directory.Move(Server.MapPath(@"\pasta"), Server.MapPath(@"\pasta renomeada"));

                   System.IO.Directory.Move(@_caminhoMiniPastaOriginal, @_caminhoMiniPastaAlterada);
               }
               catch (Exception e)
               {
                   trans.Rollback();
                   ViewBag.Message = "Falha ao renomear a pasta de miniaturas, de <strong>" + _antigoNomePasta + "</strong> para <strong>" + _novoNomePasta + "</strong>.";
                   ViewBag.Status = -1;
                   ViewBag.CaminhoRetorno = _caminhoSemPasta;
                   ViewBag.PastaRetorno = _antigoNomePasta;
                   return PartialView();
               }

               _nomePastaTemporaria = null;

               if (_caminhoPastaOriginal.Equals(_caminhoPastaAlterada, StringComparison.InvariantCultureIgnoreCase))
               {
                   ConvertMD5 ConverteMd5 = new ConvertMD5();
                   _nomePastaTemporaria = Path.GetFileName(_caminhoPastaAlterada);
                   _caminhoPastaAlteradaTemp = _caminhoSemPasta + "/" + ConverteMd5.getMD5Hash(CryptographyRepository.Criptografar(_nomePastaTemporaria));


                   try
                   {
                       //System.IO.Directory.Move(Server.MapPath(@"\pasta"), Server.MapPath(@"\pasta renomeada"));
                       _caminhoPastaAlteradaTemp = Server.MapPath("~/pho_fotos/" + _diretorioBaseUsuario + _caminhoPastaAlteradaTemp);

                       System.IO.Directory.Move(@_caminhoPastaOriginal, @_caminhoPastaAlteradaTemp);

                   }
                   catch (Exception e)
                   {
                       trans.Rollback();
                       ViewBag.Message = "Falha ao criar pasta temporária para configuração de diretórios.";
                       ViewBag.Status = -1;
                       ViewBag.CaminhoRetorno = _caminhoSemPasta;
                       ViewBag.PastaRetorno = _antigoNomePasta;
                       return PartialView();
                   }
               }

               // Determine whether the directory exists. 
               if (Directory.Exists(_caminhoPastaAlterada))
               {
                   if (_caminhoPastaAlteradaTemp != null)
                   {
                       System.IO.Directory.Move(@_caminhoPastaAlteradaTemp, @_caminhoPastaOriginal);
                       // ?????????????? RENOMEAR MINI ?????????????????
                   }

                   trans.Rollback();
                   ViewBag.Message = "A pasta <strong>" + _novoNomePasta + "</strong> já existe.";
                   ViewBag.Status = 1;
                   ViewBag.CaminhoRetorno = _caminhoSemPasta;
                   ViewBag.PastaRetorno = _antigoNomePasta;
                   return PartialView();
               }

               if (_caminhoPastaAlteradaTemp != null)
               {
                   _caminhoPastaOriginal = _caminhoPastaAlteradaTemp;
               }

               try
               {
                   //System.IO.Directory.Move(Server.MapPath(@"\pasta"), Server.MapPath(@"\pasta renomeada"));

                   System.IO.Directory.Move(_caminhoPastaOriginal, _caminhoPastaAlterada);
               }
               catch (Exception e)
               {
                   System.IO.Directory.Move(_caminhoMiniPastaAlterada,_caminhoMiniPastaOriginal);
                   trans.Rollback();
                   ViewBag.Message = "Falha ao renomear a pasta de  <strong>" + _antigoNomePasta + "</strong> para <strong>" + _novoNomePasta + "</strong>.";
                   ViewBag.Status = -1;
                   ViewBag.CaminhoRetorno = _caminhoSemPasta;
                   ViewBag.PastaRetorno = _antigoNomePasta;
                   return PartialView();
               }

               trans.Commit();
           }

           

            ViewBag.Message = "A pasta <strong>" + _antigoNomePasta + "</strong> foi renomeada para <strong>" + _novoNomePasta + "</strong> com sucesso.";
            ViewBag.Status = 0;
            ViewBag.CaminhoRetorno = _caminhoSemPasta;
            ViewBag.PastaRetorno = _novoNomePasta;
            return PartialView();
        }
    }
}