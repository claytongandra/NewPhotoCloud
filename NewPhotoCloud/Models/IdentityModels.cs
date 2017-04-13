using System;
using System.Data.Entity;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System.Data.Entity.ModelConfiguration.Conventions;
using NewPhotoCloud.Repositories;


namespace NewPhotoCloud.Models
{
    // You can add profile data for the user by adding more properties to your ApplicationUser class, please visit http://go.microsoft.com/fwlink/?LinkID=317594 to learn more.
    public class ApplicationUser : IdentityUser
    {
        public async Task<ClaimsIdentity> GenerateUserIdentityAsync(UserManager<ApplicationUser> manager)
        {
            // Note the authenticationType must match the one defined in CookieAuthenticationOptions.AuthenticationType
            var userIdentity = await manager.CreateIdentityAsync(this, DefaultAuthenticationTypes.ApplicationCookie);
            // Add custom user claims here
            return userIdentity;

        }

        public DateTime? Uac_DataExpiracao { get; set; }
        public virtual NewPhotoCloudUsuarios Uac_Fk { get; set; }
    }

    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext()
            : base("DefaultConnection", throwIfV1Schema: false)
        {
        }

        public static ApplicationDbContext Create()
        {
            return new ApplicationDbContext();
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {

            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
            base.OnModelCreating(modelBuilder);

          //  modelBuilder.HasDefaultSchema("");

            modelBuilder.Entity<ApplicationUser>().ToTable("NewPhotoCloudUsuariosAcesso").Property(p => p.Id).HasColumnName("Uac_Id");
            modelBuilder.Entity<ApplicationUser>().ToTable("NewPhotoCloudUsuariosAcesso").Property(p => p.Email).HasColumnName("Uac_Email");
            modelBuilder.Entity<ApplicationUser>().ToTable("NewPhotoCloudUsuariosAcesso").Property(p => p.EmailConfirmed).HasColumnName("Uac_EmailConfirmed");
            modelBuilder.Entity<ApplicationUser>().ToTable("NewPhotoCloudUsuariosAcesso").Property(p => p.PasswordHash).HasColumnName("Uac_PasswordHash");
            modelBuilder.Entity<ApplicationUser>().ToTable("NewPhotoCloudUsuariosAcesso").Property(p => p.SecurityStamp).HasColumnName("Uac_SecurityStamp");
            modelBuilder.Entity<ApplicationUser>().ToTable("NewPhotoCloudUsuariosAcesso").Property(p => p.PhoneNumber).HasColumnName("Uac_PhoneNumber");
            modelBuilder.Entity<ApplicationUser>().ToTable("NewPhotoCloudUsuariosAcesso").Property(p => p.PhoneNumberConfirmed).HasColumnName("Uac_PhoneNumberConfirmed");
            modelBuilder.Entity<ApplicationUser>().ToTable("NewPhotoCloudUsuariosAcesso").Property(p => p.TwoFactorEnabled).HasColumnName("Uac_TwoFactorEnabled");
            modelBuilder.Entity<ApplicationUser>().ToTable("NewPhotoCloudUsuariosAcesso").Property(p => p.LockoutEndDateUtc).HasColumnName("Uac_LockoutEndDateUtc");
            modelBuilder.Entity<ApplicationUser>().ToTable("NewPhotoCloudUsuariosAcesso").Property(p => p.LockoutEnabled).HasColumnName("Uac_LockoutEnabled");
            modelBuilder.Entity<ApplicationUser>().ToTable("NewPhotoCloudUsuariosAcesso").Property(p => p.AccessFailedCount).HasColumnName("Uac_AccessFailedCount");
            modelBuilder.Entity<ApplicationUser>().ToTable("NewPhotoCloudUsuariosAcesso").Property(p => p.UserName).HasColumnName("Uac_UserName");

            modelBuilder.Entity<IdentityUserRole>().ToTable("NewPhotoCloudUsuariosRoles").Property(p => p.UserId).HasColumnName("Uro_UsuarioId");
            modelBuilder.Entity<IdentityUserRole>().ToTable("NewPhotoCloudUsuariosRoles").Property(p => p.RoleId).HasColumnName("Uro_RoleId");

            modelBuilder.Entity<IdentityUserLogin>().ToTable("NewPhotoCloudUsuariosLogins").Property(p => p.UserId).HasColumnName("Ulo_UsuarioId");
            modelBuilder.Entity<IdentityUserLogin>().ToTable("NewPhotoCloudUsuariosLogins").Property(p => p.LoginProvider).HasColumnName("Ulo_LoginProvider");
            modelBuilder.Entity<IdentityUserLogin>().ToTable("NewPhotoCloudUsuariosLogins").Property(p => p.ProviderKey).HasColumnName("Ulo_ProviderKey");

            modelBuilder.Entity<IdentityUserClaim>().ToTable("NewPhotoCloudUsuariosClaims").Property(p => p.Id).HasColumnName("Ucl_Id");
            modelBuilder.Entity<IdentityUserClaim>().ToTable("NewPhotoCloudUsuariosClaims").Property(p => p.UserId).HasColumnName("Ucl_UsuarioId");
            modelBuilder.Entity<IdentityUserClaim>().ToTable("NewPhotoCloudUsuariosClaims").Property(p => p.ClaimType).HasColumnName("Ucl_ClaimType");
            modelBuilder.Entity<IdentityUserClaim>().ToTable("NewPhotoCloudUsuariosClaims").Property(p => p.ClaimValue).HasColumnName("Ucl_ClaimValue");

            modelBuilder.Entity<IdentityRole>().ToTable("NewPhotoCloudRoles").Property(p => p.Id).HasColumnName("Rol_Id");
            modelBuilder.Entity<IdentityRole>().ToTable("NewPhotoCloudRoles").Property(p => p.Name).HasColumnName("Rol_Name");

        }
    }
}