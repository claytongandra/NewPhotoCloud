using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data.Entity;
using NewPhotoCloud.Models;
using NewPhotoCloud.Repositories;
using System.IO;

namespace NewPhotoCloud.Controllers
{
    public class ModalController : Controller
    {
        [HttpPost]
        public ActionResult CriarPastaModal(FormCollection PostForm)
        {
            string _pastaAtual = PostForm["pastaAtual"];
            string _caminhoCompleto = PostForm["caminhoCompleto"];

            CriarPasta novapasta = new CriarPasta();

          //  novapasta.NomePasta = _pastaAtual;
            novapasta.CaminhoPasta = _caminhoCompleto;

            return PartialView(novapasta);
        }

        [HttpPost]
        public ActionResult RenomearPastaModal(FormCollection PostForm)
        {
            string _pastaAtual = PostForm["pastaAtual"];
            string _caminhoCompleto = PostForm["caminhoCompleto"];

            RenomearPasta renomearpasta = new RenomearPasta();

            renomearpasta.NomePasta = _pastaAtual;
            renomearpasta.CaminhoPasta = _caminhoCompleto;

            return PartialView(renomearpasta);
        }

        [HttpPost]
        public ActionResult RenomearArquivoModal(FormCollection PostForm)
        {
            string _nomeArquivoAtual = PostForm["nomeArquivoAtual"];
            string _caminhoCompleto = PostForm["caminhoCompleto"];

            RenomearArquivo renomeararquivo = new RenomearArquivo();

            FileInfo arquivoInfo = new FileInfo(_nomeArquivoAtual);

            renomeararquivo.NomeArquivo = Path.GetFileNameWithoutExtension(_nomeArquivoAtual); ;
            renomeararquivo.ExtencaoArquivo = arquivoInfo.Extension;
            renomeararquivo.CaminhoArquivo = _caminhoCompleto;

            return PartialView(renomeararquivo);
        }

        [HttpPost]
        public ActionResult MoverPastaArquivoModal()
      //       public ActionResult MoverPastaArquivoModal(FormCollection PostForm)
        {


      //      string _nomeArquivoPasta = PostForm["nomeArquivoPasta"];
      //      string _caminhoCompleto = PostForm["caminhoCompleto"];
      //      string _caminhoRetorno = PostForm["caminhoRetorno"];
      //      string _estadoPasta = PostForm["estadoPasta"];
      //      string _tipo = PostForm["tipoArquivoPasta"];
      ////      string _diretorioBaseUsuario = "";

      //      ViewData["nomeArquivoPasta"] = _nomeArquivoPasta;

      //      if (_caminhoRetorno == "" || _caminhoRetorno == null)
      //      {
      //          _caminhoRetorno = "/";
      //      }

      //      if (_tipo == "A")
      //      {

      // //         _caminhoCompleto = _caminhoCompleto.Substring(0, _caminhoCompleto.LastIndexOf("/"));
      //          _caminhoCompleto = _caminhoCompleto.Substring(0, _caminhoCompleto.LastIndexOf("/") + 1);
      //      } 
           
      //      ViewData["caminhoCompleto"] = _caminhoCompleto;

      //      if (_estadoPasta == "aberta")
      //      {
      //          _caminhoRetorno = _caminhoRetorno.Substring(0, _caminhoRetorno.LastIndexOf("/"));
      //          _caminhoRetorno = _caminhoRetorno.Substring(0, _caminhoRetorno.LastIndexOf("/") + 1);
      //      }
      //      ViewData["caminhoRetorno"] = _caminhoRetorno;
      //      ViewData["tipoArquivoPasta"] = _tipo;


            UsuarioLogado infoUsuarioLogado = new UsuarioLogado();

            var _infoUsuarioLogado = infoUsuarioLogado.GetUsuarioLogado(User.Identity.Name);
                                                                                                         //int prmIdUsuario, string prmDiretorio, string prmTipo, string prmStatus)
            ListaDiretoriosArquivos list_diretoriosArquivos = ListaDiretoriosArquivosBaseDados.RetornaDiretoriosArquivosBaseDados(_infoUsuarioLogado.Usu_Id, "/", "D", "A");

            return PartialView(list_diretoriosArquivos);
        }
        
        [HttpPost]
        public ActionResult DesfazerMoverPastaArquivoModal(MoverPastaArquivoDesfazerMover desfazerPastaArquivoMovidos)
        {
            UsuarioContext usuarioAcessoContext = new UsuarioContext();
            
            DiretoriosArquivosContext diretoriosArquivosContext = new DiretoriosArquivosContext();

           // string _arrayIdPastaArquivo = "";
            int i = 0;
            int?[] _arrayIdPastaArquivo = {};
            _arrayIdPastaArquivo = new int?[desfazerPastaArquivoMovidos.ListPasArqMov.Count];
          
            foreach (var dirArqMovidos in desfazerPastaArquivoMovidos.ListPasArqMov)
            {
   
               _arrayIdPastaArquivo[i] = Int32.Parse(CryptographyRepository.Descriptografar(dirArqMovidos.CodPasArq));
               i++;
            }

            var _retornoQueryUser = (from usuarioInfoAcesso in usuarioAcessoContext.CloudUsuariosAcesso
                                     where usuarioInfoAcesso.Uac_UserName == User.Identity.Name
                                     select usuarioInfoAcesso).SingleOrDefault();

            var _retornoQueryDiretorioArquivo = (from dirArquiInfo in diretoriosArquivosContext.CloudDiretoriosArquivos
                                                 where dirArquiInfo.Dia_Fk_Usu_id == _retornoQueryUser.Uac_Fk.Usu_Id
                                                 && _arrayIdPastaArquivo.Contains(dirArquiInfo.Dia_Id)
                                                 select dirArquiInfo).ToList();
            
          //  _IdPastaArquivo = CryptographyRepository.Criptografar(_retornoQueryDiretorioArquivo.Dia_Id.ToString());
            List<MoverPastaArquivo> desfazerPastaArquivoMovidosLista = new List<MoverPastaArquivo>();

            foreach (var itemRetornoQuery in _retornoQueryDiretorioArquivo)
            {
                MoverPastaArquivo pastaArquivoMovidosQuery = new MoverPastaArquivo();

                pastaArquivoMovidosQuery.CodigoPastaArquivo = CryptographyRepository.Criptografar(itemRetornoQuery.Dia_Id.ToString());
                pastaArquivoMovidosQuery.NomePastaArquivo = itemRetornoQuery.Dia_Nome;
                

                desfazerPastaArquivoMovidosLista.Add(pastaArquivoMovidosQuery);
            }
            return PartialView(desfazerPastaArquivoMovidosLista);
        }

        [HttpPost]
        public ActionResult CriarFotoPerfilModal(FormCollection PostForm)
        {
             string _usuarioFotoPerfil = null;
             string _caminhoAvatar = "Content/pho_images/phoimg_icones/default_avatar_vs1.jpg ";
            
            NewPhotoCloud.Models.GerenciarFotoPerfil.CriarFotoPerfil criarFotoPerfil = new NewPhotoCloud.Models.GerenciarFotoPerfil.CriarFotoPerfil();
             
            UsuarioLogado infoUsuarioLogado = new UsuarioLogado();

            var _infoUsuarioLogado = infoUsuarioLogado.GetUsuarioLogado(User.Identity.Name);

            _usuarioFotoPerfil = _infoUsuarioLogado.Usu_FotoPerfil;

            if (_usuarioFotoPerfil != null)
            {
                _caminhoAvatar = "pho_usuario/" + _infoUsuarioLogado.Usu_DiretorioBase +"/"+ _usuarioFotoPerfil;
            }


            criarFotoPerfil.file_fotoPerfil = PostForm["file"];
            criarFotoPerfil.fotoAtualPerfil = _caminhoAvatar;

            return PartialView(criarFotoPerfil);
        }

        [HttpPost]
        public ActionResult AlterarSenhaModal()
        {
            //if (Request.IsAuthenticated)
            //{
                return PartialView();
            //}
        }

    }
}