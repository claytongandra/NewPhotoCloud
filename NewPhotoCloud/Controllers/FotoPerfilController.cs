using NewPhotoCloud.Repositories;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace NewPhotoCloud.Controllers
{
    public class FotoPerfilController : Controller
    {
        [HttpPost]
        public ActionResult CriarFotoPerfil(HttpPostedFileBase file_fotoPerfil)
        {

            string _resultadoUpImagem = null;

            UsuarioContext usuarioContext = new UsuarioContext();

            UsuarioLogado infoUsuarioLogado = new UsuarioLogado();
            
            

            var _infoUsuarioLogado = infoUsuarioLogado.GetUsuarioLogado(User.Identity.Name);

            try
            {

                string fileExt = Path.GetExtension(file_fotoPerfil.FileName).Replace(@".", @"").ToLower(); ;
                if (file_fotoPerfil != null)
                {
                    if (file_fotoPerfil.ContentLength > 0)
                    {
                        if (fileExt != "jpg" && fileExt != "png" && fileExt != "gif")
                        {
                            //  Response.Status = "804 Tipo de arquivo não permitido";
                            ViewBag.Message = "Tipo de arquivo não permitido.  <br />Selecione apenas arquivos de imagem (.jpg, .png ou .gif). ";
                            ViewBag.Status = -1;
                            return PartialView();
                        }
                        else
                        {
                            var v = file_fotoPerfil.ContentLength;
                            if (file_fotoPerfil.ContentLength > 3145728)  //3145728  bytes  = 3 Mb
                            {
                                ViewBag.Message = "O Tamanho do arquivo não permitido. <br />Selecione uma imagem de até 3Mb";
                                ViewBag.Status = -1;
                                return PartialView();
                            }   
                            else
                            { 
                                _resultadoUpImagem = UsuarioFotoPerfil.UploadFileUsuarioFotoPerfil(file_fotoPerfil);

                                var usuarioAlterado = new NewPhotoCloudUsuarios
                                {

                                    Usu_Id = _infoUsuarioLogado.Usu_Id,
                                    Usu_Nome = _infoUsuarioLogado.Usu_Nome,
                                    Usu_SobreNome = _infoUsuarioLogado.Usu_SobreNome,
                                    Usu_DataNascimento = _infoUsuarioLogado.Usu_DataNascimento,
                                    Usu_DiretorioBase = _infoUsuarioLogado.Usu_DiretorioBase,
                                    Usu_FotoPerfil = _resultadoUpImagem,
                                    Usu_Nivel = _infoUsuarioLogado.Usu_Nivel,
                                    Usu_DataCadastro = _infoUsuarioLogado.Usu_DataCadastro,
                                    Usu_Status = _infoUsuarioLogado.Usu_Status

                                };

                                //  UsuarioFotoPerfil.UploadFileUsuarioFotoPerfil(file);
                                if (_resultadoUpImagem == null || _resultadoUpImagem == "")
                                {
                                    ViewBag.Message = "Falha ao alterar a foto do perfil. ";
                                    ViewBag.Status = -1;
                                    return PartialView();
                                }
                                else
                                {
                                    usuarioContext.Entry(usuarioAlterado).State = EntityState.Modified;
                                    usuarioContext.SaveChanges();
                                    ViewBag.Message = "Foto do perfil foi alterada com sucesso.";
                                    ViewBag.Status = 0;
                                    ViewBag.Caminho = "pho_usuario/" + _infoUsuarioLogado.Usu_DiretorioBase + "/" + _resultadoUpImagem;
                                    return PartialView();
                                }
                            }
                        }
                    }
                    else
                    {
                        ViewBag.Message = "O Conteudo do Arquivo esta vazio. ";
                        ViewBag.Status = -1;
                        return PartialView();
                    }
                }
                else
                {
                    ViewBag.Message = "O Arquivo é nulo. ";
                    ViewBag.Status = -1;
                    return PartialView();

                }
            }
            catch (Exception e)
            {
                // return Content("Falha ao criar a pasta: {0}", e.ToString());
                ViewBag.Message = "Falha ao alterar a foto do perfil.";
                ViewBag.Status = -1;
                return PartialView();
            }


        }
    }
}