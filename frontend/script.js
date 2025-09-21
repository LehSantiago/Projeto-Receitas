function getBackendURL() {
    const isProduction = !window.location.hostname.includes('localhost') &&
                         !window.location.hostname.includes('127.0.0.1');

    if (isProduction) {
        // Em produção (EC2), usar o proxy do nginx
        return "/api";
    } else {
        // Em desenvolvimento local
        return "http://localhost:25000";
    }
}

// Variável global para armazenar os dados das receitas
let recipesData = null;

// Função principal para carregar dados do backend
async function fetchRecipesData() {
    const backendURL = getBackendURL();
    
    try {
        console.log("📄 Carregando receitas do backend...", backendURL);
        
        const response = await fetch(`${backendURL}/receitas`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            mode: 'cors',
        });

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log("✅ Receitas carregadas:", data);
        
        return data;
    } catch (error) {
        console.error("⛔ Erro ao carregar receitas:", error);
        
        // Tentar fallback com dados mock se a API falhar
        console.log("📄 Tentando carregar dados de fallback...");
        return getFallbackData();
    }
}

// Dados de fallback caso a API não esteja disponível
function getFallbackData() {
    return {
        receitas: [
            {
                id: 1,
                nome: "Brigadeiro Gourmet",
                dificuldade: "Fácil",
                tempo: "30 min",
                imagem: "https://i.pinimg.com/1200x/4b/bc/5a/4bbc5a195096023bb99b025e90661acf.jpg",
                ingredientes: [
                    "1 lata de leite condensado",
                    "3 colheres de sopa de chocolate em pó",
                    "1 colher de sopa de manteiga",
                    "Chocolate granulado para enrolar"
                ],
                preparo: [
                    "Em uma panela, misture o leite condensado, chocolate em pó e manteiga",
                    "Cozinhe em fogo médio, mexendo sempre até desgrudar do fundo",
                    "Deixe esfriar e faça bolinhas com as mãos",
                    "Passe no chocolate granulado e sirva em forminhas"
                ]
            }
        ]
    };
}

// Função para normalizar texto (remove acentos e caracteres especiais)
function normalizeText(text) {
    return text.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '');
}

// Função para criar um card de receita
function createRecipeCard(receita) {
    const difficultyClass = normalizeText(receita.dificuldade);
    
    return `
        <div class="recipe-card" data-id="${receita.id || ''}">
            <div class="recipe-image" style="background-image: url('${receita.imagem}')" alt="${receita.nome}"></div>
            <div class="recipe-content">
                <h3 class="recipe-title">${receita.nome}</h3>
                <div class="difficulty ${difficultyClass}">${receita.dificuldade}</div>
                <div class="time">${receita.tempo || 'Não informado'}</div>
                
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

// Função para renderizar receitas no DOM
function renderRecipes(recipes = null) {
    const recipesContainer = document.getElementById('recipes-container');
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error');
    
    if (!recipesContainer) {
        console.error('⛔ Container de receitas não encontrado');
        return;
    }

    // Se não foram passadas receitas específicas, usa todas as receitas
    const receitasParaExibir = recipes || (recipesData?.receitas || recipesData || []);
    
    if (receitasParaExibir.length === 0) {
        recipesContainer.innerHTML = '<p>Nenhuma receita encontrada.</p>';
        return;
    }

    // Gera os cards das receitas
    const recipesHTML = receitasParaExibir.map(receita => createRecipeCard(receita)).join('');
    recipesContainer.innerHTML = recipesHTML;
    recipesContainer.style.display = 'grid';
    
    // Esconde elementos de loading/erro
    if (loadingElement) loadingElement.style.display = 'none';
    if (errorElement) errorElement.style.display = 'none';
    
    // Adiciona animações aos cards
    addAnimations();
    
    console.log(`✅ ${receitasParaExibir.length} receitas renderizadas!`);
}

// Função para adicionar animações aos cards
function addAnimations() {
    const cards = document.querySelectorAll('.recipe-card');
    
    // Animação de entrada com Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });

    cards.forEach((card, index) => {
        // Configura estado inicial
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        
        // Observa o card para animação de entrada
        observer.observe(card);

        // Adiciona efeitos de hover
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Função principal para carregar e exibir receitas
async function loadRecipes() {
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error');

    try {
        // Mostra loading se existir
        if (loadingElement) loadingElement.style.display = 'block';
        if (errorElement) errorElement.style.display = 'none';

        // Carrega os dados do backend
        recipesData = await fetchRecipesData();
        
        // Pequeno delay para mostrar o loading
        setTimeout(() => {
            renderRecipes();
            
            // Log de informações adicionais
            if (recipesData?.meta) {
                console.log(`📊 Versão: ${recipesData.meta.versao} | Última atualização: ${recipesData.meta.ultima_atualizacao}`);
            }
        }, 800);
        
    } catch (error) {
        console.error('⛔ Falha ao carregar receitas:', error);
        
        if (loadingElement) loadingElement.style.display = 'none';
        if (errorElement) {
            errorElement.innerHTML = `
                <p>⛔ Erro ao carregar as receitas!</p>
                <p><strong>Detalhes:</strong> ${error.message}</p>
                <p>Verifique se o backend está funcionando corretamente em ${getBackendURL()}</p>
                <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #f9a8d4; border: none; border-radius: 5px; cursor: pointer;">
                    🔄 Tentar Novamente
                </button>
            `;
            errorElement.style.display = 'block';
        }
    }
}

// === FUNÇÕES DE PESQUISA E FILTRO ===

// Função auxiliar para obter array de receitas
function getRecipesArray() {
    if (!recipesData) return [];
    
    if (recipesData.receitas && Array.isArray(recipesData.receitas)) {
        return recipesData.receitas;
    }
    
    if (Array.isArray(recipesData)) {
        return recipesData;
    }
    
    return [];
}

// Função para pesquisar receitas
function searchRecipes(searchTerm) {
    if (!recipesData || !getRecipesArray()) return [];
    
    const term = searchTerm.toLowerCase();
    return getRecipesArray().filter(receita => 
        receita.nome.toLowerCase().includes(term) ||
        receita.ingredientes.some(ingrediente => 
            ingrediente.toLowerCase().includes(term)
        ) ||
        (receita.categoria && receita.categoria.toLowerCase().includes(term))
    );
}

// Função para obter receita por ID
function getRecipeById(id) {
    if (!recipesData || !getRecipesArray()) return null;
    return getRecipesArray().find(receita => receita.id === parseInt(id));
}

// Função para obter receitas por dificuldade
function getRecipesByDifficulty(difficulty) {
    if (!recipesData || !getRecipesArray()) return [];
    return getRecipesArray().filter(receita => 
        receita.dificuldade.toLowerCase() === difficulty.toLowerCase()
    );
}

// === FUNÇÕES PÚBLICAS PARA USO EXTERNO ===

// Função para recarregar receitas
window.reloadRecipes = loadRecipes;

// Função para aplicar filtros
window.filterRecipes = function(filters) {
    let filteredRecipes = getRecipesArray();
    
    if (filters.search) {
        filteredRecipes = searchRecipes(filters.search);
    }
    
    if (filters.difficulty) {
        filteredRecipes = filteredRecipes.filter(receita => 
            receita.dificuldade.toLowerCase() === filters.difficulty.toLowerCase()
        );
    }
    
    if (filters.category) {
        filteredRecipes = filteredRecipes.filter(receita => 
            receita.categoria && receita.categoria.toLowerCase() === filters.category.toLowerCase()
        );
    }
    
    renderRecipes(filteredRecipes);
    return filteredRecipes;
};

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    console.log('🍰 Iniciando aplicação de receitas...');
    console.log('🌐 Backend URL:', getBackendURL());
    loadRecipes();
});