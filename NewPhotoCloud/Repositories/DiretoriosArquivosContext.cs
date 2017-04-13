using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Linq;
using System.Web;

namespace NewPhotoCloud.Repositories
{
    public class NewPhotoCloudDiretoriosArquivos
    {
        [Key]
        public int? Dia_Id { get; set; }
        public string Dia_Nome { get; set; }
        public string Dia_NomeOriginal { get; set; }
        public string Dia_NomeLixeira { get; set; }
        public string Dia_CaminhoOriginal { get; set; }
        public string Dia_CaminhoAtual { get; set; }
        public string Dia_Tipo { get; set; }
        public DateTime? Dia_DataCriacao { get; set; }
        public DateTime? Dia_DataExclusao { get; set; }
        public string Dia_Status { get; set; }
        public int? Dia_Fk_Usu_id { get; set; }
    }

    public class  DiretoriosArquivosContext: DbContext
    {

        public DiretoriosArquivosContext()
           : base("DefaultConnection")
        {
        }


        public System.Data.Entity.DbSet<NewPhotoCloudDiretoriosArquivos> CloudDiretoriosArquivos { get; set; }

        public static DiretoriosArquivosContext Create()
        {
            return new DiretoriosArquivosContext();
        }


        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {

            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
        }
    }
}