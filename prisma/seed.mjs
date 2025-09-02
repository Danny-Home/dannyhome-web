import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

async function upsertCategory(name, description = "") {
  const slug = slugify(name);
  const cat = await prisma.category.upsert({
    where: { slug },
    update: { name, description },
    create: { name, slug, description },
  });
  return cat;
}

async function createAttachment(url, filename, uploaderId = null) {
  const mimeType = url.endsWith(".png") ? "image/png" : "image/jpeg";
  const att = await prisma.attachment.create({
    data: {
      filename: filename ?? url.split("/").pop() ?? "image.jpg",
      mimeType,
      size: 0,
      storageKey: url, // placeholder
      url,
      uploaderId,
    },
  });
  return att;
}

async function linkAttachment(entityType, entityId, attachmentId, position = 0) {
  await prisma.attachmentEntityLink.create({
    data: { entityType, entityId, attachmentId, position },
  });
}

async function upsertProduct(input) {
  const slug = slugify(input.name);
  const category = input.categoryId
    ? { connect: { id: input.categoryId } }
    : { connect: { slug: input.categorySlug } };

  const sku = (slug.toUpperCase() + '-' + Math.random().toString(36).slice(2,8).toUpperCase());
  const p = await prisma.product.upsert({
    where: { slug },
    update: {
      name: input.name,
      description: input.description ?? null,
      price: input.price,
      defaultPrice: input.price,
      category: category,
    },
    create: { sku,
      name: input.name,
      slug,
      description: input.description ?? null,
      price: input.price,
      defaultPrice: input.price,
      category: category,
    },
  });

  if (input.imageUrl) {
    const att = await createAttachment(input.imageUrl, `${slug}.jpg`);
    await prisma.attachmentEntityLink.deleteMany({ where: { entityType: "Product", entityId: p.id } });
    await linkAttachment("Product", p.id, att.id, 0);
  }

  return p;
}

async function upsertBanner(input) {
  const title = input.title ?? null;
  const b = await prisma.banner.create({
    data: {
      title,
      position: "HERO",
      order: input.order ?? 0,
      linkUrl: input.linkUrl ?? "/shop",
      active: true,
    },
  });
  if (input.imageUrl) {
    const att = await createAttachment(input.imageUrl, `banner-${b.id}.jpg`);
    await linkAttachment("Banner", b.id, att.id, 0);
  }
  return b;
}

async function upsertCollection(input) {
  const slug = slugify(input.name);
  const c = await prisma.collection.upsert({
    where: { slug },
    update: {
      name: input.name,
      description: input.description ?? null,
      heroTitle: input.heroTitle ?? null,
      heroSubtitle: input.heroSubtitle ?? null,
      active: true,
    },
    create: {
      name: input.name,
      slug,
      description: input.description ?? null,
      heroTitle: input.heroTitle ?? null,
      heroSubtitle: input.heroSubtitle ?? null,
      active: true,
    },
  });

  // image
  if (input.imageUrl) {
    const att = await createAttachment(input.imageUrl, `${slug}.jpg`);
    await prisma.attachmentEntityLink.deleteMany({ where: { entityType: "Collection", entityId: c.id } });
    await linkAttachment("Collection", c.id, att.id, 0);
  }

  // products
  if (input.productIds?.length) {
    await prisma.collectionProduct.deleteMany({ where: { collectionId: c.id } });
    await prisma.collectionProduct.createMany({
      data: input.productIds.map((pid, i) => ({
        collectionId: c.id,
        productId: pid,
        position: i,
      })),
    });
  }

  return c;
}

async function main() {
  console.log("Seeding…");

  // Categories
  const cats = await Promise.all([
    upsertCategory("Living", "Sala y decoración"),
    upsertCategory("Bedroom", "Dormitorio"),
    upsertCategory("Kitchen", "Cocina"),
    upsertCategory("Bath", "Baño"),
    upsertCategory("Outdoor", "Exterior"),
    upsertCategory("Workspace", "Oficina"),
  ]);
  const catBySlug = Object.fromEntries(cats.map((c) => [c.slug, c]));

  // Products (example images from Unsplash CDN placeholders)
  const sampleProducts = [
    { name: "Sofá modular Neo", price: 2499, categorySlug: "living", imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1200" },
    { name: "Lámpara Arc", price: 199, categorySlug: "living", imageUrl: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200" },
    { name: "Silla Lounge Alba", price: 399, categorySlug: "living", imageUrl: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1200" },
    { name: "Juego de sábanas Percal", price: 129, categorySlug: "bedroom", imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200" },
    { name: "Cubre edredón Lino", price: 179, categorySlug: "bedroom", imageUrl: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200" },
    { name: "Mesa de noche Bloc", price: 149, categorySlug: "bedroom", imageUrl: "https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?q=80&w=1200" },
    { name: "Cubertería Acero 24p", price: 89, categorySlug: "kitchen", imageUrl: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1200" },
    { name: "Juego de platos Stone", price: 139, categorySlug: "kitchen", imageUrl: "https://images.unsplash.com/photo-1549488344-6aef68f5d8fc?q=80&w=1200" },
    { name: "Toalla Bath XXL", price: 39, categorySlug: "bath", imageUrl: "https://images.unsplash.com/photo-1582582429416-0973c9ecf403?q=80&w=1200" },
    { name: "Espejo Antifog", price: 59, categorySlug: "bath", imageUrl: "https://images.unsplash.com/photo-1493666438817-866a91353ca9?q=80&w=1200" },
    { name: "Silla exterior Teak", price: 229, categorySlug: "outdoor", imageUrl: "https://images.unsplash.com/photo-1549187774-b4e9b0445b41?q=80&w=1200" },
    { name: "Escritorio Compact", price: 299, categorySlug: "workspace", imageUrl: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200" },
  ];

  const products = [];
  for (const sp of sampleProducts) {
    const p = await upsertProduct({
      name: sp.name,
      description: "Producto de ejemplo para pruebas de UI",
      price: sp.price,
      categorySlug: sp.categorySlug,
      imageUrl: sp.imageUrl,
    });
    products.push(p);
  }

  // Banners
  await prisma.banner.deleteMany({});
  await Promise.all([
    upsertBanner({ title: "Nueva colección 2025", linkUrl: "/shop", order: 0, imageUrl: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1600" }),
    upsertBanner({ title: "Rebajas de temporada", linkUrl: "/shop", order: 1, imageUrl: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1600" }),
  ]);

  // Collections
  const coll1 = await upsertCollection({
    name: "Esenciales minimalistas",
    description: "Selección limpia y funcional",
    heroTitle: "Esenciales minimalistas",
    heroSubtitle: "Curado por nuestro equipo de diseño",
    imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1600",
    productIds: products.slice(0, 6).map((p) => p.id),
  });

  const coll2 = await upsertCollection({
    name: "Novedades",
    description: "Lo último en llegar",
    imageUrl: "https://images.unsplash.com/photo-1549187774-b4e9b0445b41?q=80&w=1600",
    productIds: products.slice(6, 12).map((p) => p.id),
  });

  console.log("Seeded categories:", cats.length);
  console.log("Seeded products:", products.length);
  console.log("Seeded collections:", coll1.slug, coll2.slug);
  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
