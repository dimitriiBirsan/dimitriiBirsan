// All actions below are local demonstrations with synthetic values.
export const patterns = [
  {
    id: 'daily-streak',
    name: { en: 'Daily streak pressure', it: 'Pressione della serie giornaliera' },
    category: 'Nagging',
    explanation: {
      en: 'Loss-aversion copy turns an optional visit into an obligation.',
      it: 'La paura di perdere i progressi trasforma una visita facoltativa in un obbligo.',
    },
    demo: {
      en: 'Come back tomorrow or lose all your progress.',
      it: 'Torna domani o perderai tutti i tuoi progressi.',
    },
    action: { en: 'Skip a day', it: 'Salta un giorno' },
    result: {
      en: 'The demo resets your streak. The underlying work was never lost; only the reward was withheld.',
      it: 'La demo azzera la serie. Il lavoro svolto non era perso: viene tolta soltanto la ricompensa.',
    },
    ethical: {
      en: 'Your progress is saved. Return whenever it suits you.',
      it: 'I tuoi progressi sono salvati. Torna quando preferisci.',
    },
  },
  {
    id: 'action-points',
    name: { en: 'Artificial resource limits', it: 'Limiti artificiali alle azioni' },
    category: 'Forced action',
    explanation: {
      en: 'An artificial allowance makes a basic action depend on payment or waiting.',
      it: 'Un limite artificiale vincola un’azione di base a un pagamento o a un’attesa.',
    },
    demo: {
      en: 'No action points left. Buy more to view your report.',
      it: 'Punti azione esauriti. Acquistane altri per vedere il report.',
    },
    action: { en: 'Open the report', it: 'Apri il report' },
    result: {
      en: 'Access is blocked by an invented resource limit, not a technical constraint.',
      it: 'L’accesso è bloccato da un limite inventato, non da un vincolo tecnico.',
    },
    ethical: {
      en: 'Open your report. Any real usage limits are explained before you choose a plan.',
      it: 'Apri il report. Eventuali limiti reali sono spiegati prima della scelta del piano.',
    },
  },
  {
    id: 'artificial-loading',
    name: { en: 'Artificial processing delays', it: 'Attese artificiali' },
    category: 'Interface interference',
    explanation: {
      en: 'A fake loading state makes a trivial operation appear more valuable.',
      it: 'Un caricamento fittizio fa sembrare più importante un’operazione banale.',
    },
    demo: { en: 'Preparing your result…', it: 'Preparazione del risultato…' },
    action: { en: 'Reveal the result', it: 'Mostra il risultato' },
    result: {
      en: 'The result was available immediately. A delay would have added no useful work.',
      it: 'Il risultato era subito disponibile. L’attesa non avrebbe aggiunto alcuna elaborazione utile.',
    },
    ethical: {
      en: 'Show results as soon as they are ready. Explain delays only when processing actually takes time.',
      it: 'Mostra i risultati appena pronti. Spiega le attese solo quando l’elaborazione richiede davvero tempo.',
    },
  },
  {
    id: 'shadow-progress',
    name: { en: 'Unreachable progress', it: 'Progresso irraggiungibile' },
    category: 'Obstruction',
    explanation: {
      en: 'A nearly complete progress indicator conceals an additional requirement.',
      it: 'Un indicatore quasi completo nasconde un requisito aggiuntivo.',
    },
    demo: {
      en: 'Setup 98% complete. One last step…',
      it: 'Configurazione completata al 98%. Un ultimo passaggio…',
    },
    action: { en: 'Finish setup', it: 'Completa la configurazione' },
    result: {
      en: 'An upgrade is suddenly required. The percentage concealed a condition instead of measuring completion.',
      it: 'Compare l’obbligo di un upgrade. La percentuale nascondeva una condizione invece di misurare il completamento.',
    },
    ethical: {
      en: 'Show the complete checklist and any paid requirements before setup begins.',
      it: 'Mostra tutti i passaggi e gli eventuali requisiti a pagamento prima di iniziare.',
    },
  },
  {
    id: 'gacha-system',
    name: { en: 'Chance-based feature access', it: 'Funzionalità sbloccate a sorte' },
    category: 'Sneaking',
    explanation: {
      en: 'A random reward mechanism obscures the price of a normal product feature.',
      it: 'Una ricompensa casuale nasconde il prezzo di una normale funzionalità.',
    },
    demo: { en: 'Spin to unlock CSV export.', it: 'Tenta la fortuna per sbloccare l’esportazione CSV.' },
    action: { en: 'Try a spin', it: 'Prova un giro' },
    result: {
      en: 'You receive a different feature. This demonstration always withholds export to expose the incentive to try again.',
      it: 'Ricevi una funzionalità diversa. La demo non concede mai l’esportazione, per mostrare l’incentivo a riprovare.',
    },
    ethical: {
      en: 'State whether CSV export is included and show its price directly.',
      it: 'Indica se l’esportazione CSV è inclusa e mostra direttamente il suo prezzo.',
    },
  },
  {
    id: 'currency-confusion',
    name: { en: 'Currency confusion', it: 'Confusione tra valute' },
    category: 'Sneaking',
    explanation: {
      en: 'Multiple conversion steps make the real price harder to compare.',
      it: 'Più passaggi di conversione rendono difficile confrontare il prezzo reale.',
    },
    demo: {
      en: 'An export costs 40 gems. Buy 100 credits for €10; 2 credits buy 1 gem.',
      it: 'Un’esportazione costa 40 gemme. Compra 100 crediti per 10 €; 2 crediti valgono 1 gemma.',
    },
    action: { en: 'Calculate the price', it: 'Calcola il prezzo' },
    result: {
      en: '40 gems = 80 credits = €8. The minimum €10 purchase leaves €2 tied up in credits.',
      it: '40 gemme = 80 crediti = 8 €. L’acquisto minimo di 10 € lascia 2 € in crediti inutilizzati.',
    },
    ethical: {
      en: 'Export: €8. Show the real price and allow the exact amount to be purchased.',
      it: 'Esportazione: 8 €. Mostra il prezzo reale e consenti di acquistare l’importo esatto.',
    },
  },
  {
    id: 'confirm-shaming',
    name: { en: 'Confirmshaming', it: 'Rifiuto colpevolizzante' },
    category: 'Social engineering',
    explanation: {
      en: 'A decline option judges the person instead of describing their choice.',
      it: 'L’opzione di rifiuto giudica la persona invece di descrivere la scelta.',
    },
    demo: { en: 'Subscribe to updates?', it: 'Vuoi ricevere aggiornamenti?' },
    action: { en: 'No, I prefer to stay uninformed', it: 'No, preferisco restare disinformato' },
    result: {
      en: 'You declined. The wording added social pressure to a simple preference.',
      it: 'Hai rifiutato. Il testo aggiungeva pressione sociale a una semplice preferenza.',
    },
    ethical: {
      en: 'Use a neutral choice: “No thanks”. Accept declining without further prompts.',
      it: 'Usa una scelta neutra: “No, grazie”. Accetta il rifiuto senza ulteriori richieste.',
    },
  },
  {
    id: 'social-proof',
    name: { en: 'Fabricated social proof', it: 'Riprova sociale inventata' },
    category: 'Social engineering',
    explanation: {
      en: 'Invented activity creates the impression that other people are buying.',
      it: 'Attività inventate danno l’impressione che altre persone stiano acquistando.',
    },
    demo: {
      en: 'Someone nearby just upgraded.',
      it: 'Una persona nelle vicinanze ha appena effettuato l’upgrade.',
    },
    action: { en: 'Inspect the claim', it: 'Verifica l’affermazione' },
    result: {
      en: 'There is no purchase record or location lookup. This message is hard-coded demonstration copy.',
      it: 'Non esistono registrazioni di acquisti o verifiche della posizione. Il messaggio è testo fisso della demo.',
    },
    ethical: {
      en: 'Use attributable evidence with permission, or omit the claim.',
      it: 'Usa prove verificabili con il dovuto permesso, oppure ometti l’affermazione.',
    },
  },
  {
    id: 'fake-banner',
    name: { en: 'Deceptive consent', it: 'Consenso ingannevole' },
    category: 'Interface interference',
    explanation: {
      en: 'A reject button that accepts tracking contradicts the choice it presents.',
      it: 'Un pulsante di rifiuto che accetta il tracciamento contraddice la scelta proposta.',
    },
    demo: { en: 'Allow optional analytics?', it: 'Vuoi consentire le analisi facoltative?' },
    action: { en: 'Reject optional analytics', it: 'Rifiuta le analisi facoltative' },
    result: {
      en: 'A deceptive implementation would record “accepted”. This demo records nothing; it shows the mismatch.',
      it: 'Un’implementazione ingannevole registrerebbe “accettato”. La demo non registra nulla: mostra la contraddizione.',
    },
    ethical: {
      en: 'Respect the selected option. Make accepting and rejecting equally clear.',
      it: 'Rispetta l’opzione scelta. Rendi accettazione e rifiuto ugualmente chiari.',
    },
  },
  {
    id: 'actual-unsubscribe',
    name: { en: 'Obstructed cancellation', it: 'Cancellazione ostacolata' },
    category: 'Obstruction',
    explanation: {
      en: 'Additional conditions make leaving harder than signing up.',
      it: 'Condizioni aggiuntive rendono l’uscita più difficile dell’iscrizione.',
    },
    demo: { en: 'Manage your subscription.', it: 'Gestisci il tuo abbonamento.' },
    action: { en: 'Unsubscribe', it: 'Annulla l’iscrizione' },
    result: {
      en: 'The flow asks for a paid upgrade before cancellation. That condition creates an unnecessary barrier to leaving.',
      it: 'Il flusso chiede un upgrade a pagamento prima della cancellazione. Questa condizione crea un ostacolo inutile all’uscita.',
    },
    ethical: {
      en: 'Provide a visible cancellation action and a clear confirmation of when it takes effect.',
      it: 'Fornisci un’azione di cancellazione visibile e conferma chiaramente quando avrà effetto.',
    },
  },
];
