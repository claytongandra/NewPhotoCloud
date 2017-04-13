using System;
using System.Globalization;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using NewPhotoCloud.Repositories;
using NewPhotoCloud.Models;
using System.Data.Entity.Infrastructure;


namespace NewPhotoCloud.Controllers
{
    [Authorize]
    public class AccountController : Controller
    {
        private ApplicationSignInManager _signInManager;
        private ApplicationUserManager _userManager;

        ConvertMD5 ConverterMD5 = new ConvertMD5();

        public AccountController()
        {
        }

        public AccountController(ApplicationUserManager userManager, ApplicationSignInManager signInManager )
        {
            UserManager = userManager;
            SignInManager = signInManager;
        }

        public ApplicationSignInManager SignInManager
        {
            get
            {
                return _signInManager ?? HttpContext.GetOwinContext().Get<ApplicationSignInManager>();
            }
            private set 
            { 
                _signInManager = value; 
            }
        }

        public ApplicationUserManager UserManager
        {
            get
            {
                return _userManager ?? HttpContext.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }

        //
        // GET: /Account/Login
        [AllowAnonymous]
        public ActionResult Login(string returnUrl)
        {

            LoginViewModel objAcessoUsuario = new LoginViewModel();
                
            HttpCookie BrowserVerificaCriarCookie = new HttpCookie(ConverterMD5.getMD5Hash("BrowserVerificaCriarCookie")); // C6D27B273F1B25456B7D9D05ECAFECA4
            HttpContext.Response.Cookies.Add(BrowserVerificaCriarCookie);

            var _cookieLembraUsuario = HttpContext.Request.Cookies[ConverterMD5.getMD5Hash("UserCookieLembrarUsuario")];

            if (_cookieLembraUsuario != null)
            {
                objAcessoUsuario.UserName = CryptographyRepository.Descriptografar(HttpContext.Request.Cookies[ConverterMD5.getMD5Hash("UserCookieLembrarUsuario")][ConverterMD5.getMD5Hash("USERNAME")]);
                objAcessoUsuario.RememberUserName = true;
            }


            ViewBag.ReturnUrl = returnUrl;
            return View(objAcessoUsuario);
        }

        //
        // POST: /Account/Login
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Login(LoginViewModel model, string returnUrl)
        {
            
            var _cookieHabilitadoBrowser = HttpContext.Request.Cookies[ConverterMD5.getMD5Hash("BrowserVerificaCriarCookie")];

            if (_cookieHabilitadoBrowser == null)
            {
                return RedirectToAction("HabilitarCookie", "Restricao");

            }
            else 
            { 

                if (!ModelState.IsValid)
                {
                    return View(model);
                }

                UsuarioContext usuarioAcesso = new UsuarioContext();

                var _retornoQueryUser = (from login in usuarioAcesso.CloudUsuariosAcesso
                                        where login.Uac_Email == model.UserName || login.Uac_UserName == model.UserName
                                        select login).SingleOrDefault();

                if (_retornoQueryUser != null)
                {
                    model.UserName = _retornoQueryUser.Uac_UserName;
                }


                // This doesn't count login failures towards account lockout
                // To enable password failures to trigger account lockout, change to shouldLockout: true
                var result = await SignInManager.PasswordSignInAsync(model.UserName, model.Password, model.RememberMe, shouldLockout: false);
                switch (result)
                {
                    case SignInStatus.Success:
                       
                        HttpCookie VerificaCookie = new HttpCookie(ConverterMD5.getMD5Hash("BrowserVerificaCriarCookie"));
                        VerificaCookie.Expires = DateTime.Now.AddDays(-1d);
                        Response.Cookies.Add(VerificaCookie);

                        bool _LembrarUsuario = model.RememberUserName;

                        if (_LembrarUsuario)
                        {
                            HttpCookie LembrarUsuarioCookie = new HttpCookie(ConverterMD5.getMD5Hash("UserCookieLembrarUsuario")); // 77E9E65EE9901E30F3C233D965916A9C

                            LembrarUsuarioCookie.Values.Add(ConverterMD5.getMD5Hash("USERNAME"), CryptographyRepository.Criptografar(_retornoQueryUser.Uac_UserName.ToString())); // 27087B329DEEADE828EDD652D45461B2
                            LembrarUsuarioCookie.Expires = DateTime.Now.AddDays(30);
                            System.Web.HttpContext.Current.Response.Cookies.Add(LembrarUsuarioCookie);
                        }
                        else
                        {
                            if (System.Web.HttpContext.Current.Request.Cookies[ConverterMD5.getMD5Hash("UserCookieLembrarUsuario")] != null)
                            {
                                HttpCookie myCookie = new HttpCookie(ConverterMD5.getMD5Hash("UserCookieLembrarUsuario"));
                                myCookie.Expires = DateTime.Now.AddDays(-1d);
                                System.Web.HttpContext.Current.Response.Cookies.Add(myCookie);
                            }
                        }

                        return RedirectToLocal(returnUrl);
                    case SignInStatus.LockedOut:
                        return View("Lockout");
                    case SignInStatus.RequiresVerification:
                        return RedirectToAction("SendCode", new { ReturnUrl = returnUrl, RememberMe = model.RememberMe });
                    case SignInStatus.Failure:
                    default:
                        ModelState.AddModelError("", "Usuário ou senha inválidos.");
                        
                        return View(model);
                }
            }
        }

        //
        // GET: /Account/VerifyCode
        [AllowAnonymous]
        public async Task<ActionResult> VerifyCode(string provider, string returnUrl, bool rememberMe)
        {
            // Require that the user has already logged in via username/password or external login
            if (!await SignInManager.HasBeenVerifiedAsync())
            {
                return View("Error");
            }
            return View(new VerifyCodeViewModel { Provider = provider, ReturnUrl = returnUrl, RememberMe = rememberMe });
        }

        //
        // POST: /Account/VerifyCode
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> VerifyCode(VerifyCodeViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            // The following code protects for brute force attacks against the two factor codes. 
            // If a user enters incorrect codes for a specified amount of time then the user account 
            // will be locked out for a specified amount of time. 
            // You can configure the account lockout settings in IdentityConfig
            var result = await SignInManager.TwoFactorSignInAsync(model.Provider, model.Code, isPersistent:  model.RememberMe, rememberBrowser: model.RememberBrowser);
            switch (result)
            {
                case SignInStatus.Success:
                    return RedirectToLocal(model.ReturnUrl);
                case SignInStatus.LockedOut:
                    return View("Lockout");
                case SignInStatus.Failure:
                default:
                    ModelState.AddModelError("", "Invalid code.");
                    return View(model);
            }
        }

        //
        // GET: /Account/Register
        [AllowAnonymous]
        public ActionResult Register()
        {

            //var model = new RegisterViewModel();
        //    model.Genero = _userExtensionManager.GetGenders();
            return View();
        }

        //
        // POST: /Account/Register
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Register(RegisterViewModel model)
        {
            ConvertMD5 DiretorioBaseMd5 = new ConvertMD5();

            if (ModelState.IsValid)
            {
                var user = new ApplicationUser 
                { 
                    UserName = model.UserName, 
                    Email = model.Email,
                    Uac_DataExpiracao = DateTime.Now.ToUniversalTime(),
                    Uac_Fk = new NewPhotoCloudUsuarios
                    {
                        Usu_Nome = model.Nome,
                        Usu_SobreNome = model.Sobrenome,
                        Usu_DataCadastro = DateTime.Now.ToUniversalTime(),
                        Usu_Nivel = 30,
                        Usu_DiretorioBase = null,
                        Usu_DataNascimento = model.DataNascimento,
                        //Usu_Sexo = model.Genero,
                        Usu_Status = "D",

                    }
                };
                var result = await UserManager.CreateAsync(user, model.Password);
                if (result.Succeeded)
                {
                    // await SignInManager.SignInAsync(user, isPersistent:false, rememberBrowser:false);
                    
                    // For more information on how to enable account confirmation and password reset please visit http://go.microsoft.com/fwlink/?LinkID=320771
                    // Send an email with this link
                    // string code = await UserManager.GenerateEmailConfirmationTokenAsync(user.Id);
                    // var callbackUrl = Url.Action("ConfirmEmail", "Account", new { userId = user.Id, code = code }, protocol: Request.Url.Scheme);
                    // await UserManager.SendEmailAsync(user.Id, "Confirm your account", "Please confirm your account by clicking <a href=\"" + callbackUrl + "\">here</a>");

                                      
                    
                    NewPhotoCloud.Repositories.DiretorioBase.DiretorioRetorno DiretorioCriado = new NewPhotoCloud.Repositories.DiretorioBase.DiretorioRetorno();
                //    DiretorioCriado = null;
                    
                    try
                   {
                       DiretorioCriado = DiretorioBase.CriarDiretorioBase(user.Uac_Fk.Usu_Id.Value);
                   }
                    catch (RetryLimitExceededException /* dex */)
                   {
                        //Log the error (uncomment dex variable name and add a line here to write a log.
                       ModelState.AddModelError("", "Unable to save changes. Try again, and if the problem persists, see your system administrator.");
                   }


                    if (DiretorioCriado.retorno == 0)
                    {
                        try
                        {

                            user.Uac_DataExpiracao = DateTime.Now.ToUniversalTime().AddDays(30);
                            user.Uac_Fk.Usu_DiretorioBase = DiretorioCriado.diretorio;
                            user.Uac_Fk.Usu_Status = "A";

                            await UserManager.UpdateAsync(user);

                        }
                        catch (RetryLimitExceededException /* dex */)
                        {
                            //Log the error (uncomment dex variable name and add a line here to write a log.
                            ModelState.AddModelError("", "Unable to save changes. Try again, and if the problem persists, see your system administrator.");
                        }
                    }
                   
                    await SignInManager.SignInAsync(user, isPersistent: false, rememberBrowser: false);
                    return RedirectToAction("Index", "Home");
                }
                AddErrors(result);
            }

            // If we got this far, something failed, redisplay form
            return View(model);
        }

        //
        // GET: /Account/ConfirmEmail
        [AllowAnonymous]
        public async Task<ActionResult> ConfirmEmail(string userId, string code)
        {
            if (userId == null || code == null)
            {
                return View("Error");
            }
            var result = await UserManager.ConfirmEmailAsync(userId, code);
            return View(result.Succeeded ? "ConfirmEmail" : "Error");
        }

        //
        // GET: /Account/ForgotPassword
        [AllowAnonymous]
        public ActionResult ForgotPassword()
        {
            return View();
        }

        //
        // POST: /Account/ForgotPassword
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> ForgotPassword(ForgotPasswordViewModel model)
        {
            if (ModelState.IsValid)
            {
                var user = await UserManager.FindByNameAsync(model.Email);
                if (user == null || !(await UserManager.IsEmailConfirmedAsync(user.Id)))
                {
                    // Don't reveal that the user does not exist or is not confirmed
                    return View("ForgotPasswordConfirmation");
                }

                // For more information on how to enable account confirmation and password reset please visit http://go.microsoft.com/fwlink/?LinkID=320771
                // Send an email with this link
                // string code = await UserManager.GeneratePasswordResetTokenAsync(user.Id);
                // var callbackUrl = Url.Action("ResetPassword", "Account", new { userId = user.Id, code = code }, protocol: Request.Url.Scheme);		
                // await UserManager.SendEmailAsync(user.Id, "Reset Password", "Please reset your password by clicking <a href=\"" + callbackUrl + "\">here</a>");
                // return RedirectToAction("ForgotPasswordConfirmation", "Account");
            }

            // If we got this far, something failed, redisplay form
            return View(model);
        }

        //
        // GET: /Account/ForgotPasswordConfirmation
        [AllowAnonymous]
        public ActionResult ForgotPasswordConfirmation()
        {
            return View();
        }

        //
        // GET: /Account/ResetPassword
        [AllowAnonymous]
        public ActionResult ResetPassword(string code)
        {
            return code == null ? View("Error") : View();
        }

        //
        // POST: /Account/ResetPassword
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> ResetPassword(ResetPasswordViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }
            var user = await UserManager.FindByNameAsync(model.Email);
            if (user == null)
            {
                // Don't reveal that the user does not exist
                return RedirectToAction("ResetPasswordConfirmation", "Account");
            }
            var result = await UserManager.ResetPasswordAsync(user.Id, model.Code, model.Password);
            if (result.Succeeded)
            {
                return RedirectToAction("ResetPasswordConfirmation", "Account");
            }
            AddErrors(result);
            return View();
        }

        //
        // GET: /Account/ResetPasswordConfirmation
        [AllowAnonymous]
        public ActionResult ResetPasswordConfirmation()
        {
            return View();
        }

        //
        // POST: /Account/ExternalLogin
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public ActionResult ExternalLogin(string provider, string returnUrl)
        {
            // Request a redirect to the external login provider
            return new ChallengeResult(provider, Url.Action("ExternalLoginCallback", "Account", new { ReturnUrl = returnUrl }));
        }

        //
        // GET: /Account/SendCode
        [AllowAnonymous]
        public async Task<ActionResult> SendCode(string returnUrl, bool rememberMe)
        {
            var userId = await SignInManager.GetVerifiedUserIdAsync();
            if (userId == null)
            {
                return View("Error");
            }
            var userFactors = await UserManager.GetValidTwoFactorProvidersAsync(userId);
            var factorOptions = userFactors.Select(purpose => new SelectListItem { Text = purpose, Value = purpose }).ToList();
            return View(new SendCodeViewModel { Providers = factorOptions, ReturnUrl = returnUrl, RememberMe = rememberMe });
        }

        //
        // POST: /Account/SendCode
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> SendCode(SendCodeViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View();
            }

            // Generate the token and send it
            if (!await SignInManager.SendTwoFactorCodeAsync(model.SelectedProvider))
            {
                return View("Error");
            }
            return RedirectToAction("VerifyCode", new { Provider = model.SelectedProvider, ReturnUrl = model.ReturnUrl, RememberMe = model.RememberMe });
        }

        //
        // GET: /Account/ExternalLoginCallback
        [AllowAnonymous]
        public async Task<ActionResult> ExternalLoginCallback(string returnUrl)
        {
            string firstName = null;
            string lastname = null;
            DateTime birthdayConfig = DateTime.Parse("01-01-2001");
            int birthdayConfigDay = 0;
            int birthdayConfigMonth = 0;
            int birthdayConfigYear = 0;
            
            string str_birthdayConfigMonth = null;
            string str_birthdayConfigDay = null;

            string birthdayConfigResult = null;

            DateTime birthday = DateTime.Parse("01-01-2001");

            CultureInfo cultura = new CultureInfo("en-US");


            var externalUserIdentity = HttpContext.GetOwinContext().Authentication.GetExternalIdentityAsync(DefaultAuthenticationTypes.ExternalCookie);
            var claims = externalUserIdentity.Result.Claims;

            var facebookFirstNameClaim = claims.FirstOrDefault(c => c.Type.Equals("urn:facebook:first_name"));
            var facebookLastNameClaim = claims.FirstOrDefault(c => c.Type.Equals("urn:facebook:last_name"));
            var facebookUserBirthday = claims.FirstOrDefault(c => c.Type.Equals("urn:facebook:birthday"));

            var googleFirstNameClaim = claims.FirstOrDefault(c => c.Type.Equals("urn:google:given_name"));
            var googlekLastNameClaim = claims.FirstOrDefault(c => c.Type.Equals("urn:google:family_name"));
  
            if (facebookFirstNameClaim != null)
            {
                // It's a facebook account, read facebook data
                 firstName = facebookFirstNameClaim.Value;
                 lastname = facebookLastNameClaim.Value;
               //  birthday = DateTime.Parse(facebookUserBirthday.Value);
                 if (facebookUserBirthday != null)
                 {
                     birthdayConfig = DateTime.ParseExact(facebookUserBirthday.Value, "MM/dd/yyyy", CultureInfo.InvariantCulture);
                     birthdayConfigDay = birthdayConfig.Day;
                     birthdayConfigMonth = birthdayConfig.Month;
                     birthdayConfigYear = birthdayConfig.Year;

                     str_birthdayConfigMonth = "00" + birthdayConfigMonth.ToString();
                     str_birthdayConfigDay = "00" + birthdayConfigDay.ToString();

                     birthdayConfigResult = birthdayConfigYear.ToString() + "-" + str_birthdayConfigMonth.Substring(str_birthdayConfigMonth.Length - 2) + "-" + str_birthdayConfigDay.Substring(str_birthdayConfigDay.Length - 2);

                     birthday = DateTime.ParseExact(birthdayConfigResult, "yyyy-MM-dd", cultura);
                 }
              //  CultureInfo cultura = new CultureInfo("en-US");
       //         birthday = DateTime.ParseExact(facebookUserBirthday.Value, format, CultureInfo.InvariantCulture); // DateTime.Parse(facebookUserBirthday.Value);
            }

            if (googleFirstNameClaim != null)
            {
                // It's a facebook account, read facebook data
                firstName = googleFirstNameClaim.Value;
                lastname = googlekLastNameClaim.Value;
            }

            var loginInfo = await AuthenticationManager.GetExternalLoginInfoAsync();
            if (loginInfo == null)
            {
                return RedirectToAction("Login");
            }

            // Sign in the user with this external login provider if the user already has a login
            var result = await SignInManager.ExternalSignInAsync(loginInfo, isPersistent: false);
            switch (result)
            {
                case SignInStatus.Success:
                    return RedirectToLocal(returnUrl);
                case SignInStatus.LockedOut:
                    return View("Lockout");
                case SignInStatus.RequiresVerification:
                    return RedirectToAction("SendCode", new { ReturnUrl = returnUrl, RememberMe = false });
                case SignInStatus.Failure:
                default:
                    // If the user does not have an account, then prompt the user to create an account
                    ViewBag.ReturnUrl = returnUrl;
                    ViewBag.LoginProvider = loginInfo.Login.LoginProvider;
                    return View("ExternalLoginConfirmation", new ExternalLoginConfirmationViewModel { Nome = firstName, Sobrenome = lastname, DataNascimento = birthday, Email = loginInfo.Email});
            }
        }

        //
        // POST: /Account/ExternalLoginConfirmation
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> ExternalLoginConfirmation(ExternalLoginConfirmationViewModel model, string returnUrl)
        {
            if (User.Identity.IsAuthenticated)
            {
                return RedirectToAction("Index", "Manage");
            }

            if (ModelState.IsValid)
            {


                // Get the information about the user from the external login provider
                var info = await AuthenticationManager.GetExternalLoginInfoAsync();
                if (info == null)
                {
                    return View("ExternalLoginFailure");
                }

                var user = new ApplicationUser
                {
                    UserName = model.Email,
                    Email = model.Email,
                    Uac_DataExpiracao = DateTime.Now.ToUniversalTime(),
                    Uac_Fk = new NewPhotoCloudUsuarios
                    {
                        Usu_Nome = model.Nome,
                        Usu_SobreNome = model.Sobrenome,
                        Usu_DataCadastro = DateTime.Now.ToUniversalTime(),
                        Usu_Nivel = 30,
                        Usu_DiretorioBase = null,
                        Usu_DataNascimento = model.DataNascimento,
                    //  //  Usu_Sexo = model.Genero,
                        Usu_Status = "D",

                    }
                };
               // var user = new ApplicationUser { UserName = model.Email, Email = model.Email };
                var result = await UserManager.CreateAsync(user);
                if (result.Succeeded)
                {

                    NewPhotoCloud.Repositories.DiretorioBase.DiretorioRetorno DiretorioCriado = new NewPhotoCloud.Repositories.DiretorioBase.DiretorioRetorno();
                //    DiretorioCriado = null;
                    
                    try
                   {
                       DiretorioCriado = DiretorioBase.CriarDiretorioBase(user.Uac_Fk.Usu_Id.Value);
                   }
                    catch (RetryLimitExceededException /* dex */)
                   {
                        //Log the error (uncomment dex variable name and add a line here to write a log.
                       ModelState.AddModelError("", "Unable to save changes. Try again, and if the problem persists, see your system administrator.");
                   }


                    if (DiretorioCriado.retorno == 0)
                    {
                        try
                        {

                            user.Uac_DataExpiracao = DateTime.Now.ToUniversalTime().AddDays(30);
                            user.Uac_Fk.Usu_DiretorioBase = DiretorioCriado.diretorio;
                            user.Uac_Fk.Usu_Status = "A";

                            await UserManager.UpdateAsync(user);

                        }
                        catch (RetryLimitExceededException /* dex */)
                        {
                            //Log the error (uncomment dex variable name and add a line here to write a log.
                            ModelState.AddModelError("", "Unable to save changes. Try again, and if the problem persists, see your system administrator.");
                        }
                    }


                    result = await UserManager.AddLoginAsync(user.Id, info.Login);
                    if (result.Succeeded)
                    {
                        await SignInManager.SignInAsync(user, isPersistent: false, rememberBrowser: false);
                        return RedirectToLocal(returnUrl);
                    }
                }
                AddErrors(result);
            }

            ViewBag.ReturnUrl = returnUrl;
            return View(model);
        }

        //
        // POST: /Account/LogOff
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult LogOff()
        {
            AuthenticationManager.SignOut();
            return RedirectToAction("Index", "Home");
        }

        //
        // GET: /Account/ExternalLoginFailure
        [AllowAnonymous]
        public ActionResult ExternalLoginFailure()
        {
            return View();
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                if (_userManager != null)
                {
                    _userManager.Dispose();
                    _userManager = null;
                }

                if (_signInManager != null)
                {
                    _signInManager.Dispose();
                    _signInManager = null;
                }
            }

            base.Dispose(disposing);
        }

        #region Helpers
        // Used for XSRF protection when adding external logins
        private const string XsrfKey = "XsrfId";

        private IAuthenticationManager AuthenticationManager
        {
            get
            {
                return HttpContext.GetOwinContext().Authentication;
            }
        }

        private void AddErrors(IdentityResult result)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError("", error);
            }
        }

        private ActionResult RedirectToLocal(string returnUrl)
        {
            if (Url.IsLocalUrl(returnUrl))
            {
                return Redirect(returnUrl);
            }
            return RedirectToAction("Index", "Home");
        }

        internal class ChallengeResult : HttpUnauthorizedResult
        {
            public ChallengeResult(string provider, string redirectUri)
                : this(provider, redirectUri, null)
            {
            }

            public ChallengeResult(string provider, string redirectUri, string userId)
            {
                LoginProvider = provider;
                RedirectUri = redirectUri;
                UserId = userId;
            }

            public string LoginProvider { get; set; }
            public string RedirectUri { get; set; }
            public string UserId { get; set; }

            public override void ExecuteResult(ControllerContext context)
            {
                var properties = new AuthenticationProperties { RedirectUri = RedirectUri };
                if (UserId != null)
                {
                    properties.Dictionary[XsrfKey] = UserId;
                }
                context.HttpContext.GetOwinContext().Authentication.Challenge(properties, LoginProvider);
            }
        }
        #endregion
    }
}