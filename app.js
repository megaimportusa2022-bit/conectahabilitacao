/* =====================================================
   ConectaHabilitação - JavaScript v2.0
   ===================================================== */

// Dados mockados de instrutores
const instrutoresData = [
    {
        id: 1,
        nome: "Carlos Eduardo Silva",
        estado: "SP",
        cidade: "São Paulo - Zona Sul",
        categorias: ["B"],
        preco: 95,
        rating: 4.9,
        avaliacoes: 127,
        experiencia: "10+",
        veiculo: "Chevrolet Onix 2023",
        avatar: "👨‍🏫",
        premium: true,
        featured: true
    },
    {
        id: 2,
        nome: "Ana Paula Ferreira",
        estado: "SP",
        cidade: "Campinas",
        categorias: ["A", "B"],
        preco: 85,
        rating: 4.8,
        avaliacoes: 89,
        experiencia: "5-10",
        veiculo: "VW Polo + Honda CG",
        avatar: "👩‍🏫",
        premium: true,
        featured: false
    },
    {
        id: 3,
        nome: "Roberto Mendes",
        estado: "RJ",
        cidade: "Rio de Janeiro - Barra",
        categorias: ["B", "C"],
        preco: 120,
        rating: 5.0,
        avaliacoes: 203,
        experiencia: "10+",
        veiculo: "Toyota Corolla + Caminhão VW",
        avatar: "👨‍🏫",
        premium: true,
        featured: true
    },
    {
        id: 4,
        nome: "Mariana Costa",
        estado: "MG",
        cidade: "Belo Horizonte",
        categorias: ["B"],
        preco: 75,
        rating: 4.7,
        avaliacoes: 56,
        experiencia: "3-5",
        veiculo: "Hyundai HB20",
        avatar: "👩‍🏫",
        premium: false,
        featured: false
    },
    {
        id: 5,
        nome: "José Ricardo Santos",
        estado: "RS",
        cidade: "Porto Alegre",
        categorias: ["A", "B", "C"],
        preco: 90,
        rating: 4.9,
        avaliacoes: 142,
        experiencia: "10+",
        veiculo: "Fiat Argo + Yamaha + Mercedes",
        avatar: "👨‍🏫",
        premium: false,
        featured: false
    },
    {
        id: 6,
        nome: "Fernanda Lima",
        estado: "PR",
        cidade: "Curitiba",
        categorias: ["B"],
        preco: 80,
        rating: 4.6,
        avaliacoes: 78,
        experiencia: "3-5",
        veiculo: "Renault Kwid Automático",
        avatar: "👩‍🏫",
        premium: false,
        featured: false
    },
    {
        id: 7,
        nome: "Paulo Henrique Oliveira",
        estado: "SP",
        cidade: "Santo André - ABC",
        categorias: ["B", "D"],
        preco: 110,
        rating: 4.8,
        avaliacoes: 95,
        experiencia: "5-10",
        veiculo: "VW T-Cross + Micro-ônibus",
        avatar: "👨‍🏫",
        premium: false,
        featured: false
    },
    {
        id: 8,
        nome: "Luciana Martins",
        estado: "RJ",
        cidade: "Niterói",
        categorias: ["A"],
        preco: 70,
        rating: 4.9,
        avaliacoes: 64,
        experiencia: "5-10",
        veiculo: "Honda Bros 160",
        avatar: "👩‍🏫",
        premium: false,
        featured: false
    },
    {
        id: 9,
        nome: "André Luiz Pereira",
        estado: "SP",
        cidade: "Guarulhos",
        categorias: ["B", "C", "E"],
        preco: 130,
        rating: 5.0,
        avaliacoes: 178,
        experiencia: "10+",
        veiculo: "Fiat Mobi + Scania",
        avatar: "👨‍🏫",
        premium: false,
        featured: false
    }
];

let displayedCount = 6;
let selectedBoost = { days: 30, price: 79.90 };

// Ordenar instrutores (premium/featured primeiro)
function sortInstrutores(instrutores) {
    return [...instrutores].sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        if (a.premium && !b.premium) return -1;
        if (!a.premium && b.premium) return 1;
        return b.rating - a.rating;
    });
}

// Renderiza os cards de instrutores
function renderInstrutores(instrutores) {
    const grid = document.getElementById('instructors-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    const sorted = sortInstrutores(instrutores);
    
    sorted.slice(0, displayedCount).forEach(instrutor => {
        const card = document.createElement('div');
        card.className = `instructor-card${instrutor.premium ? ' premium' : ''}${instrutor.featured ? ' featured' : ''}`;
        card.innerHTML = `
            <div class="instructor-header">
                ${instrutor.premium ? '<span class="instructor-premium-badge">⭐ Premium</span>' : ''}
                <div class="instructor-avatar">${instrutor.avatar}</div>
                <h4>${instrutor.nome}</h4>
                <p class="instructor-location">📍 ${instrutor.cidade}, ${instrutor.estado}</p>
                <span class="instructor-verified">✓ Verificado</span>
            </div>
            <div class="instructor-body">
                <div class="instructor-rating">
                    <span class="stars">${'⭐'.repeat(Math.floor(instrutor.rating))}</span>
                    <strong>${instrutor.rating}</strong>
                    <span class="count">(${instrutor.avaliacoes} avaliações)</span>
                </div>
                <div class="instructor-categories">
                    ${instrutor.categorias.map(cat => `<span class="category-tag">Cat. ${cat}</span>`).join('')}
                </div>
                <div class="instructor-info">
                    <span class="instructor-price">R$ ${instrutor.preco}<span>/aula</span></span>
                    <span class="instructor-exp">🎓 ${instrutor.experiencia} anos</span>
                </div>
            </div>
            <div class="instructor-footer">
                <a href="https://wa.me/5511999999999?text=Olá! Vi seu perfil no ConectaHabilitação e gostaria de saber mais sobre suas aulas com ${instrutor.nome}." class="btn btn-primary" target="_blank" onclick="trackLead('${instrutor.id}')">
                    💬 Contato via WhatsApp
                </a>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Filtrar instrutores
function filterInstrutores() {
    const estado = document.getElementById('filter-estado').value;
    const categoria = document.getElementById('filter-categoria').value;
    const precoRange = document.getElementById('filter-preco').value;
    
    let filtered = [...instrutoresData];
    
    if (estado) {
        filtered = filtered.filter(i => i.estado === estado);
    }
    
    if (categoria) {
        filtered = filtered.filter(i => i.categorias.includes(categoria));
    }
    
    if (precoRange) {
        const [min, max] = precoRange.split('-').map(Number);
        filtered = filtered.filter(i => i.preco >= min && i.preco <= max);
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
    
    // Track filter usage
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

// Pricing Toggle
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

// Boost Selection
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
    
    // Simula processamento
    alert(`Pagamento via ${method.toUpperCase()} será processado!\n\nEm produção, aqui seria integrado com:\n- Stripe\n- Mercado Pago\n- PagSeguro`);
    
    closePaymentModal();
    trackEvent('payment_initiated', { method, ...selectedBoost });
}

// Affiliate Tracking
function trackAffiliate(partnerId) {
    console.log(`Affiliate click: ${partnerId}`);
    trackEvent('affiliate_click', { partner: partnerId });
    
    // Em produção, aqui redirecionaria para o link de afiliado com cookies
    // window.location.href = `https://parceiro.com/?ref=conectahabilitacao&utm_source=site`;
}

// Lead Tracking
function trackLead(instructorId) {
    console.log(`Lead generated for instructor: ${instructorId}`);
    trackEvent('lead', { instructorId });
    
    // Em produção, registraria o lead para cobrança (se modelo pay-per-lead)
}

// Generic Event Tracking
function trackEvent(eventName, data = {}) {
    console.log(`Event: ${eventName}`, data);
    
    // Em produção, enviaria para:
    // - Google Analytics 4
    // - Facebook Pixel
    // - Próprio backend
    
    // gtag('event', eventName, data);
    // fbq('track', eventName, data);
}

// FAQ Accordion
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Fecha todos
            faqItems.forEach(i => i.classList.remove('active'));
            
            // Abre o clicado se não estava ativo
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// Máscaras de input
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

// Formulário de cadastro
function initForm() {
    const form = document.getElementById('cadastro-form');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Validação básica
            const nome = document.getElementById('nome').value;
            const email = document.getElementById('email').value;
            const cpf = document.getElementById('cpf').value;
            
            if (!nome || !email || !cpf) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }
            
            // Verifica se pelo menos uma categoria foi selecionada
            const categorias = document.querySelectorAll('input[name="categorias"]:checked');
            if (categorias.length === 0) {
                alert('Selecione pelo menos uma categoria que você leciona.');
                return;
            }
            
            // Verifica termos
            const termos = document.getElementById('termos');
            if (!termos.checked) {
                alert('Você precisa aceitar os termos de uso.');
                return;
            }
            
            // Pega o plano selecionado
            const plano = document.querySelector('input[name="plano"]:checked').value;
            
            // Track signup
            trackEvent('signup', { plano });
            
            // Simula envio
            showModal();
            form.reset();
        });
    }
}

// Modal
function showModal() {
    document.getElementById('success-modal').classList.add('active');
}

function closeModal() {
    document.getElementById('success-modal').classList.remove('active');
}

// Scroll suave para seções
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

// Header scroll effect
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

// Mobile menu
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('active');
}

// Animações de entrada
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

// Animação de contagem dos números
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

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    renderInstrutores(instrutoresData);
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
