const recipesData = {
            "receitas": [
                {
                    "id": 1,
                    "nome": "Brigadeiro Gourmet",
                    "dificuldade": "Fácil",
                    "tempo": "30 min",
                    "imagem": "../img/brigadeiro.jpg",
                    "ingredientes": [
                        "1 lata de leite condensado",
                        "3 colheres de sopa de chocolate em pó",
                        "1 colher de sopa de manteiga",
                        "Chocolate granulado para enrolar",
                        "1 pitada de sal"
                    ],
                    "preparo": [
                        "Em uma panela, misture o leite condensado, chocolate em pó e manteiga",
                        "Cozinhe em fogo médio, mexendo sempre até desgrudar do fundo",
                        "Deixe esfriar e faça bolinhas com as mãos",
                        "Passe no chocolate granulado e sirva em forminhas"
                    ]
                },
                {
                    "id": 2,
                    "nome": "Mousse de Maracujá",
                    "dificuldade": "Médio",
                    "tempo": "45 min",
                    "imagem": "../img/mousse.jpg",
                    "ingredientes": [
                        "1 lata de leite condensado",
                        "1 lata de creme de leite",
                        "1/2 xícara de suco de maracujá concentrado",
                        "1 envelope de gelatina incolor",
                        "3 claras em neve"
                    ],
                    "preparo": [
                        "Hidrate a gelatina em água fria e dissolva no microondas",
                        "Bata no liquidificador leite condensado, creme de leite e suco",
                        "Adicione a gelatina dissolvida e bata mais um pouco",
                        "Incorpore delicadamente as claras em neve",
                        "Despeje em taças e leve à geladeira por 2 horas"
                    ]
                },
                {
                    "id": 3,
                    "nome": "Pudim de Leite Cremoso",
                    "dificuldade": "Médio",
                    "tempo": "1h 30min",
                    "imagem": "../img/pudim.jpg",
                    "ingredientes": [
                        "1 lata de leite condensado",
                        "2 xícaras de leite",
                        "3 ovos inteiros",
                        "1 xícara de açúcar para a calda",
                        "1 colher de chá de essência de baunilha"
                    ],
                    "preparo": [
                        "Faça a calda derretendo o açúcar até dourar",
                        "Despeje a calda na forma e incline para cobrir o fundo",
                        "Bata todos os ingredientes no liquidificador",
                        "Despeje sobre a calda e cozinhe em banho-maria por 1 hora",
                        "Desenforme apenas quando estiver frio"
                    ]
                },
                {
                    "id": 4,
                    "nome": "Cookies de Chocolate",
                    "dificuldade": "Fácil",
                    "tempo": "40 min",
                    "imagem": "../img/cookie.jpg",
                    "ingredientes": [
                        "2 xícaras de farinha de trigo",
                        "1 xícara de açúcar mascavo",
                        "1/2 xícara de manteiga derretida",
                        "1 ovo",
                        "1 xícara de gotas de chocolate",
                        "1 colher de chá de fermento em pó"
                    ],
                    "preparo": [
                        "Misture a farinha, açúcar e fermento em uma tigela",
                        "Adicione o ovo e a manteiga, mexendo até formar uma massa",
                        "Incorpore as gotas de chocolate",
                        "Faça bolinhas e achate levemente numa assadeira",
                        "Asse a 180°C por 15-20 minutos"
                    ]
                },
                {
                    "id": 5,
                    "nome": "Pavê de Morango",
                    "dificuldade": "Fácil",
                    "tempo": "25 min",
                    "imagem": "../img/pave.jpg",
                    "ingredientes": [
                        "2 pacotes de biscoito maizena",
                        "500g de morangos frescos",
                        "1 lata de creme de leite",
                        "1 lata de leite condensado",
                        "1 xícara de leite",
                        "Açúcar a gosto"
                    ],
                    "preparo": [
                        "Corte os morangos em fatias e reserve alguns para decorar",
                        "Bata no liquidificador creme de leite e leite condensado",
                        "Em um refratário, faça camadas alternando biscoito molhado no leite",
                        "Cubra com creme e morangos até terminar os ingredientes",
                        "Decore com morangos e leve à geladeira por 2 horas"
                    ]
                },
                {
                    "id": 6,
                    "nome": "Trufa de Chocolate Branco",
                    "dificuldade": "Médio",
                    "tempo": "50 min",
                    "imagem": "../img/trufa.jpg",
                    "ingredientes": [
                        "200g de chocolate branco picado",
                        "1/2 xícara de creme de leite fresco",
                        "2 colheres de sopa de manteiga",
                        "Coco ralado para enrolar",
                        "1 colher de chá de essência de baunilha"
                    ],
                    "preparo": [
                        "Derreta o chocolate branco em banho-maria",
                        "Aqueça o creme de leite e despeje sobre o chocolate",
                        "Misture bem, adicione manteiga e baunilha",
                        "Leve à geladeira até firmar (30 min)",
                        "Faça bolinhas e passe no coco ralado"
                    ]
                },
                {
                    "id": 7,
                    "nome": "Cheesecake de Frutas Vermelhas",
                    "dificuldade": "Difícil",
                    "tempo": "2h",
                    "imagem": "../img/chesecake.jpg",
                    "ingredientes": [
                        "200g de biscoito triturado",
                        "100g de manteiga derretida",
                        "500g de cream cheese",
                        "3/4 xícara de açúcar",
                        "3 ovos",
                        "1 xícara de frutas vermelhas",
                        "Calda de frutas vermelhas"
                    ],
                    "preparo": [
                        "Misture biscoito e manteiga, pressione no fundo da forma",
                        "Bata cream cheese com açúcar até ficar cremoso",
                        "Adicione ovos um a um, batendo bem",
                        "Despeje sobre a base e asse a 160°C por 45 min",
                        "Deixe esfriar, decore com frutas e calda"
                    ]
                }
            ]
        };

        // Função para criar um card de receita
        function createRecipeCard(receita) {
            // Função para normalizar o texto da dificuldade
            const normalizeDifficulty = (difficulty) => {
                return difficulty.toLowerCase()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
                    .replace(/[^a-z0-9]/g, ''); // Remove caracteres especiais
            };
            
            const difficultyClass = normalizeDifficulty(receita.dificuldade);
            
            // Debug para verificar as classes geradas
            console.log(`Receita: ${receita.nome}, Dificuldade: ${receita.dificuldade}, Classe: ${difficultyClass}`);
            
            return `
                <div class="recipe-card">
                    <div class="recipe-image" style="background-image: url('${receita.imagem}')" alt="${receita.nome}"></div>
                    <div class="recipe-content">
                        <h3 class="recipe-title">${receita.nome}</h3>
                        <div class="difficulty ${difficultyClass}">${receita.dificuldade}</div>
                        <div class="time">${receita.tempo}</div>
                        
                        <div class="ingredients">
                            <h4>Ingredientes:</h4>
                            <ul>
                                ${receita.ingredientes.map(ingrediente => `<li>${ingrediente}</li>`).join('')}
                            </ul>
                        </div>

                        <div class="instructions">
                            <h4>Modo de Preparo:</h4>
                            <ol>
                                ${receita.preparo.map(passo => `<li>${passo}</li>`).join('')}
                            </ol>
                        </div>
                    </div>
                </div>
            `;
        }

        // Função para carregar e exibir as receitas
        function loadRecipes() {
            try {
                const loadingElement = document.getElementById('loading');
                const errorElement = document.getElementById('error');
                const recipesContainer = document.getElementById('recipes-container');

                // Simula um pequeno delay de carregamento para mostrar o loading
                setTimeout(() => {
                    loadingElement.style.display = 'none';
                    
                    if (recipesData && recipesData.receitas) {
                        // Gera os cards das receitas
                        const recipesHTML = recipesData.receitas.map(receita => createRecipeCard(receita)).join('');
                        recipesContainer.innerHTML = recipesHTML;
                        recipesContainer.style.display = 'grid';
                        
                        // Adiciona animações aos cards
                        addAnimations();
                        
                        console.log(`✅ ${recipesData.receitas.length} receitas carregadas com sucesso!`);
                    } else {
                        throw new Error('Dados das receitas não encontrados');
                    }
                }, 500);
                
            } catch (error) {
                console.error('❌ Erro ao carregar receitas:', error);
                document.getElementById('loading').style.display = 'none';
                document.getElementById('error').style.display = 'block';
            }
        }

        // Função para adicionar animações aos cards
        function addAnimations() {
            const cards = document.querySelectorAll('.recipe-card');
            
            // Animação de entrada
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            });

            cards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
                observer.observe(card);
            });

            // Efeito de hover
            cards.forEach(card => {
                card.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-10px) scale(1.02)';
                });
                
                card.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0) scale(1)';
                });
            });
        }

        // Carrega as receitas quando a página estiver pronta
        document.addEventListener('DOMContentLoaded', function() {
            console.log('🍰 Iniciando carregamento das receitas...');
            loadRecipes();
        });

        // Função para pesquisar receitas (para expansões futuras)
        function searchRecipes(searchTerm) {
            const filteredRecipes = recipesData.receitas.filter(receita => 
                receita.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                receita.ingredientes.some(ingrediente => 
                    ingrediente.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
            return filteredRecipes;
        }

        // Função para obter receita por ID (para expansões futuras)
        function getRecipeById(id) {
            return recipesData.receitas.find(receita => receita.id === id);
        }

        // Função para obter receitas por dificuldade (para expansões futuras)
        function getRecipesByDifficulty(difficulty) {
            return recipesData.receitas.filter(receita => 
                receita.dificuldade.toLowerCase() === difficulty.toLowerCase()
            );
        }