using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;
using System.ComponentModel.DataAnnotations;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.ComponentModel.DataAnnotations.Schema;


namespace NewPhotoCloud.Repositories
{

    public class NewPhotoCloudUsuarios
    {
       
        [Key]
        public int? Usu_Id { get; set; }
        public string Usu_Nome { get; set; }
        public string Usu_SobreNome { get; set; }
        public DateTime? Usu_DataNascimento { get; set; }
        public string Usu_Sexo { get; set; }
        public int Usu_Nivel { get; set; }
        public string Usu_DiretorioBase { get; set; }
        public string Usu_Status { get; set; }
        public DateTime? Usu_DataCadastro { get; set; }
        public string Usu_FotoPerfil { get; set; }

    }
    public class NewPhotoCloudUsuariosAcesso
    {
        
        [Key]
        public string Uac_Id { get; set; }
        public DateTime? Uac_DataExpiracao { get; set; }
        public string Uac_Email { get; set; }
        public bool Uac_EmailConfirmed { get; set; }
        public string Uac_PasswordHash { get; set; }
        public string Uac_SecurityStamp { get; set; }
        public string Uac_PhoneNumber { get; set; }
        public bool Uac_PhoneNumberConfirmed { get; set; }
        public bool Uac_TwoFactorEnabled { get; set; }
        public DateTime? Uac_LockoutEndDateUtc { get; set; }
        public bool Uac_LockoutEnabled { get; set; }
        public int Uac_AccessFailedCount { get; set; }
        public string Uac_UserName { get; set; }
        public virtual NewPhotoCloudUsuarios Uac_Fk { get; set; }



    }

    public class UsuarioContext: DbContext
    {

        public UsuarioContext()
            : base("DefaultConnection")
        {
        }

        
        public System.Data.Entity.DbSet<NewPhotoCloudUsuarios> CloudUsuarios { get; set; }
        public System.Data.Entity.DbSet<NewPhotoCloudUsuariosAcesso> CloudUsuariosAcesso { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {

            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
            //modelBuilder.HasDefaultSchema("dbo");
            
//            modelBuilder.Conventions.Remove();
   //       modelBuilder.Entity<NewPhotoCloudUsuarios>().ToTable("NewPhotoCloudUsuarios","NewPhotoCloud");

            
        }
    }
}