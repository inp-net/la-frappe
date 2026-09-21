```sql
read -r -d '' QUERY << 'EOF'
SELECT json_agg(subject_json) FROM (
    SELECT json_build_object(
        'id', "Subject"."id",
        'name', "Subject"."name",
        'paths', json_agg(
            DISTINCT CONCAT_WS('/', 
                "School"."name", 
                "Major"."name", 
                CASE WHEN "Subject"."forApprentices" THEN 'FISA' ELSE 'FISE' END,
                "Subject"."yearTier" || 'A',
                "Minor"."name", 
                "TeachingUnit"."name"
            )
        ),
        'pathnames', COALESCE(
            (
                SELECT json_agg(d."pathname")
                FROM "Document" d
                WHERE d."subjectId" = "Subject"."id"
                  AND d."pathname" IS NOT NULL
            ),
            '[]'::json
        )
    ) AS subject_json
    FROM "Subject"
    -- Jointure vers TeachingUnit (si elle existe)
    LEFT JOIN "TeachingUnit" ON "Subject"."unitId" = "TeachingUnit"."id"
    -- Jointure vers Minor (si elle existe)
    LEFT JOIN "_MinorToSubject" ON "Subject"."id" = "_MinorToSubject"."B"
    LEFT JOIN "Minor" ON "_MinorToSubject"."A" = "Minor"."id"
    LEFT JOIN "_MajorToMinor" ON "Minor"."id" = "_MajorToMinor"."B"
    -- Jointure directe vers Major (si pas de Minor)
    LEFT JOIN "_MajorToSubject" ON "Subject"."id" = "_MajorToSubject"."B"
    -- Jointure vers Major : priorise la filière via Minor, sinon prend la filière directe
    INNER JOIN "Major" ON "Major"."id" = COALESCE("_MajorToMinor"."A", "_MajorToSubject"."A")
    INNER JOIN "_MajorToSchool" ON "Major"."id" = "_MajorToSchool"."A"
    INNER JOIN "School" ON "_MajorToSchool"."B" = "School"."id"
    GROUP BY "Subject"."id"
) s;
EOF

kubectl -n churros-prod exec churros-postgresql-1 -- psql -d churros -t -A -c "$QUERY" | jq > /tmp/lafrappe.json
```
