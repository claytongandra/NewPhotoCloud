using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace NewPhotoCloud.Repositories
{
    public class UsuarioLogado
    {
        public NewPhotoCloudUsuarios GetUsuarioLogado(string username)
        {
            UsuarioContext usuarioAcesso = new UsuarioContext();
            NewPhotoCloudUsuarios usuarioInfo = new NewPhotoCloudUsuarios();

         /*   var _retornoQueryUser = (from usuarioInfo in usuarioAcesso.CloudUsuarios
                                     join usuarioInfoAcesso in usuarioAcesso.CloudUsuariosAcesso on usuarioInfo.Usu_Id equals usuarioInfoAcesso.Uac_Fk_Usu_Id
                                     where usuarioInfoAcesso.Uac_UserName == username
                                     select usuarioInfoAcesso).SingleOrDefault();

           */

            var _retornoQueryUser = (from usuarioInfoAcesso in usuarioAcesso.CloudUsuariosAcesso
                                     where usuarioInfoAcesso.Uac_UserName == username
                                     select usuarioInfoAcesso).SingleOrDefault();


            if (_retornoQueryUser != null)
            {
                usuarioInfo.Usu_Id = _retornoQueryUser.Uac_Fk.Usu_Id;
                usuarioInfo.Usu_Nome = _retornoQueryUser.Uac_Fk.Usu_Nome;
                usuarioInfo.Usu_SobreNome = _retornoQueryUser.Uac_Fk.Usu_SobreNome;
                usuarioInfo.Usu_DataNascimento = _retornoQueryUser.Uac_Fk.Usu_DataNascimento;
                usuarioInfo.Usu_DiretorioBase = _retornoQueryUser.Uac_Fk.Usu_DiretorioBase;
                usuarioInfo.Usu_FotoPerfil = _retornoQueryUser.Uac_Fk.Usu_FotoPerfil;
                usuarioInfo.Usu_Nivel = _retornoQueryUser.Uac_Fk.Usu_Nivel;
                usuarioInfo.Usu_DataCadastro = _retornoQueryUser.Uac_Fk.Usu_DataCadastro;
                usuarioInfo.Usu_Status = _retornoQueryUser.Uac_Fk.Usu_Status;
                
            }


            return (usuarioInfo);
        }
    }
}