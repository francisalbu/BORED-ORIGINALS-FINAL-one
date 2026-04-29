// ============================================================
// BORED ORIGINALS — Update: Caminhos de Santiago
// ============================================================
// Corre com: node scripts/update_santiago.js
// ============================================================

import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.VITE_SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Falta VITE_SUPABASE_URL ou VITE_SUPABASE_SERVICE_KEY no .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const update = {
  title: 'Caminhos de Santiago',
  tagline: 'O Caminho. Sem pressa de chegar.',
  location: 'Caminho Português · Valença a Santiago',
  duration: '5 dias · 4 noites',
  difficulty: 'Médio',
  price: '249',
  description: 'Quatro noites a caminhar pelo Caminho Português de Santiago, desde a fronteira em Valença até Santiago de Compostela. São dias de bosques, vilas, pontes, pedra gasta e quilómetros que se acumulam sem drama — só com o tipo de cansaço que, estranhamente, sabe bem e faz pensar. O caminho é antigo, mas a maneira de o fazer continua a ser tua.',
  includes: [
    { icon: '🏠', label: 'Alojamento durante 4 noites', detail: 'Dormidas em pontos-chave do Caminho, para equilibrar etapas e recuperação.' },
    { icon: '🗺️', label: 'Track do percurso e apoio logístico', detail: 'Rota preparada para 4 dias de caminhada, com planeamento e suporte prático.' },
    { icon: '🎒', label: 'Transfer de bagagem', detail: 'Para caminhar leve e sem carregar tudo nas costas todos os dias.' },
    { icon: '🧭', label: 'Apoio de acompanhamento', detail: 'Assistência e orientação ao longo da experiência.' },
  ],
  not_includes: [
    'Transporte até Valença/Tui',
    'Refeições, salvo indicação contrária',
    'Equipamento de caminhada',
    'Seguro pessoal de atividade (recomendado)',
    'Despesas de caráter pessoal',
  ],
  packing_list: [
    'Botas ou ténis de caminhada confortáveis',
    'Mochila de caminhada leve',
    'Roupa técnica respirável',
    'Corta-vento ou impermeável leve',
    'Meias de caminhada extra',
    'Garrafa de água reutilizável',
    'Chapéu ou boné',
    'Protetor solar',
    'Bastões, se usares',
    'Lanterna frontal',
    'Artigos de higiene pessoal',
    'Muda de roupa confortável',
  ],
  digital_detox: 'O Caminho já é o detox. Quando estás a andar horas seguidas pela Galiza, o telemóvel perde o sentido naturalmente. Pedimos só que o guardes durante as etapas — o que precisas de registar, o teu corpo já está a guardar.',
  cancellations: 'Cancelamentos devem ser enviados por e-mail para bookings@boredtourist.com. O cancelamento é gratuito até 10 dias antes da partida. Se o cancelamento ocorrer após essa data e até 48 horas antes do início da actividade, o cancelamento tem um custo de 50%. A menos de 48 horas, não há direito a reembolso. Em caso de cancelamento pela Bored. ou pelo prestador por motivos de segurança, meteorologia ou força maior, oferecemos nova data ou reembolso total.',
  curiosities: [
    {
      title: 'O Caminho Português é uma rota com memória forte.',
      text: 'A partir de Valença, o percurso entra na Galiza por Tui e segue por um dos troços mais clássicos e reconhecidos do Caminho Português, com pequenas vilas, bosques e cidades históricas ao longo de toda a travessia.',
    },
    {
      title: 'As etapas ficam mais bonitas quando deixam de querer impressionar.',
      text: 'Entre Tui, O Porriño, Redondela, Pontevedra, Caldas de Reis e Padrón, a rota mistura zonas urbanas, caminhos florestais e troços rurais que tornam a caminhada variada sem a tornar extrema.',
    },
    {
      title: 'Chegar a Santiago é menos sobre destino e mais sobre processo.',
      text: 'A cidade funciona como ponto final simbólico, mas o que fica é a forma como atravessaste os dias até lá chegar: a repetição, o ritmo, as pausas e a estranha clareza que só aparece a andar.',
    },
  ],
};

const itinerary = [
  { day_label: 'Dia 1', title: 'Valença / Tui até Redondela', description: 'A aventura começa na fronteira, com a saída de Valença e a entrada em Tui, onde o Caminho Português ganha logo outro tom. Esta é uma etapa longa para abrir a viagem com intenção: sai-se de Portugal, entra-se na Galiza e começa-se a sentir a cadência real do percurso. O destino da noite é Redondela, um ponto clássico de dormida e uma boa primeira paragem para alinhar corpo, mochila e cabeça.', order_index: 0 },
  { day_label: 'Dia 2', title: 'Redondela até Pontevedra', description: 'Depois de Redondela, o caminho torna-se mais fluido e mais bonito, com troços entre bosques, caminhos de terra e vistas abertas sobre a ria. A chegada a Pontevedra é particularmente interessante porque a cidade é um dos grandes marcos do Caminho Português na Galiza e funciona muito bem como dormida intermédia. É uma etapa suficientemente exigente para valer o dia, mas sem te esmagar logo a meio da viagem.', order_index: 1 },
  { day_label: 'Dia 3', title: 'Pontevedra até Caldas de Reis', description: 'Este é um dos dias mais equilibrados da rota, com uma progressão agradável entre aldeias, zonas agrícolas e troços de calma quase obstinada. A chegada a Caldas de Reis funciona bem como pausa natural antes da reta final, tanto pela logística como pela sensação de avanço claro no caminho. É o tipo de dia em que o corpo já sabe o que fazer e a cabeça começa finalmente a acompanhar.', order_index: 2 },
  { day_label: 'Dia 4', title: 'Caldas de Reis até Padrón', description: 'A quarta etapa leva-te até Padrón, um dos nomes mais importantes antes da entrada final em Santiago. É um dia que pede consistência, não heroísmo, e fecha a experiência com a certeza de que o final já está próximo, mas ainda merece ser caminhado com atenção. Dormir em Padrón dá equilíbrio à estrutura de 4 noites e prepara a chegada final no dia seguinte.', order_index: 3 },
  { day_label: 'Dia 5', title: 'Padrón até Santiago de Compostela', description: 'A última etapa é a mais simbólica de todas. Saindo de Padrón, o caminho leva-te até Santiago de Compostela, cruzando os últimos quilómetros com uma mistura de expectativa, cansaço e foco silencioso. A entrada na cidade fecha a peregrinação de forma clássica e limpa, sem excesso de drama, mas com a carga emocional certa.', order_index: 4 },
];

const faqs = [
  { question: 'Qual o nível físico necessário?', answer: 'Médio. A rota é acessível a quem esteja habituado a caminhar vários dias seguidos, desde que aceite um ritmo constante e sem pressa.', order_index: 0 },
  { question: 'É preciso experiência em caminhadas longas?', answer: 'Não é obrigatório, mas ajuda sentir-te confortável com dias sucessivos de 15 a 30 km, dependendo da etapa.', order_index: 1 },
  { question: 'Quantas noites inclui?', answer: 'A experiência está desenhada para 4 noites, com dormida em pontos-chave ao longo do Caminho.', order_index: 2 },
  { question: 'As refeições estão incluídas?', answer: 'Não. O alojamento está incluído, mas as refeições ficam fora do pacote para dar mais flexibilidade ao viajante. Em algumas estadias, um ligeiro pequeno-almoço pode estar incluído.', order_index: 3 },
];

const activity_dates = [
  { date_range: '1 Set — 5 Set 2026', status: 'disponivel', spots: 8, price: '249€', order_index: 0 },
  { date_range: '6 Out — 10 Out 2026', status: 'disponivel', spots: 8, price: '249€', order_index: 1 },
];

async function run() {
  // 1. Encontrar a aventura pelo slug
  const { data: adv, error: findErr } = await supabase
    .from('adventures')
    .select('id, slug, title, index')
    .or('slug.eq.caminhos-de-santiago-a-correr,slug.eq.caminhos-de-santiago,title.ilike.%Santiago%')
    .single();

  if (findErr || !adv) {
    console.error('❌ Aventura não encontrada:', findErr?.message);
    process.exit(1);
  }

  console.log(`✅ Encontrada: "${adv.title}" (${adv.slug}) — id: ${adv.id} — index: ${adv.index}`);

  // 2. Update à aventura principal
  const { error: updErr, data: updData } = await supabase
    .from('adventures')
    .update({
      title: update.title,
      slug: 'caminhos-de-santiago',
      tagline: update.tagline,
      location: update.location,
      duration: update.duration,
      difficulty: update.difficulty,
      price: update.price,
      description: update.description,
      includes: update.includes,
      not_includes: update.not_includes,
      packing_list: update.packing_list,
      digital_detox: update.digital_detox,
      cancellations: update.cancellations,
      curiosities: update.curiosities,
      coming_soon: false,
      is_active: true,
    })
    .eq('id', adv.id)
    .select('title, price, slug');

  if (updErr) {
    console.error('❌ Erro ao atualizar aventura:', updErr.message);
    process.exit(1);
  }
  console.log('✅ Aventura atualizada:', JSON.stringify(updData));

  // 3. Substituir itinerário
  await supabase.from('itinerary').delete().eq('adventure_id', adv.id);
  const { error: itinErr } = await supabase.from('itinerary').insert(
    itinerary.map(i => ({ ...i, adventure_id: adv.id }))
  );
  if (itinErr) console.error('❌ Itinerário:', itinErr.message);
  else console.log('✅ Itinerário inserido (5 dias)');

  // 4. Substituir FAQs
  await supabase.from('faqs').delete().eq('adventure_id', adv.id);
  const { error: faqErr } = await supabase.from('faqs').insert(
    faqs.map(f => ({ ...f, adventure_id: adv.id }))
  );
  if (faqErr) console.error('❌ FAQs:', faqErr.message);
  else console.log('✅ FAQs inseridas');

  // 5. Substituir datas
  await supabase.from('activity_dates').delete().eq('adventure_id', adv.id);
  const { error: datesErr } = await supabase.from('activity_dates').insert(
    activity_dates.map(d => ({ ...d, adventure_id: adv.id }))
  );
  if (datesErr) console.error('❌ Datas:', datesErr.message);
  else console.log('✅ Datas inseridas (Set + Out 2026)');

  console.log('\n🎉 Santiago atualizado com sucesso!');
}

run();
