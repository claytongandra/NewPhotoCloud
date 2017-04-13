using NewPhotoCloud.Models;
using NewPhotoCloud.Repositories;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace NewPhotoCloud.Controllers
{
    public class GerenciarPastaArquivoController : Controller
    {
        private DiretoriosArquivosContext diretoriosArquivosContex = new DiretoriosArquivosContext();

        [HttpPost]
        public ActionResult MoverPastaArquivo(MoverPastaArquivoOrigem moverPastaArquivo)
        {
            string _diretorioBaseUsuario = "";
            string _caminhoOrigem = "";
            string _caminhoOrigemMiniatura = "";
            string _nomePastaArquivoOrigem = "";
            string _caminhoDestino = "";
            string _caminhoDestinoMiniatura = "";
            string _caminhoSemPasta = "";
            string _codigoPastaArquivo = "";
            string _caminhoDestinoSubPastas = "";
            bool _pastaArquivoExisteOrigem = false;
            bool _pastaArquivoExisteDestino = false;

            var _qtdPastaMovido = 0;
            var _qtdArquivoMovido = 0;
            ViewBag.Status = 0;
            

        //    MoverPastaArquivoRetornoSucesso _jsonRecuperaListaPastasArquivosMovidos;

      //      List<MoverPastaArquivoRetornoSucesso> RetornoPastasArquivosMovidos = new List<MoverPastaArquivoRetornoSucesso>();
MoverPastaArquivoDesfazerMover RetornoPastasArquivosMovidos = new MoverPastaArquivoDesfazerMover();


        //var arrJsJsonMoverPara = new {
        //        "caminhoRetorno": moverPastaArquivo.CaminhoRetorno,
        //        "caminhoPastaPai":moverPastaArquivo.CaminhoPastaPai,
        //        "estadoPasta": moverPastaArquivo.EstadoPasta,
        //        "caminhoAtualDestino": moverPastaArquivo.CaminhoAtualDestino,
        //        "listaMoverPastasArquivos": [
        //                        { "nomePastaArquivo": moverPastaArquivo.ListaMoverPastasArquivos., "caminhoOriginal": moverPastaArquivo.ListaMoverPastasArquivos., "tipoArquivoPasta": moverPastaArquivo.ListaMoverPastasArquivos. }
        //            ]
        //};
            ConvertMD5 ConverterMD5 = new ConvertMD5();

            UsuarioContext usuarioAcesso = new UsuarioContext();

            var _retornoQueryUser = (from usuarioInfoAcesso in usuarioAcesso.CloudUsuariosAcesso
                                     where usuarioInfoAcesso.Uac_UserName == User.Identity.Name
                                     select usuarioInfoAcesso).SingleOrDefault();

            _diretorioBaseUsuario = _retornoQueryUser.Uac_Fk.Usu_DiretorioBase;



            var _cookieItensMovidos = HttpContext.Request.Cookies[ConverterMD5.getMD5Hash("ListaPastasArquivosMovidos")];

            if (_cookieItensMovidos != null)
            {
                RetornoPastasArquivosMovidos = JsonConvert.DeserializeObject<MoverPastaArquivoDesfazerMover>(HttpContext.Request.Cookies[ConverterMD5.getMD5Hash("ListaPastasArquivosMovidos")]["PasArqMov"]);
            }


            ViewBag.DirBase = _diretorioBaseUsuario;
             try
                {
                   
                  _caminhoDestino = Server.MapPath("~/pho_fotos/" + _diretorioBaseUsuario + "/" + moverPastaArquivo.CaminhoAtualDestino);
                  _caminhoDestinoMiniatura = Server.MapPath("~/pho_fotos_miniatura/" + _diretorioBaseUsuario + "/" + moverPastaArquivo.CaminhoAtualDestino);
                  
                }
                catch (Exception e)
                {
                    ViewBag.Message = "Falha ao configurar caminhos de destino. Nenhum item foi movido.";
                    ViewBag.Status = -1;
                    return PartialView(moverPastaArquivo);
                }
               
          ///  _caminhoInicialMiniatura = Server.MapPath("~/pho_fotos_miniatura/" + _diretorioBaseUsuario);
          //  _caminhoInicial = Server.MapPath("~/pho_fotos/" + _diretorioBaseUsuario);

            List<MoverPastaArquivoDesfazerMoverLista> ListaPastaArquivoMovido = new List<MoverPastaArquivoDesfazerMoverLista>();
            List<MoverPastaArquivoNomeMovidos> ListaNomePastaArquivoMovido = new List<MoverPastaArquivoNomeMovidos>();

            foreach (var itemPastaArquivo in moverPastaArquivo.ListaMoverPastasArquivos)
            {
                using (var trans = diretoriosArquivosContex.Database.BeginTransaction(IsolationLevel.ReadCommitted))
                {

                    _caminhoSemPasta = itemPastaArquivo.CaminhoOriginal.Substring(0, itemPastaArquivo.CaminhoOriginal.LastIndexOf("/"));
                    if (itemPastaArquivo.TipoArquivoPasta == 'D')
                    {
                        _caminhoSemPasta = _caminhoSemPasta.Substring(0, _caminhoSemPasta.LastIndexOf("/"));
                    }
                   

                    try
                    {
                        _caminhoOrigem = Server.MapPath("~/pho_fotos/" + _diretorioBaseUsuario + itemPastaArquivo.CaminhoOriginal);
                        _caminhoOrigemMiniatura = Server.MapPath("~/pho_fotos_miniatura/" + _diretorioBaseUsuario + itemPastaArquivo.CaminhoOriginal);

                        if (itemPastaArquivo.TipoArquivoPasta == 'D')
                        {
                            _nomePastaArquivoOrigem = Path.GetFileName(itemPastaArquivo.CaminhoOriginal.Substring(0, itemPastaArquivo.CaminhoOriginal.LastIndexOf("/")));
                        }
                        else if (itemPastaArquivo.TipoArquivoPasta == 'A')
                        {
                            _nomePastaArquivoOrigem = Path.GetFileName(itemPastaArquivo.CaminhoOriginal);
                        }

                        //throw new Exception();
                    }
                    catch (Exception e)
                    {
                        trans.Rollback();
                        if (itemPastaArquivo.TipoArquivoPasta == 'D')
                        {
                            itemPastaArquivo.MensagemsRetorno = "Falha ao configurar caminhos de origem da pasta: <strong>" + itemPastaArquivo.NomePastaArquivo + "</strong>. Pasta não movida.";
                        }
                        else if (itemPastaArquivo.TipoArquivoPasta == 'A')
                        {
                            itemPastaArquivo.MensagemsRetorno = "Falha ao configurar caminhos de origem do arquivo: <strong>" + itemPastaArquivo.NomePastaArquivo + "</strong>. Arquivo não movido.";
                        }
                        itemPastaArquivo.StatusRetorno = -1;
                        continue;
                    }
                    if (itemPastaArquivo.TipoArquivoPasta == 'D')
                    {
                        _pastaArquivoExisteOrigem = Directory.Exists(_caminhoOrigem);
                        _pastaArquivoExisteDestino = Directory.Exists(_caminhoDestino + _nomePastaArquivoOrigem);


                    }
                    else if (itemPastaArquivo.TipoArquivoPasta == 'A')
                    {
                        _pastaArquivoExisteOrigem = System.IO.File.Exists(_caminhoOrigem);
                        _pastaArquivoExisteDestino = System.IO.File.Exists(_caminhoDestino + _nomePastaArquivoOrigem);

                    }
                    else
                    {
                       
                        itemPastaArquivo.MensagemsRetorno = "Falha ao identificar o tipo do item: <strong>" + itemPastaArquivo.NomePastaArquivo + "</strong>.";
                        itemPastaArquivo.StatusRetorno = -1;
                        continue;
                    }

                    if (_pastaArquivoExisteOrigem)
                    {
                        if (_pastaArquivoExisteDestino)
                        {
                            trans.Rollback();
                            if (itemPastaArquivo.TipoArquivoPasta == 'D')
                            {
                                itemPastaArquivo.MensagemsRetorno = "Já existe uma pasta com o nome <strong>" + itemPastaArquivo.NomePastaArquivo + "</strong> neste local.";
                                itemPastaArquivo.StatusRetorno = 1;
                            }
                            else if (itemPastaArquivo.TipoArquivoPasta == 'A')
                            {
                                itemPastaArquivo.MensagemsRetorno = "Já existe um arquivo com o nome <strong>" + itemPastaArquivo.NomePastaArquivo + "</strong> neste local.";
                                itemPastaArquivo.StatusRetorno = 1;
                            }
                            continue;
                        }
                        else
                        {

                            try
                            {
                                var _retornoQueryDiretorioArquivo = (from dirArquiInfo in diretoriosArquivosContex.CloudDiretoriosArquivos
                                                                     where dirArquiInfo.Dia_Nome == itemPastaArquivo.NomePastaArquivo
                                                                     && dirArquiInfo.Dia_CaminhoAtual == _caminhoSemPasta + "/"
                                                                     && dirArquiInfo.Dia_Fk_Usu_id == _retornoQueryUser.Uac_Fk.Usu_Id
                                                                     select dirArquiInfo).AsNoTracking().SingleOrDefault();

                                _codigoPastaArquivo = CryptographyRepository.Criptografar(_retornoQueryDiretorioArquivo.Dia_Id.ToString());
                              //  _codigoPastaArquivo = _retornoQueryDiretorioArquivo.Dia_Id.ToString();

                                var diretoriosArquivos = new NewPhotoCloudDiretoriosArquivos
                                {

                                    Dia_Id = _retornoQueryDiretorioArquivo.Dia_Id,
                                    Dia_Fk_Usu_id = _retornoQueryUser.Uac_Fk.Usu_Id,
                                    Dia_Nome = _retornoQueryDiretorioArquivo.Dia_Nome,
                                    Dia_CaminhoOriginal = _retornoQueryDiretorioArquivo.Dia_CaminhoAtual,
                                    Dia_CaminhoAtual = moverPastaArquivo.CaminhoAtualDestino,
                                    Dia_Tipo = _retornoQueryDiretorioArquivo.Dia_Tipo,
                                    Dia_DataCriacao = _retornoQueryDiretorioArquivo.Dia_DataCriacao,
                                    Dia_Status = _retornoQueryDiretorioArquivo.Dia_Status
                                };

                                diretoriosArquivosContex.Entry(diretoriosArquivos).State = EntityState.Modified;
                                diretoriosArquivosContex.SaveChanges();

                                try
                                {
                                    var _retornoQueryDiretorioArquivoFilhos = (from dirArquiFilhoInfo in diretoriosArquivosContex.CloudDiretoriosArquivos
                                                                               where dirArquiFilhoInfo.Dia_CaminhoAtual.StartsWith(itemPastaArquivo.CaminhoOriginal)
                                                                               && dirArquiFilhoInfo.Dia_Fk_Usu_id == _retornoQueryUser.Uac_Fk.Usu_Id
                                                                               select dirArquiFilhoInfo).AsNoTracking();

                                    foreach (var item in _retornoQueryDiretorioArquivoFilhos)
                                    {
                                        _caminhoDestinoSubPastas = item.Dia_CaminhoAtual;

                                        _caminhoDestinoSubPastas = _caminhoDestinoSubPastas.Replace(itemPastaArquivo.CaminhoOriginal,moverPastaArquivo.CaminhoAtualDestino + itemPastaArquivo.NomePastaArquivo + "/");

                                        var diretoriosArquivosFilhos = new NewPhotoCloudDiretoriosArquivos
                                        {

                                            Dia_Id = item.Dia_Id,
                                            Dia_Fk_Usu_id = _retornoQueryUser.Uac_Fk.Usu_Id,
                                            Dia_Nome = item.Dia_Nome,
                                            Dia_CaminhoOriginal = item.Dia_CaminhoAtual,
                                            Dia_CaminhoAtual = _caminhoDestinoSubPastas,
                                            Dia_Tipo = item.Dia_Tipo,
                                            Dia_DataCriacao = item.Dia_DataCriacao,
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
                                    if (itemPastaArquivo.TipoArquivoPasta == 'D')
                                    {
                                        itemPastaArquivo.MensagemsRetorno = "Falha ao registrar a alteração da pasta contida na pasta: <strong>" + itemPastaArquivo.NomePastaArquivo + "</strong>. Pasta não movida.";
                                    }
                                    else if (itemPastaArquivo.TipoArquivoPasta == 'A')
                                    {
                                        itemPastaArquivo.MensagemsRetorno = "Falha ao registrar a alteração do arquivo contido na pasta: <strong>" + itemPastaArquivo.NomePastaArquivo + "</strong>. Arquivo não movido.";
                                    }
                                    itemPastaArquivo.StatusRetorno = -1;
                                    continue;
                                }
                            }
                            catch (Exception e)
                            {
                                trans.Rollback();
                                if (itemPastaArquivo.TipoArquivoPasta == 'D')
                                {
                                    itemPastaArquivo.MensagemsRetorno = "Falha ao registrar a alteração da pasta: <strong>" + itemPastaArquivo.NomePastaArquivo + "</strong>. Pasta não movida.";
                                }
                                else if (itemPastaArquivo.TipoArquivoPasta == 'A')
                                {
                                    itemPastaArquivo.MensagemsRetorno = "Falha ao registrar a alteração do arquivo: <strong>" + itemPastaArquivo.NomePastaArquivo + "</strong>. Arquivo não movido.";
                                }
                                itemPastaArquivo.StatusRetorno = -1;
                                continue;
                            }

                            try
                            {

                                System.IO.Directory.Move(_caminhoOrigemMiniatura, _caminhoDestinoMiniatura + _nomePastaArquivoOrigem);

                            }
                            catch (Exception e)
                            {

                                trans.Rollback();
                                if (itemPastaArquivo.TipoArquivoPasta == 'D')
                                {
                                    itemPastaArquivo.MensagemsRetorno = "Falha ao tentar mover a configuração de miniaturas da pasta: <strong>" + itemPastaArquivo.NomePastaArquivo + "</strong>. Pasta não movida.";
                                }
                                else if (itemPastaArquivo.TipoArquivoPasta == 'A')
                                {
                                    itemPastaArquivo.MensagemsRetorno = "Falha ao tentar mover a configuração de miniaturas do arquivo: <strong>" + itemPastaArquivo.NomePastaArquivo + "</strong>. Arquivo não movido.";
                                }
                                itemPastaArquivo.StatusRetorno = -1;
                                continue;
                            }
                            try
                            {
                                System.IO.Directory.Move(_caminhoOrigem, _caminhoDestino + _nomePastaArquivoOrigem);
                            }
                            catch (Exception e)
                            {
                                System.IO.Directory.Move(_caminhoDestinoMiniatura + _nomePastaArquivoOrigem, _caminhoOrigemMiniatura);
                                trans.Rollback();
                                if (itemPastaArquivo.TipoArquivoPasta == 'D')
                                {
                                    itemPastaArquivo.MensagemsRetorno = "Falha ao tentar mover a pasta: <strong>" + itemPastaArquivo.NomePastaArquivo + "</strong>. Pasta não movida.";
                                }
                                else if (itemPastaArquivo.TipoArquivoPasta == 'A')
                                {
                                    itemPastaArquivo.MensagemsRetorno = "Falha ao tentar mover o arquivo: <strong>" + itemPastaArquivo.NomePastaArquivo + "</strong>. Arquivo não movido.";
                                }
                                itemPastaArquivo.StatusRetorno = -1;
                                continue;
                            }

                            if (itemPastaArquivo.TipoArquivoPasta == 'D')
                            {
                                _qtdPastaMovido++;
                            }
                            else if (itemPastaArquivo.TipoArquivoPasta == 'A')
                            {
                                _qtdArquivoMovido++;
                            }

                       //     itemPastaArquivo.CodigoPastaArquivo = _codigoPastaArquivo;

                            MoverPastaArquivoDesfazerMoverLista PastaArquivoMovido = new MoverPastaArquivoDesfazerMoverLista();
                            MoverPastaArquivoNomeMovidos NomePastaArquivoMovido = new MoverPastaArquivoNomeMovidos();
                            if (_cookieItensMovidos != null)
                            {
                                foreach (var itemJaMovido in RetornoPastasArquivosMovidos.ListPasArqMov)
                                {
                                    if (itemJaMovido.CodPasArq == _codigoPastaArquivo)
                                    {
                                        RetornoPastasArquivosMovidos.ListPasArqMov.Remove(itemJaMovido);
                                        break;
                                    }
                                    Console.Write(itemJaMovido.CodPasArq+" == ");
                                    Console.Write(_codigoPastaArquivo);
                                }
                                
                            }
                            PastaArquivoMovido.CodPasArq = _codigoPastaArquivo;
                            NomePastaArquivoMovido.NomePastaArquivo = itemPastaArquivo.NomePastaArquivo;
                            NomePastaArquivoMovido.CaminhoOriginal = itemPastaArquivo.CaminhoOriginal;
                            NomePastaArquivoMovido.TipoArquivoPasta = itemPastaArquivo.TipoArquivoPasta;

                        //    PastaArquivoMovido.NomePastaArquivo = itemPastaArquivo.NomePastaArquivo;
                       //     PastaArquivoMovido.TipoArquivoPasta = itemPastaArquivo.TipoArquivoPasta;
                       //     PastaArquivoMovido.DataMoverArquivoPasta = DateTime.Now.ToUniversalTime();

                        //    RetornoPastasArquivosMovidos.ListaPastaArquivoMovidos.Add(PastaArquivoMovido);

                            ListaPastaArquivoMovido.Add(PastaArquivoMovido);
                            ListaNomePastaArquivoMovido.Add(NomePastaArquivoMovido);
                            
                            trans.Commit();
                        }
                    }
                    else
                    {
                        if (itemPastaArquivo.TipoArquivoPasta == 'D')
                        {
                            itemPastaArquivo.MensagemsRetorno = "A pasta <strong>" + itemPastaArquivo.NomePastaArquivo + "</strong> não foi localizada. Ela pode ter sido removida ou renomeada.";
                            itemPastaArquivo.StatusRetorno = -1;
                        }
                        else if (itemPastaArquivo.TipoArquivoPasta == 'A')
                        {
                            itemPastaArquivo.MensagemsRetorno = "O arquivo <strong>" + itemPastaArquivo.NomePastaArquivo + "</strong> não foi localizado. Ele pode ter sido removido ou renomeado.";
                            itemPastaArquivo.StatusRetorno = -1;
                        }
                        continue;
                    }

                    //try
                    //{
                    //    var diretoriosArquivos = new NewPhotoCloudDiretoriosArquivos
                    //    {

                    //        Dia_Nome = _novaPasta,
                    //        Dia_CaminhoAtual = _caminhoNovaPasta,
                    //        Dia_DataCriacao = DateTime.Now.ToUniversalTime(),
                    //        Dia_Tipo = "D",
                    //        Dia_Status = "A",
                    //        Dia_Fk_Usu_id = _usu_id

                    //    };

                    //    diretoriosArquivosContex.CloudDiretoriosArquivos.Add(diretoriosArquivos);

                    //    //   s.Entry(diretoriosArquivos).State = EntityState.Modified;
                    //    diretoriosArquivosContex.SaveChanges();
                    //}
                    //catch (Exception e)
                    //{
                    //    trans.Rollback();
                    //    if (itemPastaArquivo.TipoArquivoPasta == 'D')
                    //    {
                    //        itemPastaArquivo.MensagemsRetorno = "Falha ao registrar a pasta: <strong>" + itemPastaArquivo.NomePastaArquivo + "</strong>";
                    //    }
                    //    else if (itemPastaArquivo.TipoArquivoPasta == 'A') {
                    //        itemPastaArquivo.MensagemsRetorno = "Falha ao registrar o arquivo: <strong>" + itemPastaArquivo.NomePastaArquivo + "</strong>";
                    //    }
                    
                    //    itemPastaArquivo.StatusRetorno = -1;

                    //}

                    //trans.Commit();
                }



                

            }

            moverPastaArquivo.QtdPastaMovida = _qtdPastaMovido;
            moverPastaArquivo.QtdArquivoMovido = _qtdArquivoMovido;

            if (_qtdPastaMovido == 0 && _qtdArquivoMovido == 0)
            {
                ViewBag.Message = "Nenhum item selecionado  foi movido.";
                ViewBag.Status = 1;
            }
        //    string teste = moverPastaArquivo.CaminhoPastaPai;


            if (moverPastaArquivo.EstadoPasta == "aberta"){
                //string _caminhoRetornoAberta = moverPastaArquivo.CaminhoRetorno.Substring(0, moverPastaArquivo.CaminhoRetorno.LastIndexOf("/"));
                //_caminhoRetornoAberta = _caminhoRetornoAberta.Substring(0, _caminhoRetornoAberta.LastIndexOf("/"));
                //ViewBag.CaminhoRetorno = _caminhoRetornoAberta +"/";
                ViewBag.CaminhoRetorno = moverPastaArquivo.CaminhoPastaPai;
            }
            else{
                 ViewBag.CaminhoRetorno = moverPastaArquivo.CaminhoRetorno;
            }

            if (_cookieItensMovidos != null)
            {
                foreach (var itemMovido in RetornoPastasArquivosMovidos.ListPasArqMov)
                {
                        MoverPastaArquivoDesfazerMoverLista PastaArquivoMovido = new MoverPastaArquivoDesfazerMoverLista();

                        PastaArquivoMovido.CodPasArq = itemMovido.CodPasArq;
                            ListaPastaArquivoMovido.Add(PastaArquivoMovido);

                }

            }

            RetornoPastasArquivosMovidos.DtMovArqPas = DateTime.Now.ToUniversalTime();
            RetornoPastasArquivosMovidos.ListPasArqMov = ListaPastaArquivoMovido;

          //  string _jsonListaPastasArquivosMovidos = new JavaScriptSerializer().Serialize(Json.Encode(RetornoPastasArquivosMovidos));

            string _jsonListaPastasArquivosMovidos = JsonConvert.SerializeObject(RetornoPastasArquivosMovidos);
            string _jsonListaNomePastasArquivosMovidos = "{\"ListPasArqMov\":" + JsonConvert.SerializeObject(ListaNomePastaArquivoMovido)+"}";

             HttpCookie CookieListaPastaArquivoMovidos = new HttpCookie(ConverterMD5.getMD5Hash("ListaPastasArquivosMovidos")); //6DCF4293C1633A918B283205FB5A67E5

             CookieListaPastaArquivoMovidos.Values.Add("PasArqMov", _jsonListaPastasArquivosMovidos); 
            CookieListaPastaArquivoMovidos.Expires = DateTime.Now.AddMinutes(5);
            System.Web.HttpContext.Current.Response.Cookies.Add(CookieListaPastaArquivoMovidos);

       //     Console.WriteLine(moverPastaArquivo);

            ViewBag.JsonMovidos = _jsonListaNomePastasArquivosMovidos;

            return PartialView(moverPastaArquivo);
        }
    }
}