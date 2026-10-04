import { z } from 'zod';

/** Schéma de validation du formulaire de contact (chargé à la demande : Zod ne pèse pas sur le chargement initial). */
export const schema = z.object({
  name: z.string().trim().min(2),
  email: z.email(),
  message: z.string().trim().min(10).max(4000),
});
