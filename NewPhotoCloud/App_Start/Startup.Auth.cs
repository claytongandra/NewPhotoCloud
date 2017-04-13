using System;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.Google;
using Owin;
using NewPhotoCloud.Models;
using Microsoft.Owin.Security.Facebook;
using Newtonsoft.Json.Linq;
using System.Security.Claims;
using Microsoft.Owin.Security.Twitter;

namespace NewPhotoCloud
{
    public partial class Startup
    {
        // For more information on configuring authentication, please visit http://go.microsoft.com/fwlink/?LinkId=301864
        public void ConfigureAuth(IAppBuilder app)
        {

            const string FacebookClaimBaseName = "urn:facebook:{0}";
            const string GoogleClaimBaseName = "urn:google:{0}";
            const string TwitterClaimBaseName = "urn:twitter:{0}";
            const string TwitterTokensBaseName = "urn:tokens:twitter:";

            string TwitterAccessToken = TwitterTokensBaseName + "accesstoken";
            string TwitterAccessTokenSecret = TwitterTokensBaseName + "accesstokensecret";

            string FacebookClaimLink = String.Format(FacebookClaimBaseName, "link");
            string FacebookClaimId = String.Format(FacebookClaimBaseName, "id");
            string FacebookClaimEmail = String.Format(FacebookClaimBaseName, "email");
            string FacebookClaimFirstName = String.Format(FacebookClaimBaseName, "first_name");
            string FacebookClaimLastName = String.Format(FacebookClaimBaseName, "last_name");
            string FacebookClaimGender = String.Format(FacebookClaimBaseName, "gender");
            string FacebookClaimLocale = String.Format(FacebookClaimBaseName, "locale");
            string FacebookClaimTimeZone = String.Format(FacebookClaimBaseName, "timezone");
            string FacebookClaimUpdatedTime = String.Format(FacebookClaimBaseName, "updated_time");
            string FacebookClaimVerified = String.Format(FacebookClaimBaseName, "verified");

            string GoogleClaimProfile = String.Format(GoogleClaimBaseName, "profile");
            string GoogleClaimSub = String.Format(GoogleClaimBaseName, "sub");
            string GoogleClaimName = String.Format(GoogleClaimBaseName, "name");
            string GoogleClaimGivenName = String.Format(GoogleClaimBaseName, "given_name");
            string GoogleClaimFamilyName = String.Format(GoogleClaimBaseName, "family_name");
            string GoogleClaimPicture = String.Format(GoogleClaimBaseName, "picture");
            string GoogleClaimEmail = String.Format(GoogleClaimBaseName, "email");
            string GoogleClaimEmailVerified = String.Format(GoogleClaimBaseName, "email_verified");
            string GoogleClaimGender = String.Format(GoogleClaimBaseName, "gender");
            string GoogleClaimLocale = String.Format(GoogleClaimBaseName, "locale");

            string TwitterClaimUserId = String.Format(TwitterClaimBaseName, "userid");
            string TwitterClaimScreenName = String.Format(TwitterClaimBaseName, "screenname");

            // Configure the db context, user manager and signin manager to use a single instance per request
            app.CreatePerOwinContext(ApplicationDbContext.Create);
            app.CreatePerOwinContext<ApplicationUserManager>(ApplicationUserManager.Create);
            app.CreatePerOwinContext<ApplicationSignInManager>(ApplicationSignInManager.Create);

            // Enable the application to use a cookie to store information for the signed in user
            // and to use a cookie to temporarily store information about a user logging in with a third party login provider
            // Configure the sign in cookie
            app.UseCookieAuthentication(new CookieAuthenticationOptions
            {
                AuthenticationType = DefaultAuthenticationTypes.ApplicationCookie,
                LoginPath = new PathString("/Account/Login"),
                Provider = new CookieAuthenticationProvider
                {
                    // Enables the application to validate the security stamp when the user logs in.
                    // This is a security feature which is used when you change a password or add an external login to your account.  
                    OnValidateIdentity = SecurityStampValidator.OnValidateIdentity<ApplicationUserManager, ApplicationUser>(
                        validateInterval: TimeSpan.FromMinutes(30),
                        regenerateIdentity: (manager, user) => user.GenerateUserIdentityAsync(manager))
                }
            });            
            app.UseExternalSignInCookie(DefaultAuthenticationTypes.ExternalCookie);

            // Enables the application to temporarily store user information when they are verifying the second factor in the two-factor authentication process.
            app.UseTwoFactorSignInCookie(DefaultAuthenticationTypes.TwoFactorCookie, TimeSpan.FromMinutes(5));

            // Enables the application to remember the second login verification factor such as phone or email.
            // Once you check this option, your second step of verification during the login process will be remembered on the device where you logged in from.
            // This is similar to the RememberMe option when you log in.
            app.UseTwoFactorRememberBrowserCookie(DefaultAuthenticationTypes.TwoFactorRememberBrowserCookie);

            // Uncomment the following lines to enable logging in with third party login providers
            //app.UseMicrosoftAccountAuthentication(
            //    clientId: "",
            //    clientSecret: "");

            //app.UseTwitterAuthentication(
            //   consumerKey: "",
            //   consumerSecret: "");


            const string xmlSchemaString = "http://www.w3.org/2001/XMLSchema#string";

            //////string twitterConsumerKey = "56ylpxhczftDb4UvupxAg";
            //////string twitterConsumerSecret = "JacI9Qus29T2v14SDaEXG9u8UymQRJFHUr0k7FNUqA";

            //////var twitterOptions = new TwitterAuthenticationOptions();
            //////twitterOptions.ConsumerKey = twitterConsumerKey;
            //////twitterOptions.ConsumerSecret = twitterConsumerSecret;
            //////twitterOptions.Provider = new TwitterAuthenticationProvider()
            //////{
            //////    OnAuthenticated = async twitterContext =>
            //////    {
            //////        twitterContext.Identity.AddClaim(new Claim(TwitterAccessToken, twitterContext.AccessToken));
            //////        twitterContext.Identity.AddClaim(new Claim(TwitterAccessTokenSecret, twitterContext.AccessTokenSecret));
            //////    }
            //////};
            //////app.UseTwitterAuthentication(twitterOptions);

            string facebookAppId = "216759351862940";
            string facebookAppSecret = "faaad023dad3336b8a6d47220a26b333";

            var facebookOptions = new FacebookAuthenticationOptions();
            facebookOptions.AppId = facebookAppId;
            facebookOptions.AppSecret = facebookAppSecret;
            facebookOptions.Scope.Add("email");
            facebookOptions.Scope.Add("user_birthday");
            facebookOptions.Provider = new FacebookAuthenticationProvider()
            {
                OnAuthenticated = async facebookContext =>
                {
                    // Save every additional claim we can find in the user
                    foreach (JProperty property in facebookContext.User.Children())
                    {
                        var claimType = string.Format(FacebookClaimBaseName, property.Name);
                        string claimValue = (string)property.Value;
                        if (!facebookContext.Identity.HasClaim(claimType, claimValue))
                            facebookContext.Identity.AddClaim(new Claim(claimType, claimValue, xmlSchemaString, "External"));
                    }

                }
            };
            facebookOptions.SignInAsAuthenticationType = DefaultAuthenticationTypes.ExternalCookie;
            app.UseFacebookAuthentication(facebookOptions);

            //////string googleClientId = "311532712678-dlue2g71aqo8bjem58p9f49qr1rg26qf.apps.googleusercontent.com";
            //////string googleClientSecret = "ythcum4LmuS45BVw4ScE1GsN";

            //////var googleAuthenticationOptions = new GoogleOAuth2AuthenticationOptions
            //////{
            //////    ClientId = googleClientId,
            //////    ClientSecret = googleClientSecret,
            //////    Provider = new GoogleOAuth2AuthenticationProvider()
            //////    {
            //////        OnAuthenticated = async googleContext =>
            //////        {
            //////            string profileClaimName = string.Format("urn:google:{0}", "profile");
            //////            foreach (JProperty property in googleContext.User.Children())
            //////            {
            //////                var claimType = string.Format("urn:google:{0}", property.Name);
            //////                string claimValue = (string)property.Value;
            //////                if (!googleContext.Identity.HasClaim(claimType, claimValue))
            //////                googleContext.Identity.AddClaim(new Claim(claimType, claimValue, 
            //////                      "http://www.w3.org/2001/XMLSchema#string", "External"));
            //////            }
            //////        }
            //////    }
            //////};
            //////googleAuthenticationOptions.Scope.Add("https://www.googleapis.com/auth/plus.login");
            //////googleAuthenticationOptions.Scope.Add("https://www.googleapis.com/auth/userinfo.email");
            //////app.UseGoogleAuthentication(googleAuthenticationOptions);



            //app.UseFacebookAuthentication(
            //  appId: "216759351862940",
            //   appSecret: "faaad023dad3336b8a6d47220a26b333");

            //app.UseGoogleAuthentication(new GoogleOAuth2AuthenticationOptions()
            //{
            //    ClientId = "311532712678-dlue2g71aqo8bjem58p9f49qr1rg26qf.apps.googleusercontent.com",
            //    ClientSecret = "ythcum4LmuS45BVw4ScE1GsN"
            //});
        }
    }
}