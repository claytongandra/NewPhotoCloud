using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using PhotoCloud.Repositories;
using PhotoCloud.Models;
using System.Net;
using System.Net.Sockets;


namespace PhotoCloud.Models
{
    public class UsersRepository
    {
        //Propriedade que verifica se o usuário encontra-se logado.
        public static pho_usuario_acesso UsuarioLogado
        {
            get
            {
                var Usuario = HttpContext.Current.Request.Cookies["UserCookieAuthentication"];

                //var Usuario = HttpContext.Current.Request.Cookies["UserCookieAuthentication"]["USUIDLOGD"];
                if (Usuario == null)
                {
                    return null;
                }
                else
                {
                    string NovoToken = PhotoCloud.Models.CryptographyRepository.Descriptografar(Usuario.Value.ToString());
 
                    int IDUsuario;
 
                    if (int.TryParse(NovoToken, out IDUsuario))
                    {
                        return GetUsuarioByID(IDUsuario);
                    }
                    else
                    {
                        return null;
                    }
                }
            }
        }
 
        //Recuperando o usuário pelo ID
        public static pho_usuario_acesso GetUsuarioByID(int CodigoUsuario)
        {
            
            photocloudEntities ContextoUsuario = new photocloudEntities();

            var Consulta = (from usuario in ContextoUsuario.pho_usuario_acesso
            where usuario.usa_fk_usuario == CodigoUsuario
            select usuario).SingleOrDefault();
 
            return Consulta;
        }
        
       

 
        // Com base no Username e no Password, este método autentica o usuário e o direciona para o local correto.

        public static bool AutenticarUsuario(string prmUsername, string prmPassword, bool prmLembrarUsuario, bool prmManterConectado)
        {

            ConvertMD5 objMD5 = new ConvertMD5();

            photocloudEntities ContextoUsuario = new photocloudEntities();
            NavegadorModel infoNavegador = new NavegadorModel();

            infoNavegador = PhotoCloud.Repositories.VerificaNavegador.VerificaNavegadorUsuario();

            try
            {
                var RetornoQueryUser = (from usuarioacesso in ContextoUsuario.pho_usuario_acesso
                                        where (usuarioacesso.usa_login == prmUsername || usuarioacesso.usa_email == prmUsername) && usuarioacesso.usa_senha == prmPassword
                                        select usuarioacesso).SingleOrDefault();

                if (RetornoQueryUser == null)
                {
                    return false;
                }
                else
                {

                    HttpCookie UserCookie = new HttpCookie(objMD5.getMD5Hash("UserCookieAuthentication")); // 8A6A69740453A3B012E65AF01EE3ECB5

                    string _nomeMaquina = Dns.GetHostName();
                    string _IpMaquina;

                    IPHostEntry hostInfo = Dns.GetHostEntry(Dns.GetHostName());
                    _IpMaquina = hostInfo.AddressList.Where(i => i.AddressFamily.Equals(AddressFamily.InterNetwork)).First().ToString();

                    UserCookie.Values.Add(objMD5.getMD5Hash("USUMAQNOM"), CryptographyRepository.Criptografar(_nomeMaquina.ToString()));                    // DCD17261F4508BC339600DC8729122A8
                    UserCookie.Values.Add(objMD5.getMD5Hash("USUMAQIP4"), CryptographyRepository.Criptografar(_IpMaquina.ToString()));                      // 0A4191585949F34F8D8BBE51A6797A4F
                    UserCookie.Values.Add(objMD5.getMD5Hash("USUIDLOGD"), CryptographyRepository.Criptografar(RetornoQueryUser.usa_fk_usuario.ToString())); // F68E1C790CD5E7A191A394A889E69A95


                    //UserCookie.Values.Add(objMD5.getMD5Hash("USULOGEXP"), DateTime.Now.AddDays(7).ToString());
                    //UserCookie.Values.Add(objMD5.getMD5Hash("USUBROWSER"),infoNavegador.browserName);
                    //UserCookie.Values.Add(objMD5.getMD5Hash("USUBROWTIP"),infoNavegador.browserType);
                    //UserCookie.Values.Add(objMD5.getMD5Hash("USUBROWVER"),infoNavegador.browserVersion);
                    //UserCookie.Values.Add(objMD5.getMD5Hash("USUACECOOK"), infoNavegador.browserCookies.ToString());

                    //Definindo o prazo de vida do cookie
                    if (prmManterConectado)
                    {
                        UserCookie.Expires = DateTime.Now.AddDays(7);
                    }
                    HttpContext.Current.Response.Cookies.Add(UserCookie);

                    if (prmLembrarUsuario)
                    {
                        HttpCookie LembrarUsuarioCookie = new HttpCookie(objMD5.getMD5Hash("UserCookieLembrarUsuario")); // 77E9E65EE9901E30F3C233D965916A9C

                        LembrarUsuarioCookie.Values.Add(objMD5.getMD5Hash("USERNAME"), CryptographyRepository.Criptografar(RetornoQueryUser.usa_login.ToString())); // 27087B329DEEADE828EDD652D45461B2
                        LembrarUsuarioCookie.Expires = DateTime.Now.AddDays(30);
                        HttpContext.Current.Response.Cookies.Add(LembrarUsuarioCookie);
                    }
                    else
                    {
                        if (HttpContext.Current.Request.Cookies[objMD5.getMD5Hash("UserCookieLembrarUsuario")] != null)
                        {
                            HttpCookie myCookie = new HttpCookie(objMD5.getMD5Hash("UserCookieLembrarUsuario"));
                            myCookie.Expires = DateTime.Now.AddDays(-1d);
                            HttpContext.Current.Response.Cookies.Add(myCookie);
                        }
                    }

                    if (prmManterConectado) //UserCookieManterConectado
                    {

                        HttpCookie ManterConectadoCookie = new HttpCookie(objMD5.getMD5Hash("UserCookieManterConectado")); // D2DB44648B1CB2007956559DBD5E42AD

                        ManterConectadoCookie.Values.Add(objMD5.getMD5Hash("USUMANTERLOG"), CryptographyRepository.Criptografar("true")); // 366C1B435FAAA4260922DCE106F28589
                        ManterConectadoCookie.Expires = DateTime.Now.AddDays(30);
                        HttpContext.Current.Response.Cookies.Add(ManterConectadoCookie);
                    }
                    else
                    {
                        if (HttpContext.Current.Request.Cookies[objMD5.getMD5Hash("UserCookieManterConectado")] != null)
                        {
                            HttpCookie myCookie = new HttpCookie(objMD5.getMD5Hash("UserCookieManterConectado"));
                            myCookie.Expires = DateTime.Now.AddDays(-1d);
                            HttpContext.Current.Response.Cookies.Add(myCookie);
                        }
                    }

                    return true;
                }
            }
            catch (Exception e)
            {
                throw e;
                //  return false;
            }
        }
    }
}