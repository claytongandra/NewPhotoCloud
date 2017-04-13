using NewPhotoCloud.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace NewPhotoCloud.Controllers
{

    public class CriarElementoHtmlController : Controller
    {
        // GET: CriarHtml
        [HttpPost]
        public ActionResult CriarFormularioCriarPastaInFileTree(FormCollection PostForm)
        {
            string _caminhoCriarNovaPasta = PostForm["caminhoCriarNovaPasta"];
       //     string _caminhoOriginal = PostForm["caminhoOriginal"];
    //        string _formataRetorno = "";
            CriarPasta novapasta = new CriarPasta();

            //  novapasta.NomePasta = _pastaAtual;
            novapasta.CaminhoPasta = _caminhoCriarNovaPasta;
      //      _formataRetorno = _caminhoOriginal.Substring(0, _caminhoOriginal.LastIndexOf("/"));
     //       novapasta.CaminhoRetorno = _formataRetorno.Substring(0, _formataRetorno.LastIndexOf("/") + 1);

            return PartialView(novapasta);
        }
    }
}