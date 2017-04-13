using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using System.Net;
using System.Net.Sockets;
using PhotoCloud.Models;

namespace PhotoCloud.Repositories
{
    public class VerificaEstadoLogin : Controller
    {
        protected override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            ConvertMD5 objMD5 = new ConvertMD5();

            var CookieAuthentication = filterContext.HttpContext.Request.Cookies[objMD5.getMD5Hash("UserCookieAuthentication")];

            if (CookieAuthentication == null)
            {
                filterContext.Result = new RedirectToRouteResult(
                     new RouteValueDictionary{
                        { "controller", "Acesso" },
                        { "action", "Login" }
                    });
            }
            else
            {
                string _maqUsuarioCookie = CryptographyRepository.Descriptografar(filterContext.HttpContext.Request.Cookies[objMD5.getMD5Hash("UserCookieAuthentication")][objMD5.getMD5Hash("USUMAQNOM")].ToString());
                string _IpUsuarioCookie = CryptographyRepository.Descriptografar(filterContext.HttpContext.Request.Cookies[objMD5.getMD5Hash("UserCookieAuthentication")][objMD5.getMD5Hash("USUMAQIP4")].ToString());

                string _IpMaquina;

                IPHostEntry hostInfo = Dns.GetHostEntry(Dns.GetHostName());
                _IpMaquina = hostInfo.AddressList.Where(i => i.AddressFamily.Equals(AddressFamily.InterNetwork)).First().ToString();

                if (_maqUsuarioCookie == Dns.GetHostName() && _IpUsuarioCookie == _IpMaquina)
                {

                    var _idUsuarioCookie = CryptographyRepository.Descriptografar(filterContext.HttpContext.Request.Cookies[objMD5.getMD5Hash("UserCookieAuthentication")][objMD5.getMD5Hash("USUIDLOGD")].ToString());

                    int IDUsuario;
                    if (int.TryParse(_idUsuarioCookie, out IDUsuario))
                    {

                        photocloudEntities ContextoUsuario = new photocloudEntities();

                        var Consulta = (from usuario in ContextoUsuario.pho_usuarios
                                        join usuario_acesso in ContextoUsuario.pho_usuario_acesso on usuario.usu_id equals usuario_acesso.usa_fk_usuario 
                                        where usuario.usu_id == IDUsuario
                                        select new 
                                        {
                                            usuario.usu_id,
                                            usuario.usu_nome,
                                            usuario.usu_sobrenome,
                                            usuario.usu_diretoriobase,
                                            usuario_acesso.usa_email,
                                            usuario_acesso.usa_login

                                        }).SingleOrDefault();
                                        //  select usuario, usuario_acesso).SingleOrDefault();

                        int _idUsuario = Consulta.usu_id;
                        string _nomeUsuario = Consulta.usu_nome;
                        string _sobrenomeUsuario = Consulta.usu_sobrenome;
                        string _emailUsuario = Consulta.usa_email;
                        string _loginUsuario = Consulta.usa_login;
                        string _diretorioUsuario = Consulta.usu_diretoriobase;

                        UsuarioLogadoModel objUsuarioLogado = new UsuarioLogadoModel();

                        objUsuarioLogado.idUsuario = _idUsuario;
                        objUsuarioLogado.nomeUsuario = _nomeUsuario;
                        objUsuarioLogado.sobrenomeUsuario = _sobrenomeUsuario;
                        objUsuarioLogado.loginUsuario = _loginUsuario;
                        objUsuarioLogado.diretorioUsuario = _diretorioUsuario;

                        filterContext.Controller.ViewData.Add("vdtUsuarioLogado", objUsuarioLogado);

                    }
                    else
                    {
                        filterContext.Result = new RedirectToRouteResult(
                        new RouteValueDictionary
                                {
                                    { "controller", "Acesso" },
                                    { "action", "login" }
                                });

                    }
                }
                else
                {
                    filterContext.Result = new RedirectToRouteResult(
                    new RouteValueDictionary
                            {
                                { "controller", "Acesso" },
                                { "action", "login" }
                            });

                }
            }
            base.OnActionExecuting(filterContext);
        }
    }
}