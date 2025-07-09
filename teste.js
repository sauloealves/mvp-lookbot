import { PrismaClient } from  './generated/prisma/client.js';
const prisma = new PrismaClient();

async function main() {
  console.log(Object.keys(prisma)); // agora deve mostrar os modelos do banco
  const lojas = await prisma.loja.findMany();
  console.log(lojas);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());