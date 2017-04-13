using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;


namespace NewPhotoCloud.Models
{
    public class GerenciarFotoPerfil
    {
        public class CriarFotoPerfil
        {
            [Required]
            [Display(Name = "Nova Imagem")]
            public string file_fotoPerfil { get; set; }

            public string fotoAtualPerfil { get; set; }
        }
    }
}