/* =====================================================
   ConectaHabilitação - JavaScript v3.0
   Com integração Supabase
   ===================================================== */

// =====================================================
// CONFIGURAÇÃO DO SUPABASE
// =====================================================
const SUPABASE_URL = 'https://umkaibpdihzqosloajaq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVta2FpYnBkaWh6cW9zbG9hamFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0MjI2NjEsImV4cCI6MjA4NTk5ODY2MX0.2KNXtHM3J9A3FQcnNqXp6X8j15Wu22AreIV1e7Wefuc';

// Cliente Supabase simplificado
const supabase = {
    from: function(table) {
        return {
            table: table,
            
            // INSERT
            insert: async function(data) {
                try {
                    const response = await fetch(`${SUPABASE_URL}/rest/v1/${this.table}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'apikey': SUPABASE_ANON_KEY,
                            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                            'Prefer': 'return=representation'
                        },
                        body: JSON.stringify(data)
                    });
                    
                    if (!response.ok) {
                        const error = await response.json();
                        throw new Error(error.message || 'Erro ao inserir dados');
                    }
                    
                    const result = await response.json();
                    return { data: result, error: null };
                } catch (error) {
                    return { data: null, error: error.message };
                }
            },
            
            // SELECT
            select: async function(columns = '*') {
                this._select = columns;
                return this;
            },
            
            // Filtros
            eq: function(column, value) {
                this._filters = this._filters || [];
                this._filters.push(`${column}=eq.${value}`);
                return this;
            },
            
            ilike: function(column, value) {
                this._filters = this._filters || [];
                this._filters.push(`${column}=ilike.%${value}%`);
                return this;
            },
            
            gte: function(column, value) {
                this._filters = this._filters || [];
                this._filters.push(`${column}=gte.${value}`);
                return this;
            },
            
            lte: function(column, value) {
                this._filters = this._filters || [];
                this._filters.push(`${column}=lte.${value}`);
                return this;
            },
            
            order: function(column, options = {}) {
                this._order = `${column}.${options.ascending ? 'asc' : 'desc'}`;
                return this;
            },
            
            limit: function(count) {
                this._limit = count;
                return this;
            },
            
            // Executa a query
            execute: async function() {
                try {
                    let url = `${SUPABASE_URL}/rest/v1/${this.table}?select=${this._select || '*'}`;
                    
                    if (this._filters && this._filters.length > 0) {
                        url += '&' + this._filters.join('&');
                    }
                    
                    if (this._order) {
                        url += `&order=${this._order}`;
                    }
                    
                    if (this._limit) {
                        url += `&limit=${this._limit}`;
                    }
                    
                    const response = await fetch(url, {
                        method: 'GET',
                        headers: {
                            'apikey': SUPABASE_ANON_KEY,
                            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                        }
                    });
                    
                    if (!response.ok) {
                        const error = await response.json();
                        throw new Error(error.message || 'Erro ao buscar dados');
                    }
                    
                    const result = await response.json();
                    return { data: result, error: null };
                } catch (error) {
                    return { data: null, error: error.message };
                }
            }
        };
    }
};

// =====================================================
// DADOS E ESTADO
// =====================================================

// Dados mockados (fallback se não houver dados no banco)
const instrutoresMock = [
    {
        id: 1,
        nome: "Carlos Eduardo Silva",
        estado: "SP",
        cidade: "São Paulo - Zona Sul",
        categorias_leciona: ["B"],
        preco_aula: 95,
        avaliacao_media: 4.9,
        total_avaliacoes: 127,
        anos_experiencia: "10+",
        veiculo_aula: "Chevrolet Onix 2023",
        foto_url: null,
        plano: "premium",
        verificado: true,
        destaque_ate: new Date(Date.now() + 30*24*60*60*1000).toISOString()
    },
    {
        id: 2,
        nome: "Ana Paula Ferreira",
        estado: "SP",
        cidade: "Campinas",
        categorias_leciona: ["A", "B"],
        preco_aula: 85,
        avaliacao_media: 4.8,
        total_avaliacoes: 89,
        anos_experiencia: "5-10",
        veiculo_aula: "VW Polo + Honda CG",
        foto_url: null,
        plano: "profissional",
        verificado: true,
        destaque_ate: null
    },
    {
        id: 3,
        nome: "Roberto Mendes",
        estado: "RJ",
        cidade: "Rio de Janeiro - Barra",
        categorias_leciona: ["B", "C"],
        preco_aula: 120,
        avaliacao_media: 5.0,
        total_avaliacoes: 203,
        anos_experiencia: "10+",
        veiculo_aula: "Toyota Corolla + Caminhão VW",
        foto_url: null,
        plano: "premium",
        verificado: true,
        destaque_ate: new Date(Date.now() + 15*24*60*60*1000).toISOString()
    },
    {
        id: 4,
        nome: "Mariana Costa",
        estado: "MG",
        cidade: "Belo Horizonte",
        categorias_leciona: ["B"],
        preco_aula: 75,
        avaliacao_media: 4.7,
        total_avaliacoes: 56,
        anos_experiencia: "3-5",
        veiculo_aula: "Hyundai HB20",
        foto_url: null,
        plano: "gratuito",
        verificado: true,
        destaque_ate: null
    },
    {
        id: 5,
        nome: "José Ricardo Santos",
        estado: "RS",
        cidade: "Porto Alegre",
        categorias_leciona: ["A", "B", "C"],
        preco_aula: 90,
        avaliacao_media: 4.9,
        total_avaliacoes: 142,
        anos_experiencia: "10+",
        veiculo_aula: "Fiat Argo + Yamaha + Mercedes",
        foto_url: null,
        plano: "gratuito",
        verificado: true,
        destaque_ate: null
    },
    {
        id: 6,
        nome: "Fernanda Lima",
        estado: "PR",
        cidade: "Curitiba",
        categorias_leciona: ["B"],
        preco_aula: 80,
        avaliacao_media: 4.6,
        total_avaliacoes: 78,
        anos_experiencia: "3-5",
        veiculo_aula: "Renault Kwid Automático",
        foto_url: null,
        plano: "gratuito",
        verificado: true,
        destaque_ate: null
    }
];

let instrutoresData = [];
let displayedCount = 6;
let selectedBoost = { days: 30, price: 79.90 };

// =====================================================
// FUNÇÕES DO BANCO DE DADOS
// =====================================================

// Buscar instrutores do banco
async function fetchInstrutores() {
    try {
        const query = supabase.from('instrutores');
        await query.select('*');
        query.eq('status', 'ativo');
        query.order('destaque_ate', { ascending: false });
        
        const { data, error } = await query.execute();
        
        if (error) {
            console.warn('Erro ao buscar instrutores, usando dados mock:', error);
            return instrutoresMock;
        }
        
        if (data && data.length > 0) {
            return data;
        }
        
        // Se não houver dados, retorna mock
        return instrutoresMock;
    } catch (error) {
        console.warn('Erro ao conectar com o banco, usando dados mock:', error);
        return instrutoresMock;
    }
}

// Cadastrar instrutor no banco
async function cadastrarInstrutor(dadosFormulario) {
    try {
        const { data, error } = await supabase.from('instrutores').insert(dadosFormulario);
        
        if (error) {
            throw new Error(error);
        }
        
        return { success: true, data };
    } catch (error) {
        console.error('Erro ao cadastrar instrutor:', error);
        return { success: false, error: error.message };
    }
}

// Registrar contato (quando aluno clica em WhatsApp)
async function registrarContato(instrutorId, tipo = 'whatsapp') {
    try {
        await supabase.from('contatos').insert({
            instrutor_id: instrutorId,
            tipo: tipo
        });
    } catch (error) {
        console.warn('Erro ao registrar contato:', error);
    }
}

// =====================================================
// FUNÇÕES DE RENDERIZAÇÃO
// =====================================================

// Ordenar instrutores (destaque/premium primeiro)
function sortInstrutores(instrutores) {
    return [...instrutores].sort((a, b) => {
        // Primeiro: quem tem destaque ativo
        const aDestaque = a.destaque_ate && new Date(a.destaque_ate) > new Date();
        const bDestaque = b.destaque_ate && new Date(b.destaque_ate) > new Date();
        if (aDestaque && !bDestaque) return -1;
        if (!aDestaque && bDestaque) return 1;
        
        // Segundo: plano premium
        if (a.plano === 'premium' && b.plano !== 'premium') return -1;
        if (a.plano !== 'premium' && b.plano === 'premium') return 1;
        
        // Terceiro: plano profissional
        if (a.plano === 'profissional' && b.plano === 'gratuito') return -1;
        if (a.plano === 'gratuito' && b.plano === 'profissional') return 1;
        
        // Por último: avaliação
        return (b.avaliacao_media || 0) - (a.avaliacao_media || 0);
    });
}

// Renderiza os cards de instrutores
function renderInstrutores(instrutores) {
    const grid = document.getElementById('instructors-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    const sorted = sortInstrutores(instrutores);
    
    sorted.slice(0, displayedCount).forEach(instrutor => {
        const isPremium = instrutor.plano === 'premium';
        const isDestaque = instrutor.destaque_ate && new Date(instrutor.destaque_ate) > new Date();
        const categorias = instrutor.categorias_leciona || ['B'];
        const avatar = instrutor.foto_url ? `<img src="${instrutor.foto_url}" alt="${instrutor.nome}">` : '👨‍🏫';
        
        const card = document.createElement('div');
        card.className = `instructor-card${isPremium ? ' premium' : ''}${isDestaque ? ' featured' : ''}`;
        card.innerHTML = `
            <div class="instructor-header">
                ${isPremium ? '<span class="instructor-premium-badge">⭐ Premium</span>' : ''}
                ${isDestaque && !isPremium ? '<span class="instructor-premium-badge" style="background: var(--accent);">🚀 Destaque</span>' : ''}
                <div class="instructor-avatar">${avatar}</div>
                <h4>${instrutor.nome}</h4>
                <p class="instructor-location">📍 ${instrutor.cidade}, ${instrutor.estado}</p>
                ${instrutor.verificado ? '<span class="instructor-verified">✓ Verificado</span>' : ''}
            </div>
            <div class="instructor-body">
                <div class="instructor-rating">
                    <span class="stars">${'⭐'.repeat(Math.floor(instrutor.avaliacao_media || 0))}</span>
                    <strong>${instrutor.avaliacao_media || 'Novo'}</strong>
                    <span class="count">(${instrutor.total_avaliacoes || 0} avaliações)</span>
                </div>
                <div class="instructor-categories">
                    ${categorias.map(cat => `<span class="category-tag">Cat. ${cat}</span>`).join('')}
                </div>
                <div class="instructor-info">
                    <span class="instructor-price">R$ ${instrutor.preco_aula}<span>/aula</span></span>
                    <span class="instructor-exp">🎓 ${instrutor.anos_experiencia || '1-2'} anos</span>
                </div>
            </div>
            <div class="instructor-footer">
                <a href="https://wa.me/55${(instrutor.telefone || '11999999999').replace(/\D/g, '')}?text=Olá! Vi seu perfil no ConectaHabilitação e gostaria de saber mais sobre suas aulas." 
                   class="btn btn-primary" 
                   target="_blank" 
                   onclick="trackLead('${instrutor.id}')">
                    💬 Contato via WhatsApp
                </a>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Filtrar instrutores
async function filterInstrutores() {
    const estado = document.getElementById('filter-estado').value;
    const categoria = document.getElementById('filter-categoria').value;
    const precoRange = document.getElementById('filter-preco').value;
    
    let filtered = [...instrutoresData];
    
    if (estado) {
        filtered = filtered.filter(i => i.estado === estado);
    }
    
    if (categoria) {
        filtered = filtered.filter(i => {
            const cats = i.categorias_leciona || [];
            return cats.includes(categoria);
        });
    }
    
    if (precoRange) {
        const [min, max] = precoRange.split('-').map(Number);
        filtered = filtered.filter(i => i.preco_aula >= min && i.preco_aula <= max);
    }
    
    displayedCount = 6;
    renderInstrutores(filtered);
    
    if (filtered.length === 0) {
        document.getElementById('instructors-grid').innerHTML = `
            <div style="grid-column: span 3; text-align: center; padding: 3rem;">
                <p style="font-size: 1.25rem; color: var(--text-secondary);">
                    😕 Nenhum instrutor encontrado com esses filtros.
                </p>
                <button class="btn btn-outline" style="margin-top: 1rem;" onclick="resetFilters()">
                    Limpar Filtros
                </button>
            </div>
        `;
    }
    
    trackEvent('filter', { estado, categoria, precoRange });
}

function resetFilters() {
    document.getElementById('filter-estado').value = '';
    document.getElementById('filter-categoria').value = '';
    document.getElementById('filter-preco').value = '';
    displayedCount = 6;
    renderInstrutores(instrutoresData);
}

function loadMore() {
    displayedCount += 3;
    renderInstrutores(instrutoresData);
    trackEvent('load_more', { count: displayedCount });
}

// =====================================================
// FORMULÁRIO DE CADASTRO
// =====================================================

async function handleCadastro(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Mostra loading
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Enviando...</span> ⏳';
    
    try {
        // Coleta os dados do formulário
        const categoriasSelecionadas = Array.from(
            document.querySelectorAll('input[name="categorias"]:checked')
        ).map(cb => cb.value);
        
        if (categoriasSelecionadas.length === 0) {
            throw new Error('Selecione pelo menos uma categoria que você leciona.');
        }
        
        const termos = document.getElementById('termos');
        if (!termos.checked) {
            throw new Error('Você precisa aceitar os termos de uso.');
        }
        
        const dadosInstrutor = {
            nome: document.getElementById('nome').value,
            cpf: document.getElementById('cpf').value,
            data_nascimento: document.getElementById('data-nascimento').value,
            telefone: document.getElementById('telefone').value,
            email: document.getElementById('email').value,
            cep: document.getElementById('cep').value,
            estado: document.getElementById('estado').value,
            cidade: document.getElementById('cidade').value,
            bairro: document.getElementById('bairro').value || null,
            cnh: document.getElementById('cnh').value,
            categoria_cnh: document.getElementById('categoria-cnh').value,
            validade_cnh: document.getElementById('validade-cnh').value,
            credencial_instrutor: document.getElementById('credencial').value,
            validade_credencial: document.getElementById('validade-credencial').value,
            cfc_vinculado: document.getElementById('cfc').value,
            categorias_leciona: categoriasSelecionadas,
            anos_experiencia: document.getElementById('experiencia').value,
            preco_aula: parseFloat(document.getElementById('preco').value),
            veiculo_aula: document.getElementById('veiculo').value,
            sobre: document.getElementById('sobre').value || null,
            plano: document.querySelector('input[name="plano"]:checked').value,
            status: 'pendente',
            verificado: false
        };
        
        // Envia para o Supabase
        const result = await cadastrarInstrutor(dadosInstrutor);
        
        if (!result.success) {
            throw new Error(result.error || 'Erro ao cadastrar. Tente novamente.');
        }
        
        // Sucesso!
        trackEvent('signup', { plano: dadosInstrutor.plano });
        showModal();
        form.reset();
        
    } catch (error) {
        alert(error.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

// =====================================================
// PRICING E PAGAMENTOS
// =====================================================

function togglePricing() {
    const isYearly = document.getElementById('pricing-toggle').checked;
    const labels = document.querySelectorAll('.toggle-label');
    const prices = document.querySelectorAll('.price-value');
    
    labels.forEach(label => {
        if (label.dataset.period === 'yearly') {
            label.classList.toggle('active', isYearly);
        } else {
            label.classList.toggle('active', !isYearly);
        }
    });
    
    prices.forEach(price => {
        const monthly = price.dataset.monthly;
        const yearly = price.dataset.yearly;
        price.textContent = isYearly ? yearly : monthly;
    });
}

function selectBoost(element, days, price) {
    document.querySelectorAll('.boost-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    element.classList.add('selected');
    selectedBoost = { days, price };
}

function buyBoost() {
    const modal = document.getElementById('payment-modal');
    const details = document.getElementById('boost-details');
    
    details.innerHTML = `
        <div style="background: var(--bg-secondary); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
            <p style="font-weight: 600;">Destaque por ${selectedBoost.days} dias</p>
            <p style="font-size: 1.5rem; font-weight: 800; color: var(--primary);">R$ ${selectedBoost.price.toFixed(2).replace('.', ',')}</p>
        </div>
    `;
    
    modal.classList.add('active');
    trackEvent('boost_modal_open', selectedBoost);
}

function closePaymentModal() {
    document.getElementById('payment-modal').classList.remove('active');
}

function processPayment() {
    const method = document.querySelector('input[name="payment"]:checked').value;
    
    // TODO: Integrar com Stripe
    alert(`Pagamento via ${method.toUpperCase()} será processado!\n\nEm breve será integrado com Stripe.`);
    
    closePaymentModal();
    trackEvent('payment_initiated', { method, ...selectedBoost });
}

// =====================================================
// TRACKING E ANALYTICS
// =====================================================

function trackAffiliate(partnerId) {
    console.log(`Affiliate click: ${partnerId}`);
    trackEvent('affiliate_click', { partner: partnerId });
}

function trackLead(instructorId) {
    console.log(`Lead generated for instructor: ${instructorId}`);
    registrarContato(instructorId, 'whatsapp');
    trackEvent('lead', { instructorId });
}

function trackEvent(eventName, data = {}) {
    console.log(`Event: ${eventName}`, data);
    // TODO: Integrar com Google Analytics
}

// =====================================================
// UI E INTERAÇÕES
// =====================================================

function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            faqItems.forEach(i => i.classList.remove('active'));
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

function initMasks() {
    // CPF
    const cpfInput = document.getElementById('cpf');
    if (cpfInput) {
        cpfInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.slice(0, 11);
            
            if (value.length > 9) {
                value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
            } else if (value.length > 6) {
                value = value.replace(/(\d{3})(\d{3})(\d{3})/, '$1.$2.$3');
            } else if (value.length > 3) {
                value = value.replace(/(\d{3})(\d{3})/, '$1.$2');
            }
            
            e.target.value = value;
        });
    }
    
    // Telefone
    const telInput = document.getElementById('telefone');
    if (telInput) {
        telInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.slice(0, 11);
            
            if (value.length > 6) {
                value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
            } else if (value.length > 2) {
                value = value.replace(/(\d{2})(\d{5})/, '($1) $2');
            }
            
            e.target.value = value;
        });
    }
    
    // CEP
    const cepInput = document.getElementById('cep');
    if (cepInput) {
        cepInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 8) value = value.slice(0, 8);
            
            if (value.length > 5) {
                value = value.replace(/(\d{5})(\d{3})/, '$1-$2');
            }
            
            e.target.value = value;
        });
    }
}

function initForm() {
    const form = document.getElementById('cadastro-form');
    if (form) {
        form.addEventListener('submit', handleCadastro);
    }
}

function showModal() {
    document.getElementById('success-modal').classList.add('active');
}

function closeModal() {
    document.getElementById('success-modal').classList.remove('active');
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function initHeaderScroll() {
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = 'var(--shadow-md)';
        } else {
            header.style.boxShadow = 'none';
        }
    });
}

function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('active');
}

function initAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    document.querySelectorAll('.step-card, .info-card, .instructor-card, .partner-card, .pricing-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.5s ease';
        observer.observe(el);
    });
}

function animateCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const count = parseInt(target.dataset.count);
                const duration = 2000;
                const step = count / (duration / 16);
                let current = 0;
                
                const timer = setInterval(() => {
                    current += step;
                    if (current >= count) {
                        target.textContent = count.toLocaleString('pt-BR');
                        if (target.parentElement.querySelector('.stat-label').textContent.includes('%')) {
                            target.textContent = count;
                        }
                        clearInterval(timer);
                    } else {
                        target.textContent = Math.floor(current).toLocaleString('pt-BR');
                    }
                }, 16);
                
                observer.unobserve(target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

// =====================================================
// INICIALIZAÇÃO
// =====================================================

document.addEventListener('DOMContentLoaded', async () => {
    // Carrega instrutores do banco
    instrutoresData = await fetchInstrutores();
    renderInstrutores(instrutoresData);
    
    // Inicializa componentes
    initFAQ();
    initMasks();
    initForm();
    initSmoothScroll();
    initHeaderScroll();
    initAnimations();
    animateCounters();
    
    // Seleciona boost padrão
    const defaultBoost = document.querySelector('.boost-option.popular');
    if (defaultBoost) defaultBoost.classList.add('selected');
    
    // Fecha modal ao clicar fora
    document.getElementById('success-modal')?.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal();
        }
    });
    
    document.getElementById('payment-modal')?.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closePaymentModal();
        }
    });
    
    // Track page view
    trackEvent('page_view', { page: 'home' });
    
    console.log('🚗 ConectaHabilitação v3.0 - Conectado ao Supabase');
});

// Expose functions to global scope
window.filterInstrutores = filterInstrutores;
window.resetFilters = resetFilters;
window.loadMore = loadMore;
window.togglePricing = togglePricing;
window.selectBoost = selectBoost;
window.buyBoost = buyBoost;
window.closePaymentModal = closePaymentModal;
window.processPayment = processPayment;
window.trackAffiliate = trackAffiliate;
window.showModal = showModal;
window.closeModal = closeModal;
window.toggleMobileMenu = toggleMobileMenu;
