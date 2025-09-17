const BACKEND_IP = "172.31.26.48";   // exemplo de IP privado do backend
const BACKEND_PORT = 25000;          // porta do backend
const BACKEND_URL = `http://${BACKEND_IP}:${BACKEND_PORT}`;

// Variável global para armazenar os dados das receitas
let recipesData = null;

// Função para carregar dados do arquivo JSON
async function fetchRecipesData() {
    try {
        console.log('🔄 Carregando receitas do backend...');
        const response = await fetch(BACKEND_URL); // chama o JSON diretamente do backend

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('✅ Dados carregados com sucesso:', data.meta);
        return data;
        
    } catch (error) {
        console.error('❌ Erro ao carregar receitas:', error);
        throw error; // Re-lança o erro para ser tratado pela função que chama
    }
}

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
    const imgSrc = `http://${BACKEND_IP}:${BACKEND_PORT}/${receita.imagem}`;
    // Debug para verificar as classes geradas
    console.log(`Receita: ${receita.nome}, Dificuldade: ${receita.dificuldade}, Classe: ${difficultyClass}`);
    
    return `
        <div class="recipe-card">
            <div class="recipe-image" style="background-image: url('${imgSrc}')" alt="${receita.nome}"></div>
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
async function loadRecipes() {
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error');
    const recipesContainer = document.getElementById('recipes-container');

    try {
        // Carrega os dados do backend
        recipesData = await fetchRecipesData();
        
        // Simula um pequeno delay para mostrar o loading
        setTimeout(() => {
            loadingElement.style.display = 'none';
            
            if (recipesData && recipesData.receitas && recipesData.receitas.length > 0) {
                // Gera os cards das receitas
                const recipesHTML = recipesData.receitas.map(receita => createRecipeCard(receita)).join('');
                recipesContainer.innerHTML = recipesHTML;
                recipesContainer.style.display = 'grid';
                
                // Adiciona animações aos cards
                addAnimations();
                
                console.log(`✅ ${recipesData.receitas.length} receitas carregadas e exibidas!`);
                
                // Exibe informações do backend se disponíveis
                if (recipesData.meta) {
                    console.log(`📊 Versão: ${recipesData.meta.versao} | Última atualização: ${recipesData.meta.ultima_atualizacao}`);
                }
            } else {
                throw new Error('Nenhuma receita encontrada no arquivo JSON');
            }
        }, 800);
        
    } catch (error) {
        console.error('❌ Falha ao carregar receitas:', error);
        loadingElement.style.display = 'none';
        errorElement.innerHTML = `
            <p>❌ Erro ao carregar as receitas!</p>
            <p><strong>Detalhes:</strong> ${error.message}</p>
            <p>Verifique se o arquivo <code>receitas.json</code> existe e está no formato correto.</p>
        `;
        errorElement.style.display = 'block';
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
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Funções de API para interagir com o backend JSON

// Função para pesquisar receitas
function searchRecipes(searchTerm) {
    if (!recipesData || !recipesData.receitas) return [];
    
    return recipesData.receitas.filter(receita => 
        receita.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receita.ingredientes.some(ingrediente => 
            ingrediente.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        (receita.categoria && receita.categoria.toLowerCase().includes(searchTerm.toLowerCase()))
    );
}

// Função para obter receita por ID
function getRecipeById(id) {
    if (!recipesData || !recipesData.receitas) return null;
    return recipesData.receitas.find(receita => receita.id === parseInt(id));
}

// Função para obter receitas por dificuldade
function getRecipesByDifficulty(difficulty) {
    if (!recipesData || !recipesData.receitas) return [];
    return recipesData.receitas.filter(receita => 
        receita.dificuldade.toLowerCase() === difficulty.toLowerCase()
    );
}

// Função para obter receitas por categoria
function getRecipesByCategory(category) {
    if (!recipesData || !recipesData.receitas) return [];
    return recipesData.receitas.filter(receita => 
        receita.categoria && receita.categoria.toLowerCase() === category.toLowerCase()
    );
}

// Função para obter estatísticas do backend
function getBackendStats() {
    if (!recipesData) return null;
    
    const stats = {
        totalReceitas: recipesData.receitas?.length || 0,
        categorias: recipesData.categorias || [],
        dificuldades: recipesData.dificuldades || [],
        meta: recipesData.meta || {}
    };
    
    // Calcula estatísticas dinâmicas
    if (recipesData.receitas) {
        stats.receitasPorDificuldade = recipesData.receitas.reduce((acc, receita) => {
            acc[receita.dificuldade] = (acc[receita.dificuldade] || 0) + 1;
            return acc;
        }, {});
        
        stats.receitasPorCategoria = recipesData.receitas.reduce((acc, receita) => {
            if (receita.categoria) {
                acc[receita.categoria] = (acc[receita.categoria] || 0) + 1;
            }
            return acc;
        }, {});
    }
    
    return stats;
}

// Carrega as receitas quando a página estiver pronta
document.addEventListener('DOMContentLoaded', function() {
    console.log('🍰 Iniciando carregamento das receitas...');
    loadRecipes();
});