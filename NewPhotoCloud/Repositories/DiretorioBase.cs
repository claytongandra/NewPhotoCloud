using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.IO;
using NewPhotoCloud.Models;
using NewPhotoCloud.Repositories;

namespace NewPhotoCloud.Repositories
{
    public class DiretorioBase
    {
        public class DiretorioRetorno
        {
            public int retorno { get; set; }
            public string diretorio { get; set; }
        }

        public static DiretorioRetorno CriarDiretorioBase(int prmIdUsuario) 
       {

           ConvertMD5 DiretorioBaseMd5 = new ConvertMD5();

           DiretorioRetorno retornoDiretorio = new DiretorioRetorno();
           
           

           string _confDirBase = "0000000000" + prmIdUsuario.ToString();
            _confDirBase = _confDirBase.Substring(_confDirBase.Length - 10);
            _confDirBase = DiretorioBaseMd5.getMD5Hash(CryptographyRepository.Criptografar(_confDirBase));

            string caminhoDiretorio = System.Web.HttpContext.Current.Server.MapPath("~/pho_fotos/" + _confDirBase);
            string caminhoDiretorioMini = System.Web.HttpContext.Current.Server.MapPath("~/pho_fotos_miniatura/" + _confDirBase);
            string caminhoDiretorioLixeira = System.Web.HttpContext.Current.Server.MapPath("~/pho_lixeira/" + _confDirBase);
            string caminhoDiretorioLixeiraMini = System.Web.HttpContext.Current.Server.MapPath("~/pho_lixeira_miniatura/" + _confDirBase);
            string caminhoDiretorioUsuario = System.Web.HttpContext.Current.Server.MapPath("~/pho_usuario/" + _confDirBase);
            

                try
                {

                if (Directory.Exists(caminhoDiretorio))
                {


                    UsuarioContext usuarioAcesso = new UsuarioContext();

                    var _retornoQueryDiretorio = (from diretorio in usuarioAcesso.CloudUsuariosAcesso
                                                  where diretorio.Uac_Fk.Usu_DiretorioBase == _confDirBase
                                                  select diretorio).SingleOrDefault();

                    if (_retornoQueryDiretorio == null)
                    {
                        retornoDiretorio.retorno = 0;
                        retornoDiretorio.diretorio = _confDirBase;
                        return retornoDiretorio;
                    }
                    
                    else if (_retornoQueryDiretorio.Uac_Fk.Usu_Id == prmIdUsuario)
                    {
                        retornoDiretorio.retorno = 0;
                        retornoDiretorio.diretorio = _confDirBase;
                        return retornoDiretorio;
                    }
                    else
                    { 
                        retornoDiretorio.retorno = 2;
                        retornoDiretorio.diretorio = null;
                        return retornoDiretorio;
                     }
                }
                

                DirectoryInfo DiretorioInfo = Directory.CreateDirectory(caminhoDiretorio);
                DirectoryInfo DiretorioMiniInfo = Directory.CreateDirectory(caminhoDiretorioMini);
                DirectoryInfo DiretorioLixeiraInfo = Directory.CreateDirectory(caminhoDiretorioLixeira);
                DirectoryInfo DiretorioLixeiraMiniInfo = Directory.CreateDirectory(caminhoDiretorioLixeiraMini);
                DirectoryInfo DiretorioUsuarioInfo = Directory.CreateDirectory(caminhoDiretorioUsuario);

                retornoDiretorio.retorno = 0;
                retornoDiretorio.diretorio = _confDirBase;

                return retornoDiretorio;
            }
            catch (Exception e)
            {
                retornoDiretorio.retorno = 3;
                retornoDiretorio.diretorio = null;
                return retornoDiretorio;
            }
/**/      }

        public static string RetornaDiretorioBase(string prmUserName)
        {
            UsuarioContext usuarioAcesso = new UsuarioContext();

            var _retornoQueryUser = (from usuarioInfoAcesso in usuarioAcesso.CloudUsuariosAcesso
                                     where usuarioInfoAcesso.Uac_UserName == prmUserName
                                     select new
                                     {
                                         usuarioInfoAcesso.Uac_Fk.Usu_DiretorioBase,
                                         usuarioInfoAcesso.Uac_Fk.Usu_Id
                                     }).SingleOrDefault();

            return _retornoQueryUser.Usu_DiretorioBase;
        }

    }
}