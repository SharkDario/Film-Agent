import { currentUser } from "@clerk/nextjs/server";

export async function checkIsAdmin() {
  const user = await currentUser();
  if (!user) return false;
  
  const userEmail = user.emailAddresses[0]?.emailAddress;
  if (!userEmail) return false;

  // Leemos los correos del archivo .env.local y eliminamos los espacios
  // Si no hay variable configurada, devolvemos false por seguridad
  const envAdmins = process.env.ADMIN_EMAILS;
  if (!envAdmins) return false;

  const allowedEmails = envAdmins.split(',').map(email => email.trim().toLowerCase());
  
  return allowedEmails.includes(userEmail.toLowerCase());
}
