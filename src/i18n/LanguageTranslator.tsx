import { useEffect } from 'react';
import type { FC } from 'react';
import { Language } from '../types';

type TranslatedLanguage = Exclude<Language, 'EN'>;
type PhraseTranslations = Record<TranslatedLanguage, string>;

const PHRASES: Record<string, PhraseTranslations> = {
  'Hi, welcome to Roly': { ES: 'Hola, bienvenido a Roly', FR: 'Bonjour, bienvenue chez Roly', DE: 'Hallo, willkommen bei Roly', IT: 'Ciao, benvenuto in Roly', PT: 'Olá, bem-vindo à Roly' },
  'Display prices': { ES: 'Mostrar precios', FR: 'Afficher les prix', DE: 'Preise anzeigen', IT: 'Mostra prezzi', PT: 'Mostrar preços' },
  'Search': { ES: 'Buscar', FR: 'Rechercher', DE: 'Suchen', IT: 'Cerca', PT: 'Pesquisar' },
  'Search...': { ES: 'Buscar...', FR: 'Rechercher...', DE: 'Suchen...', IT: 'Cerca...', PT: 'Pesquisar...' },
  'Search products': { ES: 'Buscar productos', FR: 'Rechercher des produits', DE: 'Produkte suchen', IT: 'Cerca prodotti', PT: 'Pesquisar produtos' },
  'No matching products': { ES: 'No hay productos coincidentes', FR: 'Aucun produit correspondant', DE: 'Keine passenden Produkte', IT: 'Nessun prodotto corrispondente', PT: 'Nenhum produto correspondente' },
  'Language': { ES: 'Idioma', FR: 'Langue', DE: 'Sprache', IT: 'Lingua', PT: 'Idioma' },
  'Toggle menu': { ES: 'Abrir o cerrar menú', FR: 'Ouvrir ou fermer le menu', DE: 'Menü öffnen oder schließen', IT: 'Apri o chiudi il menu', PT: 'Abrir ou fechar menu' },
  'Home': { ES: 'Inicio', FR: 'Accueil', DE: 'Startseite', IT: 'Home', PT: 'Início' },
  'Favourites': { ES: 'Favoritos', FR: 'Favoris', DE: 'Favoriten', IT: 'Preferiti', PT: 'Favoritos' },
  'Account': { ES: 'Cuenta', FR: 'Compte', DE: 'Konto', IT: 'Account', PT: 'Conta' },
  'Client area': { ES: 'Área de cliente', FR: 'Espace client', DE: 'Kundenbereich', IT: 'Area cliente', PT: 'Área do cliente' },
  'Cart': { ES: 'Carrito', FR: 'Panier', DE: 'Warenkorb', IT: 'Carrello', PT: 'Carrinho' },
  'Catalogue': { ES: 'Catálogo', FR: 'Catalogue', DE: 'Katalog', IT: 'Catalogo', PT: 'Catálogo' },
  'Customizer/Printing': { ES: 'Personalizador/Impresión', FR: 'Personnalisation/Impression', DE: 'Personalisierung/Druck', IT: 'Personalizzazione/Stampa', PT: 'Personalização/Impressão' },
  'Outlet': { ES: 'Outlet', FR: 'Outlet', DE: 'Outlet', IT: 'Outlet', PT: 'Outlet' },
  'Men': { ES: 'Hombre', FR: 'Homme', DE: 'Herren', IT: 'Uomo', PT: 'Homem' },
  'Women': { ES: 'Mujer', FR: 'Femme', DE: 'Damen', IT: 'Donna', PT: 'Mulher' },
  'Children': { ES: 'Niños', FR: 'Enfants', DE: 'Kinder', IT: 'Bambini', PT: 'Crianças' },
  'T-shirts': { ES: 'Camisetas', FR: 'T-shirts', DE: 'T-Shirts', IT: 'T-shirt', PT: 'T-shirts' },
  'Polo shirts': { ES: 'Polos', FR: 'Polos', DE: 'Poloshirts', IT: 'Polo', PT: 'Polos' },
  'Sweatshirts': { ES: 'Sudaderas', FR: 'Sweat-shirts', DE: 'Sweatshirts', IT: 'Felpe', PT: 'Sweatshirts' },
  'Fleece': { ES: 'Forros polares', FR: 'Polaires', DE: 'Fleece', IT: 'Pile', PT: 'Polartes' },
  'Coats': { ES: 'Abrigos', FR: 'Manteaux', DE: 'Jacken', IT: 'Cappotti', PT: 'Casacos' },
  'Pants': { ES: 'Pantalones', FR: 'Pantalons', DE: 'Hosen', IT: 'Pantaloni', PT: 'Calças' },
  'Sports': { ES: 'Deporte', FR: 'Sport', DE: 'Sport', IT: 'Sport', PT: 'Desporto' },
  'Workwear': { ES: 'Ropa laboral', FR: 'Vêtements de travail', DE: 'Arbeitskleidung', IT: 'Abbigliamento da lavoro', PT: 'Roupa de trabalho' },
  'Footwear': { ES: 'Calzado', FR: 'Chaussures', DE: 'Schuhe', IT: 'Calzature', PT: 'Calçado' },
  'Accessories': { ES: 'Accesorios', FR: 'Accessoires', DE: 'Accessoires', IT: 'Accessori', PT: 'Acessórios' },
  'The latest in Roly': { ES: 'Lo último en Roly', FR: 'Les nouveautés Roly', DE: 'Das Neueste von Roly', IT: 'Le novità di Roly', PT: 'As novidades da Roly' },
  "What you can't miss": { ES: 'Lo que no te puedes perder', FR: 'À ne pas manquer', DE: 'Was Sie nicht verpassen dürfen', IT: 'Da non perdere', PT: 'O que não pode perder' },
  'Featured in Roly': { ES: 'Destacados en Roly', FR: 'À la une chez Roly', DE: 'Highlights bei Roly', IT: 'In evidenza su Roly', PT: 'Destaques na Roly' },
  'Featured in Workwear': { ES: 'Destacados en ropa laboral', FR: 'À la une en vêtements de travail', DE: 'Highlights Arbeitskleidung', IT: 'In evidenza nell’abbigliamento da lavoro', PT: 'Destaques em roupa de trabalho' },
  'Upcoming Exhibitions 2026': { ES: 'Próximas ferias 2026', FR: 'Prochains salons 2026', DE: 'Kommende Messen 2026', IT: 'Prossime fiere 2026', PT: 'Próximas feiras 2026' },
  'The perfect uniform for the summer season.': { ES: 'El uniforme perfecto para el verano.', FR: 'La tenue parfaite pour la saison estivale.', DE: 'Die perfekte Uniform für den Sommer.', IT: 'L’uniforme perfetta per l’estate.', PT: 'O uniforme perfeito para o verão.' },
  'Comfortable workwear designed for warm working days.': { ES: 'Ropa laboral cómoda para los días de calor.', FR: 'Des vêtements de travail confortables pour les journées chaudes.', DE: 'Bequeme Arbeitskleidung für warme Arbeitstage.', IT: 'Abbigliamento da lavoro confortevole per le giornate calde.', PT: 'Roupa de trabalho confortável para dias quentes.' },
  'Attitude. Origin. Inspiration.': { ES: 'Actitud. Origen. Inspiración.', FR: 'Attitude. Origine. Inspiration.', DE: 'Haltung. Ursprung. Inspiration.', IT: 'Attitudine. Origine. Ispirazione.', PT: 'Atitude. Origem. Inspiração.' },
  'Discover our new collection': { ES: 'Descubre nuestra nueva colección', FR: 'Découvrez notre nouvelle collection', DE: 'Entdecken Sie unsere neue Kollektion', IT: 'Scopri la nostra nuova collezione', PT: 'Descubra a nossa nova coleção' },
  'Discover our latest collection': { ES: 'Descubre nuestra última colección', FR: 'Découvrez notre dernière collection', DE: 'Entdecken Sie unsere neueste Kollektion', IT: 'Scopri la nostra ultima collezione', PT: 'Descubra a nossa mais recente coleção' },
  'Discover the collection in motion.': { ES: 'Descubre la colección en movimiento.', FR: 'Découvrez la collection en mouvement.', DE: 'Entdecken Sie die Kollektion in Bewegung.', IT: 'Scopri la collezione in movimento.', PT: 'Descubra a coleção em movimento.' },
  'Uniforms made to perform.': { ES: 'Uniformes hechos para rendir.', FR: 'Des tenues conçues pour la performance.', DE: 'Uniformen für höchste Leistung.', IT: 'Uniformi pensate per le prestazioni.', PT: 'Uniformes feitos para o desempenho.' },
  'Safety, comfort and movement for every working day.': { ES: 'Seguridad, comodidad y movimiento para cada jornada.', FR: 'Sécurité, confort et mouvement au quotidien.', DE: 'Sicherheit, Komfort und Bewegungsfreiheit für jeden Arbeitstag.', IT: 'Sicurezza, comfort e movimento per ogni giornata di lavoro.', PT: 'Segurança, conforto e movimento para cada dia de trabalho.' },
  'New catalogues. Unlimited.': { ES: 'Nuevos catálogos. Sin límites.', FR: 'Nouveaux catalogues. Sans limites.', DE: 'Neue Kataloge. Unbegrenzt.', IT: 'Nuovi cataloghi. Senza limiti.', PT: 'Novos catálogos. Sem limites.' },
  'Explore every Roly collection.': { ES: 'Explora todas las colecciones Roly.', FR: 'Explorez toutes les collections Roly.', DE: 'Entdecken Sie jede Roly-Kollektion.', IT: 'Esplora tutte le collezioni Roly.', PT: 'Explore todas as coleções Roly.' },
  'Novelties': { ES: 'Novedades', FR: 'Nouveautés', DE: 'Neuheiten', IT: 'Novità', PT: 'Novidades' },
  'Meet the newest silhouettes and colours.': { ES: 'Descubre las nuevas siluetas y colores.', FR: 'Découvrez les nouvelles coupes et couleurs.', DE: 'Entdecken Sie die neuesten Formen und Farben.', IT: 'Scopri le nuove silhouette e i nuovi colori.', PT: 'Conheça as novas silhuetas e cores.' },
  'Sport collection': { ES: 'Colección deportiva', FR: 'Collection sport', DE: 'Sportkollektion', IT: 'Collezione sport', PT: 'Coleção desportiva' },
  'Jackets': { ES: 'Chaquetas', FR: 'Vestes', DE: 'Jacken', IT: 'Giacche', PT: 'Casacos' },
  'T-shirts and polo shirts': { ES: 'Camisetas y polos', FR: 'T-shirts et polos', DE: 'T-Shirts und Poloshirts', IT: 'T-shirt e polo', PT: 'T-shirts e polos' },
  'Footwear collection': { ES: 'Colección de calzado', FR: 'Collection de chaussures', DE: 'Schuhkollektion', IT: 'Collezione calzature', PT: 'Coleção de calçado' },
  'Shoes built for every step.': { ES: 'Calzado pensado para cada paso.', FR: 'Des chaussures conçues pour chaque pas.', DE: 'Schuhe für jeden Schritt.', IT: 'Scarpe pensate per ogni passo.', PT: 'Calçado pensado para cada passo.' },
  'Explore sports, casual and professional footwear with size-by-size stock availability.': { ES: 'Explora calzado deportivo, casual y profesional con stock por talla.', FR: 'Découvrez des chaussures sport, décontractées et professionnelles avec le stock par taille.', DE: 'Entdecken Sie Sport-, Freizeit- und Berufsschuhe mit Bestand je Größe.', IT: 'Esplora calzature sportive, casual e professionali con disponibilità per taglia.', PT: 'Explore calçado desportivo, casual e profissional com stock por tamanho.' },
  'DISCOVER': { ES: 'DESCUBRIR', FR: 'DÉCOUVRIR', DE: 'ENTDECKEN', IT: 'SCOPRI', PT: 'DESCOBRIR' },
  'DISCOVER ROLY': { ES: 'DESCUBRIR ROLY', FR: 'DÉCOUVRIR ROLY', DE: 'ROLY ENTDECKEN', IT: 'SCOPRI ROLY', PT: 'DESCOBRIR ROLY' },
  'DISCOVER WORKWEAR': { ES: 'DESCUBRIR ROPA LABORAL', FR: 'DÉCOUVRIR LES VÊTEMENTS DE TRAVAIL', DE: 'ARBEITSKLEIDUNG ENTDECKEN', IT: 'SCOPRI L’ABBIGLIAMENTO DA LAVORO', PT: 'DESCOBRIR ROUPA DE TRABALHO' },
  'DISCOVER FOOTWEAR': { ES: 'DESCUBRIR CALZADO', FR: 'DÉCOUVRIR LES CHAUSSURES', DE: 'SCHUHE ENTDECKEN', IT: 'SCOPRI LE CALZATURE', PT: 'DESCOBRIR CALÇADO' },
  'NOVELTIES': { ES: 'NOVEDADES', FR: 'NOUVEAUTÉS', DE: 'NEUHEITEN', IT: 'NOVITÀ', PT: 'NOVIDADES' },
  'START': { ES: 'EMPEZAR', FR: 'COMMENCER', DE: 'STARTEN', IT: 'INIZIA', PT: 'COMEÇAR' },
  'Product details': { ES: 'Detalles del producto', FR: 'Détails du produit', DE: 'Produktdetails', IT: 'Dettagli prodotto', PT: 'Detalhes do produto' },
  'Description': { ES: 'Descripción', FR: 'Description', DE: 'Beschreibung', IT: 'Descrizione', PT: 'Descrição' },
  'Colours': { ES: 'Colores', FR: 'Couleurs', DE: 'Farben', IT: 'Colori', PT: 'Cores' },
  'Sizes': { ES: 'Tallas', FR: 'Tailles', DE: 'Größen', IT: 'Taglie', PT: 'Tamanhos' },
  'Size': { ES: 'Talla', FR: 'Taille', DE: 'Größe', IT: 'Taglia', PT: 'Tamanho' },
  'Colour': { ES: 'Color', FR: 'Couleur', DE: 'Farbe', IT: 'Colore', PT: 'Cor' },
  'Quantity': { ES: 'Cantidad', FR: 'Quantité', DE: 'Menge', IT: 'Quantità', PT: 'Quantidade' },
  'Add to cart': { ES: 'Añadir al carrito', FR: 'Ajouter au panier', DE: 'In den Warenkorb', IT: 'Aggiungi al carrello', PT: 'Adicionar ao carrinho' },
  'In stock': { ES: 'En stock', FR: 'En stock', DE: 'Auf Lager', IT: 'Disponibile', PT: 'Em stock' },
  'Out of stock': { ES: 'Agotado', FR: 'Rupture de stock', DE: 'Nicht auf Lager', IT: 'Esaurito', PT: 'Esgotado' },
  'Shopping cart': { ES: 'Carrito de compra', FR: 'Panier', DE: 'Warenkorb', IT: 'Carrello', PT: 'Carrinho de compras' },
  'Your cart is empty': { ES: 'Tu carrito está vacío', FR: 'Votre panier est vide', DE: 'Ihr Warenkorb ist leer', IT: 'Il carrello è vuoto', PT: 'O seu carrinho está vazio' },
  'Continue shopping': { ES: 'Seguir comprando', FR: 'Continuer les achats', DE: 'Weiter einkaufen', IT: 'Continua gli acquisti', PT: 'Continuar a comprar' },
  'Checkout': { ES: 'Finalizar compra', FR: 'Commander', DE: 'Zur Kasse', IT: 'Pagamento', PT: 'Finalizar compra' },
  'Subtotal': { ES: 'Subtotal', FR: 'Sous-total', DE: 'Zwischensumme', IT: 'Subtotale', PT: 'Subtotal' },
  'Total': { ES: 'Total', FR: 'Total', DE: 'Gesamt', IT: 'Totale', PT: 'Total' },
  'Shipping': { ES: 'Envío', FR: 'Livraison', DE: 'Versand', IT: 'Spedizione', PT: 'Envio' },
  'Billing address': { ES: 'Dirección de facturación', FR: 'Adresse de facturation', DE: 'Rechnungsadresse', IT: 'Indirizzo di fatturazione', PT: 'Morada de faturação' },
  'Delivery address': { ES: 'Dirección de entrega', FR: 'Adresse de livraison', DE: 'Lieferadresse', IT: 'Indirizzo di consegna', PT: 'Morada de entrega' },
  'Place order': { ES: 'Realizar pedido', FR: 'Passer la commande', DE: 'Bestellung aufgeben', IT: 'Invia ordine', PT: 'Fazer pedido' },
  'Orders': { ES: 'Pedidos', FR: 'Commandes', DE: 'Bestellungen', IT: 'Ordini', PT: 'Encomendas' },
  'Order': { ES: 'Pedido', FR: 'Commande', DE: 'Bestellung', IT: 'Ordine', PT: 'Encomenda' },
  'Order tracking': { ES: 'Seguimiento del pedido', FR: 'Suivi de commande', DE: 'Sendungsverfolgung', IT: 'Tracciamento ordine', PT: 'Seguimento da encomenda' },
  'Documents': { ES: 'Documentos', FR: 'Documents', DE: 'Dokumente', IT: 'Documenti', PT: 'Documentos' },
  'Packing List': { ES: 'Lista de empaque', FR: 'Liste de colisage', DE: 'Packliste', IT: 'Lista di imballaggio', PT: 'Lista de embalagem' },
  'Delivery Note': { ES: 'Albarán', FR: 'Bon de livraison', DE: 'Lieferschein', IT: 'Documento di trasporto', PT: 'Guia de remessa' },
  'Invoice': { ES: 'Factura', FR: 'Facture', DE: 'Rechnung', IT: 'Fattura', PT: 'Fatura' },
  'Print': { ES: 'Imprimir', FR: 'Imprimer', DE: 'Drucken', IT: 'Stampa', PT: 'Imprimir' },
  'Download PDF': { ES: 'Descargar PDF', FR: 'Télécharger le PDF', DE: 'PDF herunterladen', IT: 'Scarica PDF', PT: 'Descarregar PDF' },
  'Close': { ES: 'Cerrar', FR: 'Fermer', DE: 'Schließen', IT: 'Chiudi', PT: 'Fechar' },
  'Cancel': { ES: 'Cancelar', FR: 'Annuler', DE: 'Abbrechen', IT: 'Annulla', PT: 'Cancelar' },
  'Save': { ES: 'Guardar', FR: 'Enregistrer', DE: 'Speichern', IT: 'Salva', PT: 'Guardar' },
  'Edit': { ES: 'Editar', FR: 'Modifier', DE: 'Bearbeiten', IT: 'Modifica', PT: 'Editar' },
  'Delete': { ES: 'Eliminar', FR: 'Supprimer', DE: 'Löschen', IT: 'Elimina', PT: 'Eliminar' },
  'Dashboard': { ES: 'Panel', FR: 'Tableau de bord', DE: 'Dashboard', IT: 'Dashboard', PT: 'Painel' },
  'Products': { ES: 'Productos', FR: 'Produits', DE: 'Produkte', IT: 'Prodotti', PT: 'Produtos' },
  'Categories': { ES: 'Categorías', FR: 'Catégories', DE: 'Kategorien', IT: 'Categorie', PT: 'Categorias' },
  'Users & Roles': { ES: 'Usuarios y roles', FR: 'Utilisateurs et rôles', DE: 'Benutzer und Rollen', IT: 'Utenti e ruoli', PT: 'Utilizadores e funções' },
  'Site Content': { ES: 'Contenido del sitio', FR: 'Contenu du site', DE: 'Website-Inhalte', IT: 'Contenuti del sito', PT: 'Conteúdo do site' },
  'Settings': { ES: 'Ajustes', FR: 'Paramètres', DE: 'Einstellungen', IT: 'Impostazioni', PT: 'Definições' },
  'Active': { ES: 'Activo', FR: 'Actif', DE: 'Aktiv', IT: 'Attivo', PT: 'Ativo' },
  'Inactive': { ES: 'Inactivo', FR: 'Inactif', DE: 'Inaktiv', IT: 'Inattivo', PT: 'Inativo' },
  'Name': { ES: 'Nombre', FR: 'Nom', DE: 'Name', IT: 'Nome', PT: 'Nome' },
  'Email': { ES: 'Correo electrónico', FR: 'E-mail', DE: 'E-Mail', IT: 'E-mail', PT: 'E-mail' },
  'Phone': { ES: 'Teléfono', FR: 'Téléphone', DE: 'Telefon', IT: 'Telefono', PT: 'Telefone' },
  'Address': { ES: 'Dirección', FR: 'Adresse', DE: 'Adresse', IT: 'Indirizzo', PT: 'Morada' },
  'Status': { ES: 'Estado', FR: 'Statut', DE: 'Status', IT: 'Stato', PT: 'Estado' },
  'Role': { ES: 'Rol', FR: 'Rôle', DE: 'Rolle', IT: 'Ruolo', PT: 'Função' },
  'All rights reserved.': { ES: 'Todos los derechos reservados.', FR: 'Tous droits réservés.', DE: 'Alle Rechte vorbehalten.', IT: 'Tutti i diritti riservati.', PT: 'Todos os direitos reservados.' },
  'Back to top': { ES: 'Volver arriba', FR: 'Retour en haut', DE: 'Nach oben', IT: 'Torna in alto', PT: 'Voltar ao topo' },
  'SERVICE': { ES: 'SERVICIO', FR: 'SERVICE', DE: 'SERVICE', IT: 'SERVIZIO', PT: 'SERVIÇO' },
  'COMPANY': { ES: 'EMPRESA', FR: 'ENTREPRISE', DE: 'UNTERNEHMEN', IT: 'AZIENDA', PT: 'EMPRESA' },
  'LEGAL': { ES: 'LEGAL', FR: 'MENTIONS LÉGALES', DE: 'RECHTLICHES', IT: 'LEGALE', PT: 'LEGAL' },
  'Virtual catalog': { ES: 'Catálogo virtual', FR: 'Catalogue virtuel', DE: 'Virtueller Katalog', IT: 'Catalogo virtuale', PT: 'Catálogo virtual' },
  'Size guide': { ES: 'Guía de tallas', FR: 'Guide des tailles', DE: 'Größentabelle', IT: 'Guida alle taglie', PT: 'Guia de tamanhos' },
  'Frequently asked questions': { ES: 'Preguntas frecuentes', FR: 'Questions fréquentes', DE: 'Häufig gestellte Fragen', IT: 'Domande frequenti', PT: 'Perguntas frequentes' },
  'Quality and certifications': { ES: 'Calidad y certificaciones', FR: 'Qualité et certifications', DE: 'Qualität und Zertifizierungen', IT: 'Qualità e certificazioni', PT: 'Qualidade e certificações' },
  'Contact us': { ES: 'Contáctanos', FR: 'Nous contacter', DE: 'Kontakt', IT: 'Contattaci', PT: 'Contacte-nos' },
  'Privacy policy': { ES: 'Política de privacidad', FR: 'Politique de confidentialité', DE: 'Datenschutzrichtlinie', IT: 'Informativa sulla privacy', PT: 'Política de privacidade' },
  'Terms and conditions': { ES: 'Términos y condiciones', FR: 'Conditions générales', DE: 'Allgemeine Geschäftsbedingungen', IT: 'Termini e condizioni', PT: 'Termos e condições' },
  'Cookies': { ES: 'Cookies', FR: 'Cookies', DE: 'Cookies', IT: 'Cookie', PT: 'Cookies' },
};

const textRecords = new WeakMap<Text, { original: string; rendered: string }>();
const attributeRecords = new WeakMap<Element, Map<string, { original: string; rendered: string }>>();
const TRANSLATABLE_ATTRIBUTES = ['placeholder', 'title', 'aria-label'] as const;

const translateValue = (value: string, language: Language) => {
  if (language === 'EN' || !value.trim()) return value;
  const leading = value.match(/^\s*/)?.[0] || '';
  const trailing = value.match(/\s*$/)?.[0] || '';
  const phrase = value.trim();
  const direct = PHRASES[phrase]?.[language];
  if (direct) return `${leading}${direct}${trailing}`;

  // Translate a few sentences that contain live order/product values.
  const noProduct = phrase.match(/^No product found for (.+)$/);
  if (noProduct) {
    const prefixes: Record<TranslatedLanguage, string> = { ES: 'No se encontró ningún producto para', FR: 'Aucun produit trouvé pour', DE: 'Kein Produkt gefunden für', IT: 'Nessun prodotto trovato per', PT: 'Nenhum produto encontrado para' };
    return `${leading}${prefixes[language]} ${noProduct[1]}${trailing}`;
  }

  // Translate a known phrase when React combines it with a live value in one text node.
  let translated = phrase;
  for (const [english, options] of Object.entries(PHRASES).sort(([a], [b]) => b.length - a.length)) {
    if (english.length < 5 || !translated.includes(english)) continue;
    translated = translated.replaceAll(english, options[language]);
  }
  return translated === phrase ? value : `${leading}${translated}${trailing}`;
};

const shouldSkip = (element: Element | null) => {
  if (!element) return true;
  if (element.closest('[data-no-translate]')) return true;
  return ['SCRIPT', 'STYLE', 'CODE', 'PRE', 'TEXTAREA'].includes(element.tagName) || (element as HTMLElement).isContentEditable;
};

const translateTextNode = (node: Text, language: Language) => {
  if (shouldSkip(node.parentElement)) return;
  const current = node.nodeValue || '';
  let record = textRecords.get(node);
  if (!record) {
    record = { original: current, rendered: current };
    textRecords.set(node, record);
  } else if (current !== record.rendered && current !== record.original) {
    record.original = current;
  }
  const next = translateValue(record.original, language);
  record.rendered = next;
  if (current !== next) node.nodeValue = next;
};

const translateAttributes = (element: Element, language: Language) => {
  if (shouldSkip(element)) return;
  let records = attributeRecords.get(element);
  if (!records) {
    records = new Map();
    attributeRecords.set(element, records);
  }
  TRANSLATABLE_ATTRIBUTES.forEach((attribute) => {
    const current = element.getAttribute(attribute);
    if (current === null) return;
    let record = records!.get(attribute);
    if (!record) {
      record = { original: current, rendered: current };
      records!.set(attribute, record);
    } else if (current !== record.rendered && current !== record.original) {
      record.original = current;
    }
    const next = translateValue(record.original, language);
    record.rendered = next;
    if (current !== next) element.setAttribute(attribute, next);
  });
};

const translateTree = (root: Node, language: Language) => {
  if (root.nodeType === Node.TEXT_NODE) {
    translateTextNode(root as Text, language);
    return;
  }
  if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_NODE && root.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) return;
  if (root.nodeType === Node.ELEMENT_NODE) translateAttributes(root as Element, language);
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    if (node.nodeType === Node.TEXT_NODE) translateTextNode(node as Text, language);
    else translateAttributes(node as Element, language);
    node = walker.nextNode();
  }
};

export const LanguageTranslator: FC<{ language: Language }> = ({ language }) => {
  useEffect(() => {
    document.documentElement.lang = language.toLowerCase();
    translateTree(document.body, language);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'characterData') translateTree(mutation.target, language);
        mutation.addedNodes.forEach((node) => translateTree(node, language));
        if (mutation.type === 'attributes') translateAttributes(mutation.target as Element, language);
      });
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: [...TRANSLATABLE_ATTRIBUTES] });
    return () => observer.disconnect();
  }, [language]);

  return null;
};
