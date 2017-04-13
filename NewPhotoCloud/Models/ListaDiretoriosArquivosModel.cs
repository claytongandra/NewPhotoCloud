using System;
using System.Collections.Generic;


namespace NewPhotoCloud.Models
{
    public class ListaDiretorios
    {
        public string DiretorioBase { get; set; }
        public string Diretorio { get; set; }
        public string DiretorioNome { get; set; }
        public DateTime DiretorioDataAcesso { get; set; }
    }
    public class ListaArquivos
    {
        public string ArquivoNome { get; set; }
        public string ArquivoCaminho { get; set; }
        public string ArquivoDiretorio { get; set; }
        public string ArquivoTamanho { get; set; }
        public DateTime ArquivoDataAcesso { get; set; }
        public string ArquivoExtensao { get; set; }
    }

    public class ListaDiretoriosArquivos
    {
        public List<ListaDiretorios> listaDiretorio;
        public List<ListaArquivos> listaArquivo;

        public ListaDiretoriosArquivos(List<ListaDiretorios> _listaDiretorio, List<ListaArquivos> _listaArquivo)
        {
            listaDiretorio = _listaDiretorio;
            listaArquivo = _listaArquivo;
        }
    }
}