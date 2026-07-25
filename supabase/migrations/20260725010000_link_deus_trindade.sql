-- Vincula a trilha "Deus e a Trindade" (m2-t2) ao conteúdo já existente
-- da lição "fd-2", que estava escrita em trails-content-3.ts mas nunca
-- havia sido conectada ao caminho de módulos do Disciple.
UPDATE public.disciple_trails SET lesson_id = 'fd-2' WHERE module_id = 'm2' AND ord = 2;
