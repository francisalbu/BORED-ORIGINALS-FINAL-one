-- ============================================================
-- Três Noites de Mar — Inserção completa
-- Cola este SQL no SQL Editor do Supabase e corre.
-- ============================================================

DO $$
DECLARE
  adv_id UUID;
BEGIN

-- ── 1. Aventura principal ──────────────────────────────────
INSERT INTO adventures (
  slug, index, title, location, tagline, description,
  duration, difficulty, price, max_people, coming_soon,
  hero_image, hero_video, card_image, hover_video,
  highlights, includes, not_includes, packing_list,
  digital_detox, cancellations,
  review_text, review_author, review_role, review_image,
  curiosities, is_active, featured
) VALUES (
  'tres-noites-de-mar',
  12,
  'Três Noites de Mar',
  'Baleal, Peniche',
  'Primeiro cais, depois surfas.',
  'Três noites no Baleal, quatro aulas de surf e tempo suficiente para perceber que o mar não se domina — lê-se, respeita-se e repete-se. É uma experiência para quem quer começar do zero ou ganhar forma com consistência, alojamento perto da praia, pequenos-almoços incluídos e sessões desenhadas ao ritmo das ondas.',
  '4 dias · 3 noites',
  'Fácil',
  '299€',
  6,
  false,
  'https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/surf.jpg',
  NULL,
  'https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/surf.jpg',
  NULL,
  '[
    "https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/surf.jpg",
    "https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/baleal.jpg",
    "https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/surf2.jpg",
    "https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/mar.jpg"
  ]'::jsonb,
  '[
    {"icon": "🏡", "label": "Alojamento 3 noites", "detail": "Quarto partilhado no Baleal, a poucos minutos da praia."},
    {"icon": "🏄", "label": "4 aulas de surf", "detail": "Sessões de 2 horas com instrutores certificados, organizadas por nível, máximo 6 alunos por instrutor."},
    {"icon": "🤿", "label": "Material de surf", "detail": "Prancha, fato de surf e equipamento incluídos. Algumas pranchas ficam disponíveis para uso livre nos alojamentos, conforme disponibilidade."},
    {"icon": "☕", "label": "Pequeno-almoço diário", "detail": "Pequenos-almoços incluídos durante toda a estadia."},
    {"icon": "🚐", "label": "Transporte escola ↔ alojamento", "detail": "Transferes entre o alojamento e a escola de surf incluídos."},
    {"icon": "🛡️", "label": "Seguro desportivo", "detail": "Cobertura de seguro desportivo durante todas as atividades incluídas."}
  ]'::jsonb,
  '[
    "Almoços e jantares, salvo indicação contrária",
    "Transporte até Peniche / Baleal",
    "Seguro pessoal de viagem",
    "Equipamento pessoal extra",
    "Suplemento de quarto privado",
    "Despesas de caráter pessoal"
  ]'::jsonb,
  '[
    "Fato de banho",
    "Toalha",
    "Chinelos",
    "Protetor solar",
    "Roupa confortável",
    "Garrafa de água",
    "Casaco leve",
    "Artigos de higiene pessoal",
    "Óculos de sol",
    "Documentos pessoais"
  ]'::jsonb,
  NULL,
  'Cancelamentos devem ser enviados por e-mail para bookings@boredtourist.com. O cancelamento é gratuito até 10 dias antes da partida. Se o cancelamento ocorrer após essa data e até 48 horas antes do início da actividade, o cancelamento tem um custo de 50%. A menos de 48 horas, não há direito a reembolso. Em caso de cancelamento pela Bored. ou pelo prestador por motivos de segurança, meteorologia ou força maior, oferecemos nova data ou reembolso total.',
  NULL, NULL, NULL, NULL,
  '[
    {"title": "Surf começa muito antes de entrar na água.", "text": "O progresso vem da postura, da leitura do mar, da segurança e da repetição. As aulas da escola são feitas para construir base sólida antes de procurar estilo.", "image": "https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/surf.jpg"},
    {"title": "No Baleal, o surf é parte da rotina.", "text": "A escola fica em Peniche e os alojamentos estão no Baleal, uma das bases mais clássicas do surf em Portugal, com acesso fácil às praias e à logística da experiência.", "image": "https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/baleal.jpg"},
    {"title": "Trabalhar por níveis muda tudo.", "text": "Os grupos são organizados por nível e limitados a 6 alunos por instrutor, o que torna a progressão mais segura, mais personalizada e mais honesta.", "image": "https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/surf2.jpg"}
  ]'::jsonb,
  true,
  false
)
RETURNING id INTO adv_id;

-- ── 2. Itinerário ──────────────────────────────────────────
INSERT INTO itinerary (adventure_id, day_label, title, description, order_index) VALUES
  (adv_id, 'Dia 1', 'Chegada ao Baleal e primeira sessão',
   'Chegada ao alojamento no Baleal, check-in e primeira leitura do território: praia, luz, vento e mar. A primeira aula serve para perceber o teu nível, ajustar expectativas e começar com o essencial — segurança, remada, equilíbrio e entrada na água.',
   0),
  (adv_id, 'Dia 2', 'Surf, pausa, surf',
   'O segundo dia é o coração da experiência. As sessões decorrem normalmente entre as 10h00 e as 12h00 e entre as 15h00 e as 17h00, permitindo distribuir as quatro aulas de forma flexível conforme as condições do mar e o ritmo do grupo. É o dia em que a repetição começa a fazer diferença.',
   1),
  (adv_id, 'Dia 3', 'Progressão e confiança',
   'Última aula ou sessões finais para consolidar o que já aprendeste: leitura de onda, postura, timing e mais uma ou outra vitória discreta, mas muito real. A ideia não é sair como surfista "fechado"; é sair com mais mar dentro do corpo.',
   2),
  (adv_id, 'Dia 4', 'Despedida do Baleal',
   'Check-out e partida com a sensação de teres vivido uma pequena rotina de surf e não apenas umas aulas soltas. Se as condições permitirem e o grupo estiver alinhado, este dia pode ainda guardar margem para uma sessão extra ou uma caminhada curta pela zona antes do regresso.',
   3);

-- ── 3. FAQs ───────────────────────────────────────────────
INSERT INTO faqs (adventure_id, question, answer, order_index) VALUES
  (adv_id, 'Preciso de experiência?',
   'Não. A experiência foi desenhada para iniciantes e também para quem quer retomar bases com mais consistência.',
   0),
  (adv_id, 'A água é fria?',
   'Sim, e faz parte do processo. O surf em Peniche tem sempre essa honestidade.',
   1),
  (adv_id, 'Posso escolher o alojamento?',
   'Sim. Há opção entre a surf house na Ilha do Baleal e a surf villa no centro do Baleal, dependendo das datas e disponibilidade.',
   2),
  (adv_id, 'Como funcionam as aulas?',
   'As sessões decorrem normalmente de manhã e à tarde, e os hóspedes podem organizar as 4 aulas de forma flexível ao longo da estadia.',
   3);

-- ── 4. Datas ──────────────────────────────────────────────
INSERT INTO activity_dates (adventure_id, date_range, status, spots, price, order_index) VALUES
  (adv_id, '19 Jul — 22 Jul 2026', 'disponivel', 8,  '299€', 0),
  (adv_id, '1 Set — 4 Set 2026',   'disponivel', 15, '299€', 1);

RAISE NOTICE 'Três Noites de Mar criada com sucesso! ID: %', adv_id;

END $$;
