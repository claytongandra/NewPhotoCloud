namespace NewPhotoCloud.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class NewPhotoApplicationDb : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.NewPhotoCloudRoles",
                c => new
                    {
                        Rol_Id = c.String(nullable: false, maxLength: 128),
                        Rol_Name = c.String(nullable: false, maxLength: 256),
                    })
                .PrimaryKey(t => t.Rol_Id)
                .Index(t => t.Rol_Name, unique: true, name: "RoleNameIndex");
            
            CreateTable(
                "dbo.NewPhotoCloudUsuariosRoles",
                c => new
                    {
                        Uro_UsuarioId = c.String(nullable: false, maxLength: 128),
                        Uro_RoleId = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => new { t.Uro_UsuarioId, t.Uro_RoleId })
                .ForeignKey("dbo.NewPhotoCloudRoles", t => t.Uro_RoleId, cascadeDelete: true)
                .ForeignKey("dbo.NewPhotoCloudUsuariosAcesso", t => t.Uro_UsuarioId, cascadeDelete: true)
                .Index(t => t.Uro_UsuarioId)
                .Index(t => t.Uro_RoleId);
            
            CreateTable(
                "dbo.NewPhotoCloudUsuariosAcesso",
                c => new
                    {
                        Uac_Id = c.String(nullable: false, maxLength: 128),
                        Uac_DataExpiracao = c.DateTime(),
                        Uac_Email = c.String(maxLength: 256),
                        Uac_EmailConfirmed = c.Boolean(nullable: false),
                        Uac_PasswordHash = c.String(),
                        Uac_SecurityStamp = c.String(),
                        Uac_PhoneNumber = c.String(),
                        Uac_PhoneNumberConfirmed = c.Boolean(nullable: false),
                        Uac_TwoFactorEnabled = c.Boolean(nullable: false),
                        Uac_LockoutEndDateUtc = c.DateTime(),
                        Uac_LockoutEnabled = c.Boolean(nullable: false),
                        Uac_AccessFailedCount = c.Int(nullable: false),
                        Uac_UserName = c.String(nullable: false, maxLength: 256),
                        Uac_Fk_Usu_Id = c.Int(),
                    })
                .PrimaryKey(t => t.Uac_Id)
                .ForeignKey("dbo.NewPhotoCloudUsuarios", t => t.Uac_Fk_Usu_Id)
                .Index(t => t.Uac_UserName, unique: true, name: "UserNameIndex")
                .Index(t => t.Uac_Fk_Usu_Id);
            
            CreateTable(
                "dbo.NewPhotoCloudUsuariosClaims",
                c => new
                    {
                        Ucl_Id = c.Int(nullable: false, identity: true),
                        Ucl_UsuarioId = c.String(nullable: false, maxLength: 128),
                        Ucl_ClaimType = c.String(),
                        Ucl_ClaimValue = c.String(),
                    })
                .PrimaryKey(t => t.Ucl_Id)
                .ForeignKey("dbo.NewPhotoCloudUsuariosAcesso", t => t.Ucl_UsuarioId, cascadeDelete: true)
                .Index(t => t.Ucl_UsuarioId);
            
            CreateTable(
                "dbo.NewPhotoCloudUsuariosLogins",
                c => new
                    {
                        Ulo_LoginProvider = c.String(nullable: false, maxLength: 128),
                        Ulo_ProviderKey = c.String(nullable: false, maxLength: 128),
                        Ulo_UsuarioId = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => new { t.Ulo_LoginProvider, t.Ulo_ProviderKey, t.Ulo_UsuarioId })
                .ForeignKey("dbo.NewPhotoCloudUsuariosAcesso", t => t.Ulo_UsuarioId, cascadeDelete: true)
                .Index(t => t.Ulo_UsuarioId);
            
            CreateTable(
                "dbo.NewPhotoCloudUsuarios",
                c => new
                    {
                        Usu_Id = c.Int(nullable: false, identity: true),
                        Usu_Nome = c.String(),
                        Usu_SobreNome = c.String(),
                        Usu_DataNascimento = c.DateTime(),
                        Usu_Sexo = c.String(),
                        Usu_Nivel = c.Int(nullable: false),
                        Usu_DiretorioBase = c.String(),
                        Usu_Status = c.String(),
                        Usu_DataCadastro = c.DateTime(),
                        Usu_FotoPerfil = c.String(),
                    })
                .PrimaryKey(t => t.Usu_Id);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.NewPhotoCloudUsuariosAcesso", "Uac_Fk_Usu_Id", "dbo.NewPhotoCloudUsuarios");
            DropForeignKey("dbo.NewPhotoCloudUsuariosRoles", "Uro_UsuarioId", "dbo.NewPhotoCloudUsuariosAcesso");
            DropForeignKey("dbo.NewPhotoCloudUsuariosLogins", "Ulo_UsuarioId", "dbo.NewPhotoCloudUsuariosAcesso");
            DropForeignKey("dbo.NewPhotoCloudUsuariosClaims", "Ucl_UsuarioId", "dbo.NewPhotoCloudUsuariosAcesso");
            DropForeignKey("dbo.NewPhotoCloudUsuariosRoles", "Uro_RoleId", "dbo.NewPhotoCloudRoles");
            DropIndex("dbo.NewPhotoCloudUsuariosLogins", new[] { "Ulo_UsuarioId" });
            DropIndex("dbo.NewPhotoCloudUsuariosClaims", new[] { "Ucl_UsuarioId" });
            DropIndex("dbo.NewPhotoCloudUsuariosAcesso", new[] { "Uac_Fk_Usu_Id" });
            DropIndex("dbo.NewPhotoCloudUsuariosAcesso", "UserNameIndex");
            DropIndex("dbo.NewPhotoCloudUsuariosRoles", new[] { "Uro_RoleId" });
            DropIndex("dbo.NewPhotoCloudUsuariosRoles", new[] { "Uro_UsuarioId" });
            DropIndex("dbo.NewPhotoCloudRoles", "RoleNameIndex");
            DropTable("dbo.NewPhotoCloudUsuarios");
            DropTable("dbo.NewPhotoCloudUsuariosLogins");
            DropTable("dbo.NewPhotoCloudUsuariosClaims");
            DropTable("dbo.NewPhotoCloudUsuariosAcesso");
            DropTable("dbo.NewPhotoCloudUsuariosRoles");
            DropTable("dbo.NewPhotoCloudRoles");
        }
    }
}
