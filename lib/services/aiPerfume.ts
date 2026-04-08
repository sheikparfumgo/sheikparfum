import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function generatePerfumeData(name: string, brand: string) {

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",

        messages: [
            {
                role: "system",
                content: `
Você é um perfumista especialista com conhecimento técnico real em perfumaria.

Você entende famílias olfativas, pirâmide olfativa e coerência entre notas.

REGRAS ABSOLUTAS:

- Responder SEMPRE em português (Brasil)
- Nunca responder em inglês
- Nunca usar frases genéricas
- Nunca inventar combinações irreais
- Priorizar coerência olfativa acima de criatividade

PRINCÍPIO CRÍTICO:

- NÃO generalizar perfumes por marca
- Cada perfume deve ser analisado individualmente
- O nome do perfume é a principal fonte de inferência

REGRAS DE PERFUMARIA:

1. PERFUMES GOURMAND:
- notas: baunilha, caramelo, chocolate, âmbar doce, frutas
- evitar: lavanda, notas verdes, acordes frescos

2. PERFUMES CÍTRICOS/FRESCOS:
- notas: limão, bergamota, mandarina, notas aquáticas
- evitar: chocolate, caramelo pesado, resinas densas

3. PERFUMES AMADEIRADOS/ORIENTAIS:
- notas: oud, sândalo, patchouli, âmbar, resinas
- podem ter leve doçura
- evitar perfil aquático leve

4. COMPATIBILIDADE:

- topo deve preparar o coração
- coração deve conectar com a base
- evitar contrastes irreais (ex: aquático + chocolate)

5. PIRÂMIDE:

- topo: leve e volátil
- coração: identidade
- base: fixação

SAÍDA:
JSON válido.
`
            },
            {
                role: "user",
                content: `
Perfume: ${name}
Marca: ${brand}

ETAPA 1 — ANÁLISE:

Analise SOMENTE o nome do perfume e determine:

- perfil (gourmand, cítrico, amadeirado, oriental, floral, aromático)
- intensidade (leve, moderado, intenso)
- uso (dia, noite, versátil, sedutor)

IMPORTANTE:
- NÃO assumir perfil pela marca
- NÃO generalizar

ETAPA 2 — PIRÂMIDE:

Crie notas coerentes com o perfil identificado:

- máximo 3 notas por etapa
- notas devem fazer sentido entre si
- evitar combinações irreais

ETAPA 3 — DESCRIÇÃO:

Estrutura:

1. Classificação:
"${name} de ${brand} é um perfume [família] [gênero]."

2. Parágrafo 1:
- proposta do perfume
- estilo olfativo

3. Parágrafo 2:
- evolução na pele (topo → coração → base)

ETAPA 4 — GÊNERO:

- baseado no perfil real
- se houver dúvida → unissex

RETORNO:

{
  "description": "descrição técnica e sensorial em 2 parágrafos",
  "notes": {
    "top": [],
    "heart": [],
    "base": []
  },
  "olfactive_family": "",
  "category": "",
  "gender": ""
}

NOTAS PERMITIDAS (USE APENAS ESSAS):

Cardamomo, Pimenta Rosa, Pimenta, Canela, Noz-moscada, Cravo,
Oud, Sândalo, Vetiver, Cedro, Patchouli, Madeira, Madeiras, Madeira clara,
Baunilha, Tonka, Âmbar, Resinas, Caramelo, Chocolate, Mel, Açúcar, Coco, Café, Frutas vermelhas,
Bergamota, Limão, Laranja, Tangerina, Grapefruit, Cítrico,
Rosa, Jasmim, Flor de Laranjeira, Ylang-Ylang, Lírio,
Lavanda, Notas verdes, Hortelã, Alecrim, Manjericão,
Notas aquáticas, Aquático, Marinho,
Almíscar, Musk branco, Sabão,
Couro, Fumaça, Incenso

REGRAS:

- NÃO usar nenhuma nota fora dessa lista
- Se não souber → escolher da lista

REGRAS FINAIS:

- NÃO inventar combinações incoerentes
- NÃO usar lavanda em perfume gourmand
- NÃO usar notas doces pesadas em perfumes frescos
- Se estiver em dúvida → simplificar
`
            }
        ],

        temperature: 0.9, // 🔥 mais criatividade controlada
        response_format: { type: "json_object" },
    });

    let content = completion.choices[0].message.content;

    if (!content) {
        throw new Error("Resposta vazia da IA");
    }

    try {
        return JSON.parse(content);
    } catch {

        const match = content.match(/\{[\s\S]*\}/);

        if (match) {
            return JSON.parse(match[0]);
        }

        console.error("RESPOSTA QUEBROU:", content);

        throw new Error("Erro ao parsear resposta da IA");
    }
}