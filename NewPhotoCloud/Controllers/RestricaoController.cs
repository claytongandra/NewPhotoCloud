using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using NewPhotoCloud.Repositories;

namespace NewPhotoCloud.Controllers
{
    public class RestricaoController : Controller
    {
        public ActionResult HabilitarCookie()
        {
            ConvertMD5 ConverterMD5 = new ConvertMD5();

            var _cookieHabilitadoBrowser = HttpContext.Request.Cookies[ConverterMD5.getMD5Hash("BrowserVerificaCriarCookie")];

            if (_cookieHabilitadoBrowser == null)
            {
                return View();
            }
            else
            {
                return RedirectToAction("Login", "Account");
            }
        }
    }
}