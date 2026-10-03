type GoatCounter = { count: (o: { path: string; title?: string; event?: boolean }) => void };

/** Événement de conversion GoatCounter (sans cookie). Sans effet si le script n'est pas chargé. */
export function track(event: string) {
  try {
    const gc = (window as unknown as { goatcounter?: GoatCounter }).goatcounter;
    gc?.count({ path: event, title: event, event: true });
  } catch { /* mesure facultative */ }
}
