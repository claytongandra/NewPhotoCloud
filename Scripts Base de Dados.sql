use NewPhotoCloud

SELECT 
[Usu_Status]
,[Usu_DiretorioBase]
,[Uac_UserName]
,*
FROM [NewPhotoCloud].[dbo].[NewPhotoCloudUsuarios]
INNER JOIN [NewPhotoCloud].[dbo].[NewPhotoCloudUsuariosAcesso] ON [Usu_Id] = Uac_Fk_Usu_Id
ORDER BY Usu_Id
  
--DELETE FROM  [NewPhotoCloud].[dbo].[NewPhotoCloudUsuariosAcesso] where Uac_id = '8d939df6-35fd-430f-8ff5-b7376842dd10'
--DELETE FROM [NewPhotoCloud].[dbo].[NewPhotoCloudUsuarios] WHERE Usu_Id = 3
--DELETE FROM [NewPhotoCloud].[dbo].NewPhotoCloudDiretoriosArquivos  WHERE Dia_Id > 2815
--DELETE FROM [NewPhotoCloud].[dbo].NewPhotoCloudDiretoriosArquivos  WHERE Dia_Id = 449

--DBCC CHECKIDENT('[NewPhotoCloud].[dbo].NewPhotoCloudDiretoriosArquivos', RESEED, 2815)
--DBCC CHECKIDENT('[NewPhotoCloud].[dbo].[NewPhotoCloudUsuarios]', RESEED, 2)


--DELETE FROM [NewPhotoCloud].[dbo].NewPhotoCloudDiretoriosArquivos
--DBCC CHECKIDENT('[NewPhotoCloud].[dbo].NewPhotoCloudDiretoriosArquivos', RESEED, 0)
/*
DROP TABLE [NewPhotoCloud].[dbo].[NewPhotoCloudUsuariosLogins]
DROP TABLE [NewPhotoCloud].[dbo].[NewPhotoCloudUsuariosRoles]
DROP TABLE [NewPhotoCloud].[dbo].[NewPhotoCloudRoles]
DROP TABLE [NewPhotoCloud].[dbo].[NewPhotoCloudUsuariosClaims]
DROP TABLE [NewPhotoCloud].[dbo].[NewPhotoCloudUsuariosAcesso]
DROP TABLE [NewPhotoCloud].[dbo].[NewPhotoCloudDiretoriosArquivos]
DROP TABLE [NewPhotoCloud].[dbo].[NewPhotoCloudDiretoriosArquivosTemporaria]
DROP TABLE [NewPhotoCloud].[dbo].[NewPhotoCloudUsuarios]

*/
--SET IDENTITY_INSERT NewPhotoCloudDiretoriosArquivos OFF

--DROP TABLE #NewPhotoCloudDiretoriosArquivosTemporaria

--DELETE FROM NewPhotoCloudDiretoriosArquivosTemporaria
DBCC CHECKIDENT('NewPhotoCloudDiretoriosArquivosTemporaria', RESEED, 0)

select * from #NewPhotoCloudDiretoriosArquivosTemporaria

select * from NewPhotoCloudDiretoriosArquivosTemporaria

create table NewPhotoCloudDiretoriosArquivosTemporaria
    (
		Dia_Id INT IDENTITY,
	Dia_Fk_Usu_Id INT NOT NULL,
	Dia_Nome VARCHAR(100) NOT NULL,
	Dia_NomeOriginal VARCHAR(500)NULL,
	Dia_NomeLixeira VARCHAR(100) NULL,
	Dia_CaminhoOriginal VARCHAR(MAX) NULL,
	Dia_CaminhoAtual VARCHAR(8000) NOT NULL,
	Dia_Tipo VARCHAR(10)  NOT NULL,
	Dia_DataCriacao DATETIME NOT NULL,
	Dia_DataExclusao DATETIME  NULL,
	Dia_Status VARCHAR(10) NOT NULL
	   CONSTRAINT XPKNewPhotoCloudDiretoriosArquivosTemporaria
			  PRIMARY KEY (Dia_Id)
			  )

-- ALTER TABLE NewPhotoCloudDiretoriosArquivosTemporaria ADD Dia_NomeOriginal VARCHAR(500) NULL;

--****************** AGRUPAR ONIX *****************************
Insert into NewPhotoCloudDiretoriosArquivosTemporaria (Dia_Fk_Usu_Id,Dia_Nome,Dia_NomeOriginal,Dia_NomeLixeira,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) 
(select Dia_Fk_Usu_Id,Dia_Nome,Dia_NomeOriginal,Dia_NomeLixeira,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status
 from NewPhotoCloudDiretoriosArquivos  AS AT WHERE Dia_Id < 138)
 
 Insert into NewPhotoCloudDiretoriosArquivosTemporaria (Dia_Fk_Usu_Id,Dia_Nome,Dia_NomeOriginal,Dia_NomeLixeira,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) 
(select Dia_Fk_Usu_Id,Dia_Nome,Dia_NomeOriginal,Dia_NomeLixeira,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status
 from NewPhotoCloudDiretoriosArquivos  AS AT WHERE Dia_Id > 2747)
 
  Insert into NewPhotoCloudDiretoriosArquivosTemporaria (Dia_Fk_Usu_Id,Dia_Nome,Dia_NomeOriginal,Dia_NomeLixeira,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) 
(select Dia_Fk_Usu_Id,Dia_Nome,Dia_NomeOriginal,Dia_NomeLixeira,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status
 from NewPhotoCloudDiretoriosArquivos  AS AT WHERE Dia_Id > 137 AND Dia_Id < 2748)
 /*
 DROP TABLE [NewPhotoCloud].[dbo].[NewPhotoCloudDiretoriosArquivos]
 
 CREATE TABLE [NewPhotoCloud].[dbo].[NewPhotoCloudDiretoriosArquivos](

	Dia_Id INT IDENTITY,
	Dia_Fk_Usu_Id INT NOT NULL,
	Dia_Nome VARCHAR(100) NOT NULL,
	Dia_NomeOriginal VARCHAR(500)NULL,
	Dia_NomeLixeira VARCHAR(100) NULL,
	Dia_CaminhoOriginal VARCHAR(MAX) NULL,
	Dia_CaminhoAtual VARCHAR(MAX) NOT NULL,
	Dia_Tipo VARCHAR(10)  NOT NULL,
	Dia_DataCriacao DATETIME NOT NULL,
	Dia_DataExclusao DATETIME  NULL,
	Dia_Status VARCHAR(10) NOT NULL
	   CONSTRAINT XPKNewPhotoCloudDiretoriosArquivos
			  PRIMARY KEY (Dia_Id)
)
GO

ALTER TABLE NewPhotoCloudDiretoriosArquivos
       ADD CONSTRAINT Dia_Usu_Id
              FOREIGN KEY (Dia_Fk_Usu_Id)
                             REFERENCES NewPhotoCloudUsuarios
GO

 Insert into NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_NomeOriginal,Dia_NomeLixeira,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) 
(select Dia_Fk_Usu_Id,Dia_Nome,Dia_NomeOriginal,Dia_NomeLixeira,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status
 from NewPhotoCloudDiretoriosArquivosTemporaria  AS A)
 */
--*************************************************************

Insert into NewPhotoCloudDiretoriosArquivosTemporaria (Dia_Fk_Usu_Id,Dia_Nome,Dia_NomeOriginal,Dia_NomeLixeira,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) 
(select Dia_Fk_Usu_Id,Dia_Nome,Dia_NomeOriginal,Dia_NomeLixeira,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status
 from NewPhotoCloudDiretoriosArquivos  AS AT WHERE Dia_Id > 2815)


-- Insert into NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_NomeOriginal,Dia_NomeLixeira,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) 
(select Dia_Fk_Usu_Id,Dia_Nome,Dia_NomeOriginal,Dia_NomeLixeira,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status
 from NewPhotoCloudDiretoriosArquivosTemporaria  AS A)-- WHERE Dia_Id > 2730)
/*

sp_configure 'show advanced options', 1
reconfigure 
go
sp_configure 'Ad Hoc Distributed Queries', 1
reconfigure 
go
sp_configure 'show advanced options', 0
reconfigure 
go
EXEC master.dbo.sp_MSset_oledb_prop N'Microsoft.ACE.OLEDB.12.0', N'AllowInProcess' , 1
GO
EXEC master.dbo.sp_MSset_oledb_prop N'Microsoft.ACE.OLEDB.12.0' , N'DynamicParameters' , 1
GO
-- criar um linked server com a planilha
EXEC sp_addlinkedserver @server = N'ExcelDataSource', 
@srvproduct=N'ExcelData', @provider=N'Microsoft.ACE.OLEDB.12.0', 
@datasrc=N'C:\_Clayton\Programacao\ASP.NET\NewPhotoCloud\Pasta1.xls',
@provstr=N'EXCEL 12.0' ;

INSERT INTO NewPhotoCloudDiretoriosArquivosTemporaria
SELECT * FROM OPENROWSET ('Microsoft.Jet.OleDB.12.0', 'EXCEL 8.0;Database=C:\_Clayton\Programacao\ASP.NET\NewPhotoCloud\Pasta1.xls' ,NewPhotoCloudDiretoriosArquivosTemporaria$)
*/

Leia mais em: Tabelas temporárias no Sql Server http://www.devmedia.com.br/tabelas-temporarias-no-sql-server/2610#ixzz3hnwAf0z0

DBCC CHECKIDENT('[NewPhotoCloud].[dbo].NewPhotoCloudDiretoriosArquivos', RESEED, 448)

SELECT * FROM [NewPhotoCloud].[dbo].[NewPhotoCloudDiretoriosArquivos] where Dia_Tipo = 'D'
SELECT * FROM [NewPhotoCloud].[dbo].[NewPhotoCloudDiretoriosArquivos] where Dia_Tipo = 'A'

SELECT * FROM [NewPhotoCloud].[dbo].[NewPhotoCloudUsuarios]
SELECT * FROM [NewPhotoCloud].[dbo].[NewPhotoCloudUsuariosAcesso]
SELECT * FROM [NewPhotoCloud].[dbo].[NewPhotoCloudDiretoriosArquivos]
SELECT * FROM [NewPhotoCloud].[dbo].[NewPhotoCloudDiretoriosArquivosTemporaria]
SELECT * FROM [NewPhotoCloud].[dbo].[NewPhotoCloudUsuariosLogins]
SELECT * FROM [NewPhotoCloud].[dbo].[NewPhotoCloudRoles]
SELECT * FROM [NewPhotoCloud].[dbo].[NewPhotoCloudUsuariosClaims]
SELECT * FROM [NewPhotoCloud].[dbo].[NewPhotoCloudUsuariosRoles]

/***************************************************************************************/




--****************** Reajustar ONIX *****************************

Insert into NewPhotoCloudDiretoriosArquivosTemporaria (Dia_Fk_Usu_Id,Dia_Nome,Dia_NomeOriginal,Dia_NomeLixeira,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) 
(select Dia_Fk_Usu_Id,Dia_Nome,Dia_NomeOriginal,Dia_NomeLixeira,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status
 from NewPhotoCloudDiretoriosArquivos  AS AT WHERE Dia_Id < 134)
 
 Insert into NewPhotoCloudDiretoriosArquivosTemporaria (Dia_Fk_Usu_Id,Dia_Nome,Dia_NomeOriginal,Dia_NomeLixeira,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) 
(select Dia_Fk_Usu_Id,Dia_Nome,Dia_NomeOriginal,Dia_NomeLixeira,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status
 from NewPhotoCloudDiretoriosArquivos  AS AT WHERE Dia_Id > 2781)
 
  Insert into NewPhotoCloudDiretoriosArquivosTemporaria (Dia_Fk_Usu_Id,Dia_Nome,Dia_NomeOriginal,Dia_NomeLixeira,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) 
(select Dia_Fk_Usu_Id,Dia_Nome,Dia_NomeOriginal,Dia_NomeLixeira,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status
 from NewPhotoCloudDiretoriosArquivos  AS AT WHERE Dia_Id > 133 AND Dia_Id < 2782)
 /*
 DROP TABLE [NewPhotoCloud].[dbo].[NewPhotoCloudDiretoriosArquivos]
 
 CREATE TABLE [NewPhotoCloud].[dbo].[NewPhotoCloudDiretoriosArquivos](

	Dia_Id INT IDENTITY,
	Dia_Fk_Usu_Id INT NOT NULL,
	Dia_Nome VARCHAR(100) NOT NULL,
	Dia_NomeOriginal VARCHAR(500)NULL,
	Dia_NomeLixeira VARCHAR(100) NULL,
	Dia_CaminhoOriginal VARCHAR(MAX) NULL,
	Dia_CaminhoAtual VARCHAR(MAX) NOT NULL,
	Dia_Tipo VARCHAR(10)  NOT NULL,
	Dia_DataCriacao DATETIME NOT NULL,
	Dia_DataExclusao DATETIME  NULL,
	Dia_Status VARCHAR(10) NOT NULL
	   CONSTRAINT XPKNewPhotoCloudDiretoriosArquivos
			  PRIMARY KEY (Dia_Id)
)
GO

ALTER TABLE NewPhotoCloudDiretoriosArquivos
       ADD CONSTRAINT Dia_Usu_Id
              FOREIGN KEY (Dia_Fk_Usu_Id)
                             REFERENCES NewPhotoCloudUsuarios
GO

 Insert into NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_NomeOriginal,Dia_NomeLixeira,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) 
(select Dia_Fk_Usu_Id,Dia_Nome,Dia_NomeOriginal,Dia_NomeLixeira,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status
 from NewPhotoCloudDiretoriosArquivosTemporaria  AS A)
 */
--*************************************************************



sp_help NewPhotoCloudUsuarios

 SELECT * FROM  [NewPhotoCloud].[dbo].NewPhotoCloudDiretoriosArquivos

 DROP TABLE [NewPhotoCloudDiretoriosArquivos]

CREATE TABLE [NewPhotoCloud].[dbo].[NewPhotoCloudDiretoriosArquivos](

	Dia_Id INT IDENTITY,
	Dia_Fk_Usu_Id INT NOT NULL,
	Dia_Nome VARCHAR(100) NOT NULL,
	Dia_NomeOriginal VARCHAR(500)NULL,
	Dia_NomeLixeira VARCHAR(100) NULL,
	Dia_CaminhoOriginal VARCHAR(MAX) NULL,
	Dia_CaminhoAtual VARCHAR(MAX) NOT NULL,
	Dia_Tipo VARCHAR(10)  NOT NULL,
	Dia_DataCriacao DATETIME NOT NULL,
	Dia_DataExclusao DATETIME  NULL,
	Dia_Status VARCHAR(10) NOT NULL
	   CONSTRAINT XPKNewPhotoCloudDiretoriosArquivos
			  PRIMARY KEY (Dia_Id)
)
GO

ALTER TABLE NewPhotoCloudDiretoriosArquivos
       ADD CONSTRAINT Dia_Usu_Id
              FOREIGN KEY (Dia_Fk_Usu_Id)
                             REFERENCES NewPhotoCloudUsuarios
GO

-- ALTER TABLE NewPhotoCloudDiretoriosArquivos ADD Dia_NomeOriginal VARCHAR(500) NULL;

--ALTER TABLE dbo.NewPhotoCloudUsuarios ADD Usu_FotoPerfil VARCHAR(MAX) NULL

--DELETE FROM [NewPhotoCloud].[dbo].NewPhotoCloudDiretoriosArquivos

--DBCC CHECKIDENT('[NewPhotoCloud].[dbo].NewPhotoCloudDiretoriosArquivos', RESEED, 0)

UPDATE NewPhotoCloudUsuarios SET Usu_FotoPerfil = NULL where Usu_Id = 1 
UPDATE NewPhotoCloudUsuarios SET Usu_FotoPerfil = NULL where Usu_Id = 2

UPDATE NewPhotoCloudDiretoriosArquivos SET Dia_CaminhoOriginal = '/Primeira Pasta/Pasta interna nível 2/',Dia_CaminhoAtual = '/', Dia_DataExclusao = GETDATE(), Dia_Status = 'E' where Dia_Id = 3

UPDATE NewPhotoCloudDiretoriosArquivos SET Dia_CaminhoAtual = '/Imagens de Filmes/Star Wars/' WHERE Dia_CaminhoAtual = '/Star Wars/'

UPDATE NewPhotoCloudDiretoriosArquivos SET Dia_CaminhoAtual = '/Imagens 2015/' WHERE Dia_Id = '11'
SELECT * FROM [NewPhotoCloud].[dbo].[NewPhotoCloudUsuarios]

SELECT * FROM [NewPhotoCloud].[dbo].[NewPhotoCloudUsuariosAcesso]
  
SELECT * FROM  [NewPhotoCloud].[dbo].NewPhotoCloudDiretoriosArquivos
  
 -- DBCC CHECKIDENT('[NewPhotoCloud].[dbo].NewPhotoCloudDiretoriosArquivos', RESEED, 448)
  SELECT * FROM [NewPhotoCloud].[dbo].[NewPhotoCloudDiretoriosArquivos] where Dia_Tipo = 'D'
--INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_NomeLixeira,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'fotos-136.jpg',NULL,NULL,'/Smile Village Vila Prudente/Apartamento Decorado/Maquete/','A',	GETDATE(),	NULL,	'A')

use NewPhotoCloud
/*
--Smile Village Vila Prudente
INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Smile Village Vila Prudente',NULL,'/','D',GETDATE(),NULL,'A')
	--Apartamento Decorado
	INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Apartamento Decorado',NULL,'/Smile Village Vila Prudente/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Banheiro',NULL,'/Smile Village Vila Prudente/Apartamento Decorado/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Cozinha e Área de Serviço',NULL,'/Smile Village Vila Prudente/Apartamento Decorado/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Maquete',NULL,'/Smile Village Vila Prudente/Apartamento Decorado/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Quarto de casal',NULL,'/Smile Village Vila Prudente/Apartamento Decorado/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Quarto de solteiro',NULL,'/Smile Village Vila Prudente/Apartamento Decorado/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Sala',NULL,'/Smile Village Vila Prudente/Apartamento Decorado/','D',GETDATE(),NULL,'A')
	--Chevrolet Onix 2015
	INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Chevrolet Onix 2015',NULL,'/Smile Village Vila Prudente/','D',GETDATE(),NULL,'A')
	--Estágios
	INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Estágios',NULL,'/Smile Village Vila Prudente/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Estágio 01-01-2010',NULL,'/Smile Village Vila Prudente/Estágios/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Estágio 01-01-2011',NULL,'/Smile Village Vila Prudente/Estágios/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Estágio 01-02-2010',NULL,'/Smile Village Vila Prudente/Estágios/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Estágio 01-03-2010',NULL,'/Smile Village Vila Prudente/Estágios/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Estágio 01-05-2011',NULL,'/Smile Village Vila Prudente/Estágios/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Estágio 01-06-2010',NULL,'/Smile Village Vila Prudente/Estágios/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Estágio 01-06-2011',NULL,'/Smile Village Vila Prudente/Estágios/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Estágio 01-07-2010',NULL,'/Smile Village Vila Prudente/Estágios/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Estágio 01-07-2011',NULL,'/Smile Village Vila Prudente/Estágios/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Estágio 01-08-2011',NULL,'/Smile Village Vila Prudente/Estágios/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Estágio 01-09-2010',NULL,'/Smile Village Vila Prudente/Estágios/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Estágio 01-09-2011',NULL,'/Smile Village Vila Prudente/Estágios/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Estágio 01-10-2010',NULL,'/Smile Village Vila Prudente/Estágios/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Estágio 01-10-2011',NULL,'/Smile Village Vila Prudente/Estágios/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Estágio 01-11-2010',NULL,'/Smile Village Vila Prudente/Estágios/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Estágio 01-11-2011',NULL,'/Smile Village Vila Prudente/Estágios/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Estágio 01-12-2010',NULL,'/Smile Village Vila Prudente/Estágios/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Estágio 02-11-2009',NULL,'/Smile Village Vila Prudente/Estágios/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Estágio 04-05-2010',NULL,'/Smile Village Vila Prudente/Estágios/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Estágio 08-05-2009',NULL,'/Smile Village Vila Prudente/Estágios/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Estágio 30-03-2010',NULL,'/Smile Village Vila Prudente/Estágios/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Estágio 30-07-2010',NULL,'/Smile Village Vila Prudente/Estágios/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Estágio 30-09-2009',NULL,'/Smile Village Vila Prudente/Estágios/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Estágio 30-11-2009',NULL,'/Smile Village Vila Prudente/Estágios/','D',GETDATE(),NULL,'A')
	--Fotos da Obra
	INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Fotos da Obra',NULL,'/Smile Village Vila Prudente/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Fotos 02-07-2011',NULL,'/Smile Village Vila Prudente/Fotos da Obra/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Fotos 03-06-2011',NULL,'/Smile Village Vila Prudente/Fotos da Obra/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Fotos 03-09-2011',NULL,'/Smile Village Vila Prudente/Fotos da Obra/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Fotos 04-06-2010 - Entrega do córrego',NULL,'/Smile Village Vila Prudente/Fotos da Obra/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Fotos 05-06-2011',NULL,'/Smile Village Vila Prudente/Fotos da Obra/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Fotos 06-09-2011',NULL,'/Smile Village Vila Prudente/Fotos da Obra/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Fotos 08-05-2011',NULL,'/Smile Village Vila Prudente/Fotos da Obra/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Fotos 08-08-2009',NULL,'/Smile Village Vila Prudente/Fotos da Obra/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Fotos 08-09-2011',NULL,'/Smile Village Vila Prudente/Fotos da Obra/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Fotos 09-04-2010',NULL,'/Smile Village Vila Prudente/Fotos da Obra/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Fotos 15-09-2011',NULL,'/Smile Village Vila Prudente/Fotos da Obra/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Fotos 15-10-2011',NULL,'/Smile Village Vila Prudente/Fotos da Obra/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Fotos 18-08-2011',NULL,'/Smile Village Vila Prudente/Fotos da Obra/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Fotos 19-09-2011',NULL,'/Smile Village Vila Prudente/Fotos da Obra/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Fotos 19-10-2011',NULL,'/Smile Village Vila Prudente/Fotos da Obra/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Fotos 20-08-2011',NULL,'/Smile Village Vila Prudente/Fotos da Obra/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Fotos 22-08-2010',NULL,'/Smile Village Vila Prudente/Fotos da Obra/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Fotos 22-09-2011',NULL,'/Smile Village Vila Prudente/Fotos da Obra/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Fotos 23-07-2011',NULL,'/Smile Village Vila Prudente/Fotos da Obra/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Fotos 27-08-2011',NULL,'/Smile Village Vila Prudente/Fotos da Obra/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Fotos 29-05-2011',NULL,'/Smile Village Vila Prudente/Fotos da Obra/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Fotos 29-10-2011',NULL,'/Smile Village Vila Prudente/Fotos da Obra/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Fotos 30-12-2009',NULL,'/Smile Village Vila Prudente/Fotos da Obra/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Fotos 31-01-2010',NULL,'/Smile Village Vila Prudente/Fotos da Obra/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Fotos Assembleia 31-10-2011',NULL,'/Smile Village Vila Prudente/Fotos da Obra/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Fotos Smile Geodactha',NULL,'/Smile Village Vila Prudente/Fotos da Obra/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Fotos Vistoria 06-10-2011',NULL,'/Smile Village Vila Prudente/Fotos da Obra/','D',GETDATE(),NULL,'A')
	--Fotos de Anúncios
	INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Fotos de Anúncios',NULL,'/Smile Village Vila Prudente/','D',GETDATE(),NULL,'A')
	--Fotos Smile
	INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Fotos Smile',NULL,'/Smile Village Vila Prudente/','D',GETDATE(),NULL,'A')
		--Aquisições 2014
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Aquisições 2014',NULL,'/Smile Village Vila Prudente/Fotos Smile/','D',GETDATE(),NULL,'A')
			INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Maio 2014',NULL,'/Smile Village Vila Prudente/Fotos Smile/Aquisições 2014/','D',GETDATE(),NULL,'A')
			INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Março 2014',NULL,'/Smile Village Vila Prudente/Fotos Smile/Aquisições 2014/','D',GETDATE(),NULL,'A')
		--Aquisições 2015
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Aquisições 2015',NULL,'/Smile Village Vila Prudente/Fotos Smile/','D',GETDATE(),NULL,'A')
			INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Abril 2015',NULL,'/Smile Village Vila Prudente/Fotos Smile/Aquisições 2015/','D',GETDATE(),NULL,'A')
			INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Janeiro 2015',NULL,'/Smile Village Vila Prudente/Fotos Smile/Aquisições 2015/','D',GETDATE(),NULL,'A')
			INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Julho 2015',NULL,'/Smile Village Vila Prudente/Fotos Smile/Aquisições 2015/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Armário Área de Serviço 19-01-2013',NULL,'/Smile Village Vila Prudente/Fotos Smile/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Armário Escritório - 26-08-2014',NULL,'/Smile Village Vila Prudente/Fotos Smile/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Banheiro - 22-03-2014',NULL,'/Smile Village Vila Prudente/Fotos Smile/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Cadeira Escritório Maio - 2014',NULL,'/Smile Village Vila Prudente/Fotos Smile/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Ducha - Julho 2015',NULL,'/Smile Village Vila Prudente/Fotos Smile/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Escrivaninha 12-05-2013',NULL,'/Smile Village Vila Prudente/Fotos Smile/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Estante 08-02-2014',NULL,'/Smile Village Vila Prudente/Fotos Smile/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Forro de Gesso 02-12-2011',NULL,'/Smile Village Vila Prudente/Fotos Smile/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Forro de Gesso 30-11-2011',NULL,'/Smile Village Vila Prudente/Fotos Smile/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Gabinete do Banheiro 26-07-2012',NULL,'/Smile Village Vila Prudente/Fotos Smile/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Individualização de Água 11-06-2014',NULL,'/Smile Village Vila Prudente/Fotos Smile/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Instalação Aquecedor 10-11-2011',NULL,'/Smile Village Vila Prudente/Fotos Smile/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Instalação Coifa e Película Agosto 2013',NULL,'/Smile Village Vila Prudente/Fotos Smile/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Natal e Ano Novo 2012',NULL,'/Smile Village Vila Prudente/Fotos Smile/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Planejados dez 2013',NULL,'/Smile Village Vila Prudente/Fotos Smile/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Projeto Cozinha e Quarto de Casal',NULL,'/Smile Village Vila Prudente/Fotos Smile/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Rack TV Sala',NULL,'/Smile Village Vila Prudente/Fotos Smile/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Reforma jan-fev 2012',NULL,'/Smile Village Vila Prudente/Fotos Smile/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Reforma Sofá - Julho 2015',NULL,'/Smile Village Vila Prudente/Fotos Smile/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Smile 01-09-2013',NULL,'/Smile Village Vila Prudente/Fotos Smile/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Visita 14-11-2011',NULL,'/Smile Village Vila Prudente/Fotos Smile/','D',GETDATE(),NULL,'A')
		INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Visita Marco Jane e Mariana 05-11-2011',NULL,'/Smile Village Vila Prudente/Fotos Smile/','D',GETDATE(),NULL,'A')
	--Lazer
	INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Lazer',NULL,'/Smile Village Vila Prudente/','D',GETDATE(),NULL,'A')
	--Plantas
	INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Plantas',NULL,'/Smile Village Vila Prudente/','D',GETDATE(),NULL,'A')
	--Projeto
	INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Projeto',NULL,'/Smile Village Vila Prudente/','D',GETDATE(),NULL,'A')
	--Videos
	INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Videos',NULL,'/Smile Village Vila Prudente/','D',GETDATE(),NULL,'A')*/
--Viagens
INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'Viagens',NULL,'/','D',GETDATE(),NULL,'A')

INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_NomeLixeira,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(2,'fotos-084.jpg',NULL,NULL,'/Smile Village Vila Prudente/Apartamento Decorado/Banheiro/','A',GETDATE(),NULL,'A')

	
INSERT INTO NewPhotoCloudDiretoriosArquivos (Dia_Fk_Usu_Id,Dia_Nome,Dia_NomeLixeira,Dia_CaminhoOriginal,Dia_CaminhoAtual,Dia_Tipo,Dia_DataCriacao,Dia_DataExclusao,Dia_Status) VALUES(
2,
'fotos-084.jpg',
NULL,
NULL,
'/Smile Village Vila Prudente/Apartamento Decorado/Banheiro/',
'A',
GETDATE(),
NULL,
'A'
)	
	
99	
100	2		NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Banheiro/	A	2015-07-31 16:28:55.253	NULL	A
101	2	fotos-095.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Banheiro/	A	2015-07-31 16:28:55.663	NULL	A
102	2	fotos-096.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Banheiro/	A	2015-07-31 16:28:56.030	NULL	A
103	2	fotos-097.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Banheiro/	A	2015-07-31 16:28:56.573	NULL	A
104	2	fotos-035.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Cozinha e Área de Serviço/	A	2015-07-31 16:29:08.647	NULL	A
105	2	fotos-036.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Cozinha e Área de Serviço/	A	2015-07-31 16:29:08.977	NULL	A
106	2	fotos-037.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Cozinha e Área de Serviço/	A	2015-07-31 16:29:09.357	NULL	A
107	2	fotos-038.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Cozinha e Área de Serviço/	A	2015-07-31 16:29:09.777	NULL	A
108	2	fotos-039.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Cozinha e Área de Serviço/	A	2015-07-31 16:29:10.177	NULL	A
109	2	fotos-040.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Cozinha e Área de Serviço/	A	2015-07-31 16:29:10.517	NULL	A
110	2	fotos-041.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Cozinha e Área de Serviço/	A	2015-07-31 16:29:10.880	NULL	A
111	2	fotos-042.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Cozinha e Área de Serviço/	A	2015-07-31 16:29:11.237	NULL	A
112	2	fotos-092.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Cozinha e Área de Serviço/	A	2015-07-31 16:29:11.760	NULL	A
113	2	fotos-093.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Cozinha e Área de Serviço/	A	2015-07-31 16:29:12.153	NULL	A
114	2	fotos-094.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Cozinha e Área de Serviço/	A	2015-07-31 16:29:12.880	NULL	A
115	2	fotos-106.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Cozinha e Área de Serviço/	A	2015-07-31 16:29:13.457	NULL	A
116	2	fotos-107.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Cozinha e Área de Serviço/	A	2015-07-31 16:29:13.783	NULL	A
117	2	fotos-108.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Cozinha e Área de Serviço/	A	2015-07-31 16:29:14.067	NULL	A
118	2	fotos-109.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Cozinha e Área de Serviço/	A	2015-07-31 16:29:14.553	NULL	A
119	2	fotos-110.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Cozinha e Área de Serviço/	A	2015-07-31 16:29:14.927	NULL	A
120	2	fotos-111.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Cozinha e Área de Serviço/	A	2015-07-31 16:29:15.277	NULL	A
121	2	fotos-112.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Cozinha e Área de Serviço/	A	2015-07-31 16:29:15.687	NULL	A
122	2	fotos-113.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Cozinha e Área de Serviço/	A	2015-07-31 16:29:16.007	NULL	A
123	2	fotos-114.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Cozinha e Área de Serviço/	A	2015-07-31 16:29:16.287	NULL	A
124	2	fotos-115.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Cozinha e Área de Serviço/	A	2015-07-31 16:29:16.557	NULL	A
125	2	fotos-116.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Cozinha e Área de Serviço/	A	2015-07-31 16:29:16.943	NULL	A
126	2	fotos-125.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Maquete/	A	2015-07-31 16:29:36.303	NULL	A
127	2	fotos-126.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Maquete/	A	2015-07-31 16:29:36.733	NULL	A
128	2	fotos-127.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Maquete/	A	2015-07-31 16:29:37.267	NULL	A
129	2	fotos-128.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Maquete/	A	2015-07-31 16:29:37.680	NULL	A
130	2	fotos-129.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Maquete/	A	2015-07-31 16:29:37.970	NULL	A
131	2	fotos-130.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Maquete/	A	2015-07-31 16:29:38.200	NULL	A
132	2	fotos-131.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Maquete/	A	2015-07-31 16:29:38.433	NULL	A
133	2	fotos-132.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Maquete/	A	2015-07-31 16:29:38.780	NULL	A
134	2	fotos-133.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Maquete/	A	2015-07-31 16:29:39.087	NULL	A
135	2	fotos-134.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Maquete/	A	2015-07-31 16:29:39.400	NULL	A
136	2	fotos-135.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Maquete/	A	2015-07-31 16:29:39.747	NULL	A
137	2	fotos-136.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Maquete/	A	2015-07-31 16:29:40.083	NULL	A
138	2	fotos-137.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Maquete/	A	2015-07-31 16:29:40.450	NULL	A
139	2	fotos-138.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Maquete/	A	2015-07-31 16:29:41.000	NULL	A
140	2	fotos-139.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Maquete/	A	2015-07-31 16:29:41.330	NULL	A
141	2	fotos-140.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Maquete/	A	2015-07-31 16:29:41.717	NULL	A
142	2	fotos-141.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Maquete/	A	2015-07-31 16:29:42.327	NULL	A
143	2	fotos-142.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Maquete/	A	2015-07-31 16:29:42.803	NULL	A
144	2	fotos-143.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Maquete/	A	2015-07-31 16:29:43.143	NULL	A
145	2	fotos-144.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Maquete/	A	2015-07-31 16:29:43.403	NULL	A
146	2	fotos-059.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Quarto de casal/	A	2015-07-31 16:29:56.147	NULL	A
147	2	fotos-060.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Quarto de casal/	A	2015-07-31 16:29:56.507	NULL	A
148	2	fotos-061.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Quarto de casal/	A	2015-07-31 16:29:56.807	NULL	A
149	2	fotos-062.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Quarto de casal/	A	2015-07-31 16:29:57.093	NULL	A
150	2	fotos-063.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Quarto de casal/	A	2015-07-31 16:29:57.423	NULL	A
151	2	fotos-064.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Quarto de casal/	A	2015-07-31 16:29:57.740	NULL	A
152	2	fotos-065.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Quarto de casal/	A	2015-07-31 16:29:58.023	NULL	A
153	2	fotos-066.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Quarto de casal/	A	2015-07-31 16:29:58.353	NULL	A
154	2	fotos-067.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Quarto de casal/	A	2015-07-31 16:29:58.683	NULL	A
155	2	fotos-068.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Quarto de casal/	A	2015-07-31 16:29:58.967	NULL	A
156	2	fotos-069.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Quarto de casal/	A	2015-07-31 16:29:59.227	NULL	A
157	2	fotos-070.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Quarto de casal/	A	2015-07-31 16:29:59.537	NULL	A
158	2	fotos-086.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Quarto de casal/	A	2015-07-31 16:29:59.887	NULL	A
159	2	fotos-087.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Quarto de casal/	A	2015-07-31 16:30:00.283	NULL	A
160	2	fotos-088.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Quarto de casal/	A	2015-07-31 16:30:00.607	NULL	A
161	2	fotos-071.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Quarto de solteiro/	A	2015-07-31 16:30:14.533	NULL	A
162	2	fotos-072.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Quarto de solteiro/	A	2015-07-31 16:30:14.860	NULL	A
163	2	fotos-073.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Quarto de solteiro/	A	2015-07-31 16:30:15.093	NULL	A
164	2	fotos-074.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Quarto de solteiro/	A	2015-07-31 16:30:15.360	NULL	A
165	2	fotos-075.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Quarto de solteiro/	A	2015-07-31 16:30:15.647	NULL	A
166	2	fotos-076.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Quarto de solteiro/	A	2015-07-31 16:30:15.880	NULL	A
167	2	fotos-077.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Quarto de solteiro/	A	2015-07-31 16:30:16.170	NULL	A
168	2	fotos-078.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Quarto de solteiro/	A	2015-07-31 16:30:16.393	NULL	A
169	2	fotos-079.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Quarto de solteiro/	A	2015-07-31 16:30:16.843	NULL	A
170	2	fotos-080.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Quarto de solteiro/	A	2015-07-31 16:30:17.127	NULL	A
171	2	fotos-081.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Quarto de solteiro/	A	2015-07-31 16:30:17.490	NULL	A
172	2	fotos-082.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Quarto de solteiro/	A	2015-07-31 16:30:17.750	NULL	A
173	2	fotos-100.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Quarto de solteiro/	A	2015-07-31 16:30:18.030	NULL	A
174	2	fotos-101.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Quarto de solteiro/	A	2015-07-31 16:30:18.353	NULL	A
175	2	fotos-102.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Quarto de solteiro/	A	2015-07-31 16:30:18.723	NULL	A
176	2	fotos-103.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Quarto de solteiro/	A	2015-07-31 16:30:19.017	NULL	A
177	2	fotos-032.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Sala/	A	2015-07-31 16:30:31.050	NULL	A
178	2	fotos-033.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Sala/	A	2015-07-31 16:30:31.277	NULL	A
179	2	fotos-034.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Sala/	A	2015-07-31 16:30:31.503	NULL	A
180	2	fotos-043.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Sala/	A	2015-07-31 16:30:31.783	NULL	A
181	2	fotos-044.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Sala/	A	2015-07-31 16:30:32.027	NULL	A
182	2	fotos-045.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Sala/	A	2015-07-31 16:30:32.270	NULL	A
183	2	fotos-046.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Sala/	A	2015-07-31 16:30:32.503	NULL	A
184	2	fotos-047.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Sala/	A	2015-07-31 16:30:32.817	NULL	A
185	2	fotos-048.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Sala/	A	2015-07-31 16:30:33.343	NULL	A
186	2	fotos-049.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Sala/	A	2015-07-31 16:30:33.653	NULL	A
187	2	fotos-050.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Sala/	A	2015-07-31 16:30:33.913	NULL	A
188	2	fotos-051.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Sala/	A	2015-07-31 16:30:34.197	NULL	A
189	2	fotos-052.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Sala/	A	2015-07-31 16:30:34.610	NULL	A
190	2	fotos-053.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Sala/	A	2015-07-31 16:30:34.997	NULL	A
191	2	fotos-054.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Sala/	A	2015-07-31 16:30:35.307	NULL	A
192	2	fotos-055.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Sala/	A	2015-07-31 16:30:35.637	NULL	A
193	2	fotos-056.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Sala/	A	2015-07-31 16:30:36.007	NULL	A
194	2	fotos-057.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Sala/	A	2015-07-31 16:30:36.387	NULL	A
195	2	fotos-058.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Sala/	A	2015-07-31 16:30:37.123	NULL	A
196	2	fotos-083.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Sala/	A	2015-07-31 16:30:37.420	NULL	A
197	2	fotos-089.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Sala/	A	2015-07-31 16:30:37.673	NULL	A
198	2	fotos-090.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Sala/	A	2015-07-31 16:30:38.003	NULL	A
199	2	fotos-091.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Sala/	A	2015-07-31 16:30:38.537	NULL	A
200	2	fotos-098.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Sala/	A	2015-07-31 16:30:39.183	NULL	A
201	2	fotos-099.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Sala/	A	2015-07-31 16:30:39.687	NULL	A
202	2	fotos-104.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Sala/	A	2015-07-31 16:30:40.270	NULL	A
203	2	fotos-105.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Sala/	A	2015-07-31 16:30:40.860	NULL	A
204	2	fotos-117.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Sala/	A	2015-07-31 16:30:41.207	NULL	A
205	2	fotos-118.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Sala/	A	2015-07-31 16:30:41.527	NULL	A
206	2	fotos-119.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Sala/	A	2015-07-31 16:30:41.887	NULL	A
207	2	fotos-120.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Sala/	A	2015-07-31 16:30:42.187	NULL	A
208	2	fotos-121.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Sala/	A	2015-07-31 16:30:42.507	NULL	A
209	2	fotos-122.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Sala/	A	2015-07-31 16:30:43.007	NULL	A
210	2	fotos-123.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Sala/	A	2015-07-31 16:30:43.507	NULL	A
211	2	fotos-124.jpg	NULL	NULL	/Smile Village Vila Prudente/Apartamento Decorado/Sala/	A	2015-07-31 16:30:43.890	NULL	A
212	2	IMG_20150430_192758.jpg	NULL	NULL	/Smile Village Vila Prudente/Chevrolet Onix 2015/	A	2015-07-31 16:35:40.347	NULL	A
213	2	IMG_20150430_200558.jpg	NULL	NULL	/Smile Village Vila Prudente/Chevrolet Onix 2015/	A	2015-07-31 16:35:40.637	NULL	A
214	2	IMG_20150430_200601.jpg	NULL	NULL	/Smile Village Vila Prudente/Chevrolet Onix 2015/	A	2015-07-31 16:35:40.910	NULL	A
215	2	IMG_20150606_160314.jpg	NULL	NULL	/Smile Village Vila Prudente/Chevrolet Onix 2015/	A	2015-07-31 16:35:41.180	NULL	A
216	2	IMG_20150606_161124.jpg	NULL	NULL	/Smile Village Vila Prudente/Chevrolet Onix 2015/	A	2015-07-31 16:35:41.347	NULL	A
217	2	IMG-20150411-WA0000.jpg	NULL	NULL	/Smile Village Vila Prudente/Chevrolet Onix 2015/	A	2015-07-31 16:35:41.570	NULL	A
218	2	IMG-20150503-WA0004.jpg	NULL	NULL	/Smile Village Vila Prudente/Chevrolet Onix 2015/	A	2015-07-31 16:35:41.690	NULL	A
219	2	IMG-20150503-WA0005.jpg	NULL	NULL	/Smile Village Vila Prudente/Chevrolet Onix 2015/	A	2015-07-31 16:35:41.807	NULL	A
220	2	IMG-20150503-WA0006.jpg	NULL	NULL	/Smile Village Vila Prudente/Chevrolet Onix 2015/	A	2015-07-31 16:35:41.957	NULL	A
221	2	img_est_vp_02-01-01-2010.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-01-2010/	A	2015-07-31 16:36:02.300	NULL	A
222	2	img_est_vp_03-01-01-2010.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-01-2010/	A	2015-07-31 16:36:02.403	NULL	A
223	2	img_est_vp_04-01-01-2010.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-01-2010/	A	2015-07-31 16:36:02.507	NULL	A
224	2	grafico-01-01-2011.gif	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-01-2011/	A	2015-07-31 16:36:12.420	NULL	A
225	2	smile_vp_estagio1-01-01-2011.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-01-2011/	A	2015-07-31 16:36:12.543	NULL	A
226	2	smile_vp_estagio2-01-01-2011.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-01-2011/	A	2015-07-31 16:36:12.750	NULL	A
227	2	smile_vp_estagio3-01-01-2011.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-01-2011/	A	2015-07-31 16:36:12.870	NULL	A
228	2	smile_vp_estagio4-01-01-2011.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-01-2011/	A	2015-07-31 16:36:13.000	NULL	A
229	2	img_est_vp_01-01-02-2010.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-02-2010/	A	2015-07-31 16:36:25.267	NULL	A
230	2	img_est_vp_02-01-02-2010.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-02-2010/	A	2015-07-31 16:36:25.397	NULL	A
231	2	img_est_vp_03-01-02-2010.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-02-2010/	A	2015-07-31 16:36:25.530	NULL	A
232	2	img_est_vp_04-01-02-2010.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-02-2010/	A	2015-07-31 16:36:25.673	NULL	A
233	2	img_est_vp_01-01-03-2010.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-03-2010/	A	2015-07-31 16:36:35.267	NULL	A
234	2	img_est_vp_02-01-03-2010.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-03-2010/	A	2015-07-31 16:36:35.363	NULL	A
235	2	img_est_vp_03-01-03-2010.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-03-2010/	A	2015-07-31 16:36:35.467	NULL	A
236	2	img_est_vp_04-01-03-2010.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-03-2010/	A	2015-07-31 16:36:35.613	NULL	A
237	2	estagio19_1-01-05-2011.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-05-2011/	A	2015-07-31 16:36:46.317	NULL	A
238	2	estagio19_2-01-05-2011.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-05-2011/	A	2015-07-31 16:36:46.530	NULL	A
239	2	estagio19_3-01-05-2011.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-05-2011/	A	2015-07-31 16:36:46.667	NULL	A
240	2	estagio19_4-01-05-2011.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-05-2011/	A	2015-07-31 16:36:46.780	NULL	A
241	2	estagio19_5.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-05-2011/	A	2015-07-31 16:36:46.873	NULL	A
242	2	estagio19_5-01-05-2011.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-05-2011/	A	2015-07-31 16:36:46.997	NULL	A
243	2	grafico19_2-01-05-2011.png	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-05-2011/	A	2015-07-31 16:36:47.140	NULL	A
244	2	Grafico-01-06-2010.JPG	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-06-2010/	A	2015-07-31 16:36:56.410	NULL	A
245	2	smile_vp_estagio1_01-06-2010.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-06-2010/	A	2015-07-31 16:36:56.500	NULL	A
246	2	smile_vp_estagio2_01-06-2010.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-06-2010/	A	2015-07-31 16:36:56.627	NULL	A
247	2	smile_vp_estagio3_01-06-2010.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-06-2010/	A	2015-07-31 16:36:56.717	NULL	A
248	2	smile_vp_estagio4_01-06-2010.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-06-2010/	A	2015-07-31 16:36:56.870	NULL	A
249	2	estagio19_1-01-06-2011.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-06-2011/	A	2015-07-31 16:37:07.677	NULL	A
250	2	estagio19_2-01-06-2011.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-06-2011/	A	2015-07-31 16:37:07.770	NULL	A
251	2	estagio19_3-01-06-2011.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-06-2011/	A	2015-07-31 16:37:07.907	NULL	A
252	2	estagio19_4-01-06-2011.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-06-2011/	A	2015-07-31 16:37:08.107	NULL	A
253	2	estagio19_5-01-06-2011.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-06-2011/	A	2015-07-31 16:37:08.193	NULL	A
254	2	grafico19_2-01-06-2011.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-06-2011/	A	2015-07-31 16:37:08.317	NULL	A
255	2	grafico-01-07-2010.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-07-2010/	A	2015-07-31 16:37:23.210	NULL	A
256	2	smile_vp_estagio1-01-07-2010.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-07-2010/	A	2015-07-31 16:37:23.303	NULL	A
257	2	smile_vp_estagio2-01-07-2010.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-07-2010/	A	2015-07-31 16:37:23.407	NULL	A
258	2	smile_vp_estagio3-01-07-2010.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-07-2010/	A	2015-07-31 16:37:23.470	NULL	A
259	2	smile_vp_estagio4-01-07-2010.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-07-2010/	A	2015-07-31 16:37:23.563	NULL	A
260	2	estagio19_1-01-07-2011.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-07-2011/	A	2015-07-31 16:37:33.177	NULL	A
261	2	estagio19_2-01-07-2011.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-07-2011/	A	2015-07-31 16:37:33.293	NULL	A
262	2	estagio19_3-01-07-2011.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-07-2011/	A	2015-07-31 16:37:33.417	NULL	A
263	2	estagio19_4-01-07-2011.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-07-2011/	A	2015-07-31 16:37:33.527	NULL	A
264	2	estagio19_5-01-07-2011.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-07-2011/	A	2015-07-31 16:37:33.693	NULL	A
265	2	grafico19_2-01-07-2011.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-07-2011/	A	2015-07-31 16:37:33.770	NULL	A
266	2	estagio19_1-08-2011.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-08-2011/	A	2015-07-31 16:37:43.670	NULL	A
267	2	estagio19_2-08-2011.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-08-2011/	A	2015-07-31 16:37:43.827	NULL	A
268	2	estagio19_3-08-2011.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-08-2011/	A	2015-07-31 16:37:43.990	NULL	A
269	2	estagio19_4-08-2011.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-08-2011/	A	2015-07-31 16:37:44.077	NULL	A
270	2	estagio19_5-08-2011.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-08-2011/	A	2015-07-31 16:37:44.180	NULL	A
271	2	grafico19_2-01-08-2011.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-08-2011/	A	2015-07-31 16:37:44.280	NULL	A
272	2	grafico-01-09-2010.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-09-2010/	A	2015-07-31 16:37:54.027	NULL	A
273	2	smile_vp_estagio1-01-09-2010.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-09-2010/	A	2015-07-31 16:37:54.130	NULL	A
274	2	smile_vp_estagio2-01-09-2010.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-09-2010/	A	2015-07-31 16:37:54.263	NULL	A
275	2	smile_vp_estagio3-01-09-2010.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-09-2010/	A	2015-07-31 16:37:54.390	NULL	A
276	2	smile_vp_estagio4-01-09-2010.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-09-2010/	A	2015-07-31 16:37:54.517	NULL	A
277	2	estagio19_1.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-09-2011/	A	2015-07-31 16:38:07.837	NULL	A
278	2	estagio19_2.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-09-2011/	A	2015-07-31 16:38:07.977	NULL	A
279	2	estagio19_3.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-09-2011/	A	2015-07-31 16:38:08.060	NULL	A
280	2	estagio19_4.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-09-2011/	A	2015-07-31 16:38:08.187	NULL	A
281	2	estagio19_5.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-09-2011/	A	2015-07-31 16:38:08.313	NULL	A
282	2	grafico19_2.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-09-2011/	A	2015-07-31 16:38:08.443	NULL	A
283	2	grafico-01-10-2010.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-10-2010/	A	2015-07-31 16:38:19.693	NULL	A
284	2	smile_vp_estagio1-01-10-2010.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-10-2010/	A	2015-07-31 16:38:19.847	NULL	A
285	2	smile_vp_estagio2-01-10-2010.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-10-2010/	A	2015-07-31 16:38:20.067	NULL	A
286	2	smile_vp_estagio3-01-10-2010.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-10-2010/	A	2015-07-31 16:38:20.473	NULL	A
287	2	smile_vp_estagio4-01-10-2010.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-10-2010/	A	2015-07-31 16:38:20.677	NULL	A
288	2	estagio19_1-01-10-2011.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-10-2011/	A	2015-07-31 16:38:30.720	NULL	A
289	2	estagio19_2-01-10-2011.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-10-2011/	A	2015-07-31 16:38:30.930	NULL	A
290	2	estagio19_3-01-10-2011.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-10-2011/	A	2015-07-31 16:38:31.060	NULL	A
291	2	estagio19_4-01-10-2011.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-10-2011/	A	2015-07-31 16:38:31.197	NULL	A
292	2	estagio19_5-01-10-2011.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-10-2011/	A	2015-07-31 16:38:31.377	NULL	A
293	2	grafico19_2-01-10-2011.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-10-2011/	A	2015-07-31 16:38:31.507	NULL	A
294	2	grafico-01-11-2010.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-11-2010/	A	2015-07-31 16:38:41.603	NULL	A
295	2	smile_vp_estagio1-01-11-2010.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-11-2010/	A	2015-07-31 16:38:41.703	NULL	A
296	2	smile_vp_estagio2-01-11-2010.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-11-2010/	A	2015-07-31 16:38:41.853	NULL	A
297	2	smile_vp_estagio3-01-11-2010.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-11-2010/	A	2015-07-31 16:38:42.040	NULL	A
298	2	smile_vp_estagio4-01-11-2010.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-11-2010/	A	2015-07-31 16:38:42.230	NULL	A
299	2	estagio19_1.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-11-2011/	A	2015-07-31 16:38:52.890	NULL	A
300	2	estagio19_2.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-11-2011/	A	2015-07-31 16:38:52.987	NULL	A
301	2	estagio19_3.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-11-2011/	A	2015-07-31 16:38:53.063	NULL	A
302	2	estagio19_4.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-11-2011/	A	2015-07-31 16:38:53.190	NULL	A
303	2	estagio19_5.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-11-2011/	A	2015-07-31 16:38:53.290	NULL	A
304	2	grafico19_2.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-11-2011/	A	2015-07-31 16:38:53.393	NULL	A
305	2	grafico-01-12-2010.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-12-2010/	A	2015-07-31 16:39:08.133	NULL	A
306	2	smile_vp_estagio1-01-12-2010.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-12-2010/	A	2015-07-31 16:39:08.270	NULL	A
307	2	smile_vp_estagio2-01-12-2010.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-12-2010/	A	2015-07-31 16:39:08.380	NULL	A
308	2	smile_vp_estagio3-01-12-2010.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-12-2010/	A	2015-07-31 16:39:08.463	NULL	A
309	2	smile_vp_estagio4-01-12-2010.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 01-12-2010/	A	2015-07-31 16:39:08.587	NULL	A
310	2	img_est_vp_01_02-11-2009.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 02-11-2009/	A	2015-07-31 16:39:22.227	NULL	A
311	2	img_est_vp_02_02-11-2009.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 02-11-2009/	A	2015-07-31 16:39:22.367	NULL	A
312	2	img_est_vp_03_02-11-2009.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 02-11-2009/	A	2015-07-31 16:39:22.503	NULL	A
313	2	img_est_vp_04_02-11-2009.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 02-11-2009/	A	2015-07-31 16:39:22.587	NULL	A
314	2	grafico-04-05-2010.JPG	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 04-05-2010/	A	2015-07-31 16:39:34.380	NULL	A
315	2	img_est_vp_01-04-05-2010.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 04-05-2010/	A	2015-07-31 16:39:34.470	NULL	A
316	2	img_est_vp_02-04-05-2010.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 04-05-2010/	A	2015-07-31 16:39:34.557	NULL	A
317	2	img_est_vp_03-04-05-2010.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 04-05-2010/	A	2015-07-31 16:39:34.720	NULL	A
318	2	DSC07673-08-05-2009.JPG	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 08-05-2009/	A	2015-07-31 16:39:45.493	NULL	A
319	2	DSC07683-08-05-2009.JPG	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 08-05-2009/	A	2015-07-31 16:39:45.777	NULL	A
320	2	img_est_vp_01-15-05-2009.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 08-05-2009/	A	2015-07-31 16:39:45.973	NULL	A
321	2	img_est_vp_01-30-03-2010.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 30-03-2010/	A	2015-07-31 16:39:59.317	NULL	A
322	2	img_est_vp_02-30-03-2010.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 30-03-2010/	A	2015-07-31 16:39:59.443	NULL	A
323	2	img_est_vp_03-30-03-2010.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 30-03-2010/	A	2015-07-31 16:39:59.567	NULL	A
324	2	grafico-30-07-2010.JPG	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 30-07-2010/	A	2015-07-31 16:40:11.527	NULL	A
325	2	smile_vp_estagio1-30-07-2010.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 30-07-2010/	A	2015-07-31 16:40:11.650	NULL	A
326	2	smile_vp_estagio2-30-07-2010.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 30-07-2010/	A	2015-07-31 16:40:11.757	NULL	A
327	2	smile_vp_estagio3-30-07-2010.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 30-07-2010/	A	2015-07-31 16:40:11.850	NULL	A
328	2	smile_vp_estagio4-30-07-2010.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 30-07-2010/	A	2015-07-31 16:40:11.937	NULL	A
329	2	img_est_vp_01-30-09-2009.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 30-09-2009/	A	2015-07-31 16:40:25.860	NULL	A
330	2	img_est_vp_02-30-09-2009.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 30-09-2009/	A	2015-07-31 16:40:26.037	NULL	A
331	2	img_est_vp_03-30-09-2009.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 30-09-2009/	A	2015-07-31 16:40:26.117	NULL	A
332	2	img_est_vp_04-30-09-2009.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 30-09-2009/	A	2015-07-31 16:40:26.217	NULL	A
333	2	img_est_vp_01_30-11-2009.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 30-11-2009/	A	2015-07-31 16:40:43.540	NULL	A
334	2	img_est_vp_02_30-11-2009.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 30-11-2009/	A	2015-07-31 16:40:43.633	NULL	A
335	2	img_est_vp_03_30-11-2009.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 30-11-2009/	A	2015-07-31 16:40:43.710	NULL	A
336	2	img_est_vp_04_30-11-2009.jpg	NULL	NULL	/Smile Village Vila Prudente/Estágios/Estágio 30-11-2009/	A	2015-07-31 16:40:43.850	NULL	A
/*
INSERT INTO NewPhotoCloudDiretoriosArquivos (
Dia_Fk_Usu_Id,
Dia_Nome,
Dia_CaminhoOriginal,
Dia_CaminhoAtual,
Dia_Tipo,
Dia_DataCriacao,
Dia_DataExclusao,
Dia_Status
) VALUES(
2,
'Janeiro 2015',
NULL,
'/Smile Village Vila Prudente/Fotos Smile/Aquisições 2015/',
'D',
GETDATE(),
NULL,
'A'
)
*/



/*
Enable-Migrations -ContextTypeName NewPhotoCloud.Models.ApplicationDbContext -Force


Add-Migration NewPhotoApplicationDb

Update-Database

só
-------------------------------------


Enable-Migrations -ContextTypeName NewPhotoCloud.Repositories.UsuarioContext

Add-Migration NewPhoto

Update-Database


Enable-Migrations -ContextTypeName NewPhotoCloud.Models.ApplicationDbContext -Force


Add-Migration NewPhotoApplicationDb

Update-Database
*/