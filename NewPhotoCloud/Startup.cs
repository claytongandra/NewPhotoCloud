using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(NewPhotoCloud.Startup))]
namespace NewPhotoCloud
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
