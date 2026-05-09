// ============================================================
// BORED ORIGINALS — Adicionar "Três Noites de Mar"
// ============================================================
// Corre com: node scripts/add_tres_noites_mar.js
// ============================================================

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.VITE_SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Falta SUPABASE_URL ou SUPABASE_SERVICE_KEY no ficheiro .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const BASE = 'https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals';

async function main() {
  console.log('🌊 A inserir "Três Noites de Mar"...');

  // ── 1. Aventura principal ──────────────────────────────────
  const { data: adv, error: advErr } = await supabase
    .from('adventures')
    .insert({
      slug: 'tres-noites-de-mar',
      index: 12,
      title: 'Três Noites de Mar',
      location: 'Baleal, Peniche',
      tagline: 'Primeiro cais, depois surfas.',
      description: 'Três noites no Baleal, quatro aulas de surf e tempo suficiente para perceber que o mar não se domina — lê-se, respeita-se e repete-se. É uma experiência para quem quer começar do zero ou ganhar forma com consistência, alojamento perto da praia, pequenos-almoços incluídos e sessões desenhadas ao ritmo das ondas.',
      duration: '4 dias · 3 noites',
      difficulty: 'Fácil',
      price: '299€',
      max_people: 6,
      coming_soon: false,
      hero_image: `${BASE}/surf.jpg`,
      hero_video: null,
      card_image: `${BASE}/surf.jpg`,
      hover_video: null,
      highlights: [
        `${BASE}/surf.jpg`,
        `${BASE}/baleal.jpg`,
        `${BASE}/surf2.jpg`,
        `${BASE}/mar.jpg`,
      ],
      includes: [
        { icon: '🏡', label: 'Alojamento 3 noites', detail: 'Quarto partilhado no Baleal, a poucos minutos da praia.' },
        { icon: '🏄', label: '4 aulas de surf', detail: 'Sessões de 2 horas com instrutores certificados, organizadas por nível, máximo 6 alunos por instrutor.' },
        { icon: '🤿', label: 'Material de surf', detail: 'Prancha, fato de surf e equipamento incluídos. Algumas pranchas ficam disponíveis para uso livre nos alojamentos, conforme disponibilidade.' },
        { icon: '☕', label: 'Pequeno-almoço diário', detail: 'Pequenos-almoços incluídos durante toda a estadia.' },
        { icon: '🚐', label: 'Transporte escola ↔ alojamento', detail: 'Transferes entre o alojamento e a escola de surf incluídos.' },
        { icon: '🛡️', label: 'Seguro desportivo', detail: 'Cobertura de seguro desportivo durante todas as atividades incluídas.' },
      ],
      not_includes: [
        'Almoços e jantares, salvo indicação contrária',
        'Transporte até Peniche / Baleal',
        'Seguro pessoal de viagem',
        'Equipamento pessoal extra',
        'Suplemento de quarto privado',
        'Despesas de caráter pessoal',
      ],
      packing_list: [
        'Fato de banho',
        'Toalha',
        'Chinelos',
        'Protetor solar',
        'Roupa confortável',
        'Garrafa de água',
        'Casaco leve',
        'Artigos de higiene pessoal',
        'Óculos de sol',
        'Documentos pessoais',
      ],
      digital_detox: null,
      cancellations: 'Cancelamentos devem ser enviados por e-mail para bookings@boredtourist.com. O cancelamento é gratuito até 10 dias antes da partida. Se o cancelamento ocorrer após essa data e até 48 horas antes do início da actividade, o cancelamento tem um custo de 50%. A menos de 48 horas, não há direito a reembolso. Em caso de cancelamento pela Bored. ou pelo prestador por motivos de segurança, meteorologia ou força maior, oferecemos nova data ou reembolso total.',
      review_text: null,
      review_author: null,
      review_role: null,
      review_image: null,
      curiosities: [
        {
          title: 'Surf começa muito antes de entrar na água.',
          text: 'O progresso vem da postura, da leitura do mar, da segurança e da repetição. As aulas da escola são feitas para construir base sólida antes de procurar estilo.',
          image: `${BASE}/surf.jpg`,
        },
        {
          title: 'No Baleal, o surf é parte da rotina.',
          text: 'A escola fica em Peniche e os alojamentos estão no Baleal, uma das bases mais clássicas do surf em Portugal, com acesso fácil às praias e à logística da experiência.',
          image: `${BASE}/baleal.jpg`,
        },
        {
          title: 'Trabalhar por níveis muda tudo.',
          text: 'Os grupos são organizados por nível e limitados a 6 alunos por instrutor, o que torna a progressão mais segura, mais personalizada e mais honesta.',
          image: `${BASE}/surf2.jpg`,
        },
      ],
      is_active: true,
      featured: false,
    })
    .select()
    .single();

  if (advErr) {
    console.error('❌ Erro ao inserir aventura:', advErr.message);
    process.exit(1);
  }

  const adventureId = adv.id;
  console.log(`✅ Aventura criada: ${adv.title} (id: ${adventureId})`);

  // ── 2. Itinerário ──────────────────────────────────────────
  const itinerary = [
    {
      adventure_id: adventureId,
      day_label: 'Dia 1',
      title: 'Chegada ao Baleal e primeira sessão',
      description: 'Chegada ao alojamento no Baleal, check-in e primeira leitura do território: praia, luz, vento e mar. A primeira aula serve para perceber o teu nível, ajustar expectativas e começar com o essencial — segurança, remada, equilíbrio e entrada na água.',
      order_index: 0,
    },
    {
      adventure_id: adventureId,
      day_label: 'Dia 2',
      title: 'Surf, pausa, surf',
      description: 'O segundo dia é o coração da experiência. As sessões decorrem normalmente entre as 10h00 e as 12h00 e entre as 15h00 e as 17h00, permitindo distribuir as quatro aulas de forma flexível conforme as condições do mar e o ritmo do grupo. É o dia em que a repetição começa a fazer diferença.',
      order_index: 1,
    },
    {
      adventure_id: adventureId,
      day_label: 'Dia 3',
      title: 'Progressão e confiança',
      description: 'Última aula ou sessões finais para consolidar o que já aprendeste: leitura de onda, postura, timing e mais uma ou outra vitória discreta, mas muito real. A ideia não é sair como surfista "fechado"; é sair com mais mar dentro do corpo.',
      order_index: 2,
    },
    {
      adventure_id: adventureId,
      day_label: 'Dia 4',
      title: 'Despedida do Baleal',
      description: 'Check-out e partida com a sensação de teres vivido uma pequena rotina de surf e não apenas umas aulas soltas. Se as condições permitirem e o grupo estiver alinhado, este dia pode ainda guardar margem para uma sessão extra ou uma caminhada curta pela zona antes do regresso.',
      order_index: 3,
    },
  ];

  const { error: itinErr } = await supabase.from('itinerary').insert(itinerary);
  if (itinErr) {
    console.error('❌ Erro ao inserir itinerário:', itinErr.message);
  } else {
    console.log(`✅ Itinerário inserido (${itinerary.length} dias)`);
  }

  // ── 3. FAQs ───────────────────────────────────────────────
  const faqs = [
    {
      adventure_id: adventureId,
      question: 'Preciso de experiência?',
      answer: 'Não. A experiência foi desenhada para iniciantes e também para quem quer retomar bases com mais consistência.',
      order_index: 0,
    },
    {
      adventure_id: adventureId,
      question: 'A água é fria?',
      answer: 'Sim, e faz parte do processo. O surf em Peniche tem sempre essa honestidade.',
      order_index: 1,
    },
    {
      adventure_id: adventureId,
      question: 'Posso escolher o alojamento?',
      answer: 'Sim. Há opção entre a surf house na Ilha do Baleal e a surf villa no centro do Baleal, dependendo das datas e disponibilidade.',
      order_index: 2,
    },
    {
      adventure_id: adventureId,
      question: 'Como funcionam as aulas?',
      answer: 'As sessões decorrem normalmente de manhã e à tarde, e os hóspedes podem organizar as 4 aulas de forma flexível ao longo da estadia.',
      order_index: 3,
    },
  ];

  const { error: faqErr } = await supabase.from('faqs').insert(faqs);
  if (faqErr) {
    console.error('❌ Erro ao inserir FAQs:', faqErr.message);
  } else {
    console.log(`✅ FAQs inseridas (${faqs.length})`);
  }

  // ── 4. Datas ──────────────────────────────────────────────
  const dates = [
    {
      adventure_id: adventureId,
      date_range: '19 Jul — 22 Jul 2026',
      status: 'disponivel',
      spots: 8,
      price: '299€',
      order_index: 0,
    },
    {
      adventure_id: adventureId,
      date_range: '1 Set — 4 Set 2026',
      status: 'disponivel',
      spots: 15,
      price: '299€',
      order_index: 1,
    },
  ];

  const { error: datesErr } = await supabase.from('activity_dates').insert(dates);
  if (datesErr) {
    console.error('❌ Erro ao inserir datas:', datesErr.message);
  } else {
    console.log(`✅ Datas inseridas (${dates.length})`);
  }

  console.log('\n🎉 "Três Noites de Mar" criada com sucesso no Supabase!');
  console.log(`   Slug: tres-noites-de-mar`);
  console.log(`   URL: /actividade/tres-noites-de-mar`);
}

main().catch(console.error);
