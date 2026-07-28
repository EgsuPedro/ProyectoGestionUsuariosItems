CREATE DATABASE DbGestionUsuariosItems;
GO

USE DbGestionUsuariosItems;
GO

-- 1. TABLA USUARIOS (Incluye credenciales para el Login)
CREATE TABLE dbo.Usuarios (
    IdUsuario INT IDENTITY(1,1) NOT NULL,
    Nombre VARCHAR(100) NOT NULL,
    Apellido VARCHAR(100) NOT NULL,
    Email VARCHAR(150) NOT NULL,
    PasswordHash VARBINARY(64) NOT NULL,
    PasswordSalt VARBINARY(128) NOT NULL,
    Rol VARCHAR(20) NOT NULL CONSTRAINT DF_Usuarios_Rol DEFAULT 'Usuario', -- 'Admin', 'Usuario'
    Estado BIT NOT NULL CONSTRAINT DF_Usuarios_Estado DEFAULT 1, -- 1: Activo, 0: Inactivo (Soft Delete)
    FechaCreacion DATETIME2(7) NOT NULL CONSTRAINT DF_Usuarios_FechaCreacion DEFAULT SYSDATETIME(),
    
    CONSTRAINT PK_Usuarios PRIMARY KEY CLUSTERED (IdUsuario ASC),
    CONSTRAINT UQ_Usuarios_Email UNIQUE (Email)
);
GO

-- 2. TABLA ITEMS
CREATE TABLE dbo.Items (
    IdItem INT IDENTITY(1,1) NOT NULL,
    Codigo VARCHAR(30) NOT NULL,
    Nombre VARCHAR(120) NOT NULL,
    Descripcion VARCHAR(500) NULL,
    Precio DECIMAL(18,2) NOT NULL CONSTRAINT DF_Items_Precio DEFAULT 0.00,
    Estado BIT NOT NULL CONSTRAINT DF_Items_Estado DEFAULT 1, -- 1: Activo, 0: Inactivo (Soft Delete)
    FechaCreacion DATETIME2(7) NOT NULL CONSTRAINT DF_Items_FechaCreacion DEFAULT SYSDATETIME(),
    
    CONSTRAINT PK_Items PRIMARY KEY CLUSTERED (IdItem ASC),
    CONSTRAINT UQ_Items_Codigo UNIQUE (Codigo)
);
GO

-- 3. TABLA ASIGNACIONES (Relación N:M entre Usuarios e Ítems)
CREATE TABLE dbo.UsuariosItems (
    IdAsignacion INT IDENTITY(1,1) NOT NULL,
    IdUsuario INT NOT NULL,
    IdItem INT NOT NULL,
    FechaAsignacion DATETIME2(7) NOT NULL CONSTRAINT DF_UsuariosItems_FechaAsignacion DEFAULT SYSDATETIME(),
    Observacion VARCHAR(250) NULL,
    Estado BIT NOT NULL CONSTRAINT DF_UsuariosItems_Estado DEFAULT 1,

    CONSTRAINT PK_UsuariosItems PRIMARY KEY CLUSTERED (IdAsignacion ASC),
    CONSTRAINT FK_UsuariosItems_Usuarios FOREIGN KEY (IdUsuario) REFERENCES dbo.Usuarios(IdUsuario),
    CONSTRAINT FK_UsuariosItems_Items FOREIGN KEY (IdItem) REFERENCES dbo.Items(IdItem)
);
GO

-- ÍNDICES PARA OPTIMIZAR CONSULTAS Y JOINS
CREATE NONCLUSTERED INDEX IX_Usuarios_Email ON dbo.Usuarios (Email) WHERE Estado = 1;
CREATE NONCLUSTERED INDEX IX_Items_Codigo ON dbo.Items (Codigo) WHERE Estado = 1;
CREATE NONCLUSTERED INDEX IX_UsuariosItems_Usuario_Item ON dbo.UsuariosItems (IdUsuario, IdItem);
GO

--SELECT * FROM UsuariosItems
--SELECT * FROM Items
--SELECT * FROM Usuarios

--SP_HELP Usuarios