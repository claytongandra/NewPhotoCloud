using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using NewPhotoCloud.Models;
using System.IO;

namespace NewPhotoCloud.Repositories
{
    public class ListaDiretoriosArquivosBaseDados
    {
        public static ListaDiretoriosArquivos RetornaDiretoriosArquivosBaseDados(int? prmIdUsuario, string prmDiretorio, string prmTipo, string prmStatus)
        {

            var _tipos = new[] { prmTipo };
            var _status = new[] { prmStatus };

           
           
            List<ListaDiretorios> list_listaDiretorios = new List<ListaDiretorios>();
            List<ListaArquivos> list_listaArquivos = new List<ListaArquivos>();


            using (DiretoriosArquivosContext diretorios = new DiretoriosArquivosContext())
            {
                var _retornoQueryDiretorios = (from diretoriosDestino in diretorios.CloudDiretoriosArquivos
                                               where diretoriosDestino.Dia_Fk_Usu_id == prmIdUsuario &&
                                          //     Incluir parametro para escolher se consulta do Dia_CaminhoAtual ou Dia_CaminhoOriginal
                                          //     (diretoriosDestino.Dia_CaminhoAtual == prmDiretorio || diretoriosDestino.Dia_CaminhoOriginal == prmDiretorio) &&
                                                diretoriosDestino.Dia_CaminhoAtual == prmDiretorio &&
                                               _tipos.Contains(diretoriosDestino.Dia_Tipo) &&
                                               _status.Contains(diretoriosDestino.Dia_Status)
                                               //  select diretoriosDestino)
                                               select new
                                               {
                                                   diretoriosDestino.Dia_CaminhoAtual,
                                                   diretoriosDestino.Dia_CaminhoOriginal,
                                                   diretoriosDestino.Dia_Nome,
                                                   diretoriosDestino.Dia_Tipo,
                                                   diretoriosDestino.Dia_Status

                                               }).OrderBy(diretoriosDestino => diretoriosDestino.Dia_Nome);

                foreach (var itemDiretorioArquivo in _retornoQueryDiretorios)
                {
                    ListaDiretorios listaDiretoriosModel = new ListaDiretorios();
                    ListaArquivos listaArquivosModel = new ListaArquivos();

                    if(itemDiretorioArquivo.Dia_Tipo == "D"){

                        listaDiretoriosModel.Diretorio = itemDiretorioArquivo.Dia_CaminhoAtual;
                        listaDiretoriosModel.DiretorioNome = itemDiretorioArquivo.Dia_Nome;


                        list_listaDiretorios.Add(listaDiretoriosModel);
                   }
                   else if (itemDiretorioArquivo.Dia_Tipo == "A")
                   {

                       FileInfo objarquivo = new FileInfo(itemDiretorioArquivo.Dia_Nome);

                       listaArquivosModel.ArquivoCaminho = itemDiretorioArquivo.Dia_CaminhoAtual;
                       listaArquivosModel.ArquivoNome = itemDiretorioArquivo.Dia_Nome;
                       listaArquivosModel.ArquivoExtensao = objarquivo.Extension.Replace(@".", @"").ToLower();

                       list_listaArquivos.Add(listaArquivosModel);
                   }
                    
                }

                ListaDiretoriosArquivos list_ListaDiretoriosArquivos = new ListaDiretoriosArquivos(list_listaDiretorios, list_listaArquivos);


                return list_ListaDiretoriosArquivos;
            }
        }
    }
}