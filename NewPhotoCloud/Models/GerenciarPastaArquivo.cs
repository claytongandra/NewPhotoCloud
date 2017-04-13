using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace NewPhotoCloud.Models
{
    public class CriarPasta
    {
        [Required]
        [StringLength(50, ErrorMessage = "A {0} deve conter pelo menos {2} caracteres.", MinimumLength = 2)]
        [RegularExpression("/^[^\\/|:;*?&\"\'<>«»]+$/", ErrorMessage = "Os caractere \\ / | : ; * ? & \" \' < > não são permitidos")]
        [Display(Name = "Nova Pasta")]
        public string NomePasta { get; set; }

        public string CaminhoPasta { get; set; }
  //      public string CaminhoRetorno { get; set; }
    }
    public class RenomearPasta
    {
        [Required]
        [StringLength(50, ErrorMessage = "A {0} deve conter pelo menos {2} caracteres.", MinimumLength = 2)]
        [RegularExpression("/^[^\\/|:;*?&\"\'<>«»]+$/", ErrorMessage = "Os caractere \\ / | : ; * ? & \" \' < > não são permitidos")]
        [Display(Name = "Renomear Pasta")]
        public string NomePasta { get; set; }

        public string CaminhoPasta { get; set; }
    }

    public class MoverPastaArquivo 
    {
        public string CodigoPastaArquivo { get; set; }
        public string NomePastaArquivo { get; set; }
        public string CaminhoOriginal { get; set; }
        public char TipoArquivoPasta { get; set; }
        public int StatusRetorno { get; set; }
        public string MensagemsRetorno { get; set; }

    }

    public class MoverPastaArquivoOrigem 
    {
        public string CaminhoPastaPai { get; set; }
        public string CaminhoRetorno { get; set; }
        public string EstadoPasta { get; set; }
        public string CaminhoAtualDestino { get; set; }
        public int QtdPastaMovida { get; set; }
        public int QtdArquivoMovido { get; set; }
        public List<MoverPastaArquivo> ListaMoverPastasArquivos { get; set; }
     //   public List<MoverPastaArquivo> ListaMoverPastasArquivos;
    }

    public class MoverPastaArquivoDesfazerMover
    {
    //    public string CodigoPastaArquivo { get; set; }
    //    public string NomePastaArquivo { get; set; }
    //    public char TipoArquivoPasta { get; set; }
        public DateTime DtMovArqPas { get; set; }
        public List<MoverPastaArquivoDesfazerMoverLista> ListPasArqMov { get; set; }

    }
    public class MoverPastaArquivoDesfazerMoverLista
    {
        public string CodPasArq { get; set; }
        //    public string NomePastaArquivo { get; set; }

    }

    public class MoverPastaArquivoNomeMovidos
    {
        public string NomePastaArquivo { get; set; }
        public string CaminhoOriginal { get; set; }
        public char TipoArquivoPasta { get; set; }
    }

    public class RenomearArquivo
    {
        [Required]
        [StringLength(50, ErrorMessage = "O {0} deve conter pelo menos {2} caracteres.", MinimumLength = 2)]
        [RegularExpression("/^[^\\/:;,.*?&\"\'<>«»]+$/", ErrorMessage = "Os caractere \\ / : ; , . * ? & \" \' < > não são permitidos")]
        [Display(Name = "Renomear Arquivo")]
        public string NomeArquivo { get; set; }
        public string ExtencaoArquivo { get; set; }
        public string CaminhoArquivo { get; set; }
    }
}