import { ArrowUpRight, Heart, Leaf, Handshake, ShoppingBasket, Sprout } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  return <>
    <section className="page-intro editorial-intro"><div><p className="eyebrow"><span className="tiny-dot" /> QUIÉNES SOMOS</p><h1>Cerca de ti.<br /><span>En lo cotidiano.</span></h1><p className="intro-copy">Creemos que un buen supermercado empieza con algo simple:<br className="desktop-break" /> cuidar a las personas que lo hacen posible.</p></div><div className="about-art" aria-hidden="true"><ShoppingBasket size={110} strokeWidth={1} /><span>de nuestro barrio,<br />para tu mesa.</span><Sprout size={50} strokeWidth={1.3} /></div></section>
    <section className="story-section"><div><p className="eyebrow">NUESTRA ESENCIA</p><h2>Un mercado de barrio.<br />Una manera de hacer las cosas.</h2></div><div className="story-copy"><p>Mercadito es un supermercado pensado para acompañar las compras de todos los días. Reunimos productos frescos, alimentos esenciales y una atención cercana en un espacio donde comprar se siente sencillo.</p><p>Detrás de cada estante hay un equipo que revisa, organiza y repone. Por eso, nuestro sistema de inventario nos ayuda a conocer las existencias de cada tienda y a detectar los productos que necesitan atención.</p><span className="handwritten">Los pequeños cuidados hacen la diferencia.</span></div></section>
    <section className="values-grid" aria-label="Nuestros valores">{[
      { icon: Leaf, title: 'Frescura que se cuida', text: 'Revisamos nuestras existencias para planificar la reposición y mantener una oferta de productos frescos.', tone: 'sage', number: '01' },
      { icon: Heart, title: 'Personas primero', text: 'Escuchamos a nuestros vecinos y trabajamos para que cada visita sea cercana, amable y sencilla.', tone: 'peach', number: '02' },
      { icon: Handshake, title: 'Compromiso de barrio', text: 'Valoramos a nuestro equipo, a los proveedores y a la comunidad que da vida a cada tienda.', tone: 'yellow', number: '03' },
    ].map(({ icon: Icon, title, text, tone, number }) => <article className="value-card" key={title}><div className="value-top"><span className={`icon-tile ${tone}`}><Icon size={25} /></span><span>{number}</span></div><h3>{title}</h3><p>{text}</p></article>)}</section>
    <section className="about-cta"><div><p className="eyebrow">NOS VEMOS EN EL BARRIO</p><h2>Hay un Mercadito cerca de ti.</h2><p>Conoce nuestras tres tiendas y sus horarios de atención.</p></div><Link className="button dark" to="/tiendas">Conocer nuestras tiendas<ArrowUpRight size={19} /></Link></section>
  </>;
}
