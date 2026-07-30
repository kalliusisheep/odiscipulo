-- 1) Apaga especificamente o texto travado da lição "Quem é Jesus?" (id: db-1-2)
--    para que ela seja gerada de novo pela IA na próxima vez que alguém compartilhar.
DELETE FROM public.lesson_share_texts WHERE lesson_id = 'db-1-2';

-- 2) Verificação: lista qualquer outra linha que pareça ser o texto de reserva
--    genérico (começa com "Hoje eu terminei de estudar sobre") — se aparecer
--    alguma linha aqui, ela está com o mesmo problema.
SELECT lesson_id, lesson_title, left(share_text, 80) AS inicio_do_texto
FROM public.lesson_share_texts
WHERE share_text LIKE 'Hoje eu terminei de estudar sobre%';

-- 3) Se a consulta acima retornar linhas e você quiser que TODAS regenerem
--    na próxima vez que forem compartilhadas, descomente e rode:
-- DELETE FROM public.lesson_share_texts
-- WHERE share_text LIKE 'Hoje eu terminei de estudar sobre%';
