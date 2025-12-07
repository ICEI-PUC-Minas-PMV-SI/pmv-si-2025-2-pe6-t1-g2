INSERT INTO ProfessorArea (ProfessorId, AreaId) VALUES (3, 1);

SELECT 
    f.name AS ForeignKey,
    OBJECT_NAME(f.parent_object_id) AS TabelaFilha,
    COL_NAME(fc.parent_object_id,fc.parent_column_id) AS ColunaFilha,
    OBJECT_NAME(f.referenced_object_id) AS TabelaPai,
    COL_NAME(fc.referenced_object_id,fc.referenced_column_id) AS ColunaPai
FROM sys.foreign_keys AS f
INNER JOIN sys.foreign_key_columns AS fc 
    ON f.OBJECT_ID = fc.constraint_object_id
WHERE OBJECT_NAME(f.parent_object_id) = 'ProfessorArea';

ALTER TABLE ProfessorArea DROP CONSTRAINT FK_ProfessorArea_Categorias_AreasId;


DECLARE @sql NVARCHAR(MAX) = N'';

SELECT @sql = @sql + 'ALTER TABLE ProfessorArea DROP CONSTRAINT ' + QUOTENAME(f.name) + ';' + CHAR(13)
FROM sys.foreign_keys AS f
WHERE f.parent_object_id = OBJECT_ID('ProfessorArea');

EXEC sp_executesql @sql;

PRINT 'Todas as FKs antigas foram removidas da tabela ProfessorArea.';

-- FK ligando ProfessorArea.AreaId -> Areas(Id)
ALTER TABLE ProfessorArea
ADD CONSTRAINT FK_ProfessorArea_Areas_AreaId
FOREIGN KEY (AreaId) REFERENCES Areas(Id)
ON DELETE CASCADE;

-- FK ligando ProfessorArea.ProfessorId -> Professores(Id)
ALTER TABLE ProfessorArea
ADD CONSTRAINT FK_ProfessorArea_Professores_ProfessorId
FOREIGN KEY (ProfessorId) REFERENCES Professores(Id)
ON DELETE CASCADE;

PRINT 'Novas FKs criadas com sucesso: Areas e Professores.';


SELECT pa.*
FROM ProfessorArea pa
LEFT JOIN Areas a ON pa.AreaId = a.Id
WHERE a.Id IS NULL;

DELETE pa
FROM ProfessorArea pa
LEFT JOIN Areas a ON pa.AreaId = a.Id
WHERE a.Id IS NULL;


INSERT INTO ProfessorArea (ProfessorId, AreaId) VALUES (3, 1);

INSERT INTO ProfessorArea (ProfessorId, AreaId) VALUES (4, 1);