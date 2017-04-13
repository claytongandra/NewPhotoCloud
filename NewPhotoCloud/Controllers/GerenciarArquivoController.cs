using NewPhotoCloud.Repositories;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Mvc;

namespace NewPhotoCloud.Controllers
{
    public class GerenciarArquivoController : Controller
    {
        private DiretoriosArquivosContext diretoriosArquivosContex = new DiretoriosArquivosContext();

        // GET: GerenciarArquivo
        [HttpPost]
        public ActionResult UploadSelecionarArquivos(FormCollection Postpath)
        {
            string _caminhoSolicitado = Postpath["pasta"];
            string _pastaAtual = "";
            string _diretorioPai = "";
            //string _caminhoCompleto = "";
            //string _diretorioBaseUsuario = "";

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
            else
            {
                _diretorioPai = _pastaAtual.Substring(0, _pastaAtual.LastIndexOf("/")) + "/";
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
           
            return PartialView();
        }

        [HttpPost]
        public JsonResult UploadArquivos(IEnumerable<HttpPostedFileBase> file_upload, FormCollection PostFile)
        {

            string _caminho = PostFile.Get("hidcaminho");
            string _arquivo = "";
            string _retorno = "";
            string _extencao = "";
            string _nomeArquivo = "";
            string _nomeArquivoOriginal = null;
            string _nomeArquivoSemExtencao = "";
            string _caminhoCompleto = null;
            string _caminhoCompletoMini = null;
            string _diretorioBaseUsuario = null;
            int? _usu_id;

            try
            {
                UsuarioContext usuarioAcesso = new UsuarioContext();

                var _retornoQueryUser = (from usuarioInfoAcesso in usuarioAcesso.CloudUsuariosAcesso
                                     where usuarioInfoAcesso.Uac_UserName == User.Identity.Name
                                     select usuarioInfoAcesso).SingleOrDefault();

                _diretorioBaseUsuario = _retornoQueryUser.Uac_Fk.Usu_DiretorioBase;
                _usu_id = _retornoQueryUser.Uac_Fk.Usu_Id;

                if (_diretorioBaseUsuario != null)
                {
                    if (file_upload != null && _caminho != null)
                    {
                        foreach (var file in file_upload)
                        {
                            if (file.ContentLength > 0)
                            {
                                using (var trans = diretoriosArquivosContex.Database.BeginTransaction(IsolationLevel.ReadCommitted))
                                {
                                    FileInfo fileInfo = new FileInfo(file.FileName);
                                    _nomeArquivoOriginal = null;
                                   // _nomeArquivo = file.FileName;
                                    _nomeArquivoSemExtencao = Path.GetFileNameWithoutExtension(file.FileName);
                                    _extencao = fileInfo.Extension.ToLower();

                           //         string pattern = "/^[^\\/:;,.*?&\"\'<>«»]+$/";
                                    string pattern = "[\\/:;,.*?&\"\'<>«»]";
                                    string replacement = "-";
                                   
                                    Regex rgx = new Regex(pattern);

                                    if (rgx.IsMatch(_nomeArquivoSemExtencao))
                                    {
                                        _nomeArquivoOriginal = file.FileName;
                                    }
                                    _nomeArquivoSemExtencao = rgx.Replace(_nomeArquivoSemExtencao, @replacement);

                                    if (_nomeArquivoSemExtencao.Length > 50)
                                    {
                                        _nomeArquivoOriginal = file.FileName;
                                        _nomeArquivoSemExtencao = _nomeArquivoSemExtencao.Substring(0, 50);
                                            //_caminhoSolicitado.Substring(1, _caminhoSolicitado.LastIndexOf("/") - 1);
                                    }

                                    _nomeArquivo = _nomeArquivoSemExtencao + _extencao;
                                    try
                                    {
                                        var diretoriosArquivos = new NewPhotoCloudDiretoriosArquivos
                                        {

                                            Dia_Nome = _nomeArquivo,
                                            Dia_NomeOriginal = _nomeArquivoOriginal,
                                            Dia_CaminhoAtual = _caminho,
                                            Dia_DataCriacao = DateTime.Now.ToUniversalTime(),
                                            Dia_Tipo = "A",
                                            Dia_Status = "A",
                                            Dia_Fk_Usu_id = _usu_id

                                        };

                                        diretoriosArquivosContex.CloudDiretoriosArquivos.Add(diretoriosArquivos);

                                        //   s.Entry(diretoriosArquivos).State = EntityState.Modified;
                                        diretoriosArquivosContex.SaveChanges();
                                    }
                                    catch (Exception ex)
                                    {
                                        trans.Rollback();
                                        //ViewBag.Message = "Falha ao registrar a arquivo: <strong>" + file.FileName + "</strong>";
                                        //ViewBag.Status = -1;
                                        //_retorno = ex.Message;
                                        //return Json(_retorno);
                                        Response.Status = "800 Falha ao registrar a arquivo: <strong>" + _nomeArquivo + "</strong>";
                                    }
                                    try
                                    {

                                        _caminhoCompleto = Server.MapPath("~/pho_fotos/" + _diretorioBaseUsuario + _caminho + (_nomeArquivo).Replace(@"+", @"plus"));
                                        _caminhoCompletoMini = Server.MapPath("~/pho_fotos_miniatura/" + _diretorioBaseUsuario + _caminho + (_nomeArquivo).Replace(@"+", @"plus"));

                                    }
                                    catch (Exception e)
                                    {
                                        trans.Rollback();
                                        Response.Status = "799 Falha ao configurar arquivo: <strong>" + _nomeArquivo + "</strong> Caminho muito extenso.";
                                    }

                                    if (_caminhoCompletoMini.Length >= 248)
                                    {

                                        trans.Rollback();
                                        ViewBag.Message = "798 Falha ao carregar arquivo: <strong>" + _nomeArquivo + "</strong> Caminho muito extenso.";

                                    }
                                   
                                    
                                    _extencao = _extencao.Replace(@".", @"");
                                    if (_extencao != "jpg" && _extencao != "png" && _extencao != "gif" && _extencao != "mp4" && _extencao != "wmv" && _extencao != "mpg")
                                    {
                                        trans.Rollback();
                                        Response.Status = "804 Tipo de arquivo não permitido";

                                    }
                                    else
                                    {
                                        if (System.IO.File.Exists(_caminhoCompleto))
                                        {
                                            // ViewBag.Message = "O Arquivo Já existe na pasta: " +_caminho;
                                         //   Response.StatusCode = 801;
                                            trans.Rollback();
                                            Response.Status = "801 O Arquivo Já existe na pasta";
                                        }
                                        else
                                        {
                                            var v = file.ContentLength;
                                            if (file.ContentLength > 104857600)
                                            {
                                           //     Response.StatusCode = 805;
                                                trans.Rollback();
                                                Response.Status = "805 O Tamanho do arquivo não permitido";
                                            }
                                            else
                                            {
                                                try
                                                {
                                                    file.SaveAs(_caminhoCompleto);
                                                    _arquivo = _arquivo + _nomeArquivo;

                                                    //System.Drawing.Image img = System.Drawing.Image.FromFile(serverPath);
                                                    //System.Drawing.Image thumb = img.GetThumbnailImage(175, 175, null, IntPtr.Zero);
                                                    //img.Dispose();
                                                    //thumb.Save(serverPathMini);


                                                    int thumbHeight = 175;
                                                    int thumbWidth = 175;
                                                    ImageFormat image_format = null;

                                                    //Stream objStream = new StreamReader(serverPath).BaseStream;
                                                    //BinaryReader objBinaryReader = new BinaryReader(objStream);
                                                    //int i = (int)objStream.Length;
                                                    //byte[] arrBytes = objBinaryReader.ReadBytes(i);
                                                    //System.IO.MemoryStream memoryStream = new System.IO.MemoryStream(arrBytes);
                                                    //System.Drawing.Image image = System.Drawing.Image.FromStream(memoryStream);

                                                    System.Drawing.Image image = System.Drawing.Image.FromFile(_caminhoCompleto);

                                                    System.Drawing.Image thumbnail = image.GetThumbnailImage(thumbWidth, thumbHeight, null, IntPtr.Zero);
                                                    //System.Drawing.Image thumbnail = new Bitmap(thumbWidth, thumbHeight);

                                                    System.Drawing.Graphics graphic = System.Drawing.Graphics.FromImage(thumbnail);

                                                    // Melhoria da nova imagem
                                                    // graphic.Clear(Color.White);
                                                    graphic.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;
                                                    graphic.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.HighQuality;
                                                    graphic.PixelOffsetMode = System.Drawing.Drawing2D.PixelOffsetMode.HighQuality;
                                                    graphic.CompositingQuality = System.Drawing.Drawing2D.CompositingQuality.HighQuality;

                                                    // Desenha a nova imagem
                                                    graphic.DrawImage(image, 0, 0, thumbWidth, thumbHeight);


                                                    // Aplica a codificação necessária
                                                    System.Drawing.Imaging.ImageCodecInfo[] info = System.Drawing.Imaging.ImageCodecInfo.GetImageEncoders();
                                                    System.Drawing.Imaging.EncoderParameters encoderParameters;
                                                    encoderParameters = new System.Drawing.Imaging.EncoderParameters(3);
                                                    encoderParameters.Param[0] = new System.Drawing.Imaging.EncoderParameter(System.Drawing.Imaging.Encoder.ColorDepth, 24);
                                                    encoderParameters.Param[1] = new System.Drawing.Imaging.EncoderParameter(System.Drawing.Imaging.Encoder.Compression, 0);
                                                    encoderParameters.Param[2] = new System.Drawing.Imaging.EncoderParameter(System.Drawing.Imaging.Encoder.Quality, 100L);

                                                    // Exibe a imagem em forma de JPG

                                                    switch (_extencao)
                                                    {
                                                        case "png":
                                                            Response.AddHeader("Response-Type", "image/png");
                                                            Response.ContentType = "image/png";
                                                            image_format = ImageFormat.Png;
                                                            thumbnail.Save(_caminhoCompletoMini, image_format);
                                                            break;
                                                        case "gif":
                                                            Response.AddHeader("Response-Type", "image/gif");
                                                            Response.ContentType = "image/gif";
                                                            //   image_format = ImageFormat.Gif;
                                                            thumbnail.Save(_caminhoCompletoMini);
                                                            break;
                                                        case "jpg":
                                                            Response.AddHeader("Response-Type", "image/jpeg");
                                                            Response.ContentType = "image/jpeg";
                                                            thumbnail.Save(_caminhoCompletoMini, info[1], encoderParameters);
                                                            break;
                                                        default:
                                                            thumbnail.Save(_caminhoCompletoMini);
                                                            break;
                                                    }


                                                    thumbnail.Dispose();
                                                    image.Dispose();
                                                    graphic.Dispose();
                                                }
                                                catch (Exception ex)
                                                {
                                                    trans.Rollback();
                                                    Response.Status = ex.Message;// "797 Falha ao criar miniatura: <strong>" + file.FileName + "</strong>.";
                                                }
                                            }
                                        }
                                    }

                                    trans.Commit();

                                } //trans
                            }
                            else
                            {
                                Response.Status = "802 O Conteudo do Arquivo é 0";
                            }
                        } //foreach
                    } //file_upload != null && _caminho != null
                    else
                    {
                        Response.Status = "803 O Arquivo é nullo.";
                    }
                   
                } //_diretorioBaseUsuario != null
            }
            catch (Exception ex)
            {
                //    ViewBag.Message = "Erro "+ ex.Message;
                _retorno = ex.Message;
            }
            return Json(_extencao);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult RenomearArquivo(FormCollection PostFolder)
        {
            string _caminhoSolicitadoArquivo = PostFolder["hidCaminhoComp"];
            string _novoNomeArquivo = PostFolder["NomeArquivo"];
            string _novoNomeArquivoSemExtencao = _novoNomeArquivo;
            string _diretorioBaseUsuario = null;
            string _caminhoSemArquivo = null;
            string _antigoNomeArquivo = null;
            string _antigoNomeArquivoSemExtencao = null;
            string _arquivoExtencao = null;

            string _caminhoMiniArquivoOriginal = null;
            string _caminhoArquivoOriginal = null;
            string _caminhoMiniArquivoAlterado = null;
            string _caminhoArquivoAlterado = null;

            UsuarioContext usuarioAcesso = new UsuarioContext();

            var _retornoQueryUser = (from usuarioInfoAcesso in usuarioAcesso.CloudUsuariosAcesso
                                     where usuarioInfoAcesso.Uac_UserName == User.Identity.Name
                                     select usuarioInfoAcesso).SingleOrDefault();

            _diretorioBaseUsuario = _retornoQueryUser.Uac_Fk.Usu_DiretorioBase;

            Encoding iso = Encoding.GetEncoding("ISO-8859-1");

            

            _caminhoSolicitadoArquivo = HttpUtility.UrlDecode(_caminhoSolicitadoArquivo, iso);

            _caminhoSemArquivo = _caminhoSolicitadoArquivo.Substring(0, _caminhoSolicitadoArquivo.LastIndexOf("/"));

            _antigoNomeArquivo = Path.GetFileName(_caminhoSolicitadoArquivo);

            _antigoNomeArquivoSemExtencao = Path.GetFileNameWithoutExtension(_antigoNomeArquivo);

            FileInfo arquivoInfo = new FileInfo(_antigoNomeArquivo);

            _arquivoExtencao = arquivoInfo.Extension.ToLower();

            _novoNomeArquivo = _novoNomeArquivo.Trim() + _arquivoExtencao;

             diretoriosArquivosContex.Configuration.AutoDetectChangesEnabled = false;

           using (var trans = diretoriosArquivosContex.Database.BeginTransaction(IsolationLevel.ReadCommitted))
           {

                try
               {
                   var _retornoQueryDiretorioArquivo = (from dirArquiInfo in diretoriosArquivosContex.CloudDiretoriosArquivos
                                                        where dirArquiInfo.Dia_Nome == _antigoNomeArquivo
                                                        && dirArquiInfo.Dia_CaminhoAtual == _caminhoSemArquivo + "/"
                                                        && dirArquiInfo.Dia_Fk_Usu_id == _retornoQueryUser.Uac_Fk.Usu_Id
                                                        select dirArquiInfo).AsNoTracking().SingleOrDefault();

                   var diretoriosArquivos = new NewPhotoCloudDiretoriosArquivos
                   {

                       Dia_Id = _retornoQueryDiretorioArquivo.Dia_Id,
                       Dia_Fk_Usu_id = _retornoQueryUser.Uac_Fk.Usu_Id,
                       Dia_Nome = _novoNomeArquivo,
                       Dia_CaminhoOriginal = _retornoQueryDiretorioArquivo.Dia_CaminhoOriginal,
                       Dia_CaminhoAtual = _retornoQueryDiretorioArquivo.Dia_CaminhoAtual,
                       Dia_Tipo = _retornoQueryDiretorioArquivo.Dia_Tipo,
                       Dia_DataCriacao = _retornoQueryDiretorioArquivo.Dia_DataCriacao,
                       Dia_DataExclusao = _retornoQueryDiretorioArquivo.Dia_DataExclusao,
                       Dia_Status = _retornoQueryDiretorioArquivo.Dia_Status
                   };

                   diretoriosArquivosContex.Entry(diretoriosArquivos).State = EntityState.Modified;
                   diretoriosArquivosContex.SaveChanges();
               }
                catch (Exception e)
                {
                    trans.Rollback();
                    ViewBag.Message = "Falha ao registrar a alteração do arquivo: <strong>" + _novoNomeArquivo + "</strong>";
                    ViewBag.Status = -1;
                    ViewBag.CaminhoRetorno = _caminhoSemArquivo + "/";
                    ViewBag.ArquivoRetorno = _antigoNomeArquivoSemExtencao;
                    ViewBag.ExtencaoRetorno = _arquivoExtencao;
                    return PartialView();
                }

                try
                {
                    _caminhoMiniArquivoOriginal = Server.MapPath("~/pho_fotos_miniatura/" + _diretorioBaseUsuario + _caminhoSemArquivo + "/" + _antigoNomeArquivo);
                    _caminhoArquivoOriginal = Server.MapPath("~/pho_fotos/" + _diretorioBaseUsuario + _caminhoSemArquivo + "/" + _antigoNomeArquivo);

                    _caminhoMiniArquivoAlterado = Server.MapPath("~/pho_fotos_miniatura/" + _diretorioBaseUsuario + _caminhoSemArquivo + "/" + _novoNomeArquivo);
                    _caminhoArquivoAlterado = Server.MapPath("~/pho_fotos/" + _diretorioBaseUsuario + _caminhoSemArquivo + "/" + _novoNomeArquivo);

                }
                catch (Exception e)
                {
                    trans.Rollback();
                    ViewBag.Message = "Falha ao renomear o arquivo de  <strong>" + _antigoNomeArquivo + "</strong> para <strong>" + _novoNomeArquivo + "</strong>. <br /> Caminho muito extenso.";
                    ViewBag.Status = -1;
                    ViewBag.CaminhoRetorno = _caminhoSemArquivo + "/";
                    ViewBag.ArquivoRetorno = _antigoNomeArquivoSemExtencao;
                    ViewBag.ExtencaoRetorno = _arquivoExtencao;
                    return PartialView();
                }
                if (_caminhoMiniArquivoAlterado.Length >= 248)
                {

                    trans.Rollback();
                    ViewBag.Message = "Não é possível renomear o arquivo <strong>" + _antigoNomeArquivo + "</strong>  para <strong>" + _novoNomeArquivo + "</strong>. <br /> Caminho muito extenso.";
                    ViewBag.Status = 1;
                    ViewBag.CaminhoRetorno = _caminhoSemArquivo + "/";
                    ViewBag.ArquivoRetorno = _antigoNomeArquivoSemExtencao;
                    ViewBag.ExtencaoRetorno = _arquivoExtencao;
                    return PartialView();
                }
                if (System.IO.File.Exists(_caminhoArquivoAlterado))
                {

                    trans.Rollback();
                    ViewBag.Message = "O arquivo <strong>" + _novoNomeArquivo + "</strong> já existe na pasta.";
                    ViewBag.Status = 1;
                    ViewBag.CaminhoRetorno = _caminhoSemArquivo + "/";
                    ViewBag.ArquivoRetorno = _antigoNomeArquivoSemExtencao;
                    ViewBag.ExtencaoRetorno = _arquivoExtencao;
                    return PartialView();
                }

                try
                {
                    //System.IO.Directory.Move(Server.MapPath(@"\pasta"), Server.MapPath(@"\pasta renomeada"));

                    System.IO.File.Move(@_caminhoMiniArquivoOriginal, @_caminhoMiniArquivoAlterado);
                }
                catch (Exception e)
                {
                    trans.Rollback();
                    ViewBag.Message = "Falha ao renomear a miniatura de <strong>" + _antigoNomeArquivo + "</strong> para <strong>" + _novoNomeArquivo + "</strong>.";
                    ViewBag.Status = -1;
                    ViewBag.CaminhoRetorno = _caminhoSemArquivo + "/";
                    ViewBag.ArquivoRetorno = _antigoNomeArquivoSemExtencao;
                    ViewBag.ExtencaoRetorno = _arquivoExtencao;
                    return PartialView();
                }

                try
                {
                    System.IO.File.Move(_caminhoArquivoOriginal, _caminhoArquivoAlterado);
                }
                catch (Exception e)
                {
                    System.IO.File.Move(@_caminhoMiniArquivoAlterado, @_caminhoMiniArquivoOriginal);
                    trans.Rollback();
                    ViewBag.Message = "Falha ao renomear o arquivo de  <strong>" + _antigoNomeArquivo + "</strong> para <strong>" + _novoNomeArquivo + "</strong>.";
                    ViewBag.Status = -1;
                    ViewBag.CaminhoRetorno = _caminhoSemArquivo + "/";
                    ViewBag.ArquivoRetorno = _antigoNomeArquivoSemExtencao;
                    ViewBag.ExtencaoRetorno = _arquivoExtencao;
                    return PartialView();
                }
               trans.Commit();
           }
           ViewBag.Message = "O arquivo <strong>" + _antigoNomeArquivo + "</strong> foi renomeado para <strong>" + _novoNomeArquivo + "</strong> com sucesso.";
            ViewBag.Status = 0;
            ViewBag.CaminhoRetorno = _caminhoSemArquivo + "/";
            ViewBag.ArquivoRetorno = _novoNomeArquivoSemExtencao;
            ViewBag.ExtencaoRetorno = _arquivoExtencao;
            return PartialView();
        }
    }
}