using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using PhotoCloud.Models;

namespace PhotoCloud.Repositories
{
    public class VerificaNavegador
    {

        public static NavegadorModel VerificaNavegadorUsuario()
        {
            System.Web.HttpBrowserCapabilities browser = HttpContext.Current.Request.Browser;

            NavegadorModel _navegador = new NavegadorModel();

            _navegador.browserMobileDevice  = browser.IsMobileDevice;
            _navegador.browserType = browser.Type;
            _navegador.browserName = browser.Browser;
            _navegador.browserVersion = browser.Version;
            _navegador.browserPlatform = browser.Platform;
            _navegador.browserCookies = browser.Cookies;
            _navegador.browserMajorVersion = browser.MajorVersion;
            _navegador.browserMinorVersion = browser.MinorVersion;
            _navegador.browserPlatform = browser.Platform;
            _navegador.browserBeta = browser.Beta;
            _navegador.browserCrawler = browser.Crawler;
            _navegador.browserAOL = browser.AOL;
            /*
            + "Type = "                    + browser.Type + "\n"
                    + "Name = "                    + browser.Browser + "\n"
                    + "Version = "                 + browser.Version + "\n"
                    + "Major Version = "           + browser.MajorVersion + "\n"
                    + "Minor Version = "           + browser.MinorVersion + "\n"
                    + "Platform = "                + browser.Platform + "\n"
                    + "Is Beta = "                 + browser.Beta + "\n"
                    + "Is Crawler = "              + browser.Crawler + "\n"
                    + "Is AOL = "                  + browser.AOL + "\n"
                    + "Is Win16 = "                + browser.Win16 + "\n"
                    + "Is Win32 = "                + browser.Win32 + "\n"
                    + "Supports Frames = "         + browser.Frames + "\n"
                    + "Supports Tables = "         + browser.Tables + "\n"
                    + "Supports Cookies = "        + browser.Cookies + "\n"
                    + "Supports VBScript = "       + browser.VBScript + "\n"
                    + "Supports JavaScript = "     + 
                        browser.EcmaScriptVersion.ToString() + "\n"
                    + "Supports Java Applets = "   + browser.JavaApplets + "\n"
                    + "Supports ActiveX Controls = " + browser.ActiveXControls 
                          + "\n"
                    + "Supports JavaScript Version = " +
                        browser["JavaScriptVersion"] + "\n";

            */
            return _navegador;

        }
    }
}