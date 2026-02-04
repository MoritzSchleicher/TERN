export default function TermsPage() {
  return (
    <main className="prose mx-auto p-8">
      <h1>Datenschutzerklärung</h1>

      <p>
        Wir verarbeiten personenbezogene Daten nur, soweit dies für den Betrieb
        dieser Website erforderlich ist.
      </p>

      <h2>Verarbeitete Daten</h2>
      <ul>
        <li>E-Mail-Adresse (nur bei freiwilliger Angabe)</li>
        <li>Inhalte der eingereichten Fragen</li>
        <li>Technische Zugriffsdaten (z. B. IP-Adresse)</li>
      </ul>

      <h2>Zweck</h2>
      <ul>
        <li>Prüfung und ggf. Veröffentlichung der eingereichten Fragen</li>
        <li>Kontaktaufnahme bei Rückfragen oder Annahme</li>
      </ul>

      <h2>Speicherung</h2>
      <p>
        E-Mail-Adressen werden nur für die Dauer der Prüfung gespeichert und
        anschließend gelöscht.
      </p>

      <h2>Weitergabe</h2>
      <p>Es erfolgt keine Weitergabe an Dritte.</p>

      <h2>Rechte</h2>
      <p>
        Sie haben jederzeit das Recht auf Auskunft, Löschung und Widerruf Ihrer
        Einwilligung.
      </p>

      <p>
        Kontakt:{" "}
        <a href="mailto:hello@deine-domain.de">
          hello@deine-domain.de
        </a>
      </p>
    </main>
  );
}
