import { useState, useEffect, useCallback } from "react";
import "./index.css";


function getCurrentDate() {
  const d = new Date();
  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

function useCountdown(initialSeconds: number) {
  const [seconds, setSeconds] = useState(initialSeconds);
  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);
  const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return { h, m, s };
}

interface Notification {
  id: number;
  name: string;
  location: string;
  time: string;
}

const notifMessages = [
  { name: "Camila R.", location: "Belo Horizonte, MG", time: "há 2 min" },
  { name: "Patrícia S.", location: "São Paulo, SP", time: "há 5 min" },
  { name: "Ana C.", location: "Salvador, BA", time: "há 8 min" },
  { name: "Renata L.", location: "Brasília, DF", time: "há 12 min" },
  { name: "Fernanda M.", location: "Rio de Janeiro, RJ", time: "há 15 min" },
];

function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [index, setIndex] = useState(0);

  const add = useCallback(() => {
    const msg = notifMessages[index % notifMessages.length];
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, ...msg }]);
    setIndex((i) => i + 1);
    setTimeout(() => setNotifications((prev) => prev.filter((n) => n.id !== id)), 5000);
  }, [index]);

  useEffect(() => { const t = setTimeout(add, 2500); return () => clearTimeout(t); }, []);
  useEffect(() => { const t = setInterval(add, 11000); return () => clearInterval(t); }, [add]);

  return (
    <div className="notification-container">
      {notifications.map((n) => (
        <div key={n.id} className="notification">
          <div className="notification-icon">
            <i className="fas fa-check" />
          </div>
          <div>
            <div className="notification-name">{n.name}</div>
            <div className="notification-product">Ativou: App Dinâmicas de Inglês Pro</div>
            <div className="notification-location">{n.location} · {n.time}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

const faqs = [
  { q: "Como acesso o app?", a: "Logo após o pagamento você recebe um link no e-mail para criar sua conta e acessar imediatamente — pelo celular, tablet ou computador. Não precisa instalar nada." },
  { q: "O app serve para qual nível de ensino?", a: "Para todos! O conteúdo vai do 1º ano do Ensino Fundamental ao 3º ano do Ensino Médio, com dinâmicas organizadas por série e adaptadas ao vocabulário e gramática de cada etapa." },
  { q: "Posso cadastrar mais de uma turma?", a: "No Plano Essencial você cadastra até 2 turmas. No Plano Professor Pro as turmas são ilimitadas — ideal para quem leciona em várias escolas ou séries." },
  { q: "Preciso adaptar as dinâmicas?", a: "Não. Cada dinâmica já vem pronta para a série e habilidade selecionada. É só abrir o app, escolher e aplicar na aula." },
  { q: "Como funciona o acompanhamento de turma?", a: "Você registra quais dinâmicas aplicou em cada turma, e o app mostra o histórico, frequência de habilidades trabalhadas e sugestões para a próxima aula." },
  { q: "Como funciona a garantia?", a: "Você tem 7 dias para testar o app. Se não fizer sentido pra você, devolvemos 100% do seu dinheiro. Sem perguntas, sem burocracia." },
];

function FaqSection() {
  const [active, setActive] = useState<number | null>(null);
  return (
    <section className="faq">
      <div className="container">
        <h2 className="section-title">Perguntas Frequentes</h2>
        <div className="faq-list">
          {faqs.map((faq, i) => (
            <div key={i} className={`faq-item${active === i ? " active" : ""}`}>
              <div className="faq-question" onClick={() => setActive(active === i ? null : i)}>
                <h3>{faq.q}</h3>
                <i className="fas fa-chevron-down faq-chevron" />
              </div>
              <div className="faq-answer"><p>{faq.a}</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function UpgradePopup({ show, onClose }: { show: boolean; onClose: () => void }) {
  return (
    <div className={`popup-overlay${show ? " active" : ""}`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="popup-card">
        <button className="popup-close" onClick={onClose} aria-label="Fechar">
          <i className="fas fa-xmark" />
        </button>
        <h3 className="popup-title">Espere! Oferta Especial</h3>
        <p className="popup-subtitle">Ative o <strong>Plano Professor Pro</strong> com desconto exclusivo!</p>
        <div className="popup-price">
          <span className="popup-old-price">De R$97,00</span>
          <span className="popup-new-price">R$14,90</span>
        </div>
        <ul className="popup-benefits">
          <li>App completo — Fundamental ao Médio</li>
          <li>Turmas ilimitadas + acompanhamento</li>
          <li>Relatórios de desempenho por turma</li>
          <li>Sugestões automáticas de atividade</li>
          <li>Banco de atividades por série</li>
          <li>Atualizações mensais + Acesso vitalício</li>
        </ul>
        <div className="popup-buttons">
          <a href="https://pay.wiapy.com/1poJDNpVq" className="popup-btn popup-btn-accept">
            <i className="fas fa-cart-shopping" /> QUERO COMPRAR!
          </a>
          <a href="https://pay.wiapy.com/dKN7b1zMKv" className="popup-btn popup-btn-decline" onClick={onClose}>
            Continuar com o Básico
          </a>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [showPopup, setShowPopup] = useState(false);
  const countdown = useCountdown(1 * 3600 + 35 * 60 + 33);

  const scrollToPlans = () =>
    document.getElementById("plans")?.scrollIntoView({ behavior: "smooth" });

  return (
    <>
      {/* Urgency Banner */}
      <div className="urgency-banner">
        <div className="container">
          <h2 className="urgency-text">
            <i className="fas fa-tag" style={{ marginRight: 8 }} />
            DESCONTO SÓ HOJE{" "}
            <span className="date-highlight">{getCurrentDate()}</span>
          </h2>
        </div>
      </div>

      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              <span className="number-500">+350 Dinâmicas</span> Prontas para Aplicar na Sala{" "}
              <span className="bonus-text">+Bônus</span>
            </h1>
            <p className="hero-subtitle">
              Um <strong>APP completo</strong> com dinâmicas prontas,{" "}
              separadas por <strong>série e habilidade</strong>.
            </p>
            <div className="hero-image-wrapper">
              <img src="/apostila-hero-opt.jpg" alt="350 Dinâmicas de Inglês"
                className="hero-product-image" loading="eager" />
            </div>
            <button className="cta-button hero-cta" onClick={scrollToPlans}>
              <i className="fas fa-rocket" /> QUERO ACESSAR O APP!
            </button>
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="what-you-get">
        <div className="container">
          <h2 className="section-title">O Que Você Vai Receber</h2>
          <div className="benefits-grid">
            {[
              { icon: "fa-mobile-screen",   title: "App Completo",                    desc: "Acesse pelo celular, tablet ou computador — a qualquer hora, em qualquer lugar" },
              { icon: "fa-graduation-cap",  title: "Separado por Série",              desc: "Do 1º ano do Fundamental até o 3º ano do Médio, cada série com seu conteúdo próprio" },
              { icon: "fa-brain",           title: "Filtro por Habilidade",           desc: "Speaking, Listening, Reading, Writing e Grammar — encontre a atividade certa em segundos" },
              { icon: "fa-chart-line",      title: "Acompanhamento de Turma",         desc: "Monitore o progresso de cada turma específica e veja a evolução dos seus alunos" },
            ].map((item, i) => (
              <div key={i} className="benefit-card">
                <div className="benefit-icon">
                  <i className={`fas ${item.icon}`} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">Como Funciona</h2>
          <div className="steps-grid">
            {[
              { icon: "fa-rocket",             title: "Acesse o App",            desc: "Crie sua conta e entre imediatamente após o pagamento — no celular, tablet ou computador" },
              { icon: "fa-sliders",            title: "Selecione Série e Habilidade", desc: "Filtre por ano escolar e habilidade e encontre a dinâmica perfeita para a sua aula" },
              { icon: "fa-chalkboard-user",    title: "Aplique e Acompanhe",     desc: "Use a dinâmica em aula e registre o progresso de cada turma direto no app" },
            ].map((step, i) => (
              <div key={i} className="step-card">
                <div className="step-number">{i + 1}</div>
                <div className="step-icon">
                  <i className={`fas ${step.icon}`} />
                </div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bonus */}
      <section className="bonus-section">
        <div className="container">
          <h2 className="section-title">Ao Entrar Hoje, Você Também Recebe:</h2>
          <div className="bonus-grid">
            {[
              { img: "/flashcards-bonus.png", alt: "Banco de atividades",  title: "Banco de Atividades por Série",       value: "R$97", desc: "Centenas de exercícios organizados do 1º ano do Fundamental ao 3º ano do Médio" },
              { img: "/musicas-bonus.png",    alt: "Relatórios",           title: "Relatórios de Desempenho por Turma",  value: "R$67", desc: "Visualize a evolução de cada turma com gráficos claros e fáceis de interpretar" },
              { img: "/desenhos-bonus.png",   alt: "Sugestões",            title: "Sugestões Automáticas de Atividade",  value: "R$53", desc: "O app sugere a dinâmica ideal com base na série, habilidade e última atividade aplicada" },
              { img: "/certificado-bonus.png",alt: "Atualizações",         title: "Atualizações Mensais de Conteúdo",    value: "R$37", desc: "Novas dinâmicas adicionadas todo mês — seu app sempre atualizado sem custo extra" },
            ].map((bonus, i) => (
              <div key={i} className="bonus-card">
                <div className="bonus-image">
                  <img src={bonus.img} alt={bonus.alt} />
                </div>
                <h3>{bonus.title}</h3>
                <span className="bonus-value">{bonus.value}</span>
                <p>{bonus.desc}</p>
              </div>
            ))}
          </div>
          <div className="total-bonus">
            <h3>Total em Bônus: <span className="line-through">R$254</span> <span className="free">GRÁTIS HOJE!</span></h3>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="pricing-plans" id="plans">
        <div className="container">
          <div className="plans-timer">
            <div className="timer-text">
              <i className="fas fa-clock" style={{ marginRight: 6 }} />
              Oferta especial expira em:
            </div>
            <div className="countdown-plans">
              {[{ val: countdown.h, label: "Horas" }, { val: countdown.m, label: "Min" }, { val: countdown.s, label: "Seg" }].map((u) => (
                <div key={u.label} className="time-unit">
                  <span className="time-number">{u.val}</span>
                  <span className="time-label">{u.label}</span>
                </div>
              ))}
            </div>
          </div>

          <h2 className="section-title">Escolha Seu Plano</h2>
          <div className="plans-grid">
            {/* Basic */}
            <div className="plan-card">
              <h3>Plano Básico</h3>
              <div className="price">
                <span className="new-price">R$10,00</span>
                <span className="period">pagamento único</span>
              </div>
              <ul className="plan-features">
                <li><i className="fas fa-check check-icon" /> Dinâmicas em PDF</li>
                <li><i className="fas fa-check check-icon" /> Acesso imediato</li>
                <li><i className="fas fa-check check-icon" /> Garantia de 7 dias</li>
                <li className="no-benefit"><i className="fas fa-xmark times-icon" /> Sem acesso ao app</li>
                <li className="no-benefit"><i className="fas fa-xmark times-icon" /> Sem bônus</li>
              </ul>
              <button className="plan-button" onClick={() => setShowPopup(true)}>
                <i className="fas fa-cart-shopping" /> QUERO COMPRAR!
              </button>
            </div>

            {/* Premium */}
            <div className="plan-card popular">
              <div className="popular-badge">
                <i className="fas fa-star" style={{ marginRight: 5 }} /> MAIS ESCOLHIDO
              </div>
              <h3>Plano Premium</h3>
              <div className="price">
                <span className="old-price">R$97,00</span>
                <span className="new-price">R$19,90</span>
                <span className="period">pagamento único</span>
                <div className="savings-amount">Acesso completo + R$254 em bônus inclusos</div>
              </div>
              <div className="premium-social-proof">
                <p className="purchase-count">
                  <i className="fas fa-users" style={{ marginRight: 5 }} />
                  +1.736 professores já usam essa versão
                </p>
              </div>
              <ul className="plan-features">
                <li><i className="fas fa-check check-icon" /> Acesso ao app completo</li>
                <li><i className="fas fa-check check-icon" /> Dinâmicas por série e habilidade</li>
                <li><i className="fas fa-check check-icon" /> Turmas ilimitadas</li>
                <li><i className="fas fa-check check-icon" /> Acompanhamento individual de alunos</li>
                <li className="bonus-item"><i className="fas fa-gift gift-icon" /> BÔNUS: Relatórios de Desempenho por Turma</li>
                <li className="bonus-item"><i className="fas fa-gift gift-icon" /> BÔNUS: Sugestões Automáticas de Atividade</li>
                <li className="bonus-item"><i className="fas fa-gift gift-icon" /> BÔNUS: Banco de Atividades por Série</li>
                <li className="bonus-item"><i className="fas fa-gift gift-icon" /> BÔNUS: Atualizações Mensais de Conteúdo</li>
                <li><i className="fas fa-check check-icon" /> Acesso vitalício</li>
                <li><i className="fas fa-check check-icon" /> Garantia de 7 dias</li>
              </ul>
              <a href="https://pay.wiapy.com/XtxKw8AtE8" className="plan-button">
                <i className="fas fa-cart-shopping" /> QUERO COMPRAR!
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <div className="container">
          <h2 className="section-title">O Que Nossos Professores Dizem</h2>
          <div className="testimonials-grid">
            {[
              { img: "/depoimento-1.png", name: "Marina Costa",   role: "Professora de Inglês — 6º ao 9º ano, SP",        text: '"O app mudou completamente minha rotina. Filtro por série e habilidade em segundos, aplico na aula e ainda acompanho o que cada turma já trabalhou. Economizo horas toda semana."' },
              { img: "/depoimento-2.png", name: "Rafaela Mendes", role: "Professora de Inglês — Ensino Médio, RJ",         text: '"Estava procurando algo que funcionasse para o Médio e achei. As dinâmicas são separadas por série e fazem sentido com o que meus alunos estão vendo. Acabou o improviso!"' },
              { img: "/depoimento-3.png", name: "Fernanda Lima",  role: "Coordenadora de Inglês — Escola Pública, MG",     text: '"Implantamos o app em toda a escola e a diferença foi visível. Os professores têm material de qualidade para cada turma e os alunos ficaram muito mais engajados."' },
            ].map((t, i) => (
              <div key={i} className="testimonial-card">
                <div className="stars">★★★★★</div>
                <p>{t.text}</p>
                <div className="testimonial-author">
                  <img src={t.img} alt={t.name} className="testimonial-photo" />
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FaqSection />

      {/* Guarantee */}
      <section className="guarantee">
        <div className="container">
          <div className="guarantee-content">
            <div className="guarantee-badge">
              <i className="fas fa-shield-halved" />
              <div className="badge-text">
                <span className="badge-number">7</span>
                <span className="badge-label">DIAS</span>
              </div>
            </div>
            <h2>Garantia de 7 Dias</h2>
            <p>Teste por 7 dias. Se não fizer sentido pra você, devolvemos 100% do seu dinheiro. Sem perguntas.</p>
            <button className="cta-button guarantee-cta" onClick={scrollToPlans}>
              <i className="fas fa-lock" /> COMPRAR COM SEGURANÇA
            </button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta-section">
        <div className="container">
          <h2 className="final-cta-title">CHEGA DE IMPROVISAR. SEU APP DE INGLÊS ESTÁ PRONTO.</h2>
          <p className="final-cta-sub">Dinâmicas por série, acompanhamento de turma e muito mais — tudo no palmo da mão.</p>
          <button className="cta-button" onClick={scrollToPlans}>
            <i className="fas fa-rocket" /> QUERO ACESSAR O APP AGORA
          </button>
          <div className="delivery-info">
            <span><i className="fas fa-bolt" /> Acesso imediato</span>
            <span><i className="fas fa-mobile-screen" /> App para celular e computador</span>
            <span><i className="fas fa-envelope" /> Link de acesso no e-mail</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2026 Dinâmicas de Inglês — O App. Todos os direitos reservados.</p>
          <p>Plataforma digital licenciada para uso por professores em aulas individuais e instituições de ensino.</p>
        </div>
      </footer>

      <NotificationSystem />
      <UpgradePopup show={showPopup} onClose={() => setShowPopup(false)} />
    </>
  );
}
